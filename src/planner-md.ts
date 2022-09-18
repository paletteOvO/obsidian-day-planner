import { DAY_PLANNER_DEFAULT_CONTENT, MERMAID_REGEX } from "./constants";
import { DayPlannerSettings, NoteForDateQuery } from "./settings";
import { MarkdownView, Workspace } from "obsidian";

import type { PlanItem, PlanSummaryData } from "./plan-data";

import type DayPlannerFile from "./file";
import type Parser from "./parser";
import PlannerMermaid from "./mermaid";
import type Progress from "./progress";

export default class PlannerMarkdown {
  workspace: Workspace;
  dayPlannerLastEdit: number;
  settings: DayPlannerSettings;
  file: DayPlannerFile;
  parser: Parser;
  progress: Progress;
  mermaid: PlannerMermaid;
  noteForDateQuery: NoteForDateQuery;

  constructor(
    workspace: Workspace,
    settings: DayPlannerSettings,
    file: DayPlannerFile,
    parser: Parser,
    progress: Progress
  ) {
    this.workspace = workspace;
    this.settings = settings;
    this.file = file;
    this.parser = parser;
    this.progress = progress;
    this.mermaid = new PlannerMermaid(this.progress);
    this.noteForDateQuery = new NoteForDateQuery();
  }

  async insertPlanner() {
    const filePath = this.file.todayPlannerFilePath();

    const fileContents = (await this.file.getFileContents(filePath)).split(
      "\n"
    );
    const view = this.workspace.activeLeaf.view as MarkdownView;
    const currentLine = view.editor.getCursor().line;
    const insertResult = [
      ...fileContents.slice(0, currentLine),
      ...DAY_PLANNER_DEFAULT_CONTENT.split("\n"),
      ...fileContents.slice(currentLine),
    ];
    this.file.updateFile(filePath, insertResult.join("\n"));
  }

  async parseDayPlanner(filePath: string): Promise<PlanSummaryData> {
    try {
      const fileContent = (await this.file.getFileContents(filePath)).split(
        "\n"
      );
      const planContent = [];
      let state = "stop";
      let offset = 0;
      if (this.settings.plannerStartIdentifier == "") {
        state = "start";
      }
      for (let i = 0; i < fileContent.length; i++) {
        const line = fileContent[i];
        if (
          this.settings.plannerEndIdentifier != "" &&
          line.startsWith(this.settings.plannerEndIdentifier)
        ) {
          break;
        }
        if (state == "start") {
          planContent.push(line);
        } else if (
          this.settings.plannerStartIdentifier != "" &&
          line.startsWith(this.settings.plannerStartIdentifier)
        ) {
          state = "start";
          planContent.push(line);
          offset = i;
        }
      }
      const planData = await this.parser.parseMarkdown(planContent, offset);
      return planData;
    } catch (error) {
      console.log(error);
    }
  }

  async updateDayPlannerMarkdown(
    filePath: string,
    planSummary: PlanSummaryData
  ) {
    try {
      const fileContents = await this.file.getFileContents(filePath);
      const fileContentsArr = fileContents.split("\n");
      planSummary.calculate();
      if (planSummary.empty) {
        return;
      }

      planSummary.items.forEach((item) => {
        const result = this.updateItemCompletion(item, item.isPast);
        fileContentsArr[item.matchIndex] = result;
      });

      const fileContentsWithReplacedMermaid = this.replaceMermaid(
        fileContentsArr.join("\n"),
        planSummary
      );
      const fileContentsArrWithReplacedMermaid =
        fileContentsWithReplacedMermaid.split("\n");

      if (fileContents !== fileContentsWithReplacedMermaid) {
        const active_view = this.workspace.getActiveViewOfType(MarkdownView);
        let diffIndex = undefined as number | undefined;
        if (active_view !== null && active_view.file.path == filePath) {
          const doc = active_view.editor.getDoc();
          const pos = doc.getCursor();
          const minLength = Math.min(
            fileContentsArr.length,
            fileContentsArrWithReplacedMermaid.length
          );
          for (let i = 0; i < minLength; i++) {
            if (fileContentsArr[i] !== fileContentsArrWithReplacedMermaid[i]) {
              diffIndex = i;
              break;
            }
          }

          if (diffIndex !== undefined) {
            this.file.updateFile(filePath, fileContentsWithReplacedMermaid);
            return;
          }

          if (diffIndex < pos.line) {
            pos.line +=
              fileContentsArrWithReplacedMermaid.length -
              fileContentsArr.length;
          }

          active_view.editor.getDoc().setValue(fileContentsWithReplacedMermaid);
          doc.setCursor(pos.line, pos.ch);
        } else {
          this.file.updateFile(filePath, fileContentsWithReplacedMermaid);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  private replaceMermaid(input: string, planSummary: PlanSummaryData): string {
    const mermaidResult = this.settings.mermaid
      ? this.mermaid.generate(planSummary) + "\n\n"
      : "";

    const noMatch = input.match(MERMAID_REGEX) === null;
    if (noMatch) {
      return input.replace(
        `${this.settings.mermaidIdentifier}\n`,
        `${this.settings.mermaidIdentifier}\n${mermaidResult}`
      );
    }
    const replaced = input.replace(MERMAID_REGEX, mermaidResult);

    return replaced;
  }

  private updateItemCompletion(item: PlanItem, complete: boolean) {
    let check = this.check(complete);
    // Override to use current (user inputted) state if plugin setting is enabled
    if (!this.settings.completePastItems) {
      check = this.check(item.isCompleted);
    }
    return item.raw.replace(/\[[x ]\]/, `[${check}]`);
  }

  private check(check: boolean) {
    return check ? "x" : " ";
  }

  checkIsDayPlannerEditing() {
    const activeLeaf = this.workspace.activeLeaf;
    if (!activeLeaf) {
      return;
    }
    const viewState = activeLeaf.view.getState();
    if (viewState.file === this.file.todayPlannerFilePath()) {
      this.dayPlannerLastEdit = new Date().getTime();
    }
  }
}

import { App, Notice, Vault, normalizePath } from "obsidian";
import {
  DayPlannerMode,
  DayPlannerSettings,
  NoteForDateQuery,
} from "./settings";

import { DAY_PLANNER_DEFAULT_CONTENT } from "./constants";
import MomentDateRegex from "./moment-date-regex";

export default class DayPlannerFile {
  app: App;
  vault: Vault;
  settings: DayPlannerSettings;
  momentDateRegex: MomentDateRegex;
  noteForDateQuery: NoteForDateQuery;

  constructor(app: App, vault: Vault, settings: DayPlannerSettings) {
    this.app = app;
    this.vault = vault;
    this.settings = settings;
    this.momentDateRegex = new MomentDateRegex();
    this.noteForDateQuery = new NoteForDateQuery();
  }

  hasTodayNote(): boolean {
    return (
      this.settings.mode === DayPlannerMode.File ||
      this.noteForDateQuery.exists(this.settings.notesToDates)
    );
  }

  todayPlannerFilePath(): string {
    if (this.settings.mode === DayPlannerMode.Command) {
      return this.noteForDateQuery.active(this.settings.notesToDates).notePath;
    }
    const fileName = this.todayPlannerFileName();
    return `${this.settings.customFolder}/${fileName}`;
  }

  todayPlannerFileName(): string {
    return this.momentDateRegex.replace(this.settings.dayPlannerFileName);
  }

  async prepareFile(filepath: string = this.todayPlannerFilePath()) {
    try {
      if (this.settings.mode === DayPlannerMode.File) {
        await this.createFolderIfNotExists(this.settings.customFolder);
        await this.createFileIfNotExists(filepath);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createFolderIfNotExists(path: string) {
    try {
      const normalizedPath = normalizePath(path);
      const folderExists = await this.vault.adapter.exists(
        normalizedPath,
        false
      );
      if (!folderExists) {
        await this.vault.createFolder(normalizedPath);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createFileIfNotExists(fileName: string) {
    try {
      const normalizedFileName = normalizePath(fileName);
      if (!(await this.vault.adapter.exists(normalizedFileName, false))) {
        // @ts-ignore
        const templaterPlugin = this.app.plugins.plugins["templater-obsidian"];
        if (templaterPlugin && this.settings.templaterFile) {
          const file = this.app.vault
            .getFiles()
            .filter(
              (f) =>
                f.path.replaceAll(/\\+/g, "/") ===
                this.settings.templaterFile.replaceAll(/\\+/g, "/")
            );

          if (file.length == 0) {
            new Notice(
              `Couldn't find the specified template, use default template instead.`,
              2000
            );
            await this.vault.create(
              normalizedFileName,
              DAY_PLANNER_DEFAULT_CONTENT
            );
            return;
          }

          const content = await this.app.vault.read(file[0]);
          const newFile = await this.vault.create(normalizedFileName, content);
          templaterPlugin.templater.overwrite_file_commands(newFile, false);
        } else {
          await this.vault.create(
            normalizedFileName,
            DAY_PLANNER_DEFAULT_CONTENT
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getFileContents(fileName: string) {
    await this.prepareFile(normalizePath(fileName));
    try {
      return await this.vault.adapter.read(normalizePath(fileName));
    } catch (error) {
      console.log(error);
    }
  }

  async updateFile(fileName: string, fileContents: string) {
    await this.prepareFile(normalizePath(fileName));
    try {
      return await this.vault.adapter.write(
        normalizePath(fileName),
        fileContents
      );
    } catch (error) {
      console.log(error);
    }
  }
}

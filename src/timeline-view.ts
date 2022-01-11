import { ItemView, WorkspaceLeaf } from "obsidian";
import { now, nowPosition, planSummary, zoomLevel } from "./timeline-store";

import type { DayPlannerSettings } from "./settings";
import type { PlanSummaryData } from "./plan-data";
import Timeline from "./timeline.svelte";
import { VIEW_TYPE_TIMELINE } from "./constants";
const moment = (window as any).moment;

export default class TimelineView extends ItemView {
  private timeline: Timeline;
  private settings: DayPlannerSettings;

  constructor(leaf: WorkspaceLeaf, settings: DayPlannerSettings) {
    super(leaf);
    this.settings = settings;
  }

  getViewType(): string {
    return VIEW_TYPE_TIMELINE;
  }

  getDisplayText(): string {
    return "Day Planner Timeline";
  }

  getIcon() {
    return this.settings.timelineIcon;
  }

  update(summaryData: PlanSummaryData) {
    planSummary.update((n) => (n = summaryData));
    const currentTime = new Date();
    now.update((n) => (n = currentTime));
    const currentPosition = summaryData.empty
      ? 0
      : this.positionFromTime(currentTime) -
        this.positionFromTime(summaryData.items.first().time);
    nowPosition.update((n) => (n = currentPosition));
    zoomLevel.update((n) => (n = this.settings.timelineZoomLevel));
  }

  positionFromTime(time: Date) {
    return (
      moment.duration(moment(time).format("HH:mm")).asMinutes() *
      this.settings.timelineZoomLevel
    );
  }

  async onOpen() {
    this.timeline = new Timeline({
      target: (this as any).contentEl,
      props: {
        planSummary: planSummary,
        rootEl: this.containerEl.children[1],
      },
    });
  }
}

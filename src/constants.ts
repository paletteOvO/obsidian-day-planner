export const DEFAULT_DATE_FORMAT = "YYYYMMDD";
export const DATE_REGEX = /(?<target>{{date:?(?<date>[^}]*)}})/g;

// https://regex101.com/r/YWWsJU/1
export const PLAN_PARSER_REGEX =
  /^(?<item>\s*[-*]\s*(?<check>(?:\[(?<completion>[x ])\])?)\s*)(?<hours>\d{1,2}):(?<minutes>\d{1,2})(?<end_time>-(?<end_hours>\d{1,2}):(?<end_minutes>\d{1,2}))?\s*(?<text>.*)$/gim;

export const MERMAID_REGEX = /```mermaid\ngantt[\S\s]*?```\s*/gim;

export const DAY_PLANNER_DEFAULT_CONTENT = `## Day Planner
- [ ] `;

export const VIEW_TYPE_TIMELINE = "timeline";
export const MINUTE_MULTIPLIER = 4;

export const ICONS = [
  "any-key",
  "audio-file",
  "blocks",
  "broken-link",
  "bullet-list",
  "calendar-with-checkmark",
  "checkmark",
  "create-new",
  "cross",
  "cross-in-box",
  "crossed-star",
  "dice",
  "document",
  "documents",
  "dot-network",
  "enter",
  "expand-vertically",
  "filled-pin",
  "folder",
  "gear",
  "go-to-file",
  "hashtag",
  "help",
  "horizontal-split",
  "image-file",
  "info",
  "install",
  "languages",
  "left-arrow",
  "left-arrow-with-tail",
  "lines-of-text",
  "link",
  "logo-crystal",
  "magnifying-glass",
  "microphone",
  "microphone-filled",
  "open-vault",
  "pane-layout",
  "paper-plane",
  "pdf-file",
  "pencil",
  "pin",
  "popup-open",
  "presentation",
  "reset",
  "right-arrow",
  "right-arrow-with-tail",
  "right-triangle",
  "search",
  "sheets-in-box",
  "star",
  "star-list",
  "switch",
  "three-horizontal-bars",
  "trash",
  "two-columns",
  "up-and-down-arrows",
  "uppercase-lowercase-a",
  "vault",
  "vertical-split",
  "vertical-three-dots",
];

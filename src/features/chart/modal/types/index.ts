import type { chartListElementProps } from "@/features/chart/list/element/types";

export type chartModalType = "create" | "update";

export interface chartModalProps {
  type: chartModalType;
  data: chartListElementProps | null;
}
export interface chartModalEmits {
  create: [value: chartListElementProps];
  update: [value: chartListElementProps];
}

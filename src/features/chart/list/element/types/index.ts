import type { chartModalType } from "@/features/chart/modal/types";

export interface chartListElementProps {
  id: number;
  name: string;
  value: number;
  color: string;
}

export interface chartListElementPropsExtended extends chartListElementProps {
  percent: number;
}

export interface chartListElementEmits {
  edit: [value: chartModalType, value: number];
  remove: [value: number];
}

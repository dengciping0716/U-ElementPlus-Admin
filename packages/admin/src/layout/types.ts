export interface Menu {
  hide?: boolean;
  path?: string;
  menuCode?: string;
  icon?: string;
  label?: string;
  children?: Menu[];
  sort?: number;
}

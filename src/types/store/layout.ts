export interface LayoutState {
  readonly sidebarOpen: boolean;
  readonly rightSidebarOpen: boolean;
  readonly topBarVisible: boolean;
  readonly bottomBarVisible: boolean;
  readonly sidebarWidth: number;
  readonly rightSidebarWidth: number;
}

export interface LayoutActions {
  readonly setSidebarOpen: (open: boolean) => void;
  readonly setRightSidebarOpen: (open: boolean) => void;
  readonly toggleSidebar: () => void;
  readonly toggleRightSidebar: () => void;
  readonly setTopBarVisible: (visible: boolean) => void;
  readonly setBottomBarVisible: (visible: boolean) => void;
  readonly setSidebarWidth: (width: number) => void;
  readonly setRightSidebarWidth: (width: number) => void;
}

export type LayoutStore = Readonly<LayoutState & LayoutActions>;
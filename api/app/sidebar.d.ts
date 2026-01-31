import { View } from './bike'
import { CommandName } from './commands'
import { Disposable } from './system'

/** Sidebar is a view that displays a list of items. */
export interface Sidebar extends View {
  /**
   * Add a navigation action item to the sidebar.
   *
   * Action items appear in the "Actions" section of the sidebar and execute
   * a callback or command when clicked.
   *
   * @param item - The action item to add.
   * @returns A handle to remove the item.
   */
  addAction(item: ActionItem): SidebarItemHandle
}

/** An action item in the sidebar. */
export type ActionItem = Readonly<{
  /** The unique identifier for the item. */
  id: string
  /** The text to display for the item. */
  text: string
  /** The SFSymbol to display for the item. */
  symbol: string
  /** An optional identifier for represented row. */
  representedRowId?: string
  /** The action to perform when the item is clicked. */
  action: CommandName | (() => void)
}>

/** A handle to remove a sidebar item. */
export interface SidebarItemHandle extends Disposable {}

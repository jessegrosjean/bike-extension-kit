import { View } from './bike'
import { CommandName } from './commands'
import { Disposable } from './system'

/** Sidebar is a view that displays a list of navigation items. */
export interface Sidebar extends View {
  /**
   * Add a location item to the sidebar.
   *
   * Location items appear in the sidebar and are used to navigate to a specific
   * row or state in the outline when clicked. Use representedRowId to associate
   * a row with the item. If a row is associated, then when you navigate to that
   * row the sidebar item is automatically selected.
   *
   * @param item - The location item to add.
   * @returns A handle to manage the item.
   */
  addLocation(item: LocationItem): SidebarItemHandle
}

/** A location item in the sidebar. */
export type LocationItem = Readonly<{
  /** The unique identifier for the item. */
  id: string
  /** The text to display for the item. */
  text: string
  /** The SFSymbol to display for the item. */
  symbol: string
  /** The persistent ID of the row this location navigates to. */
  representedRowId?: string
  /** The action to perform when the item is clicked (should navigate to representedRowId). */
  action: CommandName | (() => void)
}>

/** A handle to manage a sidebar item. */
export interface SidebarItemHandle extends Disposable {
  /** The represented row ID for this location item. Set after creation (e.g., after creating the row). */
  representedRowId: string | undefined
}

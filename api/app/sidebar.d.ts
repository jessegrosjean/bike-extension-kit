import { View } from './bike'
import { CommandName } from './commands'
import { Disposable } from './system'

/** Sidebar is a view that displays a list of navigation items. */
export interface Sidebar extends View {
  /**
   * Add a navigation shortcut to the top of the sidebar.
   *
   * When clicked, the action runs (typically navigating to the represented row,
   * creating it if needed). The location is automatically highlighted when the
   * editor navigates to its represented row by any means.
   *
   * @param item - The location item to add.
   * @returns A disposable to remove the item.
   */
  addLocation(item: LocationItem): Disposable
}

/** A location item in the sidebar. */
export type LocationItem = Readonly<{
  /** Unique identifier. Adding a location with an existing ID replaces it. */
  id: string
  /** The text to display. */
  text: string
  /** The SF Symbol name to display. */
  symbol: string
  /** The persistent row ID this location represents. Provide the expected ID
   * even if the row doesn't exist yet. */
  representedRowId: string
  /** The action to perform when clicked. */
  action: CommandName | (() => void)
}>

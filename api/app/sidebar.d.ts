import { View } from './bike'
import { CommandName } from './commands'
import { Disposable } from './system'

/** Sidebar is a view that displays a list of navigation items. */
export interface Sidebar extends View {
  /**
   * Add a location item to the sidebar.
   *
   * Location items appear at top of the sidebar and have an associated action.
   * That action is expected to navigate to a specific row. It is an action,
   * because the row might not exist yet and the action will need to create it,
   * such as the "Today" location.
   *
   * The location should know the representedRowId of the row it is associated
   * with. Even if it hasn't created the row yet, it should still provide the ID
   * of the row it will create when activated.
   *
   * The representedRowId is used to automatically select the location item when
   * the editor navigates through any means, such as when you focusIn a row.
   *
   * @param item - The location item to add.
   * @returns A disposable to remove the item.
   */
  addLocation(item: LocationItem): Disposable
}

/** A location item in the sidebar. */
export type LocationItem = Readonly<{
  /** The unique identifier for the item. */
  id: string
  /** The text to display for the item. */
  text: string
  /** The SFSymbol to display for the item. */
  symbol: string
  /** The persistent ID of the row this location represents. */
  representedRowId: string
  /** The action to perform when the item is clicked. */
  action: CommandName | (() => void)
}>

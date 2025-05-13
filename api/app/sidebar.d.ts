import { View, RelativeOrdering } from './bike'
import { OutlinePath } from '../core/outline-path'
import { CommandName } from './commands'
import { Disposable } from './system'

/** Sidebar is a view that displays a list items. */
export interface Sidebar extends View {
  /**
   * Add an item to the sidebar.
   * @param item - The item to add.
   * @returns A handle to update or remove the item.
   */
  addItem(item: SidebarItem): SidebarItemHandle
}

/** An item in the sidebar. */
export type SidebarItem = {
  /** The unique identifier for the item. */
  id: ItemId
  /** The text to display for the item. */
  text: string
  /** The SFSymbol to display for the item. */
  symbol?: string
  /** Whether the item uses the group display style. */
  isGroup?: boolean
  /* Where the item should be placed relative to other items. */
  ordering?: RelativeOrdering<string, ItemId>
  /** The action to perform when the item is selected. */
  action?: CommandName | ((_: Sidebar) => void)
  /** The specification for the item's children. */
  children?: SidebarItemChildren
}

export type SidebarItemChildren = {
  query: OutlinePath
  symbol?: string
  //scope?: "frontmostEditor" | "frontmostWindow" | "all"
  //presentation?: "flat" | "tree"
}

/** A handle to update or remove a sidebar item. */
export interface SidebarItemHandle extends Disposable {
  text: string
  symbol?: string
}

/** Unique identifier for a sidebar item. */
export type ItemId = string

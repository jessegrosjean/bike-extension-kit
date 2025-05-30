import { RelativeOrdering, View } from './bike'
import { DOMScriptName, DOMScriptHandle } from './dom-script'

export interface Inspector extends View {
  /**
   * Add an item to the inspector.
   *
   * @param item - The item to add to the inspector.
   * @param tab - The tab to add the item to.
   * @returns A promise that resolves to a DOMScriptHandle.
   */
  addItem(
    item: InspectorItem,
    tab?: InspectorTab // IGNORED FOR NOW
  ): Promise<DOMScriptHandle>
}

export type InspectorItem = {
  id: string
  name: DOMScriptName
  ordering?: RelativeOrdering<string, string> // ignored
}

export type InspectorTab = {
  name: string
  symbol: string
  ordering?: RelativeOrdering<string, string> // ignored
}

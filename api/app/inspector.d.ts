import { View } from './bike'
import { DOMScript, DOMScriptHandle } from './dom-script'

export interface Inspector extends View {
  /**
   * Add an item to the inspector.
   *
   * @param item - The item to add to the inspector.
   * @returns A promise that resolves to a DOMScriptHandle.
   */
  addItem(item: InspectorItem): Promise<DOMScriptHandle>
}

export type InspectorItem = {
  /** 
   * Tab identifier. If it resolves to an SF Symbol, the icon is used; otherwise
   * the text is shown. Items with the same tab share a tab. Defaults to
   * 'info.circle'. 
   */
  tab?: string
  /** Label shown in the tab bar tooltip. */
  label: string
  /** The DOM script to run. */
  script: DOMScript
}

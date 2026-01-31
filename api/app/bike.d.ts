import { Sidebar } from './sidebar'
import { Inspector } from './inspector'
import { Commands } from './commands'
import { Keybindings } from './keybindings'
import { OutlineEditor } from './outline-editor'
import { DOMScript, DOMScriptHandle } from './dom-script'
import { URL, Disposable, Permissions } from './system'
import { Outline, Row } from './outline'
import { OutlinePath } from '../core/outline-path'

declare global {
  /** The bike global API. */
  const bike: {
    /** The build # of the bike app. */
    readonly build: number
    /** The version of the bike app. */
    readonly version: string
    /** The api version of the bike app. */
    readonly apiVersion: string
    /** The interface for adding commands. */
    readonly commands: Commands
    /** The interface for adding keybindings. */
    readonly keybindings: Keybindings
    /** The interface to read/write to the system clipboard. */
    readonly clipboard: Clipboard

    /** All windows. */
    readonly windows: Window[]
    /** Frontmost window. */
    readonly frontmostWindow?: Window
    /** Observer called for all current and future windows. */
    observeWindows(handler: (_: Window) => void): Disposable
    /** Observer called current and future frontmost windows. */
    observeFrontmostWindow(handler: (_: Window | undefined) => void): Disposable

    /** All open documents. */
    readonly documents: Document[]
    /** Frontmost open document. */
    readonly frontmostDocument?: Document
    /** Observer called for all current and future documents. */
    observeDocuments(handler: (_: Document) => void): Disposable
    /** Observer called current and future frontmost documents. */
    observeFrontmostDocument(handler: (_: Document | undefined) => void): Disposable

    /** All outline editors. */
    readonly outlineEditors: OutlineEditor[]
    /** Frontmost outline editor */
    readonly frontmostOutlineEditor?: OutlineEditor
    /** Observer called for all current and future outline editors. */
    //observeOutlineEditors(handler: (_: OutlineEditor) => void): Disposable;
    /** Observer called current and future frontmost outline editors. */
    observeFrontmostOutlineEditor(handler: (_: OutlineEditor | undefined) => void): Disposable

    /**
     * Show a window or application modal alert.
     *
     * @param options - The options for the alert
     * @param window - A window to attatch the alert to
     * @returns A promise that resolves to the result of the alert.
     * @example
     * ```typescript
     * bike.showAlert({
     *   title: "Login",
     *   buttons: ["OK", "Cancel"],
     *   fields: [
     *     {
     *       type: "text",
     *       id: "username",
     *       placeholder: "Username",
     *     },
     *     {
     *       type: "secure",
     *       id: "password",
     *       placeholder: "Password",
     *     }
     *   ]
     * }).then(result => {
     *   if (result.button === "OK") {
     *     console.log("Username:", result.values.username);
     *     console.log("Password:", result.values.password);
     *   }
     * });
     * ```
     */
    showAlert(options: AlertOptions, window?: Window): Promise<AlertResult>

    /**
     * Show a fuzzy-filtering choice box for selecting from a list of items.
     *
     * @param items - The items to choose from
     * @param options - The options for the choice box
     * @param window - A window to attach the choice box to
     * @returns A promise that resolves to the selected indices, or null if cancelled.
     * @example
     * ```typescript
     * const indices = await bike.showChoiceBox(
     *   [
     *     { name: "First Option", symbol: "star" },
     *     { name: "Second Option", container: "Category A" },
     *     { name: "Third Option" }
     *   ],
     *   {
     *     placeholder: "Choose an option...",
     *     defaultSymbol: "circle",
     *     allowsMultipleSelection: false
     *   }
     * );
     *
     * if (indices !== null) {
     *   console.log("Selected index:", indices[0]);
     * }
     * ```
     */
    showChoiceBox(items: ChoiceBoxItem[], options?: ChoiceBoxOptions, window?: Window): Promise<number[] | null>
  }
}

/**
 * ExtensionContext provides access to extension specific API. It is passed
 * through the extension's activate function.
 *
 * ```ts
 * import { ExtensionContext } from "bike";
 * export async function activate(context: ExtensionContext) {
 *     // extension code here
 * }
 * ```
 *
 * The extension context is indexed by string and is a good place to store
 * disposables and handles for later access.
 */
export interface AppExtensionContext extends Record<string, any> {
  readonly permissions: Permissions
}

/** Interface for managing the clipboard. */
export interface Clipboard {
  /**
   * Reads the text from the clipboard.
   *
   * @requires `clipboardRead` permission
   * @param uti - The associated UTI. (default is "public.utf8-plain-text")
   * @returns The text from the clipboard.
   */
  readText(uti?: string): string

  /**
   * Writes the text to the clipboard.
   *
   * @requires `clipboardWrite` permission
   * @param string - The text to write to the clipboard.
   * @param uti - The associated UTI. (default is "public.utf8-plain-text")
   */
  writeText(string: string, uti?: string): void
}

/**
 * RelativeOrdering specifies where an item should be placed relative to
 * other items. For example used for sidebar items and menu items. Items are
 * ordered first by section, then by beforeId, then by afterId.
 */
export type RelativeOrdering<Section, ElementId> = {
  readonly section?: Section
  readonly beforeId?: ElementId
  readonly afterId?: ElementId
}

/** Interface for an open document. */
export interface Document {
  readonly fileURL?: URL
  readonly fileType: string
  readonly displayName: string
  readonly windows: Window[] // ordered front to back
  readonly frontmostWindow?: Window
  readonly outline: Outline
}

/** Interface for a document window. */
export interface Window {
  readonly title: string
  readonly sidebar: Sidebar
  readonly inspector: Inspector
  readonly documents: Document[]
  readonly outlineEditors: OutlineEditor[]
  readonly currentOutlineEditor?: OutlineEditor

  observeCurrentOutlineEditor(handler: (_: OutlineEditor | undefined) => void): Disposable

  /**
   * Present a WebView based sheet.
   *
   * Use the name parameter to load the DOMScript `src/dom/<name>` into
   * the WebView. The script should configure the DOM elements for display.
   *
   * @param script - The script to run.
   * @param options - The options for displaying the sheet.
   * @returns A promise that resolves to a DOMScriptHandle.
   */
  presentSheet(script: DOMScript, options?: SheetOptions): Promise<DOMScriptHandle>

  /*
  presentRowPicker(
    outline: Outline,
    options?: {
      title?: string
      path: OutlinePath
      allowsMultipleSelection?: boolean
      initialSelection?: string[]
    }
  ): Promise<Row[] | null>
  */
}

/** Interface for a view in the UI. */
export interface View {}

interface SheetOptions {
  width?: number
  height?: number
  //buttons?: string[];
}

interface AlertOptions {
  title?: string
  message?: string
  style?: AlertStyle
  buttons?: string[]
  fields?: AlertField[]
}

interface AlertField {
  id: string
  type: AlertFieldType
  label?: string
  placeholder?: string
  defaultValue?: string | boolean | number
  dropdownOptions?: string[]
}

interface AlertResult {
  button: string
  values: Record<string, string | boolean | number>
}

type AlertStyle = 'informational' | 'warning' | 'critical'
type AlertFieldType = 'text' | 'secure' | 'checkbox' | 'dropdown'

/** An item to display in a choice box. */
interface ChoiceBoxItem {
  /** The display name for this item. */
  name: string
  /** Optional container/category shown after the name (separated by tab). */
  container?: string
  /** Optional SF Symbol name to display beside the item. */
  symbol?: string
}

/** Options for configuring a choice box. */
interface ChoiceBoxOptions {
  /** Placeholder text shown in the search field. */
  placeholder?: string
  /** Default SF Symbol to use when an item doesn't specify one. */
  defaultSymbol?: string
  /** Whether the user can dismiss without selecting (default: false). */
  allowsEmptySelection?: boolean
  /** Whether multiple items can be selected (default: false). */
  allowsMultipleSelection?: boolean
}

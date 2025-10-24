/**
 * DOMScripts allow extensions to display UI using HTML/DOM.
 *
 * Normally, extension code runs in a headless JSContext. This code has access
 * to Bike-specific APIs, but cannot use HTML/DOM. To display custom UI your
 * extension installs a DOMScript into a WebView that's hosted by Bike.
 *
 * If you've used Web Workers, the architecture will feel familiar: both run in
 * isolated script contexts and communicate with the originating context using
 * `postMessage` and `onmessage`.
 *
 * DOMScripts are loaded by name and must be located in the `src/dom` folder of
 * your extension. Bike API's that allow you to install DOMScripts include
 * `window.presentSheet` and `window.inspector.addItem`.
 *
 * DOMScripts Summary:
 *
 * 1. Used to display UI using HTML/DOM.
 * 2. Do not have access to standard extension APIs.
 * 3. Run in a separate context from standard extension code.
 * 4. Must be located in the extension's `src/dom` folder and loaded by name.
 * 5. Communicate with extension code via `postMessage` and `onmessage`.
 * 6. For security some HTML/DOM APIs (e.g., network access) are disabled.
 */

import { Disposable, URL } from './system'
import { Json } from '../core/json'

/**
 * Name of a script located in extension's src/dom folder or Javascript code
 * that can be executed. Will first look for a file in src/dom with this name.
 * If that is not found then the passed string is used as Javascript code
 * directly.
 */
export type DOMScript = string

/** A handle to send and receive messages with a DOMScript. */
export interface DOMScriptHandle extends Disposable {
  /**
   * Receive messages from the DOM context.
   *
   * The message is typed as Json | any for easier use with typescript APIs.
   * The message will always be a Json type and is always the result of a
   * postMessage call elsewhere in the code.
   *
   * @param message
   */
  onmessage?: (message: Json | any) => void

  /**
   * Send messages to the DOM context.
   * @param message
   */
  postMessage(message: Json): void
}

import { Json } from '../core/json'

/**
 * DOMExtensionContext is passed to DOMScript's activate function.
 *
 * DOM scripts have access to the system font classes and CSS custom properties
 * defined in `common.css`. Use these to match macOS system appearance and adapt to light/dark mode.
 *
 * Example:
 *
 * ```ts
 * import { DOMExtensionContext } from "bike";
 * export async function activate(context: DOMExtensionContext) {
 *   context.element.textContent = "Hello World!";
 * }
 * ```
 */
export interface DOMExtensionContext extends Record<string, any> {
  /** The element where the extension should display */
  element: HTMLElement

  /**
   * Receive messages from the app context.
   *
   * The message is typed as Json | any for easier use with typescript APIs.
   * The message will always be a Json type and is always the result of a
   * postMessage call elsewhere in the code.
   *
   * @param message
   */
  onmessage?: (message: Json | any) => void

  /**
   * Send messages to the app context.
   * @param message
   */
  postMessage: (message: Json) => void
}

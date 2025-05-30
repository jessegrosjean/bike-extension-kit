import { Json } from '../core/json'

/**
 * Permissions are used to control access to sensitive APIs such as the
 * clipboard and web requests. They are set in the extension manifest and
 * cannot be changed by the extension code.
 */
export interface Permissions {
  contains(permission: Permission): boolean
}

/** Permissions that can be granted through `manifest.json`. */
export type Permission = 'openURL' | 'clipboardRead' | 'clipboardWrite'

/**
 * Interface for disposables.
 *
 * Disposables are used throughout the API to allow for the cleanup of
 * resources (such as event handlers) or removal of additions (such as
 * commands, keybindings, and sidebar items) when they are no longer needed.
 *
 * Disposables are automatically disposed when your extension is
 * deactivated. It is not necessary to manually dispose them. You may wish
 * to keep disposables around if you want to be able to dispose them while
 * your extension is still running.
 *
 * In some cases (such as SidebarItem) the disposable is also a handle that
 * provides API to modify the added item.
 */
export interface Disposable {
  dispose(): void
}

export class URL {
  /** Create a new URL object. */
  constructor(url: string)

  readonly scheme?: string
  readonly port?: number
  readonly pathComponents: string[]
  readonly lastPathComponent: string
  readonly pathExtension: string
  readonly queryParameters?: Record<string, string>
  readonly absoluteString: string

  user(percentEncoded?: boolean): string | undefined
  password(percentEncoded?: boolean): string | undefined
  host(percentEncoded?: boolean): string | undefined
  path(percentEncoded?: boolean): string
  query(percentEncoded?: boolean): string | undefined
  fragment(percentEncoded?: boolean): string | undefined

  /**
   * Open this URL in the system's default application.
   * @requires `openURL` permission
   * @param configuration - The configuration for opening the URL.
   */
  open(configuration: URLOpenConfiguration): void
}

/** Configuration for opening a URL. */
type URLOpenConfiguration = {
  /** Whether to activate the application (default: true) */
  activates?: boolean
  /** Whether to prompt the user if needed (default: true) */
  promptsUserIfNeeded?: boolean
}

declare global {
  function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): number
  function clearTimeout(timeoutId: number): void
  function setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): number
  function clearInterval(intervalId: number): void

  const console: {
    trace(...data: any[]): void
    log(...data: any[]): void
    info(...data: any[]): void
    warn(...data: any[]): void
    error(...data: any[]): void
    debug(...data: any[]): void
  }

  /**
   * Fetch a URL.
   *
   * Goal is to make this fully compatible with the Fetch API. It is not that
   * now. Let me know if you need something that is not yet supported.
   *
   * The fetch API requires host permissions in the manifest.json file:
   *
   * - `host_permissions` with a pattern matching the URL you want to fetch.
   *   Pattern should follow
   *   https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns
   *
   * Here are some example host patterns:
   *
   *  - `https://example.com/*` - matches all URLs on example.com
   *  - `https://*.example.com/*` - matches all subdomains of example.com
   *  - `http://example.com/*` - matches all URLs on example.com
   *  - `*://example.com/*` - matches all URLs on example.com
   *
   * @requires `host_permissions` match URL
   * @param input - The URL to fetch.
   * @param options - The options for the fetch request.
   * @returns A promise that resolves to the response.
   */
  function fetch(input: string, options?: Options): Promise<Response>

  interface Options {
    readonly method?: string
    readonly headers?: Record<string, string>
    readonly body?: string
  }

  interface Response {
    readonly ok: boolean
    readonly status: number
    readonly url: string
    /** Returns a promise with response body text. */
    text(): Promise<string>
    /** Returns a promise with response body parsed as JSON object. */
    json(): Promise<Json | any>
  }
}

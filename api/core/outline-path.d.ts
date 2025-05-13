import { Row, TextAttributeName } from '../app/outline'

/** String following OutlinePath syntax */
export type OutlinePath = string

/** String following relative OutlinePath syntax (starts with .) */
export type RelativeOutlinePath = string

/** String following absolute OutlinePath syntax (starts with /) */
export type AbsoluteOutlinePath = string

/** RowRuns are returned by OutlinePaths that query the `run` axis. */
export interface RowRun {
  /** Row that contains this run. */
  readonly row: Row
  /** Start index of this run in row's text. */
  readonly runStart: number
  /** Substring contained by this run. */
  readonly runString: string
  /** Run's text attributes. */
  readonly runAttributes: Record<TextAttributeName, string>
}

/**
 * Result value of an OutlinePath query.
 *
 * Most outline paths useful in Bike return type "elements" with a list of
 * rows. See user guide for more information on OutlinePath syntax.
 */
export type OutlinePathValue =
  | { type: 'elements'; value: (Row | RowRun)[] }
  | { type: 'string'; value: string }
  | { type: 'number'; value: number }
  | { type: 'boolean'; value: boolean }
  | { type: 'null'; value: undefined }

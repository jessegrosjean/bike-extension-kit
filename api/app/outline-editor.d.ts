import {
  Affinity,
  AttributedString,
  Outline,
  Range,
  Row,
  RowId,
  TransactionOptions,
} from './outline'
import { OutlinePath } from '../core/outline-path'
import { Disposable } from './system'
import { View } from './bike'

/** OutlineEditor is a view that displays an outline. */
export interface OutlineEditor extends View {
  /** Edited outline. */
  readonly outline: Outline

  /**
   * Root of focused outline in editor. Defaults to outline root, but can be
   * set to "focus in" to a portion of the outline.
   */
  focus: Row

  /**
   * Applies a filter to the outline editor display using an OutlinePath.
   * If the path is relative, it is resolved from the focus row.
   */
  filter?: OutlinePath

  /** True if row is expanded */
  isExpanded(row: Row): boolean
  /** True if row is collapsed */
  isCollapsed(row: Row): boolean
  /** Expand the given rows with given options. */
  expand(rows?: Row[], options?: FoldOptions): void
  /** Collapse the given rows with given options. */
  collapse(rows?: Row[], options?: FoldOptions): void

  /** True when row is in focused branch and not filtered or collapsed */
  isFocused(row: Row): boolean
  /** Return prev focused row from given row */
  prevFocused(row: Row): Row | undefined
  /** Return next focused row from given row */
  nextFocused(row: Row): Row | undefined

  /** Read editor selection. */
  readonly selection?: Selection

  /**
   * Observe selection.
   * @param observer - The closure for new selections.
   * @param debounce - The debounce delay in milliseconds. (default 1000ms)
   * @returns A Disposable to cancel the observer.
   */
  observeSelection(observer: (selection?: Selection) => void, debounce?: number): Disposable

  /** Select rows to create a "block" selection. */
  selectRows(anchor: Row, head?: Row): void
  /** Select a single row's text to create a "text" selection. */
  selectText(row: Row, anchor: number, head?: number): void
  /** Place caret in a single rows text to create a "caret" selection. */
  selectCaret(row: Row, anchor: number, runAffinity?: Affinity, lineAffinity?: Affinity): void

  /**
   * Group outline changes into a single view update.
   * @param options Options that determine how the view updates.
   * @param update Perform changes to the outline in this closure.
   * @returns The return value of the update closure.
   */
  transaction(options: TransactionOptions, update: () => any): any
}

/**
 * Outline editor selection.
 *
 * Selections have an anchor and a head. The anchor is the fixed point where
 * the selection began, and the head is the dynamic point that moves. The head
 * and anchor may be the same value. Depending on the selection type these
 * values may be character offsets or rows.
 *
 * All selections have a set of common properties. Each selection also has a
 * type which determines the fields in `selection.detail`.
 *
 * The selection types are:
 *
 * - caret: A single character in a single row.
 * - text: A range of characters in a single row.
 * - block: A range of rows in the outline.
 */
export type Selection = Readonly<SelectionCommon & SelectionTypeDetail>

type SelectionCommon = {
  /** The head row of the selection */
  row: Row
  /** The word touching the head of the selection */
  word: string
  /** The sentence touching the head of the selection */
  sentence: string
  /** The rows in the selection */
  rows: Row[]
  /** The common ancestors of the rows in the selection */
  coverRows: Row[]
}

type SelectionTypeDetail =
  | {
      /** A collapsed blinking caret selection */ type: 'caret'
      detail: {
        /** Character offset in headRow */
        char: number
        /**
         * Line affinity determines which line the caret will appear on when
         * it is located at the end of a wrapped line.
         */
        lineAffinity: Affinity
        /**
         * Run affinity determines which run the caret is associated with when
         * it is located on a boundary between two run.
         */
        runAffinity?: Affinity
      }
    }
  | {
      /** A text range selection within a single row */ type: 'text'
      detail: {
        /** Character range of the selection in the headRow */
        range: Range
        /** The selected text */
        text: AttributedString
        /** The head character offset of the selection */
        headChar: number
        /** The anchor character offset of the selection */
        anchorChar: number
      }
    }
  | {
      /** A block selection over one or more rows */ type: 'block'
      detail: {
        /** The head row of the selection */
        headRow: Row
        /** The anchor row of the selection */
        anchorRow: Row
        /** The start row of the selection */
        startRow: Row
        /** The end row of the selection */
        endRow: Row
      }
    }

/**
 * Options for folding rows in an outline editor.
 *
 * - row - Fold the row itself.
 * - completely - Fold the row and all non leaf children.
 * - byLevel - Fold the row by level. First compute the maximum visible
 *   level of the rows descendants. Then expand/collapse that level by one.
 */
export type FoldOptions = 'row' | 'completely' | 'byLevel'

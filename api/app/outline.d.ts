import { Json } from '../core/json'
import { OutlinePath, OutlinePathValue } from '../core/outline-path'
import { Disposable, URL } from './system'

/** Outline is a tree of rows. */
export class Outline {
  /** Root row of the outline (not visible in editor). */
  readonly root: Row

  /**
   * Create a new outline.
   *
   * Generally users create outlines themselves when they create
   * documents. Use this constructor to create a temporary outline for
   * processing. For example you can use this constructor to copy rows
   * from an existing outline to the clipboard:
   *
   * 1. Query the existing outline
   * 2. Create a new outline from the query results
   * 3. Use `archive()` on the new outline to export the data
   *
   * @param rows - The rows to insert into the new outline.
   * @returns The new outline.
   */
  constructor(rows?: RowSource)

  /** Runtime metadata for the outline. */
  readonly runtimeMetadata: Metadata

  /**
   * Persistent metadata for the outline.
   *
   * Stored in file format frontmatter/metadata. Not stored for Plain Text
   * documents unless the key `bikemd` is set to `true`.
   */
  readonly persistentMetadata: Metadata

  /**
   * Archive this outline.
   *
   * @param format - The archive format (default bike).
   * @returns The outline archived.
   */
  archive(format?: OutlineFormat): OutlineArchive

  /**
   * Get the row by id.
   * @param id - The id of the row to get.
   * @returns The row or undefined if not found.
   */
  getRowById(id: RowId): Row | undefined

  /**
   * Insert rows into the outline.
   *
   * @param rows - The source of the rows to insert. (Always copied)
   * @param parent - The parent row to insert the rows into. (Default Root)
   * @param before - The optional child row to insert before.
   */
  insertRows(rows: RowSource, parent?: Row, before?: Row): Row[]

  /**
   * Move rows within the outline. These rows must allready be in the
   * outline.
   *
   * @param rows - The existing rows to move.
   * @param parent - The existing parent row to move the rows into.
   * @param before - The optional child row to insert before.
   */
  moveRows(rows: Row[], parent: Row, before?: Row): void

  /**
   * Remove rows from the outline.
   * @param rows - The existing rows to remove.
   */
  removeRows(rows: Row[]): void

  /**
   * Query the outline immediatly.
   * @param path - The outline path to query.
   * @returns The result value of the query.
   */
  query(path: OutlinePath): OutlinePathValue

  /**
   * Query the outline asynchronously.
   * @param path - The outline path to query.
   * @param handler - The handler to call when result value is ready.
   * @returns A Disposable to cancel the query.
   */
  scheduleQuery(path: OutlinePath, handler: (value: OutlinePathValue) => void): Disposable

  /**
   * Query the outline asynchronously and continuously.
   *
   * Queries are debounced as the outline changes. If the outline changes
   * quickly you may not see intermediate results, but you will always get
   * results for the final outline state.
   *
   * @param path - The outline path to query.
   * @param handler - The handler to call when a result value is ready.
   * @returns A Disposable to cancel the query.
   */
  streamQuery(path: OutlinePath, handler: (value: OutlinePathValue) => void): Disposable

  /**
   * Explain how an outline path will be evaluated.
   *
   * Returns detailed information about the path's abstract syntax tree,
   * parse sequence, and any parsing errors. Useful for debugging and
   * understanding complex queries.
   *
   * @param path - The outline path to explain.
   * @returns A string describing the AST, parse sequence, and errors.
   */
  explainQuery(path: OutlinePath): string

  /**
   * Group outline changes into a single view update.
   * @param options Options that determine how the view updates.
   * @param update Perform changes to the outline in this closure.
   * @returns The return value of the update closure.
   */
  transaction(options: TransactionOptions, update: () => any): any

  /**
   * Listen for changes to the outline.
   * @param handler - The handler to call when the outline changes.
   * @returns A Disposable to cancel the handler.
   */
  //onChange(handler: (value: OutlineChange) => void): Disposable;
}

/** Metadata (JSON) storage for outlines. */
export interface Metadata {
  /** Get value for key. */
  get(key: string): Json | undefined
  /** Set value for key. */
  set(key: string, value: Json | undefined): void
  /** Delete value for key. */
  delete(key: string): void
}

export type OutlineArchive = { data: string; format: OutlineFormat }
export type OutlineFormat = 'bike' | 'opml' | 'plaintext'

/**
 * NEED THIS API? Let me know!!!
 *
 * Describes change made to an outline.
 *
 * Changes to outline structure are grouped into changes of contiguous and
 * ordered sibling rows. Only top level siblings are reported. For example
 * when siblings are removed you will get an event for the top level removed
 * siblings, but not for descendants of those siblings.
 */
/*export type OutlineChange =
| { type: "metadata" }
| { type: "rowChanged"; 
rowChange: RowChange 
}
| { type: "siblingsInserted"; 
siblings: [Row] 
}
| { type: "siblingsRemoved"; 
siblings: [Row] 
}
| { type: "siblingsMoved"; 
oldSiblings: [Row],
newSiblings: [Row] 
}
| { type: "reload"; 
oldOutline: Outline, 
newOutline: Outline 
}
*/

/** Describes change made to a row. */
/*export type RowChange =
| { type: "setType"; 
oldType: RowType; 
newType: RowType 
}
| { type: "setAttribute"; 
name: string; 
oldValue: string | null; 
newValue: string | null 
}
| { type: "replacedText"; 
at: number; 
replacedText: AttributedString; 
insertedText: AttributedString 
}
| { type: "replacedTextAndSetType"; 
at: number; 
replacedText: AttributedString; 
insertedText: AttributedString; 
oldType: RowType; 
newType: RowType 
};
*/

/** A row is a paragraph of text that can also have children rows. */
export interface Row {
  /** Owning outline */
  readonly outline: Outline
  /** Unique and persistent id within outline */
  readonly id: RowId
  /** URL link for this row combining outline and row ids */
  readonly url: URL

  /** Row's type, defaults to body */
  type: RowType
  /** Row's paragraph of text */
  text: AttributedString

  /** Row attributes, stored as map of strings to strings */
  readonly attributes: Record<RowAttributeName, string>

  /**
   * Get attribute by name.
   * @param name - The name of the attribute.
   * @param type - The type to parse the attribute as. (default string)
   * @returns The attribute value or undefined if not set.
   */
  getAttribute(name: RowAttributeName, type?: AttributeValueType): any | undefined

  /**
   * Set attribute by name. AttributeValue will be converted to and stored
   * as a string.
   */
  setAttribute(name: RowAttributeName, value: AttributeValue): void

  /** Remove attribute by name. */
  removeAttribute(name: RowAttributeName): void

  /** Parent row, only undefined for outline root. */
  readonly parent?: Row
  /** Previous sibling row. */
  readonly prevSibling?: Row
  /** Next sibling row. */
  readonly nextSibling?: Row
  /** First child row. */
  readonly firstChild?: Row
  /** Last child row. */
  readonly lastChild?: Row

  /** First leaf in branch rooted at this row */
  readonly firstLeaf: Row
  /** Last leaf in branch rooted at this row */
  readonly lastLeaf: Row
  /** Children of this row */
  readonly children: Row[]
  /** Descendants of this row */
  readonly descendants: Row[]
  /** Previous row in outline order */
  readonly prevInOutline?: Row
  /** Next row in outline order */
  readonly nextInOutline?: Row
}

/**
 * AttributedString for rich text editing.
 *
 * Many commonly used attributes are "marker" attributes. They are used to
 * mark up text with semantic meaning, and just used empty string for
 * associated value. For example, "strong" is used to mark up text that
 * should be displayed as bold, but the acutal font is determined by the
 * editor's stylesheets.
 */
export interface AttributedString {
  /** Character contents as a string. */
  string: string

  /**
   * Get attribute at index.
   * @param attribute - The name of the attribute.
   * @param index - The index to get the attribute at.
   * @param affinity - The affinity to disambiguate run boundaries (default upstream).
   * @param effectiveRange - The range of the attribute returned by reference.
   * @returns The attribute value or null if not set.
   */
  attributeAt(
    attribute: TextAttributeName,
    index: number,
    affinity?: Affinity,
    effectiveRange?: Range
  ): string | null

  /**
   * Get attributes at index.
   * @param index - The index to get the attributes at.
   * @param affinity - The affinity to disambiguate run boundaries (default upstream).
   * @param effectiveRange - The range of the attributes returned by reference.
   * @returns The attributes at the index.
   */
  attributesAt(
    index: number,
    affinity?: Affinity,
    effectiveRange?: Range
  ): Record<TextAttributeName, string>

  /**
   * Add attribute in range.
   * @param name - The name of the attribute.
   * @param value - The value of the attribute.
   * @param range - The range to add the attribute to (default entire string).
   */
  addAttribute(name: TextAttributeName, value: AttributeValue, range?: Range): void

  /**
   * Add attributes in range.
   * @param attributes - The attributes to add.
   * @param range - The range to add the attributes to (default entire string).
   */
  addAttributes(attributes: Record<TextAttributeName, AttributeValue>, range?: Range): void

  /**
   * Remove attribute from range.
   * @param name - The name of the attribute.
   * @param range - The range to remove the attribute from (default entire string).
   */
  removeAttribute(name: TextAttributeName, range?: Range): void

  /**
   * Return new attributed string from range.
   * @param range - The range to get the substring from.
   * @returns The substring.
   */
  substring(range: Range): AttributedString

  /**
   * Insert string or attributed text at index.
   * @param position - The index to insert the text at.
   * @param text - The text to insert.
   */
  insert(position: number, text: string | AttributedString): void

  /**
   * Replace range with string or attributed text.
   * @param range - The range to replace.
   * @param text - The text to replace the range with.
   */
  replace(range: Range, text: string | AttributedString): void

  /**
   * Append string or attributed text.
   * @param text - The text to append.
   */
  append(text: string | AttributedString): void

  /**
   * Delete text in range.
   * @param range - The range to delete.
   */
  delete(range: Range): void

  /**
   * Convert this attributed string to Markdown.
   * @returns Markdown representation of the attributed string.
   */
  toMarkdown(): string

  /**
   * Convert this attributed string to HTML.
   * @returns HTML representation of the attributed string.
   */
  toHTML(): string
}

/**
 * Row attributes names can be any valid HTML attribute string. When encoded to
 * HTML they will be prefixed with `data-`.
 */
export type RowAttributeName = string

/**
 * Text attribute names can be any string. Common built in text attributes
 * such as "strong" and "em" are represented as inline tags in HTML.
 * Custom attributes in spans.
 */
export type TextAttributeName =
  | 'em' // was emphasize
  | 'strong'
  | 'code'
  | 'mark' // was highlight
  | 's' // was strikethough
  | 'a' // was link
  | 'base' // was baseline
  | string

/**
 * Attribute values can be strings, numbers, dates, or arrays of these
 * types. They are stored as strings in the outline in a format that can be
 * converted back to the original type.
 */
export type AttributeValue = string | number | Date // | AttributeValue[]

/**
 * Attribute values are stored as strings. This type is used when accessing
 * an attribute to convert it in a standard way to one of the supported
 * attribte types.
 */
export type AttributeValueType = 'string' | 'number' | 'date' // | "array"

/**
 * Range is a tuple of start and end indexes. The start index is inclusive
 * and the end index is exclusive.
 */
export type Range = [RangeStartIndex, RangeEndIndex]
export type RangeStartIndex = number
export type RangeEndIndex = number
export type RowId = string
export type RowType =
  | 'body'
  | 'heading'
  | 'quote'
  | 'code'
  | 'note'
  | 'unordered'
  | 'ordered'
  | 'task'
  //| "page" TODO?
  | 'hr'

/**
 * Affinity determines how the selection behaves when the caret is at a
 * position with two possible meanings. For example at the end of a wrapped
 * line (or same position could be start of next wrapped line).
 */
export type Affinity = 'upstream' | 'downstream'

/**
 * Use RowSource when creating a new outline or inserting rows.
 *
 * RowSource will be copied into new rows in the outline. If any of the row
 * source IDs already exist in the outline new IDs will be generated and any
 * links imported will be updated to point to the new IDs.
 */
export type RowSource =
  | string[]
  | RowTemplate[]
  | Row[]
  | Outline
  | OutlineArchive
  | OutlinePathValue

/**
 * Rows can't be created directly. Use a RowTemplate when you need to create
 * new rows, and the template values will be inserted into the row that the
 * outline creates for you internally.
 */
export type RowTemplate = {
  id?: RowId
  type?: RowType
  attributes?: Record<RowAttributeName, string>
  text?: string | AttributedString
  format?: 'plain' | 'markdown'
}

/**
 * TransationOptions determine how the view updates when changes are made to
 * the outline.
 */
type TransactionOptions = {
  animate: 'default' | 'none'
}

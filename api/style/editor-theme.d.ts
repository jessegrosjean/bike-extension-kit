import { Color, Font, FontWeight } from './graphics'
import { TextStyle, TextRunStyle } from './editor-style'

/**
 * EditorTheme - The scripting API for Bike theme files (.bktheme).
 *
 * This interface provides access to colors and text styles defined in JSON
 * theme files so that they can be accessed programmatically from the editor style that uses them.
 *
 * Access theme values in style scripts via `context.theme`:
 *
 * ```typescript
 * row('.heading', (context, row) => {
 *   context.theme.rows.heading.apply(row.text)
 * })
 *
 * run('.@strong', (context, text) => {
 *   context.theme.runs.strong.apply(text)
 * })
 * ```
 */
interface EditorTheme {
  /** Colors defined in the theme's "colors" section */
  readonly colors: ColorTheme

  /** Row text themes defined in the theme's "rows" section */
  readonly rows: RowThemes

  /** Run text themes defined in the theme's "runs" section */
  readonly runs: RunThemes
}

/**
 * ColorTheme - Colors accessible via `theme.colors`.
 *
 * All colors have sensible defaults if not specified in the theme.
 * Colors can reference other colors using `$name` syntax in the theme JSON.
 */
interface ColorTheme {
  // Core colors
  readonly text: Color
  readonly accent: Color
  readonly background: Color

  // Caret and selection
  readonly caret: Color
  readonly caretLine: Color
  readonly selectionText: Color
  readonly selectionBlock: Color
  readonly findMatch: Color
  readonly findMatchCurrent: Color

  // UI elements
  readonly handle: Color
  readonly guideLine: Color
  readonly focusArrow: Color

  // Annotations
  readonly grammar: Color
  readonly spelling: Color
  readonly replacement: Color

  /**
   * Get a named color from the theme's colors dictionary.
   * @param name - The color name (e.g., "text", "accent", "link", or custom names)
   * @returns The color if defined, undefined otherwise
   */
  [name: string]: Color | undefined
}

/**
 * RowThemes - Row text themes accessible via `theme.rows`.
 *
 * Each row type has a TextTheme that can be applied to row text styling.
 * All row themes have sensible defaults.
 */
interface RowThemes {
  readonly body: TextTheme
  readonly heading: TextTheme
  readonly note: TextTheme
  readonly blockquote: TextTheme
  readonly codeblock: TextTheme
  readonly task: TextTheme
  readonly orderedList: TextTheme
  readonly unorderedList: TextTheme
  readonly horizontalRule: TextTheme

  /**
   * Get a row theme by name.
   * @param name - The row type name (e.g., "heading", "note", "codeblock")
   * @returns The text theme
   */
  [name: string]: TextTheme | undefined
}

/**
 * RunThemes - Run text themes accessible via `theme.runs`.
 *
 * Each run type has a TextTheme that can be applied to run text styling.
 * All run themes have sensible defaults.
 */
interface RunThemes {
  readonly strong: TextTheme
  readonly emphasis: TextTheme
  readonly strikethrough: TextTheme
  readonly code: TextTheme
  readonly highlight: TextTheme
  readonly link: TextTheme

  /**
   * Get a run theme by name.
   * @param name - The run type name (e.g., "strong", "emphasis", "code")
   * @returns The text theme
   */
  [name: string]: TextTheme | undefined
}

/**
 * TextTheme - Styling properties for rows and runs defined in themes.
 *
 * All properties are optional. When a property is undefined, the style
 * should generally not apply a value. Use the `apply()` method to
 * conveniently apply all defined properties to a text style.
 */
interface TextTheme {
  /** Text color */
  readonly color?: Color
  /** Font family name (e.g., "SF Mono", "Helvetica") */
  readonly fontFamily?: string
  /** Font size multiplier (e.g., 1.2 = 20% larger than base) */
  readonly fontAdjust?: number
  /** Font weight */
  readonly fontWeight?: FontWeight
  /** Font traits to apply */
  readonly fontTraits?: FontTrait[]

  /**
   * Apply this theme's properties to a text style.
   *
   * Only defined properties are applied - undefined properties leave
   * the text style unchanged. This allows themes to selectively override
   * specific aspects of styling.
   *
   * @param style - The text style to modify (TextStyle for rows, TextRunStyle for runs)
   */
  apply(style: TextStyle | TextRunStyle): void
}

/** Font traits that can be applied to text */
type FontTrait = 'italic' | 'bold' | 'expanded' | 'condensed' | 'monospace'

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
 */
interface ColorTheme {
  // Core colors
  readonly text: Color
  readonly accent: Color
  readonly background: Color

  // Caret and selection
  readonly caret: Color
  readonly caretLine: Color
  readonly caretMessage: Color
  readonly textBackgroundSelected: Color
  readonly blockBackgroundSelected: Color
  readonly findMatch: Color
  readonly findMatchCurrent: Color

  // UI elements
  readonly handle: Color
  readonly handleUnloaded: Color
  readonly guideLine: Color
  readonly focusArrow: Color

  // Annotations
  readonly grammar: Color
  readonly spelling: Color
  readonly replacement: Color

  /** Access custom colors defined in the theme by name. Returns undefined if not found. */
  get(name: string): Color | undefined
}

/**
 * RowThemes - Row text themes accessible via `theme.rows`.
 *
 * Each row type has a TextContainerTheme that can be applied to row text styling.
 * All row themes have sensible defaults.
 */
interface RowThemes {
  readonly body: TextContainerTheme
  readonly heading: TextContainerTheme
  readonly note: TextContainerTheme
  readonly blockquote: TextContainerTheme
  readonly codeblock: TextContainerTheme
  readonly task: TextContainerTheme
  readonly orderedList: TextContainerTheme
  readonly unorderedList: TextContainerTheme
  readonly horizontalRule: TextContainerTheme
}

/**
 * RunThemes - Run text themes accessible via `theme.runs`.
 *
 * Each run type has a TextContainerTheme that can be applied to run text styling.
 * All run themes have sensible defaults.
 */
interface RunThemes {
  readonly strong: TextContainerTheme
  readonly emphasis: TextContainerTheme
  readonly strikethrough: TextContainerTheme
  readonly code: TextContainerTheme
  readonly mark: TextContainerTheme
  readonly link: TextContainerTheme
}

/**
 * TextContainerTheme - Styling properties for rows and runs defined in themes.
 *
 * All properties are optional. When a property is undefined, the style
 * should generally not apply a value. Use the `apply()` method to
 * conveniently apply all defined properties to a text style.
 */
interface TextContainerTheme {
  /** Text color */
  readonly color?: Color
  /** Background color behind text */
  readonly backgroundColor?: Color
  /** Font family name (e.g., "SF Mono", "Helvetica") */
  readonly fontFamily?: string
  /** Font size multiplier (e.g., 1.2 = 20% larger than base) */
  readonly fontAdjust?: number
  /** Font weight */
  readonly fontWeight?: FontWeight
  /** Font traits to apply */
  readonly fontTraits?: FontTrait[]
  /** Underline styling */
  readonly underline?: TextLineTheme
  /** Strikethrough styling */
  readonly strikethrough?: TextLineTheme

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

/**
 * TextLineTheme - Styling properties for underline and strikethrough.
 *
 * All properties are optional. When a property is undefined, the style
 * should generally not apply a value.
 */
interface TextLineTheme {
  /** Line color */
  readonly color?: Color
  /** Single line style */
  readonly single?: boolean
  /** Thick line style */
  readonly thick?: boolean
  /** Double line style */
  readonly double?: boolean
  /** Dot pattern */
  readonly patternDot?: boolean
  /** Dash pattern */
  readonly patternDash?: boolean
  /** Dash-dot pattern */
  readonly patternDashDot?: boolean
  /** Dash-dot-dot pattern */
  readonly patternDashDotDot?: boolean
  /** Apply style word by word */
  readonly byWord?: boolean
}

/** Font traits that can be applied to text */
type FontTrait = 'italic' | 'bold' | 'expanded' | 'condensed' | 'monospace'

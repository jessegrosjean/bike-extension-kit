import { RelativeOutlinePath } from '../core/outline-path'
import { Image, Font, Color, Cache as GraphicsCache } from './graphics'
import { Insets, Rect, Point, Size } from './geometry'

/**
 * Defines OutlineStyle – Ordered list of style rules.
 *
 * Each rule is a function. The rule is called when its outline path matches the
 * current element being styled. The rule function modifies the passed in style
 * object, and then that object is passed on to the next matching rule.
 *
 * Rules should be ordered from least specific to most specific. The first rule
 * sets the general style, following rules can modify that style for specific
 * situations. Unlike CSS there is no specificity calculation, rules are always
 * processed in defined order.
 *
 * Rule functions are cached. The same set of inputs to a rule should always
 * generate the same output style object. Never use global mutable state in rule
 * logic or you will get unexpected results. Unlike CSS, you can read the
 * incomming rule state, and make decisions based on that state.
 *
 * Rules are organized into layers. Use `defineOutlineStyleModifier` to inject
 * new rules into existing outline style layers.
 *
 * Example (new outline style):
 * ```ts
 * let style = defineOutlineStyle("my-style", "My Style")
 *
 * style.layer("base", (row, run, caret, viewport) => {
 *   row(`.*`, (editor, row) => {
 *     row.padding = new Insets(10, 10, 10, 28)
 *   })
 *   run('.@emphasized', (editor, text) => {
 *     text.font = text.font.withItalics()
 *   })
 * })
 * ```
 * @param id - Outline style id
 * @param displayName - User visible outline style name
 */
declare function defineOutlineStyle(id: string, displayName: string): OutlineStyle

/**
 * OutlineStyleModifier – Insert rules into existing OutlineStyles.
 *
 * Rules defined here are merged into existing styles whose `id` matches
 * `matchingOutlineStyleIds`. If that matcher is not set then these rules are
 * merged into all outline styles. outline styles that are modified.
 *
 * @param id - Outline style modifier id
 * @param displayName - User visible outline style modifier name
 * @param matchingOutlineStyleIds - Regular expression to match outline style
 *   ids that this modifier should be applied to. If not set then this modifier
 *   is applied to all outline styles.
 */
declare function defineOutlineStyleModifier(
  id: OutlineStyleId,
  name: string,
  matchingOutlineStyleIds?: RegExp
): OutlineStyle

export interface OutlineStyle {
  /**
   * Add/Modify an outline style rules layer.
   *
   * Layers are ordered by when they are first named. The rules within a layer
   * are ordered by definition order. If `layer` is called multiple times with
   * the same name, the new rules are added to the end of the existing layer.
   *
   * The purpose of layers is to group rules together, and allow later style
   * modifiers to insert rules into known locations.
   *
   * Example:
   * ```ts
   * outlineStyle.layer("base", (row, run, caret, viewport) => {
   *   row(`.*`, (editor, row) => {
   *     row.padding = new Insets(10, 10, 10, 28)
   *   })
   * })
   * ```
   * @param name - Layer name
   * @param rulesCallback - Callback to define rules for this layer.
   */
  layer(
    name: RulesLayerName,
    rulesCallback: (
      /**
       * Define a row rule.
       * @param match - The outline path to match rows.
       * @param apply - Function to modify the matched row style.
       */
      row: (match: RelativeOutlinePath, apply: (editor: Editor, row: RowStyle) => void) => void,
      /**
       * Define a text run rule.
       * @param match - The outline path to match runs.
       * @param apply - Function to modify the matched run style.
       */
      run: (match: RelativeOutlinePath, apply: (editor: Editor, run: TextRunStyle) => void) => void,
      /**
       * Define a caret rule. Generally this only needs to be used once per
       * outline style, by convention it is defined in the base layer.
       * @param apply - Function to modify the caret style.
       */
      caret: (apply: (editor: Editor, caret: CaretStyle) => void) => void,
      /**
       * Define a viewport rule. Generally this only needs to be used once per
       * outline style, by convention it is defined in the base layer.
       * @param apply - Function to modify the viewport style.
       */
      viewport: (apply: (editor: Editor, viewport: ViewportStyle) => void) => void,
      /**
       * Include rules from another outline style layer.
       *
       * For example, you might want to `include('bike', 'run-formatting')` to
       * add the standard run formatting rules. This saves typing and means
       * you'll get updated run-formatting rules when the standard Bike style
       * changes.
       *
       * The includes added immediately and won't contain any rules added later
       * by modifiers. Expectation is you will only include rules from the
       * standard `bike` outline style, or some future standard style that also
       * ships with Bike.
       *
       * @param fromId Outline style id to import from
       * @param fromLayer The rules layer to import
       */
      include: (fromId: OutlineStyleId, fromLayer: RulesLayerName) => void
    ) => void
  ): void
}

type OutlineStyleId = string

/**
 * RulesLayerName - The name of a rules layer.
 *
 * The name is used to identify the layer when defining rules. The name is also
 * used to identify the layer when modifying existing styles.
 */
type RulesLayerName =
  | 'base' // Default rows/runs (*) formatting
  | 'row-formatting' // Row type formatting
  | 'run-formatting' // Inline text formatting
  | 'controls' // Controls formatting
  | 'selection' // Selection formatting
  | 'outline-focus' // Focus row formatting
  | 'text-focus' // Text focus formatting (word/sentence/paragraph)
  | 'filter-match' // Filter match formatting
  | 'highlights' // Highlight formatting
  | string

/**
 * Editor – Editor state passed to stylesheet `apply` functions.
 *
 * Use this state in rule definitions to determine the applied style values.
 * Cache values derived from this state in `userCache` to avoid recomputing
 * them. Anytime editor state changes the `userCache` is also invalidated.
 */
interface Editor {
  /** Ordered row index being styled  */
  orderedIndex?: number
  /** True when editor has keyboard focus  */
  isKey: boolean
  /** True when editor is typing (mouse hidden)  */
  isTyping: boolean
  /** True when editor is filtering  */
  isFiltering: boolean
  /** True when in dark mode  */
  isDarkMode: boolean
  /** True when in full screen mode  */
  isFullScreen: boolean
  /** Size of the editor's viewport  */
  viewportSize: Size
  /** Editor Theme  */
  theme: EditorTheme
  /** Editor Settings  */
  settings: EditorSettings
  /** Cache for values derived from this editor state */
  userCache: Map<string, any>
}

interface EditorTheme {
  /** Theme font  */
  font: Font
  /** Theme text color  */
  textColor: Color
  /** Theme accent color  */
  accentColor: Color
  /** Theme background color  */
  backgroundColor: Color
  /** Theme line height multiple  */
  lineHeightMultiple: number
  /** Theme row spacing multiple  */
  rowSpacingMultiple: number
  /** Show caret line setting  */
  showCaretLine: boolean
  /** Show guide lines setting  */
  showGuideLines: boolean
}

interface EditorSettings {
  /** Focus mode setting  */
  focusMode?: FocusMode
  /** Typewriter mode setting (0-1)  */
  typewriterMode?: number
  /** Wrap to column setting  */
  wrapToColumn?: number
  /** Hide controls when typing setting  */
  hideControlsWhenTyping: boolean
}

type FocusMode = 'paragraph' | 'sentence' | 'word'

/** CaretStyle – The global text caret style */
interface CaretStyle {
  /** The caret color  */
  color: Color
  /** The caret width  */
  width: number
  /** The caret blink style  */
  blinkStyle: CaretBlinkStyle
  /** The caret line background color  */
  lineColor: Color
  /** The font of caret messages */
  messageFont: Font
  /** The color of caret messages */
  messageColor: Color
  /** The font of caret loaded attributes */
  loadedAttributesFont: Font
  /** The color of caret loaded attributes */
  loadedAttributesColor: Color
}

/** CaretBlinkStyle - Caret blink style */
type CaretBlinkStyle = 'discrete' | 'continuous' | 'none'

/** ViewportStyle – The global viewport style */
interface ViewportStyle {
  /** The viewport insets  */
  padding: Insets
  /** The viewport background  */
  backgroundColor: Color
}

/**
 * RowStyle – The style for a row in the outline.
 *
 * Row style only applies to an individual row, not to the rows contained by
 * this row.
 */
interface RowStyle extends DecorationContainer {
  /** Opacity (0-1) */
  opacity: number

  /** The row padding. Generally used to create outline indentation */
  padding: Insets
  /** The row's text style, effects only the matched rows text, not contained rows */
  text: TextStyle
}

//either move opacity to textstyle (best I think) or move scale to RowStyle

/**
 * TextStyle - The style for row text.
 */
interface TextStyle extends TextContainer {
  /** Text scale */
  scale: number
  /** The line height multiple */
  lineHeightMultiple: number
}

/**
 * TextRunStyle – The style for text runs.
 */
interface TextRunStyle extends TextContainer {
  /** Enclosing text's scale */
  readonly scale: number

  /**
   * Attachment size.
   *
   * Ignored unless text run contains a single attatchment character. Currently
   * only used when implementing hr's. The size values are interpreted based on
   * the range of the value (default 1):
   *
   * 1. 0-1: Interpreted as a percentage of line width/height.
   * 2. > 1: Interpreted as a fixed point size.
   */
  attachmentSize: Size
}

/** Ligature - Text ligature style */
type Ligature = 'default' | 'none' | 'all'

/** TextLine - Wrapps a NSUnderlineStyle. */
interface TextLineStyle {
  /** The color of the line. */
  color: Color
  /** True enables the single line flag. */
  single: boolean
  /** True enables the thick line flag. */
  thick: boolean
  /** True enables the double line flag. */
  double: boolean
  /** True enables the patternSolid flag. */
  patternDot: boolean
  /** True enables the patternDash flag. */
  patternDash: boolean
  /** True enables the patternDashDot flag. */
  patternDashDot: boolean
  /** True enables the patternDashDotDot flag. */
  patternDashDotDot: boolean
  /** True enables the byWord flag. */
  byWord: boolean
}

/**
 * TextContainer - Common text style properties shared by TextStyle and TextRunStyle
 */
interface TextContainer extends DecorationContainer {
  /** Text font */
  font: Font
  /** The run kerning (default 0) */
  kerning: number
  /** The run tracking (default 0) */
  tracking: number
  /** The run ligature */
  ligature: Ligature
  /** The run baseline offset */
  baselineOffset: number
  /** Text foreground color */
  color: Color
  /** Text background color */
  backgroundColor: Color
  /** Text underline style */
  underline: TextLineStyle
  /** Text strikethrough style */
  strikethrough: TextLineStyle
  /** Text margins */
  margin: Insets
  /** Text padding */
  padding: Insets
}

/**
 * DecorationContainer - And object to which visual decorations are attatched.
 * Row, Row text, and Row text runs are all decoration containers. Decoration
 * containers provide methods to add and modify decorations and provide the
 * layout object that's used to position the decorations relative to the
 * container.
 */
interface DecorationContainer {
  /**
   * Add/Modify decoration by id.
   *
   * @param id - Decoration id
   * @param modify - Function to modify decoration
   */
  decoration(id: string, modify: (decoration: Decoration, layout: Layout) => void): void

  /**
   * List and modify all existing decorations.
   *
   * @param modify - Function to modify each existing decoration
   */
  decorations(modify: (decoration: Decoration, layout: Layout) => void): void
}

/**
 * Decoration - Add visual decorations to outline.
 *
 * Decorations are used to add visual attachements to a row, row text, or row
 * text run. They can have a background color, border, and corner radius. They
 * can also have image content. Decorations do not effect layout, you need to
 * make space for them using row and text padding and margins.
 *
 * Decorations closely wrap a `CALayer`. Look into the `CALayer` documentation
 * for more information on possiblilities.
 */
interface Decoration {
  /** Optional action triggered when clicked */
  action?: Action
  /** Hidden (default false) */
  hidden: boolean
  /** Opacity (0-1) */
  opacity: number
  /** Optional border */
  border: DecorationBorder
  /** Corners */
  corners: DecorationCorners
  /** Optional layer contents */
  contents: DecorationContents
  /** Background color */
  color: Color
  /** Radian rotation (default 0) */
  rotation: number
  /** Depth ordering (default 0) */
  zPosition: number
  /** Relative (0-1) Position on decoration that is positioned (default to center, 0.5, 0.5) */
  anchor: Point
  /** The x value (default container center) */
  x: LayoutValue
  /** The y value (default container center) */
  y: LayoutValue
  /** The width value (default fill container) */
  width: LayoutValue
  /** The height value (default fill container) */
  height: LayoutValue
  /**
   * The properties to animate when using updating decoration. (default all)
   */
  readonly transitions: {
    color: boolean
    opacity: boolean
    rotation: boolean
    position: boolean
    size: boolean
  }
}

type DecorationPropertyTransition = {}

// Action - NOT WORKING YET!
type Action = 'toggle-fold' | 'toggle-done' | 'toggle-focus'

/**
 * Layout - Decorations are positioned relative to a layout.
 *
 * The layout provides access to layout values which are assigned to the
 * decorations x, y, width, and height. Layout values can be used on own, or
 * combined with each other in various ways.
 *
 * Layouts also provide access to two child layouts: `firstLine` and `lastLine`.
 * For example to get the layout value for the bottom of the first line of a
 * row you could use `layout.firstLine.bottom`. While in the same context
 * `layout.bottom` would give the layout value for the bottom of the row.
 */
interface Layout {
  text: Layout
  firstLine: Layout
  lastLine: Layout
  width: LayoutValue
  height: LayoutValue
  top: LayoutValue
  bottom: LayoutValue
  baseline: LayoutValue
  centerY: LayoutValue
  leading: LayoutValue
  leadingContent: LayoutValue
  trailing: LayoutValue
  centerX: LayoutValue
  fixed(value: number): LayoutValue
}

/**
 * LayoutValue - A logical layout value that is resolved to a number by the
 * layout process and then used to set a Decoration's x, y, width, and height
 * properties.
 */
interface LayoutValue {
  /** Construct a new LayoutValue that is the min between the this and the value parameter. */
  min(value: number | LayoutValue): LayoutValue
  /** Construct a new LayoutValue that is the max between the this and the value parameter. */
  max(value: number | LayoutValue): LayoutValue
  /** Construct a new LayoutValue that is this value multiplied by the value parameter. */
  scale(value: number | LayoutValue): LayoutValue
  /** Construct a new LayoutValue that is this value offset by the value parameter. */
  offset(value: number | LayoutValue): LayoutValue
  /** Construct a new LayoutValue that is this value minus the value parameter. */
  minus(value: number | LayoutValue): LayoutValue
}

/** DecorationBorder - Wraps CALayer border */
interface DecorationBorder {
  /** Line color */
  color: Color
  /** Line width */
  width: number
}

/** DecorationCorners - Wraps CALayer corner */
interface DecorationCorners {
  /** Corner radius */
  radius: number
  /** Apply radius to top right corner (default true) */
  maxXMaxYCorner: boolean
  /** Apply radius to bottom right corner (default true) */
  maxXMinYCorner: boolean
  /** Apply radius to top left corner (default true) */
  minXMaxYCorner: boolean
  /** Apply radius to bottom left corner (default true) */
  minXMinYCorner: boolean
}

/**
 * DecorationContents - Wraps CALayer contents values.
 *
 * Decoration content is eventually an bitmap image, but you can construct that
 * image from text, shapes, and symbols. In addition to standard images.
 */
interface DecorationContents {
  /** Contents Image */
  image: Image
  /** Contents Rect, portion of contents to use */
  rect: Rect
  /** Contents Center, portion of contents to stretch */
  center: Rect
  /** Contents Gravity, how to position and scale contents */
  gravity: ContentsGravity
}

/** ContentsGravity - Wraps CALayerContentsGravity */
type ContentsGravity =
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'center'
  | 'left'
  | 'resize'
  | 'resizeAspect'
  | 'resizeAspectFill'
  | 'right'
  | 'top'
  | 'topLeft'
  | 'topRight'

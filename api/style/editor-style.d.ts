import { RelativeOutlinePath } from '../core/outline-path'
import { Image, Font, Color } from './graphics'
import { Insets, Rect, Point, Size } from './geometry'
import { EditorTheme } from './editor-theme'

/**
 * Defines EditorStyle – Ordered list of style rules.
 *
 * Each rule is a function with an associated outline path. The rule's function
 * is called when the outline path matches the element being styled. The rule's
 * function is passed a style object that it may modify. That style object is
 * then passed on to the next matching rule.
 *
 * Rules should be ordered from least specific to most specific. The first rule
 * sets the general style, following rules modify that style for specific
 * situations. Unlike CSS there is no specificity calculation, rules are always
 * processed in the order they are defined.
 *
 * Style objects are cached. The same set of inputs to a rule's function should
 * always generate the same style object modifications. Never use global mutable
 * state in rule logic or you will get unexpected results. Unlike CSS, you can
 * read the incoming rule state, and make decisions based on that state.
 *
 * Rules are organized into layers. Use `defineEditorStyleModifier` to inject
 * new rules into existing editor style layers.
 *
 * Example (new editor style):
 * ```ts
 * let style = defineEditorStyle("my-style", "My Style")
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
 * @param id - Editor style id
 * @param displayName - User visible editor style name
 */
declare function defineEditorStyle(id: string, displayName: string): EditorStyle

/**
 * EditorStyleModifier – Insert rules into existing EditorStyles.
 *
 * Rules defined here are merged into existing styles whose `id` matches
 * `matchingEditorStyleIds`. If that matcher is not set then these rules are
 * merged into all editor styles. editor styles that are modified.
 *
 * @param id - Editor style modifier id
 * @param displayName - User visible editor style modifier name
 * @param matchingEditorStyleIds - Regular expression to match editor style
 *   ids that this modifier should be applied to. If not set then this modifier
 *   is applied to all editor styles.
 */
declare function defineEditorStyleModifier(
  id: EditorStyleId,
  name: string,
  matchingEditorStyleIds?: RegExp
): EditorStyle

export interface EditorStyle {
  /**
   * Add/Modify an editor style rules layer.
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
   * editorStyle.layer("base", (row, run, caret, viewport) => {
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
      row: (
        match: RelativeOutlinePath,
        apply: (context: StyleContext, row: RowStyle) => void
      ) => void,
      /**
       * Define a text run rule.
       * @param match - The outline path to match runs.
       * @param apply - Function to modify the matched run style.
       */
      run: (
        match: RelativeOutlinePath,
        apply: (context: StyleContext, run: TextRunStyle) => void
      ) => void,
      /**
       * Define a caret rule. Generally this only needs to be used once per
       * editor style, by convention it is defined in the base layer.
       * @param apply - Function to modify the caret style.
       */
      caret: (apply: (context: StyleContext, caret: CaretStyle) => void) => void,
      /**
       * Define a viewport rule. Generally this only needs to be used once per
       * editor style, by convention it is defined in the base layer.
       * @param apply - Function to modify the viewport style.
       */
      viewport: (apply: (context: StyleContext, viewport: ViewportStyle) => void) => void,
      /**
       * Include rules from another editor style layer.
       *
       * For example, you might want to `include('bike', 'run-formatting')` to
       * add the standard run formatting rules. This saves typing and means
       * you'll get updated run-formatting rules when the standard Bike style
       * changes.
       *
       * The includes added immediately and won't contain any rules added later
       * by modifiers. Expectation is you will only include rules from the
       * standard `bike` editor style, or some future standard style that also
       * ships with Bike.
       *
       * @param fromId Editor style id to import from
       * @param fromLayer The rules layer to import
       */
      include: (fromId: EditorStyleId, fromLayer: RulesLayerName) => void
    ) => void
  ): void
}

type EditorStyleId = string

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
 * StyleContext – Context passed to stylesheet `apply` functions.
 *
 * Use this in rule definitions to determine the applied style values. Cache
 * values derived from this context in `userCache` to avoid recomputing them.
 * Anytime this context changes the `userCache` is also invalidated.
 */
interface StyleContext {
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
  /** Editor Settings  */
  settings: EditorSettings
  /** Editor Theme  */
  theme: EditorTheme
  /** Cache for values derived from this editor state */
  userCache: Map<string, any>

  /** Ordered row index being styled  */
  orderedIndex?: number

  /** Get counter value */
  //getCounter(name: string): number
  /** Get nested counter values */
  //getCounters(name: string): number[]
  /** Create a new counter (default initialValue is 0) */
  //createCounter(name: string, initialValue?: number): void
  /** Increment existing counter (default byValue is 1) */
  //incrementCounter(name: string, byValue?: number): void
  /** Set the value of existing counter, create if doesn't */
  //setCounter(name: string, value: number): void
}

interface EditorSettings {
  /** Show caret line  */
  showCaretLine: boolean
  /** Show guide lines  */
  showGuideLines: boolean
  /** Show focus arrows  */
  showFocusArrows: boolean
  /** Allow font scaling to better fit viewport  */
  allowFontScaling: boolean
  /** Hide controls when typing  */
  hideControlsWhenTyping: boolean
  /** Focus mode  */
  focusMode?: FocusMode
  /** Typewriter mode (0-1)  */
  typewriterMode?: number
  /** Body font  */
  font: Font
  /** Line width (characters)  */
  lineWidth?: number
  /** Line height multiple  */
  lineHeightMultiple: number
  /** Row spacing multiple  */
  rowSpacingMultiple: number
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
  /*
  NOT IMPLEMENTED: CTParagraphStyle
  headIndent: number
  tailIndent: number
  alignment: 'left' | 'right' | 'center' | 'justified' | 'natural'
  */
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
 * Decorations are attached to rows, row texts, or row text runs. They can have
 * a background color, border, and corner radius. They can also have image
 * content. Decorations do not effect layout, you need to make space for them
 * using row and text padding and margins.
 *
 * Decorations can be marked `mergable`. Similar mergable decorations may be
 * combined into a single shape. The exact merging behavior depends on where the
 * decoration is attached:
 *
 * - Text run decorations are merged when they appear in consecutive text runs,
 *   have equal styling, and touching/close frames.
 *
 *   The frames of the merged decorations are combined into a single shape that
 *   is the union of all the individual run decoration frames. This shapes
 *   corners will be rounded via the `corners.radius` property. See text
 *   selection for intented use/behavior.
 *
 * - Row and text decorations are merged when they appear in consecutive rows,
 *   have equal styling, and touching/close frames.
 *
 *   Row and text decorations are not merged into a single shape. Instead their
 *   corners are modified to match the preceding and following decoration
 *   corners to create a larger rounded shape. This will only have a visible
 *   effect when `border.radius` is applied. See block selection for intended
 *   use/behavior.
 *
 * Decorations closely wrap a `CAShapeLayer`. Look into the `CAShapeLayer`
 * documentation for more information on the possibilities.
 */
interface Decoration {
  /** Hidden (default false) */
  hidden: boolean
  /** Opacity (0-1) */
  opacity: number
  /** Optional border */
  border: DecorationBorder
  /** Corners */
  corners: DecorationCorners
  /** Optional shadow */
  shadow: DecorationShadow
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
  /** Whether the decoration can be merged with similar (see interface docs) */
  mergable: boolean
  /** Optional command name to perform when activated (clicked) */
  commandName?: string
  /** The properties to animate when using updating decoration */
  readonly transitions: {
    color: boolean // (default true)
    borderColor: boolean // (default true)
    borderWidth: boolean // (default true)
    opacity: boolean // (default true)
    rotation: boolean // (default true)
    position: boolean // (default true)
    size: boolean // (default true)
  }
}

type DecorationPropertyTransition = {}

/**
 * Layout - Decorations are positioned with layouts.
 *
 * The layout provides access to layout values which are assigned to the
 * decorations x, y, width, and height. Layout values can be used on own, or
 * combined with each other in various ways.
 *
 * Layouts also provide access to child layouts such as `text`, `firstLine` and
 * `lastLine`. For example to get the layout value for the bottom of the first
 * line of a row you could use `layout.firstLine.bottom`. While in the same
 * context `layout.bottom` would give the layout value for the bottom of the
 * row.
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

/** DecorationShadow - Wraps CALayer shadow */
interface DecorationShadow {
  /** Shadow color */
  color: Color
  /** Shadow opacity */
  opacity: number
  /** Shadow blur radius */
  radius: number
  /** Shadow offset */
  offset: {
    /** Shadow offset width */
    width: number
    /** Shadow offset height */
    height: number
  }
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

import { Image, Font, Color, Cache as GraphicsCache } from "./graphics"
import { RelativeOutlinePath } from "../app/outline-path";
import { Insets, Rect, Point, Size } from "./geometry"
import { RelativeOrdering } from "../app/bike";

interface StyleSheets {
    addStyleSheet(name: StyleSheetName): void;
    addStyleSheetModifier(modifier: (styleSheet: StyleSheet) => void): void;
}

export type StyleSheetName = string;

/** 
* StyleSheet – Collection of style rules for the outline editor.
*
* Each rule is a function. The function is called when the associted
* outline path matches the row/run that is being styled. Passed into the
* function is the current environment and current style object for the item
* being styled. The function can modify the style object, and in that way
* apply a new style.
*
* Functions are organized into layers. Each layer is a ordered list of
* style rules. The layers are processed in order and all matching functions
* in one layer are called before functions in a later layer.
*/
export class StyleSheet {
    addRowStyle(layer: RelativeOrdering<Layer, String>, path: RelativeOutlinePath, apply: (environment: Environment, row: RowStyle) => void): void;
    addRunStyle(layer: RelativeOrdering<Layer, String>, path: RelativeOutlinePath, apply: (environment: Environment, row: TextRunStyle) => void): void;
    addCaretStyle(layer: RelativeOrdering<Layer, String>, path: RelativeOutlinePath, apply: (environment: Environment, caret: CaretStyle) => void): void;
    addViewportStyle(layer: RelativeOrdering<Layer, String>, path: RelativeOutlinePath, apply: (environment: Environment, viewport: ViewportStyle) => void): void;
}

type Layer = 
'defaults' | // Apply to all rows/runs
'rowformatting' | // Apply to specific row types
'inlineformatting' | // Apply to inline rows
'selection' | // Apply to inline rows
'focus' | // Apply to inline rows
'extensions' // Added by extensions

/** Environment – The environment passed into the stylesheet `apply` functions */
interface Environment {
    /** User specified settings  */
    settings: Settings;
    /** True when editor has keyboard focus  */
    isKey: boolean;
    /** True when editor is typing (mouse hidden)  */
    isTyping: boolean;
    /** True when editor is filtering  */
    isFiltering: boolean;
    /** Size of the editor's viewport  */
    viewportSize: Size;
    /** Ordered row index  */
    orderedIndex?: number;
    /** Cache to use when resolving images, fonts, and colors  */
    graphicsCache: GraphicsCache;
    /** Cache for computed values derived from the environment */
    userCache: Object;
}

/** Settings – User settings that style rules should generally follow. */
interface Settings {
    font: Font;
    wrapToColumn?: number;
    lineHeightMultiple: number;
    rowSpacingMultiple: number;
    isFullScreen: boolean;
    isDarkMode: boolean;
    textColor: Color;
    accentColor: Color;
    backgroundColor: Color;
    focusMode?: FocusMode
    /** 0-1 value representing y-postion in viewport that will be scrolled to  */
    typewriterMode?: number;
    showCaretLine: boolean;
    showGuideLines: boolean;
    hideControlsWhenTyping: boolean;
}

type FocusMode = 'paragraph' | 'sentence' | 'word'

/** CaretStyle – The global text caret style */
interface CaretStyle {
    /** The caret color  */
    color: Color;
    /** The caret width  */
    width: number;
    /** The caret blink style  */
    blinkStyle: CaretBlinkStyle;
    /** The caret line background color  */
    lineColor: Color
    /** The font of caret messages */
    messageFont: Font
    /** The color of caret messages */
    messageColor: Color;
    /** The font of caret loaded attributes */
    loadedAttributesFont: Font
    /** The color of caret loaded attributes */
    loadedAttributesColor: Color;
}

/** CaretBlinkStyle - Caret blink style */
type CaretBlinkStyle = 'discrete' | 'continuous' | 'none'

/** ViewportStyle – The global viewport style */
interface ViewportStyle {
    /** The viewport insets  */
    padding: Insets;
    /** The viewport background  */
    backgroundColor: Color;
}

/**
* RowStyle – The style for a row in the outline.
*
* Row style only applies to an individual row, not to the rows contained by
* this row.
*/
interface RowStyle extends DecorationContainer {
    /** Opacity (0-1) */
    opacity: number;
    
    /** The row padding. Generally used to create outline indentation */
    padding: Insets;
    /** The row's text style, effects only the matched rows text, not contained rows */
    text: TextStyle;
}

/**
* TextStyle - The style for row text.
*/
interface TextStyle extends TextContainer {
    /** Text scale */
    scale: number
    /** The line height multiple */
    lineHeightMultiple: number;
}

/**
* TextRunStyle – The style for text runs.
*/
interface TextRunStyle extends TextContainer {
    /** Enclosing text's scale */
    readonly scale: number
    
    /**
    * Attachment size. Ignored unless text run contains a singel attatchment
    * character. Frontmostly only used when implementing hr's.
    *
    * 0-1 percent of line width. >1 fixed size (defaults 1) 0-1 percent of line
    * height. >1 fixed size (defaults 1)
    */
    attachmentSize: Size;
}

/** Ligature - Text ligature style */
type Ligature = 'default' | 'none' | 'all'

/** TextLine - Wrapps a NSUnderlineStyle. */
interface TextLineStyle {
    /** The color of the line. */
    color: Color;
    /** True enables the single line flag. */
    single: boolean;
    /** True enables the thick line flag. */
    thick: boolean;
    /** True enables the double line flag. */
    double: boolean;
    /** True enables the patternSolid flag. */
    patternDot: boolean;
    /** True enables the patternDash flag. */
    patternDash: boolean;
    /** True enables the patternDashDot flag. */
    patternDashDot: boolean;
    /** True enables the patternDashDotDot flag. */
    patternDashDotDot: boolean;
    /** True enables the byWord flag. */
    byWord: boolean;
}

/**
* TextContainer - Common text style properties shared by TextStyle and TextRunStyle
*/
interface TextContainer extends DecorationContainer {
    /** Text font */
    font: Font;
    /** The run kerning (default 0) */
    kerning: number;
    /** The run tracking (default 0) */
    tracking: number;
    /** The run ligature */
    ligature: Ligature;
    /** The run baseline offset */
    baselineOffset: number;
    /** Text foreground color */
    color: Color;
    /** Text background color */
    backgroundColor: Color;
    /** Text underline style */
    underline: TextLineStyle;
    /** Text strikethrough style */
    strikethrough: TextLineStyle;
    /** Text margins */
    margin: Insets;
    /** Text padding */
    padding: Insets;
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
    decoration(id: string, modify: (decoration: Decoration, layout: Layout) => void): void;
    
    /**
    * List and modify all existing decorations.
    *
    * @param modify - Function to modify each existing decoration
    */
    decorations(modify: (decoration: Decoration, layout: Layout) => void): void;
}

/**
* Decoration - Add visual decoration's to outline.
*
* Decorations are used to draw visuals that are attached to a row or text run.
* They can have a background color, border, and corner radius. They can also
* have image content. Decorations do not effect layout, you need to make space
* for them using row and text padding and margins.
*
* Decorations closely wrap a `CALayer`. Look into the `CALayer` documentation
* for more information on possiblilities.
*/
interface Decoration {
    /** Optional action triggered when clicked */
    action?: Action;
    /** Hidden (default false) */
    hidden: boolean;
    /** Opacity (0-1) */
    opacity: number;
    /** Optional border */
    border: DecorationBorder;
    /** Corners */
    corners: DecorationCorners;
    /** Optional layer contents */
    contents: DecorationContents;
    /** Background color */
    color: Color;
    /** Radian rotation (default 0) */
    rotation: number;
    /** Depth ordering (default 0) */
    zPosition: number;
    /** Relative (0-1) Position on decoration that is positioned (default to center, 0.5, 0.5) */
    anchor: Point;
    /** The x value (default container center) */
    x: LayoutValue;
    /** The y value (default container center) */
    y: LayoutValue;
    /** The width value (default fill container) */
    width: LayoutValue;
    /** The height value (default fill container) */
    height: LayoutValue;
    
    // Transitions?
    // Animations?
}

// Action - NOT WORKING YET!
type Action = "toggle-fold" | "toggle-done" | "toggle-focus";

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
    firstLine: Layout
    lastLine: Layout
    width: LayoutValue
    height: LayoutValue
    top: LayoutValue
    bottom: LayoutValue
    baseline: LayoutValue
    centerY: LayoutValue
    leading: LayoutValue
    trailing: LayoutValue
    centerX: LayoutValue
    fixed(value: number): LayoutValue;
}

/**
* LayoutValue - A logical layout value that is resolved to a number by the
* layout process and then used to set a Decoration's x, y, width, and height
* properties.
*/
interface LayoutValue {
    /** Construct a new LayoutValue that is the min between the this and the value parameter. */
    min(value: number | LayoutValue): LayoutValue;
    /** Construct a new LayoutValue that is the max between the this and the value parameter. */
    max(value: number | LayoutValue): LayoutValue;
    /** Construct a new LayoutValue that is this value multiplied by the value parameter. */
    scale(value: number | LayoutValue): LayoutValue;
    /** Construct a new LayoutValue that is this value offset by the value parameter. */
    offset(value: number | LayoutValue): LayoutValue;
    /** Construct a new LayoutValue that is this value minus the value parameter. */
    minus(value: number | LayoutValue): LayoutValue;
}

/** DecorationBorder - Wraps CALayer border */
interface DecorationBorder {
    /** Line color */
    color: Color;
    /** Line width */
    width: number;
}

/** DecorationCorners - Wraps CALayer corner */
interface DecorationCorners {
    /** Corner radius */
    radius: number;
    /** Apply radius to top right corner (default true) */
    maxXMaxYCorner: boolean;
    /** Apply radius to bottom right corner (default true) */
    maxXMinYCorner: boolean;
    /** Apply radius to top left corner (default true) */
    minXMaxYCorner: boolean;
    /** Apply radius to bottom left corner (default true) */
    minXMinYCorner: boolean;
}

/**
* DecorationContents - Wraps CALayer contents values.
*
* Decoration content is eventually an bitmap image, but you can construct that
* image from text, shapes, and symbols. In addition to standard images.
*/
interface DecorationContents {
    /** Contents Image */
    image: Image;
    /** Contents Rect, portion of contents to use */
    rect: Rect;
    /** Contents Center, portion of contents to stretch */
    center: Rect;
    /** Contents Gravity, how to position and scale contents */
    gravity: ContentsGravity;
}

/** ContentsGravity - Wraps CALayerContentsGravity */
type ContentsGravity =
'bottom' |
'bottomLeft' |
'bottomRight' |
'center' |
'left' |
'resize' |
'resizeAspect' |
'resizeAspectFill' |
'right' |
'top' |
'topLeft' |
'topRight';
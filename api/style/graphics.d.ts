import { Insets, Size, Path, LineCap, LineJoin, FillRule } from "./geometry"

interface Cache {
}

/** Image - Used for Decoration content */
export class Image {
    static none(): Image;
    static fromText(text: Text): Image;
    static fromShape(shape: Shape): Image;
    static fromSymbol(symbol: SymbolConfiguration): Image;
    
    constructor(name: string);
    
    /** @returns A new image with new size */
    withSize(size: Size): Image;
    /** @returns A new image with scaled size */
    withScale(scale: number): Image;
    /** @returns A new image by compositing this image with parameter */
    withComposite(image: Image): Image;
    /** @returns Resolved image attributes */
    resolve(cache: Cache): {
        width: number
        height: number
    };
}

/**
* Text - Text with a font, color, and string. Use as decoration image content.
*/
export class Text {
    font: Font;
    color: Color;
    string: string;
    constructor(string: String, font?: Font, color?: Color);
}

/**
* Shape - Path with stroke and color. Use as decoration image content.
*/
export class Shape {
    path: Path;
    line: ShapeLine;
    fill: ShapeFill;
    stroke: ShapeStroke;
    padding: Insets;
    constructor(path: Path);
}

interface ShapeLine {
    cap: LineCap;
    dashPattern?: [number];
    dashPhase: number;
    join: LineJoin;
    width: number;
    miterLimit: number;
}

interface ShapeFill {
    color: Color;
    rule: FillRule;
}

interface ShapeStroke {
    color: Color;
    start: number;
    end: number;
}

/**
* SymbolConfiguration – Wraps NSImage.SymbolConfiguration. Use as decoration
* image content
*/
export class SymbolConfiguration {
    constructor(name: string, variableValue?: number);
    
    withFont(font: Font): SymbolConfiguration;
    withSymbolScale(scale: SymbolScale): SymbolConfiguration;
    withHierarchicalColor(color: Color): SymbolConfiguration;
    withPaletteColors(colors: [Color]): SymbolConfiguration;
    preferingMonochrome(): SymbolConfiguration;
    preferingMulticolor(): SymbolConfiguration;
    preferingHierarchical(): SymbolConfiguration;
}

/** SymbolConfigurationScale – Use font for symbol size, then adjust with symbol scale */
type SymbolScale =
'small' |
'medium' |
'large';

/**
* Font - Wraps a `NSFontDescriptor`.
*
* This class can be a bit mysterious to work with. You are creating a
* description of a font that you want, but sometimes that described font might
* not exist. For example the following font might surprise:
*
* ```
* new Font("Helvetica", 24).withMonospace()
* ```
*
* You will likely get Helvetica at 24 points. The `withMonospaced` call will
* have no effect because there isn't a monospaced version of Helvetica on your
* computer.
*
* Generally if you are confused look into how `NSFontDescriptor` works. This is
* a light wrapper around that class.
*/
export class Font {
    
    static systemBody(): Font;
    static systemCallout(): Font;
    static systemCaption1(): Font;
    static systemCaption2(): Font;
    static systemFootnote(): Font;
    static systemHeadline(): Font;
    static systemSubheadline(): Font;
    static systemLargeTitle(): Font;
    static systemTitle1(): Font;
    static systemTitle2(): Font;
    static systemTitle3(): Font;
    
    /**
    * @param name - The font family, ex. "Helvetica"
    * @param pointSize - The font point size, ex. 12
    */
    constructor(name: string, pointSize: number);
    
    /** @returns A new font with family */
    withFamily(family: String): Font;
    
    /** @returns A new font with face */
    withFace(face: String): Font;
    
    /** @returns A new font with point size */
    withPointSize(pointSize: number): Font;
    
    /** @returns A new font with weigth */
    withWeight(weight: FontWeight): Font;
    
    /** @returns A new font with bold trait */
    withBold(): Font;
    
    /** @returns A new font with italic trait */
    withItalics(): Font;
    
    /** @returns A new font with monospace trait */
    withMonospace(): Font;
    
    /** @returns A new font with small caps features */
    withSmallCaps(): Font;
    
    /** @returns A new font with lowercase small caps features */
    withLowercaseSmallCaps(): Font;
    
    /** @returns A new font with uppercase small caps features */
    withUppercaseSmallCaps(): Font;
    
    /** @returns A new font with monospaced digit features */
    withMonospacedDigit(): Font;
    
    /** @returns Resolved font attributes */
    resolve(cache: Cache): {
        name: String,
        pointSize: number
        ascender: number
        descender: number
        xHeight: number
        xWidth: number
        maximumAdvancement: Size
    };
}

/** FontWeight */
type FontWeight =
'ultraLight' |
'thin' |
'light' |
'regular' |
'medium' |
'semibold' |
'bold' |
'heavy' |
'black';

/** Color - Wraps an unerlying CGColor. */
export class Color {
    static none(): Color;
    static black(): Color;
    static white(): Color;
    static clear(): Color;
    static controlAccent(): Color;
    
    static text(): Color;
    static textHeader(): Color;
    static textBackground(): Color;
    static textBackgroundSelected(): Color;
    static textInsertionPoint(): Color;
    static selectedContentBackground(): Color;
    static unemphasizedSelectedContentBackground(): Color;
    
    static label(): Color;
    static secondaryLabel(): Color;
    static tertiaryLabel(): Color;
    static quaternaryLabel(): Color;
    static quinaryLabel(): Color;
    
    static link(): Color;
    static shadow(): Color;
    static separator(): Color;
    static highlight(): Color;
    static findHighlight(): Color;
    
    static systemBlue(): Color;
    static systemBrown(): Color;
    static systemCyan(): Color;
    static systemGray(): Color;
    static systemGreen(): Color;
    static systemIndigo(): Color;
    static systemMint(): Color;
    static systemOrange(): Color;
    static systemPink(): Color;
    static systemPurple(): Color;
    static systemRed(): Color;
    static systemTeal(): Color;
    static systemYellow(): Color;
    
    /**
    * @param white - The white component (0-1)
    */
    static gray(white: number): Color
    
    /**
    * @param image - The image to use as a tile pattern when filling the color
    */
    static pattern(image: Image): Color
    
    /**
    * @param red - The red component (0-1)
    * @param green - The green component (0-1)
    * @param blue - The blue component (0-1)
    * @param alpha - The alpha component (0-1)
    */
    constructor(red: number, green: number, blue: number, alpha: number);
    
    /**
    * @param alpha - The alpha component (0-1)
    * @returns A new color with the same RGB components and the specified alpha component
    */
    withAlpha(alpha: number): Color;
    
    /**
    * @param fraction - The fraction of the color to blend with (0-1)
    * @param color - The color to blend with
    * @returns A new color with the specified fraction of the specified color blended in
    */
    withFraction(fraction: number, color: Color): Color;
    
    /** @returns Resolved color attributes */
    resolve(cache: Cache): {
        alpha: number,
        pattern?: Image
        components?: {
            red: number
            green: number
            blue: number
        }
    };
}

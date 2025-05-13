/** Path - Wraps an unerlying CGPath. */
export class Path {
  static rect(rect: Rect, transform?: AffineTransform): Path
  static roundedRect(
    rect: Rect,
    cornerWidth: number,
    cornerHeight: number,
    transform?: AffineTransform
  ): Path
  static elipseInRect(rect: Rect, transform?: AffineTransform): Path

  constructor()

  copy(transform?: AffineTransform): Path
  copyDashing(phase: number, lengths: number[], transform?: AffineTransform): Path
  copyStroking(
    width: number,
    lineCap: LineCap,
    lineJoin: LineJoin,
    miterLimit: number,
    transform?: AffineTransform
  ): Path

  componentsSeparated(using?: FillRule): [Path]
  flattened(threshhold: number): Path
  intersection(other: Path, using?: FillRule): Path
  lineIntersection(other: Path, using?: FillRule): Path
  lineSubtracting(other: Path, using?: FillRule): Path
  normalized(using?: FillRule): Path
  subtracting(other: Path, using?: FillRule): Path
  symetricDifference(other: Path, using?: FillRule): Path
  union(other: Path, using?: FillRule): Path

  moveTo(point: Point, transform?: AffineTransform): void
  addLineTo(point: Point, transform?: AffineTransform): void
  addRect(rect: Rect, transform?: AffineTransform): void
  addRoundedRect(
    rect: Rect,
    cornerWidth: number,
    cornerHeight: number,
    transform?: AffineTransform
  ): void
  addEllipseInRect(rect: Rect, transform?: AffineTransform): void
  addArc(
    center: Point,
    radius: number,
    startAngle: number,
    endAngle: number,
    clockwise: boolean,
    transform?: AffineTransform
  ): void
  addRelativeArc(
    center: Point,
    radius: number,
    startAngle: number,
    delta: number,
    transform?: AffineTransform
  ): void
  addCurveTo(point: Point, control1: Point, control2: Point, transform?: AffineTransform): void
  addQuadCurveTo(point: Point, control: Point, transform?: AffineTransform): void
  addPath(path: Path, transform?: AffineTransform): void

  closeSubpath(): void
}

type LineCap = 'butt' | 'round' | 'square'
type LineJoin = 'miter' | 'round' | 'bevel'
type FillRule = 'evenOdd' | 'winding'

/** AffineTransform - Wraps an unerlying CGAffineTransform. */
export class AffineTransform {
  constructor()

  readonly isIdentity: boolean

  a: number
  b: number
  c: number
  d: number
  tx: number
  ty: number

  concating(transform: AffineTransform): AffineTransform
  inverted(): AffineTransform
  rotatedBy(radians: number): AffineTransform
  scaledBy(x: number, y: number): AffineTransform
  translatedBy(x: number, y: number): AffineTransform
}

/** Insets - Wraps a NSEdgeInsets. */
export class Insets {
  static zero(): Insets

  constructor(top: number, right: number, bottom: number, left: number)

  /** The top inset */
  top: number
  /** The right inset */
  right: number
  /** The bottom inset */
  bottom: number
  /** The left inset */
  left: number

  readonly width: number
  readonly height: number

  scaled(scale: number): Insets
}

/** Rect - Wraps an unerlying CGRect. */
export class Rect {
  static zero(): Rect

  constructor(x: number, y: number, width: number, height: number)

  x: number
  y: number
  width: number
  height: number
}

/** Point - Wraps an unerlying CGPoint. */
export class Point {
  static zero(): Point

  constructor(x: number, y: number)

  x: number
  y: number
}

/** Size - Wraps an unerlying CGSize. */
export class Size {
  static zero(): Size

  constructor(width: number, height: number)

  width: number
  height: number
}

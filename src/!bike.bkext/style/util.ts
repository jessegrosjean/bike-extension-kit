import {
  Color,
  StyleContext,
  Font,
  FontAttributes,
  Image,
  Insets,
  Path,
  Point,
  Shape,
  SymbolConfiguration,
} from 'bike/style'

/**
 * This function computes/caches values derived from `StyleContext` state. Bike
 * styles should use `context.settings` and `context.theme` values directly
 * where appropriate, but this function is useful for values that need
 * computation or caching.
 *
 * For example, consider the case where the editor is wrapping text to a
 * specific column (`lineWidth`) while displaying in a large viewport. In
 * that case we can end up with a tiny column of text in the center of a large
 * viewport. This function detects that case and dynamically scales the user's
 * choosen font to better fill the viewport, while maintaining the user's
 * `lineWidth` setting.
 *
 * This function is not a required part of an editor style, but I think it's a
 * useful pattern, especially for more complex editor styles that try to work
 * under a variety of conditions.
 *
 * @param context
 * @returns The computed values derived from the context
 */
export function computeValues(context: StyleContext): {
  font: Font
  fontAttributes: FontAttributes
  indent: number
  uiScale: number
  rowPadding: Insets
  rowTextMargin: Insets
  rowTextPadding: Insets
  viewportPadding: Insets
  secondaryControlAlpha: number
  handleImage: Image
  outlineFocusAlpha: number
  textFocusAlpha: number
} {
  if (context.userCache.has('values')) {
    return context.userCache.get('values')
  }

  let font = context.settings.font
  let viewportSize = context.viewportSize
  let typewriterMode = context.settings.typewriterMode
  let lineWidth = context.settings.lineWidth ?? Number.MAX_SAFE_INTEGER
  let geometry = computeGeometryForFont(font, context)

  if (lineWidth == 0 || lineWidth == Number.MAX_SAFE_INTEGER) {
    if (typewriterMode) {
      geometry.viewportPadding.top = viewportSize.height * typewriterMode
    }
  } else {
    let golden = 1.618
    let inverseGolden = 1 / golden
    let xWidth = geometry.fontAttributes.xWidth
    let textWidth = Math.ceil(xWidth * lineWidth)
    let rowWidth =
      textWidth +
      geometry.rowPadding.width +
      Math.max(geometry.rowTextMargin.width, geometry.rowTextPadding.width)
    let rowToViewRatio = rowWidth / viewportSize.width

    if (context.settings.allowFontScaling == true) {
      if (rowToViewRatio > 2) {
        font = font.withPointSize(geometry.fontAttributes.pointSize - 1)
        geometry = computeGeometryForFont(font, context)
      } else if (rowToViewRatio < inverseGolden) {
        let desiredRowWidth = viewportSize.width * inverseGolden
        let neededScale = 1.0 + (desiredRowWidth - rowWidth) / desiredRowWidth
        font = font.withPointSize(geometry.fontAttributes.pointSize * neededScale)
        geometry = computeGeometryForFont(font, context)
      }
    }

    let rowWrapWidth = geometry.rowWrapWidth

    if (rowWrapWidth) {
      let availibleWidth = viewportSize.width - rowWrapWidth
      let sidePadding = Math.floor(availibleWidth / 2)
      geometry.viewportPadding.left = Math.max(sidePadding, geometry.viewportPadding.left)
      geometry.viewportPadding.right = Math.max(sidePadding, geometry.viewportPadding.right)
    }

    if (typewriterMode) {
      geometry.viewportPadding.top = viewportSize.height * typewriterMode
    } else {
      let lineHeight = geometry.fontAttributes.pointSize * context.settings.lineHeightMultiple
      if (rowWrapWidth + lineHeight * 64 < viewportSize.width) {
        geometry.viewportPadding.top = lineHeight * 8
      } else if (rowWrapWidth + lineHeight * 32 < viewportSize.width) {
        geometry.viewportPadding.top = lineHeight * 4
      } else if (rowWrapWidth + lineHeight * 16 < viewportSize.width) {
        geometry.viewportPadding.top = lineHeight * 2
      } else if (rowWrapWidth + lineHeight * 2 < viewportSize.width) {
        geometry.viewportPadding.top = lineHeight * 1
      }
    }
  }

  let uiScale = geometry.uiScale
  let secondaryControlAlpha = context.isDarkMode ? 0.175 : 0.075
  let handleColor = context.theme.colors.handle

  let handleWidth = Math.max(1, 6 * uiScale)
  let handleHeight = Math.max(1, 10 * uiScale)
  let handlePath = new Path()
  handlePath.moveTo(new Point(0, 0))
  handlePath.addLineTo(new Point(0, handleHeight))
  handlePath.addLineTo(new Point(handleWidth, handleHeight / 2))
  handlePath.closeSubpath()
  let handleShape = new Shape(handlePath)
  handleShape.fill.color = handleColor
  handleShape.line.width = 0
  let handleImage = Image.fromShape(handleShape)

  let values = {
    font: font,
    fontAttributes: geometry.fontAttributes,
    indent: geometry.indent,
    uiScale: uiScale,
    rowPadding: geometry.rowPadding,
    rowTextMargin: geometry.rowTextMargin,
    rowTextPadding: geometry.rowTextPadding,
    viewportPadding: geometry.viewportPadding,
    secondaryControlAlpha: secondaryControlAlpha,
    handleImage: handleImage,
    outlineFocusAlpha: 0.0,
    textFocusAlpha: 0.15,
  }

  context.userCache.set('values', values)

  return values
}

function computeGeometryForFont(
  font: Font,
  context: StyleContext
): {
  uiScale: number
  indent: number
  rowPadding: Insets
  rowTextMargin: Insets
  rowTextPadding: Insets
  rowWrapWidth: number
  viewportPadding: Insets
  fontAttributes: FontAttributes
} {
  let viewportSize = context.viewportSize
  let fontAttributes = font.resolve(context)
  let pointSize = fontAttributes.pointSize
  let uiScale = pointSize / 14
  let indent = 22 * uiScale
  let rowPaddingBase = context.settings.rowSpacingMultiple * pointSize * uiScale
  let rowTextPaddingBase = 5 * uiScale
  let rowTextMarginBase = rowPaddingBase / 2
  let rowPadding = new Insets(rowPaddingBase, rowPaddingBase, rowPaddingBase, indent)

  let rowTextMargin = new Insets(rowTextMarginBase, 0, rowTextMarginBase, 0)
  let rowTextPadding = new Insets(0, rowTextPaddingBase, 0, rowTextPaddingBase)
  let viewportPadding = new Insets(
    10 * uiScale,
    10 * uiScale + indent,
    viewportSize.height * 0.5,
    10 * uiScale
  )

  let lineWidth = context.settings.lineWidth ?? Number.MAX_SAFE_INTEGER
  let rowWrapWidth = Number.MAX_SAFE_INTEGER

  if (lineWidth > 0 && lineWidth < Number.MAX_SAFE_INTEGER) {
    let textWidth = Math.ceil(fontAttributes.xWidth * lineWidth)
    rowWrapWidth =
      textWidth + rowPadding.width + Math.max(rowTextMargin.width, rowTextPadding.width)
  }

  return {
    uiScale: uiScale,
    indent: indent,
    rowPadding: rowPadding,
    rowTextMargin: rowTextMargin,
    rowTextPadding: rowTextPadding,
    rowWrapWidth: rowWrapWidth,
    viewportPadding: viewportPadding,
    fontAttributes: fontAttributes,
  }
}

export function symbolImage(name: string, color: Color, font: Font): Image {
  let symbol = new SymbolConfiguration(name).withHierarchicalColor(color).withFont(font)
  return Image.fromSymbol(symbol)
}

export function secondaryControlColor(context: StyleContext): Color {
  let secondaryControlAlpha = context.isDarkMode ? 0.175 : 0.075
  return context.theme.colors.text.withAlpha(secondaryControlAlpha)
}

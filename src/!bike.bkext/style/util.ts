import {
  Color,
  Editor,
  FocusMode,
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
 * This function computes/caches values derived from `Editor` state. Bike styles
 * should use `editor` values where appropriate to the style, but it's also
 * useful to adjust those values in some cases.
 *
 * For example, consider the case where the editor is wrapping text to a
 * specific column (`wrapToColumn`) while displaying in a large viewport. In
 * that case we can end up with a tiny column of text in the center of a large
 * viewport. This function detects that case and dynamically scales the user's
 * choosen font to better fill the viewport, while maintaining the user's
 * `wrapToColumn` setting.
 *
 * This function also caches derived values for performance and ease of use. For
 * example there is no user setting for `guideColor`, but that value is needed
 * by this outline style. Instead of hard coding a value, this function creates
 * the guide color by combining various values from the editor state.
 *
 * This function is not a required part of an outline style, but I think it's a
 * useful pattern, especially for more complex outline styles that try to work
 * under a variety of conditions.
 *
 * @param editor
 * @returns The computed values derived from the editor
 */
export function computeValues(editor: Editor): {
  font: Font
  wrapToColumn: number | undefined
  lineHeightMultiple: number
  rowSpacingMultiple: number
  isFullScreen: boolean
  isDarkMode: boolean
  textColor: Color
  accentColor: Color
  backgroundColor: Color
  focusMode: FocusMode | undefined
  typewriterMode: number | undefined
  showCaretLine: boolean
  showGuideLines: boolean
  hideControlsWhenTyping: boolean
  fontAttributes: FontAttributes
  indent: number
  uiScale: number
  rowPadding: Insets
  rowTextMargin: Insets
  rowTextPadding: Insets
  viewportPadding: Insets
  selectionColor: Color
  blockSelectionColor: Color
  handleColor: Color
  guideColor: Color
  separatorColor: Color
  secondaryControlColor: Color
  secondaryControlAlpha: number
  handleImage: Image
  outlineFocusAlpha: number
  textFocusAlpha: number
} {
  if (editor.userCache.has('values')) {
    return editor.userCache.get('values')
  }

  let font = editor.theme.font
  let viewportSize = editor.viewportSize
  let typewriterMode = editor.settings.typewriterMode
  let wrapToColumn = editor.settings.wrapToColumn ?? Number.MAX_SAFE_INTEGER
  let geometry = computeGeometryForFont(font, editor)

  if (wrapToColumn == 0 || wrapToColumn == Number.MAX_SAFE_INTEGER) {
    if (typewriterMode) {
      geometry.viewportPadding.top = viewportSize.height * typewriterMode
    }
  } else {
    let golden = 1.618
    let inverseGolden = 1 / golden
    let xWidth = geometry.fontAttributes.xWidth
    let textWidth = Math.ceil(xWidth * wrapToColumn)
    let rowWidth =
      textWidth +
      geometry.rowPadding.width +
      Math.max(geometry.rowTextMargin.width, geometry.rowTextPadding.width)
    let rowToViewRatio = rowWidth / viewportSize.width

    if (rowToViewRatio > 2) {
      font = font.withPointSize(geometry.fontAttributes.pointSize - 1)
      geometry = computeGeometryForFont(font, editor)
    } else if (rowToViewRatio < inverseGolden) {
      let desiredRowWidth = viewportSize.width * inverseGolden
      let neededScale = 1.0 + (desiredRowWidth - rowWidth) / desiredRowWidth
      font = font.withPointSize(geometry.fontAttributes.pointSize * neededScale)
      geometry = computeGeometryForFont(font, editor)
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
      let lineHeight = geometry.fontAttributes.pointSize * editor.theme.lineHeightMultiple
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
  let textColor = editor.theme.textColor
  let handleColor = textColor
  let backgroundColor = editor.theme.backgroundColor
  let secondaryControlAlpha = editor.isDarkMode ? 0.175 : 0.075
  let secondaryControlColor = textColor.withAlpha(secondaryControlAlpha)
  let guideColor = textColor.withAlpha(secondaryControlAlpha / 2)
  let selectionColor = editor.isKey
    ? Color.textBackgroundSelected()
    : textColor.withFraction(0.8, backgroundColor)
  let blockSelectionColor = editor.isKey
    ? Color.systemGreen().withFraction(0.5, backgroundColor)
    : textColor.withFraction(0.8, backgroundColor)

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
    wrapToColumn: editor.settings.wrapToColumn,
    lineHeightMultiple: editor.theme.lineHeightMultiple,
    rowSpacingMultiple: editor.theme.rowSpacingMultiple,
    isFullScreen: editor.isFullScreen,
    isDarkMode: editor.isDarkMode,
    textColor: textColor,
    accentColor: editor.theme.accentColor,
    backgroundColor: editor.theme.backgroundColor,
    focusMode: editor.settings.focusMode,
    typewriterMode: editor.settings.typewriterMode,
    showCaretLine: editor.theme.showCaretLine,
    showGuideLines: editor.theme.showGuideLines,
    hideControlsWhenTyping: editor.settings.hideControlsWhenTyping,
    fontAttributes: geometry.fontAttributes,
    indent: geometry.indent,
    uiScale: uiScale,
    rowPadding: geometry.rowPadding,
    rowTextMargin: geometry.rowTextMargin,
    rowTextPadding: geometry.rowTextPadding,
    viewportPadding: geometry.viewportPadding,
    selectionColor: selectionColor,
    blockSelectionColor: blockSelectionColor,
    handleColor: handleColor,
    guideColor: guideColor,
    separatorColor: textColor,
    secondaryControlColor: secondaryControlColor,
    secondaryControlAlpha: secondaryControlAlpha,
    handleImage: handleImage,
    outlineFocusAlpha: 0.0,
    textFocusAlpha: 0.15,
  }

  editor.userCache.set('values', values)

  return values
}

function computeGeometryForFont(
  font: Font,
  editor: Editor
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
  let viewportSize = editor.viewportSize
  let fontAttributes = font.resolve(editor)
  let pointSize = fontAttributes.pointSize
  let uiScale = pointSize / 14
  let indent = 22 * uiScale
  let rowPaddingBase = editor.theme.rowSpacingMultiple * pointSize * uiScale
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

  let wrapToColumn = editor.settings.wrapToColumn ?? Number.MAX_SAFE_INTEGER
  let rowWrapWidth = Number.MAX_SAFE_INTEGER

  if (wrapToColumn > 0 && wrapToColumn < Number.MAX_SAFE_INTEGER) {
    let textWidth = Math.ceil(fontAttributes.xWidth * wrapToColumn)
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

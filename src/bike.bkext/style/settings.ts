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
} from '@style'

/**
 * This OutlineStyle dynamically computes font size, and also derives some new
 * settings values. So instead of accessing `editor.settings` this outline style
 * uses `computeSettings`.
 *
 * For example when `wrapToColumn` is set the font may be scaled to fit nicely
 * into the current viewport width.
 *
 * These computed settings are cached in the editor. The cache is cleared when
 * any editor state changes such as viewport size or isTyping, etc.
 *
 * @param editor
 * @returns The computed settings for the editor
 */
export function computeSettings(editor: Editor): Settings {
  if (editor.userCache.has('settings')) {
    return editor.userCache.get('settings')
  }

  let settings = editor.settings
  let font = settings.font
  let viewportSize = editor.viewportSize
  let typewriterMode = settings.typewriterMode
  let wrapToColumn = settings.wrapToColumn ?? Number.MAX_SAFE_INTEGER
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
      let lineHeight = geometry.fontAttributes.pointSize * settings.lineHeightMultiple
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
  let textColor = settings.textColor
  let handleColor = textColor
  let backgroundColor = settings.backgroundColor
  let secondaryControlAlpha = settings.isDarkMode ? 0.175 : 0.075
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
  let computedSettings: Settings = {
    // User settings
    font: font,
    wrapToColumn: settings.wrapToColumn,
    lineHeightMultiple: settings.lineHeightMultiple,
    rowSpacingMultiple: settings.rowSpacingMultiple,
    isFullScreen: settings.isFullScreen,
    isDarkMode: settings.isDarkMode,
    textColor: textColor,
    accentColor: settings.accentColor,
    backgroundColor: settings.backgroundColor,
    focusMode: settings.focusMode,
    typewriterMode: settings.typewriterMode,
    showCaretLine: settings.showCaretLine,
    showGuideLines: settings.showGuideLines,
    hideControlsWhenTyping: settings.hideControlsWhenTyping,

    // Extra computed settings
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
    outlineFocusAlpha: 0.15,
    textFocusAlpha: 0.15,
  }

  editor.userCache.set('settings', computedSettings)

  return computedSettings
}

type Settings = {
  // User settings
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

  // Extra computed settings
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
  outlineFocusAlpha: 0.15
  textFocusAlpha: 0.15
}

function computeGeometryForFont(font: Font, editor: Editor): ThemeGeometry {
  let settings = editor.settings
  let viewportSize = editor.viewportSize
  let fontAttributes = font.resolve(editor)
  let pointSize = fontAttributes.pointSize
  let uiScale = pointSize / 14
  let indent = 22 * uiScale
  let rowPaddingBase = settings.rowSpacingMultiple * pointSize * uiScale
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

  let wrapToColumn = settings.wrapToColumn ?? Number.MAX_SAFE_INTEGER
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

type ThemeGeometry = {
  uiScale: number
  indent: number
  rowPadding: Insets
  rowTextMargin: Insets
  rowTextPadding: Insets
  rowWrapWidth: number
  viewportPadding: Insets
  fontAttributes: FontAttributes
}

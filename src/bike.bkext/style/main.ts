import { Color, Text, Image, SymbolConfiguration, RulesLayer, defineOutlineStyle } from '@style'

import { computeSettings } from './settings'
import { symbolImage } from './util'

defineOutlineStyle('bike', 'Bike (default)')
  .layer('base', (l: RulesLayer) => {
    l.viewport((editor, viewport) => {
      let settings = computeSettings(editor)
      viewport.padding = settings.viewportPadding
      viewport.backgroundColor = settings.backgroundColor
    })

    l.caret((editor, caret) => {
      let settings = computeSettings(editor)
      if (editor.isKey) {
        let accentColor = settings.accentColor
        let pointSize = settings.fontAttributes.pointSize
        caret.color = accentColor
        caret.width = 2 * settings.uiScale
        caret.blinkStyle = 'continuous'
        caret.lineColor = settings.showCaretLine ? accentColor.withAlpha(0.1) : Color.clear()
        caret.messageFont = settings.font
        caret.messageColor = settings.secondaryControlColor
        caret.loadedAttributesFont = settings.font.withPointSize(pointSize * 0.6)
        caret.loadedAttributesColor = Color.white()
      } else {
        caret.color = Color.clear()
        caret.lineColor = Color.clear()
        caret.blinkStyle = 'none'
      }
    })

    l.row(`.*`, (editor, row) => {
      let settings = computeSettings(editor)

      row.padding = settings.rowPadding

      row.decoration('background', (background, layout) => {
        background.anchor.x = 0
        background.anchor.y = 0
        background.x = layout.leading
        background.y = layout.top
        background.zPosition = -1
      })

      row.decoration('handle', (handle, layout) => {
        handle.opacity = settings.secondaryControlAlpha
        handle.contents.gravity = 'center'
        handle.contents.image = settings.handleImage
        handle.x = layout.leading.offset(settings.indent / 2)
        handle.y = layout.firstLine.centerY
        let size = layout.firstLine.height.min(settings.indent)
        handle.width = size
        handle.height = size
        if (editor.isTyping && settings.hideControlsWhenTyping) {
          handle.opacity = 0
        }
      })

      if (settings.showGuideLines) {
        row.decoration('guide', (guide, layout) => {
          guide.color = settings.guideColor
          guide.x = layout.leading.offset(settings.indent / 2)
          guide.y = layout.firstLine.bottom
          guide.anchor.y = 0
          guide.width = layout.fixed(Math.ceil(1 * settings.uiScale))
          guide.height = layout.fixed(0)
          if (editor.isTyping && settings.hideControlsWhenTyping) {
            guide.opacity = 0
          }
        })
      }

      row.text.font = settings.font
      row.text.color = settings.textColor
      row.text.lineHeightMultiple = settings.lineHeightMultiple
      row.text.margin = settings.rowTextMargin
      row.text.padding = settings.rowTextPadding

      row.text.decoration('background', (background, layout) => {
        background.anchor.x = 0
        background.anchor.y = 0
        background.x = layout.leading
        background.y = layout.top
        background.zPosition = -2
      })
    })
  })

  .layer('row', (l: RulesLayer) => {
    l.row('.heading', (editor, row) => {
      row.text.font = row.text.font.withBold()
    })

    l.row('.blockquote', (editor, row) => {
      let settings = computeSettings(editor)
      row.text.margin.left = settings.indent * 2
      row.text.font = row.text.font.withItalics()
      row.text.decoration('mark', (mark, layout) => {
        mark.x = layout.leading.offset(-settings.indent / 2)
        mark.height = layout.height.offset(row.text.margin.top + row.text.margin.bottom)
        mark.width = layout.fixed(Math.ceil(1 * settings.uiScale))
        mark.color = settings.textColor
      })
    })

    l.row('.codeblock', (editor, row) => {
      row.text.font = row.text.font.withMonospace()
    })

    l.row('.note', (editor, row) => {
      row.text.font = row.text.font.withItalics()
    })

    l.row('.unordered', (editor, row) => {
      let settings = computeSettings(editor)
      let indent = settings.indent
      row.text.margin.left = indent * 2
      row.decoration('mark', (mark, layout) => {
        let size = layout.firstLine.height
        mark.width = size
        mark.height = size
        mark.contents.gravity = 'center'
        mark.contents.image = Image.fromText(new Text('•', row.text.font, row.text.color))
        mark.y = layout.firstLine.centerY
        mark.x = layout.leading.offset(indent * 1.5)
      })
    })

    l.row('.ordered', (editor, row) => {
      let settings = computeSettings(editor)
      let indent = settings.indent
      let index = editor.orderedIndex ?? 0
      row.text.margin.left = indent * 2
      row.decoration('mark', (mark, layout) => {
        mark.x = layout.leading.offset(indent * 1.5)
        mark.y = layout.firstLine.centerY
        let size = layout.firstLine.height
        mark.width = size
        mark.height = size
        mark.contents.gravity = 'center'
        mark.contents.image = Image.fromText(new Text(index + '.', row.text.font, row.text.color))
      })
    })

    l.row('.task', (editor, row) => {
      let settings = computeSettings(editor)
      let indent = settings.indent
      row.text.margin.left = indent * 2
      row.decoration('mark', (mark, layout) => {
        mark.x = layout.leading.offset(indent * 1.5)
        mark.y = layout.firstLine.centerY
        let size = layout.firstLine.height
        mark.width = size
        mark.height = size
        mark.contents.gravity = 'center'
        mark.contents.image = symbolImage('square', row.text.color, row.text.font)
      })
    })

    l.row('.@done', (editor, row) => {
      row.text.strikethrough.thick = true
    })

    l.row('.task @done', (editor, row) => {
      row.decoration('mark', (mark, _) => {
        mark.contents.image = symbolImage('checkmark.square', row.text.color, row.text.font)
      })
    })

    l.row('.hr', (editor, row) => {
      let settings = computeSettings(editor)
      row.text.decoration('ruler', (ruler, layout) => {
        ruler.height = layout.fixed(Math.ceil(1 * settings.uiScale))
        ruler.width = layout.width.minus(row.text.padding.width)
        ruler.color = settings.separatorColor
      })
    })
  })

  .layer('run', (l: RulesLayer) => {
    l.run('.@emphasized', (editor, text) => {
      text.font = text.font.withItalics()
    })

    l.run('.@strong', (editor, text) => {
      text.font = text.font.withBold()
    })

    l.run('.@code', (editor, text) => {
      text.font = text.font.withMonospace()
    })

    l.run('.@highlight', (editor, text) => {
      let settings = computeSettings(editor)
      let uiScale = settings.uiScale
      text.decoration('highlight', (highlight, layout) => {
        highlight.zPosition = -1
        highlight.anchor.x = 0
        highlight.anchor.y = 0
        highlight.x = layout.leading.offset(-2 * uiScale)
        highlight.y = layout.top.offset(1 * uiScale)
        highlight.width = layout.width.offset(4 * uiScale)
        highlight.height = layout.height.offset(-2 * uiScale)
        highlight.corners.radius = 3 * uiScale
        highlight.color = Color.systemYellow().withAlpha(0.6)
      })
    })

    l.run('.start-of-matches(.@highlight) = true', (editor, text) => {
      text.margin.left = 2.5 * computeSettings(editor).uiScale
    })

    l.run('.end-of-matches(.@highlight) = true', (editor, text) => {
      text.margin.right = 2.5 * computeSettings(editor).uiScale
    })

    l.run('.@strikethrough', (editor, text) => {
      text.strikethrough.thick = true
    })

    l.run('.@link', (editor, text) => {
      text.color = Color.link().withAlpha(text.color.resolve(editor).alpha)
    })

    l.run('.end-of-matches(.@link) = true', (editor, text) => {
      let symbol = new SymbolConfiguration('arrow.up.forward.app')
        .withSymbolScale('medium')
        .withFont(text.font.withWeight('semibold'))
        .withHierarchicalColor(text.color.withAlpha(1))
      let image = Image.fromSymbol(symbol)
      let imageWidth = image.resolve(editor).width * 1.1
      text.padding.right = imageWidth
      text.decoration('button', (button, layout) => {
        button.x = layout.trailing
        button.anchor.x = 0
        button.width = layout.fixed(imageWidth)
        button.contents.gravity = 'center'
        button.contents.image = image
      })
    })

    l.run('.@baseline = subscript', (editor, text) => {
      let baseSize = text.font.resolve(editor).pointSize
      text.font = text.font.withPointSize(0.75 * baseSize)
      text.baselineOffset = baseSize * -0.25
    })

    l.run('.@baseline = superscript', (editor, text) => {
      let baseSize = text.font.resolve(editor).pointSize
      text.font = text.font.withPointSize(0.75 * baseSize)
      text.baselineOffset = baseSize * 0.25
    })

    l.run('.@attachment/parent::hr', (editor, text) => {
      text.attachmentSize.width = 1
    })
  })

  .layer('controls', (l: RulesLayer) => {
    l.row(`.parent() = true`, (editor, row) => {
      let settings = computeSettings(editor)
      row.text.decoration('focus', (focus, layout) => {
        let size = layout.lastLine.height
        focus.contents.gravity = 'center'
        focus.contents.image = symbolImage(
          'arrow.down.forward',
          settings.secondaryControlColor,
          row.text.font
        )
        focus.x = layout.lastLine.trailing.offset(size.scale(0.5)).offset(row.text.padding.right)
        focus.y = layout.lastLine.centerY
        focus.width = size
        focus.height = size
        if (editor.isTyping && settings.hideControlsWhenTyping) {
          focus.opacity = 0
        }
      })
    })

    l.row(`.parent() = true and focused-root() = true`, (editor, row) => {
      row.text.decoration('focus', (focus, _) => {
        focus.rotation = 3.14
      })
    })

    l.row(`.parent() = true and collapsed() = true`, (editor, row) => {
      row.decoration('handle', (handle, _) => {
        handle.opacity = 1.0
      })
    })

    l.row(`.expanded() = true`, (editor, row) => {
      row.decoration('handle', (handle, _) => {
        handle.rotation = 1.57
      })
      if (computeSettings(editor).showGuideLines) {
        row.decoration('guide', (guide, layout) => {
          guide.height = layout.bottom.minus(layout.firstLine.bottom)
        })
      }
    })

    l.row(`.body @text = "" and parent() = false`, (editor, row) => {
      row.decoration('handle', (handle, _) => {
        handle.opacity = 0.0
      })
    })
  })

  .layer('selection', (l: RulesLayer) => {
    l.row('.selection() = block', (editor, row) => {
      let settings = computeSettings(editor)
      row.text.decoration('background', (background, _) => {
        background.color = settings.blockSelectionColor
      })
    })

    l.run('.@view-selected-range', (editor, text) => {
      let settings = computeSettings(editor)
      text.decoration('selection', (background, layout) => {
        background.zPosition = -2
        background.anchor.x = 0
        background.anchor.y = 0
        background.x = layout.leading
        background.y = layout.top
        background.color = settings.selectionColor
      })
    })
  })

  .layer('outline-focus', (l: RulesLayer) => {
    l.row('.focused-branch() = false', (editor, row) => {
      let settings = computeSettings(editor)
      row.text.color = row.text.color.withAlpha(settings.outlineFocusAlpha)
      row.decorations((each, _) => {
        each.opacity *= settings.outlineFocusAlpha
      })
      row.text.decorations((each, _) => {
        each.opacity *= settings.outlineFocusAlpha
      })
    })

    l.run(`.*/parent::focused-branch() = false`, (editor, text) => {
      let settings = computeSettings(editor)
      text.decorations((each, _) => {
        each.opacity *= settings.outlineFocusAlpha
      })
    })
  })

  .layer('text-focus', (l: RulesLayer) => {
    l.row('.*', (editor, row) => {
      let settings = computeSettings(editor)
      if (settings.focusMode) {
        let textFocusAlpha = settings.textFocusAlpha
        row.text.color = row.text.color.withAlpha(textFocusAlpha)
        row.decorations((each, _) => {
          each.opacity *= textFocusAlpha
        })
        row.text.decorations((each, _) => {
          each.opacity *= textFocusAlpha
        })
      }
    })

    l.run('.*', (editor, text) => {
      let settings = computeSettings(editor)
      if (settings.focusMode) {
        let textFocusAlpha = settings.textFocusAlpha
        text.color = text.color.withAlpha(textFocusAlpha)
        text.decorations((each, _) => {
          each.opacity *= textFocusAlpha
        })
      }
    })

    l.row('.selection() = block', (editor, row) => {
      let settings = computeSettings(editor)
      if (settings.focusMode) {
        let textFocusAlpha = settings.textFocusAlpha
        row.decorations((each, _) => {
          each.opacity /= textFocusAlpha
        })
        row.text.decorations((each, _) => {
          each.opacity /= textFocusAlpha
        })
      }
    })

    l.run('.@view-word-focus', (editor, text) => {
      let settings = computeSettings(editor)
      if (settings.focusMode == 'word') {
        let textFocusAlpha = settings.textFocusAlpha
        text.color = text.color.withAlpha(1.0)
        text.decorations((each, _) => {
          each.opacity /= textFocusAlpha
        })
      }
    })

    l.run('.@view-sentence-focus', (editor, text) => {
      let settings = computeSettings(editor)
      if (settings.focusMode == 'sentence') {
        let textFocusAlpha = settings.textFocusAlpha
        text.color = text.color.withAlpha(1.0)
        text.decorations((each, _) => {
          each.opacity /= textFocusAlpha
        })
      }
    })

    l.run('.@view-paragraph-focus', (editor, text) => {
      let settings = computeSettings(editor)
      if (settings.focusMode == 'paragraph') {
        let textFocusAlpha = settings.textFocusAlpha
        text.color = text.color.withAlpha(1.0)
        text.decorations((each, _) => {
          each.opacity /= textFocusAlpha
        })
      }
    })
  })

  .layer('filter-match', (l: RulesLayer) => {
    l.row('.filter-match() = false', (editor, row) => {
      if (editor.isFiltering) {
        row.text.scale = 0.25
        row.text.color = Color.systemGray()
      }
    })

    l.row('.filter-match() = false and selection() != null', (editor, row) => {
      if (editor.isFiltering) {
        row.text.scale = 1.0
      }
    })

    l.row('.filter-match() = true', (editor, row) => {
      row.text.decoration('background', (background, layout) => {})
    })
  })

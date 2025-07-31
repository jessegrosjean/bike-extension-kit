import { Color, Text, Image, SymbolConfiguration, defineEditorStyle } from 'bike/style'
import { computeValues, symbolImage } from './util'

let style = defineEditorStyle('bike', 'Bike (default)')

style.layer('base', (row, run, caret, viewport, include) => {
  viewport((editor, viewport) => {
    let values = computeValues(editor)
    viewport.padding = values.viewportPadding
    viewport.backgroundColor = values.backgroundColor
  })

  caret((editor, caret) => {
    let values = computeValues(editor)
    if (editor.isKey) {
      let accentColor = values.accentColor
      let pointSize = values.fontAttributes.pointSize
      caret.color = accentColor
      caret.width = 2 * values.uiScale
      caret.blinkStyle = 'continuous'
      caret.lineColor = values.showCaretLine ? accentColor.withAlpha(0.1) : Color.clear()
      caret.messageFont = values.font
      caret.messageColor = values.secondaryControlColor
      caret.loadedAttributesFont = values.font.withPointSize(pointSize * 0.6)
      caret.loadedAttributesColor = Color.white()
    } else {
      caret.color = Color.clear()
      caret.lineColor = Color.clear()
      caret.blinkStyle = 'none'
    }
  })

  row(`.*`, (editor, row) => {
    let values = computeValues(editor)

    row.padding = values.rowPadding

    row.decoration('handle', (handle, layout) => {
      handle.commandName = 'bike:toggle-fold'
      let size = layout.firstLine.height.min(values.indent)
      handle.opacity = values.secondaryControlAlpha
      handle.contents.gravity = 'center'
      handle.contents.image = values.handleImage
      handle.x = layout.leadingContent.offset(-values.indent / 2)
      handle.y = layout.firstLine.centerY
      handle.width = size
      handle.height = size
      if (editor.isTyping && values.hideControlsWhenTyping) {
        handle.opacity = 0
      }
    })

    if (values.showGuideLines) {
      row.decoration('guide', (guide, layout) => {
        guide.color = values.guideColor
        guide.x = layout.leadingContent.offset(-values.indent / 2)
        guide.y = layout.firstLine.bottom
        guide.anchor.y = 0
        guide.width = layout.fixed(Math.ceil(1 * values.uiScale))
        guide.height = layout.fixed(0)
        if (editor.isTyping && values.hideControlsWhenTyping) {
          guide.opacity = 0
        }
      })
    }

    row.text.font = values.font
    row.text.color = values.textColor
    row.text.lineHeightMultiple = values.lineHeightMultiple
    row.text.margin = values.rowTextMargin
    row.text.padding = values.rowTextPadding
  })
})

style.layer('row-formatting', (row, run, caret, viewport, include) => {
  row(`.heading`, (editor, row) => {
    row.text.font = row.text.font.withBold()
  })

  row(`.blockquote`, (editor, row) => {
    let values = computeValues(editor)
    let indent = values.indent
    row.text.margin.left = Math.floor(indent * 2)
    row.text.font = row.text.font.withItalics()
    row.text.decoration('mark', (mark, layout) => {
      mark.x = layout.leading.offset(-values.indent / 2)
      mark.height = layout.height.offset(row.text.margin.top + row.text.margin.bottom)
      mark.width = layout.fixed(Math.ceil(1 * values.uiScale))
      mark.color = values.textColor
    })
  })

  row(`.codeblock`, (editor, row) => {
    row.text.font = row.text.font.withMonospace()
  })

  row(`.note`, (editor, row) => {
    row.text.font = row.text.font.withItalics()
  })

  row(`.unordered`, (editor, row) => {
    let values = computeValues(editor)
    let indent = values.indent
    row.text.margin.left = Math.floor(indent * 2)
    row.text.decoration('mark', (mark, layout) => {
      mark.x = layout.leading.offset(-values.indent / 2)
      mark.y = layout.firstLine.centerY
      let size = layout.firstLine.height
      mark.width = size
      mark.height = size
      mark.contents.gravity = 'center'
      mark.contents.image = Image.fromText(new Text('•', row.text.font, row.text.color))
    })
  })

  row(`.ordered`, (editor, row) => {
    let values = computeValues(editor)
    let indent = values.indent
    let index = editor.orderedIndex ?? 0
    row.text.margin.left = Math.floor(indent * 2)
    row.text.decoration('mark', (mark, layout) => {
      mark.x = layout.leading.offset(-values.indent / 2)
      mark.y = layout.firstLine.centerY
      let size = layout.firstLine.height
      mark.width = size
      mark.height = size
      mark.contents.gravity = 'center'
      mark.contents.image = Image.fromText(new Text(index + '.', row.text.font, row.text.color))
    })
  })

  row(`.task`, (editor, row) => {
    let values = computeValues(editor)
    let indent = values.indent
    row.text.margin.left = Math.floor(indent * 2)
    row.text.decoration('mark', (mark, layout) => {
      mark.commandName = 'bike:toggle-done'
      mark.x = layout.leading.offset(-values.indent / 2)
      mark.y = layout.firstLine.centerY
      let size = layout.firstLine.height
      mark.width = size
      mark.height = size
      mark.contents.gravity = 'center'
      mark.contents.image = symbolImage('square', row.text.color, row.text.font)
    })
  })

  row(`.@done`, (editor, row) => {
    row.text.strikethrough.thick = true
  })

  row(`.task @done`, (editor, row) => {
    row.text.decoration('mark', (mark, _) => {
      mark.contents.image = symbolImage('checkmark.square', row.text.color, row.text.font)
    })
  })

  row(`.hr`, (editor, row) => {
    let values = computeValues(editor)
    row.text.decoration('ruler', (ruler, layout) => {
      ruler.height = layout.fixed(Math.ceil(1 * values.uiScale))
      ruler.width = layout.width.minus(row.text.padding.width)
      ruler.color = values.separatorColor
    })
  })
})

style.layer(`run-formatting`, (row, run, caret, viewport, include) => {
  run('.@emphasized', (editor, text) => {
    text.font = text.font.withItalics()
  })

  run(`.@strong`, (editor, text) => {
    text.font = text.font.withBold()
  })

  run(`.@code`, (editor, text) => {
    text.font = text.font.withMonospace()
  })

  run(`.@highlight`, (editor, text) => {
    let values = computeValues(editor)
    let uiScale = values.uiScale
    text.decoration('highlight', (highlight, layout) => {
      highlight.zPosition = -1
      highlight.anchor.x = 0
      highlight.anchor.y = 0
      highlight.x = layout.leading.offset(-2 * uiScale)
      highlight.y = layout.top
      highlight.width = layout.width.offset(4 * uiScale)
      highlight.height = layout.height
      highlight.corners.radius = 3 * uiScale
      highlight.color = Color.systemYellow().withAlpha(0.25)
      highlight.border.width = 1 * uiScale
      highlight.border.color = Color.systemYellow().withAlpha(0.5)
      highlight.transitions.position = false
      highlight.transitions.size = false
      highlight.mergeDistance = 1
    })
  })

  run(`.start-of-matches(.@highlight) = true`, (editor, text) => {
    text.margin.left = 2.5 * computeValues(editor).uiScale
  })

  run(`.end-of-matches(.@highlight) = true`, (editor, text) => {
    text.margin.right = 2.5 * computeValues(editor).uiScale
  })

  run(`.@strikethrough`, (editor, text) => {
    text.strikethrough.thick = true
  })

  run(`.@link`, (editor, text) => {
    text.color = Color.link().withAlpha(text.color.resolve(editor).alpha)
  })

  run(`.end-of-matches(.@link) = true`, (editor, text) => {
    let symbol = new SymbolConfiguration('arrow.up.forward.app')
      .withSymbolScale('medium')
      .withFont(text.font.withWeight('semibold'))
      .withHierarchicalColor(text.color.withAlpha(1))
    let image = Image.fromSymbol(symbol)
    let imageWidth = image.resolve(editor).width * 1.1
    text.padding.right = imageWidth
    text.decoration('button', (button, layout) => {
      button.commandName = 'bike:open-link'
      button.x = layout.trailing
      button.anchor.x = 0
      button.width = layout.fixed(imageWidth)
      button.contents.gravity = 'center'
      button.contents.image = image
    })
  })

  run(`.@baseline = subscript`, (editor, text) => {
    let baseSize = text.font.resolve(editor).pointSize
    text.font = text.font.withPointSize(0.75 * baseSize)
    text.baselineOffset = baseSize * -0.25
  })

  run(`.@baseline = superscript`, (editor, text) => {
    let baseSize = text.font.resolve(editor).pointSize
    text.font = text.font.withPointSize(0.75 * baseSize)
    text.baselineOffset = baseSize * 0.25
  })

  run(`.@attachment/parent::hr`, (editor, text) => {
    text.attachmentSize.width = 1
  })
})

style.layer('controls', (row, run, caret, viewport, include) => {
  row(`.parent() = true`, (editor, row) => {
    let values = computeValues(editor)
    row.text.decoration('focus', (focus, layout) => {
      let size = layout.lastLine.height
      focus.commandName = 'bike:toggle-focus'
      focus.contents.gravity = 'center'
      focus.contents.image = symbolImage(
        'arrow.down.forward',
        values.secondaryControlColor,
        values.font
      )
      focus.x = layout.lastLine.trailing.offset(size.scale(0.5)).offset(row.text.padding.right)
      focus.y = layout.lastLine.centerY
      focus.width = size
      focus.height = size
      if (editor.isTyping && values.hideControlsWhenTyping) {
        focus.opacity = 0
      }
    })
  })

  row(`.parent() = true and focused-root() = true`, (editor, row) => {
    row.text.decoration('focus', (focus, _) => {
      focus.rotation = 3.14
    })
  })

  row(`.parent() = true and collapsed() = true`, (editor, row) => {
    row.decoration('handle', (handle, _) => {
      handle.opacity = 1.0
    })
  })

  row(`.expanded() = true`, (editor, row) => {
    row.decoration('handle', (handle, _) => {
      handle.rotation = 1.57
    })
    if (computeValues(editor).showGuideLines) {
      row.decoration('guide', (guide, layout) => {
        guide.height = layout.bottom.minus(layout.firstLine.bottom)
      })
    }
  })

  row(`.body @text = "" and parent() = false and selection() = null`, (editor, row) => {
    row.decoration('handle', (handle, _) => {
      handle.opacity = 0.0
    })
  })
})

style.layer('selection', (row, run, caret, viewport, include) => {
  row(`.selection() = block`, (editor, row) => {
    let values = computeValues(editor)
    row.text.decoration('background', (background, _) => {
      background.color = values.blockSelectionColor
    })
  })

  run(`.@view-selected-range and not @view-marked-range`, (editor, text) => {
    let values = computeValues(editor)
    text.decoration('selection', (selection, layout) => {
      selection.zPosition = -2
      selection.anchor.x = 0
      selection.anchor.y = 0
      selection.x = layout.leading
      selection.y = layout.top
      selection.color = values.selectionColor.withAlpha(0.5)
      selection.border.width = 1 * values.uiScale
      selection.border.color = values.selectionColor
      selection.corners.radius = 3 * values.uiScale
      selection.mergeDistance = 1
    })
  })

  run(`.@view-selected-range and @view-marked-range`, (editor, text) => {
    let values = computeValues(editor)
    text.underline.thick = true
    text.underline.color = values.accentColor
  })

  run(`.@view-marked-range`, (editor, text) => {
    let values = computeValues(editor)
    text.underline.thick = true
    text.underline.color = values.selectionColor
  })
})

style.layer('highlights', (row, run, caret, viewport, include) => {
  run(`.@view-find-current or @view-check-current`, (editor, run) => {
    let values = computeValues(editor)
    let uiScale = values.uiScale

    run.decoration('selection', (highlight, layout) => {
      highlight.color = Color.findHighlight() //.withAlpha(0.8)
      highlight.border.width = 0
      highlight.shadow.opacity = 0.4
      highlight.shadow.radius = 2
      highlight.shadow.offset.height = 0
      highlight.x = highlight.x.offset(-1 * uiScale)
      highlight.width = highlight.width.offset(2 * uiScale)
    })
  })
})

style.layer('outline-focus', (row, run, caret, viewport, include) => {
  // Modifies row decorations, so needs to be after layers that add decorations
  row(`.focused-branch() = false`, (editor, row) => {
    let values = computeValues(editor)
    row.opacity = values.outlineFocusAlpha
    row.decorations((each, _) => {
      each.opacity = 0
    })
    row.text.decorations((each, _) => {
      each.opacity *= values.outlineFocusAlpha
    })
  })
})

style.layer('text-focus', (row, run, caret, viewport, include) => {
  row(`.*`, (editor, row) => {
    let values = computeValues(editor)
    if (values.focusMode) {
      let textFocusAlpha = values.textFocusAlpha
      row.text.color = row.text.color.withAlpha(textFocusAlpha)
      row.decorations((each, _) => {
        each.opacity *= textFocusAlpha
      })
      row.text.decorations((each, _) => {
        each.opacity *= textFocusAlpha
      })
    }
  })

  run(`.*`, (editor, text) => {
    let values = computeValues(editor)
    if (values.focusMode) {
      let textFocusAlpha = values.textFocusAlpha
      text.color = text.color.withAlpha(textFocusAlpha)
      text.decorations((each, _) => {
        each.opacity *= textFocusAlpha
      })
    }
  })

  row(`.selection() = block`, (editor, row) => {
    let values = computeValues(editor)
    if (values.focusMode) {
      let textFocusAlpha = values.textFocusAlpha
      row.decorations((each, _) => {
        each.opacity /= textFocusAlpha
      })
      row.text.decorations((each, _) => {
        each.opacity /= textFocusAlpha
      })
    }
  })

  run(`.@view-word-focus`, (editor, text) => {
    let values = computeValues(editor)
    if (values.focusMode == 'word') {
      let textFocusAlpha = values.textFocusAlpha
      text.color = text.color.withAlpha(1.0)
      text.decorations((each, _) => {
        each.opacity /= textFocusAlpha
      })
    }
  })

  run(`.@view-sentence-focus`, (editor, text) => {
    let values = computeValues(editor)
    if (values.focusMode == 'sentence') {
      let textFocusAlpha = values.textFocusAlpha
      text.color = text.color.withAlpha(1.0)
      text.decorations((each, _) => {
        each.opacity /= textFocusAlpha
      })
    }
  })

  run(`.@view-paragraph-focus`, (editor, text) => {
    let values = computeValues(editor)
    if (values.focusMode == 'paragraph') {
      let textFocusAlpha = values.textFocusAlpha
      text.color = text.color.withAlpha(1.0)
      text.decorations((each, _) => {
        each.opacity /= textFocusAlpha
      })
    }
  })
})

style.layer('filter-match', (row, run, caret, viewport, include) => {
  row(`.filter-match() = false and selection() = null`, (editor, row) => {
    if (editor.isFiltering) {
      row.text.scale = 0.25
      row.text.margin.left *= 0.5
      row.decorations((each, _) => {
        each.opacity = 0
      })
    }
  })
})

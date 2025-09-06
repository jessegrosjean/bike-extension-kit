import { Color, Text, Image, SymbolConfiguration, defineEditorStyle } from 'bike/style'
import { computeValues, symbolImage } from './util'

let style = defineEditorStyle('bike', 'Bike (default)')

style.layer('base', (row, run, caret, viewport, include) => {
  viewport((context, viewport) => {
    let values = computeValues(context)
    viewport.padding = values.viewportPadding
    viewport.backgroundColor = values.backgroundColor
  })

  caret((context, caret) => {
    let values = computeValues(context)
    if (context.isKey) {
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

  row(`.*`, (context, row) => {
    let values = computeValues(context)

    row.padding = values.rowPadding

    row.decoration('handle', (handle, layout) => {
      handle.commandName = 'bike:.click-handle'
      let size = layout.firstLine.height.min(values.indent)
      handle.opacity = values.secondaryControlAlpha
      handle.contents.gravity = 'center'
      handle.contents.image = values.handleImage
      handle.x = layout.leadingContent.offset(-values.indent / 2)
      handle.y = layout.firstLine.centerY
      handle.width = size
      handle.height = size
      if (context.isTyping && values.hideControlsWhenTyping) {
        handle.opacity = 0
      }
    })

    if (values.showGuideLines) {
      row.decoration('guide', (guide, layout) => {
        guide.color = values.guideColor
        guide.x = layout.leadingContent.offset(-values.indent / 2)
        guide.y = layout.firstLine.bottom
        guide.anchor.y = 0
        guide.width = layout.fixed(Math.max(1 * values.uiScale, 0.5))
        guide.height = layout.fixed(0)
        if (context.isTyping && values.hideControlsWhenTyping) {
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
  row(`.heading`, (context, row) => {
    row.text.font = row.text.font.withBold()
  })

  row(`.blockquote`, (context, row) => {
    let values = computeValues(context)
    let indent = values.indent
    row.text.margin.left = Math.floor(indent * 2)
    row.text.font = row.text.font.withItalics()
    row.text.decoration('mark', (mark, layout) => {
      mark.anchor.y = 0
      mark.y = layout.top
      mark.x = layout.leading.offset(-values.indent / 2)
      mark.height = layout.height.offset(row.text.margin.top + row.text.margin.bottom)
      mark.width = layout.fixed(Math.max(4 * values.uiScale, 0.5))
      mark.color = values.textColor.withAlpha(0.7)
      mark.corners.radius = 3 * values.uiScale
      mark.corners.maxXMinYCorner = false
      mark.corners.maxXMaxYCorner = false
      mark.mergable = true
      mark.zPosition = -2
    })

    row.text.decoration('blockquote', (block, layout) => {
      block.anchor.x = 0
      block.anchor.y = 0
      let adjust = layout
        .fixed(0)
        .offset(-values.indent / 2)
        .offset(-1 * values.uiScale)
      block.x = layout.leading.offset(adjust)
      block.y = layout.top
      block.height = layout.height.offset(row.text.margin.top + row.text.margin.bottom)
      block.width = layout.text.width.offset(adjust.scale(-1))
      block.color = values.textColor.withAlpha(0.02)
      block.corners.radius = 3 * values.uiScale
      block.border.width = 0.5 * values.uiScale
      block.border.color = values.textColor.withAlpha(0.05)
      block.mergable = true
      block.zPosition = -3
    })
  })

  /*
  row(`.start-of-matches(.blockquote) = true`, (context, row) => {
    // Good start, but has problem with multilevel blockquotes.
    // Want to use same look for codeblocks. But they are expected to be multilevel.
    // Add a copy button/decoration to end of first row?
    // Do same for codeblock?
    let values = computeValues(context)
    let pointSize = values.font.resolve(context).pointSize
    row.text.margin.top = pointSize * values.uiScale
  })

  row(`.end-of-matches(.blockquote) = true`, (context, row) => {
    let values = computeValues(context)
    let pointSize = values.font.resolve(context).pointSize
    row.text.margin.bottom = pointSize * values.uiScale
  })
  */

  row(`.codeblock`, (context, row) => {
    row.text.font = row.text.font.withMonospace()
  })

  row(`.note`, (context, row) => {
    row.text.font = row.text.font.withItalics()
  })

  row(`.unordered`, (context, row) => {
    let values = computeValues(context)
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

  row(`.ordered`, (context, row) => {
    let values = computeValues(context)
    let indent = values.indent
    let index = context.orderedIndex ?? 0
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

  row(`.task`, (context, row) => {
    let values = computeValues(context)
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

  row(`.@done`, (context, row) => {
    row.text.strikethrough.thick = true
  })

  row(`.task @done`, (context, row) => {
    row.text.decoration('mark', (mark, _) => {
      mark.contents.image = symbolImage('checkmark.square', row.text.color, row.text.font)
    })
  })

  row(`.hr`, (context, row) => {
    let values = computeValues(context)
    row.text.decoration('ruler', (ruler, layout) => {
      ruler.height = layout.fixed(Math.max(1 * values.uiScale, 0.5))
      ruler.width = layout.width.minus(row.text.padding.width)
      ruler.color = values.separatorColor
    })
  })
})

style.layer(`run-formatting`, (row, run, caret, viewport, include) => {
  run('.@emphasized', (context, text) => {
    text.font = text.font.withItalics()
  })

  run(`.@strong`, (context, text) => {
    text.font = text.font.withBold()
  })

  run(`.@code`, (context, text) => {
    text.font = text.font.withMonospace()
  })

  run(`.@highlight`, (context, text) => {
    let values = computeValues(context)
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
      highlight.mergable = true
    })
  })

  run(`.start-of-matches(.@highlight) = true`, (context, text) => {
    text.margin.left = 2.5 * computeValues(context).uiScale
  })

  run(`.end-of-matches(.@highlight) = true`, (context, text) => {
    text.margin.right = 2.5 * computeValues(context).uiScale
  })

  run(`.@strikethrough`, (context, text) => {
    text.strikethrough.thick = true
  })

  run(`.@link`, (context, text) => {
    text.color = Color.link().withAlpha(text.color.resolve(context).alpha)
  })

  run(`.end-of-matches(.@link) = true`, (context, text) => {
    let symbol = new SymbolConfiguration('arrow.up.forward.app')
      .withSymbolScale('medium')
      .withFont(text.font.withWeight('semibold'))
      .withHierarchicalColor(text.color.withAlpha(1))
    let image = Image.fromSymbol(symbol)
    let imageWidth = image.resolve(context).width * 1.1
    text.padding.right = imageWidth
    text.decoration('button', (button, layout) => {
      button.commandName = 'bike:.click-link'
      button.x = layout.trailing
      button.anchor.x = 0
      button.width = layout.fixed(imageWidth)
      button.contents.gravity = 'center'
      button.contents.image = image
    })
  })

  run(`.@baseline = subscript`, (context, text) => {
    let baseSize = text.font.resolve(context).pointSize
    text.font = text.font.withPointSize(0.75 * baseSize)
    text.baselineOffset = baseSize * -0.25
  })

  run(`.@baseline = superscript`, (context, text) => {
    let baseSize = text.font.resolve(context).pointSize
    text.font = text.font.withPointSize(0.75 * baseSize)
    text.baselineOffset = baseSize * 0.25
  })

  run(`.@attachment/parent::hr`, (context, text) => {
    text.attachmentSize.width = 1
  })
})

style.layer('controls', (row, run, caret, viewport, include) => {
  row(`.parent() = true`, (context, row) => {
    let values = computeValues(context)
    if (values.showFocusArrows) {
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
        focus.transitions.position = false
        if (context.isTyping && values.hideControlsWhenTyping) {
          focus.opacity = 0
        }
      })
    }
  })

  row(`.parent() = true and focused-root() = true`, (context, row) => {
    let values = computeValues(context)
    if (values.showFocusArrows) {
      row.text.decoration('focus', (focus, _) => {
        focus.rotation = 3.14
      })
    }
  })

  row(`.parent() = true and collapsed() = true`, (context, row) => {
    row.decoration('handle', (handle, _) => {
      handle.opacity = 1.0
    })
  })

  row(`.expanded() = true`, (context, row) => {
    row.decoration('handle', (handle, _) => {
      handle.rotation = 1.57
    })
    if (computeValues(context).showGuideLines) {
      row.decoration('guide', (guide, layout) => {
        guide.height = layout.bottom.minus(layout.firstLine.bottom)
      })
    }
  })

  row(`.body @text = "" and parent() = false and selection() = null`, (context, row) => {
    row.decoration('handle', (handle, _) => {
      handle.opacity = 0.0
    })
  })
})

style.layer('selection', (row, run, caret, viewport, include) => {
  row(`.selection() = block`, (context, row) => {
    let values = computeValues(context)
    row.decoration('selection', (background, layout) => {
      background.anchor.x = 0
      background.anchor.y = 0
      background.x = layout.leadingContent
      background.y = layout.top
      background.width = layout.width.offset(layout.leadingContent.scale(-1))
      background.height = layout.text.bottom.minus(layout.top).offset(row.text.margin.bottom)
      background.color = values.selectionColor.withAlpha(0.5)
      background.border.width = 1 * values.uiScale
      background.border.color = values.selectionColor //values.selectionColor.withAlpha(0.25)
      background.corners.radius = 3 * values.uiScale
      background.mergable = true
      background.transitions.color = false
      background.zPosition = -2
    })
  })

  run(`.@view-selected-range and not @view-marked-range`, (context, text) => {
    let values = computeValues(context)
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
      selection.mergable = true
    })
  })

  run(`.@view-selected-range and @view-marked-range`, (context, text) => {
    let values = computeValues(context)
    text.underline.thick = true
    text.underline.color = values.accentColor
  })

  run(`.@view-marked-range`, (context, text) => {
    let values = computeValues(context)
    text.underline.thick = true
    text.underline.color = values.selectionColor
  })
})

style.layer('highlights', (row, run, caret, viewport, include) => {
  run(`.@view-find-current or @view-check-current`, (context, run) => {
    let values = computeValues(context)
    let uiScale = values.uiScale

    run.decoration('selection', (highlight, layout) => {
      highlight.color = Color.findHighlight()
      highlight.border.width = 0
      highlight.shadow.opacity = 0.4
      highlight.shadow.radius = 2
      highlight.shadow.offset.height = 0
      highlight.x = highlight.x.offset(-1 * uiScale)
      highlight.width = highlight.width.offset(2 * uiScale)
    })
  })

  run(`.@view-active-replacement`, (context, text) => {
    let values = computeValues(context)

    text.decoration('replacement', (replacement, layout) => {
      replacement.anchor.x = 0
      replacement.anchor.y = 0
      replacement.y = layout.baseline.offset(2 * values.uiScale)
      replacement.x = layout.leading
      replacement.height = layout.fixed(2 * values.uiScale)
      replacement.width = layout.width
      replacement.color = values.replacementColor
      replacement.corners.radius = 1 * values.uiScale
      replacement.zPosition = -2
    })
  })
})

style.layer('outline-focus', (row, run, caret, viewport, include) => {
  // Modifies row decorations, so needs to be after layers that add decorations
  row(`.focused-branch() = false`, (context, row) => {
    let values = computeValues(context)
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
  row(`.*`, (context, row) => {
    let values = computeValues(context)
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

  run(`.*`, (context, text) => {
    let values = computeValues(context)
    if (values.focusMode) {
      let textFocusAlpha = values.textFocusAlpha
      text.color = text.color.withAlpha(textFocusAlpha)
      text.decorations((each, _) => {
        each.opacity *= textFocusAlpha
      })
    }
  })

  row(`.selection() = block`, (context, row) => {
    let values = computeValues(context)
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

  run(`.@view-word-focus`, (context, text) => {
    let values = computeValues(context)
    if (values.focusMode == 'word') {
      let textFocusAlpha = values.textFocusAlpha
      text.color = text.color.withAlpha(1.0)
      text.decorations((each, _) => {
        each.opacity /= textFocusAlpha
      })
    }
  })

  run(`.@view-sentence-focus`, (context, text) => {
    let values = computeValues(context)
    if (values.focusMode == 'sentence') {
      let textFocusAlpha = values.textFocusAlpha
      text.color = text.color.withAlpha(1.0)
      text.decorations((each, _) => {
        each.opacity /= textFocusAlpha
      })
    }
  })

  run(`.@view-paragraph-focus`, (context, text) => {
    let values = computeValues(context)
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
  row(`.filter-match() = false and selection() = null`, (context, row) => {
    if (context.isFiltering) {
      row.text.scale = 0.25
      row.text.margin.left *= 0.5
      row.decorations((each, _) => {
        each.opacity = 0
      })
    }
  })
})

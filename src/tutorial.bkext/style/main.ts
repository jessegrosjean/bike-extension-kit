import { Color, Image, SymbolConfiguration, defineEditorStyle, Insets, Font } from 'bike/style'

let style = defineEditorStyle('tutorial', 'Tutorial')

style.layer('base', (row, run, caret, viewport, include) => {
  row(`.*`, (context, row) => {
    row.padding = new Insets(10, 10, 10, 28)

    row.decoration('background', (background, layout) => {
      background.border.width = 1
      background.border.color = Color.systemBlue()
      background.zPosition = -1
    })

    row.text.padding = new Insets(5, 5, 5, 5)
    row.text.decoration('background', (background, layout) => {
      background.border.width = 1
      background.border.color = Color.systemGreen()
      background.zPosition = -2
    })
  })
})

style.layer('row-formatting', (row, run, caret, viewport, include) => {
  row(`.@type = task`, (context, row) => {
    row.text.decoration('mark', (mark, layout) => {
      let lineHeight = layout.firstLine.height
      mark.commandName = 'bike:toggle-done'
      mark.x = layout.leading.offset(-28 / 2)
      mark.y = layout.firstLine.centerY
      mark.width = lineHeight
      mark.height = lineHeight
      mark.contents.gravity = 'center'
      mark.contents.image = Image.fromSymbol(
        new SymbolConfiguration('square')
          .withHierarchicalColor(Color.text())
          .withFont(Font.systemBody())
      )
    })
  })

  row(`.@type = task and @done`, (context, row) => {
    row.text.strikethrough.thick = true
    row.text.decoration('mark', (mark, layout) => {
      mark.contents.image = Image.fromSymbol(
        new SymbolConfiguration('checkmark.square')
          .withHierarchicalColor(Color.text())
          .withFont(Font.systemBody())
      )
    })
  })
})

style.layer('selection', (row, run, caret, viewport, include) => {
  run(`.@view-selected-range`, (context, run) => {
    run.decoration('selection', (selection, layout) => {
      selection.zPosition = -1
      selection.color = Color.textBackgroundSelected().withAlpha(0.5)
    })
  })

  row(`.selection() = block`, (context, row) => {
    row.text.color = Color.white()
    row.text.decoration('background', (background, layout) => {
      background.color = Color.contentBackgroundSelected()
      background.border.color = Color.systemRed()
    })
  })
})

import { Color, Image, SymbolConfiguration, defineOutlineStyle, Insets, Font } from '@style'

let style = defineOutlineStyle('debug', 'Debug Style')

style.layer('base', (row, run, caret, viewport) => {
  row(`.*`, (editor, row) => {
    row.padding = new Insets(10, 10, 10, 28)

    row.decoration('background', (background, layout) => {
      background.border.width = 1
      background.border.color = Color.systemBlue()
      background.transitions.color = false
    })

    row.decoration('handle', (handle, layout) => {
      handle.color = Color.systemGray()
      handle.x = layout.leading.offset(20 / 2)
      handle.y = layout.firstLine.centerY
      let size = layout.firstLine.height.min(20)
      handle.width = size
      handle.height = size
    })

    row.text.padding = new Insets(5, 5, 5, 5)
    row.text.decoration('background', (background, layout) => {
      background.border.width = 1
      background.border.color = Color.systemGreen()
    })
  })

  row(`.parent() = true and collapsed() = true`, (editor, row) => {
    row.decoration('handle', (handle, _) => {
      handle.color = Color.black()
    })
  })

  row(`.expanded() = true`, (editor, row) => {
    row.decoration('handle', (handle, _) => {
      console.log('setting transition!')
      handle.color = Color.systemYellow()
    })
  })
})

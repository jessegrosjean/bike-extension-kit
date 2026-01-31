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

// ============================================================================
// New Color API Demo - Color spaces, mixing, and contrast selection
// ============================================================================

style.layer('color-api-demo', (row, run, caret, viewport, include) => {
  // Demo 1: HSL color constructor
  // Rows tagged "coral" get a warm coral background using HSL
  row(`.@tags contains coral`, (context, row) => {
    let coral = Color.hsla(0.03, 0.9, 0.6, 1.0)
    row.text.decoration('background', (bg) => {
      bg.color = coral.withAlpha(0.3)
      bg.cornerRadius = 4
    })
  })

  // Demo 2: OKLch color constructor
  // Rows tagged "perceptual" get a perceptually uniform blue using OKLch
  row(`.@tags contains perceptual`, (context, row) => {
    let softBlue = Color.oklch(0.7, 0.12, 0.7, 1.0)
    row.text.decoration('background', (bg) => {
      bg.color = softBlue.withAlpha(0.4)
      bg.cornerRadius = 4
    })
  })

  // Demo 3: OKLab color constructor
  // Rows tagged "lab" get a muted purple using OKLab
  row(`.@tags contains lab`, (context, row) => {
    let mutedPurple = Color.oklab(0.6, 0.1, -0.1, 1.0)
    row.text.decoration('background', (bg) => {
      bg.color = mutedPurple.withAlpha(0.4)
      bg.cornerRadius = 4
    })
  })

  // Demo 4: Color mixing with different color spaces
  // Rows tagged "mixed" show red-to-blue mixing in OKLch (smoother hue transition)
  row(`.@tags contains mixed`, (context, row) => {
    // Mix red and blue at 50% using OKLch for perceptually smooth transition
    let mixedColor = Color.systemRed().withFraction(0.5, Color.systemBlue(), 'oklch')
    row.text.decoration('background', (bg) => {
      bg.color = mixedColor.withAlpha(0.5)
      bg.cornerRadius = 4
    })
  })

  // Demo 5: Contrast selection for accessibility
  // Rows tagged "contrast" automatically pick black or white text for readability
  row(`.@tags contains contrast`, (context, row) => {
    let darkBackground = Color.oklch(0.3, 0.15, 0.8, 1.0)
    // Automatically select contrasting text color meeting WCAG AA
    let textColor = darkBackground.contrasted([Color.black(), Color.white()], 'aa')
    row.text.color = textColor
    row.text.decoration('background', (bg) => {
      bg.color = darkBackground
      bg.cornerRadius = 4
    })
  })

  // Demo 6: HSL mixing (hue interpolation via shortest path)
  row(`.@tags contains hslmix`, (context, row) => {
    // Mix yellow and cyan in HSL space - interpolates through green
    let hslMixed = Color.systemYellow().withFraction(0.5, Color.systemCyan(), 'hsl')
    row.text.decoration('background', (bg) => {
      bg.color = hslMixed.withAlpha(0.5)
      bg.cornerRadius = 4
    })
  })
})

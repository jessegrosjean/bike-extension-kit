import { Color, defineEditorStyleModifier } from 'bike/style'

let modifier = defineEditorStyleModifier('headinglevels', 'Heading Levels')

modifier.layer('row-formatting', (row) => {
  row(`.heading level() = 1`, (context, row) => {
    let color = context.theme.colors.get('heading1')
    if (color) row.text.color = color
    row.text.scale = 1.6
  })

  row(`.heading level() = 2`, (context, row) => {
    let color = context.theme.colors.get('heading2')
    if (color) row.text.color = color
    row.text.scale = 1.4
  })

  row(`.heading level() = 3`, (context, row) => {
    let color = context.theme.colors.get('heading3')
    if (color) row.text.color = color
    row.text.scale = 1.2
  })

  row(`.heading level() = 4`, (context, row) => {
    let color = context.theme.colors.get('heading4')
    if (color) row.text.color = color
    row.text.scale = 1.1
  })

  row(`.heading level() = 5`, (context, row) => {
    let color = context.theme.colors.get('heading5')
    if (color) row.text.color = color
    row.text.scale = 1.0
  })

  row(`.heading level() = 6`, (context, row) => {
    let color = context.theme.colors.get('heading6')
    if (color) row.text.color = color
    row.text.scale = 0.9
  })
})

import { Color, defineEditorStyleModifier } from 'bike/style'

let modifier = defineEditorStyleModifier('headinglevels', 'Heading Levels')

modifier.layer('row-formatting', (row) => {
  row(`.heading level() = 1`, (context, row) => {
    row.text.color = context.theme.colors.get('heading1')
  })
  row(`.heading level() = 2`, (context, row) => {
    row.text.color = context.theme.colors.get('heading2')
  })
  row(`.heading level() = 3`, (context, row) => {
    row.text.color = context.theme.colors.get('heading3')
  })
  row(`.heading level() = 4`, (context, row) => {
    row.text.color = context.theme.colors.get('heading4')
  })
  row(`.heading level() = 5`, (context, row) => {
    row.text.color = context.theme.colors.get('heading5')
  })
  row(`.heading level() = 6`, (context, row) => {
    row.text.color = context.theme.colors.get('heading6')
  })
})

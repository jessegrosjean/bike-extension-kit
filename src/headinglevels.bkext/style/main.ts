import { Color, defineEditorStyleModifier } from 'bike/style'

let modifier = defineEditorStyleModifier('headinglevels', 'Heading Levels')

modifier.layer('row-formatting', (row) => {
  row(`.heading level() = 1`, (context, row) => {
    row.text.color = Color.systemRed()
  })
})

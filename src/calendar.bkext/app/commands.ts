import { getDayRow, getMonthRow, getYearRow } from './calendar-rows'

export function yearCommand(): boolean {
  let editor = bike.frontmostWindow?.outlineEditors[0]
  if (!editor) {
    return true
  }

  editor.outline.transaction({ animate: 'default' }, () => {
    let outline = editor.outline
    let yearRow = getYearRow(outline, new Date(), true, true)
    editor.focus = yearRow
    editor.selectCaret(yearRow.firstChild!, 0)
  })

  return true
}

export function monthCommand(): boolean {
  let editor = bike.frontmostWindow?.outlineEditors[0]
  if (!editor) {
    return true
  }

  editor.outline.transaction({ animate: 'default' }, () => {
    let outline = editor.outline
    let monthRow = getMonthRow(outline, new Date(), true)
    editor.focus = monthRow
    editor.selectCaret(monthRow.firstChild!, 0)
  })

  return true
}

export function todayCommand(): boolean {
  let editor = bike.frontmostWindow?.currentOutlineEditor
  if (!editor) {
    return true
  }

  editor.outline.transaction({ animate: 'default' }, () => {
    let outline = editor.outline
    let todayRow = getDayRow(outline, new Date())
    if (!todayRow.firstChild) {
      outline.insertRows([{}], todayRow)
    }
    editor.focus = todayRow
    editor.selectCaret(todayRow.firstChild!, 0)
  })

  return true
}

import { CommandContext } from 'bike/app'
import { getDayRow, getMonthRow, getYearRow } from './calendar-rows'

export function yearCommand(context: CommandContext): boolean {
  let editor = context.editor
  if (!editor) return true
  editor.outline.transaction({ animate: 'default' }, () => {
    let outline = editor.outline
    let yearRow = getYearRow(outline, new Date(), true, true)
    editor.focus = yearRow
    editor.selectCaret(yearRow.firstChild!, 0)
  })
  return true
}

export function monthCommand(context: CommandContext): boolean {
  let editor = context.editor
  if (!editor) return true
  editor.outline.transaction({ animate: 'default' }, () => {
    let outline = editor.outline
    let monthRow = getMonthRow(outline, new Date(), true)
    editor.focus = monthRow
    editor.selectCaret(monthRow.firstChild!, 0)
  })
  return true
}

export function todayCommand(context: CommandContext): boolean {
  let editor = context.editor
  if (!editor) return true
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

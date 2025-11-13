import { CommandContext, OutlineEditor, Row, TransactionOptions } from 'bike/app'

function moveRowsWithTransaction(
  editor: OutlineEditor,
  coverRows: Row[],
  parent: Row,
  before: Row | undefined,
  label: string
): boolean {
  editor.transaction({ label: label, animate: 'default' }, () => {
    editor.revealRow(parent, true)
    editor.outline.moveRows(coverRows, parent, before)
  })
  return true
}

export function moveUpMaintainingLevelCommand(context: CommandContext): boolean {
  const editor = context.editor
  const coverRows = context.selection?.coverRows

  if (!editor || !coverRows || coverRows.length === 0) return false

  const focus = editor.focus
  const firstRow = coverRows[0]
  const firstRowLevel = firstRow.level
  let prev = firstRow.prevBranch
  let beforePrev = true

  while (prev) {
    if (!focus.isDescendant(prev)) {
      break
    }

    const prevLevel = prev.level

    if (prevLevel === firstRowLevel) {
      return moveRowsWithTransaction(
        editor,
        coverRows,
        prev.parent,
        beforePrev ? prev : prev.nextSibling,
        'Move Up'
      )
    }

    if (prevLevel === firstRowLevel - 1 && prev.id !== firstRow.parent.id) {
      return moveRowsWithTransaction(editor, coverRows, prev, undefined, 'Move Up')
    }

    prev = prev.prevInOutline
    beforePrev = false
  }

  return true
}

export function moveDownMaintainingLevelCommand(context: CommandContext): boolean {
  const editor = context.editor
  const coverRows = context.selection?.coverRows

  if (!editor || !coverRows || coverRows.length === 0) return false

  const focus = editor.focus
  const lastRow = coverRows[coverRows.length - 1]
  const lastRowLevel = lastRow.level
  let next = lastRow.nextBranch
  let afterNext = true

  while (next) {
    if (!focus.isDescendant(next)) {
      break
    }

    const nextLevel = next.level

    if (nextLevel === lastRowLevel) {
      return moveRowsWithTransaction(
        editor,
        coverRows,
        next.parent,
        afterNext ? next.nextSibling : next,
        'Move Down'
      )
    }

    if (nextLevel === lastRowLevel - 1 && next.id !== lastRow.parent.id) {
      return moveRowsWithTransaction(editor, coverRows, next, next.firstChild, 'Move Down')
    }

    next = next.nextInOutline
    afterNext = false
  }

  return true
}

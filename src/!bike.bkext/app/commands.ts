import { AttributedString, CommandContext, OutlineEditor, Range, Selection, URL } from 'bike/app'

export function homeCommand(context: CommandContext): boolean {
  let editor = context.editor
  if (!editor) return false
  editor.transaction({ animate: 'default' }, () => {
    editor.filter = ''
    editor.focus = editor.outline.root
  })
  return true
}

export function headingsCommand(context: CommandContext): boolean {
  let editor = context.editor
  if (!editor) return false
  editor.transaction({ animate: 'default' }, () => {
    if (editor.filter == '//heading') {
      editor.filter = ''
    } else {
      editor.filter = '//heading'
    }
  })
  return true
}

export function toggleFocusCommand(context: CommandContext): boolean {
  let editor = context.editor
  let row = context.selection?.row
  if (!editor || !row) return false
  if (editor.focus.id == row.id) {
    editor.focus = editor.outline.root
  } else {
    editor.focus = row
  }
  return true
}

export function toggleFoldCommand(context: CommandContext): boolean {
  let editor = context.editor
  let row = context.selection?.row
  if (!editor || !row) return false
  if (editor.isCollapsed(row)) {
    editor.expand([row])
  } else {
    editor.collapse([row])
  }
  return true
}

export function toggleDoneCommand(context: CommandContext) {
  let editor = context.editor
  let rows = context.selection?.rows
  if (!editor || !rows || rows.length == 0) return false
  let nextDoneDate = rows[0].attributes['data-done'] ? null : new Date()
  editor.transaction({ animate: 'default' }, () => {
    rows.forEach((row) => {
      if (nextDoneDate) {
        row.setAttribute('data-done', nextDoneDate)
      } else {
        row.removeAttribute('data-done')
      }
    })
  })
  return true
}

export function openLinkCommand(context: CommandContext): boolean {
  let editor = context.editor
  let selection = context.selection
  if (!editor || !selection) return false
  let urls = findURLs(editor, selection)
  if (urls.length == 0) return false
  for (let url of urls) {
    url.open({})
  }
  return true
}

function findURLs(editor: OutlineEditor, selection: Selection): URL[] {
  let row = selection.row
  if (selection.type == 'caret') {
    const link = row.text.attributeAt('link', selection.detail.char)
    if (link) {
      return [new URL(link)]
    }
  } else if (selection.type == 'text') {
    return findURLsInText(selection.detail.text)
  } else if (selection.type == 'block') {
    const urls: URL[] = []
    for (let row of selection.rows) {
      findURLsInText(row.text).forEach((url) => {
        urls.push(url)
      })
    }
    return urls
  }
  return []
}

function findURLsInText(text: AttributedString): URL[] {
  const urls: URL[] = []
  const range: Range = [0, 0]
  while (range[0] < text.string.length) {
    const link = text.attributeAt('link', range[0], 'downstream', range)
    if (link) {
      urls.push(new URL(link))
    }
    range[0] = range[1]
    range[1] = range[0]
  }
  return urls
}

import { AttributedString, CommandContext, FoldOptions, OutlineEditor, Range, Selection, URL } from 'bike/app'

export function clickHandleCommand(context: CommandContext): boolean {
  let options: FoldOptions = bike.keybindings.isOptionPressed ? 'completely' : 'row'
  let editor = context.editor
  let row = context.selection?.row
  if (!editor || !row) return false
  if (editor.isCollapsed(row)) {
    editor.expand([row], options)
  } else {
    editor.collapse([row], options)
  }
  return true
}

export function clickFocusCommand(context: CommandContext): boolean {
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

export function clickLinkCommand(context: CommandContext): boolean {
  let editor = context.editor
  let selection = context.selection
  if (!editor || !selection) return false
  let urls = findURLs(editor, selection)
  if (urls.length == 0) return false
  for (let url of urls) {
    if (url.scheme === 'bike') {
      let queryParameters = url.queryParameters || {}

      if (bike.keybindings.isCommandPressed) {
        queryParameters.target = 'tab'
      } else if (bike.keybindings.isOptionPressed) {
        queryParameters.target = 'window'
      }

      if (queryParameters.target) {
        queryParameters.activate = bike.keybindings.isShiftPressed ? 'true' : 'false'
      }

      url.queryParameters = queryParameters
      url.open({})
    } else {
      let activate = !(bike.keybindings.isCommandPressed || bike.keybindings.isOptionPressed)
        || bike.keybindings.isShiftPressed
      url.open({ activate })
    }
  }
  return true
}

function findURLs(editor: OutlineEditor, selection: Selection): URL[] {
  let row = selection.row
  if (selection.type == 'caret') {
    const link = row.text.attributeAt('a', selection.detail.char)
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
  while (range[0] < text.count) {
    const link = text.attributeAt('a', range[0], 'downstream', range)
    if (link) {
      urls.push(new URL(link))
    }
    range[0] = range[1]
    range[1] = range[0]
  }
  return urls
}

export function homeCommand(): boolean {
  let editor = bike.frontmostOutlineEditor
  if (editor) {
    editor.transaction({ animate: 'default' }, () => {
      editor.filter = ''
      editor.focus = editor.outline.root
    })
  }
  return true
}

export function headingsCommand(): boolean {
  let editor = bike.frontmostOutlineEditor
  if (editor) {
    editor.transaction({ animate: 'default' }, () => {
      if (editor.filter == '//heading') {
        editor.filter = ''
      } else {
        editor.filter = '//heading'
      }
    })
  }
  return true
}

export function toggleDoneCommand() {
  let editor = bike.frontmostOutlineEditor
  let rows = editor?.selection?.rows
  if (editor && rows && rows.length > 0) {
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
  }
  return true
}

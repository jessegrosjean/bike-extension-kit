import { AppExtensionContext, Row, CommandContext } from 'bike/app'

export async function activate(context: AppExtensionContext) {
  bike.commands.addCommands({
    commands: {
      'tutorial:archive-done': archiveDoneCommand,
    },
  })

  bike.keybindings.addKeybindings({
    keymap: 'block-mode',
    keybindings: {
      a: 'tutorial:archive-done',
    },
  })
}

function archiveDoneCommand(context: CommandContext): boolean {
  let editor = context.editor
  if (!editor) return false

  // Get the outline, done rows, and archive row
  let outline = editor.outline
  let donePath = '//@data-done except //@id = archive//*'
  let doneRows = outline.query(donePath).value as Row[]
  let archiveRow = (outline.query('//@id = archive').value as Row[])[0]

  // Insert an Archive row if needed and move done rows
  outline.transaction({ animate: 'default' }, () => {
    if (!archiveRow) {
      archiveRow = outline.insertRows(
        [
          {
            id: 'archive',
            text: 'Archive',
          },
        ],
        outline.root
      )[0]
    }
    outline.moveRows(doneRows, archiveRow)
  })

  // Present the archive done sheet with the count of done rows
  bike.frontmostWindow?.presentSheet('archive-done-sheet.js').then((handle) => {
    handle.postMessage(doneRows.length)
  })

  return true
}

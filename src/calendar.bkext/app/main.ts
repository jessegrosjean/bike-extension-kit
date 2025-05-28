import { AppExtensionContext, Window } from '@app'
import { todayCommand, monthCommand, yearCommand } from './commands'
import { getDayRow } from './calendar-rows'

export async function activate(context: AppExtensionContext) {
  bike.commands.addCommands({
    commands: {
      'calendar:today': todayCommand,
      'calendar:month': monthCommand,
      'calendar:year': yearCommand,
    },
  })

  bike.observeWindows(async (window: Window) => {
    window.sidebar.addItem({
      id: 'calendar:today',
      text: 'Today',
      symbol: 'calendar',
      ordering: { section: 'actions' },
      action: 'calendar:today',
    })

    const calendarHandle = await window.inspector.addItem({
      id: 'calendar:calendar',
      name: 'Calendar.js',
    })

    calendarHandle.onmessage = (message) => {
      let editor = window.currentOutlineEditor

      if (editor && message.date) {
        let outline = editor.outline
        let dateRow = getDayRow(editor.outline, message.date)
        if (!dateRow.firstChild) {
          outline.insertRows([{}], dateRow)
        }
        editor.focus = dateRow
        editor.selectCaret(dateRow.firstChild!, 0)
      }
    }
  })
}

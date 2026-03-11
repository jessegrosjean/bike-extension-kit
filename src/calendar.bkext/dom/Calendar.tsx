import { DOMExtensionContext } from 'bike/dom'
import { createRoot } from 'react-dom/client'
import Calendar from 'react-calendar'
import './Calendar.css'

export function activate(context: DOMExtensionContext) {
  const container = context.element
  const root = createRoot(container)

  function onChange(nextValue: any) {
    context.postMessage({
      date: nextValue,
    })
  }

  root.render(
    <div>
      <Calendar
        onChange={onChange}
        defaultValue={new Date()}
        maxDetail="month"
        minDetail="month"
        prev2Label={null}
        next2Label={null}
        formatShortWeekday={(_locale: any, date: Date) => ['S','M','T','W','T','F','S'][date.getDay()]}
      />
    </div>
  )
}

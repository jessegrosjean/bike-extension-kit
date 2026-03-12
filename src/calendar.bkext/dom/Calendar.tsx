import { DOMExtensionContext } from 'bike/dom'
import { SFSymbol } from 'bike/components'
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
        locale={navigator.language}
        prevLabel={<SFSymbol name="chevron.left" scale="small" weight="medium" />}
        nextLabel={<SFSymbol name="chevron.right" scale="small" weight="medium" />}
        prev2Label={null}
        next2Label={null}
        formatShortWeekday={(_locale: any, date: Date) => date.toLocaleDateString(navigator.language, { weekday: 'narrow' })}
      />
    </div>
  )
}

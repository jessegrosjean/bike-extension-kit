import { DOMExtensionContext } from '@dom'
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
      <Calendar onChange={onChange} />
    </div>
  )
}

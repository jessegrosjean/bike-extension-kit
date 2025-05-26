import './Calendar.css'
import { DOMExtensionContext } from '@dom'
import { createRoot } from 'react-dom/client'
import Calendar from 'react-calendar'

export function activate(context: DOMExtensionContext) {
  const container = context.element
  const root = createRoot(container)

  function onChange(nextValue: any) {
    console.log('Selected date:', nextValue)
  }

  root.render(
    <div>
      <Calendar onChange={onChange} />
    </div>
  )
}

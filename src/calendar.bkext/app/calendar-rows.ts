import { Outline, Row } from '@app'
import { getDaysInMonth, getMonthsInYear, getDateComponents } from './util'

export function getCalendarRow(outline: Outline): Row {
  return getDateIdRow('caledar', 'Calendar', outline.root)
}

export function getYearRow(
  outline: Outline,
  date: Date,
  addMonths: boolean,
  addDays: boolean
): Row {
  let dateComponents = getDateComponents(date)
  let yearRow = outline.getRowById(dateComponents.yearId)
  if (yearRow && !addMonths && !addDays) {
    return yearRow
  }

  return outline.transaction({ animate: 'default' }, () => {
    let calendarRow = getCalendarRow(outline)
    let yearRow = getDateIdRow(dateComponents.yearId, dateComponents.yearName, calendarRow)
    if (addMonths) {
      let months = getMonthsInYear(date.getFullYear())
      for (const month of months) {
        getMonthRow(outline, month, addDays)
      }
    }
    return yearRow
  })
}

export function getMonthRow(outline: Outline, date: Date, addDays: boolean): Row {
  let dateComponents = getDateComponents(date)
  let monthRow = outline.getRowById(dateComponents.monthId)

  if (monthRow && !addDays) {
    return monthRow
  }

  return outline.transaction({ animate: 'default' }, () => {
    let yearRow = getYearRow(outline, date, false, false)
    let monthRow = getDateIdRow(dateComponents.monthId, dateComponents.monthName, yearRow)
    if (addDays) {
      let days = getDaysInMonth(date)
      for (const day of days) {
        getDayRow(outline, day)
      }
    }
    return monthRow
  })
}

export function getDayRow(outline: Outline, date: Date): Row {
  let dateComponents = getDateComponents(date)
  let dateRow = outline.getRowById(dateComponents.dayId)

  if (dateRow) {
    return dateRow
  }

  return outline.transaction({ animate: 'default' }, () => {
    let monthRow = getMonthRow(outline, date, false)
    let dayRow = getDateIdRow(dateComponents.dayId, dateComponents.dayName, monthRow)
    return dayRow
  })
}

function getDateIdRow(dateId: string, text: string, parent: Row): Row {
  let outline = parent.outline
  let row = outline.getRowById(dateId)

  if (row) {
    return row
  }

  let dateIdPattern = /\d{4}\/\d{2}\/\d{2}/
  let insertBefore: Row | undefined

  for (const child of parent.children) {
    if (child.id.match(dateIdPattern) && dateId < child.id) {
      insertBefore = child
      break
    }
  }

  return outline.insertRows(
    [
      {
        id: dateId,
        text: text,
      },
    ],
    parent,
    insertBefore
  )[0]
}

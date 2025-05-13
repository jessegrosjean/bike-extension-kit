export function getMonthsInYear(year: number): Date[] {
  const months: Date[] = []
  for (let month = 0; month < 12; month++) {
    months.push(new Date(year, month, 1))
  }
  return months
}

export function getDaysInMonth(date: Date): Date[] {
  const year = date.getFullYear()
  const month = date.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const dates: Date[] = []
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(new Date(year, month, day))
  }
  return dates
}

export function getDateComponents(date: Date): {
  yearName: string
  yearId: string
  monthName: string
  monthId: string
  dayName: string
  dayId: string
  timeName: string
} {
  const yearName = date.getFullYear().toString()
  const yearId = `${yearName}/00/00`
  const monthName = date.toLocaleString('default', { month: 'long' }) + `, ${yearName}`
  const monthId = `${yearName}/${String(date.getMonth() + 1).padStart(2, '0')}/00`
  const dayName =
    date.toLocaleString('default', { month: 'long' }) +
    ` ${String(date.getDate()).padStart(2, '0')}, ${yearName}`
  const dayId = `${yearName}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(
    date.getDate()
  ).padStart(2, '0')}`

  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours === 0 ? 12 : hours
  const timeName = `${hours}:${minutes} ${ampm}`

  return { yearName, yearId, monthName, monthId, dayName, dayId, timeName }
}

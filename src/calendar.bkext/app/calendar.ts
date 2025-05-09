import { Outline, Row } from "@app";

export function getOrCreateCalendarRow(outline: Outline): Row {
    return getOrInsertDateIdRow("caledar", "Calendar", outline.root, outline);
}

export function getOrCreateCalendarYearRow(outline: Outline, date: Date, addMonths: boolean, addDays: boolean): Row {
    let dateComponents = getComponents(date);
    let yearRow = outline.getRowById(dateComponents.yearId);
    if (yearRow && !addMonths && !addDays) { return yearRow; }

    return outline.transaction({ animate: "default" }, () => {
        let calendarRow = getOrCreateCalendarRow(outline);
        let yearRow = getOrInsertDateIdRow(dateComponents.yearId, dateComponents.yearName, calendarRow, outline);
        if (addMonths) {
            let months = getMonthsInYear(date.getFullYear());
            for (const month of months) {
                getOrCreateCalendarMonthRow(outline, month, addDays);
            }
        }
        return yearRow;
    });
}

export function getOrCreateCalendarMonthRow(outline: Outline, date: Date, addDays: boolean): Row {
    let dateComponents = getComponents(date);
    let monthRow = outline.getRowById(dateComponents.monthId);

    if (monthRow && !addDays) { return monthRow; }

    return outline.transaction({ animate: "default" }, () => {
        let yearRow = getOrCreateCalendarYearRow(outline, date, false, false);
        let monthRow = getOrInsertDateIdRow(dateComponents.monthId, dateComponents.monthName, yearRow, outline);
        if (addDays) {
            let days = getDaysInMonth(date);
            for (const day of days) {
                getOrCreateCalendarDayRow(outline, day);
            }
        }
        return monthRow;
    });
}

export function getOrCreateCalendarDayRow(outline: Outline, date: Date): Row {
    let dateComponents = getComponents(date);
    let dateRow = outline.getRowById(dateComponents.dayId);

    if (dateRow) { return dateRow; }

    return outline.transaction({ animate: "default" }, () => {
        let monthRow = getOrCreateCalendarMonthRow(outline, date, false);
        let dayRow = getOrInsertDateIdRow(dateComponents.dayId, dateComponents.dayName, monthRow, outline);
        return dayRow;
    });    
}

function getOrInsertDateIdRow(dateId: string, text: string, parent: Row, outline: Outline): Row {
    let row = outline.getRowById(dateId);

    if (row) { return row; }

    let dateIdPattern = /\d{4}\/\d{2}\/\d{2}/;
    let insertBefore: Row | undefined;

    for (const child of parent.children) {
        if (child.id.match(dateIdPattern) && dateId < child.id) {
            insertBefore = child;
            break;
        }
    }

    return outline.insertRows([{
        id: dateId,
        text: text,
    }], parent, insertBefore)[0];
}

function getMonthsInYear(year: number): Date[] {
    const months: Date[] = [];
    for (let month = 0; month < 12; month++) {
      months.push(new Date(year, month, 1));
    }
    return months;
}

function getDaysInMonth(date: Date): Date[] {
    const year = date.getFullYear();
    const month = date.getMonth();  
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates: Date[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day));
    }
    return dates;
}

function getComponents(date: Date): {
    yearName: string;
    yearId: string;
    monthName: string;
    monthId: string;
    dayName: string;
    dayId: string;
    timeName: string;
} {
    const yearName = date.getFullYear().toString();
    const yearId = `${yearName}/00/00`;
    const monthName = date.toLocaleString('default', { month: 'long' }) + `, ${yearName}`;
    const monthId = `${yearName}/${String(date.getMonth() + 1).padStart(2, '0')}/00`;
    const dayName = date.toLocaleString('default', { month: 'long' }) + ` ${String(date.getDate()).padStart(2, '0')}, ${yearName}`;
    const dayId = `${yearName}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    const timeName = `${hours}:${minutes} ${ampm}`;
    
    return { yearName, yearId, monthName, monthId, dayName, dayId, timeName };
}
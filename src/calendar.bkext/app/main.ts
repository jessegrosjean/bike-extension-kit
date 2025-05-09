import { AppExtensionContext, Window } from '@app';
import { getOrCreateCalendarDayRow, getOrCreateCalendarMonthRow, getOrCreateCalendarYearRow } from "./calendar";

export async function activate(context: AppExtensionContext) {
    bike.commands.addCommands({
        commands: {
            "calendar:today": todayCommand,
            "calendar:month": monthCommand,
            "calendar:year": yearCommand
        }
    });
    
    bike.observeWindows(async (window: Window) => {
        window.sidebar.addItem({
            id: "calendar:today",
            text: "Today",
            symbol: "calendar",
            ordering: { section: "actions" },
            action: "calendar:today",
        });
    });
}

function yearCommand(): boolean {
    let editor = bike.frontmostWindow?.outlineEditors[0];
    if (!editor) { return true; }

    editor.outline.transaction({ animate: "default" }, () => {
        let outline = editor.outline;
        let yearRow = getOrCreateCalendarYearRow(outline, new Date(), true, true);
        editor.focus = yearRow;
        editor.selectCaret(yearRow.firstChild!, 0);
    });

    return true;
}

function monthCommand(): boolean {
    let editor = bike.frontmostWindow?.outlineEditors[0];
    if (!editor) { return true; }

    editor.outline.transaction({ animate: "default" }, () => {
        let outline = editor.outline;
        let monthRow = getOrCreateCalendarMonthRow(outline, new Date(), true);
        editor.focus = monthRow;
        editor.selectCaret(monthRow.firstChild!, 0);
    });

    return true;
}

function todayCommand(): boolean {
    let editor = bike.frontmostWindow?.outlineEditors[0];
    if (!editor) { return true; }

    editor.outline.transaction({ animate: "default" }, () => {
        let outline = editor.outline;
        let todayRow = getOrCreateCalendarDayRow(outline, new Date());
        if (!todayRow.firstChild) { outline.insertRows([{}], todayRow) }
        editor.focus = todayRow;
        editor.selectCaret(todayRow.firstChild!, 0);
    });

    return true;
}
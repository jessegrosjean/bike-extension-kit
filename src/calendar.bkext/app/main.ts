import { AppExtensionContext, Window } from '@app';
import { todayCommand, monthCommand, yearCommand } from "./commands";

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
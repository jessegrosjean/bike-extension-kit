import { AppExtensionContext, Window, DOMScriptName, Row } from "@app";

export async function activate(context: AppExtensionContext) {
    bike.commands.addCommands({
        commands: {
            "d3:show-tree-view": () => showD3Sheet("tree-view.js"),
            "d3:show-radial-view": () => showD3Sheet("radial-view.js"),
        }
    });
    
    bike.observeWindows(async (window: Window) => {
        window.sidebar.addItem({
            id: "d3:tree-view",
            text: "Tree View",
            symbol: "tree",
            ordering: { section: "actions" },
            action: "d3:show-tree-view",
        });

        window.sidebar.addItem({
            id: "d3:radial-view",
            text: "Radial View",
            symbol: "tree.circle",
            ordering: { section: "actions" },
            action: "d3:show-radial-view",
        });
    });
}

function showD3Sheet(domScriptName: DOMScriptName): boolean {
    let window = bike.frontmostWindow;
    if (window) {
        window.presentSheet(domScriptName).then((handle) => {
            let editor = window.currentOutlineEditor;
            if (editor) {
                handle.postMessage({
                    "type": "load",
                    "data": buildD3Hierarchy(editor.focus)
                });
            }
            handle.onmessage = (message) => {
                console.log(message);
            }
        });
    }
    return true
}

function buildD3Hierarchy(row: Row): any {
    return {
        id: row.id,
        name: trimString(row.text.string, 32),
        children: row.children.flatMap(child => {
            if (child.firstChild || child.text.string.length > 0) {
                return [buildD3Hierarchy(child)]
            } else {
                return []
            }
        })
    };
}

function trimString(string: string, maxLength: number): string {
    if (string.length <= maxLength) {
        return string;
    }
    return string.slice(0, maxLength - 1) + '…';
}
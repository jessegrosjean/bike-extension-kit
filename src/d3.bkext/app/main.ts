import { AppExtensionContext, Window, DOMScriptName, Sidebar, SidebarItem, Row } from "@app";

export async function activate(context: AppExtensionContext) {
    bike.commands.addCommands({
        commands: {
            "d3:show-tree-view": showTreeView,
            "d3:show-radial-view": showRadialView,
        }
    });
    
    bike.observeWindows(async (window: Window) => {
        window.sidebar.addItem(treeViewItem(window.sidebar));
        window.sidebar.addItem(radialViewItem(window.sidebar));
    });
}

function treeViewItem(sidebar: Sidebar): SidebarItem {
    return {
        id: "d3:tree-view",
        text: "Tree View",
        symbol: "tree",
        ordering: { section: "actions" },
        action: "d3:show-tree-view",
    };
}

function radialViewItem(sidebar: Sidebar): SidebarItem {
    return {
        id: "d3:radial-view",
        text: "Radial View",
        symbol: "tree.circle",
        ordering: { section: "actions" },
        action: "d3:show-radial-view",
    };
}

function showTreeView(): boolean {
    return showD3Sheet("tree-view.ts");
}

function showRadialView(): boolean {
    return showD3Sheet("radial-view.ts");
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
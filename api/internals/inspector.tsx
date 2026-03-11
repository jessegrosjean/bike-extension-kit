// Tab container management using imperative DOM operations.
// Must be synchronous so __bikeGetTabContainer finds the div
// immediately after __bikeAddTab is called from Swift.
//
// All panels stay in the DOM. Inactive panels are hidden with
// display:none so React components remain mounted. Extensions
// can use IntersectionObserver to detect visibility changes.

declare global {
  interface Window {
    BikeInspector: any
    __bikeSetActiveTab?: (tabId: string) => void
    __bikeGetTabContainer?: (tabId: string) => HTMLElement | null
    __bikeAddTab?: (tabId: string) => void
    __bikeRemoveTab?: (tabId: string) => void
  }
}

const tabPanels = new Map<string, HTMLDivElement>()
let activeTabId = ''

function setActiveTab(tabId: string) {
  if (tabId === activeTabId) return

  // Hide previous active panel
  if (activeTabId) {
    const prev = tabPanels.get(activeTabId)
    if (prev) {
      prev.style.display = 'none'
    }
  }

  activeTabId = tabId

  // Show new active panel
  const next = tabPanels.get(tabId)
  if (next) {
    next.style.display = ''
  }
}

function getTabContainer(tabId: string): HTMLElement | null {
  return tabPanels.get(tabId) || null
}

function addTab(tabId: string) {
  if (tabPanels.has(tabId)) return
  const panel = document.createElement('div')
  panel.id = 'tab-panel-' + tabId
  panel.style.display = 'none'
  document.body.appendChild(panel)
  tabPanels.set(tabId, panel)
  // Auto-activate first tab
  if (tabPanels.size === 1) {
    setActiveTab(tabId)
  }
}

function removeTab(tabId: string) {
  const panel = tabPanels.get(tabId)
  if (panel) {
    panel.remove()
    tabPanels.delete(tabId)
  }
  if (activeTabId === tabId) {
    activeTabId = ''
    if (tabPanels.size > 0) {
      setActiveTab(tabPanels.keys().next().value!)
    }
  }
}

window.__bikeSetActiveTab = setActiveTab
window.__bikeGetTabContainer = getTabContainer
window.__bikeAddTab = addTab
window.__bikeRemoveTab = removeTab

window.BikeInspector = {}

export {}

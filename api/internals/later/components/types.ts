export interface BaseTab {
  id: string
  title: string
}

export interface ReactTab extends BaseTab {
  content: React.ReactNode
  contentElement?: never
}

export interface DOMTab extends BaseTab {
  content?: never
  contentElement: HTMLElement
}

export type Tab = ReactTab | DOMTab

declare global {
  interface Window {
    registerTab?: (tab: Tab) => void
  }
}

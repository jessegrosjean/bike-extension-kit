import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Tab } from './types.ts'

interface TabsContextType {
  tabs: Tab[]
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

export const TabsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'home',
      title: 'Home',
      content: <div>Welcome to the app!</div>,
    },
  ])

  const registerTab = (tab: Tab) => {
    setTabs((prev) => [...prev, tab])
  }

  useEffect(() => {
    window.registerTab = registerTab
    return () => {
      delete window.registerTab
    }
  }, [])

  return <TabsContext.Provider value={{ tabs }}>{children}</TabsContext.Provider>
}

export const useTabs = () => {
  const context = useContext(TabsContext)
  if (!context) throw new Error('useTabs must be used inside TabsProvider')
  return context
}

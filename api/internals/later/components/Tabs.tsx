import React, { useState, useEffect, useRef } from 'react'
import { useTabs } from './TabsContext'
import type { Tab } from './types'

const Tabs: React.FC = () => {
  const { tabs } = useTabs()
  const [activeId, setActiveId] = useState<string>(tabs[0]?.id ?? '')
  const containerRef = useRef<HTMLDivElement>(null)

  const activeTab: Tab | undefined = tabs.find((t) => t.id === activeId)

  // Clear and mount DOM-based content when needed
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.innerHTML = '' // clear previous content

    if (activeTab && 'contentElement' in activeTab && activeTab.contentElement) {
      container.appendChild(activeTab.contentElement)
    }
  }, [activeTab])

  return (
    <div>
      <div className="tab-bar">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveId(tab.id)}>
            {tab.title}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {'content' in (activeTab ?? {}) && activeTab?.content}
        {'contentElement' in (activeTab ?? {}) && <div ref={containerRef} />}
      </div>
    </div>
  )
}

export default Tabs

import React, { useState, useRef, useEffect } from 'react';
import { Tabs, Tab, IconButton, Box } from '@mui/material';

const MAX_TABS = 5;

export default function TabsManager({ initialTabs }) {
  const [tabs, setTabs] = useState(initialTabs || []);
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id);
  const openTabRef = useRef();

  // Expor função global para abrir abas dinamicamente
  useEffect(() => {
    window.openTab = (newTab) => {
      const exists = tabs.find(tab => tab.id === newTab.id);
      if (exists) {
        setActiveTabId(newTab.id);
        return;
      }
      if (tabs.length >= MAX_TABS) {
        alert('Limite de abas atingido!');
        return;
      }
      setTabs([...tabs, newTab]);
      setActiveTabId(newTab.id);
    };
    // Limpeza
    return () => { delete window.openTab; };
  }, [tabs]);

  function closeTab(tabId) {
    const filtered = tabs.filter(tab => tab.id !== tabId);
    setTabs(filtered);
    if (activeTabId === tabId && filtered.length > 0) {
      setActiveTabId(filtered[filtered.length - 1].id);
    }
  }

  return (
    <Box>
      <Tabs
        value={tabs.findIndex(tab => tab.id === activeTabId)}
        onChange={(e, idx) => setActiveTabId(tabs[idx].id)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider', background: '#fff' }}
      >
        {tabs.map((tab, idx) => (
          <Tab
            key={tab.id}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{tab.title}</span>
                {idx !== 0 && (
                  <Box 
                    component="span" 
                    sx={{ 
                      cursor: 'pointer',
                      fontSize: '18px',
                      lineHeight: 1,
                      color: 'text.secondary',
                      '&:hover': { color: 'error.main' }
                    }} 
                    onClick={e => { e.stopPropagation(); closeTab(tab.id); }}
                  >
                    ×
                  </Box>
                )}
              </Box>
            }
            value={idx}
            sx={{ minWidth: 120 }}
          />
        ))}
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {tabs.map(tab =>
          tab.id === activeTabId ? (
            <tab.component key={tab.id} {...tab.props} />
          ) : null
        )}
      </Box>
    </Box>
  );
}

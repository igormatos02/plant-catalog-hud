import React, { useState } from 'react';
import { LayoutGrid, Info, ChevronLeft, ChevronRight, Leaf } from 'lucide-react';

const Sidebar = ({ activePage, setActivePage }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'catalog', label: 'Catalog', icon: LayoutGrid },
    { id: 'about', label: 'About Us', icon: Info },
  ];

  return (
    <div 
      className={`glass-panel sidebar ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        width: isCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0',
      }}
    >
      <div className="logo-container" style={{ padding: '0 20px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ minWidth: '40px', height: '40px', borderRadius: '8px', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px var(--accent-glow)' }}>
          <Leaf color="black" size={24} />
        </div>
        {!isCollapsed && <span className="neon-text" style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '2px' }}>A.G. BOTANICS</span>}
      </div>

      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '16px 24px',
                gap: '16px',
                color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(0, 242, 255, 0.05)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-color)' : '3px solid transparent',
                transition: 'all 0.2s ease',
              }}
              className="menu-item"
            >
              <Icon size={20} />
              {!isCollapsed && <span style={{ fontWeight: 500 }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          margin: '20px',
          alignSelf: isCollapsed ? 'center' : 'flex-end',
          padding: '8px',
          borderRadius: '50%',
          border: '1px solid var(--border-color)',
          color: 'var(--text-secondary)',
        }}
        className="collapse-btn hud-border"
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        .menu-item:hover {
          color: var(--accent-color) !important;
          background: rgba(0, 242, 255, 0.03) !important;
        }
      `}} />
    </div>
  );
};

export default Sidebar;

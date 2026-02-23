import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children, activePage, setActivePage }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
            <Sidebar activePage={activePage} setActivePage={setActivePage} />

            <div style={{
                flex: 1,
                marginLeft: 'var(--sidebar-width)',
                transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column'
            }} className="main-content-wrapper">
                <Topbar />

                <main style={{
                    marginTop: 'var(--topbar-height)',
                    padding: '40px',
                    flex: 1,
                    overflowY: 'auto'
                }}>
                    {children}
                </main>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .sidebar.collapsed + .main-content-wrapper {
          margin-left: var(--sidebar-collapsed) !important;
        }
      `}} />
        </div>
    );
};

export default Layout;

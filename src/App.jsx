import React, { useState } from 'react';
import Layout from './components/Layout';
import Catalog from './pages/Catalog';
import About from './pages/About';

function App() {
  const [activePage, setActivePage] = useState('catalog');

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {activePage === 'catalog' && <Catalog />}
      {activePage === 'about' && <About />}
    </Layout>
  );
}

export default App;

import React, { useState } from 'react';
import Layout from './components/Layout';
import Catalog from './pages/Catalog';
import About from './pages/About';

function App() {
  const [activePage, setActivePage] = useState('catalog');
  const [language, setLanguage] = useState('en'); // en, pt, fi

  return (
    <Layout
      activePage={activePage}
      setActivePage={setActivePage}
      language={language}
      setLanguage={setLanguage}
    >
      {activePage === 'catalog' && <Catalog language={language} />}
      {activePage === 'about' && <About />}
    </Layout>
  );
}

export default App;

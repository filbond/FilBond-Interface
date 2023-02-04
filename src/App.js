import { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { appController } from './libs/appController';
import { locale } from './libs/locale';
import { BrowserBonds } from './views/BrowserBonds';
import { BondDetails } from "./views/BondDetails";
import { TitleBar } from './views/TitleBar';
import { Investments } from './views/Investments';

function App() {
  const [initiated, setInitiated] = useState(false);
  const [data, setData] = useState(null);

  const init = async () => {
    const dataBundle = await appController.init();
    setData(dataBundle.data);

    setInitiated(await locale.init());
  };

  useEffect(() => {
    init();
  }, []);

  return initiated && <div className="App">
    <div className='appContainer'>
      <TitleBar />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BrowserBonds data={data} />} />
          <Route path="/bond/:title" element={<BondDetails allData={data} />} />
          <Route path="/investments" element={<Investments allData={data} />} />
        </Routes>
      </BrowserRouter>
    </div>
  </div>;
}

export default App;

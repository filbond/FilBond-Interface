import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { appController } from './libs/appController';
import { locale } from './libs/locale';
import { NodeDetails } from "./views/NodeDetails";
import { TitleBar } from './views/TitleBar';
import { Nodes } from './views/Nodes';
import { Footer } from './views/Footer';
import Invest from './views/Invest';
import { Vote } from './views/Vote';
import { globalUtils } from './libs/globalUtils';
import { appConfig } from './configs/appConfig';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BigNumber from 'bignumber.js';

let updatingTimer = null;
let isFetching = false;

function App() {
  const t = locale.translate;
  const [initiated, setInitiated] = useState(false);
  const [data, setData] = useState(null);
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState(0);
  const [currencyBalance, setCurrencyBalance] = useState(globalUtils.constants.BIGNUMBER_ZERO);

  const turnTimerOff = () => {
    if (updatingTimer) {
      window.clearInterval(updatingTimer);
      updatingTimer = null;
    }
  };

  const updateData = async () => {
    if (!isFetching) {
      isFetching = true;

      const d = await appController.getData();
      d.updated = new Date().getTime();
      setData(d);
      setAccount(appController.account);
      setChainId(appController.chainId);

      const bal = await appController.getCurrencyBalance();
      setCurrencyBalance(new BigNumber(bal));

      isFetching = false;
    }
  };

  const turnTimerOn = useCallback(() => {
    updatingTimer = setInterval(async () => {
      await updateData();
    }, 15000);
  }, []);

  const updateWeb3 = useCallback(() => {
    turnTimerOff();
    turnTimerOn()
  }, [turnTimerOn]);

  const checkNetwork = useCallback(async networkSupported => {
    console.debug("checkNetwork()", networkSupported);

    if (networkSupported) {
      turnTimerOn();
      await updateData();
    } else {
      if (window.confirm(t("networkUnsupported"))) {
        await appController.switchNetwork(appConfig.defaultNetwork);
      }
    }
  }, [t, turnTimerOn]);

  const init = useCallback(async () => {
    turnTimerOff();

    setInitiated(await locale.init());

    let networkSupported = false;
    const autoConnectConfig = window.localStorage.getItem(globalUtils.constants.AUTOCONNECT);
    if (!autoConnectConfig || parseInt(autoConnectConfig) === 1) {
      networkSupported = await appController.init(updateWeb3);
    } else {
      networkSupported = await appController.init();
    }
    checkNetwork(networkSupported);
  }, [checkNetwork, updateWeb3]);

  useEffect(() => {
    init();
  }, [init]);

  const handleConnectWallet = async () => {
    // setAccount(appController.account);
    // setChainId(appController.chainId);

    const networkSupported = await appController.init(updateWeb3);
    checkNetwork(networkSupported);
  };

  return initiated && <div className="App">
    <div className='appContainer'>
      <TitleBar
        account={account}
        onConnect={handleConnectWallet} />

      <div className='viewContainer'>
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={<BrowserBonds data={data} />} /> */}
            <Route path="/" element={<Invest
              data={data}
              chainId={chainId}
              currencyBalance={currencyBalance}
              onChange={updateData} />} />

            <Route path="/nodes" element={<Nodes
              account={account}
              chainId={chainId}
              currencyBalance={currencyBalance}
              lendingPool={data?.lendingPool} />} />

            {/* <Route path="/bond/:title" element={<NodeDetails allData={data} />} /> */}
            <Route path="/node/:id" element={<NodeDetails
              allData={data}
              chainId={chainId}
              currencyBalance={currencyBalance}
              lendingPool={data?.lendingPool} />} />

            {/* <Route path="/investments" element={<Investments allData={data} />} /> */}
            <Route path="/vote" element={<Vote />} />
          </Routes>
        </BrowserRouter>
      </div>

      <Footer />
    </div>

    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={false}
      theme="light" />
  </div>;
}

export default App;

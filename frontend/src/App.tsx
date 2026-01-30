import { useEffect } from 'react';
import { appKit } from './lib/wallet';

export default function App() {
  useEffect(() => {
    appKit.open();
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h1>Stacks Tasks & Reputation</h1>
      <p>Wallet connected via Reown AppKit</p>

      <button onClick={() => appKit.open()}>
        Connect Wallet
      </button>
    </div>
  );
}

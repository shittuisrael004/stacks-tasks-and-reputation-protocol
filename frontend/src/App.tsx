import { AppConfig, UserSession } from '@stacks/connect';
import { showConnect } from '@stacks/connect';
import { appConfig } from './lib/stacks';

const userSession = new UserSession({
  appConfig: new AppConfig(['store_write', 'publish_data']),
});

export default function App() {
  const connectWallet = () => {
    showConnect({
      userSession,
      appDetails: appConfig,
      onFinish: () => {
        window.location.reload();
      },
    });
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Tasks & Reputation Protocol</h1>

      {!userSession.isUserSignedIn() ? (
        <button onClick={connectWallet}>
          Connect Stacks Wallet
        </button>
      ) : (
        <p>✅ Wallet connected</p>
      )}
    </div>
  );
}

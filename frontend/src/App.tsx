import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export default function App() {
  const connectWallet = () => {
    showConnect({
      userSession,
      appDetails: {
        name: 'Stacks Tasks & Reputation',
        icon: window.location.origin + '/logo.png',
      },
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

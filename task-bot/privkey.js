// privkey.js
// Run with: node privkey.js

import { generateWallet } from '@stacks/wallet-sdk';
import { getAddressFromPrivateKey, TransactionVersion } from '@stacks/transactions';

async function deriveStacksPrivateKeyAndAddress(mnemonic) {
  if (typeof mnemonic !== 'string' || !mnemonic.trim()) {
    throw new Error('Mnemonic is required');
  }

  const words = mnemonic.trim().split(/\s+/);
  if (words.length !== 12 && words.length !== 24) {
    throw new Error(`Expected 12 or 24 words, got ${words.length}`);
  }

  const password = ''; // Empty for derivation only

  try {
    const wallet = await generateWallet({
      secretKey: mnemonic,
      password,
    });

    const account = wallet.accounts[0];

    console.log('\n=== Stacks Account Details (from wallet-sdk) ===');
    console.log('Private Key (hex):', account.stxPrivateKey);

    // This might be undefined in some versions → fallback below
    console.log('STX Address (mainnet, from SDK):', account.address || 'undefined (using fallback)');

    // Reliable fallback: derive address directly from private key (mainnet)
    const mainnetAddress = getAddressFromPrivateKey(
      account.stxPrivateKey,
      TransactionVersion.Mainnet
    );

    console.log('STX Address (mainnet, reliable derivation):', mainnetAddress);

    console.log('\nWallet ID / Seed Hash (for reference):', wallet.walletId);
    console.log('=============================\n');

    return {
      privateKey: account.stxPrivateKey,
      address: mainnetAddress
    };
  } catch (err) {
    console.error('Failed to derive:', err.message);
    if (err.message.includes('invalid mnemonic') || err.message.includes('checksum')) {
      console.error('→ Invalid or mistyped mnemonic. Double-check words/order.');
    }
    throw err;
  }
}

// ────────────────────────────────────────────────
//          PASTE YOUR REAL 12-WORD PHRASE HERE
// ────────────────────────────────────────────────
const mnemonic = 'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12';

// ────────────────────────────────────────────────

deriveStacksPrivateKeyAndAddress(mnemonic)
  .then(result => {
    console.log('Success! Use this:');
    console.log('Private Key:', result.privateKey);
    console.log('Mainnet Address:', result.address);
    console.log('Done.');
  })
  .catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
  });
import dotenv from 'dotenv';
dotenv.config();

import txPkg from '@stacks/transactions';
import netPkg from '@stacks/network';
import { randomInt } from 'crypto';

/* -------------------------------------------------------------------------- */
/*                     COMMONJS → ESM SAFE IMPORTS                             */
/* -------------------------------------------------------------------------- */

const {
  makeContractCall,
  broadcastTransaction,
  callReadOnlyFunction,
  cvToValue,
  uintCV,
  trueCV,
  standardPrincipalCV,
  stringAsciiCV,
  getAddressFromPrivateKey,
  TransactionVersion,
} = txPkg;

const { StacksMainnet } = netPkg;

/* -------------------------------------------------------------------------- */
/*                                   CONFIG                                   */
/* -------------------------------------------------------------------------- */

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const CONTRACT_NAME = process.env.CONTRACT_NAME;

if (!PRIVATE_KEY || !CONTRACT_ADDRESS || !CONTRACT_NAME) {
  throw new Error('❌ Missing env vars. Check your .env file.');
}

const network = new StacksMainnet({
  url: 'https://api.mainnet.hiro.so',
});

const WALLET_ADDRESS = getAddressFromPrivateKey(
  PRIVATE_KEY,
  TransactionVersion.Mainnet
);

console.log('👛 Bot wallet address:', WALLET_ADDRESS);

/* -------------------------------------------------------------------------- */
/*                              NONCE MANAGEMENT                               */
/* -------------------------------------------------------------------------- */

let CURRENT_NONCE = null;

async function fetchNonce() {
  const res = await fetch(
    `https://api.mainnet.hiro.so/v2/accounts/${WALLET_ADDRESS}?proof=0`
  );
  const data = await res.json();
  return Number(data.nonce);
}

/* -------------------------------------------------------------------------- */
/*                           READ-ONLY HELPERS                                 */
/* -------------------------------------------------------------------------- */

async function getNextTaskId() {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'get-next-task-id',
    functionArgs: [],
    senderAddress: WALLET_ADDRESS,
    network,
  });

  const value = cvToValue(result);
  console.log('🧠 Next task-id from contract:', value);
  return Number(value);
}

/* -------------------------------------------------------------------------- */
/*                           TX CONFIRMATION                                   */
/* -------------------------------------------------------------------------- */

async function waitForConfirmation(txid) {
  console.log(`⏳ Waiting for confirmation: ${txid}`);

  while (true) {
    const res = await fetch(
      `https://api.mainnet.hiro.so/extended/v1/tx/${txid}`
    );
    const data = await res.json();

    if (data.tx_status === 'success') {
      console.log(`✅ Confirmed: ${txid}`);
      return;
    }

    if (data.tx_status === 'abort_by_response') {
      throw new Error('Transaction aborted');
    }

    await new Promise((r) => setTimeout(r, 10_000));
  }
}

/* -------------------------------------------------------------------------- */
/*                           CONTRACT CALL HELPER                              */
/* -------------------------------------------------------------------------- */

async function callContract(functionName, functionArgs = []) {
  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName,
    functionArgs,
    senderKey: PRIVATE_KEY,
    network,

    nonce: CURRENT_NONCE,
    fee: 1000n,
    postConditionMode: 1,
  };

  const tx = await makeContractCall(txOptions);
  const result = await broadcastTransaction(tx, network);

  if (result.error) {
    console.error(`❌ ${functionName} failed:`, result.reason || result.error);
    throw new Error(result.reason || result.error);
  }

  console.log(`📦 ${functionName} → txid: ${result.txid}`);

  CURRENT_NONCE++;
  return result;
}

/* -------------------------------------------------------------------------- */
/*                             BOT ACTIONS                                    */
/* -------------------------------------------------------------------------- */

async function register() {
  console.log('👤 Registering user (if needed)...');
  try {
    const res = await callContract('register');
    await waitForConfirmation(res.txid);
  } catch {
    console.log('ℹ️ Already registered, continuing...');
  }
}

async function createTask(bounty) {
  console.log(`📝 Creating task | bounty: ${bounty}`);
  return callContract('create-task', [uintCV(bounty)]);
}

async function assignTask(taskId) {
  console.log(`👷 Assigning task ${taskId}`);
  return callContract('assign-task', [
    uintCV(taskId),
    standardPrincipalCV(WALLET_ADDRESS),
  ]);
}

async function submitTask(taskId) {
  console.log(`📤 Submitting task ${taskId}`);
  return callContract('submit-task', [
    uintCV(taskId),
    stringAsciiCV('Done'),
  ]);
}

async function reviewTask(taskId) {
  console.log(`✅ Approving task ${taskId}`);
  return callContract('review-task', [
    uintCV(taskId),
    trueCV(),
  ]);
}

/* -------------------------------------------------------------------------- */
/*                                 MAIN LOOP                                  */
/* -------------------------------------------------------------------------- */

async function botLoop() {
  CURRENT_NONCE = await fetchNonce();
  console.log('🔢 Starting nonce:', CURRENT_NONCE);

  await register();

  let taskId = await getNextTaskId();

  while (true) {
    try {
      const bounty = randomInt(1_000, 100_000); // micro-STX

      await createTask(bounty);
      await new Promise((r) => setTimeout(r, 1500));

      await assignTask(taskId);
      await new Promise((r) => setTimeout(r, 1500));

      await submitTask(taskId);
      await new Promise((r) => setTimeout(r, 1500));

      await reviewTask(taskId);

      console.log(`🎉 Task ${taskId} completed\n`);
      taskId++;

      await new Promise((r) => setTimeout(r, 10_000));
    } catch (err) {
      console.error('🔥 Bot stopped due to error:\n', err.message);
      process.exit(1);
    }
  }
}

botLoop();

import { StacksMainnet } from '@stacks/network';

export const network = new StacksMainnet();

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
export const CONTRACT_NAME = import.meta.env.VITE_CONTRACT_NAME;

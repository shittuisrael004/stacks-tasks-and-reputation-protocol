import { createAppKit } from '@reown/appkit';
import { stacksAdapter } from '@reown/appkit-adapter-stacks';
import { network } from './stacks';

export const appKit = createAppKit({
  adapters: [
    stacksAdapter({
      network,
      appDetails: {
        name: 'Tasks & Reputation Protocol',
        icon: 'https://placehold.co/96x96',
      },
    }),
  ],
});

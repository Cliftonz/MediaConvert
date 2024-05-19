import { Novu } from '@novu/node';

import { env } from '~/env';

const globalForNovu = global as unknown as {
  novu: Novu | undefined;
};

export const novu = globalForNovu.novu || createClient();

function createClient() {
  return new Novu(env.NOVU_API_SECRET);
}

if (process.env.NODE_ENV !== 'production') {
  globalForNovu.novu = novu;
}

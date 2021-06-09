import Web3Modal, { IProviderOptions } from 'web3modal';
import { PALETTE } from '../../themes/mainTheme';
import { fade, lighten } from '@material-ui/core';
import WalletConnectProvider from '@walletconnect/web3-provider';
import binanceWalletLogo from '../assets/binanceWallet.svg';
import { BscConnector } from '@binance-chain/bsc-connector';
import Web3 from 'web3';
import { t } from '../../i18n/utils/intl';
import { RPC } from 'constants/index';

export async function connectWallet() {
  const providerOptions: IProviderOptions = {
    ...(window.BinanceChain
      ? {
          'custom-binancewallet': {
            display: {
              logo: binanceWalletLogo,
              name: t('connect-wallet.custom-binancewallet.name'),
              description: t('connect-wallet.custom-binancewallet.description'),
            },
            package: null,
            options: {},
            connector: async () => {
              const connector = new BscConnector({
                // 56 - mainnet
                // 97 - testnet
                supportedChainIds: [56, 97],
              });
              await connector.activate();
              return await connector.getProvider();
            },
          },
        }
      : {}),
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: RPC,
      },
    },
  };

  const modal = new Web3Modal({
    cacheProvider: false,
    providerOptions,
    theme: {
      background: PALETTE.background.paper,
      main: PALETTE.text.primary,
      secondary: fade(PALETTE.text.primary, 0.5),
      border: PALETTE.background.default,
      hover: lighten(PALETTE.background.paper, 0.03),
    },
  });

  const provider = await modal.connect();
  const web3 = new Web3(provider);
  return [web3, provider] as [Web3, any];
}

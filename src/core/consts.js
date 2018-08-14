export const GAS_PRICE = '500'
export const GAS_LIMIT = '20000'

export const ONT_CONTRACT = '0000000000000000000000000000000000000001'
export const TEST_NET = 'http://polaris1.ont.io'
export const MAIN_NET = 'http://dappnode1.ont.io'

// test environment
export const ONT_PASS_NODE = 'https://app.ont.io/S1/api/v1/ontpass'
// prod
export const ONT_PASS_NODE_PRD = 'https://service.onto.app/S1/api/v1/ontpass'

export const ONT_PASS_URL = {
  CreateSharedWallet: '/SharedWallet/create',
  QuerySharedWallet: '/SharedWallet/getBySharedWalletAddress', // get
  CreateSharedTransfer: '/SharedTransfer/create',
  SignSharedTransfer: '/SharedTransfer/sign',
  SendSharedTransfer: '/SharedTransfer/isSendToChain', // get
  QueryPendingTransfer: '/SharedTransfer/listSigningBeforeTime',
  // sharedAddress={sharedAddress}&assetName={assetName}&beforeTimeStamp={beforeTimeStamp},
  ExchangeCurrency: '/api/v1/onto/exchangerate/reckon/'
  /// api/v1/onto/exchangerate/reckon/{currency}/{goaltype}/{amount}
}

export const WALLET_TYPE = {
  CommonWallet: 'CommonWallet',
  SharedWallet: 'SharedWallet',
  HardwareWallet: 'HardwareWallet'
}

export const DEFAULT_SCRYPT = {
  cost: 16384, // 除以2时间减半
  blockSize: 8,
  parallel: 8,
  size: 64
}

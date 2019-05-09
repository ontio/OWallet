// export const GAS_PRICE = '0';for test
export const GAS_PRICE = '500';
export const GAS_LIMIT = '20000';

export const ONT_CONTRACT = '0000000000000000000000000000000000000001';
export const TEST_NET = 'http://polaris1.ont.io';
export const MAIN_NET = 'http://dappnode1.ont.io';

//test environment
export const ONT_PASS_NODE = 'https://app.ont.io'
//prod 
export const ONT_PASS_NODE_PRD = 'https://service.onto.app'

export const ONT_PASS_URL = {
  CreateSharedWallet: '/S1/api/v1/ontpass/SharedWallet/create',
  QuerySharedWallet: '/S1/api/v1/ontpass/SharedWallet/getBySharedWalletAddress', //get
  CreateSharedTransfer: '/S1/api/v1/ontpass/SharedTransfer/create',
  SignSharedTransfer: '/S1/api/v1/ontpass/SharedTransfer/sign',
  SendSharedTransfer: '/S1/api/v1/ontpass/SharedTransfer/isSendToChain', //get
  QueryPendingTransfer: '/S1/api/v1/ontpass/SharedTransfer/listSigningBeforeTime',
  // sharedAddress={sharedAddress}&assetName={assetName}&beforeTimeStamp={beforeTimeStamp},
  ExchangeCurrency: '/S1/api/v1/ontpass/api/v1/onto/exchangerate/reckon/'
    ///api/v1/onto/exchangerate/reckon/{currency}/{goaltype}/{amount}

    //for node stake
    ,
  GetQualifiedState: '/S4/NodePledgeApi/v1/Nodepledge/getQuailifiedState',
  // /NodePledgeApi/v1/Nodepledge/getQuailifiedState?ontid={ontid}&address={address}'
    DelegateSendTx: '/S4/NodePledgeApi/v1/Nodepledge/delegateSendTransaction',
    SetStakeInfo: '/S4/NodePledgeApi/v1/Nodepledge/setInfo',
    GetStakeInfo: '/S4/NodePledgeApi/v1/Nodepledge/info'
    // /NodePledgeApi/v1/Nodepledge/info?ontid={ontid}

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
};

export const SWAP_ADDRESS = 'AFmseVrdL9f9oyCzZefL9tG6UbvhPbdYzM'

export const CON_NODE = [
  {
    "name": "Dubhe",
    "pk": "02bcdd278a27e4969d48de95d6b7b086b65b8d1d4ff6509e7a9eab364a76115af7"
  },
  {
    "name": "Merak",
    "pk": "0251f06bc247b1da94ec7d9fe25f5f913cedaecba8524140353b826cf9b1cbd9f4"
  },
  {
    "name": "Phecda",
    "pk": "022e911fb5a20b4b2e4f917f10eb92f27d17cad16b916bce8fd2dd8c11ac2878c0"
  },
  {
    "name": "Megrez",
    "pk": "0253719ac66d7cafa1fe49a64f73bd864a346da92d908c19577a003a8a4160b7fa"
  },
  {
    "name": "Alioth",
    "pk": "022bf80145bd448d993abffa237f4cd06d9df13eaad37afce5cb71d80c47b03feb"
  },
  {
    "name": "Mixar",
    "pk": "02765d98bb092962734e365bd436bdc80c5b5991dcf22b28dbb02d3b3cf74d6444"
  },
  {
    "name": "Alkaid",
    "pk": "03c8f63775536eb420c96228cdccc9de7d80e87f1b562a6eb93c0838064350aa53"
  }
]

export const NODE_DETAIL = 'https://explorer.ont.io/nodes/detail/'
export const NODE_NAME_LIST = 'https://ont.io/api/v1/candidate/info/All'

export const PAX_API = {
  Host: '',
  TestHost: 'http://172.168.3.61:20800',
  fetchApprovalList: '/api/v1/approvals',
  updateApprovals: '/api/v1/processapplist',
  EthScanTest: 'https://ropsten.etherscan.io/address/0x60275d9b241e5eb3b9acbf5a15107d1242528ee6#tokentxns',
  EthScanMain: ''
}
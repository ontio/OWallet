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
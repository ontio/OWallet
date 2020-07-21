// export const GAS_PRICE = '0';for test
export const GAS_PRICE = '2500';
export const GAS_LIMIT = '20000';

export const ONT_CONTRACT = '0000000000000000000000000000000000000001';
export const TEST_NET = 'http://polaris1.ont.io';
export const MAIN_NET = 'http://dappnode1.ont.io';

export const TEST_NET_LIST = [
    'http://polaris1.ont.io',
    'http://polaris2.ont.io',
    'http://polaris3.ont.io',
    'http://polaris4.ont.io',
    'http://polaris5.ont.io'
]

export const MAIN_NET_LIST = [
    'http://dappnode1.ont.io',
    'http://dappnode2.ont.io',
    'http://dappnode3.ont.io',
    'http://dappnode4.ont.io',
]
//test environment
export const ONT_PASS_NODE = 'https://service-test.onto.app'
//prod 
export const ONT_PASS_NODE_PRD = 'https://service.onto.app'

export const ONT_PASS_URL = {
    CreateSharedWallet: '/S5/api/v1/ontpass/SharedWallet/create',
    QuerySharedWallet: '/S5/api/v1/ontpass/SharedWallet/getBySharedWalletAddress', //get
    CreateSharedTransfer: '/S5/api/v1/ontpass/SharedTransfer/create',
    SignSharedTransfer: '/S5/api/v1/ontpass/SharedTransfer/sign',
    SendSharedTransfer: '/S5/api/v1/ontpass/SharedTransfer/isSendToChain', //get
    QueryPendingTransfer: '/S5/api/v1/ontpass/SharedTransfer/listSigningBeforeTime',
    // sharedAddress={sharedAddress}&assetName={assetName}&beforeTimeStamp={beforeTimeStamp},
    ExchangeCurrency: '/S5/api/v1/ontpass/api/v1/onto/exchangerate/reckon/'
    ///api/v1/onto/exchangerate/reckon/{currency}/{goaltype}/{amount}

    //for node stake
    ,
    GetQualifiedState: '/S4/NodePledgeApi/v1/Nodepledge/getQuailifiedState',
    // /NodePledgeApi/v1/Nodepledge/getQuailifiedState?ontid={ontid}&address={address}'
    DelegateSendTx: '/S4/NodePledgeApi/v1/Nodepledge/delegateSendTransaction',
    SetStakeInfo: '/S4/NodePledgeApi/v1/Nodepledge/setInfo',
    GetStakeInfo: '/S4/NodePledgeApi/v1/Nodepledge/info',
    // /NodePledgeApi/v1/Nodepledge/info?ontid={ontid}
    GetVoteContract: '/S4/NodePledgeApi/v1/Nodepledge/vote-contract-address' // /{net_type}
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

export const NODE_DETAIL = 'https://explorer.ont.io/nodes/detail/'
export const NODE_NAME_LIST = 'https://ont.io/api/v1/candidate/info/All'
export const OFF_CHAIN_NODES = {
    TEST_NET: 'https://polarisexplorer.ont.io/v2/nodes/off-chain-infos',
    MAIN_NET: 'https://explorer.ont.io/v2/nodes/off-chain-infos'
}

export const QUERY_NODE_INFO_API = {
    TEST_NET: 'https://polarisexplorer.ont.io/v2/nodes/off-chain-info/public',
    // TEST_NET: 'http://18.136.65.213:8585/v2/nodes/off-chain-info',
    MAIN_NET: 'https://explorer.ont.io/v2/nodes/off-chain-info/public'
}

export const UPDATE_NODE_INFO_API = {
    TEST_NET: 'https://polarisexplorer.ont.io/v2/offchain/off-chain-info',
    // TEST_NET: 'http://18.136.65.213:8585/v2/nodes/off-chain-info',
    MAIN_NET: 'https://explorer.ont.io/v2/offchain/off-chain-info'
}

export const UPDATE_LEDGER_NODE_INFO_API = {
    TEST_NET: 'https://polarisexplorer.ont.io/v2/offchain/off-chain-info/ledger',
    // TEST_NET: 'http://18.136.65.213:8585/v2/nodes/off-chain-info',
    MAIN_NET: 'https://explorer.ont.io/v2/offchain/off-chain-info/ledger'
}

export const NODE_CURRENT_STAKES = {
    TEST_NET: 'https://polarisexplorer.ont.io/v2/nodes/current-stakes',
    MAIN_NET: 'https://explorer.ont.io/v2/nodes/current-stakes'
}

export const PAX_API = {
    Host: 'http://18.138.83.180:20800',
    // TestHost: 'http://172.168.3.61:20800',
    TestHost: 'http://18.139.19.52:20800',
    fetchApprovalList: '/api/v1/approvals',
    updateApprovals: '/api/v1/processapplist',
    validateTx: '/api/v1/validatetx',
    EthScanTest: 'https://ropsten.etherscan.io/tx/',
    EthScanMain: 'https://etherscan.io/tx/'
}

export const PAX_SC_HASH = {
    MAIN: '6bbc07bae862db0d7867e4e5b1a13c663e2b4bc8',
    TEST: 'b06f8eaf757030c7a944ce2a072017bde1e72308'
}

export const VOTE_ROLE = {
    ADMIN: 'ADMIN',
    VOTER: 'VOTER',
    VISITOR: 'VISITOR'
}

export const VALIDATE_DICTIONARY = {
    zh: {
        messages: {
            required: (field, val) => `字段 ${field} 是必填项`,
            min: (field, val) => `字段 ${field} 的长度不能少于${val[0]}`,
            length: (field, val) => `字段 ${field} 的长度必须是${val[0]}`,
            confirmed: (field, val) => `${field}的输入匹配错误`
        },
        attributes: {
            password: '密码',
            name: '名称',
            label: '名称',
            rePassword: '确认密码',
            keystore: 'keystore',
            keystorePassword: ''
        }
    },
    en: {
        messages: {
            required: (field, val) => `${field} is required`,
            min: (field, val) => `The length of ${field} must be larger than ${val[0]}`,
            length: (field, val) => `The length of ${field} must be ${val[0]}`,
            confirmed: (field, val) => `Those two inputs didn't match.`
        },
        attributes: {
            password: 'Password',
            name: 'Name',
            label: 'Label',
            rePassword: 'Confirm password',
            keystore: 'keystore',
            keystorePassword: ''
        }
    }
}
//申请注册 候选 共识 共识退出 候选退出 拉黑 已退出
export const GovernanceStatus = {
    REGISTER: 0,
    CANDIDATE: 1,
    CONSENSUS: 2,
    QUIT_CANDIDATE: 3,
    QUIT_CONSENSUS: 4,
    BLACKLIST: 5,
    EXIXTED: 6
}
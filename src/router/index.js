import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/Dashboard',
        name: 'Dashboard',
        component: require('@/components/Dashboard').default
    },
    {
        path: '/identitys',
        name: 'Identitys',
        component: require('@/components/Identitys').default
    },
    {
        path: '/Wallets',
        name: 'Wallets',
        component: require('@/components/Wallets').default
    },
    {
        path: '/loginLedger',
        name: 'LoginLedger',
        component: require('@/components/LedgerWallet/LoginLedger').default
    },
    {
        path: '/setting',
        name: 'Setting',
        component: require('@/components/Setting').default
    },
    {
        path: '/dapps',
        name: 'Dapps',
        component: require('@/components/Dapps').default
    },
    {
        path: '/identitys/createIdentity',
        name: 'CreateIdentity',
        component: require('@/components/Identitys/CreateIdentity').default
    },
    {
        path: '/identitys/importIdentity',
        name: 'ImportIdentity',
        component: require('@/components/Identitys/ImportIdentity').default
    },
    {
        path: '/Wallets/createJsonWallet',
        name: 'CreateJsonWallet',
        component: require('@/components/JsonWallet/CreateJsonWallet').default
    },
    {
        path: '/Wallets/importJsonWallet',
        name: 'ImportJsonWallet',
        component: require('@/components/JsonWallet/ImportJsonWallet').default
    },
    {
        path: '/Wallets/importLedgerWallet',
        name: 'ImportLedgerWallet',
        component: require('@/components/LedgerWallet/ImportLedgerWallet').default
    },
    {
        path: '/Wallets/createSharedWallet',
        name: 'CreateSharedWallet',
        component: require('@/components/SharedWallet/CreateSharedWallet').default
    },
    {
        path: '/Wallets/importSharedWallet',
        name: 'ImportSharedWallet',
        component: require('@/components/SharedWallet/ImportSharedWallet').default
    },
    {
        path: '/sharedWallet',
        name: 'SharedWalletDetail',
        component: require('@/components/SharedWallet/SharedWalletDetail').default,
        children: [{
            path: 'home',
            name: 'SHaredWalletHome',
            component: require('@/components/SharedWallet/SharedWalletHome').default,
        },
        {
            path: '/sharedWallet/sendTransfer',
            component: require('@/components/SharedWallet/SharedWalletSend').default
        },
        {
            path: '/sharedWallet/pendingTxHome',
            component: require('@/components/SharedWallet/PendingTxHome').default
        },
        {
            path: '/sharedWallet/copayers',
            name: 'SharedWalletCopayer',
            component: require('@/components/SharedWallet/View/SharedWalletCopayer').default,
        },
        {
            path: '/sharedWallet/paxMgmt',
            name: 'PaxMgmt',
            component: require('@/components/SharedWallet/PAX/PaxMgmt').default,
        },
        {
            path: '/sharedWallet/startProcess',
            name: 'StartProcess',
            component: require('@/components/SharedWallet/PAX/StartProcess').default,
        },
        {
            path: '/sharedWallet/signProcess',
            name: 'SignProcess',
            component: require('@/components/SharedWallet/PAX/SignProcess').default,
        },
        {
            path: '/sharedWallet/txMgmt',
            name: 'SharedTxMgmt',
            component: require('@/components/SharedWallet/Tx/SharedTxMgmt').default
        }

        ]
    },
    {
        path: '/vote',
        name: 'NodeVote',
        component: require('@/components/Node/Vote/index').default,
        children: [
            {
                path: 'login',
                name: 'VoteLogin',
                component: require('@/components/Node/Vote/Login').default
            },
            {
                path: 'votes',
                name: 'VoteList',
                component: require('@/components/Node/Vote/List').default
            },
            {
                path: 'create',
                name: 'VoteCreate',
                component: require('@/components/Node/Vote/Create').default
            },
            {
                path: 'detail',
                name: 'VoteDetail',
                component: require('@/components/Node/Vote/Detail').default
            },
        ]
        },
        {
            path: '/node/apply',
            name: 'NodeApply',
            component: require('@/components/Node/NodeApply/Register').default
        },
        {
            path: '/node/applysuccess',
            name: 'NodeApplySuccess',
            component: require('@/components/Node/NodeApply/RegisterSuccess').default
        },
        {
            path: '/node/mynode',
            name: 'MyNode',
            component: require('@/components/Node/NodeManagement/MyNode').default
        },
    {
        path: '/commonWalletSend',
        name: 'CommonSendHome',
        component: require('@/components/CommonWallet/SendHome').default
    },
    {
        path: '/commonWalletReceive/:walletType',
        name: 'CommonReceive',
        component: require('@/components/CommonWallet/CommonReceive').default
    },
    {
        path: '/commonWalletRedeem/:walletType',
        name: 'CommonRedeem',
        component: require('@/components/CommonWallet/CommonRedeem').default
    },
    {
        path: '/commonTokenSwap',
        name: 'CommonTokenSwap',
        component: require('@/components/CommonWallet/CommonTokenSwap').default
    },
    {
        path: '/node/nodeStakeIntro',
        name: 'NodeStakeIntro',
        component: require('@/components/Node/NodeStake/NodeStakeIntro').default
    },
    {
        path: '/node/nodeStakeRegister',
        name: 'NodeStakeRegister',
        component: require('@/components/Node/NodeStake/NodeStakeRegister').default
    },
    {
        path: '/node/nodeStakeInfo',
        name: 'NodeStakeInfo',
        component: require('@/components/Node/NodeStake/NodeStakeInfo').default
    },
    {
        path: '/node',
        name: 'NodeManagement',
        component: require('@/components/Node/Node').default
    },
    // {
    //   path: '/node/nodeLogin',
    //   name: 'NodeLogin',
    //   component: require('@/components/Node/NodeManagement/NodeLogin').default
    // },
    {
        path: '/node/nodeStakeMgmt',
        name: 'NodeStakeManagement',
        component: require('@/components/Node/NodeManagement/NodeStakeManagement').default
    },
    {
        path: '/node/nodeList',
        name: 'NodeList',
        component: require('@/components/Node/NodeAuthorize/NodeList').default
    },
    {
        path: '/node/stakeHistory',
        name: 'StakeHistory',
        component: require('@/components/Node/NodeAuthorize/StakeHistory').default
    },
    {
        path: '/node/authorizeLogin',
        name: 'AuthorizeLogin',
        component: require('@/components/Node/NodeAuthorize/AuthorizeLogin').default
    },
    {
        path: '/dapps/authorizeLoginSesameseed',
        name: 'AuthorizeLoginSesameseed',
        component: require('@/components/Node/NodeAuthorize/Sesameseed/AuthorizeLoginSesameseed').default
    },
    {
        path: '/node/authorizationMgmt',
        name: 'AuthorizationMgmt',
        component: require('@/components/Node/NodeAuthorize/AuthorizationMgmt').default
    },
    {
        path: '/dapps/authorizationMgmtSesameseed',
        name: 'AuthorizationMgmtSesameseed',
        component: require('@/components/Node/NodeAuthorize/Sesameseed/AuthorizationMgmtSesameseed').default
    },
    {
        path: '/node/newAuthorization',
        name: 'NewAuthorization',
        component: require('@/components/Node/NodeAuthorize/NewAuthorization').default
    },
    {
        path: '/dapps/newAuthorizationSesameseed',
        name: 'NewAuthorizationSesameseed',
        component: require('@/components/Node/NodeAuthorize/Sesameseed/NewAuthorizationSesameseed').default
    },
    {
        path: '/oep4Home',
        name: 'Oep4Home',
        component: require('@/components/Common/Oep4Home').default
    },
    {
        path: '*',
        redirect: '/'
    },
    {
        path: '/',
        name: 'Home',
        component: require('@/components/Home').default
    },
    ]
})

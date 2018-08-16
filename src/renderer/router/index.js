import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
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
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      name: 'Home',
      component: require('@/components/Home').default
    },
    {
      path: '/createIdentity',
      name: 'CreateIdentity',
      component: require('@/components/Identitys/CreateIdentity').default
    },
    {
      path: '/importIdentity',
      name: 'ImportIdentity',
      component: require('@/components/Identitys/ImportIdentity').default
    },
    {
      path: '/createMultiSignAddr',
      name: 'CreateMultiSignAddr',
      component: require('@/components/CreateMultiSignAddr').default
    },
    {
      path: '/joinSharedWallet',
      name: 'JoinSharedWallet',
      component: require('@/components/JoinSharedWallet').default
    },
    {
      path: '/createMultiSignTx',
      name: 'CreateMultiSignTx',
      component: require('@/components/CreateMultiSignTx').default
    },
    {
      path: '/signMultiAddrTx',
      name: 'SignMultiAddrTx',
      component: require('@/components/SignMultiAddrTx').default
    },
    {
      path: '/sendTransaction',
      name: 'SendTransaction',
      component: require('@/components/SendTransaction').default
    },
    {
      path: '/createJsonWallet',
      name: 'CreateJsonWallet',
      component: require('@/components/JsonWallet/CreateJsonWallet').default
    },
    {
      path: '/importJsonWallet',
      name: 'ImportJsonWallet',
      component: require('@/components/JsonWallet/ImportJsonWallet').default
    },
    {
      path: '/importLedgerWallet',
      name: 'ImportLedgerWallet',
      component: require('@/components/LedgerWallet/ImportLedgerWallet').default
    },
    {
      path: '/createSharedWallet',
      name: 'CreateSharedWallet',
      component: require('@/components/SharedWallet/CreateSharedWallet').default
    },
    {
      path: '/importSharedWallet',
      name: 'ImportSharedWallet',
      component: require('@/components/SharedWallet/ImportSharedWallet').default
    },
    {
      path: '/sharedWallet',
      name: 'SharedWalletDetail',
      component: require('@/components/SharedWallet/SharedWalletDetail').default,
      children: [
        {
          path: '/sharedWallet/home',
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
        }
      ]
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
      path: '/nodeStakeIntro',
      name: 'NodeStakeIntro',
      component: require('@/components/NodeStake/NodeStakeIntro').default
    },
    {
      path: '/nodeStakeRegister',
      name: 'NodeStakeRegister',
      component: require('@/components/NodeStake/NodeStakeRegister').default
    },
    {
      path: '/nodeStakeInfo',
      name: 'NodeStakeInfo',
      component: require('@/components/NodeStake/NodeStakeInfo').default
    }
  ]
})

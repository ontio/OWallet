export default {
  common: {
    testNet: 'TestNet',
    mainNet: 'MainNet',
    copied: 'Copied!',
    confirmPwdTips: 'Please confirm and input the password your wallet.',
    confirmTips: 'Please confirm the transfer.',
    transSentSuccess: 'Transaction has been sent successfully!',
    pwdErr: 'Password error',
    ongNoEnough: 'No enough ong to pay for the transfer fee.',
    transferFailed: 'Transfer failed. ',
    networkErr: 'Network error!',
    normalWallet: 'Individual Wallet',
    sharedWallet: 'Shared Wallet',
    export: 'Export',
    ledgerNotOpen: 'Ledger not open',
    ledgerNotSupported: 'Ledger not supported',
    pluginDevice: 'Please plugin the device and login.',
    readyToSubmit: 'Ready to submit',
    waitForSign: 'Waiting for sign'
  },

  TopNav: {
    new: 'New',
    edit: 'Edit'
  },

  basicInfo: {
    InvalidMnemonic: 'Invalid mnemonic.',
    errWif: 'Please input the valid WIF.'
  },

  SetPaths: {
    name: 'Keystore File Path',
    tips: '*The keystore.db file stores your encrypted private keys.Please make sure your PC is safe and make a backup of your keystore.db file.',
    close: 'Close',
    enter: 'To Set'
  },

  wallets: {
    all: 'All Wallets',
    common: 'Individual Wallet',
    shared: 'Shared Wallet',
    temp: 'TEMP',
    createCommonWallet: 'Create Wallet',
    importCommonWallet: 'Import Wallet',
    createSharedWallet: 'Create Wallet',
    joinSharedWallet: 'Join Wallet',
    importLedgerWallet: 'Import Ledger',
    ledger: 'Ledger',
    comingSoon: 'Coming soon...'
  },

  dashboard: {
    getTransErr: 'Fetch transaction history failed. Network error.'
  },

  createJsonWallet: {
    create: 'Create Individual Wallet',
    basicInfo: 'Basic info',
    label: 'Name of Individual Wallet',
    password: 'Password',
    rePassword: 'Repeat password',
    next: 'Next',
    cancel: 'Cancel',
    back: 'Back',
    details: '',
    confirmInfo: 'Confirm info',
    labelN: 'Label',
    addressN: 'Address',
    pubKeyN: 'Public Key',
    signatureSchemeN: 'Signature Scheme',
    wif: 'WIF',
    mnemonic: 'Mnemonic',
    privateKey: 'Private Key'
  },

  importJsonWallet: {
    dat: '.dat File',
    datImportPassword: 'Open .dat file password',
    create: 'Import Individual Wallet',
    basicInfo: 'Basic info',
    label: 'Name of Individual Wallet',
    wif: 'WIF',
    datPassword: 'New Password',
    datRePassword: 'Repeat New password',
    password: 'Password',
    rePassword: 'Repeat password',
    next: 'Import',
    cancel: 'Cancel',
    back: 'Back',
    details: '',
    confirmInfo: 'Confirm info',
    mnemonic: 'Please use space to separate the mnemonic words.',
    privateKey: 'Private Key',
    createSuccess: 'Create Individual wallet successfully!'
  },

  createSharedWallet: {
    basicInfo: 'Basic info',
    copayers: 'Copayers',
    processing: 'Processing',
    label: 'Name of Shared Wallet',
    copayers2_12: 'Copayers(2-12)',
    address: 'Address',
    inputPks: 'Input 2 - 12 public keys\' info',
    name: 'Name',
    publicKey: 'Public Key',
    add: '+ Add',
    next: 'Next',
    cancel: 'Cancel',
    back: 'Back',
    importSharedWallet: 'Import Shared Wallet',
    requiredSigNum: 'Number of required signatures ',
    success: 'Success',
    duplicateCreate: 'The shared wallet is already existed.Please import it.',
    createFailed: 'Failed. Please try later.',
    createSuccess: 'Create shared wallet successfully.',
    create: 'Create Shared Wallet',
    walletNameErr: 'Wallet name can not be more than 12 chars'
  },

  importSharedWallet: {
    import: 'Join Shared Wallet',
    basicInfo: 'Basic info',
    inputPass: 'Input password',
    importSuccess: 'Success',
    inputAddress: 'Address of Shared Wallet',
    search: 'Search',
    name: 'Shared Wallet Name',
    totalCopayerNumber: 'Total number of copayers',
    requiredCopayerNumber: 'Required number of copayers',
    allCopayers: 'Address of all Copayers',
    noResult: 'No result',
    address: 'Address',
    chooseLocalWallet: 'Select local wallet to join',
    localWalletInfo: 'Local wallet detail',
    walletName: 'Wallet Name',
    pk: 'Public Key',
    next: 'Next',
    cancel: 'Cancel',
    back: 'Back',
    join: 'Join',
    inputPassword: 'Enter password to join',
    joinBefore: 'You have joined this wallet before.',
    success: 'Joind shared wallet succeefully!',
    passwordError: 'Password error.',
    sorry: 'Sorry!',
    notFound: 'The shared wallet you are looking for is not found.'
  },

  importLedgerWallet: {
    import: 'Import Ledger Wallet',
    label: 'Name of Individual Wallet'
  },

  sharedWalletHome: {
    send: 'Send',
    receive: 'Receive',
    claim: 'Claim',
    rule: 'Rule',
    copayers: 'Copayers',
    pendingTx: 'Pending Transactions',
    completedTx: 'Completed Transactions',
    owners: 'Owners',
    address: 'Address',
    amount: 'Amount',
    max: 'MAX',
    to: 'To',
    recipient: 'Recipient Address',
    cancel: 'Cancel',
    next: "Next",
    back: 'Back',
    submit: 'Submit',
    asset: 'Asset',
    sponsor: 'Sponsor',
    dragDecide: 'Drag to decide sign sequence',
    fee: 'Fee',
    inputPassword: 'Input Password',
    inputPassToTransfer: 'Input password to complete transfer',
    walletAddress: 'Wallet Address',
    createTime: 'Creation Time',
    balance: 'Balance',
    confirmation: 'Confirmation',
    agreeToSend: 'I agreed to send assets',
    signSequence: 'Sign sequence',
    sign: 'Sign',
    checkMore: 'Check More',
    publicKey: 'Public Key'
  },

  commonWalletHome: {
    claimableOng: 'Claimable ONG',
    unboundOng: 'Unbound ONG',
    redeem: 'Redeem',
    receive: 'Receive',
    walletQrCode: 'Wallet QR Code',
    walletAddress: 'Wallet Address',
    publicKey: 'Public Key',
    redeemCharge: 'Each redeem charges 0.01 ONG',
    inputPass: 'Please input your wallet password',
    emptyPass: 'Password can not be empty',
    cancel: 'Cancel',
    submit: 'Submit'
  },

  transfer: {
    inputValidAmount: 'Please input valid transfer amount.',
    inputValidAddress: 'Please input valid receiver address.'
  },

  setting: {
    name: 'Setting',
    net: 'Network',
    lang: 'Language',
    testNet: 'TestNet',
    mainNet: 'MainNet',
    en: 'English',
    zh: 'Chinese',
    pathTit: 'Path: ',
    path: 'Save keystore file path',
    change: 'Change',
    setNetworkSuccess: 'The network has been set to '
  },

  ledgerWallet: {
    nameOfLedgerWallet: 'Name of your ledger wallet',
    info: 'Ledger Info',
    connectApp: 'Please connect to your ledger device and open the ONT app on it.',
    status: 'Device Status',
    labelEmpty: 'Label can not be empty.',
    deviceError: 'Can not connect to device.Please try again.'
  }
}

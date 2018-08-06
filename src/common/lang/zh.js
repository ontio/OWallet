export default {
  common: {
    testNet: 'TestNet',
    mainNet: 'Main Net'
  },

  TopNav: {
    new: '新建',
    edit: '编辑'
  },

  SetPaths: {
    name: '钱包文件存储路径',
    tips: '* 钱包文件keystore.db保存着您的加密私钥，请确保您的PC安全和做好keystore.db文件的备份。',
    close: '关闭',
    enter: '去设置'
  },

  wallets: {
    all: '全部钱包',
    common: '普通钱包',
    shared: '共享钱包',
    temp: '之前的临时功能',
    createCommonWallet: '创建钱包',
    importCommonWallet: '导入钱包',
    createSharedWallet: '创建钱包',
    joinSharedWallet: '加入钱包',
    ledger: 'Ledger钱包',
    comingSoon: '敬请期待'
  },

  createJsonWallet: {
    create: '新建普通钱包',
    basicInfo: '基本信息',
    label: '钱包名称',
    password: '输入密码',
    rePassword: '重复密码',
    next: '继续',
    cancel: '取消',
    back: '返回',
    details: '详情',
    confirmInfo: '确认信息',
    labelN: '名称',
    addressN: '地址',
    pubKeyN: '公钥',
    signatureSchemeN: '签名算法',
    wif: 'WIF',
    mnemonic: '助记词',
    privateKey: '私钥'
  },

  importJsonWallet: {
    create: '导入普通钱包',
    basicInfo: '基本信息',
    label: '钱包名称',
    wif: 'WIF',
    password: '输入密码',
    rePassword: '重复密码',
    next: '继续',
    cancel: '取消',
    back: '返回',
    details: '详情',
    confirmInfo: '确认信息',
    mnemonic: '请用空格分隔助记词',
    privateKey: '私钥'
  },

  createSharedWallet: {
    basicInfo: '基本信息',
    copayers: '联合支付人',
    processing: '处理中',
    label: '共享钱包名称',
    copayers2_12: '联合支付人(2-12)',
    address: '地址',
    inputPks: '输入 2 - 12 公钥\' 信息',
    name: '名字',
    publicKey: '公钥',
    add: '+ 增加',
    next: '继续',
    cancel: '取消',
    back: '返回',
    importSharedWallet: '导入共享钱包',
    requiredSigNum: '签名顺序 ',
    success: '成功',
    duplicateCreate: '共享钱包已存在，请导入.',
    createFailed: '错误，请稍后重试。',
    createSuccess: '创建共享钱包成功',
    create: '创建共享钱包'
  },

  importSharedWallet: {
    import: '加入共享钱包',
    basicInfo: '基本信息',
    inputPass: '输入密码',
    importSuccess: '成功',
    inputAddress: '共享钱包地址',
    search: '查询',
    name: 'Shared Wallet 名字',
    totalCopayerNumber: '联合支付人数',
    requiredCopayerNumber: '最少签名数',
    allCopayers: '全部联合支付人地址',
    noResult: '没有结果',
    address: '地址',
    chooseLocalWallet: '选择本地钱包加入',
    localWalletInfo: '本地钱包详情',
    walletName: '钱包名字',
    pk: '公钥',
    next: '继续',
    cancel: '取消',
    back: '返回',
    join: '加入',
    inputPassword: '输入密码加入',
    joinBefore: '你已经加入过这个钱包。',
    success: '已经成功加入钱包！',
    passwordError: '密码错误。',
    sorry: '对不起！',
    notFound: '找不到该共享钱包。'
  },

  sharedWalletHome: {
    send: '发送',
    receive: '接收',
    claim: '认领',
    rule: '规则',
    copayers: '联合支付人',
    pendingTx: '待处理交易',
    completedTx: '已完成交易',
    owners: '所属人',
    address: '地址',
    amount: '数量',
    max: '最大',
    to: '接收',
    recipient: '接收方地址',
    cancel: '取消',
    next: '继续',
    back: '返回',
    submit: '提交',
    asset: '资产',
    sponsor: '发起人',
    dragDecide: '拖动序号决定顺序',
    fee: '费用',
    inputPassword: '输入密码',
    inputPassToTransfer: '输入密码完成转账',
    walletAddress: '钱包地址',
    createTime: '创建时间',
    balance: '余额',
    confirmation: '确认',
    agreeToSend: '我同意发送资产',
    signSequence: '选择签名人数',
    sign: '签名',
    checkMore: '查看更多',
    publicKey: '公钥'
  },

  commonWalletHome: {
    claimableOng: '可认领的ONG',
    unboundOng: '未绑定的ONG',
    redeem: '赎回',
    receive: '接收',
    walletQrCode: '钱包地址二维码',
    walletAddress: '钱包地址',
    publicKey :'公钥'
  },

  setting: {
    name: '设置',
    net: '网络',
    lang: '语言',
    testNet: 'ONT测试网络',
    mainNet: 'ONT主网',
    en: 'English',
    zh: 'Chinese',
    pathTit: '当前路径： ',
    path: '钱包保存路径',
    change: '修改'
  }
}

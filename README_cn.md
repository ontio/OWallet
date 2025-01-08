[English Version](./README.md)



<h1 align="center">OWallet - 本体综合性桌面版钱包 </h1>
<h4 align="center">Version 0.9.25</h4>

## 总体介绍

OWallet是本体综合性桌面版钱包，支持标准的钱包管理、基于多重签名技术的共享钱包管理，同时将连接Ledger、Trezor多种硬件钱包。未来，OWallet将持续集成更加丰富的应用功能，为开发者提供智能合约编译、运行等综合性服务。

支持Windows/MacOS/Linux,下载请到[这里](https://github.com/ontio/OWallet/releases)，也欢迎加入我们的[技术讨论社区](https://discord.gg/4TQujHj)!

OWallet核心功能如下:

* 创建钱包/导入钱包（支持使用Keystore，助记词，WIF私钥，明文私钥）
* 支持共享钱包（基于多重签名技术）
* 支持硬件钱包Ledger
* 查看余额和交易明细
* 发送ONG和ONT
* 提取ONG
* 节点质押和质押授权管理
* 支持ONT ID功能
* 集成changelly和cryptonex网关

![](images/OWallet.jpg)


## 如何开始

1. 克隆repo

```
git clone https://github.com/ontio/OWallet.git
```

2. 安装依赖
推荐使用**yarn**

```
yarn
```

3. 开发模式运行

```
yarn serve
```

4. 打包

```
yarn build
```

## 安装发布的客户端

请下载适合于您的操作系统的最新版本客户端。


## keystore.db文件的默认保存路径

在不同系统上指向如下位置：

* %APPDATA% on `Windows`

* $XDG_CONFIG_HOME or ~/.config on `Linux`

* ~/Library/Application Support on `macOS`

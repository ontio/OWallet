module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ['node-hid', 'usb', 'nedb'],
      builderOptions: {
        productName: process.env.VUE_APP_TITLE,
        appId: 'org.ont.wallet',
        win: {
          target: [
            'nsis'
          ],
          icon: 'src/assets/icons/icon.ico'
        },
        nsis: {
          oneClick: false,
          perMachine: true,
          allowToChangeInstallationDirectory: true
        },
        linux: {
          target: [
            'deb',
            'AppImage'
          ],
          icon: 'src/assets/icons'
        },
        mac: {
          icon: 'src/assets/icons/icon.icns'
        }
      },
    }
  }
}

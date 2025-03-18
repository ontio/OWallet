module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ['node-hid', 'usb', 'nedb'],
      builderOptions: {
        productName: process.env.VUE_APP_TITLE,
        appId: 'org.ont.wallet',
        nsis: {
          oneClick: false,
          perMachine: true,
          allowToChangeInstallationDirectory: true
        },
        win: {
          target: [
            {
              target: 'nsis',
              arch: ['x64']
            }
          ],
          icon: 'src/assets/icons/icon.ico',
          artifactName: '${productName}-${version}-${os}.${ext}'
        },
        linux: {
          target: [
            {
              target: 'deb',
              arch: ['x64']
            },
            {
              target: 'AppImage',
              arch: ['x64']
            }
          ],
          icon: 'src/assets/icons',
          artifactName: '${productName}-${version}-${os}.${ext}'
        },
        mac: {
          target: [{
            target: 'dmg',
            arch: ['x64', 'arm64'] 
          }],
          icon: 'src/assets/icons/icon.icns',
          artifactName: '${productName}-${version}-${os}-${arch}.${ext}'
        }
      },
    }
  },
  css: {
    loaderOptions: {
      sass: {}
    }
  }
}

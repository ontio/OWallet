// require('dotenv').config();
const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;  
  if (electronPlatformName !== 'darwin') {
    return;
  }
  console.log('notarizing...');
  const appName = context.packager.appInfo.productFilename;
  
  return await notarize({
    tool: 'notarytool',
    teamId: '29B4VVVVKM',
    appBundleId: 'com.ontio.owallet',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: '',
    appleIdPassword: '',
  });
};
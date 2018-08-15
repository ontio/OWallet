// import path, { resolve } from 'path'
import electron from 'electron'
const app = electron.remote.app;
const userData = app.getAppPath('userData')
if(!localStorage.getItem('savePath')) {
    localStorage.setItem('savePath', userData)
}
console.log('path' + userData)
//create db
var Datastore = require('nedb');

const savePath = localStorage.getItem('savePath')

const db = new Datastore({filename: savePath + '/keystore.db', autoload:true});
// db.sharedWallet = new Datastore(savePath + '/sharedWallet.db');
// db.hardwareWallet = new Datastore(savePath + '/userData/hardwareWallet.db');

//indexing
db.ensureIndex({fieldName: 'address', unique: true}, function(err) {
    console.log(err)
});
// db.sharedWallet.ensureIndex({fieldName: 'sharedWalletAddress', unique:true }, function(err){
//     console.log(err)
// })
// db.hardwareWallet.ensureIndex({ fieldName: 'address', unique: true }, function (err) {
//     console.log(err)
// });

db.loadDatabase();
// db.sharedWallet.loadDatabase();
// db.hardwareWallet.loadDatabase();

const findWallet = (db, opt) => {
    return new Promise((resolve, reject) => {
        db.find(opt, function(err, docs) {
            if (err) {
                reject(err)
            } else {
                resolve(docs)
            }
        })
    })
}

export default db;
export {findWallet};
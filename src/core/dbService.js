// import path, { resolve } from 'path'
import electron from 'electron'
const app = electron.remote.app;
const userData = app.getPath('userData')
console.log('appPath: ' + userData)
if(!localStorage.getItem('savePath')) {
    localStorage.setItem('savePath', userData)
}
//create db
var Datastore = require('nedb');

const savePath = localStorage.getItem('savePath')

const db = new Datastore({filename: savePath + '/keystore.db', autoload:true});

//indexing
db.ensureIndex({fieldName: 'address', unique: true}, function(err) {
    console.log(err)
    if (err && err.code === 'ENOENT') {
        localStorage.setItem('savePath', userData);
        alert('Cannot find the keystore.db file. Please set the keystore.db file path.');
    }
});


db.loadDatabase();

const dbFind = (db, opt) => {
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

const dbInsert = (db, doc) => {
    return new Promise((resolve, reject) => {
        db.insert(doc, function(err, newDoc) {
            if(err) {
                reject(err)
            } else {
                resolve(newDoc)
            }
        })
    })
}

const dbUpsert = (db, index ,doc) => {
    return new Promise((resolve, reject) => {
        db.update({[index] : doc.indexKey}, doc, {upsert: true}, function(err, numReplaced, upsert) {
            if(err) {
                reject(err)
            } else {
                resolve(upsert)
            }
        })
    })
}

export default db;
export {dbFind, dbUpsert};
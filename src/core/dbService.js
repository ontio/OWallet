// import path, { resolve } from 'path'
import electron from 'electron'
const app = electron.remote.app;
const userData = app.getAppPath('userData')
console.log('path' + userData)
if(!localStorage.getItem('savePath')) {
    localStorage.setItem('savePath', userData)
}
//create db
var Datastore = require('nedb');

const savePath = localStorage.getItem('savePath')

const db = new Datastore({filename: savePath + '/keystore.db', autoload:true});

const db2 = new Datastore({filename: savePath + '/stakeHistory.db', autoload:true, timestampData: true});

//indexing
db.ensureIndex({fieldName: 'address', unique: true}, function(err) {
    console.log(err)
});

// indexKey = stake wallet address + '-' + node's pk
db2.ensureIndex({fieldName: 'indexKey', unique: true}, function(err) {
    console.log(err)
})

db.loadDatabase();
db2.loadDatabase();

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
export {dbFind, dbUpsert, db2};
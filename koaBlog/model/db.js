var MongoDB = require('mongodb');
var MongoClient = MongoDB.MongoClient;
const ObjectID = MongoDB.ObjectID;

var Config = require( './config.js' );

class Db {

    static getInstance(){
        if(!Db.instance){
            Db.instance = new Db();
        }
        return Db.instance;
    }

    constructor(){
        this.dbClient = '';
        this.connect();     /*实例化的时候就连接数据库*/
    }

    connect() {
        let _that = this;
        return new Promise((resolve, reject)=>{
            if(!_that.dbClient){
                MongoClient.connect(Config.dbUrl, (err,client)=>{

                    if(err) {
                        reject(err);
                    } else {
                        _that.dbClient = client.db(Config.dbName);
                        resolve(_that.dbClient);
                    }
                })
            } else {
                resolve(_that.dbClient);
            }
        })
    }

    find( collectionName, json1, json2, json3 ) {
        if( arguments.length == 2 ) {
            var arrt = {};
            var slipNum = 0;
            var pageSize = 0;
        } else if( arguments.length == 3 ) {
            var attr = json2;
            var slipNum = 0;
            var pageSize = 0;
        } else if( arguments.length == 4 ) {
            var attr = json2;
            var page = json3.page ||1;
            var pageSize = json3.pageSize||20;
            var slipNum = (page-1)*pageSize;
            if( json3.sortJson ) {
                var sortJson = json3.sortJson;
            } else {
                var sortJson = {};
            }
        }


        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{

                var result = db.collection(collectionName).find(json1,{field:attr}).skip(slipNum).limit(pageSize).sort(sortJson);
                result.toArray((err,docs)=>{
                    if(err) {
                        reject(err);
                        return;
                    }
                    resolve(docs);
                })
            })
        })
    }

    insert( collectionName, json ) {
        return new Promise( (resolve,reject) => {
            this.connect().then( (db) => {

                db.collection(collectionName).insertOne(json, (err,result)=>{
                    if( err ) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }

    remove( collectionName, json ) {
        return new Promise( (resolve,reject) => {
            this.connect().then((db)=>{
                db.collection(collectionName).removeOne(json, (err,result)=>{
                    if( err ) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }

    update( collectionName, json1, json2){
        return new Promise( (resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).updateOne(json1, {
                    $set: json2
                },(err,result)=>{
                    if( err ) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }

    count(collectionName, json) {
        return new  Promise((resolve,reject)=> {
            this.connect().then((db)=> {

                var result = db.collection(collectionName).count(json);
                result.then(function (count) {
                        resolve(count);
                    }
                )
            })
        })
    }

    getObjectId(id){
        return new ObjectID(id);
    }
}

module.exports = Db.getInstance()
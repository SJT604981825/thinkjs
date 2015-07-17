'use strict';

import querystring from 'querystring';

/**
 * mongodb socket
 */
export default class extends think.adapter.socket {
  /**
   * init
   * @param  {Object} config []
   * @return {}        []
   */
  init(config){
    this.config = think.extend({}, {
      host: '127.0.0.1',
      port: 27017
    }, config);

    this.connection = null;
    this.deferred = null;
  }
  /**
   * get connection
   * @return {Promise} []
   */
  async getConnection(){
    if(this.connection){
      return this.deferred.promise;
    }
    let deferred = think.defer();
    let mongo = await think.npm('mongodb');
    let auth = '';
    let config = this.config;

    this.mongo = mongo;
    if(this.config.user){
      auth = `${config.user}:${config.pwd}@`;
    }
    // connection options
    // http://mongodb.github.io/node-mongodb-native/2.0/tutorials/urls/
    let options = '';
    if(config.options){
      options = '?' + querystring.stringify(config.options);
    }
    let url = `mongodb://${auth}${config.host}:${config.port}/${config.name}${options}`;
    mongo.MongoClient.connect(url, this.config, (err, connection) => {
      if(err){
        deferred.reject(err);
      }else{
        //set logger level
        if(config.log_level){
          mongo.Logger.setLevel(config.log_level);
        }
        this.connection = connection;
        deferred.resolve(this.connection);
      }
    });
    this.deferred = deferred;
    return deferred.promise;
  }
  /**
   * close mongo socket connection
   * @return {} []
   */
  close(){
    if(this.connection){
      this.connection.close();
      this.connection = null;
    }
  }
}
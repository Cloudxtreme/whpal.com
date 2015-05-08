/**
 * Provider.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var alexa = require('alexarank');
var slug = require('slug');
module.exports = {
  tableName: 'provider',
  attributes: {
    name: {
      type: 'string',
      columnName: 'provider_name'
    },
    link: {
      type: 'string',
      columnName: 'provider_link',
      defaultsTo: ''
    },
    description: {
      type: 'string',
      columnName: 'provider_description',
      defaultsTo: ''
    },
    alexa: {
      type: 'integer',
      columnName: 'provider_alexa',
      defaultsTo: 0
    },
    logo: {
      type: 'string',
      columnName: 'provider_logo',
      defaultsTo: ''
    },
    slug: {
      type: 'string',
      columnName: 'provider_slug',
      defaultsTo: ''
    }
  },
  afterCreate: function(newlyInsertedRecord, cb) {
    cb();
    Cache.del('providerIndex');
  },
  beforeUpdate: function(valuesToUpdate, cb) {
    alexa(valuesToUpdate.link, function(error, result) {
      if (!error) {
        valuesToUpdate.slug = slug(valuesToUpdate.id + '-' + valuesToUpdate.name);
        valuesToUpdate.alexa = result.rank;
        cb();
      } else {
        console.log(error);
        cb();
      }
    });
  },
  afterUpdate: function(updatedRecord, cb) {
    Render.provider(updatedRecord.slug);
    cb();
    Cache.del('providerIndex');
    Cache.del('provider' + updatedRecord.id);
    Cache.del('providerIndex');
  }
};
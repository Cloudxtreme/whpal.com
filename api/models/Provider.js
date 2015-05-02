/**
 * Provider.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'provider',
  attributes: {
    name: {
      type: 'string',
      columnName: 'provider_name'
    },
    logo: {
      type: 'string',
      columnName: 'provider_logo',
      defaultsTo: ''
    }
  }
};
/**
 * Coupon.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'coupon',
  attributes: {
    code: {
      type: 'string',
      columnName: 'coupon_code'
    },
    provider: {
      model: 'provider',
      columnName: 'coupon_provider'
    },
    description: {
      type: 'string',
      columnName: 'coupon_description'
    },
    expired: {
      type: 'datetime',
      columnName: 'coupon_expired'
    },
  }
};
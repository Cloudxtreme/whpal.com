/**
 * Vps.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var slug = require('slug');
module.exports = {
  tableName: 'vps',
  attributes: {
    provider: {
      model: 'provider',
      columnName: 'vps_provider'
    },
    name: {
      type: 'string',
      columnName: 'vps_name'
    },
    cpu: {
      type: 'integer',
      columnName: 'vps_cpu'
    },
    ram: {
      type: 'float',
      columnName: 'vps_ram'
    },
    hdspace: {
      type: 'float',
      columnName: 'vps_hdspace'
    },
    hdtype: {
      type: 'string',
      columnName: 'vps_hdtype'
    },
    bandwidth: {
      type: 'float',
      columnName: 'vps_bandwidth'
    },
    portSpeed: {
      type: 'float',
      columnName: 'vps_port_speed'
    },
    ipv4: {
      type: 'integer',
      columnName: 'vps_ipv4'
    },
    ipv6: {
      type: 'integer',
      columnName: 'vps_ipv6'
    },
    location: {
      type: 'string',
      columnName: 'vps_location'
    },
    virtualization: {
      type: 'string',
      columnName: 'vps_virtualization'
    },
    remark: {
      type: 'string',
      columnName: 'vps_remark'
    },
    price: {
      type: 'float',
      columnName: 'vps_price'
    },
    slug: {
      type: 'string',
      columnName: 'vps_slug',
      defaultsTo: ''
    },
    link: {
      type: 'string',
      columnName: 'vps_link'
    }
  },
  afterCreate: function(newlyInsertedRecord, cb) {
    Vps
      .update({
        id: newlyInsertedRecord.id
      }, newlyInsertedRecord)
      .then(function(vps) {
        cb();
        Cache.del('vpsIndex');
        Cache.del('vpsTotal');
        Cache.del('allPlans');
      });
  },
  beforeUpdate: function(valuesToUpdate, cb) {
    Provider
      .findOne({
        id: valuesToUpdate.provider
      })
      .then(function(provider) {
        valuesToUpdate.slug = slug(valuesToUpdate.id + '-' + provider.name + '-' + valuesToUpdate.name);
        cb();
      });
  },
  afterUpdate: function(updatedRecord, cb) {
    Render.vps(updatedRecord.slug);
    cb();
    Cache.del('vpsIndex');
    Cache.del('vps' + updatedRecord.id);
    Cache.del('vpsPlan' + updatedRecord.id);
    Cache.del('vpsTotal');
    Cache.del('allPlans');
  }
};
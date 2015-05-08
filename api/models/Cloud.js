/**
 * Cloud.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var slug = require('slug');
module.exports = {
  tableName: 'cloud',
  attributes: {
    provider: {
      model: 'provider',
      columnName: 'cloud_provider'
    },
    name: {
      type: 'string',
      columnName: 'cloud_name'
    },
    cpu: {
      type: 'integer',
      columnName: 'cloud_cpu'
    },
    maxCpu: {
      type: 'integer',
      columnName: 'cloud_max_cpu'
    },
    cpuCharge: {
      type: 'string',
      columnName: 'cloud_cpu_charge',
      defaultsTo: '',
      required: false
    },
    ram: {
      type: 'float',
      columnName: 'cloud_ram'
    },
    maxRam: {
      type: 'float',
      columnName: 'cloud_max_ram'
    },
    ramCharge: {
      type: 'string',
      columnName: 'cloud_ram_charge',
      defaultsTo: '',
      required: false
    },
    hdspace: {
      type: 'float',
      columnName: 'cloud_hdspace'
    },
    maxHd: {
      type: 'float',
      columnName: 'cloud_max_hd'
    },
    hdtype: {
      type: 'string',
      columnName: 'cloud_hdtype'
    },
    hdCharge: {
      type: 'string',
      columnName: 'cloud_hd_charge',
      defaultsTo: '',
      required: false
    },
    bandwidth: {
      type: 'float',
      columnName: 'cloud_bandwidth'
    },
    bandwidthCharge: {
      type: 'string',
      columnName: 'cloud_bandwidth_charge',
      defaultsTo: '',
      required: false
    },
    portSpeed: {
      type: 'float',
      columnName: 'cloud_port_speed'
    },
    ipv4: {
      type: 'integer',
      columnName: 'cloud_ipv4'
    },
    ipv4Charge: {
      type: 'string',
      columnName: 'cloud_ipv4_charge',
      defaultsTo: '',
      required: false
    },
    ipv6: {
      type: 'integer',
      columnName: 'cloud_ipv6'
    },
    ipv6Charge: {
      type: 'string',
      columnName: 'cloud_ipv6_charge',
      defaultsTo: '',
      required: false
    },
    location: {
      type: 'string',
      columnName: 'cloud_location'
    },
    remark: {
      type: 'string',
      columnName: 'cloud_remark'
    },
    hourPrice: {
      type: 'float',
      columnName: 'cloud_price_hour'
    },
    monthPrice: {
      type: 'float',
      columnName: 'cloud_price_month'
    },
    slug: {
      type: 'string',
      columnName: 'cloud_slug',
      defaultsTo: '',
    },
    link: {
      type: 'string',
      columnName: 'cloud_link'
    }
  },
  afterCreate: function(newlyInsertedRecord, cb) {
    Cloud
      .update({
        id: newlyInsertedRecord.id
      }, newlyInsertedRecord)
      .then(function(cloud) {
        cb();
        Cache.del('cloudIndex');
        Cache.del('cloudTotal');
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
    Render.cloud(updatedRecord.slug);
    cb();
    Cache.del('cloudIndex');
    Cache.del('cloud' + updatedRecord.id);
    Cache.del('cloudPlan' + updatedRecord.id);
    Cache.del('cloudTotal');
    Cache.del('allPlans');
  }
};
/**
 * CloudController
 *
 * @description :: Server-side logic for managing clouds
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var slug = require('slug');
module.exports = {
  total: function(req, res) {
    var totalCache = Cache.get('cloudTotal');
    if (totalCache) {
      res.send(totalCache);
    } else {
      Cloud
        .find()
        .exec(function(err, cloud) {
          res.send({
            total: cloud.length
          });
          Cache.set('cloudTotal', {
            total: cloud.length
          });
        });
    }
  },
  index: function(req, res) {
    var cloudCache = Cache.get('cloudIndex');
    if (cloudCache) {
      res.send(cloudCache);
    } else {
      Cloud
        .find()
        .populate('provider')
        .sort({
          updatedAt: 'desc'
        })
        .exec(function(err, cloud) {
          res.send(cloud);
          Cache.set('cloudIndex', cloud);
        });
    }
  },
  detail: function(req, res) {
    var id = req.param('id');
    var cloudCache = Cache.get('cloud' + id);
    if (cloudCache) {
      res.send(cloudCache);
    } else {
      Cloud
        .find({
          id: id
        })
        .populate('provider')
        .exec(function(err, cloud) {
          res.send(cloud[0]);
          Cache.set('cloud' + id, cloud[0]);
        })
    }
  },
  similar: function(req, res) {
    var id = req.param('id');
    var planCache = Cache.get('cloudPlan' + id);
    if (planCache) {
      res.send(planCache);
    } else {
      Cloud
        .find({
          id: id
        })
        .populate('provider')
        .exec(function(err, cloud) {
          Cloud
            .find({
              id: {
                '!': cloud[0].id
              },
              ram: {
                '>=': cloud[0].ram
              },
              monthPrice: {
                '>=': cloud[0].monthPrice * 0.7,
                '<=': cloud[0].monthPrice * 1.3
              }
            })
            .sort({
              ram: 'asc',
              monthPrice: 'asc'
            })
            .populate('provider')
            .limit(10)
            .exec(function(err, cloud) {
              res.send(cloud);
              Cache.set('cloudPlan' + id, cloud);
            })
        })
    }
  },
  create: function(req, res) {
    var provider = req.param('provider');
    var name = req.param('name');
    var cpu = req.param('cpu');
    var maxCpu = req.param('maxCpu');
    var cpuCharge = req.param('cpuCharge');
    var ram = req.param('ram');
    var maxRam = req.param('maxRam');
    var ramCharge = req.param('ramCharge');
    var hdspace = req.param('hdspace');
    var maxHd = req.param('maxHd');
    var hdtype = req.param('hdtype');
    var hdCharge = req.param('hdCharge');
    var bandwidth = req.param('bandwidth');
    var bandwidthCharge = req.param('bandwidthCharge');
    var portSpeed = req.param('portSpeed');
    var ipv4 = req.param('ipv4');
    var ipv4Charge = req.param('ipv4Charge');
    var ipv6 = req.param('ipv6');
    var ipv6Charge = req.param('ipv6Charge');
    var location = req.param('location');
    var hourPrice = req.param('hourPrice');
    var monthPrice = req.param('monthPrice');
    var link = req.param('link');
    var remark = req.param('remark');
    var provider_id;
    Provider
      .find({
        name: provider
      })
      .exec(function(err, providers) {
        if (err) {
          console.log(err);
          res.send(500, {
            debug: "FATAL ERROR"
          });
        } else {
          if (providers.length > 0) {
            provider_id = providers[0].id;
            createCloud();
          } else {
            Provider
              .create({
                name: provider
              }).exec(function(err, provider) {
                if (err) {
                  console.log(err);
                  res.send(500, {
                    debug: "FATAL ERROR"
                  });
                } else {
                  provider_id = provider.id;
                  createCloud();
                }
              });
          }
        }
      });

    function createCloud() {
      Cloud
        .create({
          provider: provider_id,
          name: name,
          cpu: cpu,
          maxCpu: maxCpu,
          cpuCharge: cpuCharge,
          ram: ram,
          maxRam: maxRam,
          ramCharge: ramCharge,
          hdspace: hdspace,
          maxHd: maxHd,
          hdtype: hdtype,
          hdCharge: hdCharge,
          bandwidth: bandwidth,
          bandwidthCharge: bandwidthCharge,
          portSpeed: portSpeed,
          ipv4: ipv4,
          ipv4Charge: ipv4Charge,
          ipv6: ipv6,
          ipv6Charge: ipv6Charge,
          location: location,
          hourPrice: hourPrice,
          monthPrice: monthPrice,
          remark: remark,
          link: link
        })
        .exec(function(err, cloud) {
          if (err) {
            console.log(err);
            res.send(500, {
              debug: "FATAL ERROR"
            });
          } else {
            res.send(cloud);
            Cache.del('cloudIndex');
            Cache.del('cloudTotal');
          }
        });
    }
  },
  update: function(req, res) {
    var id = req.param('id');
    var provider = req.param('provider');
    var name = req.param('name');
    var cpu = req.param('cpu');
    var maxCpu = req.param('maxCpu');
    var cpuCharge = req.param('cpuCharge');
    var ram = req.param('ram');
    var maxRam = req.param('maxRam');
    var ramCharge = req.param('ramCharge');
    var hdspace = req.param('hdspace');
    var maxHd = req.param('maxHd');
    var hdtype = req.param('hdtype');
    var hdCharge = req.param('hdCharge');
    var bandwidth = req.param('bandwidth');
    var bandwidthCharge = req.param('bandwidthCharge');
    var portSpeed = req.param('portSpeed');
    var ipv4 = req.param('ipv4');
    var ipv4Charge = req.param('ipv4Charge');
    var ipv6 = req.param('ipv6');
    var ipv6Charge = req.param('ipv6Charge');
    var location = req.param('location');
    var hourPrice = req.param('hourPrice');
    var monthPrice = req.param('monthPrice');
    var link = req.param('link');
    var remark = req.param('remark');
    var provider_id;
    Provider
      .find({
        name: provider
      })
      .exec(function(err, providers) {
        if (err) {
          console.log(err);
          res.send(500, {
            debug: "FATAL ERROR"
          });
        } else {
          if (providers.length > 0) {
            provider_id = providers[0].id;
            updateCloud();
          } else {
            Provider
              .create({
                name: provider
              }).exec(function(err, provider) {
                if (err) {
                  console.log(err);
                  res.send(500, {
                    debug: "FATAL ERROR"
                  });
                } else {
                  provider_id = provider.id;
                  updateCloud();
                }
              });
          }
        }
      });

    function updateCloud() {
      Cloud
        .update({
          id: id
        }, {
          id: id,
          provider: provider_id,
          name: name,
          cpu: cpu,
          maxCpu: maxCpu,
          cpuCharge: cpuCharge,
          ram: ram,
          maxRam: maxRam,
          ramCharge: ramCharge,
          hdspace: hdspace,
          maxHd: maxHd,
          hdtype: hdtype,
          hdCharge: hdCharge,
          bandwidth: bandwidth,
          bandwidthCharge: bandwidthCharge,
          portSpeed: portSpeed,
          ipv4: ipv4,
          ipv4Charge: ipv4Charge,
          ipv6: ipv6,
          ipv6Charge: ipv6Charge,
          location: location,
          hourPrice: hourPrice,
          monthPrice: monthPrice,
          remark: remark,
          link: link
        })
        .exec(function(err, cloud) {
          if (err) {
            console.log(err);
            res.send(500, {
              debug: "FATAL ERROR"
            });
          } else {
            res.send(cloud[0]);
            Cache.del('cloudIndex');
            Cache.del('cloud' + id);
            Cache.del('cloudPlan' + id);
            Cache.del('cloudTotal');
          }
        });
    }
  },
  delete: function(req, res) {
    var id = req.param('id');
    Cloud
      .destroy({
        id: id
      }).exec(function(err) {
        if (err) {
          console.log(err);
          res.send(500, {
            debug: "FATAL ERROR"
          });
        } else {
          res.send(200, {
            debug: "SUCCESS"
          });
        }
      });
  },
  render: function(req, res) {
    var page = req.param('page');
    var request = require('request');
    var exec = require('child_process').exec;
    Cloud
      .find()
      .exec(function(err, cloud) {
        renderPage(cloud);
      });

    function renderPage(cloud) {
      dirtyWork(cloud, 0, cloud.length);
    }

    function dirtyWork(cloud, i, total) {
      exec('casperjs ./render.js cloud/' + cloud[i].slug + ' ' + 'cloud/' + cloud[i].slug + '.html', function(error, stdout, stderr) {
        i++;
        if (i < total) {
          dirtyWork(cloud, i, total);
        }
      });
    }
    res.send(page);
  }
};
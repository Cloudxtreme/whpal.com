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
        .then(function(cloud) {
          res.send({
            total: cloud.length
          });
          Cache.set('cloudTotal', {
            total: cloud.length
          });
        })
        .catch(function(err) {
          res.send(500, err);
          Cache.del('cloudTotal');
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
        .then(function(cloud) {
          res.send(cloud);
          Cache.set('cloudIndex', cloud);
        })
        .catch(function(err) {
          res.send(500, err);
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
        .findOne({
          id: id
        })
        .populate('provider')
        .then(function(cloud) {
          res.send(cloud);
          Cache.set('cloud' + id, cloud);
        })
        .catch(function(err) {
          res.send(500, err);
        });
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
        .then(function(cloud) {
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
            .then(function(cloud) {
              res.send(cloud);
              Cache.set('cloudPlan' + id, cloud);
            })
        })
        .catch(function(err) {
          res.send(500, err);
          Cache.del('cloudPlan' + id);
        });
    }
  },
  create: function(req, res) {
    var providerName = req.param('provider');
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
      .findOne({
        name: providerName
      })
      .then(function(provider) {
        if (provider) {
          provider_id = provider.id;
          createCloud();
        } else {
          Provider
            .create({
              name: providerName
            }).then(function(provider) {
              provider_id = provider.id;
              createCloud();
            })
            .catch(function(err) {
              res.send(500, err);
            });
        }
      })
      .catch(function(err) {
        res.send(500, err);
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
        .then(function(cloud) {
          res.send(cloud);
        })
        .catch(function(err) {
          console.log(err);
          res.send(500, err);
        });
    }
  },
  update: function(req, res) {
    var id = req.param('id');
    var providerName = req.param('provider');
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
      .findOne({
        name: providerName
      })
      .then(function(provider) {
        if (provider) {
          provider_id = provider.id;
          updateCloud();
        } else {
          Provider
            .create({
              name: providerName
            }).then(function(provider) {
              provider_id = provider.id;
              updateCloud();
            })
            .catch(function(err) {
              res.send(500, err);
            });
        }
      })
      .catch(function(err) {
        res.send(500, err);
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
        .then(function(cloud) {
          res.send(cloud[0]);
        })
        .catch(function(err) {
          res.send(500, err);
        });
    }
  },
  delete: function(req, res) {
    var id = req.param('id');
    Cloud
      .destroy({
        id: id
      }).then(function(err) {
        res.send(200, {
          debug: "SUCCESS"
        });
      })
      .catch(function(err) {
        res.send(500, err);
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
      exec('casperjs ./render.js index index.html', function(err, stdout, stderr) {});
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
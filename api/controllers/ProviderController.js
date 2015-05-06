/**
 * ProviderController
 *
 * @description :: Server-side logic for managing providers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  index: function(req, res) {
    var providerCache = Cache.get('providerIndex');
    if (providerCache) {
      res.send(providerCache);
    } else {
      Provider
        .find()
        .sort({
          'updatedAt': 'desc'
        })
        .exec(function(err, providers) {
          res.send(providers);
          Cache.set('providerIndex', providers);
        });
    }
  },
  detail: function(req, res) {
    var id = req.param('id');
    var providerCache = Cache.get('provider' + id);
    if (providerCache) {
      res.send(providerCache);
    } else {
      Provider
        .find({
          id: id
        })
        .exec(function(err, provider) {
          res.send(provider[0]);
          Cache.set('provider' + id, provider[0]);
        })
    }
  },
  create: function(req, res) {
    var name = req.param('name');
    var description = req.param('description');
    var link = req.param('link');
    Provider
      .create({
        name: name,
        description: description,
        link: link
      }).exec(function(err, provider) {
        if (err) {
          console.log(err);
          res.send(500, {
            debug: "FATAL ERROR"
          });
        } else {
          res.send(provider);
          Cache.del('providerIndex');
        }
      });
  },
  update: function(req, res) {
    var id = req.param('id');
    var name = req.param('name');
    var description = req.param('description');
    var link = req.param('link');
    Provider
      .update({
        id: id
      }, {
        id: id,
        name: name,
        description: description,
        link: link
      }).exec(function(err, provider) {
        if (err) {
          res.send(500, {
            debug: "FATAL ERROR"
          });
        } else {
          res.send(provider[0]);
          Cache.del('provider' + id);
          Cache.del('providerIndex');
        }
      });
  },
  plans: function(req, res) {
    var id = req.param('id');
    var result = {};
    Vps
      .find({
        provider: id
      })
      .sort({
        price: 'asc'
      })
      .exec(function(err, vps) {
        result.vps = vps;
        Cloud
          .find({
            provider: id
          })
          .sort({
            monthPrice: 'asc'
          })
          .exec(function(err, cloud) {
            result.cloud = cloud;
            Coupon
              .find({
                provider: id,
                expired: {
                  '>=': new Date()
                }
              })
              .sort({
                expired: 'asc'
              })
              .exec(function(err, coupon) {
                result.coupon = coupon;
                res.json(result);
              })
          })
      })
  },
  export: function(req, res) {
    Provider
      .find()
      .exec(function(err, provider) {
        for (i = 0; i < provider.length; i++) {
          var row = provider[i];
          Provider
            .update({
              id: row.id
            }, row)
            .exec(function(err, provider) {

            });
        }
        res.send('finish');
      })
  },
  render: function(req, res) {
    var page = req.param('page');
    var request = require('request');
    var exec = require('child_process').exec;
    Provider
      .find()
      .exec(function(err, provider) {
        renderPage(provider);
      });

    function renderPage(provider) {
      exec('casperjs ./render.js index index.html', function(err, stdout, stderr) {});
      dirtyWork(provider, 0, provider.length);
    }

    function dirtyWork(provider, i, total) {
      exec('casperjs ./render.js provider/' + provider[i].slug + ' ' + 'provider/' + provider[i].slug + '.html', function(error, stdout, stderr) {
        i++;
        if (i < total) {
          dirtyWork(provider, i, total);
        }
      });
    }
    res.send(page);
  }
};
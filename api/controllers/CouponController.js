/**
 * CouponController
 *
 * @description :: Server-side logic for managing coupons
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  index: function(req, res) {
    Coupon
      .find()
      .sort({
        'updatedAt': 'desc'
      })
      .then(function(coupon) {
        res.send(coupon);
      })
      .catch(function(err) {
        res.send(500, err);
      });
  },
  detail: function(req, res) {
    var id = req.param('id');
    Coupon
      .findOne({
        id: id
      })
      .populate('provider')
      .then(function(coupon) {
        res.send(coupon);
      })
      .catch(function(err) {
        res.send(500, err);
      });
  },
  create: function(req, res) {
    var providerName = req.param('provider');
    var code = req.param('code');
    var description = req.param('description');
    var expired = req.param('expired');
    Provider
      .findOne({
        name: providerName
      })
      .then(function(provider) {
        if (provider) {
          Coupon
            .create({
              provider: provider.id,
              code: code,
              description: description,
              expired: expired
            })
            .then(function(coupon) {
              res.send(coupon);
            })
            .catch(function(err) {
              res.send(500, err);
            });
        }
      })
      .catch(function(err) {
        res.send(500, err);
      });
  },
  update: function(req, res) {
    var id = req.param('id');
    var providerName = req.param('provider');
    var code = req.param('code');
    var description = req.param('description');
    var expired = req.param('expired');
    Provider
      .findOne({
        name: providerName
      })
      .then(function(provider) {
        if (provider) {
          Coupon
            .update({
              id: id
            }, {
              provider: provider.id,
              code: code,
              description: description,
              expired: expired
            })
            .exec(function(err, coupon) {
              res.send(coupon);
            })
        }
      })
      .catch(function(err) {
        res.send(500, err);
      });
  },
};
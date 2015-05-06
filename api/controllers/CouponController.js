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
      .exec(function(err, coupon) {
        res.send(coupon);
      })
  },
  detail: function(req, res) {
    var id = req.param('id');
    Coupon
      .find({
        id: id
      })
      .populate('provider')
      .exec(function(err, coupon) {
        res.send(coupon[0]);
      })
  },
  create: function(req, res) {
    var provider = req.param('provider');
    var code = req.param('code');
    var description = req.param('description');
    var expired = req.param('expired');
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
            Coupon
              .create({
                provider: providers[0].id,
                code: code,
                description: description,
                expired: expired
              })
              .exec(function(err, coupon) {
                res.send(coupon);
              })
          }
        }
      });
  },
  update: function(req, res) {
    var id = req.param('id');
    var provider = req.param('provider');
    var code = req.param('code');
    var description = req.param('description');
    var expired = req.param('expired');
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
            Coupon
              .update({
                id: id
              }, {
                provider: providers[0].id,
                code: code,
                description: description,
                expired: expired
              })
              .exec(function(err, coupon) {
                res.send(coupon);
              })
          }
        }
      });
  },
};
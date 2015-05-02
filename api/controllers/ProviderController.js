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
        .exec(function(err, providers) {
          res.send(providers);
          Cache.set('providerIndex', providers);
        });
    }
  }
};
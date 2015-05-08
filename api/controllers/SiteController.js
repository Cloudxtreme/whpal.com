function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function clear(text) {
  if (text.indexOf('Unmetered') > -1) {
    return null;
  } else {
    return text;
  }
}
module.exports = {
  // fix: function(req, res) {
  //   Vps
  //     .query("SELECT * FROM vps WHERE vps_remark LIKE  '%Unmetered%'", function(err, entries) {
  //       for (i = 0; i < entries.length; i++) {
  //         var remark = entries[i].vps_remark.split('|').map(clear).filter(function(val) {
  //           return val !== null;
  //         }).join("|");
  //         Vps
  //           .query('UPDATE vps set vps_remark="' + remark + '" where id=' + entries[i].id, function(err, entry) {
  //             if(err){console.log(err);}
  //           });
  //       }
  //     });
  //   res.send('ok');
  // },
  plans: function(req, res) {
    var allPlanCache = Cache.get('allPlans');
    var result = {};
    if (allPlanCache) {
      res.json(allPlanCache);
    } else {
      Vps
        .find()
        .populate('provider')
        .limit(10)
        .sort({
          updatedAt: 'desc'
        })
        .then(function(vps) {
          result.vps = vps;
          Cloud
            .find()
            .populate('provider')
            .limit(10)
            .sort({
              updatedAt: 'desc'
            })
            .then(function(cloud) {
              result.cloud = cloud;
              res.json(result);
              Cache.set('allPlans', result);
            })
            .catch(function(err) {
              res.send(500, err);
            });
        })
        .catch(function(err) {
          res.send(500, err);
        });
    }
  },
  sitemap: function(req, res) {
    var sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    lastmod = new Date();
    sitemap += '\t<url>\n';
    sitemap += '\t\t<loc>http://whpal.com/#!/vps-listing</loc>\n';
    sitemap += '\t\t<lastmod>' + lastmod.getFullYear() + '-' + pad(lastmod.getMonth() + 1, 2) + '-' + pad(lastmod.getDate(), 2) + '</lastmod>\n';
    sitemap += '\t\t<changefreq>Daily</changefreq>\n';
    sitemap += '\t\t<priority>1.0</priority>\n';
    sitemap += '\t</url>\n';
    sitemap += '\t<url>\n';
    sitemap += '\t\t<loc>http://whpal.com/#!/cloud-listing</loc>\n';
    sitemap += '\t\t<lastmod>' + lastmod.getFullYear() + '-' + pad(lastmod.getMonth() + 1, 2) + '-' + pad(lastmod.getDate(), 2) + '</lastmod>\n';
    sitemap += '\t\t<changefreq>Daily</changefreq>\n';
    sitemap += '\t\t<priority>1.0</priority>\n';
    sitemap += '\t</url>\n';
    Vps
      .find()
      .then(function(vps) {
        for (i = 0; i < vps.length; i++) {
          row = vps[i];
          lastmod = new Date(row.updatedAt);
          sitemap += '\t<url>\n';
          sitemap += '\t\t<loc>http://whpal.com/#!/vps/' + row.slug + '</loc>\n';
          sitemap += '\t\t<lastmod>' + lastmod.getFullYear() + '-' + pad(lastmod.getMonth() + 1, 2) + '-' + pad(lastmod.getDate(), 2) + '</lastmod>\n';
          sitemap += '\t\t<changefreq>Weekly</changefreq>\n';
          sitemap += '\t\t<priority>0.8</priority>\n';
          sitemap += '\t</url>\n';
        }
        cloud();
      })
      .catch(function(err) {
        console.log(err);
      });

    function cloud() {
      Cloud
        .find()
        .then(function(cloud) {
          for (i = 0; i < cloud.length; i++) {
            row = cloud[i];
            lastmod = new Date(row.updatedAt);
            sitemap += '\t<url>\n';
            sitemap += '\t\t<loc>http://whpal.com/#!/cloud/' + row.slug + '</loc>\n';
            sitemap += '\t\t<lastmod>' + lastmod.getFullYear() + '-' + pad(lastmod.getMonth() + 1, 2) + '-' + pad(lastmod.getDate(), 2) + '</lastmod>\n';
            sitemap += '\t\t<changefreq>Weekly</changefreq>\n';
            sitemap += '\t\t<priority>0.8</priority>\n';
            sitemap += '\t</url>\n';
          }
          sitemap += '</urlset>';
          res.setHeader('Content-type', 'text/xml');
          res.send(sitemap);
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }
};
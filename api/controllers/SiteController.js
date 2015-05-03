function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
module.exports = {
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
      .exec(function(err, vps) {
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
      });

    function cloud() {
      Cloud
        .find()
        .exec(function(err, cloud) {
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
        });
    }
  }
};
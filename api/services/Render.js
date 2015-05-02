module.exports = {
    vps: function(slug) {
        var exec = require('child_process').exec;
        exec('casperjs ./render.js vps-listing vps-listing.html', function(err, stdout, stderr) {});
        var exec = require('child_process').exec;
        exec('casperjs ./render.js vps/' + slug + ' ' + 'vps/' + slug + '.html', function(error, stdout, stderr) {});
    },
    cloud: function(slug) {
        var exec = require('child_process').exec;
        exec('casperjs ./render.js cloud-listing cloud-listing.html', function(err, stdout, stderr) {});
        var exec = require('child_process').exec;
        exec('casperjs ./render.js cloud/' + slug + ' ' + 'cloud/' + slug + '.html', function(error, stdout, stderr) {});
    }
}
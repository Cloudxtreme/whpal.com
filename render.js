var casper = require('casper').create({
    clientScripts: [
        'assets/bower_components/jquery/dist/jquery.min.js', // These two scripts will be injected in remote
        'assets/bower_components/noUiSlider/jquery.nouislider.all.min.js',
        'assets/bower_components/angular/angular.min.js',
        'assets/bower_components/sanitize/angular-sanitize.min.js',
        'assets/bower_components/uirouter/angular-ui-router.min.js',
        'assets/bower_components/angular-ui/ui-bootstrap-tpls.min.js',
        'assets/bower_components/angular-smart-table/dist/smart-table.min.js',
        'assets/frontend/app.js'
    ],
    pageSettings: {
        loadPlugins: false // use these settings
    },
});
var part = casper.cli.get(0);
var url = 'http://localhost:1337/#!/' + part;
var myfile = './assets/static/' + casper.cli.get(1);
var fs = require('fs');
casper.start(url);
casper.waitForSelector('.finish', function() {
    metas = this.evaluate(function() {
        var metas = '';
        [].forEach.call(document.querySelectorAll('meta'), function(elem) {
            metas = metas + elem.outerHTML + "\n";
        });
        return metas;
    });
    links = this.evaluate(function() {
        var links = '';
        [].forEach.call(document.querySelectorAll('link'), function(elem) {
            links = links + elem.outerHTML + "\n";
        });
        return links;
    });
    title = this.evaluate(function() {
        return document.querySelector('title').outerHTML;
    });
    body = this.getHTML('body');
    var all = "<!DOCTYPE html>\n<html>\n<head>\n";
    all = all + title + metas + links;
    all = all + "</head>\n";
    all = all + "<body>\n";
    all = all + body;
    all = all + "</body>\n";
    all = all + "</html>";
    fs.write(myfile, all, 'w');
});
casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg, "ERROR");
    var errorFile = './error.log'
    fs.write(errorFile, msg, 'a');
});
casper.run();
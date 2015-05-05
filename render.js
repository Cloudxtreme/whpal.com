var casper = require('casper').create();
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
/*globals require, module*/
var replace = require("replace"),
    lodash = require("lodash"),
    latestVersion = require('./utils/latest-version'),
    exec = require('child_process').exec;

/*
 * ahws-grunt-release
 * https://github.com/ahwswebdev/ahws-grunt-release
 *
 * Copyright (c) 2014 ahwswebdev
 * Licensed under the MIT license.
 */
module.exports = function (grunt) {

    'use strict';

    latestVersion = latestVersion(grunt);

    grunt.registerMultiTask('ahws_grunt_update_version', 'Update bower version to the latest tag in git repo', function () {

        var options = this.options({
                dependenciesFileName: 'bower.json'
            }),

            done = this.async();

        grunt.log.writeln('Options > dependenciesFileName: ' + options.dependenciesFileName);

        latestVersion.getLatestVersionNumber().then(function (version) {
            grunt.log.writeln('Update bower version to: ' + version);

            replace({
                regex: /("version":\s?)(")([0-9.]+)(")/,
                replacement: '$1"' + version + '"',
                paths: [options.dependenciesFileName],
                recursive: false,
                silent: false
            });

            grunt.log.ok('Success');
            done();

            //exec('bower version ' + version, function (err) {
            //    if (err && err.toString().indexOf('EVERSIONNOTCHANGED') === -1) {
            //        grunt.fail.warn(err);
            //    }
            //
            //    grunt.log.ok('Succes');
            //    done();
            //});
        });
    });
};

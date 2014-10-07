/*
 * ahws-grunt-release
 * https://github.com/ahwswebdev/ahws-grunt-release
 *
 * Copyright (c) 2014 ahwswebdev
 * Licensed under the MIT license.
 */

'use strict';

var exec = require('child_process').exec;
var replace = require("replace");
var _ = require("lodash");

module.exports = function (grunt) {

    grunt.registerMultiTask('ahws_grunt_release', 'Update bower dependencies to the latest tags in git repo', function () {
        var done = this.async(),
            after = _.after(this.data.dependencies.length, done);

        var options = this.options({
        });

        var replaceVersionNumber = function (dependency, currentVersion, releaseVersion) {
            if (!releaseVersion) {
                grunt.log.errorlns('No version number found for: ' + dependency);
            }

            grunt.log.writeln('Replace version number for ' + dependency + currentVersion + ' with ' + dependency + "#" + releaseVersion);
            replace({
                regex: dependency + currentVersion,
                replacement: dependency + "#" + releaseVersion,
                paths: ['bower.json'],
                recursive: false,
                silent: false
            });
        };

        var findLatestVersionNumber = function (dependency, currentVersion, stdout) {
            grunt.log.writeln('Find latest version number for ' + dependency);
            var lines = stdout.toString().split('\n'),
                latestVersionNumber = false;

            lines.forEach(function (line) {
                var parts = line.split('/v');
                if (parts[1]) {
                    latestVersionNumber = parts[1].replace('^{}', '')
                }
            });

            replaceVersionNumber(dependency, currentVersion, latestVersionNumber);
        };

        var getVersion = function (dependency, currentVersion, gitRepositoryUrl) {
            exec('git ls-remote ' + gitRepositoryUrl, function (err, stdout, stderr) {
                if (err) {
                    grunt.warn(err);
                } else {
                    findLatestVersionNumber(dependency, currentVersion, stdout);
                }
                after();
            });
        };

        for (var dependency in this.data.dependencies) {
            var gitRepositoryUrl = this.data.dependencies[dependency].replace('git+https', 'https').replace(/#[a-z0-9.]+/, ''),
                currentVersion = this.data.dependencies[dependency].match(/#[a-z0-9.]+/)[0];
            grunt.log.writeln('Getting version for: ' + gitRepositoryUrl);
            getVersion(dependency, currentVersion, gitRepositoryUrl)
        }
    });
};



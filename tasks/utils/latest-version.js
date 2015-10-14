'use strict';

var exec = require('child_process').exec,
    Promise = require('promise'),
    semver = require('semver');

module.exports = function (grunt) {

    var findLatestVersionNumber = function (gitRepositoryUrl, stdout) {
            grunt.log.writeln('Find latest version number for ' + gitRepositoryUrl);

            var lines = stdout.toString().replace(/v/g, '')
                .split('\n'),
                latestVersion;

            lines.forEach(function (version) {
                if (semver.valid(version)) {
                    if (!latestVersion) {
                        latestVersion = version;
                    } else if(semver.gt(version, latestVersion)) {
                        latestVersion = version;
                    }
                }
            });

            return latestVersion;
        },

        getVersion = function (gitRepositoryUrl) {
            gitRepositoryUrl = gitRepositoryUrl || '';
            return new Promise(function (resolve) {
                exec('git ls-remote --tags ' + gitRepositoryUrl + ' | grep -v {} | awk -F\/ \'{printf("%s\\n", $3)}\' | sort -n -t. -k1,1', function (err, stdout) {
                    if (err) {
                        grunt.warn(err);
                    } else {
                        resolve(findLatestVersionNumber(gitRepositoryUrl, stdout));
                    }
                });
            });
        };

    return {
        getLatestVersionNumber: function (gitRepositoryUrl) {
            return new Promise(function (resolve) {
                getVersion(gitRepositoryUrl).then(function (latestVersion) {
                    grunt.log.writeln('version = ' + latestVersion);
                    resolve(latestVersion);
                });
            });
        }
    }
};

'use strict';

var exec = require('child_process').exec,
    Promise = require('promise');

module.exports = function (grunt) {

    var findLatestVersionNumber = function (gitRepositoryUrl, stdout) {
            grunt.log.writeln('Find latest version number for ' + gitRepositoryUrl);

            var lines = stdout.toString().replace(/v/g, '')
                .split('\n');

            return lines.sort(function (a, b) {
                if (versionNumberHigher(a, b)) {
                    return 1;
                }

                return -1;
            })[0];
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
        },

        getVersionArray = function (version) {
            return version.split('.')
                .map(function (val) {
                    return parseInt(val, 10);
                });
        },

        versionNumberHigher = function(versionA, versionB) {
            if (!versionA) {
                return true;
            }

            versionA = getVersionArray(versionA);
            versionB = getVersionArray(versionB);

            if (versionB[0] > versionA[0]) {
                return true;
            }

            if (versionB[0] >= versionA[0] && versionB[1] > versionA[1]) {
                return true;
            }

            if (versionB[0] >= versionA[0] && versionB[1] >= versionA[1] && versionB[2] > versionA[2]) {
                return true;
            }
        };

    return {
        getLatestVersionNumber: function (gitRepositoryUrl) {
            return new Promise(function (resolve) {
                getVersion(gitRepositoryUrl).then(function (latestVersion) {
                    resolve(latestVersion);
                });
            });
        }
    }
};

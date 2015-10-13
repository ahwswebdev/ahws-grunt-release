'use strict';

var exec = require('child_process').exec,
    Promise = require('promise');

module.exports = function (grunt) {

    var findLatestVersionNumber = function (gitRepositoryUrl, stdout) {
            grunt.log.writeln('Find latest version number for ' + gitRepositoryUrl);

            var lines = stdout.toString().split('\n'),
                latestVersionNumber = false;

            lines.forEach(function (line) {
                var versionNumber = line.replace('v', '');
                if (versionNumber.trim().length !== 0) {
                    latestVersionNumber = versionNumber;
                }
            });

            return latestVersionNumber;
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
                    resolve(latestVersion);
                });
            });
        }
    }
};

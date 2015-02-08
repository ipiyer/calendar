/*
 * grunt-envision
 * https://github.com/munichlinux/calendar
 *
 * Copyright (c) 2014 Prashanth
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt, {
        scope: ['devDependencies', 'dependencies', "optionalDependencies"]
    });

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'js/*.js'
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        watch: {
            compass: {
                files: [
                    'css/sass/*.scss',
                    'css/sass_includes/**/*'
                ],
                tasks: ['compass:dev'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['js/**/*.js', 'Gruntfile.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            index: {
                files: ['index.html'],
                options: {
                    livereload: true
                }
            }
        },
        compass: {
            options: {
                sassDir: 'css/sass',
                generatedImagesDir: 'img',
                imagesDir: 'img',
                importPath: ['css/sass_includes'],
                relativeAssets: false,
                assetCacheBuster: false,
                noLineComments: true,
                trace: true
            },
            dev: {
                options: {
                    debugInfo: false,
                    outputStyle: 'expanded',
                    cssDir: 'css'
                }
            }
        }
    });



    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', []);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['compass', 'jshint']);
};
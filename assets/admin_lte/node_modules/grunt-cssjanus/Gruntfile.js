/*
 * grunt-cssjanus
 * https://github.com/cssjanus/grunt-cssjanus
 *
 * Copyright (c) 2013 Yoav Farhi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Configuration to be run.
    cssjanus: {
      options: {
        swapLtrRtlInUrl: true,
        swapLeftRightInUrl: false,
        generateExactDuplicates: false
      },
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['cssjanus']);

};

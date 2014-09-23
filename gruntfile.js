module.exports = function(grunt) {
  // Do grunt-related things in here

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
          src: ['js/step_functions.js', 'js/sketchy.js', 'js/critter.js', 'js/critters.js'],
          dest: 'js/built.js',
        },
    }
  });

  //
  grunt.loadNpmTasks('grunt-contrib-concat');
};

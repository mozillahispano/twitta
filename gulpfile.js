'use strict';

var gulp = require('gulp'),
  minifycss = require('gulp-minify-css'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  replace = require('gulp-replace'),
  livereload = require('gulp-livereload'),
  lr = require('tiny-lr'),
  server = lr(),
  stripDebug = require('gulp-strip-debug'),
  gutil = require('gulp-util');

var filesToMove = [
  './fonts/*.*',
  './img/*.*',
  './locales/*.*',
  './manifest.webapp'
];

// Runs JSHints on scripts
gulp.task('scripts', function() {
    gulp.src('js/*.js', 'js/helpers/*.js', 'js/views/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(livereload(server))
    .on('error', gutil.log);
});

// Distribution
gulp.task('dist', function() {

  // Move static files
  gulp.src(filesToMove, {
    base: './'
  })
    .pipe(gulp.dest('dist/'));

  // Minify and remove debug code from .js
  gulp.src('js/**/*.js')
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(stripDebug())
    .pipe(gulp.dest('dist/js'))
    .on('error', gutil.log);

  // Minify CSS
  gulp.src('css/main.css')
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .on('error', gutil.log);

  // Replaces references to CSS minified files
  gulp.src('./index.html')
    .pipe(replace('main.css', 'main.min.css'))
    .pipe(gulp.dest('dist/'));

});


// Watch .js files on change
gulp.task('watch', function() {
  server.listen(35729, function(err) {
    if (err) {
      return console.log(err);
    }

    gulp.watch('js/**/*.js', ['scripts']);
  });
});


// Default taks - Prepare for production
gulp.task('default', ['dist'], function() {});

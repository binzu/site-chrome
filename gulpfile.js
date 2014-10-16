// Require Gulp and Co.
var gulp       = require('gulp');
var sass       = require('gulp-sass');
var uglify     = require('gulp-uglify');
var jshint     = require('gulp-jshint');
var scsslint   = require('gulp-scss-lint');
var lintspaces = require('gulp-lintspaces');
var connect    = require('gulp-connect');
var escape     = require('gulp-replace');
var include    = require('gulp-file-include');
var minifyHTML = require('gulp-minify-html');

// Asset paths
var htmlPath   = 'src/html/*.html';
var sassPath   = 'src/scss/**/*.scss';
var jsPath     = 'src/js/*.js';
var tmpPath    = 'tmp';
var distPath   = 'dist';
var buildPath  = 'build';

// Configuration objects
var sassConfig = { 'outputStyle': 'compressed' };
var lintConfig = { 'config': '.scss-lint.yml' };

// HTML tasks
gulp.task('html', function() {
  return gulp.src(['src/html/nav.html', 'src/html/footer.html'])
    .pipe(minifyHTML({quotes:true}))
    .pipe(gulp.dest(distPath));
});

// SASS tasks
gulp.task('styles', function() {
  return gulp.src([sassPath, '!src/scss/shared/bourbon/**/*.scss', '!src/scss/shared/_reset.scss'])
    .pipe(scsslint(lintConfig))
    .pipe(sass(sassConfig))
    .pipe(gulp.dest(distPath));
});

// JavaScript tasks
gulp.task('scripts', function() {
  return gulp.src(jsPath)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(gulp.dest(distPath));
});

// Include HTML partials in primary layout
gulp.task('include', function() {
  return gulp.src(['html/index.html'])
    .pipe(include())
    .pipe(gulp.dest(distPath));
});

// Escape double quotes for JSONification of compiled source code
gulp.task('escape', function() {
  return gulp.src('dist/*', '!dist/index.html')
    .pipe(escape('\\"', '"'))
    .pipe(escape('"', '\\"'))
    .pipe(gulp.dest(tmpPath));
});

// Watch files for changes
gulp.task('watch', function() {
  gulp.watch(htmlPath, ['include']);
  gulp.watch(sassPath, ['styles']);
  gulp.watch(jsPath, ['scripts']);
});

// Start web server
gulp.task('server', function() {
  connect.server({
    root: distPath,
    port: 4000
  });
});

// Build content for distribution
gulp.task('build', ['escape'], function() {
  return gulp.src('src/json/content.json')
    .pipe(include())
    .pipe(gulp.dest(buildPath))
});

// Default task definition
gulp.task('default', ['html', 'styles', 'scripts', 'server', 'include', 'watch']);

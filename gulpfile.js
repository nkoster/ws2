var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var replace = require('gulp-replace');

var ws = 'wss://localhost:10443';
if (process.argv.indexOf("-ws") != -1) {
  ws = process.argv[process.argv.indexOf("-ws") + 1];
}

gulp.task('html', function() {
  var opts = {
    conditionals: true,
    spare: true,
    comments: false
  };
  return gulp.src('html/index.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('public/'));
});

gulp.task('css', function() {
  return gulp.src('css/*.css')
    .pipe(minifyCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('public/css'));
});

gulp.task('js', function() {
  gulp.src(['bower_components/webcomponentsjs/webcomponents.min.js', 'js/reconnecting-websocket.js', 'js/app.js'])
    .pipe(concat('app.js'))
    .pipe(replace('%%WS%%', ws))
    .pipe(uglify())
    .pipe(gulp.dest('public/assets'))
});

gulp.task('watch:html', ['html'], function() {
  gulp.watch('html/**/*.html', ['html'])
});

gulp.task('watch:css', ['css'], function() {
  gulp.watch('css/**/*.css', ['css'])
});

gulp.task('watch:js', ['js'], function() {
  gulp.watch('js/**/*.js', ['js'])
});

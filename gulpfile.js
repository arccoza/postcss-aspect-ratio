var gulp = require('gulp');
var postcss = require('gulp-postcss');
var layout = require('./index.js');
var shell = require('gulp-shell');


var files = ['index.js', './test/*.js', './example/src/css/main.css', 'gulpfile.js'];

gulp.task('example', function() {
  var processors = [
    layout()
  ];

  return gulp.src('./example/src/css/main.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./example/bld/css/'));
});

gulp.task('test', shell.task([
  'node test/test.js',
]));

gulp.task('default', ['test']);

gulp.task('watch-example', function () {
    gulp.watch(files, ['example']);
});

gulp.task('watch', function () {
    gulp.watch(files, ['test']);
});

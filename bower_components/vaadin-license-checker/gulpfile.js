var gulp = require('gulp');
var prettify = require('gulp-jsbeautifier');

require('web-component-tester').gulp.init(gulp);

var demoFiles = 'demo/*.html';
var srcFiles = '*.html';
var testFiles = 'test/*.html';

gulp.task('format:verify', ['format:verify:src', 'format:verify:demo', 'format:verify:test']);

gulp.task('format:verify:src', function() {
    gulp.src(srcFiles)
        .pipe(prettify({config: 'jsbeautifyrc.json', mode: 'VERIFY_ONLY'}));
});

gulp.task('format:verify:demo', function() {
    gulp.src(demoFiles)
        .pipe(prettify({config: 'jsbeautifyrc.json', mode: 'VERIFY_ONLY'}));
});

gulp.task('format:verify:test', function() {
    gulp.src(testFiles)
        .pipe(prettify({config: 'jsbeautifyrc.json', mode: 'VERIFY_ONLY'}));
});

gulp.task('format',['format:src', 'format:demo', 'format:test']);

gulp.task('format:src', function() {
    gulp.src(srcFiles)
        .pipe(prettify({config: 'jsbeautifyrc.json', mode: 'VERIFY_AND_WRITE'}))
        .pipe(gulp.dest("."));
});

gulp.task('format:demo', function() {
    gulp.src(demoFiles)
        .pipe(prettify({config: 'jsbeautifyrc.json', mode: 'VERIFY_AND_WRITE'}))
        .pipe(gulp.dest("./demo/"));
});

gulp.task('format:test', function() {
    gulp.src(testFiles)
        .pipe(prettify({config: 'jsbeautifyrc.json', mode: 'VERIFY_AND_WRITE'}))
        .pipe(gulp.dest("./test/"));
});

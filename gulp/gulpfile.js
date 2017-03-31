/**
 * This is the Gulp build configuration file.
 * Here, you will find the task definitions for specific build tasks.
 * See Gulp documentation for examples:
 *      https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
 */
const path = require('path');
const beauxBotRoot = path.join(__dirname, '..');
// First, let's switch to the root, so all gulp
// paths will be resolved from the root dir.
process.chdir(beauxBotRoot);

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const gutil = require('gulp-util');
gutil.log('Gulp root directory is ' + beauxBotRoot);

const TASK_FINISH_EVENT = 'finish';

/**
 * Can be called via:
 *      log('the message')
 *  or
 *      log.bind('the message')
 */
const log = function(msg) {
    gutil.log((msg) ? msg.toString() : this.toString());
};

const es6Files = [
    'server.js',
    'src/**/*.js'
];
const lintSuccessMessage = 'Task "lint" complete: Congrats! No jshint Errors.';

gulp.task('eslint', function() {
    return gulp.src(es6Files)
        .pipe(eslint({configFile: path.join(__dirname,'.eslintrc.js')}))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});


gulp.task('watch', ['eslint'], function () {
    gulp.watch('src/**/*.js',['eslint']);
});

gulp.task('test', ['eslint']);
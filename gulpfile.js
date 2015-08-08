var gulp= require('gulp');
var childProcess = require('child_process');
var yargs = require('yargs');

var argv = yargs.alias('t', 'target').argv;

var buildTarget;
var buildTargetConfig;

console.log('--------------------------------')
gulp.task('build', [
    'load-config',
    // 'copy-assets',
    // 'compile-statics',
    // 'compile-style',
    // 'compile-vendor',
    // 'compile-app',
], function (callback) {
    console.log('xxxxxxxxxxxx task: build')
    console.log('==========');
    console.log(buildTargetConfig);
    console.log('==========');
    return callback(null);
});


gulp.task('load-config', function (callback) {
    if (buildTargetConfig) { return callback(null); }

    buildTarget = argv.target;

    if (!buildTarget) {
        console.error('[!! ERROR] Build target not specified. Please use "-t" option to specified build target')
        console.error('Build target not specified');
        process.exit(9); // 9 - Invalid Argument
    }

    childProcess.exec('git describe', { timeout: 15000 }, function (err, stdout, stderr) {
        if (err) {
            console.error('[!! ERROR] on executing "git describe". stderr: ', stderr)
            return callback(err);
        } else {
            var version = stdout;
            console.log('---------------: ', version)

            // try {
            //     buildTargetConfig = require('./etc/env/' + buildTarget);
            // } catch (e) {
            //     console.error('Build target `' + buildTarget + '` not found');
            //     process.exit(1);
            // }

            buildTargetConfig.NAME = buildTarget;
            buildTargetConfig.VERSION = version.toString('utf8').trim('');
            buildTargetConfig.OPTIMIZE_BUILD = !buildTargetConfig.NON_PRODUCTION;
            buildTargetConfig.BUILD_PATH = './release/' + buildTarget;

        return callback(null);

        }

    });
});


gulp.task('copy-assets', ['load-config'], function () {
    console.log('xxxxxxxxxxx  task: copy-assets');
    var fontsStream = gulp.src('./app/statics/fonts/**')
        .pipe(plumber())
        .pipe(gulp.dest(buildTargetConfig.BUILD_PATH + '/fonts'))
        .pipe(livereload());

    var imagesStream = gulp.src('./app/statics/images/**')
        .pipe(plumber())
        .pipe(gulp.dest(buildTargetConfig.BUILD_PATH + '/images'))
        .pipe(livereload());

    var swfStream = gulp.src('./app/statics/ZeroClipboard.swf')
        .pipe(plumber())
        .pipe(gulp.dest(buildTargetConfig.BUILD_PATH))
        .pipe(livereload());

    return merge(fontsStream, imagesStream, swfStream);
});


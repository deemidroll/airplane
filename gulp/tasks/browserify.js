/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   If the watch task is running, this uses watchify instead
   of browserify for faster bundling using caching.
*/
var gulp = require('gulp'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    uglify = require('gulp-uglify'),
    streamify = require('gulp-streamify'),
    bundleLogger = require('../util/bundleLogger'),
    handleErrors = require('../util/handleErrors'),
    source = require('vinyl-source-stream'),
    config = require('../config'),
    header = require('gulp-header'),
    banner = '/* ' + config.banner + ' */\n',
    gulpif = require('gulp-if'),
    minimist = require('minimist');

var knownOptions = {
    string: 'env',
    default: { env: process.env.NODE_ENV || 'dev' }
};
var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('browserify', function(callback) {

    var bundleQueue = config.browserify.bundleConfigs.length;

    var browserifyThis = function(bundleConfig) {

        var bundler = browserify({
            // Required watchify args
            cache: {}, packageCache: {}, fullPaths: true,
            // Specify the entry point of your app
            entries: bundleConfig.entries,
            // Add file extentions to make optional in your requires
            extensions: config.browserify.extensions,
            // Enable source maps!
            debug: config.browserify.debug
        });

        var bundle = function() {
            // Log when bundling starts
            bundleLogger.start(bundleConfig.outputName);

            return bundler
            .bundle()
            // Report compile errors
            .on('error', handleErrors)
            // Use vinyl-source-stream to make the
            // stream gulp compatible. Specifiy the
            // desired output filename here.
            .pipe(source(bundleConfig.outputName))
            // only minify in production
            .pipe(gulpif(options.env === 'prod', streamify(uglify())))
            .pipe(header(banner))
            // Specify the output destination
            .pipe(gulp.dest(bundleConfig.dest))
            .on('end', reportFinished);
        };

        if(global.isWatching) {
            // Wrap with watchify and rebundle on changes
            bundler = watchify(bundler);
            // Rebundle on update
            bundler.on('update', bundle);
        }

        var reportFinished = function() {
            // Log when bundling completes
            bundleLogger.end(bundleConfig.outputName);

            if(bundleQueue) {
                bundleQueue--;
                if(bundleQueue === 0) {
                    // If queue is empty, tell gulp the task is complete.
                    // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
                    callback();
                }
            }
        };

        return bundle();
    };

    // Start bundling with Browserify for each bundleConfig specified
    config.browserify.bundleConfigs.forEach(browserifyThis);
});

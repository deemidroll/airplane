var dest = './build',
    src = './src';

module.exports = {
    browserSync: {
        server: {
            // We're serving the src folder as well
            // for sass sourcemap linking
            baseDir: [dest]
        },
        files: [
        dest + '/**',
        // Exclude Map files
        '!' + dest + '/**.map'
        ]
    },
    sass: {
        src: src + '/scss/*.scss',
        dest: dest + '/css'
    },
    images: {
        src: src + '/img/**',
        dest: dest + '/img'
    },
    markup: {
        src: src + '/html/**',
        dest: dest
    },
    browserify: {
        // Enable source maps
        debug: true,
        // Additional file extentions to make optional
        extensions: [],
        // A separate bundle will be generated for each
        // bundle config in the list below
        bundleConfigs: [{
            entries: './src/js/main.js',
            dest: dest + '/js',
            outputName: 'app.js'
        }, {
            entries: './src/js/mobile.js',
            dest: dest + '/js',
            outputName: 'mobile.js'
        }]
    },
    banner: 'Made by deemidroll | 2014 | deemidroll@gmail.com'
};

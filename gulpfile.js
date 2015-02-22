/*jslint node: true, nomen: true */
var gulp = require('gulp'),
    bower = require('gulp-bower'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    vinylPaths = require('vinyl-paths'),
    del = require('del');


var distPath = 'dist',
    wwwPath = 'dist/www',
    libPath = 'dist/www/lib';

var paths = {
    client: 'src/client/**/*.*',
    server: 'src/server/**/*.js'
};

/*
 * clean
 */
gulp.task('clean', function () {
    'use strict';
    return gulp.src(['bower_components/', distPath], {
        read: false
    }).pipe(vinylPaths(del));
});

/*
 * bower install
 */
gulp.task('bower', function () {
    'use strict';
    return bower().pipe(gulp.dest('bower_components'));
});

/**
 * Subtask for bowercopy - jQuery
 */
gulp.task('bowercopy:jquery', ['bower'], function () {
    'use strict';
    return gulp.src(['bower_components/jquery/dist/*']).pipe(
        gulp.dest(libPath + '/jquery'));
});

/**
 * Subtask for bowercopy - bootstrap
 */
gulp.task('bowercopy:bootstrap', ['bower'], function () {
    'use strict';
    return gulp.src(['bower_components/bootstrap/dist/**/*']).pipe(
        gulp.dest(libPath + '/bootstrap'));
});
/**
 * Subtask for bowercopy - handlebars
 */
gulp.task('bowercopy:handlebars', ['bower'], function () {
    'use strict';
    return gulp.src(['bower_components/handlebars/handlebars.min.js']).pipe(
        gulp.dest(libPath + '/handlebars'));
});

/**
 * bowercopy - copy the dependencies from bower_components to lib
 */
gulp.task('bowercopy', ['bowercopy:jquery', 'bowercopy:bootstrap', 'bowercopy:handlebars'],
    function () {
        'use strict';
    });

/*
 * JSHint
 */
gulp.task('hint', function () {
    'use strict';
    return gulp.src(
   ['src/client/js/**/*.js', 'src/server/**/*.js', 'gulpfile.js']).pipe(jshint()).pipe(
        jshint.reporter(stylish));
});


/**
 * build dist
 */
gulp.task('dist:client', ['hint' /*test...*/ ], function () {
    'use strict';
    return gulp.src('src/client/**/*.*').pipe(gulp.dest(wwwPath));
});
gulp.task('dist:server', ['hint' /*test...*/ ], function () {
    'use strict';
    return gulp.src('src/server/**/*.*').pipe(gulp.dest(distPath));
});
gulp.task('dist', ['dist:client', 'dist:server'],
    function () {
        'use strict';
    });


/**
 * watch
 */
gulp.task('watch', function () {
    'use strict';
    gulp.watch(paths.client, ['dist:client']);
    gulp.watch(paths.server, ['dist:server']);
});

/**
 * default
 */
gulp.task('default', ['watch', 'dist'], function () {
    'use strict';
    // default stuff
});
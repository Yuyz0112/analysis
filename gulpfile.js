var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var fileinclude  = require('gulp-file-include');
var browserSync = require('browser-sync').create();
var tinypng = require('gulp-tinypng');
var sass = require('gulp-ruby-sass');

gulp.task('fileinclude', function() {
    gulp.src('**.html')
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
    .pipe(gulp.dest('dist'));
});

gulp.task('minifycss',function(){
	return sass('sass/*.scss')
		.on('error', sass.logError)
    	.pipe(gulp.dest('css'))
		.pipe(minifycss())
		.pipe(rename({suffix:'.min'}))
		.pipe(gulp.dest('dist/css'));
})

gulp.task('sass', function () {
  return sass('sass/*.scss')
    .on('error', sass.logError)
    .pipe(gulp.dest('css'));
})

gulp.task('minifyjs',function(){
	return gulp.src('main.js')
		.pipe(gulp.dest('dist'))
		.pipe(rename({suffix:'.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
})

// 静态服务器
gulp.task('static-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.watch("dist/*.html").on('change', browserSync.reload);
    gulp.watch("dist/css/*.css").on('change', browserSync.reload);
    gulp.watch("dist/js/*.js").on('change', browserSync.reload);
});

//压缩图片
gulp.task('tinypng', function () {
    gulp.src('images/*.{png,jpg}')
        .pipe(tinypng('3KGEJm41iqv2yIjGvTQn68XyT3M4yln4'))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('clean',function(cb){
	del('dist',cb);
})

gulp.task('default',function(){
	gulp.start('minifycss','minifyjs','fileinclude');
})
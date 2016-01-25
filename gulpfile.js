var gulp = require('gulp');
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var cssmin = require('gulp-cssmin');
var cp = require('child_process');

// BrowserSync
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
          baseDir: ['./']
        }
    });
});

//Error sound
function errorSound() {
	var exec = cp.exec;
	exec('mpg123 audio/error.mp3');
}

// Initialization
gulp.task('init', ['css'], function() {
  var exec = cp.exec;
  exec('mpg123 audio/init.mp3');
});

// Stylesheets
gulp.task('css', function() {
  gulp.src('sass/style.scss')
    .pipe(plumber({
      errorHandler: function(error) {
        gutil.log(gutil.colors.red(' **** ERROR **** \n' + error.plugin + '\n' + error.message));
        errorSound();
        this.emit('end');
      }
    }))
    .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(cssmin())
    .pipe(gulp.dest('.'))
    .pipe(browserSync.stream());
});

// Watch
gulp.task('watch', function() {
  gulp.watch('**/*.scss', ['css']);
  gulp.watch('**/*.html', browserSync.reload);
});

gulp.task('default', ['init' , 'browser-sync', 'watch']);

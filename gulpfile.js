var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
// var babel = require('gulp-babel');

gulp.task('hello', function() {
  console.log('hello  ayy lmao')
});

gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('serve', ['browserSync', 'sass'] ,function(){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
  // gulp.watch('app/js/app.js', ['babel']);
});
// gulp.task('babel', function(){
//   return gulp.src('app/js/app.js')
//     .pipe(babel({
//       presets: ['es2015']
//     }))
//     .pipe(gulp.dest('dist'));
// });
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
  })
});

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('public'))
});

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
      // Rules
    })))
    .pipe(gulp.dest('public/images'))
});

gulp.task('fonts', function(){
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('public/fonts'))
})

gulp.task('clean:public', function(){
  return del.sync('public');
})

gulp.task('cache:clear', function (callback) {
  return cache.clearAll(callback)
})

gulp.task('default', function (callback) {

  runSequence('clean:public',
    ['sass', 'useref', 'fonts', 'images'],
    callback
  )
})

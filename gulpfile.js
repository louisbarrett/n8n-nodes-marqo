const gulp = require('gulp');
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');
const path = require('path');

gulp.task('build:icons', () => {
  return gulp.src('nodes/**/*.svg')
    .pipe(svgmin())
    .pipe(rename((filePath) => {
      filePath.dirname = path.join(filePath.dirname, 'dist');
    }))
    .pipe(gulp.dest('.'));
});
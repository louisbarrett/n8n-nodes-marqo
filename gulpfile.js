const gulp = require('gulp');
const path = require('path');

gulp.task('copy-icon', () => {
  return gulp.src('nodes/Marqo/Marqo.png')
    .pipe(gulp.dest('dist/nodes/Marqo/'));
});

gulp.task('build:icons', gulp.series('copy-icon'));
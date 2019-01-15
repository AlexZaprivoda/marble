"use strict";

var gulp = require("gulp"),
  gp = require("gulp-load-plugins")(),
  browserSync = require("browser-sync").create();

gulp.task("serve", function() {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });
});

gulp.task("pug", function() {
  return gulp
    .src("src/pug/pages/*.pug")
    .pipe(
      gp.pug({
        pretty: true
      })
    )
    .pipe(gulp.dest("build"))
    .on("end", browserSync.reload);
});

gulp.task("fonts", function() {
  return gulp
    .src("src/static/fonts/**/*")
    .pipe(gulp.dest("build/static/fonts"));
});

gulp.task("img", function() {
  return gulp.src("src/static/img/**/*").pipe(gulp.dest("build/static/img"));
});

gulp.task("scss", function() {
  return gulp
    .src("src/static/scss/index.scss")
    .pipe(gp.sass({}))
    .pipe(
      gp.autoprefixer({
        browsers: ["last 10 versions"]
      })
    )
    .on(
      "error",
      gp.notify.onError({
        message: "Error: <%= error.message %>",
        title: "style"
      })
    )
    .pipe(gp.csso())
    .pipe(gulp.dest("build/static/css"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

gulp.task("watch", function() {
  gulp.watch("src/pug/**/*.pug", gulp.series("pug"));
  gulp.watch("src/static/**/*.scss", gulp.series("scss"));
  gulp.watch("src/static/fonts/**/*", gulp.series("fonts"));
  gulp.watch("src/static/img/**/*", gulp.series("img"));
});

gulp.task(
  "default",
  gulp.series(
    gulp.parallel("pug", "scss", "fonts", "img"),
    gulp.parallel("watch", "serve")
  )
);

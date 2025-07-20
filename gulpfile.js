import { src, parallel, dest, series, watch, } from "gulp";
import browserSync from "browser-sync";
import gulpPlumber from "gulp-plumber";
import less from "gulp-less";
import GulpPostCss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import htmlmin from "gulp-htmlmin";
import GulpCleanCss from "gulp-clean-css";
import { deleteAsync } from "del";
import rename from "gulp-rename";

function clean() {
  return deleteAsync('build');
}

function html() {
  return src('source/index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('build'));
}

function styles() {
  return src('source/less/style.less')
    .pipe(gulpPlumber())
    .pipe(less())
    .pipe(GulpPostCss([
      autoprefixer()
    ]))
    .pipe(GulpCleanCss({ level: 2 }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('build/css'))
    .pipe(browserSync.stream());
}

export function images() {
  return src('source/img/**/*.{jpg,png,webp,svg}', {buffer: true})
    .pipe(dest('build/img'));
}

function server() {
  browserSync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false
  });

  watch('source/index.html', series(html, browserSync.reload));
  watch('source/less/**/*.less', series(styles));
}

export default series(clean, images, parallel(html, styles,), server);

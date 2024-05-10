import gulp from 'gulp';

import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';

import rename from 'gulp-rename';
import {deleteAsync} from 'del';

import webpackStream from 'webpack-stream';
import svgSprite from 'gulp-svg-sprite';
import webp from 'gulp-webp';
import htmlmin from 'gulp-htmlmin';
import browserSync from 'browser-sync';

const sass = gulpSass(dartSass);

function server() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
}

function watch() {
    gulp.watch(['src/**/*.scss'], styles);
    gulp.watch(['src/*.js'], scripts);
    gulp.watch(['src/assets/fonts/*', 'src/assets/images/**/*', '!src/assets/images/!(icons)/*'], copy);
    gulp.watch(['src/assets/images/icons/*'], svg);
    gulp.watch(['src/assets/images/content/divider/*'], towebp);
    gulp.watch('src/*.html', html);
}

function html() {
    return gulp.src('src/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream())
}

function scripts() {
    // 1. сначала нужно взять JavaScript файлы
    // 2. при необходимости переписать новый синтаксис с учетом браузерной поддержки
    // 3. минифицировать код
    // 4. переименовать, добавить суффикс min
    // 5. сохранить результат в новый файл 
    return gulp.src('src/app.js')
        .pipe(webpackStream({
            mode: 'production',
            module: {
                rules: [
                  {
                    test: /\.m?js$/,
                    exclude: /(node_modules)/,
                    use: {
                      loader: 'babel-loader',
                      options: {
                        presets: [
                          ['@babel/preset-env', { targets: "defaults" }]
                        ]
                      }
                    }
                  }
                ]
              }
        }))
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream())
}

function styles() {
    // 1. взять scss файлы
    // 2. преобразовать код в css
    // 3. сохранить результат
    return gulp.src('src/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(['last 15 version']))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())
}

function copy() {
    return gulp
    .src(
        [
            'src/assets/fonts/*',
            'src/assets/images/!(icons)/**/*',
            'src/assets/images/!(icons)'
        ], 
        { base: 'src', encoding: 'binary'})
        .pipe(gulp.dest('dist', { encoding: 'binary' }))
        .pipe(browserSync.stream({
      once: true
    }))
}

function clean() {
    return deleteAsync(['dist/**'])
}

function svg () {
    return gulp.src('src/assets/images/icons/*.svg')
    .pipe(svgSprite({
        mode: {
            stack: {
                sprite: '../sprite.svg'
            }
        }
    }))
    .pipe(gulp.dest('src/assets/images'));
}

function towebp () {
    return gulp.src('src/assets/images/content/divider/*.jpg', {encoding: 'binary'})
    .pipe(webp())
    .pipe(gulp.dest('src/assets/images/content/divider/webp/', {encoding: 'binary'}));
}
export { svg, towebp };

export default gulp.series(clean, gulp.parallel(html, styles, scripts, copy, towebp), gulp.parallel(server, watch))

export let build = gulp.series(clean, html, styles, scripts, copy, towebp);
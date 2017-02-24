var gulp = require('gulp');
var cssmin = require('gulp-clean-css');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var rev = require('gulp-rev-append'); //添加版本号
var browserSync = require('browser-sync');


//压缩html
gulp.task('htmlmin', function () {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    gulp.src('src/views/*.html')
        .pipe(rev()) //压缩之前先添加版本号
        .pipe(useref())
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/views/'));
});

//压缩image
gulp.task('imagemin', function () {
    gulp.src('src/public/images/*')
        //.pipe(imagemin())
        .pipe(gulp.dest('dist/public/images'));
});

//检查脚本是否有错
gulp.task('jshint', function () {
    gulp.src(['src/public/js/a.js', 'src/public/js/b.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//合并、压缩css
gulp.task('cssmin', function () {
    gulp.src(['src/public/css/a.css', 'src/public/css/b.css'])
        .pipe(concat('ab.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('dist/public/css'));
    gulp.src(['src/public/css/a.css', 'src/public/css/c.css'])
        .pipe(concat('ac.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('dist/public/css'));
});

//合并、压缩js
gulp.task('minifyjs', function () {
    //拷贝库文件
    gulp.src(['src/public/js/lib/jquery-3.1.1.min.js'])
        .pipe(gulp.dest('dist/public/js/lib'));

    //压缩自己写的js
    gulp.src(['src/public/js/a.js', 'src/public/js/b.js'])
        .pipe(concat('ab.min.js'))    
        .pipe(uglify())
        .pipe(gulp.dest('dist/public/js'));

    gulp.src(['src/public/js/a.js', 'src/public/js/c.js'])
        .pipe(concat('ac.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/public/js'));
});


//监听
gulp.task('watch', function () {
    gulp.watch('src/views/*.html', ['htmlmin']);
    gulp.watch('src/public/css/*.css', ['cssmin']);
    gulp.watch('src/public/js/*.js', ['jshint', 'minifyjs']);
});


gulp.task('default', ['jshint', 'minifyjs', 'htmlmin', 'cssmin', 'imagemin', 'watch'], function () {
    browserSync({
        files: [
            "dist/public/css/*.css",
            "dist/public/js/*.js",
            "dist/public/images/**",
            "dist/views/*.html"
        ],
        server: {
            baseDir: "./"
        }
    })
});
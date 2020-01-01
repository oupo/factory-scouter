const gulp = require('gulp');
const tsPipeline = require('gulp-webpack-typescript-pipeline');

tsPipeline.registerBuildGulpTasks(
  gulp,
  {
    entryPoints: {
      'main': __dirname + '/ts/main.ts'
    },
    outputDir: __dirname + '/bundles',
    tsConfigFile: __dirname + '/tsconfig.json',
    tsLintFile: __dirname + '/tslint.json',
  }
);

gulp.task('default', gulp.parallel('tsPipeline:watch'));
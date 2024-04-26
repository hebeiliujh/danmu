import ejs from 'rollup-plugin-ejs'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import image from '@rollup/plugin-image'
// import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
// 引入配置别名的插件
import alias from '@rollup/plugin-alias'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import pkg from './package.json' assert { type: 'json' }

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default (plugins) => ({
  input: 'src/index.js',
  output: [
    {
      name: 'Danmu',
      file: `example/${pkg.name}-min.js`,
      format: 'umd'
    }
  ],
  plugins: [
    commonjs(),
    nodeResolve({
      browser: true
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      extensions: [...DEFAULT_EXTENSIONS, '.js']
    }),
    // 配置别名的插件
    alias({
      entries: [
        {
          find: '@',
          replacement: resolve(__dirname, './src')
        }
      ]
    }),
    image(),
    json(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    ejs({
      include: ['src/**/*.ejs', 'src/**/*.html'], // optional, '**/*.ejs' by default
      exclude: ['**/index.html'], // optional, undefined by default
      compilerOptions: { client: true } // optional, any options supported by ejs compiler
      // render: {
      //   //optional, if passed, html string will be returned instead of template render function
      //   data: {}, //required, data to be rendered to html
      //   minifierOptions: {} //optional, [html-minifier](https://github.com/kangax/html-minifier) options, won't minify by default, if not passed
      // }
    }),
    ...plugins
  ]
})

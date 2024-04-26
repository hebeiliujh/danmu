import { uglify } from 'rollup-plugin-uglify'
import copy from 'rollup-plugin-copy'
import scss from 'rollup-plugin-scss'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import template from 'rollup-plugin-generate-html-template'
import { terser } from 'rollup-plugin-terser'
import clear from 'rollup-plugin-clear'
import cssnano from 'cssnano'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import defaultConfig from '../rollup.config.mjs'
import pkg from '../package.json' assert { type: 'json' }

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const timeStamp = Date.now()

const config = defaultConfig([
  uglify(),
  scss({
    processor: () => postcss([autoprefixer(), cssnano()].filter(Boolean)),
    fileName: `${pkg.name}-min.css`,
    // fileName: `${pkg.name}-min.${timeStamp}.css`,
    sourceMap: false
  }),
  template({
    template: resolve(__dirname, '../src/index.html'),
    target: resolve(__dirname, '../dist/index.html'),
    replaceVars: {
      __CSS_URL: `${pkg.name}-min.css`,
      // __CSS_URL: `${pkg.name}-min.${timeStamp}.css`,
      __BUILD_VERSION: `弹幕SDK--${pkg.version}--${timeStamp}`
    }
  }),
  copy({
    targets: [
      {
        src: resolve(__dirname, '../example/assets'),
        dest: resolve(__dirname, '../dist')
      },
      {
        src: resolve(__dirname, '../README.md'),
        dest: resolve(__dirname, '../dist')
      }
    ]
  }),
  clear({
    targets: [resolve(__dirname, '../dist')]
  }),
  terser({
    compress: {
      drop_console: true,
      drop_debugger: true
    }
  })
])

config.output = [
  {
    file: resolve(__dirname, `../dist/${pkg.name}-min.js`),
    // file: resolve(__dirname, `../dist/${pkg.name}-min.${timeStamp}.js`),
    format: 'umd',
    name: 'Danmu',
    sourcemap: false
  }
]

export default config

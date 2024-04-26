import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import copy from 'rollup-plugin-copy'
import scss from 'rollup-plugin-scss'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import defaultConfig from '../rollup.config.mjs'
import pkg from '../package.json' assert { type: 'json' }

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defaultConfig([
  livereload({
    watch: resolve(__dirname, '../example')
  }),
  serve({
    open: true,
    contentBase: resolve(__dirname, '../example'),
    port: 8080,
    historyApiFallback: true
  }),
  scss({
    processor: () => postcss([autoprefixer()]),
    fileName: `${pkg.name}-min.css`, // resolve(__dirname, `../example/${pkg.name}-min.css`),
    sourceMap: false
  }),
  copy({
    targets: [
      {
        src: resolve(__dirname, '../src/assets/fonts/**/*'),
        dest: resolve(__dirname, '../example/assets/fonts/')
      }
    ]
  })
])

import babel from '@rollup/plugin-babel'
import filesize from 'rollup-plugin-filesize'

import packageJson from './package.json' assert { type: 'json' }

const babelOpts = {
  babelrc: false,
  presets: [['@babel/preset-env', { loose: true }]],
  plugins: [['@babel/plugin-transform-for-of', { assumeArray: true }]]
}
const sizeOpts = { format: { round: 3 } }

export default {
  input: './src/flash.js',
  output: [
    { file: packageJson.main, format: 'cjs' },
    { file: packageJson.module, format: 'es' }
  ],
  plugins: [babel(babelOpts), filesize(sizeOpts)]
}

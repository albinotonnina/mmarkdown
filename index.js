#!/usr/bin/env node

const mmarkdown = require('./src/mmarkdown')

const argv = require('yargs')
  .default('backup', true)
  .default('backupPath', './src.readme/backup/')
  .default('scripts', './src.readme/Readme.js')
  .default('src', './src.readme/Readme.md')
  .default('out', './Readme.md').argv

const app = async options => {
  try {
    await mmarkdown(options)
    console.log('Success!')
  } catch (err) {
    throw 'could not really make it, caaause: ' + err
  }
}

app(argv)

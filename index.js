#!/usr/bin/env node

const mmarkdown = require('./src/mmarkdown')

const argv = require('yargs')
  .pkgConf('mmarkdown')
  .default('src', './ReadmeSrc/Readme.md')
  .default('out', './Readme.md')
  .default('backup', false)
  .default('backupPath', './ReadmeSrc/backup/')
  .default('scripts', null).argv

const app = async options => {
  try {
    await mmarkdown(options)
    console.log('Success!')
  } catch (err) {
    throw 'could not really make it, caaause: ' + err
  }
}

app(argv)

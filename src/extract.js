'use strict'
const path = require('path')

const CWD = process.cwd()

const fencedBlockRegex = /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/gm

const idRegex = /(__FENCED\d+__)/g

const createBlock = function(o) {
  return '```' + o.lang + '\n' + o.code + '\n```\n'
}

const id = i => '__FENCED' + i + '__'

const codeBlocks = function(str) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string')
  }

  let blocks = []
  let match = null

  while ((match = fencedBlockRegex.exec(str))) {
    blocks.push({
      start: match.index,
      end: match.index + match[1].length,
      lang: match[2] || '',
      code: match[3],
      block: match.input
    })
  }
  return blocks
}

const stripBlocks = function(str) {
  const arr = str.match(fencedBlockRegex) || []
  return arr.reduce((acc, match, i) => acc.replace(match, id(i)), str)
}

const parseBlocks = str => {
  const text = stripBlocks(str)
  const blocks = codeBlocks(str)
  const markers = text.match(idRegex) || []

  return {text, blocks, markers}
}

const injectBlocks = async (str, o, jsFile) => {
  const fenceBlocks = str.match(idRegex) || []
  const scriptsFile = jsFile ? require(path.join(CWD, jsFile)) : {}
  const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor

  const reducer = async (acc, match, i) => {
    const block = o[i]
    const _acc = await acc

    const output =
      block.lang === 'mmd'
        ? (await new AsyncFunction('scripts', block.code)(scriptsFile)) + '\n'
        : createBlock(block)

    return Promise.resolve(_acc.replace(match, output + '\n'))
  }

  return await fenceBlocks.reduce(reducer, str)
}

module.exports = {
  parseBlocks,
  injectBlocks
}

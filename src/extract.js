'use strict'
const path = require('path')
const re = /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/gm
const codeBlocks = function(str) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string')
  }

  var blocks = []
  var match = null

  while ((match = re.exec(str))) {
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

const idRegex = /(__CODE_BLOCK\d+__)/g

module.exports.stripBlocks = function(str) {
  var arr = str.match(re) || []
  return arr.reduce(function(acc, match, i) {
    return acc.replace(match, exports.id(i))
  }, str)
}

module.exports.extractBlocks = function(str) {
  return codeBlocks(str)
}

module.exports.parseBlocks = function(str) {
  var o = {}
  o.text = exports.stripBlocks(str)
  o.blocks = codeBlocks(str)
  o.markers = o.text.match(idRegex) || []

  return o
}

module.exports.injectBlocks = async function(str, o, jsFile) {
  var arr = str.match(idRegex) || []

  const sss = async (acc, match, i) => {
    const block = o[i]

    if (block.lang === 'mmd') {
      const _acc = await acc

      const scriptsFile = require(path.join('../', jsFile))

      var AsyncFunction = Object.getPrototypeOf(async function() {}).constructor

      const final = await new AsyncFunction('scripts', block.code)(scriptsFile)

      return Promise.resolve(_acc.replace(match, final + '\n'))
    } else {
      const _acc = await acc
      return Promise.resolve(
        _acc.replace(match, exports.createBlock(block) + '\n')
      )
    }
  }

  // return arr.reduce(async (previousPromise, pr) => {
  //   const collection = await previousPromise
  //   const allCommits = await getAllCommitsForaPR(pr.number)

  //   const isNotSemverPatchPR = checkCommitMessageForPatch(allCommits[0])

  //   if (isNotSemverPatchPR) {
  //     collection.push(pr)
  //   }

  //   return collection
  // }, Promise.resolve([]))

  return await arr.reduce(sss, str)
}

module.exports.createBlock = function(o) {
  return '```' + o.lang + '\n' + o.code + '\n```\n'
}

module.exports.id = function(i) {
  return '__CODE_BLOCK' + i + '__'
}

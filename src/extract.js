/*!
 * extract-gfm <https://github.com/jonschlinkert/extract-gfm>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

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

/**
 * Strip code blocks from a string and replaced them with
 * heuristic markers.
 *
 * @param  {String} `str` Original string with gfm code blocks.
 * @return {String}
 * @api public
 */

module.exports.stripBlocks = function(str) {
  var arr = str.match(re) || []
  return arr.reduce(function(acc, match, i) {
    return acc.replace(match, exports.id(i))
  }, str)
}

/**
 * Return an array of all **gfm code blocks** found.
 * See [gfm-code-blocks] for more detail.
 *
 * @param  {String} `str` The string to parse.
 * @return {Array}
 * @api public
 */

module.exports.extractBlocks = function(str) {
  return codeBlocks(str)
}

/**
 * Convenience method to make it easy to replace code blocks.
 *
 * Returns an object with:
 *
 *    - `text`: the string stripped of code blocks, where each block
 *      is replaced with a heuristic marker.
 *    - `blocks`: An array of code blocks, using the [.extractBlocks()](#extractBlocks) method.
 *    - `markers`: An array of heuristic markers to be used for adding code blocks back.
 *
 * **Example**
 *
 * ```js
 * var code = require('extract-gfm');
 * var fs = require('fs');
 * var str = fs.readFileSync('README.md', 'utf8');
 * console.log(code.parseBlocks(str));
 * ```
 *
 * @param  {String} `str` The string to parse.
 * @return {Object}
 * @api public
 */

module.exports.parseBlocks = function(str) {
  var o = {}
  o.text = exports.stripBlocks(str)
  o.blocks = codeBlocks(str)
  o.markers = o.text.match(idRegex) || []

  return o
}

/**
 * Used for adding code blocks back into the string after they
 * have been modified somehow.
 *
 * To customize how this is done, just look at the `injectBlocks`
 * method and create your own based on this. [.parseBlocks()](#parseBlocks)
 * really does all of the hard work.
 *
 * @param  {String} `str` A string with heuristic markers to replace.
 * @param  {String} `object` Object created by [.parseBlocks()](#parseBlocks)
 * @return {String} Updated string, with shiny new code blocks.
 * @api public
 */

module.exports.injectBlocks = function(str, o, jsFile) {
  var arr = str.match(idRegex) || []
  return arr.reduce(function(acc, match, i) {
    const block = o[i]

    return acc.replace(
      match,
      block.lang === 'mmd'
        ? new Function('js', block.code)(require(path.join('../', jsFile))) +
          '\n\n'
        : exports.createBlock(block)
    )
  }, str)
}

/**
 * Generate an id based on the index of each code block.
 * This is used as a heuristic for re-adding extracted
 * code blocks.
 *
 * @param  {Number} `i` Match index of the code block being replaced.
 * @return {String} Heuristic string.
 * @api private
 */

module.exports.createBlock = function(o) {
  return '```' + o.lang + '\n' + o.code + '\n```\n'
}

/**
 * Generate an id based on the index of each code block.
 * This is used as a heuristic for re-adding extracted
 * code blocks.
 *
 * @param  {Number} `i` Match index of the code block being replaced.
 * @return {String} Heuristic string.
 * @api private
 */

module.exports.id = function(i) {
  return '__CODE_BLOCK' + i + '__'
}

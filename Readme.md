<p align="center"><img src="https://img.ziggi.org/BY9iI48Q.png" /></p>

# mmarkdown

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/05044458973941749858f50e71effe25)](https://app.codacy.com/app/albinotonnina/mmarkdown?utm_source=github.com&utm_medium=referral&utm_content=albinotonnina/mmarkdown&utm_campaign=badger)

> Markdown on caffeine ☕️

Interpret `mmd` fenced code blocks in a markdown file and generate a cooler version of it.

### `mmd` fenced code block

<img src="https://img.ziggi.org/gmo0SjMD.png" />

### output:

#### Hello Jessie

## Table of Contents

* [Demo](#demo--boilerplate--real-world-case)
* [Install](#install)
* [Usage](#usage)
* [Maintainers](#maintainers)
* [Contribute](#contribute)
* [License](#license)

## Demo / Boilerplate / Real world case

The file you are reading right now is generated from [this file](./ReadmeSrc/Readme.md).

For a kind of boilerplate repo instead, have a look at [this repo](https://github.com/albinotonnina/mmarkdown-demo).

🌎[MicheleBertoli/css-in-js](https://github.com/MicheleBertoli/css-in-js)

🌎[streamich/cross-ci](https://github.com/streamich/cross-ci)

## Install

```
yarn add mmarkdown --dev
```

### Config package.json (defaults)

```
{
    "mmarkdown": {
      "src": "./Readme/Readme.md",
      "out": "./Readme.md",
      "scripts": "./Readme/Readme.js",
      "backup": "true",
      "backupPath": "./Readme/backup/"
    }
}
```

```
{
  "scripts":{
    "make-readme": "markdown"
  }
}
```

### Command line arguments

| argument   | description                    | default               |
| ---------- | ------------------------------ | --------------------- |
| src        | Source md file                 | ./ReadmeSrc/Readme.md |
| out        | Output md file                 | ./Readme.md           |
| scripts    | Helper JS file                 | ./ReadmeSrc/Readme.js |
| backup     | Do a backup of the output file | false                 |
| backupPath | backup path                    | ./ReadmeSrc/backup/   |
| help       | Show help                      |                       |
| version    | Show version number            |                       |

```
{
  "scripts":{
    "make-readme": "markdown --backup --backupPath ./backupReadme/"
  }
}
```

## Usage

Mmarkdown takes a plain markdown file and generates a copy of it.

It starts to be less boring when you add [fenced code blocks](https://help.github.com/articles/creating-and-highlighting-code-blocks/) with the language identifier set to `mmd`.

Everything that is returned (as a string) from the code in a block will be interpreted and replaced to the block in the output file.

It's full async, which is cool, _lots of `awaits` are waiting for you_ there but soon enough you will face a problem: too much code to write in a markdown file! Terrible experience!

The solution in mmarkdown is in the `scripts` option. The module that the scripts file returns will be passed to the context of the fenced block, see [example 3](#example3).

The `backup` option, false by default, will make a copy of the current output file, postfix it with a timestamp and move it into `backupPath`.

### Example 1

#### `mmd` fenced code block:

```javascript
const hello = message => {
  return message
}

return hello('### hippieeeeee hippie yeeeee!!!!!!!!')
```

#### output:

### hippieeeeee hippie yeeeee!!!!!!!!

### Example 2

#### `mmd` fenced code block:

```javascript
const array = [1, 3, 5]

return array.map(item => '#### ' + item).join('\n\n')
```

#### output:

#### 1

#### 3

#### 5

### Example 3, with Scripts

[this script file ](./ReadmeSrc/Readme.js) is passed to mmarkdown with the `scripts` option:

```javascript
module.exports = {
  processMyArray: async array =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(
          array.map(item => ({
            name: item + ' async'
          }))
        )
      }, 1000)
    })
}
```

#### mmd fenced code block:

```javascript
//scripts is passed

const array = [1, 3, 5]

const something = await scripts.processMyArray(array)

const myFinalString = something.map(item => '#### ' + item.name)
  .join('\n\n')

return myFinalString
```

#### output:

#### 1 async

#### 3 async

#### 5 async

(The setTimeout is there just for demo purposes)



## Maintainers

[@albinotonnina](https://github.com/albinotonnina)

## Contribute

PRs accepted.

## License

MIT © 2018 Albino Tonnina

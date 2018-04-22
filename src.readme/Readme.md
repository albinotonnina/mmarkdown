# MMarkdown (WIP)

They say it's hard to write a good Readme.

Well this app is all about the Readme (or any other md file) 🎉

The file you are reading is generated from [this other file](./src.readme/Readme.md)

(and it dows backuos too :D)

# Install

`yarn add mmarkdown --dev`

`yarn global add mmarkdown`

# Use

Add the following section to your package.json:

```
{
  "scripts": {
    "make-readme": "mmarkdown"
  }
}
```

## Running from command line

```
mmarkdown --src ./src.readme/Readme.md --out ./Readme.md --backup true --scripts ./src.readme/Readme.js
```

# Example 1

```javascript
const hello = message => {
  return message
}

return hello('### hippieeeeee hippie yeeeee!!!!!!!!')
```

### output:

```mmd
const hello = message => {
  return message
}

return hello('### hippieeeeee hippie yeeeee!!!!!!!!')
```

# Example 2

Whatever module you pass as `scripts` is passed in the mmd fence block.

Eg. here [js.processMyArray](./src.readme/Readme.js)

```javascript
const array = [1, 3, 5]

const something = await scripts.processMyArray(array)

const myFinalString = something.map(item => '### ' + item.name)
  .join('\n')

return myFinalString
```

### output:

```mmd
const array = [1, 3, 5]

const something = await scripts.processMyArray(array)

const myFinalString = something.map(item => '### ' + item.name)
  .join('\n')

return myFinalString
```

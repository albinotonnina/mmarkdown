module.exports = {
  foo: 'bar',
  processMyArray: array =>
    array.map(item => ({
      name: item
    }))
}

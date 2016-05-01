var jsonfile = require('jsonfile')

var file = 'tmp/data.json'
var obj = {name: 'JP'}

jsonfile.writeFile(file, obj, {spaces: 2}, function(err) {
      console.error(err)
})

const Scanner = require('./scanner')
const scanner = new Scanner()

scanner.on('char', (char) => {
  process.stdout.write(char)
})

scanner.on('error', (error) => console.error(error))

const debug = require('debug')('hid')
const HID = require('node-hid')
const { EventEmitter } = require('events')
const { KEYMAP, SIGNAL } = require('./keymap')

class Scanner extends EventEmitter {
  constructor (product) {
    super()

    const devices = this.constructor.devices()
    debug(devices)

    const device = devices.find((device) => device.product === product)

    if (!device) {
      throw new Error('Cannot find device')
    }

    const hid = new HID.HID(devices[0].path)

    hid.on('data', (data) => {
      try {
        const code = Buffer.from([data[2]]).toString('hex')
        const signal = Buffer.from([data[0]]).toString('hex')
        const char = KEYMAP[code][SIGNAL[signal]]
        debug('HID Data:', data, code, signal, char)
        if (!char) {
          return
        }
        this.emit('char', char)
      } catch (error) {
        error.data = data
        debug('HID Data parse failed:', error)
        this.emit('error', error)
      }
    })
  }

  static devices () {
    return HID.devices()
  }
}

module.exports = Scanner
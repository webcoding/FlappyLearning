
// import Neuron from './Neuron'

export default class Pipe {

  constructor(json) {
    this.x = 0
    this.y = 0
    this.width = 50
    this.height = 40
    this.speed = 3

    this.init(json)
  }

  init(json) {
    for (var i in json) {
      this[i] = json[i]
    }
  }

  update() {
    this.x -= this.speed
  }

  isOut() {
    if (this.x + this.width < 0) {
      return true
    }
  }
}

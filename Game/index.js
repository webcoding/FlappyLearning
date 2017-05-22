

// new Game ({
//   $domCanvas: document.querySelector('#flappy')
// })
import Neuroevolution from '../Neuroevolution'
import Bird from './Bird'
import Pipe from './Pipe'

var Neuvol = new Neuroevolution({
  population: 50,
  network: [2, [2], 1],
})

var FPS = 60
var maxScore = 0

var images = {}

var speed = function (fps) {
  FPS = parseInt(fps)
}

export default class Game {
  constructor(options) {
    this.pipes = []
    this.birds = []
    this.score = 0
    this.canvas = options.$domCanvas
    this.ctx = this.canvas.getContext('2d')
    this.width = this.canvas.width    // 500
    this.height = this.canvas.height  // 512
    this.spawnInterval = 90     // 生成管道数间隔
    this.interval = 0
    this.gen = []
    this.alives = 0
    this.generation = 0         // 世代
    this.backgroundSpeed = 0.5  // 背景移动速度（定值）
    this.backgroundx = 0
    this.maxScore = 0
  }

  start() {
    this.interval = 0
    this.score = 0
    this.pipes = []
    this.birds = []

    this.gen = Neuvol.nextGeneration()
    for (var i in this.gen) {
      var b = new Bird()
      this.birds.push(b)
    }
    this.generation++
    this.alives = this.birds.length
  }

  update() {
    this.backgroundx += this.backgroundSpeed
    var nextHoll = 0
    if (this.birds.length > 0) {
      for (let i = 0; i < this.pipes.length; i += 2) {
        if (this.pipes[i].x + this.pipes[i].width > this.birds[0].x) {
          // 过关
          nextHoll = this.pipes[i].height / this.height
          break
        }
      }
    }

    for (const i in this.birds) {
      if (this.birds[i].alive) {
        var inputs = [
          this.birds[i].y / this.height,
          nextHoll,
        ]

        var res = this.gen[i].compute(inputs)
        if (res > 0.5) {
          this.birds[i].flap()
        }

        this.birds[i].update()
        if (this.birds[i].isDead(this.height, this.pipes)) {
          this.birds[i].alive = false
          this.alives--
          // console.log(this.alives);
          Neuvol.networkScore(this.gen[i], this.score)
          if (this.isItEnd()) {
            this.start()
          }
        }
      }
    }

    for (let i = 0; i < this.pipes.length; i++) {
      this.pipes[i].update()
      if (this.pipes[i].isOut()) {
        this.pipes.splice(i, 1)
        i--
      }
    }

    if (this.interval === 0) {
      var deltaBord = 50  // 管道固定口（上下管道与边界链接处）
      var pipeHoll = 120  // 管道缺口高度（小鸟通道）
      // 随机生成管道缺口位置(四舍五入)左下角为基准
      var hollPosition = Math.round(Math.random() * (this.height - deltaBord * 2 - pipeHoll)) + deltaBord
      // 上下管道
      this.pipes.push(new Pipe({ x: this.width, y: 0, height: hollPosition }))
      this.pipes.push(new Pipe({ x: this.width, y: hollPosition + pipeHoll, height: this.height }))
    }

    this.interval++
    if (this.interval === this.spawnInterval) {
      this.interval = 0
    }

    this.score++
    this.maxScore = (this.score > this.maxScore) ? this.score : this.maxScore
    var self = this

    if (FPS === 0) {
      /* global setZeroTimeout */
      setZeroTimeout(function () {
        self.update()
      })
    } else {
      setTimeout(function () {
        self.update()
      }, 1000 / FPS)
    }
  }


  isItEnd() {
    for (var i in this.birds) {
      if (this.birds[i].alive) {
        return false
      }
    }
    return true
  }

  display() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    for (let i = 0; i < Math.ceil(this.width / images.background.width) + 1; i++) {
      this.ctx.drawImage(images.background, i * images.background.width - Math.floor(this.backgroundx % images.background.width), 0)
    }

    for (const i in this.pipes) {
      if (i % 2 === 0) {
        this.ctx.drawImage(images.pipetop, this.pipes[i].x, this.pipes[i].y + this.pipes[i].height - images.pipetop.height, this.pipes[i].width, images.pipetop.height)
      } else {
        this.ctx.drawImage(images.pipebottom, this.pipes[i].x, this.pipes[i].y, this.pipes[i].width, images.pipetop.height)
      }
    }

    this.ctx.fillStyle = '#FFC600'
    this.ctx.strokeStyle = '#CE9E00'
    for (var i in this.birds) {
      if (this.birds[i].alive) {
        this.ctx.save()
        this.ctx.translate(this.birds[i].x + this.birds[i].width / 2, this.birds[i].y + this.birds[i].height / 2)
        this.ctx.rotate(Math.PI / 2 * this.birds[i].gravity / 20)
        this.ctx.drawImage(images.bird, -this.birds[i].width / 2, -this.birds[i].height / 2, this.birds[i].width, this.birds[i].height)
        this.ctx.restore()
      }
    }

    this.ctx.fillStyle = 'white'
    this.ctx.font = '20px Oswald, sans-serif'
    this.ctx.fillText('Score : ' + this.score, 10, 25)
    this.ctx.fillText('Max Score : ' + this.maxScore, 10, 50)
    this.ctx.fillText('Generation : ' + this.generation, 10, 75)
    this.ctx.fillText('Alive : ' + this.alives + ' / ' + Neuvol.options.population, 10, 100)

    var self = this
    /* global requestAnimationFrame */
    requestAnimationFrame(function () {
      self.display()
    })
  }
}

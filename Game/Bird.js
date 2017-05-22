
// import Neuron from './Neuron'

export default class Bird {

  // 构造初始化小鸟位置
  constructor(json) {
    this.x = 80
    this.y = 250
    this.width = 40
    this.height = 30

    this.alive = true
    this.gravity = 0        // 重力加速度/引力场
    this.velocity = 0.3     // 速度
    this.jump = -6          // jump

    this.init(json)
  }

  init(json) {
    for (var i in json) {
      this[i] = json[i]
    }
  }

  // 振翅飞一下
  flap() {
    this.gravity = this.jump
  }

  update() {
    this.gravity += this.velocity
    this.y += this.gravity
  }

  isDead(height, pipes) {
    // 小鸟以左上角为 (x, y) 坐标
    // 超出上边界 超出下边界
    if (this.y >= height || this.y + this.height <= 0) {
      return true
    }
    // 相对于管道位置，除以下情况全为死
    for (var i in pipes) {
      if (!(
        this.x > pipes[i].x + pipes[i].width ||     // 在管道右侧
        this.x + this.width < pipes[i].x ||         // 在管道左侧
        this.y > pipes[i].y + pipes[i].height ||    // 在管道上面
        this.y + this.height < pipes[i].y           // 在管道下面
        )) {
        return true
      }
    }
  }
}

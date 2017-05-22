

// 随机数
// parseInt 舍去
// Math.round() 四舍五入
var random = function randomBy(under, over, type = '[]') {
  switch (arguments.length) {
    case 1: return parseInt(Math.random() * under + 1)
    case 2: return parseInt(Math.random() * (over - under + 1) + under)
    default: return 0
  }
}

export default {
  random,
}

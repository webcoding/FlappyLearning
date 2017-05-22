import Game from './Game/'

(function () {
  var timeouts = []
  var messageName = 'zero-timeout-message'

  function setZeroTimeout(fn) {
    timeouts.push(fn)
    window.postMessage(messageName, '*')
  }

  function handleMessage(event) {
    if (event.source === window && event.data === messageName) {
      event.stopPropagation()
      if (timeouts.length > 0) {
        var fn = timeouts.shift()
        fn()
      }
    }
  }

  window.addEventListener('message', handleMessage, true)

  window.setZeroTimeout = setZeroTimeout
})()

// var Neuvol
var game
var FPS = 60
var maxScore = 0

var images = {}

var speed = function (fps) {
  FPS = parseInt(fps)
}

var loadImages = function (sources, callback) {
  var nb = 0
  var loaded = 0
  var imgs = {}
  for (var i in sources) {
    nb++
    /* global Image */
    imgs[i] = new Image()
    imgs[i].src = sources[i]
    imgs[i].onload = function () {
      loaded++
      if (loaded === nb) {
        callback(imgs)
      }
    }
  }
}


window.onload = function () {
  var sprites = {
    bird: './img/bird.png',
    background: './img/background.png',
    pipetop: './img/pipetop.png',
    pipebottom: './img/pipebottom.png',
  }

  var start = function () {
    game = new Game()
    game.start()
    game.update()
    game.display()
  }


  loadImages(sprites, function (imgs) {
    images = imgs
    start()
  })
}

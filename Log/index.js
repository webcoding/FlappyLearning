
var that = window

var logger = {
  MUTE: 0,
  FATA: 1,
  ERROR: 2,
  WARN: 3,
  INFO: 4,
  DEBUG: 5,
  TRACE: 6,
  level: 0,
}

function log(type, args) {
  var header = '[PR][' + type + ']'
  var msg = header
  for (var i = 0; i < args.length; i++) {
    if (typeof args[i] === 'string') {
      msg += ' ' + args[i]
    } else {
      msg += ' ' + that.stringifyJSON(args[i])
    }
  }
  if (that.detectIEVersion()) {
    // http://stackoverflow.com/questions/5538972/console-log-apply-not-working-in-ie9
    // var log = Function.prototype.bind.call(console.log, console);
    // log.apply(console, args);
    console.log(msg)
  } else {
    args.unshift(header)
    console.log.apply(console, args)
  }
  if (document.getElementById('PR-log')) {
    document.getElementById('PR-log').innerHTML += '<p>' + msg + '</p>'
  }
}

function makeLogFunc(code) {
  var func = code.toLowerCase()
  logger[func] = function () {
    // logger[func].history = logger[func].history || [];
    // logger[func].history.push(arguments);
    if (window.console && window.console.log && logger.level >= logger[code]) {
      var args = Array.prototype.slice.call(arguments)
      log(func, args)
    }
  }
}

for (var property in logger) {
  if (logger.hasOwnProperty(property) && (typeof logger[property]) === 'number' && !logger.hasOwnProperty(property.toLowerCase())) {
    makeLogFunc(property)
  }
}


// logger.debug("name: ", value);
// logger.error("name: ", value);

export default logger

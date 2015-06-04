/*!
  * R2 - a CSS LTR ∞ RTL converter
  * Copyright Dustin Diaz 2012
  * https://github.com/ded/r2
  * License MIT
  */

var fs = require('fs')
  , css = require('css');

function quad(v, m) {
  // 1px 2px 3px 4px => 1px 4px 3px 2px
  if ((m = v.trim().split(/\s+/)) && m.length == 4) {
    return [m[0], m[3], m[2], m[1]].join(' ')
  }
  return v
}

function quad_radius(v) {
  var m = v.trim().split(/\s+/)
  // 1px 2px 3px 4px => 1px 2px 4px 3px
  // since border-radius: top-left top-right bottom-right bottom-left
  // will be border-radius: top-right top-left bottom-left bottom-right
  if (m && m.length == 4) {
    return [m[1], m[0], m[3], m[2]].join(' ')
  } else if (m && m.length == 3) {
    // super odd how this works
    // 5px 10px 20px => 10px 5px 10px 20px
    // yeah it's pretty dumb
    return [m[1], m[0], m[1], m[2]].join(' ')
  }
  return v
}

function direction(v) {
  return v.match(/ltr/) ? 'rtl' : v.match(/rtl/) ? 'ltr' : v
}

function rtltr(v) {
  if (v.match(/left/)) return 'right'
  if (v.match(/right/)) return 'left'
  return v
}

function bgPosition(values) {
  return values.split(/\s*,\s*/g).map(function (v) {
    if (v.match(/\bleft\b/)) {
      v = v.replace(/\bleft\b/, 'right')
    } else if (v.match(/\bright\b/)) {
      v = v.replace(/\bright\b/, 'left')
    }

    var m = v.trim().split(/\s+/)
    if (m && (m.length == 1) && v.match(/(\d+)([a-z]{2}|%)/)) {
      v = 'right ' + v
    }

    if (m && m.length == 2 && m[0].match(/\d+%/)) {
      // 30% => 70% (100 - x)
      v = (100 - parseInt(m[0], 10)) + '% ' + m[1]
    }

    return v
  }).join(', ')
}

var propertyMap = {
    'margin-left': 'margin-right'
  , 'margin-right': 'margin-left'

  , 'padding-left': 'padding-right'
  , 'padding-right': 'padding-left'

  , 'border-left': 'border-right'
  , 'border-right': 'border-left'

  , 'border-left-color': 'border-right-color'
  , 'border-right-color': 'border-left-color'

  , 'border-left-width': 'border-right-width'
  , 'border-right-width': 'border-left-width'

  , 'border-radius-bottomleft': 'border-radius-bottomright'
  , 'border-radius-bottomright': 'border-radius-bottomleft'
  , 'border-bottom-right-radius': 'border-bottom-left-radius'
  , 'border-bottom-left-radius': 'border-bottom-right-radius'
  , '-webkit-border-bottom-right-radius': '-webkit-border-bottom-left-radius'
  , '-webkit-border-bottom-left-radius': '-webkit-border-bottom-right-radius'
  , '-moz-border-radius-bottomright': '-moz-border-radius-bottomleft'
  , '-moz-border-radius-bottomleft': '-moz-border-radius-bottomright'

  , 'border-radius-topleft': 'border-radius-topright'
  , 'border-radius-topright': 'border-radius-topleft'
  , 'border-top-right-radius': 'border-top-left-radius'
  , 'border-top-left-radius': 'border-top-right-radius'
  , '-webkit-border-top-right-radius': '-webkit-border-top-left-radius'
  , '-webkit-border-top-left-radius': '-webkit-border-top-right-radius'
  , '-moz-border-radius-topright': '-moz-border-radius-topleft'
  , '-moz-border-radius-topleft': '-moz-border-radius-topright'

  , 'left': 'right'
  , 'right': 'left'
}

var valueMap = {
  'padding': quad,
  'margin': quad,
  'text-align': rtltr,
  'float': rtltr,
  'clear': rtltr,
  'direction': direction,
  '-webkit-border-radius': quad_radius,
  '-moz-border-radius': quad_radius,
  'border-radius': quad_radius,
  'border-color': quad,
  'border-width': quad,
  'border-style': quad,
  'background-position': bgPosition
}

function processRule(rule, idx, list) {
  var prev = list[idx-1]
  if (prev && prev.type === 'comment' && prev.comment.trim() === '@noflip')
    return;

  if (rule.declarations)
    rule.declarations.forEach(processDeclaration)
  else if (rule.rules)
    rule.rules.forEach(processRule)
}

function processDeclaration(declaration) {
  // Ignore comments in declarations
  if (declaration.type !== 'declaration')
    return

  var prop = declaration.property
    , val = declaration.value
    , important = /!important/
    , isImportant = val.match(important)
    , asterisk = prop.match(/^(\*+)(.+)/, '')

  if (asterisk) {
    prop = asterisk[2]
    asterisk = asterisk[1]
  } else {
    asterisk = ''
  }
  prop = propertyMap[prop] || prop
  val = valueMap[prop] ? valueMap[prop](val) : val

  if (!val.match(important) && isImportant) val += '!important'

  declaration.property = asterisk + prop;
  declaration.value = val;
}

function r2(cssString, options) {
  var ast
  if (!options)
    options = { compress: true }

  ast = css.parse(cssString)
  ast.stylesheet.rules.forEach(processRule)

  return css.stringify(ast, options)
}

module.exports.exec = function (args) {
  var out
    , read = args[0]
    , out = args[1]
    , options = { compress: args[2] !== '--no-compress' }
    , data

  /*
  /  If no read arg then read from stdin
  /  allows for standard piping and reading in
  /  ex: lessc file.less | r2 > file-rtl.css
  /  ex:  r2 < file.css
  */
  if (!read) {
    var buffer = ''
    process.stdin.resume()
    process.stdin.setEncoding('utf8')

    process.stdin.on('data', function(chunk) {
      buffer += chunk
    });

    process.stdin.on('end', function() {
      if (buffer) {
        console.log(r2(buffer, options))
      }
    });
  } else {
    /*
    /  If reading from a file then print to stdout or out arg
    /  To stdout: r2 styles.css
    /  To file: r2 styles.cc styles-rtl.css
    */
    data = fs.readFileSync(read, 'utf8')
    if (out) {
      console.log('Swapping ' + read + ' to ' + out + '...')
      fs.writeFileSync(out, r2(data, options), 'utf8')
    } else {
      console.log(r2(data, options))
    }
  }
}

module.exports.swap = function (cssString, options) {
  return r2(cssString, options)
}

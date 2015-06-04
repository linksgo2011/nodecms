// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

var test         = require("tape")
var asyncify     = require("simple-asyncify")
var common       = require("./common")
var u            = common.u
var read         = common.read
var Throws       = common.Throws
var identity     = common.identity

var sourceMapResolve = require("../")

// Polyfills.
require("setimmediate")
if (typeof window !== "undefined" && !window.atob) {
  window.atob = require("Base64").atob
}

"use strict"

var map = {
  simple: {
    mappings: "AAAA",
    sources:  ["foo.js"],
    names:    []
  },
  sourceRoot: {
    mappings:   "AAAA",
    sourceRoot: "/static/js/app/",
    sources:    ["foo.js", "lib/bar.js", "../vendor/dom.js", "/version.js", "//foo.org/baz.js"],
    names:      []
  },
  sourceRootNoSlash: {
    mappings:   "AAAA",
    sourceRoot: "/static/js/app",
    sources:    ["foo.js", "lib/bar.js", "../vendor/dom.js", "/version.js", "//foo.org/baz.js"],
    names:      []
  },
  sourcesContent: {
    mappings:       "AAAA",
    sourceRoot:     "/static/js/app/",
    sources:        ["foo.js", "lib/bar.js", "../vendor/dom.js", "/version.js", "//foo.org/baz.js"],
    sourcesContent: ["foo.js", "lib/bar.js", "../vendor/dom.js", "/version.js", "//foo.org/baz.js"],
    names:          []
  },
  mixed: {
    mappings:       "AAAA",
    sources:        ["foo.js", "lib/bar.js", "../vendor/dom.js", "/version.js", "//foo.org/baz.js"],
    sourcesContent: ["foo.js", null        , null              , "/version.js", "//foo.org/baz.js"],
    names:          []
  }
}
map.simpleString = JSON.stringify(map.simple)
map.XSSIsafe = ")]}'" + map.simpleString

var code = {
  fileRelative:       u("foo.js.map"),
  domainRelative:     u("/foo.js.map"),
  schemeRelative:     u("//foo.org/foo.js.map"),
  absolute:           u("https://foo.org/foo.js.map"),
  dataUri:            u("data:application/json," +
                        "%7B%22mappings%22%3A%22AAAA%22%2C%22sources%22%3A%5B%22" +
                        "foo.js%22%5D%2C%22names%22%3A%5B%5D%7D"),
  base64:             u("data:application/json;base64," +
                        "eyJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VzIjpbImZvby5qcyJdLCJuYW1lcyI6W119"),
  dataUriText:        u("data:text/json," +
                        "%7B%22mappings%22%3A%22AAAA%22%2C%22sources%22%3A%5B%22" +
                        "foo.js%22%5D%2C%22names%22%3A%5B%5D%7D"),
  dataUriParameter:   u("data:application/json;charset=UTF-8;foo=bar," +
                        "%7B%22mappings%22%3A%22AAAA%22%2C%22sources%22%3A%5B%22" +
                        "foo.js%22%5D%2C%22names%22%3A%5B%5D%7D"),
  dataUriNoMime:      u("data:,foo"),
  dataUriInvalidMime: u("data:text/html,foo"),
  dataUriInvalidJSON: u("data:application/json,foo"),
  dataUriXSSIsafe:    u("data:application/json," + ")%5D%7D%27" +
                        "%7B%22mappings%22%3A%22AAAA%22%2C%22sources%22%3A%5B%22" +
                        "foo.js%22%5D%2C%22names%22%3A%5B%5D%7D"),
  dataUriEmpty:       u("data:"),
  noMap:              ""
}

function throwsError(t, method, args, num, desc) {
  t["throws"](
    function() { method.apply(null, args) },
    RegExp("argument " + num + ".+" + desc + ".+\\n" + args[num-1])
  )
}


function testResolveSourceMap(method, sync) {
  return function(t) {
    var wrap = (sync ? identity : asyncify)

    var codeUrl = "http://example.com/a/b/c/foo.js"

    t.plan(1 + (sync ? 7 : 10) + 18*3)

    t.equal(typeof method, "function", "is a function")

    throwsError(t, method, [                   ], 1, "code")
    throwsError(t, method, [null               ], 1, "code")
    throwsError(t, method, ["foo"              ], 2, "code url")
    throwsError(t, method, ["foo", null        ], 2, "code url")
    throwsError(t, method, ["foo", "bar"       ], 3, "read")
    throwsError(t, method, ["foo", "bar", null ], 3, "read")
    throwsError(t, method, ["foo", "bar", "baz"], 3, "read")
    if (!sync) {
      throwsError(t, method, ["foo", "bar", read()       ], 4, "callback")
      throwsError(t, method, ["foo", "bar", read(), null ], 4, "callback")
      throwsError(t, method, ["foo", "bar", read(), "baz"], 4, "callback")
    }

    if (sync) {
      method = asyncify(method)
    }

    var next = false
    function isAsync() { t.ok(next, "is async") }

    method(code.fileRelative, codeUrl, wrap(read(map.simpleString)), function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "foo.js.map",
        url:               "http://example.com/a/b/c/foo.js.map",
        sourcesRelativeTo: "http://example.com/a/b/c/foo.js.map",
        map:               map.simple
      }, "fileRelative")
      isAsync()
    })

    method(code.domainRelative, codeUrl, wrap(read(map.simpleString)), function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "/foo.js.map",
        url:               "http://example.com/foo.js.map",
        sourcesRelativeTo: "http://example.com/foo.js.map",
        map:               map.simple
      }, "domainRelative")
      isAsync()
    })

    method(code.schemeRelative, codeUrl, wrap(read(map.simpleString)), function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "//foo.org/foo.js.map",
        url:               "http://foo.org/foo.js.map",
        sourcesRelativeTo: "http://foo.org/foo.js.map",
        map:               map.simple
      }, "schemeRelative")
      isAsync()
    })

    method(code.absolute, codeUrl, wrap(read(map.simpleString)), function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "https://foo.org/foo.js.map",
        url:               "https://foo.org/foo.js.map",
        sourcesRelativeTo: "https://foo.org/foo.js.map",
        map:               map.simple
      }, "absolute")
      isAsync()
    })

    method(code.dataUri, codeUrl, wrap(Throws), function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "data:application/json," +
                           "%7B%22mappings%22%3A%22AAAA%22%2C%22sources%22%3A%5B%22" +
                           "foo.js%22%5D%2C%22names%22%3A%5B%5D%7D",
        url:               null,
        sourcesRelativeTo: codeUrl,
        map:               map.simple
      }, "dataUri")
      isAsync()
    })

    method(code.base64, codeUrl, wrap(Throws), function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "data:application/json;base64," +
                           "eyJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VzIjpbImZvby5qcyJdLCJuYW1lcyI6W119",
        url:               null,
        sourcesRelativeTo: codeUrl,
        map:               map.simple
      }, "base64")
      isAsync()
    })

    method(code.dataUriText, codeUrl, wrap(Throws), function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "data:text/json," +
                           "%7B%22mappings%22%3A%22AAAA%22%2C%22sources%22%3A%5B%22" +
                           "foo.js%22%5D%2C%22names%22%3A%5B%5D%7D",
        url:               null,
        sourcesRelativeTo: codeUrl,
        map:               map.simple
      }, "dataUriText")
      isAsync()
    })

    method(code.dataUriParameter, codeUrl, wrap(Throws), function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "data:application/json;charset=UTF-8;foo=bar," +
                           "%7B%22mappings%22%3A%22AAAA%22%2C%22sources%22%3A%5B%22" +
                           "foo.js%22%5D%2C%22names%22%3A%5B%5D%7D",
        url:               null,
        sourcesRelativeTo: codeUrl,
        map:               map.simple
      }, "dataUriParameter")
      isAsync()
    })

    method(code.dataUriNoMime, codeUrl, wrap(Throws), function(error, result) {
      t.ok(error.message.match(/mime type.+text\/plain/), "dataUriNoMime")
      t.notOk(result)
      isAsync()
    })

    method(code.dataUriInvalidMime, codeUrl, wrap(Throws), function(error, result) {
      t.ok(error.message.match(/mime type.+text\/html/), "dataUriInvalidMime")
      t.notOk(result)
      isAsync()
    })

    method(code.dataUriInvalidJSON, codeUrl, wrap(Throws), function(error, result) {
      t.ok(error instanceof SyntaxError && error.message !== "data:application/json,foo",
        "dataUriInvalidJSON")
      t.notOk(result)
      isAsync()
    })

    method(code.dataUriXSSIsafe, codeUrl, wrap(Throws), function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "data:application/json," + ")%5D%7D%27" +
                           "%7B%22mappings%22%3A%22AAAA%22%2C%22sources%22%3A%5B%22" +
                           "foo.js%22%5D%2C%22names%22%3A%5B%5D%7D",
        url:               null,
        sourcesRelativeTo: codeUrl,
        map:               map.simple
      }, "dataUriXSSIsafe")
      isAsync()
    })

    method(code.dataUriEmpty, codeUrl, wrap(Throws), function(error, result) {
      t.ok(error.message.match(/mime type.+text\/plain/), "dataUriEmpty")
      t.notOk(result)
      isAsync()
    })

    method(code.noMap, codeUrl, wrap(Throws), function(error, result) {
      t.error(error)
      t.equal(result, null, "noMap")
      isAsync()
    })

    method(code.absolute, codeUrl, wrap(read([map.simpleString])), function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "https://foo.org/foo.js.map",
        url:               "https://foo.org/foo.js.map",
        sourcesRelativeTo: "https://foo.org/foo.js.map",
        map:               map.simple
      }, "read non-string")
      isAsync()
    })

    method(code.absolute, codeUrl, wrap(read("invalid JSON")), function(error, result) {
      t.ok(error instanceof SyntaxError, "read invalid JSON")
      t.notOk(result)
      isAsync()
    })

    method(code.absolute, codeUrl, wrap(read(map.XSSIsafe)), function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "https://foo.org/foo.js.map",
        url:               "https://foo.org/foo.js.map",
        sourcesRelativeTo: "https://foo.org/foo.js.map",
        map:               map.simple
      }, "XSSIsafe map")
      isAsync()
    })

    method(code.absolute, codeUrl, wrap(Throws), function(error, result) {
      t.equal(error.message, "https://foo.org/foo.js.map", "read throws")
      t.notOk(result)
      isAsync()
    })

    next = true
  }
}

test(".resolveSourceMap",     testResolveSourceMap(sourceMapResolve.resolveSourceMap,    false))

test(".resolveSourceMapSync", testResolveSourceMap(sourceMapResolve.resolveSourceMapSync, true))


function testResolveSources(method, sync) {
  return function(t) {
    var wrap = (sync ? identity : asyncify)

    var mapUrl = "http://example.com/a/b/c/foo.js.map"

    t.plan(1 + (sync ? 8 : 11) + 6*3 + 4)

    t.equal(typeof method, "function", "is a function")

    throwsError(t, method, [                   ], 1, "source map")
    throwsError(t, method, [null               ], 1, "source map")
    throwsError(t, method, ["foo"              ], 1, "source map")
    throwsError(t, method, [{}                 ], 2, "map url")
    throwsError(t, method, [{}, null           ], 2, "map url")
    throwsError(t, method, [{}, "bar"          ], 3, "read")
    throwsError(t, method, [{}, "bar", null    ], 3, "read")
    throwsError(t, method, [{}, "bar", "baz"   ], 3, "read")
    if (!sync) {
      throwsError(t, method, [{}, "bar", read()       ], 4, "callback")
      throwsError(t, method, [{}, "bar", read(), null ], 4, "callback")
      throwsError(t, method, [{}, "bar", read(), "baz"], 4, "callback")
    }

    if (sync) {
      method = asyncify(method)
    }

    var next = false
    function isAsync() { t.ok(next, "is async") }

    method(map.simple, mapUrl, wrap(identity), function(error, result) {
      t.error(error)
      t.deepEqual(result, ["http://example.com/a/b/c/foo.js"], "simple")
      isAsync()
    })

    method(map.sourceRoot, mapUrl, wrap(identity), function(error, result) {
      t.error(error)
      t.deepEqual(result, [
        "http://example.com/static/js/app/foo.js",
        "http://example.com/static/js/app/lib/bar.js",
        "http://example.com/static/js/vendor/dom.js",
        "http://example.com/version.js",
        "http://foo.org/baz.js"
      ], "sourceRoot")
      isAsync()
    })

    method(map.sourceRootNoSlash, mapUrl, wrap(identity), function(error, result) {
      t.error(error)
      t.deepEqual(result, [
        "http://example.com/static/js/app/foo.js",
        "http://example.com/static/js/app/lib/bar.js",
        "http://example.com/static/js/vendor/dom.js",
        "http://example.com/version.js",
        "http://foo.org/baz.js"
      ], "sourceRootNoSlash")
      isAsync()
    })

    method(map.sourcesContent, mapUrl, wrap(Throws), function(error, result) {
      t.error(error)
      t.deepEqual(result, [
        "foo.js",
        "lib/bar.js",
        "../vendor/dom.js",
        "/version.js",
        "//foo.org/baz.js"
      ], "sourcesContent")
      isAsync()
    })

    method(map.mixed, mapUrl, wrap(identity), function(error, result) {
      t.error(error)
      t.deepEqual(result, [
        "foo.js",
        "http://example.com/a/b/c/lib/bar.js",
        "http://example.com/a/b/vendor/dom.js",
        "/version.js",
        "//foo.org/baz.js"
      ], "mixed")
      isAsync()
    })

    method(map.simple, mapUrl, wrap(read(["non", "string"])), function(error, result) {
      t.error(error)
      t.deepEqual(result, ["non,string"], "read non-string")
      isAsync()
    })

    var calledBack = false
    method(map.mixed, mapUrl, wrap(Throws), function(error, result) {
      t.equal(calledBack, false)
      calledBack = true
      t.equal(error.message, "http://example.com/a/b/c/lib/bar.js", "read throws")
      t.notOk(result)
      isAsync()
    })

    next = true
  }
}

test(".resolveSources",     testResolveSources(sourceMapResolve.resolveSources,    false))

test(".resolveSourcesSync", testResolveSources(sourceMapResolve.resolveSourcesSync, true))


function testResolve(method, sync) {
  return function(t) {
    var wrap = (sync ? identity : asyncify)
    var wrapMap = function(mapFn, fn) {
      return wrap(function(url) {
        if (/\.map$/.test(url)) {
          return mapFn(url)
        }
        return fn(url)
      })
    }

    var codeUrl = "http://example.com/a/b/c/foo.js"

    t.plan(1 + (sync ? 7 : 10) + 18*3 + 6*3 + 4)

    t.equal(typeof method, "function", "is a function")

    throwsError(t, method, [                   ], 1, "code")
    throwsError(t, method, [null               ], 1, "code")
    throwsError(t, method, ["foo"              ], 2, "code url")
    throwsError(t, method, ["foo", null        ], 2, "code url")
    throwsError(t, method, ["foo", "bar"       ], 3, "read")
    throwsError(t, method, ["foo", "bar", null ], 3, "read")
    throwsError(t, method, ["foo", "bar", "baz"], 3, "read")
    if (!sync) {
      throwsError(t, method, ["foo", "bar", read(map.simpleString)       ], 4, "callback")
      throwsError(t, method, ["foo", "bar", read(map.simpleString), null ], 4, "callback")
      throwsError(t, method, ["foo", "bar", read(map.simpleString), "baz"], 4, "callback")
    }

    if (sync) {
      method = asyncify(method)
    }

    var next = false
    function isAsync() { t.ok(next, "is async") }

    var readSimple = wrapMap(read(map.simpleString), identity)

    method(code.fileRelative, codeUrl, readSimple, function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "foo.js.map",
        url:               "http://example.com/a/b/c/foo.js.map",
        sourcesRelativeTo: "http://example.com/a/b/c/foo.js.map",
        map:               map.simple,
        sources:           ["http://example.com/a/b/c/foo.js"]
      }, "fileRelative")
      isAsync()
    })

    method(code.domainRelative, codeUrl, readSimple, function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "/foo.js.map",
        url:               "http://example.com/foo.js.map",
        sourcesRelativeTo: "http://example.com/foo.js.map",
        map:               map.simple,
        sources:           ["http://example.com/foo.js"]
      }, "domainRelative")
      isAsync()
    })

    method(code.schemeRelative, codeUrl, readSimple, function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "//foo.org/foo.js.map",
        url:               "http://foo.org/foo.js.map",
        sourcesRelativeTo: "http://foo.org/foo.js.map",
        map:               map.simple,
        sources:           ["http://foo.org/foo.js"]
      }, "schemeRelative")
      isAsync()
    })

    method(code.absolute, codeUrl, readSimple, function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "https://foo.org/foo.js.map",
        url:               "https://foo.org/foo.js.map",
        sourcesRelativeTo: "https://foo.org/foo.js.map",
        map:               map.simple,
        sources:           ["https://foo.org/foo.js"]
      }, "absolute")
      isAsync()
    })

    method(code.dataUri, codeUrl, wrapMap(Throws, identity), function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "data:application/json," +
                           "%7B%22mappings%22%3A%22AAAA%22%2C%22sources%22%3A%5B%22" +
                           "foo.js%22%5D%2C%22names%22%3A%5B%5D%7D",
        url:               null,
        sourcesRelativeTo: codeUrl,
        map:               map.simple,
        sources:           ["http://example.com/a/b/c/foo.js"]
      }, "dataUri")
      isAsync()
    })

    method(code.base64, codeUrl, wrapMap(Throws, identity), function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "data:application/json;base64," +
                           "eyJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VzIjpbImZvby5qcyJdLCJuYW1lcyI6W119",
        url:               null,
        sourcesRelativeTo: codeUrl,
        map:               map.simple,
        sources:           ["http://example.com/a/b/c/foo.js"]
      }, "base64")
      isAsync()
    })

    method(code.dataUriText, codeUrl, wrapMap(Throws, identity), function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "data:text/json," +
                           "%7B%22mappings%22%3A%22AAAA%22%2C%22sources%22%3A%5B%22" +
                           "foo.js%22%5D%2C%22names%22%3A%5B%5D%7D",
        url:               null,
        sourcesRelativeTo: codeUrl,
        map:               map.simple,
        sources:           ["http://example.com/a/b/c/foo.js"]
      }, "dataUriText")
      isAsync()
    })

    method(code.dataUriParameter, codeUrl, wrapMap(Throws, identity), function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "data:application/json;charset=UTF-8;foo=bar," +
                           "%7B%22mappings%22%3A%22AAAA%22%2C%22sources%22%3A%5B%22" +
                           "foo.js%22%5D%2C%22names%22%3A%5B%5D%7D",
        url:               null,
        sourcesRelativeTo: codeUrl,
        map:               map.simple,
        sources:           ["http://example.com/a/b/c/foo.js"]
      }, "dataUriParameter")
      isAsync()
    })

    method(code.dataUriNoMime, codeUrl, wrap(Throws), function(error, result) {
      t.ok(error.message.match(/mime type.+text\/plain/), "dataUriNoMime")
      t.notOk(result)
      isAsync()
    })

    method(code.dataUriInvalidMime, codeUrl, wrap(Throws), function(error, result) {
      t.ok(error.message.match(/mime type.+text\/html/), "dataUriInvalidMime")
      t.notOk(result)
      isAsync()
    })

    method(code.dataUriInvalidJSON, codeUrl, wrap(Throws), function(error, result) {
      t.ok(error instanceof SyntaxError && error.message !== "data:application/json,foo",
        "dataUriInvalidJSON")
      t.notOk(result)
      isAsync()
    })

    method(code.dataUriXSSIsafe, codeUrl, wrapMap(Throws, identity), function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "data:application/json," + ")%5D%7D%27" +
                           "%7B%22mappings%22%3A%22AAAA%22%2C%22sources%22%3A%5B%22" +
                           "foo.js%22%5D%2C%22names%22%3A%5B%5D%7D",
        url:               null,
        sourcesRelativeTo: codeUrl,
        map:               map.simple,
        sources:           ["http://example.com/a/b/c/foo.js"]
      }, "dataUriXSSIsafe")
      isAsync()
    })

    method(code.dataUriEmpty, codeUrl, wrap(Throws), function(error, result) {
      t.ok(error.message.match(/mime type.+text\/plain/), "dataUriEmpty")
      t.notOk(result)
      isAsync()
    })

    method(code.noMap, codeUrl, wrap(Throws), function(error, result) {
      t.error(error)
      t.equal(result, null, "noMap")
      isAsync()
    })

    method(code.absolute, codeUrl, wrap(read([map.simpleString])), function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "https://foo.org/foo.js.map",
        url:               "https://foo.org/foo.js.map",
        sourcesRelativeTo: "https://foo.org/foo.js.map",
        map:               map.simple,
        sources:           [map.simpleString]
      }, "read non-string")
      isAsync()
    })

    method(code.absolute, codeUrl, wrap(read("invalid JSON")), function(error, result) {
      t.ok(error instanceof SyntaxError, "read invalid JSON")
      t.notOk(result)
      isAsync()
    })

    method(code.absolute, codeUrl, wrapMap(read(map.XSSIsafe), identity), function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "https://foo.org/foo.js.map",
        url:               "https://foo.org/foo.js.map",
        sourcesRelativeTo: "https://foo.org/foo.js.map",
        map:               map.simple,
        sources:           ["https://foo.org/foo.js"]
      }, "XSSIsafe map")
      isAsync()
    })

    method(code.absolute, codeUrl, wrap(Throws), function(error, result) {
      t.equal(error.message, "https://foo.org/foo.js.map", "read throws")
      t.notOk(result)
      isAsync()
    })

    function readMap(what) {
      return wrapMap(read(JSON.stringify(what)), identity)
    }

    method(code.fileRelative, codeUrl, readMap(map.simple), function(error, result) {
      t.error(error)
      t.deepEqual(result.sources, ["http://example.com/a/b/c/foo.js"], "simple")
      isAsync()
    })

    method(code.fileRelative, codeUrl, readMap(map.sourceRoot), function(error, result) {
      t.error(error)
      t.deepEqual(result.sources, [
        "http://example.com/static/js/app/foo.js",
        "http://example.com/static/js/app/lib/bar.js",
        "http://example.com/static/js/vendor/dom.js",
        "http://example.com/version.js",
        "http://foo.org/baz.js"
      ], "sourceRoot")
      isAsync()
    })

    method(code.fileRelative, codeUrl, readMap(map.sourceRootNoSlash), function(error, result) {
      t.error(error)
      t.deepEqual(result.sources, [
        "http://example.com/static/js/app/foo.js",
        "http://example.com/static/js/app/lib/bar.js",
        "http://example.com/static/js/vendor/dom.js",
        "http://example.com/version.js",
        "http://foo.org/baz.js"
      ], "sourceRootNoSlash")
      isAsync()
    })

    method(code.fileRelative, codeUrl, readMap(map.sourcesContent), function(error, result) {
      t.error(error)
      t.deepEqual(result.sources, [
        "foo.js",
        "lib/bar.js",
        "../vendor/dom.js",
        "/version.js",
        "//foo.org/baz.js"
      ], "sourcesContent")
      isAsync()
    })

    method(code.fileRelative, codeUrl, readMap(map.mixed), function(error, result) {
      t.error(error)
      t.deepEqual(result.sources, [
        "foo.js",
        "http://example.com/a/b/c/lib/bar.js",
        "http://example.com/a/b/vendor/dom.js",
        "/version.js",
        "//foo.org/baz.js"
      ], "mixed")
      isAsync()
    })

    method(code.fileRelative, codeUrl, wrap(read([map.simpleString])), function(error, result) {
      t.error(error)
      t.deepEqual(result.sources, [map.simpleString], "read non-string")
      isAsync()
    })

    function ThrowsMap(what) {
      return wrapMap(read(JSON.stringify(what)), Throws)
    }

    var calledBack = false
    method(code.fileRelative, codeUrl, ThrowsMap(map.mixed), function(error, result) {
      t.equal(calledBack, false)
      calledBack = true
      t.equal(error.message, "http://example.com/a/b/c/lib/bar.js", "read throws")
      t.notOk(result)
      isAsync()
    })

    next = true
  }
}

test(".resolve",     testResolve(sourceMapResolve.resolve,    false))

test(".resolveSync", testResolve(sourceMapResolve.resolveSync, true))

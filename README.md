# namespace-proxy

[![Build Status](https://travis-ci.org/jurca/namespace-proxy.svg?branch=master)](https://travis-ci.org/jurca/namespace-proxy)
[![npm](http://img.shields.io/npm/v/namespace-proxy.svg)](https://www.npmjs.com/package/namespace-proxy)
[![License](https://img.shields.io/npm/l/namespace-proxy.svg)](LICENSE)

The namespace-proxy is a utility for creating namespaces in objects (similar to
those provided by
[Mozilla's SDK](https://github.com/mozilla/addon-sdk/blob/master/lib/sdk/core/namespace.js)).

A namespace can be used to prevent symbol collisions in object's properties, or
to create private APIs and properties.

The main difference between the `namespace-proxy` and Mozilla's namespace is
the use of ES2015 [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
which allows the `namespace-proxy` to store the namespaced properties directly
on the target object, instead of having a separate storage of these properties.

Furthermore, the `namespace-proxy` stores all properties via ES2015
[`symbol`s](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol),
which are unique to each created namespace and thus prevent name collisions.

## Usage example

The `createNamespaceProxy` function creates a function that accepts an object
and returns a proxy object which is used to access the namespace within the
passed-in object.

The created function also is a Proxy, which provides automatically generated
symbols by accessing them, and can be used for static properties.

```javascript
import createNamespaceProxy from "namespace-proxy"

const PRIVATE = createNamespaceProxy()
const PROTECTED = createNamespaceProxy()

export default class Point {
  constructor(x, y) {
    PROTECTED(this).x = x // stores x in this instance using a symbol named "x"
    PROTECTED(this).y = y
  }

  static get PROTECTED() {
    return PROTECTED // allow other code (subclases) to access this namespace
  }

  get x() {
    return PROTECTED(this).x
  }

  get y() {
    return PROTECTED(this).x
  }

  get distanceFromOrigin() {
    let d1 = PRIVATE.getDistance(this.x, 0)
    let d2 = PRIVATE.getDistance(this.y, 0)
    return Math.sqrt(Math.pow(d1, 2) + Math.pow(d2, 2))
  }

  // method named using a symbol named "getDistance"
  [PRIVATE.getDistance](d1, d2) {
    return Math.abs(d2 - d1)
  }

  // static method named using a symbol named "create"
  static [PROTECTED.create](x, y) {
    return new Point(x, y)
  }
}
```

# Browser and Node.js support

Since the `namespace-proxy` requires the `Proxy` API which cannot be
polyfilled, only Node.js 6+ and modern browsers are supported. You can check
the current list of supported browsers at
[caniuse.com](http://caniuse.com/#search=proxy) or the
[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

At the moment of writing this, the following browsers were supported:

* Chrome/Chromium 49+
* Firefox 18+
* Edge 12+
* Opera & Opera Mobile 36+
* Chrome & Firefox for Android
* Android System WebView / Android Browser 49+

It appears the Safari and iOS browsers will be supported from the version 10.

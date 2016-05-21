
import createNamespaceProxy from "../es2015/createNamespaceProxy"
import test from "tape"

test("createNamespaceProxy should store data in a namespace", (t) => {
  t.plan(2)

  let proxy = createNamespaceProxy()
  let object = {
    foo: "bar"
  }
  proxy(object).foo = "baz"

  t.equal(object.foo, "bar")
  t.equal(proxy(object).foo, "baz")

  t.end()
})

test("createNamespaceProxy should use separate namespaces for each proxy",
    (t) => {
  t.plan(2)

  let proxy1 = createNamespaceProxy()
  let proxy2 = createNamespaceProxy()
  let object = {}
  proxy1(object).foo = "bar"
  proxy2(object).foo = "baz"

  t.equal(proxy1(object).foo, "bar")
  t.equal(proxy2(object).foo, "baz")

  t.end()
})

test("createNamespaceProxy should use well-named symbols to store data",
    (t) => {
  t.plan(2)

  let proxy = createNamespaceProxy()
  let object = {}

  proxy(object).foo123Baz = "bar"
  t.equal(Object.getOwnPropertySymbols(object).length, 1)

  let symbol = Object.getOwnPropertySymbols(object)[0]
  t.equal(symbol.toString(), "Symbol(foo123Baz)")

  t.end()
})

test("createNamespaceProxy should store the data directly on the object",
    (t) => {
  t.plan(1)

  let proxy = createNamespaceProxy()
  let object = {}
  proxy(object).foo = "bar"

  let symbol = Object.getOwnPropertySymbols(object)[0]
  t.equal(object[symbol], "bar")

  t.end(0)
})

test("createNamespaceProxy should create non-enumerable properties by default",
    (t) => {
  t.plan(1)

  let proxy = createNamespaceProxy()
  let object = {}
  proxy(object).foo = "bar"

  let symbol = Object.getOwnPropertySymbols(object)[0]
  let descriptor = Object.getOwnPropertyDescriptor(object, symbol)
  t.notOk(descriptor.enumerable)

  t.end()
})

test("createNamespaceProxy should allow properties to be rewritable", (t) => {
  t.plan(2)

  let proxy = createNamespaceProxy()
  let object = {}
  proxy(object).foo = "bar"
  t.equal(proxy(object).foo, "bar")

  proxy(object).foo = 123
  t.equal(proxy(object).foo, 123)

  t.end()
})

test("createNamespaceProxy should allow creation of enumerable properties",
    (t) => {
  t.plan(1)

  let proxy = createNamespaceProxy(true)
  let object = {}
  proxy(object).foo = "bar"
  let symbol = Object.getOwnPropertySymbols(object)[0]
  let descriptor = Object.getOwnPropertyDescriptor(object, symbol)
  t.ok(descriptor.enumerable)

  t.end()
})

test("createNamespaceProxy should provide static symbols", (t) => {
  t.plan(2)

  let proxy = createNamespaceProxy()
  let symbol = proxy.foo
  t.equal(typeof symbol, "symbol")
  t.equal(symbol.toString(), "Symbol(foo)")

  t.end()
})

test("createNamespaceProxy should cache instance proxies and use separate " +
    "proxies for each object", (t) => {
  t.plan(2)

  let proxy = createNamespaceProxy()
  let object1 = {}
  let object2 = {}

  t.equal(proxy(object1), proxy(object1))
  t.notEqual(proxy(object1), proxy(object2))

  t.end()
})

test("createNamespaceProxy should use the same symbols across objects",
    (t) => {
  t.plan(1)
  
  let proxy = createNamespaceProxy()
  let object1 = {}
  let object2 = {}
  proxy(object1).foo = "bar"
  let symbol = Object.getOwnPropertySymbols(object1)[0]
  object2[symbol] = 123
  t.equal(proxy(object2).foo, 123)
  
  t.end()
})

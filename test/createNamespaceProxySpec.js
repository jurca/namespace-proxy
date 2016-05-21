
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
  t.plan(0)
  t.end()
})

test("createNamespaceProxy should use well-named symbols to store data",
    (t) => {
  t.plan(0)
  t.end()
})

test("createNamespaceProxy should create non-enumerable properties by default",
    (t) => {
  t.plan(0)
  t.end()
})

test("createNamespaceProxy should allow creation of enumerable properties",
    (t) => {
  t.plan(0)
  t.end()
})

test("createNamespaceProxy should provide static symbols", (t) => {
  t.plan(0)
  t.end()
})

test("createNamespaceProxy should cache instance proxies", (t) => {
  t.plan(0)
  t.end()
})

test("createNamespaceProxy should use the same symbols across objects",
    (t) => {
  t.plan(0)
  t.end()
})


/**
 * Creates a function that returns a proxy object for easier manipulation of
 * private properties of the provided instance. The proxies are generated
 * lazily and cached in a weak map.
 *
 * The function also generates (and caches) symbols when a property of its is
 * retrieved, which enables easy declaration and accessing of static private
 * class methods.
 *
 * The returned function should not be exposed outside of the module defining
 * the class to keep the private fields private.
 *
 * @return {function(instance: Object): Proxy} A function that returns a proxy
 *         object for easier manipulation of private properties of the provided
 *         instance.
 */
export default function createNamespaceProxy() {
  let proxies = new WeakMap()
  let instanceSymbols = new Map()

  let instanceProxyFactory = (instance) => {
    if (proxies.has(instance)) {
      return proxies.get(instance)
    }

    let proxy = createProxy(instance, instanceSymbols)
    proxies.set(instance, proxy)
    return proxy
  }

  let methodSymbols = new Map()
  return new Proxy(instanceProxyFactory, {
    get: (target, propertyName) => getSymbol(methodSymbols, propertyName)
  })
}

/**
 * Creates a proxy for retrieving and setting the values of the private
 * properties of the provided instance.
 *
 * @param {Object} instance The instance for which the proxy should be created.
 * @param {Map<string, symbol>} symbols Cache of private property symbols.
 * @return {Proxy} The proxy for convenient setting and retrieving of private
 *         properties of the specified instance.
 */
function createProxy(instance, symbols) {
  return new Proxy(instance, {
    set: (target, propertyName, value) => {
      let symbol = getSymbol(symbols, propertyName)
      instance[symbol] = value
      return true
    },

    get: (target, propertyName) => {
      let symbol = getSymbol(symbols, propertyName)
      return instance[symbol]
    }
  })
}

/**
 * Retrieves or generates and caches the private field symbol for the private
 * property of the specified name.
 *
 * @param {Map<string, symbol>} symbols Cache of private property symbols.
 * @param {string} propertyName The name of the private property.
 * @return {symbol} The symbol to use for setting and retrieving the value of
 *         the specified private property.
 */
function getSymbol(symbols, propertyName) {
  if (symbols.has(propertyName)) {
    return symbols.get(propertyName)
  }

  let symbol = Symbol(propertyName)
  symbols.set(propertyName, symbol)
  return symbol
}

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
 * @param {boolean=} enumerable The flag specifying whether or not the
 *        properties created by the returned proxy should be enumerable or not.
 *        Defaults to {@code false} which can be useful for private properties.
 *        This does not apply to symbols used for methods, as the proxy does
 *        not handle the method declarations.
 * @return {function(instance: Object): Proxy} A function that returns a proxy
 *         object for easier manipulation of private properties of the provided
 *         instance.
 */
export default function createNamespaceProxy(enumerable = false) {
  let proxies = new WeakMap()
  let instanceSymbols = new Map()

  let instanceProxyFactory = (instance) => {
    if (proxies.has(instance)) {
      return proxies.get(instance)
    }

    let proxy = createProxy(instance, instanceSymbols, enumerable)
    proxies.set(instance, proxy)
    return proxy
  }

  let staticSymbols = new Map()
  return new Proxy(instanceProxyFactory, {
    get: (target, propertyName) => {
      let { symbol } = getSymbol(staticSymbols, propertyName)
      return symbol
    }
  })
}

/**
 * Creates a proxy for retrieving and setting the values of the private
 * properties of the provided instance.
 *
 * @param {Object} instance The instance for which the proxy should be created.
 * @param {Map<string, symbol>} symbols Cache of private property symbols.
 * @param {boolean} enumerable The flag specifying whether or not the
 *        properties created by the returned proxy should be enumerable or not.
 * @return {Proxy} The proxy for convenient setting and retrieving of private
 *         properties of the specified instance.
 */
function createProxy(instance, symbols, enumerable) {
  return new Proxy(instance, {
    set: (target, propertyName, value) => {
      let { symbol, isNew } = getSymbol(symbols, propertyName)
      instance[symbol] = value
      if (!enumerable && isNew) {
        Object.defineProperty(instance, symbol, {
          enumerable: false
        })
      }
      return true
    },

    get: (target, propertyName) => {
      let { symbol } = getSymbol(symbols, propertyName)
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
 * @return {{symbol: symbol, isNew: boolean}} An object wrapping the symbol to
 *         use for setting and retrieving the value of the specified private
 *         property. The {@code isNew} flag specifies whether the symbol has
 *         just been created.
 */
function getSymbol(symbols, propertyName) {
  if (symbols.has(propertyName)) {
    return {
      symbol: symbols.get(propertyName),
      isNew: false
    }
  }

  let symbol = Symbol(propertyName)
  symbols.set(propertyName, symbol)
  return {
    symbol,
    isNew: true
  }
}

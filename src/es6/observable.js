/**
 * 基于riot 2.3.0 修改而来，无任何依赖
 * 给任意一个对象，添加注册/触发事件的能力
 */
function observable(el) {
    /**
     * Extend the original object or create a new empty one
     * @type { Object }
     */

    el = el || {}

    /**
     * Private variables and methods
     */

    var callbacks = {},
        onEachEvent = function (e, fn) { e.replace(/\S+/g, fn) },
        defineProperty = function (key, value) {
            Object.defineProperty(el, key, {
                value: value,
                enumerable: false,
                writable: false,
                configurable: false
            })
        }

    /**
     * Listen to the given space separated list of `events` and execute the `callback` each time an event is triggered.
     * @param  { String } events - events ids
     * @param  { Function } fn - callback function
     * @returns { Object } el
     */

    defineProperty('on', function (events, fn) {
        if (typeof fn != 'function') return el

        onEachEvent(events, function (name, pos) {
            (callbacks[name] = callbacks[name] || []).push(fn)
            fn.typed = pos > 0
        })

        return el
    })

    /**
     * Removes the given space separated list of `events` listeners
     * @param   { String } events - events ids
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */

    defineProperty('off', function (events, fn) {
        if (events == '*' || events == null) callbacks = {}
        else {
            onEachEvent(events, function (name) {
                if (fn) {
                    var arr = callbacks[name]
                    for (var i = 0, cb; cb = arr && arr[i]; ++i) {
                        if (cb == fn) arr.splice(i--, 1)
                    }
                } else delete callbacks[name]
            })
        }
        return el
    })

    /**
     * Listen to the given space separated list of `events` and execute the `callback` at most once
     * @param   { String } events - events ids
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */

    defineProperty('one', function (events, fn) {
        function on() {
            el.off(events, on)

            // V8 performance optimization
            // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
            var arglen = arguments.length
            var args = new Array(arglen)
            for (var i = 0; i < arglen; i++) {
                args[i] = arguments[i]
            }

            fn.apply(el, args)
        }
        return el.on(events, on)
    })

    /**
     * Execute all callback functions that listen to the given space separated list of `events`
     * @param   { String } events - events ids
     * @returns { Object } el
     */

    defineProperty('trigger', function (events) {
        // V8 performance optimization
        // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
        var arglen = arguments.length - 1
        var args = new Array(arglen)
        for (var i = 0; i < arglen; i++) {
            args[i] = arguments[i + 1] // skip first argument
        }

        onEachEvent(events, function (name) {

            var fns = (callbacks[name] || []).slice(0)

            for (var i = 0, fn; fn = fns[i]; ++i) {
                if (fn.busy) return
                fn.busy = 1

                try {
                    fn.apply(el, fn.typed ? [name].concat(args) : args)
                } catch (e) {
                    console.error(e); /* error */
                    console.log(arguments);
                }
                if (fns[i] !== fn) { i-- }
                fn.busy = 0
            }

            if (callbacks.all && name != 'all')
                el.trigger.apply(el, ['all', name].concat(args))

        })

        return el
    })

    // +++++++++++ 添加
    // 异步触发事件
    defineProperty('triggerAsync', function (events) {
        var args = arguments, self = this;
        setTimeout(function () {
            self.trigger.apply(self, args);
        }, 0);
    });

    defineProperty("hasEvent", function (event) {
        return event in callbacks;
    });

    return el

}

export default observable;
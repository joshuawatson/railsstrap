/**
 * Created by toadkicker on 10/5/14.
 */
// @source jashkenas/underscore
// @url https://github.com/jashkenas/underscore/blob/1.5.2/underscore.js#L693
railsstrap.helpers.debounce = function($timeout) {
    return function (func, wait, immediate) {
        var timeout = null;
        return function () {
            var context = this,
                args = arguments,
                callNow = immediate && !timeout;
            if (timeout) {
                $timeout.cancel(timeout);
            }
            timeout = $timeout(function later() {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            }, wait, false);
            if (callNow) {
                func.apply(context, args);
            }
            return timeout;
        };
    };
}
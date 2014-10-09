/**
 * Created by toadkicker on 10/5/14.
 */
// @source jashkenas/underscore
// @url https://github.com/jashkenas/underscore/blob/1.5.2/underscore.js#L661
railsstrap.helpers.throttle = function($timeout) {
    return function(func, wait, options) {
        var timeout = null;
        options || (options = {});
        return function() {
            var context = this,
                args = arguments;
            if(!timeout) {
                if(options.leading !== false) {
                    func.apply(context, args);
                }
                timeout = $timeout(function later() {
                    timeout = null;
                    if(options.trailing !== false) {
                        func.apply(context, args);
                    }
                }, wait, false);
            }
        };
    };
}
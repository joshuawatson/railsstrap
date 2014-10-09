+function ($) {
    'use strict';

    // ASIDE CLASS DEFINITION
    // ======================

    var Aside = function (element, options) {
        this.options = options;
        this.$body = $(document.body);
        this.$element = $(element);
        this.$backdrop =
            this.isShown = null;
        this.scrollbarWidth = 0;

        if (this.options.remote) {
            this.$element
                .find('.aside-content')
                .load(this.options.remote, $.proxy(function () {
                    this.$element.trigger('loaded.railsstrap.aside')
                }, this))
        }

    };

    Aside.VERSION = '3.2.0';

    Aside.TRANSITION_DURATION = 300;
    Aside.BACKDROP_TRANSITION_DURATION = 150;

    Aside.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    };

    Aside.prototype.toggle = function (_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget)
    };

    Aside.prototype.show = function (_relatedTarget) {
        var that = this;
        var e = $.Event('show.railsstrap.aside', { relatedTarget: _relatedTarget });

        this.$element.trigger(e);

        if (this.isShown || e.isDefaultPrevented()) return;

        this.isShown = true;

        this.checkScrollbar();
        this.$body.addClass('aside-open');

        this.setScrollbar();
        this.escape();

        this.$element.on('click.dismiss.railsstrap.aside', '[data-dismiss="aside"]', $.proxy(this.hide, this));

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade');

            if (!that.$element.parent().length) {
                that.$element.appendTo(that.$body); // don't move asides dom position
            }

            that.$element
                .show()
                .scrollTop(0);

            if (transition) {
                that.$element[0].offsetWidth; // force reflow
            }

            that.$element
                .addClass('in')
                .attr('aria-hidden', false);

            that.enforceFocus();

            var e = $.Event('shown.railsstrap.aside', { relatedTarget: _relatedTarget });

            transition ?
                that.$element.find('.aside-dialog') // wait for aside to slide in
                    .one('bsTransitionEnd', function () {
                        that.$element.trigger('focus').trigger(e)
                    })
                    .emulateTransitionEnd(Aside.TRANSITION_DURATION) :
                that.$element.trigger('focus').trigger(e)
        })
    };

    Aside.prototype.hide = function (e) {
        if (e) e.preventDefault();

        e = $.Event('hide.railsstrap.aside');

        this.$element.trigger(e);

        if (!this.isShown || e.isDefaultPrevented()) return;

        this.isShown = false;

        this.escape();

        $(document).off('focusin.railsstrap.aside');

        this.$element
            .removeClass('in')
            .attr('aria-hidden', true)
            .off('click.dismiss.railsstrap.aside');

        $.support.transition && this.$element.hasClass('fade') ?
            this.$element
                .one('bsTransitionEnd', $.proxy(this.hideAside, this))
                .emulateTransitionEnd(Aside.TRANSITION_DURATION) :
            this.hideAside()
    };

    Aside.prototype.enforceFocus = function () {
        $(document)
            .off('focusin.railsstrap.aside') // guard against infinite focus loop
            .on('focusin.railsstrap.aside', $.proxy(function (e) {
                if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                    this.$element.trigger('focus')
                }
            }, this))
    };

    Aside.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keydown.dismiss.railsstrap.aside', $.proxy(function (e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keydown.dismiss.railsstrap.aside')
        }
    };

    Aside.prototype.hideAside = function () {
        var that = this;
        this.$element.hide();
        this.backdrop(function () {
            that.$body.removeClass('aside-open');
            that.resetScrollbar();
            that.$element.trigger('hidden.railsstrap.aside')
        })
    };

    Aside.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null
    };

    Aside.prototype.backdrop = function (callback) {
        var that = this;
        var animate = this.$element.hasClass('fade') ? 'fade' : '';

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate;

            this.$backdrop = $('<div class="aside-backdrop ' + animate + '" />')
                .appendTo(this.$body);

            this.$element.on('click.dismiss.railsstrap.aside', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return;
                this.options.backdrop == 'static'
                    ? this.$element[0].focus.call(this.$element[0])
                    : this.hide.call(this)
            }, this));

            if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

            this.$backdrop.addClass('in');

            if (!callback) return;

            doAnimate ?
                this.$backdrop
                    .one('bsTransitionEnd', callback)
                    .emulateTransitionEnd(Aside.BACKDROP_TRANSITION_DURATION) :
                callback()

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in');

            var callbackRemove = function () {
                that.removeBackdrop();
                callback && callback()
            };
            $.support.transition && this.$element.hasClass('fade') ?
                this.$backdrop
                    .one('bsTransitionEnd', callbackRemove)
                    .emulateTransitionEnd(Aside.BACKDROP_TRANSITION_DURATION) :
                callbackRemove()

        } else if (callback) {
            callback()
        }
    };

    Aside.prototype.checkScrollbar = function () {
        this.scrollbarWidth = this.measureScrollbar()
    };

    Aside.prototype.setScrollbar = function () {
        var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10);
        if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
    };

    Aside.prototype.resetScrollbar = function () {
        this.$body.css('padding-right', '')
    };

    Aside.prototype.measureScrollbar = function () { // thx walsh
        if (document.body.clientWidth >= window.innerWidth) return 0;
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'aside-scrollbar-measure';
        this.$body.append(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this.$body[0].removeChild(scrollDiv);
        return scrollbarWidth
    };


    // ASIDE PLUGIN DEFINITION
    // =======================

    function Plugin(option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('railsstrap.aside');
            var options = $.extend({}, Aside.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('railsstrap.aside', (data = new Aside(this, options)));
            if (typeof option == 'string') data[option](_relatedTarget);
            else if (options.show) data.show(_relatedTarget)
        })
    }

    var old = $.fn.aside;

    $.fn.aside = Plugin;
    $.fn.aside.Constructor = Aside;


    // ASIDE NO CONFLICT
    // =================

    $.fn.aside.noConflict = function () {
        $.fn.aside = old;
        return this
    };


    // ASIDE DATA-API
    // ==============

    $(document).on('click.railsstrap.aside.data-api', '[data-toggle="aside"]', function (e) {
        var $this = $(this);
        var href = $this.attr('href');
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))); // strip for ie7
        var option = $target.data('railsstrap.aside') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());

        if ($this.is('a')) e.preventDefault();

        $target.one('show.railsstrap.aside', function (showEvent) {
            if (showEvent.isDefaultPrevented()) return; // only register focus restorer if aside will actually get shown
            $target.one('hidden.railsstrap.aside', function () {
                $this.is(':visible') && $this.trigger('focus')
            })
        });
        Plugin.call($target, option, this)
    });

}(jQuery);
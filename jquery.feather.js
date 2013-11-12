(function($) {

        "use strict";

        var version = 0.3;
        var name = "feather";

        /*
        *       Default options
        */
        var defaults = {
            loop : false,
            visible : 1,
            fullSliding : false,
            checkSettings : true,
            currentItemClass : 'actual',
        };

        /*
        *       Translation function
        */
        var translation = function (self, translate) {
            self.container.css({
                    '-webkit-transform': 'translateX(' + translate + 'px)', 
                    '-moz-transform': 'translateX(' + translate + 'px)', 
                    '-ms-transform': 'translateX(' + translate + 'px)', 
                    '-o-transform': 'translateX(' + translate + 'px)', 
                    'transform': 'translateX(' + translate + 'px)' 
            });
        };

        function Feather(el, opts) {
                var self = this;

                /*
                *        self.$el : parent div
                */
                self.$el = $(el);
                /*
                *        self.settings : global settings
                */
                self.settings = $.extend(defaults, opts);
                /*
                *        self.container : the div <ul>...</ul>
                */
                self.container = self.$el.children('ul');
                /*
                *        self.slides : the divs <li>...</li>
                */
                self.slides = self.container.children('li');
                
                /*********/
                /*
                *        self.current_class : class for the current element
                */
                self.current_class = self.settings.currentItemClass;
                /*********/

                /*
                *        self.checkSettings() : check the settings
                */
                (self.settings.checkSettings) ? self.checkSettings() : null;
                /*
                *        self.init() : initialize all width
                */
                self.init();

                var timerData = self.$el.attr('id') + "_timer";
                $(window).on('resize', function() {
                        clearTimeout($.data(this, timerData));
                    $.data(this, timerData, setTimeout(function() {
                            self.resize();
                    }, 50));
                });

                return {
                    /*
                    *   next : slide to the next item and return the actual current item after the sliding
                    */
                    next : function (callback) {
                        return self.next(callback);
                    },
                    /*
                    *   prev : slide to the previous item and return the actual current item after the sliding
                    */
                    prev : function(callback) {
                        return self.prev(callback);
                    },
                    /*
                    *   currentItem : return the actual current item
                    */
                    currentItem : function() {
                        return self.currentItem();
                    },
                    /*
                    *   nextItem : return the next item compared to the actual current item
                    */
                    nextItem : function() {
                        return self.nextItem();
                    },
                    /*
                    *   prevItem : return the previous item compared to the actual current item
                    */
                    prevItem : function() {
                        return self.prevItem();
                    },
                };
        };

        Feather.prototype.init = function() {
                var self = this;

                var parent_width = (self.$el.innerWidth() + 1);

                /* Set the container width */
                self.container.width(parent_width * self.slides.length);
                /* Set the slides width */
                self.slides.width(parent_width / self.settings.visible);

                self.defaultCss();

                if (self.container.find('.' + self.current_class).length == 0)
                        self.slides.first().addClass(self.current_class);
        };

        Feather.prototype.checkSettings = function() {
            var self = this;

            if (self.settings.fullSliding && (self.container.find('li').length % self.settings.visible) != 0)
                throw "Feather.js : The number of items in the list should be a multiple of the number of visible items. You can use the option 'checkSettings' to pass this check."
        };

        Feather.prototype.defaultCss = function() {
                var self = this;

                self.$el.css('overflow', 'hidden');

                self.container.css({'list-style': 'none',
                                    'overflow': 'hidden',
                                    'padding': '0px'});

                self.slides.css({'float': 'left'});
        };

        /*
        *        currentItem : return the current item
        */
        Feather.prototype.currentItem = function() {
                var self = this;
                var current = self.container.find('.' + self.current_class);

                return (current.length == 0) ? (self.slides.first('li')) : current.first();
        };

        /*
        *        nextItem : return the next item compared to the current item
        */
        Feather.prototype.nextItem = function() {
                var self = this;

                /*
                *        current = current slide
                */
                var current = self.currentItem();

                /*
                *        index = index of the current slide
                */
                var index = current.index();

                /*
                *        next = next slide
                */
                var indexNext = (!self.settings.fullSliding) ? (index + 1) : (index + self.settings.visible);
                var next = self.container.find('li:nth-child(' + (indexNext + 1) + ')');

                /*
                *        check the loop
                */
                var lastItem = (index + self.settings.visible - 1) == (self.container.find('li').length - 1);
                if (!self.settings.loop && lastItem)
                    return null;

                next = (next.length == 0 || lastItem) ? self.slides.first('li') : next;

                return {
                    next : next,
                    nextIndex : next.index(),
                    current : current,
                    currentIndex : current.index(),
                };

        };

        /*
        *   next : sliding to the next item
        */
        Feather.prototype.next = function(callback) {
                var self = this;

                /*
                *        nextObj = object with the current item and the next item
                */
                var nextObj = self.nextItem();
                if (nextObj == null) return null;

                /*
                *        translate = translation of the list
                */
                var translate = (nextObj.nextIndex != 0) ? (-nextObj.current.outerWidth(true) * nextObj.nextIndex) : 0;
                /*
                *        call the translation's function with the actual context 'self'
                */
                translation(self, translate);

                nextObj.current.removeClass(self.current_class);
                nextObj.next.addClass(self.current_class);

                /*
                *        execution of the callback
                */
                (typeof callback === 'function') ? callback() : null;

                return nextObj.next;
        };

        /*
        *         : return the previous item compared to the current item
        */
        Feather.prototype.prevItem = function() {
                var self = this;

                /*
                *        current = current slide
                */
                var current = self.currentItem();

                /*
                *        index = index of the current slide
                */
                var index = current.index();

                /*
                *        prev = prev slide
                */
                var indexPrev = (!self.settings.fullSliding) ? (index) : (index + 1 - self.settings.visible);
                var prev = self.container.find('li:nth-child(' + (indexPrev) + ')');

                /*
                *        check the loop
                */
                if (!self.settings.loop && index == 0)
                    return null;

                /*
                *        check if the current element is not the first
                */
                if (prev.length == 0)
                {
                    indexPrev = self.slides.last('li').index() - self.settings.visible + 1;
                    prev = self.container.find('li:nth-child(' + (indexPrev + 1) + ')');
                }

                return {
                    current : current,
                    prev : prev,
                };
        };

        /*
        *   prev : sliding to the previous item
        */
        Feather.prototype.prev = function(callback) {
                var self = this;

                var prevObj = this.prevItem();
                if (prevObj == null) return null;

                /*
                *        translate = translation of the list
                */
                var currentWidth = -prevObj.current.outerWidth(true);
                var translate = (prevObj.prev.index() != 0 && prevObj.current.index() != 0) ? (currentWidth * prevObj.prev.index()) : 0;
                translate = (prevObj.current.index() == 0) ? (currentWidth * (prevObj.prev.index())) : translate;

                /*
                *        call the translation's function with the actual context 'self'
                */
                translation(self, translate);

                prevObj.current.removeClass(self.current_class);
                prevObj.prev.addClass(self.current_class);

                /*
                *        execution of the callback
                */
                (typeof callback === 'function') ? callback() : null;

                return prevObj.prev;
        };

        Feather.prototype.resize = function() {
                var self = this;

                /*
                *        self.init() : reinit all width
                */
                self.init();

                var current = self.currentItem();
                var index = current.index();
                (index != 0) ? translation(self, (-current.outerWidth(true) * index)) : null;
        };

        $.fn.feather = function(options) {
                return this.each(function() {
                        var data = $(this).attr('id') + "_api";
                        (!$.data(this, data)) ? ($.data(this, data, new Feather(this, options))) : null;
                });
        };
}(jQuery));
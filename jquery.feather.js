(function($) {

	"use strict";

	/*
	*	Default options
	*/
	var name = "feather";
	var version = 0.2;
	var defaults = {
			loop : true,
			currentItem_class : 'actual',
		};
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
		*	self.$el : parent div
		*/
		self.$el = $(el);
		/*
		*	self.settings : global settings
		*/
		self.settings = $.extend(defaults, opts);
		/*
		*	self.container : the div <ul>...</ul>
		*/
		self.container = self.$el.children('ul');
		/*
		*	self.slides : the divs <li>...</li>
		*/
		self.slides = self.container.children('li');
		
		/*********/
		/*
		*	self.current_class : class for the current element
		*/
		self.current_class = self.settings.currentItem_class;
		/*********/

		/*
		*	self.init() : initialize all width
		*/
		self.init();

		$(window).on('resize', function() {
			clearTimeout($.data(this, 'resizeTimer'));
		    $.data(this, 'resizeTimer', setTimeout(function() {
		    	self.resize();
		    }, 50));
		});

		return {
			nextSlide : function (callback) {
				return self.next(callback);
			},
			prevSlide : function(callback) {
				return self.prev(callback);
			},
			currentSlide : function() {
				return self.currentItem();
			},
		};
	};

	Feather.prototype.init = function() {
		var self = this;

		var parent_width = (self.$el.innerWidth() + 1);

		/* Set the container width */
		self.container.width(parent_width * self.slides.length);
		/* Set the slides width */
		self.slides.width(parent_width);

		self.defaultCss();

		if (self.container.find('.' + self.current_class).length == 0)
			self.slides.first().addClass(self.current_class);
	};

	Feather.prototype.defaultCss = function() {
		var self = this;

		self.$el.css('overflow', 'hidden');

		self.container.css({'list-style': 'none',
							'overflow': 'hidden',
							'padding': '0px'});

		self.slides.css({'float': 'left'});
	};

	Feather.prototype.next = function(callback) {
		var self = this;

		/*
		*	current = current slide
		*/
		var current = self.currentItem();

		/*
		*	index = index of the current slide
		*/
		var index = current.index();

		/*
		*	next = next slide
		*/
		var next = current.next();

		/*
		*	check the loop
		*/
		if (!self.settings.loop && index == (self.container.find('li').length - 1))
			return null;

		next = (next.length == 0) ? self.slides.first('li') : next;

		/*
		*	translate = translation of the list
		*/
		var translate = (next.index() != 0) ? (translate = -current.outerWidth(true) * (index + 1)) : 0;
		/*
		*	call the translation's function with the actual context 'self'
		*/
		translation(self, translate);

		current.removeClass(self.current_class);
		next.addClass(self.current_class);

		/*
		*	execution of the callback
		*/
		(typeof callback === 'function') ? callback() : null;

		return next;
	};

	Feather.prototype.prev = function(callback) {
		var self = this;

		/*
		*	current = current slide
		*/
		var current = self.currentItem();

		/*
		*	index = index of the current slide
		*/
		var index = current.index();

		/*
		*	prev = prev slide
		*/
		var prev = current.prev();

		/*
		*	check the loop
		*/
		if (!self.settings.loop && index == 0)
			return null;

		/*
		*	prev = prev slide
		*/
		prev = (prev.length == 0) ? self.slides.last('li') : prev;

		/*
		*	translate = translation of the list
		*/
		var currenWidth = -current.outerWidth(true);
		var translate = (prev.index() != 0 && index != 0) ? (currenWidth * (index - 1)) : 0;
		translate = (index == 0) ? (currenWidth * (self.slides.length - 1)) : translate;

		/*
		*	call the translation's function with the actual context 'self'
		*/
		translation(self, translate);

		current.removeClass(self.current_class);
		prev.addClass(self.current_class);

		/*
		*	execution of the callback
		*/
		(typeof callback === 'function') ? callback() : null;

		return prev;
	};

	/*
	*	current : return the current item <li>...</li>
	*/
	Feather.prototype.currentItem = function() {
		var self = this;
		var current = self.container.find('.' + self.current_class);

		return (current.length == 0) ? (self.slides.first('li')) : current.first();
	};

	Feather.prototype.resize = function() {
		var self = this;

		/*
		*	self.init() : reinit all width
		*/
		self.init();

		var current = self.currentItem();
		var index = current.index();
		(index != 0) ? translation(self, (-current.outerWidth(true) * index)) : null;
	};

	$.fn.feather = function(options) {
		return this.each(function() {
			var string = 'api_' + name;
			(!$.data(this, string)) ? ($.data(this, string, new Feather(this, options))) : null;
		});
	};
}(jQuery));
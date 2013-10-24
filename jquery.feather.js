(function($) {

	"use strict";

	/*
	*	Default options
	*/
	var name = "feather";
	var version = 0.1;
	var defaults = {
			/*
			*	default_css : Bool to use the default css
			*/
			default_css : true,
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
		if (self.$el.children('ul').length == 0)
			throw (name + ' : this current div does not contain any list <ul>...</ul> !');
		else if (self.$el.children('ul').length > 1)
			throw (name + ' : this current div does contain only one list <ul>...</ul> !');
		self.container = self.$el.children('ul');
		/*
		*	self.slides : the divs <li>...</li>
		*/
		if (self.container.children('li').length == 0)
			throw (name + ' : this current list does not contain any element <li>...</li> !');
		self.slides = self.container.children('li');
		/*
		*	self.init() : initialize all width
		*/
		self.init();

		$(window).on('resize', function() {
			clearTimeout($.data(this, 'resizeTimer'));
		    $.data(this, 'resizeTimer', setTimeout(function() {
		    	self.resize();
		    }, 200));
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

		if (self.settings.default_css)
			self.defaultCss();

		if (self.container.find('.actual').length == 0)
			self.slides.first().addClass('actual');
	};

	Feather.prototype.defaultCss = function() {
		var self = this;

		self.$el.css('overflow', 'hidden');

		self.container.css({'list-style': 'none',
							'overflow': 'hidden'});

		self.slides.css({'float': 'left'});
	};

	Feather.prototype.next = function(callback) {
		var self = this;

		/*
		*	current = current slide
		*/
		var current = self.currentItem();

		/*
		*	next = next slide
		*/
		var next = current.next();
		if (typeof next.html() === 'undefined') next = self.slides.first('li');

		/*
		*	translate = translation of the list
		*/
		var translate = 0;
		if (next.index() != 0)
			translate = -current.outerWidth(true) * (current.index() + 1);
		/*
		*	call the translation's function with the actual context 'self'
		*/
		translation(self, translate);

		current.removeClass('actual');
		next.addClass('actual');

		(typeof callback !== 'undefined' && typeof callback === 'function') ? callback() : null;

		return next;
	};

	Feather.prototype.prev = function(callback) {
		var self = this;

		/*
		*	current = current slide
		*/
		var current = self.currentItem();
		/*
		*	prev = prev slide
		*/
		var prev = current.prev();
		if (typeof prev.html() === 'undefined') prev = self.slides.last('li');

		/*
		*	translate = translation of the list
		*/
		var translate = 0;
		if (prev.index() != 0 && current.index() != 0)
			translate = -current.outerWidth(true) * (current.index() - 1);
		else if (current.index() == 0)
			translate = -current.outerWidth(true) * (self.slides.length - 1);
		/*
		*	call the translation's function with the actual context 'self'
		*/
		translation(self, translate);

		current.removeClass('actual');
		prev.addClass('actual');

		(typeof callback !== 'undefined' && typeof callback === 'function') ? callback() : null;

		return prev;
	};

	/*
	*	current : return the current item <li>...</li>
	*/
	Feather.prototype.currentItem = function() {
		var self = this;

				console.log("actual -> " + self.container.find('.actual').length);

		var current = self.slides.first('li');
		if (self.container.find('.actual').length != 0)
			current = self.container.find('.actual').first();
		return current;
	};

	Feather.prototype.resize = function() {
		var self = this;

		self.init();

		var current = self.currentItem();

		console.log("current -> " + current.index());

		if (current.index() != 0)
		{

			console.log(current.index());
			var translate = -current.outerWidth(true) * current.index();
			translation(self, translate);
		}
	};

	$.fn.feather = function(options) {
		return this.each(function() {
			if (!$.data(this, 'api_' + name)) {
				$.data(this, 'api_' + name, new Feather(this, options));
			}
		});
	};

}(jQuery));
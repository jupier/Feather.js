#[Feather.js](http://pieropanjulien.com/feather/)

Feather.js is an extremely Flexible and Lightweight (2Kb) Jquery Slider.

##Setup

###1. Include jQuery
	<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>

###2. Include Feather.js
	<script src="jquery.feather.js"></script> ...or	<script src="jquery.feather.min.js"></script>

###3. CSS
Feather.js don't need a CSS file for basic functionnalities. You can look at the demo for more details. 

###4. Javascript

	<script>
	    var feather = $('#mycarousel').feather({
	    	/* OPTIONS */
	    }).data('api_feather');
	</script>

You can use the API as bellow

- .nextSlide(callback) : to the next slide and return the jQuery context
- .prevSlide(callback) : to the previous slide and return the jQuery context
- .currentSlide(callback) : return the current jQuery context

###5. Options

| Option | Default | Type | Description
|-------|--------|-----|-----
| loop | true | bool |  false for turning off the infinite loop
| currentItem_class | actual | string | the css class of the current item (usefull for css3 transition :p)

##Changelog

Beta version

##License

Copyright (c) 2011-2013 GitHub, Inc. See the LICENSE file for license rights and limitations (MIT).
'use strict';

$('#opennav').on('click', function(){
	$('.navbar').toggleClass('navwidth');
});

$('#closenav').on('click', function(){
	$('.navbar').toggleClass('navwidth');
});

$('#about').on('click', function(){
	$('.about').fadeIn();
});

$('.closebtn').on('click', function(){
	$(this).closest('.modal').fadeOut();
});
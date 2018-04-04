'use strict';

$('#opennav').on('click', function(){
	$('.navbar').toggleClass('navwidth');
});

$('#closenav').on('click', function(){
	$('.navbar').toggleClass('navwidth');
});

//click listener for about
$('#about').on('click', function(){
	$('.about').fadeIn();
});

//click listner for user sign out
$('#signout').on('click', function(){
	$('.signout').fadeIn();
});

//click listner if the user chooses to not sign out
$('.signOutNo').on('click', function() {
	console.log('no: clicked');
	$(this).closest('.modal').fadeOut();
});

//click listner if the user chooses to sign out
$('.signOutYes').on('click', function(){ 
	console.log('yes:clicked');
	sessionStorage.removeItem('accessToken');
	sessionStorage.removeItem('userId');
	sessionStorage.removeItem('babyId');
	window.location = 'index.html';
});

$('.closebtn').on('click', function(){
	$(this).closest('.modal').fadeOut();
});

//this is a click listner that closes a modal if clicked away from the content or exscape is clicked
$(".modal").on("click",function(e){
	if(e.target === this){
		$(this).css("display", "none");
	}
});

///if the user press down on the escape key then display: none will be applied onto a modal
$(document).keydown(function(e){
	if (e.keyCode === 27) { 
		$(".modal").css("display", "none"); 
	} 
});
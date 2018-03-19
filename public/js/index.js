'use strict';

//this will display the logIn HTML
function logIn() {
    $('.login-register').on('click','.login', function(){
        console.log("log in: click");
        $('.login-register').html(logInTemplate());
        $('.login-register').addClass("box-structure");
    });
}

//this will display the signup HTML
function signUp() {
    $('.login-register').on('click','.signup', function(){
        console.log("sign up : click");
        $('.login-register').html(signUpTemplate());
        $('.login-register').addClass("box-structure");
    });
}

//this returns the html code for login form
function logInTemplate() {
    return `<form>
                <fieldset>
                    <legend class="login-register-title"> LOGIN</legend>
                    <label for="username">User Name:</label>
                    <br>
                    <input class="input-sizing" type="text" name="username">
                    <br>
                    <label for="password">Password:</label>
                    <br>
                    <input class="input-sizing" type="test" name="password">
                    <br>
                    <button class="loginButton" type="submit">Submit</button>
                </fieldset>
            </form>
            <a href="#" class="signup"><p class="toggleReg">Sign up</p></a>`;
}

//this function displays the signup HTML 
function signUpTemplate() {
    return `<form>
                <fieldset>
                    <legend class="login-register-title"> Sign Up</legend>
                    <label for="username">User Name:</label>
                    <br>
                    <input class="input-sizing" type="text" name="username">
                    <br>
                    <label for="password">Password:</label>
                    <br>
                    <input class="input-sizing" type="test" name="password">
                    <br>
                    <label for="firstname">First Name:</label>
                    <br>
                    <input class="input-sizing" type="test" name="firstname">
                    <br>
                    <label for="lastname">Last Name:</label>
                    <br>
                    <input class="input-sizing" type="test" name="lastname">
                    <br>
                    <label for="email">email:</label>
                    <br>
                    <input class="input-sizing" type="email" name="email">
                    <br>
                    <button class="loginButton" type="submit">Submit</button>
                </fieldset>
            </form>
            <a href="#" class="login"><p class="toggleReg">LogIn</p></a>`;
}

//this code runs exclusivly for the index page
function indexPage(){
    logIn()
    signUp()
}

$(indexPage());

// this is mock data, but when we create our API
// we'll have it return data that looks like this
let MILE_STATUS_UPDATES = {
	"milestoneUpdates": [
        {
            "id": "1111111",
            "milestone": "Birth of the baby (“Hello World”)",
            "description": "Bbay was born with out any issues",
            "date": "01/02/18"
        },
        {
            "id": "2222222",
            "milestone": "Baby’s first outing",
            "description": "We went to the park with the baby",
            "date": "01/08/18"
        },
        {
            "id": "333333",
            "milestone": "The umbilical cord fell off.",
            "description": "it fell off during bath time",
            "date": "01/17/18"
        },
        {
            "id": "4444444",
            "milestone": "Baby is able to move head side to side and even lift it up during tummy time.",
            "description": "He did it this after noon",
            "date": "1/20/18"
        }
    ]
};



// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getRecentStatusUpdates(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
	setTimeout(function(){ callbackFn(MILE_STATUS_UPDATES)}, 1);
}

// this function stays the same when we connect
// to real API later
function displayStatusUpdates(data) {
    for (let index in data.milestoneUpdates) {
	   $('body').append(
        `<p>${data.milestoneUpdates[index].date} ${data.milestoneUpdates[index].milestone}</p>`);
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayStatusUpdates() {
	getRecentStatusUpdates(displayStatusUpdates);
}

//  on page load do this
// $(getAndDisplayStatusUpdates());
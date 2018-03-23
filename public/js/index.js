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
                    <input class="input-sizing username-login" type="text" name="username">
                    <br>
                    <label for="password">Password:</label>
                    <br>
                    <input class="input-sizing password-login" type="test" name="password">
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
    logIn();
    signUp();
    SignInAuht();
}

//this function submits username & password and gets back jwt
function SignInAuht() {
    $('.login-register').on('submit', function(event){
        event.preventDefault();
        console.log("the submit button was pressed.")
        const username = $('.username-login').val();
        console.log(username);
        const password = $('.password-login').val();
        console.log(password);
        $.ajax({
          type: "POST",
          url: '/api/auth/login',
          data: JSON.stringify({
                "username": username,
                "password": password
            }),
          dataType: 'json',
          contentType: "application/json"
        })
        .done(function(json){
            console.log(json);
            window.open('/dashboard.html');
        });
        // $.post('/api/auth/login', {
        // "username": username,
        // "password": password
        // });
        // .done(function(data) {
        //     console.log(data);
        // });
    })
}

//
function sendToken(data) {
    
}

//
function postLogIn(username, password) {
    return {
        "username": username,
        "password": password
    };
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
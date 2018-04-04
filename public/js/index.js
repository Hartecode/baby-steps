'use strict';

//this will display the logIn HTML
function logIn() {
    $('.login-register').on('click','.login', function(){
        console.log("log in: click");
        $('.login-register').html(logInTemplate());
        $('.login-register').addClass("box-structure ");
    });
}

//this will display the signup HTML
function signUp() {
    $('.login-register').on('click','.signup', function(){
        console.log("sign up : click");
        $('.login-register').html(signUpTemplate());
        $('.login-register').addClass("box-structure ");
    });
}

//this returns the html code for login form
function logInTemplate() {
    return `<form autocomplete="on">
                <fieldset>
                    <legend class="login-register-title"> LOGIN</legend>
                    <label for="username">User Name:</label>
                    <br>
                    <input class="input-sizing username-login" type="text" name="username" required>
                    <br>
                    <label for="password">Password:</label>
                    <br>
                    <input class="input-sizing password-login" type="test" name="password" required>
                    <br>
                    <button class="loginButton signingInAcc" type="submit">Submit</button>
                </fieldset>
            </form>
            <a href="#" class="signup"><p class="toggleReg">Sign up</p></a>`;
}

//this function displays the signup HTML 
function signUpTemplate() {
    return `<form autocomplete="on">
                <fieldset>
                    <legend class="login-register-title"> Sign Up</legend>
                    <label for="username">User Name:</label>
                    <br>
                    <input class="input-sizing username-signup" type="text" name="username" pattern=".{1,}"   required title="1 characters minimum" required>
                    <br>
                    <label for="password">Password:</label>
                    <br>
                    <input class="input-sizing password-signup" type="test" name="password" pattern=".{10, 72}"   required title="3 characters minimum" required>
                    <br>
                    <label for="firstName">First Name:</label>
                    <br>
                    <input class="input-sizing firstname-signup" type="test" name="firstName" required>
                    <br>
                    <label for="lastName">Last Name:</label>
                    <br>
                    <input class="input-sizing lastname-signup" type="test" name="lastName" required>
                    <br>
                    <label for="email">email:</label>
                    <br>
                    <input class="input-sizing email-signup" type="email" name="email" required>
                    <br>
                    <button class="loginButton signingUpNewAcc" type="submit">Submit</button>
                </fieldset>
            </form>
            <a href="#" class="login"><p class="toggleReg">LogIn</p></a>`;
}


//this function submits username & password and gets back jwt
function signInAuht() {
    $('.login-register').on('click', '.signingInAcc', function(event){
        event.preventDefault();
        console.log("the submit button was pressed.");
        const username = $('.username-login').val();
        const password = $('.password-login').val();
        postAuthLogin(username,password);
    });
}

function postAuthLogin(username,password) {
    $.ajax({
          type: "POST",
          url: '/api/auth/login',
          data: JSON.stringify({
                "username": username,
                "password": password
            }),
          dataType: 'json',
          contentType: "application/json",
          error: error => console.log(error)
        })
        .done(function(json){
            console.log(json);
            //the jwt is stored in browser
            window.sessionStorage.accessToken = json.authToken;
            // localStorage.setItem('token', json.authToken);
            //the user Id is stored on to the browser
            localStorage.setItem('userId', json.userId);
            window.location = 'dashboard.html';
        });
}

//this function submits a new userinfo & longsIn
function signUpAuth(){
    console.log("signUpAuth: running");
    $('.login-register').on('click', '.signingUpNewAcc', function(event){
        event.preventDefault();
        console.log("the submit button was pressed.");
        const username = $('.username-signup').val();
        const password = $('.password-signup').val();
        const firstname = $('.firstname-signup').val();
        console.log(firstname);
        const lastname = $('.lastname-signup').val();
        console.log(lastname);
        const email = $('.email-signup').val();
        $.ajax({
            type:'POST',
            url: '/api/users',
            data: JSON.stringify({
                "username": username,
                "password": password,
                "firstName": firstname,
                "lastName": lastname,
                "email": email
            }),
            dataType: 'json',
            contentType: "application/json",
            error: error => console.log(error)
        })
        .done(function(json){
            console.log(json);
            postAuthLogin(username, password);
        });

    });
}


//this code runs exclusivly for the index page
function indexPage(){
    logIn();
    signUp();
    signInAuht();
    signUpAuth();
}


//run code
$(indexPage());
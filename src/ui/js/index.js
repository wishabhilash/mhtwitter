'use strict';


class Auth {

    constructor() {
        this.authService = new AuthService();
        this.accessToken = localStorage.getItem('accessToken', null);
        this.refreshToken = localStorage.getItem('refreshToken', null);
        
        // Check if accessToken is valid and if valid login user
        this._autoSignin()
    }

    _autoSignin() {
        let self = this;
        self.validateAccessToken()
        .then(function(data){
            // self._goToHome()
        }).catch(function(err){
            console.log(err);
        });
    }

    _setAccessToken (accessToken) {
        localStorage.setItem('accessToken', accessToken);
    }

    _setRefreshToken (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    }

    _getAccessToken (accessToken) {
        return localStorage.getItem('accessToken', null);
    }

    _getRefreshToken (refreshToken) {
        return localStorage.getItem('refreshToken', null);
    }

    signin() {
        let self = this;
        this.validateAccessToken()
        .then(function(){
            self._goToHome()
        }).catch(function(err){
            return self._fetchTokens()
        }).then(function(data){
            self._goToHome();
        }).catch(function(e) {
            console.log(e);
        })
    }

    validateAccessToken() {
        let accessToken = this._getAccessToken()
        return this.authService.validateAccessToken(accessToken);
    }

    _fetchTokens() {
        let email = $('.signin-email input').val();
        let password = $('.signin-password input').val();
        
        this.authService.signin(email, password)
        .then(function(data) {
            this._setAccessToken(data.data['access_token'])
            this._setRefreshToken(data.data['refresh_token'])
            return data;
        });
    }

    _goToHome() {
        document.location = "/home";
    }

    signup() {
        var self = this;
        let name = $('.signup-name input').val();
        let email = $('.signup-email input').val();
        let password = $('.signup-password input').val();
        
        this.authService.signup(name, email, password)
        .then(function (argument) {
            self._goToSigninPage();
        }).catch(function() {
            self._goToSignupPage();
        })
    }

    _goToSigninPage() {
        document.location = '/?show=signin';
    }

    _goToSignupPage() {
        document.location = '/?show=signup';
    }
}

class AuthService {
    signup(name, email, password) {
        return $.ajax({
            url: "/auth/signup.json",
            type: 'POST',
            data: {
                name: name,
                email: email,
                password: password
            }
        });
    }

    signin(email, password) {
        return $.ajax({
            url: "/auth/signin.json",
            method: 'POST',
            context: this,
            data: {
                email: email,
                password: password
            }
        });
    }

    validateAccessToken(accessToken) {
        return $.ajax({
            url: "/auth/validate-token.json",
            method: 'POST',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            }
        });
    }
}


function indexPageView() {
    if (location.search.length) {
        let params = location.search.substring(1).split('=')
        console.log(params)
        if(params[1] == 'signup') {
            $(".signin").hide();
        } else if(params[1] == 'signin') {
            $(".signup").hide();
        }
    }
}

$(function(){
    indexPageView();

    let auth = new Auth();
    $('.signin-submit').click(function (argument) {
        auth.signin();
    });

    $('.signup-submit').click(function (argument) {
        auth.signup()
    });
    
})
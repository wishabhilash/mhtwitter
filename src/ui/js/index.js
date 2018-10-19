'use strict';


class Auth {

    constructor() {
        let self = this;
        this.accessToken = localStorage.getItem('accessToken', null);
        this.refreshToken = localStorage.getItem('refreshToken', null);
        
        // Check if accessToken is valid and if valid login user
        self.validateAccessToken()
        .then(function(data){
            self._goToHome()
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
        return $.ajax({
            url: "/auth/validate-token.json",
            method: 'POST',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            }
        })
    }

    _fetchTokens() {
        let email = $('.signin-email input').val();
        let password = $('.signin-password input').val();
        return $.ajax({
            url: "/auth/signin.json",
            method: 'POST',
            context: this,
            data: {
                email: email,
                password: password
            }
        }).done(function(data) {
            this._setAccessToken(data.data['access_token'])
            this._setRefreshToken(data.data['refresh_token'])
            return data;
        });
    }

    _goToHome() {
        document.location = "/home";
    }

    signup() {
        
    }
}


$(function(){
    let auth = new Auth();
    $('.signin-submit').click(function (argument) {
        auth.signin();
    })
    
    auth.signup()
})
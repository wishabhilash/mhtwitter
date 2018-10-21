'use strict';
import {UserService, TweetService, FollowerService} from "/asset/js/services.js";

export default class DefaultView {
    constructor(oid) {
        this.userService = new UserService();
        this.tweetService = new TweetService();
        this.followerService = new FollowerService();

        this.accessToken = localStorage.getItem('accessToken', null);
        if (!this.accessToken) {
            this.goToSignin();
        }

        if (oid == undefined) {
            oid = this.parseJwt(this.getAccessToken()).identity;
        }

        this._setupView(oid)
    }

    getAccessToken() {
        return this.accessToken;
    }

    _setupView(oid) {
        // TO BE IMPLEMENTED
    }

    _setupUserProfile(data) {
        $('.header .name h4').html(`<a href="/user/${data.oid}">${data.name.toUpperCase()}</a>`)
        $('.header .email h6').html(data.email)
    }

    _setupUserSuggestions(data) {
        let userSuggestions = this._renderUserCell(data);
        $('.user-suggestions .users-list').html(userSuggestions);
    }

    parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    };

    goToSignin() {
        window.location = "/?show=signin";
    }

    getSignedInUserOid() {
        this.accessToken = localStorage.getItem('accessToken', null);
        return this.parseJwt(this.accessToken).identity;
    }

}

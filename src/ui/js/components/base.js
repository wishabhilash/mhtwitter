'use strict';

export default class BaseComponent {
    constructor(tagName) {
        this.tagName = tagName;

    }

    run() {
        if (this.tagName == undefined) {
            throw "tagName is undefined.";
        }
        $(this.tagName).html(this._render());
        this._bindEvents();
    }

    _render() {

    }

    _bindEvents() {

    }

    _parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }

    _getSignedInUserOid() {
        this.accessToken = localStorage.getItem('accessToken', null);
        return this._parseJwt(this.accessToken).identity;
    }


}
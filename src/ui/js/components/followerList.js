'use strict';

import BaseComponent from "/asset/js/components/base.js";
import {FollowerService} from "/asset/js/services.js";

export default class FollowerList extends BaseComponent {
    constructor(tagName) {
        super(tagName);
        let self = this;
        this.followerService = new FollowerService();
        this.signedInUser = this._getSignedInUserOid();
    }

    run() {
        let self = this;
        if (this.tagName == undefined) {
            throw "tagName is undefined.";
        }
        this.followerService.getFollowers(this.signedInUser)
        .then(function(data) {
            $(self.tagName).html(self._render(data.data));
            self._bindEvents();
        })
    }

    _render(users) {
        let userCells = users.map(function(user) {
            if(user == undefined) return;
            return `<div class="user">
                        <div class="name">
                            <a href="/user/${user.oid}">${user.name}</a>
                        </div>
                        <div class="email">${user.email}</div>
                    </div>`;
        }).join('')
        return `<div class="followers">
                <div>Followers (<span class="followers-count">0</span>)</div>
                <div class="users-list">
                    ${userCells}
                </div>
            </div>`;
    }
}
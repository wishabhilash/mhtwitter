'use strict';

import FollowerList from "/asset/js/components/followerList.js";
import {UserService} from "/asset/js/services.js";

export default class UserSuggestions extends FollowerList {
    constructor(tagName, userOid) {
        super(tagName);
        this.userService = new UserService();
        this.userOid = userOid;
    }

    run() {
        let self = this;
        if (this.tagName == undefined) {
            throw "tagName is undefined.";
        }
        let followersPromise = this.followerService.getFollowers(this.signedInUser);
        let usersPromise = self.userService.getUsers();

        $.when(followersPromise, usersPromise)
        .then(function(followers, users){
            let followerList = followers.map(function(follower) {
                return follower.oid;
            });
            followerList.push(self.userOid);
            let userSuggestions = users[0].data.map(function(user){
                if ($.inArray(user.oid, followerList) < 0) {
                    return user;
                }
            })
            $(self.tagName).html(self._render(userSuggestions));
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
        return `<div class="user-suggestions">
                <div>User suggestions</div>
                <div class="users-list">
                    ${userCells}
                </div>
            </div>`;
    }
}
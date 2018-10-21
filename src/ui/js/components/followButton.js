'use strict';

import BaseComponent from "/asset/js/components/base.js";
import {FollowerService} from "/asset/js/services.js";

export default class FollowButton extends BaseComponent {
    constructor(tagName, leaderOid) {
        super(tagName);
        let self = this;
        this.followerService = new FollowerService();
        this.followerOid = this._getSignedInUserOid();
        this.leaderOid = leaderOid;
        this.isAlreadyFollowing = true;
    }

    run() {
        let self = this;
        if (this.tagName == undefined) {
            throw "tagName is undefined.";
        }
        this.isFollowing().then(function(data){
            self.isAlreadyFollowing = data;
            $(self.tagName).html(self._render());
            self._bindEvents();
        })
    }

    isFollowing() {
        let self = this;
        return this.followerService.getFollowers(this.leaderOid)
        .then(function (data) {
            let _isFollowing = false;
            if(self.leaderOid != self.followerOid) {
                $.each(data.data, function(index, follower) {
                    if (self.followerOid == follower.oid)
                        _isFollowing = true;
                })
            } else {
                _isFollowing = true;
            }
            
            return _isFollowing;
        });
    }

    _render() {
        if (!this.isAlreadyFollowing)
            return `<button type="button" id="follow-button">Follow</button>`;
        else
            return ``;
    }

    _bindEvents() {
        let self = this;
        $("#follow-button").click(function(){
            self._followUser(self.leaderOid, self.followerOid);
        })
    }

    _followUser(leaderOid, followerOid) {
        if(leaderOid == undefined || followerOid == undefined)
            throw "Invalid user id's.";

        this.followerService.followUser(leaderOid, followerOid)
        .then(function(){
            window.location.reload();
        });
    }
}
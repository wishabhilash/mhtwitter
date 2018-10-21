'use strict';

import DefaultView from "/asset/js/views.js";
import TweetModal from "/asset/js/tweetModal.js";

class Profile extends DefaultView {
    
    _setupView(oid) {
        let self = this;
        this.userService.getUser(oid)
        .then(function(data) {
            self._setupUserProfile(data.data)
        });

        this.tweetService.getTweetsOfUser(oid)
        .then(function(data) {
            self._setupUserTweet(data.data);
        })

        this.followerService.getFollowers(oid)
        .then(function (data) {
            self._setupFollowers(data.data);
            // self._setUpFollowButton(data.data, oid);
        });
    }

    _setUpFollowButton(data, userOid) {
        $.each(data, function(index, user) {
            if(user.oid == userOid) {
                $('.follow-button').hide();
            }
        })
    }

    _setupUserTweet(data) {
        let tweetHtml = this._renderTweets(data.tweets);
        $('.tweet-area').html(tweetHtml);
    }

    followUser(leader_oid, follower_oid) {
        this.followerService.followUser(leader_oid, follower_oid)
        .then(function(){
            window.location.reaload();
        });
    }
}

function goToSignin() {
    window.location = "/?show=signin";
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

$(function(){
    let accessToken = localStorage.getItem('accessToken', null);
    if (!accessToken) {
        goToSignin();
    }
   
    let hrefSplit = location.href.split('/');
    let profile_user_oid = hrefSplit[hrefSplit.length-1].trim('#')
    let profile = new Profile(profile_user_oid);
    let oid = parseJwt(accessToken).identity;

    let tweetModal = new TweetModal();
    tweetModal.run()

    tweetModal.onTweetPublish = function (tweetContent) {
        home.postTweet(oid, tweetContent).then(function(){
            tweetModal.closeModal();
        });
    }

    $(".follow-button").click(function(){
        let user_oid = parseJwt(accessToken).identity;
        profile.followUser(profile_user_oid, user_oid);
    })

    $(".page-controls .logout").click(function() {
        localStorage.clear();
        goToSignin();
    })

    $(".page-controls .post-tweet").click(function(){
        tweetModal.openModal();
    })


});
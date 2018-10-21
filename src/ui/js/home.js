'use strict';

import DefaultView from "/asset/js/views.js";
import TweetModal from "/asset/js/tweetModal.js";

class Home extends DefaultView {

    _setupView(oid) {
        let self = this;
        this.userService.getUser(oid)
        .then(function(data) {
            self._setupUserProfile(data.data)
        });

        this.tweetService.getTweetsOfFollowers(oid)
        .then(function(data) {
            self._setupFollowersTweet(data.data);
        })

        let followersPromise = this.followerService.getFollowers(oid)
        .then(function (data) {
            self._setupFollowers(data.data);
            return data.data;
        });

        let usersPromise = self.userService.getUsers();

        $.when(followersPromise, usersPromise)
        .then(function(followers, users){
            let followerList = followers.map(function(follower) {
                return follower.oid;
            });
            followerList.push(oid);
            let userSuggestions = users[0].data.map(function(user){
                if ($.inArray(user.oid, followerList) < 0) {
                    return user;
                }
            })
            self._setupUserSuggestions(userSuggestions);
        })
    }
    
    _setupUserSuggestions(data) {
        let userSuggestions = this._renderUserCell(data);
        $('.user-suggestions .users-list').html(userSuggestions);
    }

    _setupFollowersTweet(data) {
        let tweets = data.tweets.map(function(tweet) {
            return {
                oid: tweet.oid,
                tweet: tweet.tweet,
                created_at: tweet.created_at,
                name: tweet.follower.name,
                email: tweet.follower.email,
                follower_oid: tweet.follower.oid,
            }
        })
        let tweetHtml = this._renderTweets(tweets);
        $('.tweet-area').html(tweetHtml);
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

function goToSignin() {
    window.location = "/?show=signin";
}

$(function(){
    let accessToken = localStorage.getItem('accessToken', null);
    if (!accessToken) {
        goToSignin();
    }
    let oid = parseJwt(accessToken).identity;
    let home = new Home(oid);

    let tweetModal = new TweetModal();
    tweetModal.run()

    tweetModal.onTweetPublish = function (tweetContent) {
        home.postTweet(oid, tweetContent).then(function(){
            tweetModal.closeModal();
        });
    }

    $(".page-controls .logout").click(function() {
        localStorage.clear();
        goToSignin();
    })

    $(".page-controls .post-tweet").click(function(){
        tweetModal.openModal();
    })
});
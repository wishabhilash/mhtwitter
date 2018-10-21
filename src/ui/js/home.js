'use strict';

import {UserService, TweetService, FollowerService} from "/asset/js/services.js";


class Home {
    constructor(oid) {
        this.userService = new UserService();
        this.tweetService = new TweetService();
        this.followerService = new FollowerService();
        this._setupHome(oid)
    }

    _setupHome(oid) {
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

    postTweet(userOid, tweet) {
        return this.tweetService.postTweet(userOid, tweet)
    }

    _setupUserProfile(data) {
        $('.header .name h4').html(`<a href="/user/${data.oid}">${data.name.toUpperCase()}</a>`);
        $('.header .email h6').html(data.email);
    }

    _setupFollowers(data) {
        let followerHtml = this._renderUserCell(data);
        $('.left-sidebar .followers .users-list').html(followerHtml);
    }

    _setupUserSuggestions(data) {
        let userSuggestions = this._renderUserCell(data);
        $('.user-suggestions .users-list').html(userSuggestions);
    }

    _setupUserTweet(data) {
        let tweetHtml = this._renderTweets(data.tweets);
        $('.tweet-area').html(tweetHtml);
    }

    _renderUserCell(users) {
        return users.map(function(user) {
            if(user == undefined) return;
            return `<div class="user">
                        <div class="name">
                            <a href="/user/${user.oid}">${user.name}</a>
                        </div>
                        <div class="email">${user.email}</div>
                    </div>`;
        }).join('')
    }

    _renderTweets(tweets) {
        return tweets.map(function(tweet) {
            return `<div class="tweet-box">
                <div class="content">${tweet.tweet}</div>
                <div class="meta">
                    <div class="name">
                        <a href="/user/${tweet.follower_oid}">${tweet.name} (${tweet.email})</a>
                    </div>
                    <div class="timestamp">${tweet.created_at}</div>
                </div>
            </div>`;
        }).join('')
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

    $(".page-controls .logout").click(function() {
        localStorage.clear();
        goToSignin();
    })

    $('.overlay .tweet-modal .modal-body textarea').keyup(function() {
        let tweetLength = $('.overlay .tweet-modal .modal-body textarea').val().length;
        $('.overlay .tweet-modal .modal-body .char-count').html(`(${tweetLength}/280)`);
        if (tweetLength > 280) {
            $('.overlay .tweet-modal .modal-body .char-count').css('color', 'red');
            $('.overlay .tweet-modal .modal-body .tweet-publish-button').hide();
        } else {
            $('.overlay .tweet-modal .modal-body .char-count').css('color', 'black');
            $('.overlay .tweet-modal .modal-body .tweet-publish-button').show();
        }
    })

    $(".page-controls .post-tweet").click(function(){
        $('.overlay').show();
    })

    $('.overlay .tweet-modal .modal-body .tweet-cancel-button').click(function() {
        $('.overlay').hide();
    })

    $('.overlay .tweet-modal .modal-body .tweet-publish-button').click(function() {
        let tweetContent = $('.overlay .tweet-modal .modal-body textarea').val();
        if(!tweetContent.length) return false;

        home.postTweet(oid, tweetContent).then(function(){
            $('.overlay .tweet-modal .modal-body .tweet-cancel-button').click();
        });
    })
});
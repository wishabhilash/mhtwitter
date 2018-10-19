'use strict';

class BaseService {
    constructor() {
        this.accessToken = localStorage.getItem('accessToken', null);
    }

    _ajax(url, method, data) {
        var self = this;
        if (url == undefined) {
            return false;
        }

        if (method == undefined) {
            method = 'GET';
        }

        if (data == undefined) {
            data = {};
        }
        return $.ajax({
            url: url,
            type: method.toUpperCase(),
            data: data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + self.accessToken);
            }
        })
    }
}

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
            let userSuggestions = users[0].data.map(function(user){
                if ($.inArray(user.oid, followerList) < 0) {
                    return user;
                }
            })
            console.log(userSuggestions)
            self._setupUserSuggestions(userSuggestions);
        })
    }

    _setupUserProfile(data) {
        $('.header .name h4').html(data.name.toUpperCase())
        $('.header .email h6').html(data.email)
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

class UserService extends BaseService {
    getUser(oid) {
        return this._ajax("/user/" + oid + '.json');
    }

    getUsers() {
        return this._ajax("/user.json");
    }
}

class TweetService extends BaseService{
    constructor() {
        super();
        this.followerService = new FollowerService();
        
    }

    getTweetsOfUser(oid) {
        return this._ajax("/tweet/" + oid + '.json')
    }

    getTweetsOfFollowers(oid) {
        return this._ajax("/follower/" + oid + "/tweets.json")
    }

    postTweet(tweet) {

    }
}


class FollowerService extends BaseService{
    getFollowers(userOid) {
        return this._ajax("/follower/" + userOid + '.json');
    }

    followUser(userOid) {

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

    $(".logout a").click(function() {
        localStorage.clear();
        goToSignin();
    })
});
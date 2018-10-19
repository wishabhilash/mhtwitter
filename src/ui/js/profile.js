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

class Profile {
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
                    <div class="name">${tweet.name}</div>
                    <div class="timestamp">${tweet.created_at}</div>
                </div>
            </div>`;
        }).join('')
    }

    _setupFollowersTweet(data) {
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

    followUser(leader_oid, follower_oid) {
        return this._ajax("/follower.json", 'POST', {
            leader_oid: leader_oid,
            follower_oid: follower_oid
        })
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
    let profile_user_oid = hrefSplit[hrefSplit.length-1]
    let profile = new Profile(profile_user_oid);

    $(".follow-button").click(function(){
        let user_oid = parseJwt(accessToken).identity;
        profile.followUser(profile_user_oid, user_oid);
    })

    $(".logout a").click(function() {
        localStorage.clear();
        goToSignin();
    })
});
'use strict';

export default class BaseService {
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

    postTweet(userOid, tweet) {
        return this._ajax('/tweet.json', 'POST', {
            'oid': userOid,
            'content': tweet
        })
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

export {UserService, FollowerService, TweetService};
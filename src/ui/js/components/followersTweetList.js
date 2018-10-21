'use strict';

'use strict';

import TweetList from "/asset/js/components/tweetList.js";
import {TweetService} from "/asset/js/services.js";

export default class FollowersTweetList extends TweetList {
    run() {
        let self = this;
        if (this.tagName == undefined) {
            throw "tagName is undefined.";
        }
        this.tweetService.getTweetsOfFollowers(this.userOid)
        .then(function(data) {
            let followersTweetData = data.data.map(function(tweet) {
                return {
                    oid: tweet.oid,
                    tweet: tweet.tweet,
                    created_at: tweet.created_at,
                    name: tweet.follower.name,
                    email: tweet.follower.email,
                    follower_oid: tweet.follower.oid,
                }
            })
            $(self.tagName).html(self._render(data.data));
            self._bindEvents();
        })
    }
}
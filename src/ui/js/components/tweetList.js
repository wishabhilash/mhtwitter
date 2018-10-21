'use strict';

import BaseComponent from "/asset/js/components/base.js";
import {TweetService} from "/asset/js/services.js";

export default class TweetList extends BaseComponent {
    constructor(tagName, userOid) {
        super(tagName);
        let self = this;
        this.userOid = userOid;
        this.tweetService = new TweetService();
    }

    run() {
        let self = this;
        if (this.tagName == undefined) {
            throw "tagName is undefined.";
        }
        this.tweetService.getTweetsOfUser(this.userOid)
        .then(function(data) {
            $(self.tagName).html(self._render(data.data));
            self._bindEvents();
        })
    }

    _render(tweets) {
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
}
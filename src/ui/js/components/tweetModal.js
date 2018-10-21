'use strict';

import BaseComponent from "/asset/js/components/base.js";
import TweetService from "/asset/js/services.js";

export default class TweetModal extends BaseComponent {
    constructor(tagName) {
        super(tagName)
        this.tweetService = new TweetService();
        this.signedInUserOid = this._getSignedInUserOid();
    }

    _render() {
        return `<div class="overlay">
            <div class="tweet-modal">
                <div class="modal-header">Chirp</div>
                <div class="modal-body">
                    <div class="tweet-input">
                        <textarea placeholder="What's on your mind?"></textarea>
                    </div>
                    <div class="tweet-controls">
                        <span class="char-count">(0/280)</span>
                        <button class="tweet-cancel-button" type="button">Cancel</button>
                        <button class="tweet-publish-button" type="button">Publish</button>
                    </div>
                </div>
            </div>
        </div>`;
    }

    _bindEvents() {
        let self = this;
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

        $('.overlay .tweet-modal .modal-body .tweet-cancel-button').click(function() {
            $('.overlay').hide();
        })

        $('.overlay .tweet-modal .modal-body .tweet-publish-button').click(function() {
            let tweetContent = $('.overlay .tweet-modal .modal-body textarea').val();
            if(!tweetContent.length) return false;
            console.log(self.tweetService)
            self.tweetService.postTweet(self.signedInUserOid, tweetContent)
            .then(function(){
                self.onTweetPublished(tweetContent);
            })
        })
    }

    onTweetPublished() {

    }

    closeModal() {
        $('.overlay .tweet-modal .modal-body .tweet-cancel-button').click();
    }

    openModal() {
        $('.overlay').show();
    }
}

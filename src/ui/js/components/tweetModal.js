'use strict';

import BaseComponent from "/asset/js/components/base.js";
import {TweetService} from "/asset/js/services.js";

export default class TweetModal extends BaseComponent {
    constructor(tagName) {
        super(tagName)
        this.tweetService = new TweetService();
        this.signedInUserOid = this._getSignedInUserOid();
    }

    _render() {
        return `<div id="tweet-modal-overlay">
            <div class="tweet-modal">
                <div class="modal-header">Tweet</div>
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
        $('#tweet-modal-overlay .modal-body textarea').keyup(function() {
            let tweetLength = $('#tweet-modal-overlay .modal-body textarea').val().length;
            $('#tweet-modal-overlay .modal-body .char-count').html(`(${tweetLength}/280)`);
            if (tweetLength > 280) {
                $('#tweet-modal-overlay .modal-body .char-count').css('color', 'red');
                $('#tweet-modal-overlay .modal-body .tweet-publish-button').hide();
            } else {
                $('#tweet-modal-overlay .modal-body .char-count').css('color', 'black');
                $('#tweet-modal-overlay .modal-body .tweet-publish-button').show();
            }
        })

        $('#tweet-modal-overlay .modal-body .tweet-cancel-button').click(function() {
            $('#tweet-modal-overlay').hide();
        })

        $('#tweet-modal-overlay .modal-body .tweet-publish-button').click(function() {
            let tweetContent = $('#tweet-modal-overlay .modal-body textarea').val();
            if(!tweetContent.length) return false;
            
            self.tweetService.postTweet(self.signedInUserOid, tweetContent)
            .then(function(){
                self.onTweetPublished(tweetContent);
            })
        })
    }

    onTweetPublished() {

    }

    closeModal() {
        $('#tweet-modal-overlay .tweet-modal .modal-body .tweet-cancel-button').click();
    }

    openModal() {
        $('#tweet-modal-overlay').show();
    }
}

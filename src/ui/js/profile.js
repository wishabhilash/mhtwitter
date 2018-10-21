'use strict';

import DefaultView from "/asset/js/views.js";
import TweetModal from "/asset/js/components/tweetModal.js";
import FollowButton from "/asset/js/components/followButton.js";


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
        });

    }

    _setupUserTweet(data) {
        let tweetHtml = this._renderTweets(data.tweets);
        $('.tweet-area').html(tweetHtml);
    }
}


$(function(){
    let hrefSplit = location.href.split('/');
    let profile_user_oid = hrefSplit[hrefSplit.length-1];
    
    let profile = new Profile(profile_user_oid);
    let signedInUser = profile.parseJwt(profile.getAccessToken()).identity;

    let tweetModal = new TweetModal('tweetbox');
    tweetModal.onTweetPublished = function (tweetContent) {        
        tweetModal.closeModal();
    }
    tweetModal.run()
    
    let followButton = new FollowButton('followbutton', profile_user_oid);
    followButton.run();

    $(".page-controls .logout").click(function() {
        localStorage.clear();
        profile.goToSignin();
    })

    $(".page-controls .post-tweet").click(function(){
        tweetModal.openModal();
    })

});
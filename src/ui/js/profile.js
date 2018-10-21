'use strict';

import DefaultView from "/asset/js/views.js";
import TweetModal from "/asset/js/components/tweetModal.js";
import FollowButton from "/asset/js/components/followButton.js";
import TweetList from "/asset/js/components/tweetList.js";
import FollowerList from "/asset/js/components/followerList.js";

class Profile extends DefaultView {

    _setupView(oid) {
        let self = this;
        this.userService.getUser(oid)
        .then(function(data) {
            self._setupUserProfile(data.data)
        });

        let followerList = new FollowerList('followerslist')
        followerList.run()

        let tweetModal = new TweetModal('tweetbox');
        tweetModal.onTweetPublished = function (tweetContent) {        
            tweetModal.closeModal();
        }
        tweetModal.run()
        
        let followButton = new FollowButton('followbutton', oid);
        followButton.run();

        let tweetList = new TweetList('tweetlist', oid)
        tweetList.run()
    }
}


$(function(){
    let hrefSplit = location.href.split('/');
    let profile_user_oid = hrefSplit[hrefSplit.length-1];
    
    let profile = new Profile(profile_user_oid);

    
    $(".page-controls .logout").click(function() {
        localStorage.clear();
        profile.goToSignin();
    })

    $(".page-controls .post-tweet").click(function(){
        tweetModal.openModal();
    })

});
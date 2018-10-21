'use strict';

import DefaultView from "/asset/js/views.js";
import TweetModal from "/asset/js/components/tweetModal.js";
import FollowerList from "/asset/js/components/followerList.js";
import FollowersTweetList from "/asset/js/components/followersTweetList.js";
import UserSuggestions from "/asset/js/components/userSuggestions.js";

class Home extends DefaultView {
    constructor() {
        super()
    }

    _setupView(oid) {
        let self = this;
        this.userService.getUser(oid)
        .then(function(data) {
            self._setupUserProfile(data.data)
        });

        let tweetModal = new TweetModal('tweetbox');
        tweetModal.onTweetPublished = function (tweetContent) {
            tweetModal.closeModal();
        }
        tweetModal.run()

        let followerList = new FollowerList('followerslist')
        followerList.run()

        let followersTweetList = new FollowersTweetList('followerstweetlist', this.getSignedInUserOid())
        followersTweetList.run()

        let userSuggestions = new UserSuggestions('user-suggestions', oid);
        userSuggestions.run();

    }
    
    _setupUserSuggestions(data) {
        let userSuggestions = this._renderUserCell(data);
        $('.user-suggestions .users-list').html(userSuggestions);
    }
}

$(function(){
    let home = new Home();    
    $(".page-controls .logout").click(function() {
        localStorage.clear();
        home.goToSignin();
    })

    $(".page-controls .post-tweet").click(function(){
        tweetModal.openModal();
    })
});
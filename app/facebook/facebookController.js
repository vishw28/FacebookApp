/**
 * Created by Vishw on 12/17/2016.
 */

(function () {
    'use strict';

    angular.module('myApp.facebook')
        .controller('FacebookController',FacebookController);

    function FacebookController($facebook) {
        var fc = this;
        fc.loggedIn = false;
        fc.login = function () {
            $facebook.login().then(function () {
                console.log('Logged in!!');
                fc.loggedIn = true;
                refresh();
            })
        };

        fc.logout = function () {
            $facebook.logout().then(function () {
                console.log('Logged out!!');
                fc.loggedIn = false;
                refresh();
            })
        };

        function refresh() {
            $facebook.api("/me?fields=id,name,email,locale,gender,first_name,last_name,picture,link,permissions,posts").then(function (response) {
                    console.log(response);
                    fc.welcomeMsg = "Welcome " + response.name;
                    fc.loggedIn = true;
                    fc.userInfo = response;
                    $facebook.api('me/picture').then(function (response) {
                        fc.picture = response.data.url;
                        $facebook.api('/me/permissions').then(function (response) {
                            fc.permissions = response.data;
                            $facebook.api('/me/posts').then(function (response) {
                                fc.posts = response.data;
                            });
                        });
                    });
                },
                function (err) {
                    fc.welcomeMsg = "Please Login!";
                })
        };

        fc.postStatus = function () {
            var body = fc.body;
            console.log(body);
            console.log('form submitted');
            $facebook.api('me/feed','post',{message:body}).then(function (response) {
                fc.msg = "thanks for posting";
                refresh();
            });
        };
        refresh();
    }

})();
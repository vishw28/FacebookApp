/**
 * Created by Vishw on 12/16/2016.
 */

(function () {
    'use strict'

    angular.module('myApp.facebook', ['ngRoute','ngFacebook'])

        .config(['$routeProvider','$facebookProvider', function($routeProvider,$facebookProvider) {
            $routeProvider.when('/facebook', {
                templateUrl: 'facebook/facebook.html',
                controller: 'FacebookController',
                controllerAs:'fc'
            });
            $facebookProvider.setAppId('357320361303479');
            $facebookProvider.setPermissions('email','public_profile','user_posts','publish_actions','user_photos');
        }])

        .run(function($rootScope){
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        })

        .controller('FacebookController', ['$facebook',function($facebook) {
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
                    });
                },
                  function (err) {
                      fc.welcomeMsg = "Please Login!";
                  })
            };
            refresh();
        }]);
})();
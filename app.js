angular.module('dashboard', ['ngRoute', 'firebase'])

.controller('MainController', function($scope, $filter, $window) {

    var myFirebaseRef = new Firebase("https://sizzling-torch-2036.firebaseio.com/")

    myFirebaseRef.set({
        title: "Hello World!",
        author: "Firebase",
        location: {
            city: "San Francisco",
            state: "California",
            zip: 94103
        }
    });

    // myFirebaseRef.child("location/city").on("value", function(snapshot) {
    //     alert(snapshot.val());  // Alerts "San Francisco"
    // });

    // myFirebaseRef.createUser({
    //     email : "bobtony@firebase.com",
    //     password : "correcthorsebatterystaple"
    // }, function(error, userData) {
    //     if (error) {
    //         console.log("Error creating user:", error);
    //     } else {
    //         console.log("Successfully created user account with uid:", userData.uid);
    //     }
    // });

    // $scope.email

    myFirebaseRef.authWithPassword({
        email    : "bobtony@firebase.com",
        password : "correcthorsebatterystaple"
    }, function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Authenticated successfully with payload:", authData);
        }
    });
})

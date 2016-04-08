angular.module('dashboard', ['ngRoute', 'firebase'])

.controller('MainController', function($scope, $filter, $window, $location) {

    // Day name lookup
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    $scope.week = []
    var date = new Date()
    $scope.initWeek = function(day, date, month, year, weekLength) {
        var today = day
        if(weekLength == 5) {

        } else if(weekLength == 7) {
            if(day != 0) {
                date = date - day
                day = 0
            }
            for(var i = 0; $scope.week.length < weekLength; i++) {
                if(day == today) {
                    var isToday = true
                    console.log('true')
                } else {var isToday = false}
                $scope.week.push({date: days[day] + ' ' + month + '/' + date + '/' + year, content: 'You have no tasks for today!', currentDay: isToday})
                day++
                date++
            }
        } else {
            console.log('Invalid week length')
        }
    }
    $scope.initWeek(date.getDay(), date.getDate(), date.getMonth(), date.getFullYear(), 7)

    var myFirebaseRef = new Firebase("https://sizzling-torch-2036.firebaseio.com/")

    $scope.signUp = function(newEmail, newPassword) {
        myFirebaseRef.createUser({
            email : newEmail,
            password : newPassword
        }, function(error, userData) {
            if (error) {
                console.log("Error creating user:", error);
            } else {
                console.log("Successfully created user account with uid:", userData.uid);
            }
        });
        $scope.newEmail = ''
        $scope.newPassword = ''
    }

    $scope.signIn = function(email, password) {
        myFirebaseRef.authWithPassword({
            email : $scope.email,
            password : $scope.password
        }, function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                $location.path('/').replace(); // path not hash
                $scope.$apply()
            }
        }, {remember: "sessionOnly"});
    }

    // Save data
    var usersRef = myFirebaseRef.child("users");
    usersRef.set({
        cmspencer109: {
            date_of_birth: "November 11, 1999",
            full_name: "Christopher Spencer"
    },
        sonrisesoftware: {
            date_of_birth: "February 16, 1997",
            full_name: "Michael Spencer"
        }
    });

    // Update data
    var sonrisesoftwareRef = usersRef.child("sonrisesoftware");
    sonrisesoftwareRef.update({
        "favorite_sport": "Airsoft"
    });

    // Get data
    // Attach an asynchronous callback to read the data at our posts reference
    myFirebaseRef.child('users').on("value", function(snapshot) {
        console.log(snapshot.val());
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

})

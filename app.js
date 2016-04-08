angular.module('dashboard', ['ngRoute', 'firebase'])

.controller('MainController', function($scope, $filter, $window, $location) {

    // Day name lookup
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    $scope.week = []
    var date = new Date()

    $scope.day = date.getDay()
    $scope.date = date.getDate()
    $scope.month = date.getMonth()+1
    $scope.year = date.getFullYear()
    $scope.weekLength = 7

    $scope.initWeek = function(date, weekLength) {
        $scope.date = date
        if(weekLength == 5) {

        } else if(weekLength == 7) {
            if($scope.day != 0) {
                $scope.date = $scope.date - $scope.day
                $scope.day = 0
            }
            for(var i = 0; $scope.week.length < weekLength; i++) {

                // If its the current day
                var d = new Date()
                if($scope.date == d.getDate() && $scope.month == d.getMonth()+1 && $scope.year == d.getFullYear()) {
                    var isToday = true
                    var isMonth = true
                    var isYear = true
                } else {
                    var isToday = false
                    var isMonth = false
                    var isYear = false
                }

                $scope.week.push({date: days[$scope.day] + ' ' + $scope.month + '/' + $scope.date + '/' + $scope.year, content: 'You have no tasks for today!', currentDay: isToday, currentMonth: isMonth, currentYear: isYear})

                if($scope.date >= daysInMonth($scope.month, $scope.year)) { // going forwards
                    console.log('> than days in month')
                    $scope.month = $scope.month + 1
                    $scope.date = 0
                }
            //     else if($scope.date <= daysInMonth($scope.month, $scope.year)) {
            //        console.log('< than days in month')
            //        $scope.month = $scope.month - 1
            //        $scope.date = daysInMonth($scope.month, $scope.year) - 7
            //    }
                $scope.day++
                $scope.date++
            }
        } else {
            console.log('Invalid week length: ' + weekLength)
        }
    }
    $scope.initWeek($scope.date, $scope.weekLength)

    // Week nav functions
    $scope.nextWeek = function(date, weekLength) {
        $scope.week = []
        $scope.date = date + weekLength
        $scope.initWeek($scope.date, $scope.weekLength)
    }
    $scope.previousWeek = function(date, weekLength) {
        $scope.week = []
        $scope.date = date - weekLength
        $scope.initWeek($scope.date, $scope.weekLength)
    }

    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

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

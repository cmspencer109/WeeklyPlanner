angular.module('dashboard', ['ngRoute', 'firebase'])

.controller('MainController', function($scope, $filter, $window, $location) {

    // Day name lookup
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    $scope.week = []

    var now = moment()
    var current = moment()
    var weekLength = 7

    $scope.initWeek = function(moment, weekLength) {
        var startMoment = moment.startOf('week')
        $scope.startOfWeek = startMoment.format('D')
        $scope.startMonth = startMoment.format('MMMM')
        if(weekLength == 5) {

        } else if(weekLength == 7) {
            for(var i = 0; $scope.week.length < weekLength; i++) {
                var type = getType(startMoment.format('MM/DD/YYYY'), now.format('MM/DD/YYYY'))
                $scope.week.push({date: startMoment.format('dddd, MMMM D'), content: 'You have no tasks for today!', moment: startMoment, type: type})
                $scope.endOfWeek = startMoment.format('D')
                $scope.endMonth = startMoment.format('MMMM')
                startMoment.add(1, 'days').calendar()
            }
            startMoment.subtract(1, 'days').calendar()
        } else {
            console.log('Invalid week length: ' + weekLength)
        }
    }
    $scope.initWeek(current, weekLength)

    function getType(startMoment, now) {
        if(startMoment < now) {
            return 'past'
        }
        if(startMoment == now) {
            return 'present'
        }
        if(startMoment > now) {
            return 'future'
        }
    }

    // Week nav functions
    $scope.nextWeek = function() {
        $scope.week = []
        current = current.add(7, 'days')
        $scope.initWeek(current, weekLength)
    }
    $scope.previousWeek = function() {
        $scope.week = []
        current = current.subtract(7, 'days')
        $scope.initWeek(current, weekLength)
    }

    $scope.currentWeek = function() {
        $scope.week = []
        current = moment()
        $scope.initWeek(current, weekLength)
    }

    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    // Firebase
    var myFirebaseRef = new Firebase("https://weeklyplanner.firebaseio.com/")

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

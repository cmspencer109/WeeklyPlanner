angular.module('dashboard', ['ngRoute', 'firebase'])

.controller('MainController', function($scope, $filter, $window, $location) {

    // Firebase
    var myFirebaseRef = new Firebase("https://weeklyplanner.firebaseio.com/")

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


    // Dashboard
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] // Day name lookup

    $scope.week = []

    var now = moment()
    var current = moment()
    $scope.weekLengthOptions = [
        {name: '5 day week', value: 5},
        {name: '7 day week', value: 7}
    ]
    $scope.weekLength = '5' // Default weekLength

    options = [{
        name: 'Something Cool',
        value: 'something-cool-value'
    }, {
        name: 'Something Else',
        value: 'something-else-value'
    }];

    // Initialize week
    $scope.initWeek = function(moment, weekLength) {
        var startMoment = moment.startOf('week')
        $scope.startOfWeek = startMoment.format('D')
        $scope.startMonth = startMoment.format('MMMM')
        if(weekLength == 1) {
            // TODO: Blah, fix this stuff in comments
            // var startMoment = moment
            // $scope.startOfWeek = startMoment.format('D')
            // $scope.startMonth = startMoment.format('MMMM')
            // console.log($scope.startOfWeek)
            // console.log($scope.startMonth)
            for(var i = 0; $scope.week.length < weekLength; i++) {
                var type = getType(startMoment.format('MM/DD/YYYY'), now.format('MM/DD/YYYY'))
                var items = getItems(startMoment.format('MM-DD-YYYY'))
                $scope.week.push({date: startMoment.format('dddd, MMMM D'), items: items, moment: startMoment.format('MM-DD-YYYY'), type: type, weekLength: 1})
                $scope.endOfWeek = startMoment.format('D')
                $scope.endMonth = startMoment.format('MMMM')
                startMoment.add(1, 'days').calendar()
            }
        } else if(weekLength == 5) {
            var startMoment = moment.startOf('week').add(1, 'days')
            $scope.startOfWeek = moment.format('D')
            $scope.startMonth = moment.format('MMMM')
            console.log($scope.startOfWeek)
            console.log($scope.startMonth)
            for(var i = 0; $scope.week.length < weekLength; i++) {
                var type = getType(startMoment.format('MM/DD/YYYY'), now.format('MM/DD/YYYY'))
                var items = getItems(startMoment.format('MM-DD-YYYY'))
                $scope.week.push({date: startMoment.format('dddd, MMMM D'), items: items, moment: startMoment.format('MM-DD-YYYY'), type: type, weekLength: 5})
                $scope.endOfWeek = startMoment.format('D')
                $scope.endMonth = startMoment.format('MMMM')
                startMoment.add(1, 'days').calendar()
            }
            startMoment.subtract(1, 'days').calendar()
        } else if(weekLength == 7) {
            for(var i = 0; $scope.week.length < weekLength; i++) {
                var type = getType(startMoment.format('MM/DD/YYYY'), now.format('MM/DD/YYYY'))
                var items = getItems(startMoment.format('MM-DD-YYYY'))
                $scope.week.push({date: startMoment.format('dddd, MMMM D'), items: items, moment: startMoment.format('MM-DD-YYYY'), type: type, weekLength: 7})
                $scope.endOfWeek = startMoment.format('D')
                $scope.endMonth = startMoment.format('MMMM')
                startMoment.add(1, 'days').calendar()
            }
            startMoment.subtract(1, 'days').calendar()
        } else {
            console.log('Invalid week length: ' + weekLength)
        }
    }
    $scope.initWeek(current, $scope.weekLength)

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

    function getItems(startMoment) {
        // Check firebase to see if there are any objects with a date that matches startMoment
        // console.log('START MOMENT ' + startMoment)
        var itemsRef = myFirebaseRef.child('items')
        itemsRef.once("value", function(snapshot) {
            // console.log('start moment ' + startMoment)
            var item = snapshot.child(startMoment).val()
            // console.log('Item: ' + item)
            var a = snapshot.exists()
            // console.log(a)
        });

        // // Get a reference to items
        // var itemsRef = myFirebaseRef.child('items')
        // // Retrieve new items as they are added to our database
        // itemsRef.on("child_added", function(snapshot, prevChildKey) {
        //     var newItem = snapshot.val()
        //     // $scope.week.items.push(newItem.item)
        //     console.log("text: " + newItem.item)
        //     console.log("moment: " + newItem.moment)
        // })

        // If so, return an array of those items
        // Else, return an empty array
        return []
    }

    // Adding items
    $scope.addItem = function(day, item) {
        day.items.push(item) // Temp pushes to item array of that day
        // Save item to firebase
        var itemsRef = myFirebaseRef.child('items')
        itemsRef.child(day.moment).set({
            item: item,
            moment: day.moment
        });
        // Go back and check that day for items to load the just added item
        getItems(day.moment)
    }

    // Week nav functions
    $scope.nextWeek = function() {
        if($scope.weekLength == 1) {
            $scope.week = []
            current = current.add(1, 'days')
            $scope.initWeek(current, $scope.weekLength)
        } else {
            $scope.week = []
            current = current.add(7, 'days')
            $scope.initWeek(current, $scope.weekLength)
        }
    }
    $scope.previousWeek = function() {
        if($scope.weekLength == 1) {
            $scope.week = []
            current = current.subtract(1, 'days')
            $scope.initWeek(current, $scope.weekLength)
        } else {
            $scope.week = []
            current = current.subtract(7, 'days')
            $scope.initWeek(current, $scope.weekLength)
        }
    }
    $scope.currentWeek = function() {
        $scope.week = []
        current = moment()
        $scope.initWeek(current, $scope.weekLength)
    }

    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    // Goals
    $scope.shortGoals = []
    $scope.longGoals = []

    $scope.addShortGoal = function(goal) {
        // Add short term goal to firebase
        var shortGoalsRef = myFirebaseRef.child('shortGoals')
        shortGoalsRef.child(goal).set({
            item: goal,
            moment: now.format('MM-DD-YYYY')
        });
        shortGoalsRef.on('child_added', function(snapshot, prevChildKey) {
            var newShortGoal = snapshot.val();
            $scope.shortGoals.push({item: newShortGoal.item, moment: newShortGoal.moment})
        });
    }

    $scope.addLongGoal = function(goal) {
        // Add long term goal to firebase
    }

    // Accomplishments
    $scope.accomplishments = ['Asdfghjkl', 'Asdfghjkl', 'Asdfghjkl', 'Asdfghjkl']

    $scope.addAccomplishment = function(accomplishment) {
        console.log(accomplishment)
        $scope.accomplishments.push(accomplishment)
    }
})

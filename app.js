angular.module('dashboard', ['ngRoute', 'firebase'])

.controller('MainController', function($scope, $filter, $window, $location, $firebaseArray) {

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
        if(weekLength == 5) {
            var startMoment = moment.startOf('week').add(1, 'days')
            $scope.startOfWeek = moment.format('D')
            $scope.startMonth = moment.format('MMMM')
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

    var goalsRef = myFirebaseRef.child('goals')

    $scope.goals = $firebaseArray(goalsRef);

    $scope.addGoal = function(item) {

        $scope.goals.$add({ item: item, moment: now.format('MM-DD-YYYY')}).then(function(ref) {
            var id = ref.key();
            console.log("added record with id " + id);
            $scope.goals.$indexFor(id); // returns location in the array
        });

    }

    // Accomplishments

    var accomplishmentsRef = myFirebaseRef.child('accomplishments')

    $scope.accomplishments = $firebaseArray(accomplishmentsRef);

    $scope.addToAccomplishments = function(goal) {
        $scope.accomplishments.$add({ item: goal.item, moment: now.format('MM-DD-YYYY')}).then(function(ref) {
            var id = ref.key();
            console.log("added record with id " + id);
            $scope.accomplishments.$indexFor(id); // returns location in the array
        });
        $scope.goals.$remove(goal)
    }
})

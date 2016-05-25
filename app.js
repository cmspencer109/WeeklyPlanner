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

    // Dashboard

    var itemsRef = myFirebaseRef.child('items')
    $scope.items = $firebaseArray(itemsRef)

    $scope.addItem = function(newItem, dateItemGoesTo) {
        $scope.items.$add({ text: newItem, dateItemGoesTo: dateItemGoesTo, checked: false}).then(function(ref) {
            var id = ref.key()
            console.log("added record with id " + id)
            $scope.items.$indexFor(id) // returns location in the array
        });
    }

    // Update Firebase data for checked items using $save
    $scope.checkItem = function(item) {
        item.checked = !item.checked
        $scope.items.$save($scope.items.$indexFor(item.$id)).then(function(ref) {
            ref.key() === item.$id; // true
        });
    }

    $scope.itemTimeClicked = function(item) {
        alert(item.text + ' time has been clicked.')
        // TODO: Bring up time schedule dialog.
    }

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
                var moment = startMoment.format('MM-DD-YYYY')
                var items = $scope.items

                // TODO: Have items retain their checked value. (i.e. store in firebase)

                $scope.week.push({date: startMoment.format('dddd, MMMM D'), items: items, moment: moment, type: type, weekLength: 5})
                $scope.endOfWeek = startMoment.format('D')
                $scope.endMonth = startMoment.format('MMMM')
                startMoment.add(1, 'days').calendar()
            }
            startMoment.subtract(1, 'days').calendar()
        } else if(weekLength == 7) {
            for(var i = 0; $scope.week.length < weekLength; i++) {
                var type = getType(startMoment.format('MM/DD/YYYY'), now.format('MM/DD/YYYY'))
                var moment = startMoment.format('MM-DD-YYYY')
                var items = $scope.items

                $scope.week.push({date: startMoment.format('dddd, MMMM D'), items: items, moment: moment, type: type, weekLength: 7})
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

    $scope.weekLengthChanged = function(weekLength) {
        console.log('weekLengthChanged; now = ' + weekLength)
        $scope.week = []
        $scope.initWeek(current, weekLength)
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

    // Notes

    var notesRef = myFirebaseRef.child('notes')

    $scope.notes = $firebaseArray(notesRef);

    $scope.addNote = function(item) {
        $scope.notes.$add({ item: item, moment: now.format('MM-DD-YYYY')}).then(function(ref) {
            var id = ref.key();
            console.log("added record with id " + id);
            $scope.notes.$indexFor(id); // returns location in the array
        });
    }
})

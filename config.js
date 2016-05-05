angular.module('dashboard')

.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/dashboard.html',
            controller: 'MainController'
        })
        .when('/dashboard', {
            templateUrl: '/views/dashboard.html',
            controller: 'MainController'
        })
        .when('/dayview', {
            templateUrl: '/views/dayview.html',
            controller: 'MainController'
        })
        .when('/goals', {
            templateUrl: '/views/goals.html',
            controller: 'MainController'
        })
        .when('/notes', {
            templateUrl: '/views/notes.html',
            controller: 'MainController'
        })
        .when('/accomplishments', {
            templateUrl: '/views/accomplishments.html',
            controller: 'MainController'
        })
        .when('/about', {
            templateUrl: '/views/about.html',
            controller: 'MainController'
        })
        .when('/getstarted', {
            templateUrl: '/views/getstarted.html',
            controller: 'MainController'
        })
        .when('/login', {
            templateUrl: '/views/login.html',
            controller: 'MainController'
        })
        .when('/createaccount', {
            templateUrl: '/views/createaccount.html',
            controller: 'MainController'
        })
        .otherwise({redirectTo: '/'})
})

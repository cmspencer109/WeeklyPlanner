angular.module('dashboard')

.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/dashboard.html',
            controller: 'MainController'
        })
        .when('/objectives', {
            templateUrl: '/views/goals.html',
            controller: 'MainController'
        })
        .when('/achievements', {
            templateUrl: '/views/accomplishments.html',
            controller: 'MainController'
        })
        .when('/about', {
            templateUrl: '/views/about.html',
            controller: 'MainController'
        })
        .when('/gettingstarted', {
            templateUrl: '/views/gettingstarted.html',
            controller: 'MainController'
        })
        .when('/signin', {
            templateUrl: '/views/signin.html',
            controller: 'MainController'
        })
        .otherwise({redirectTo: '/'})
})

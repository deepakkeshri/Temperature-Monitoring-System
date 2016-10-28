//main js file for starting client/simulator

(function () {

    var app = angular.module('meanApp', ['ngRoute']);

    function config ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/'});
        // use the HTML5 History API
        //$locationProvider.html5Mode(true);
    }

    //run function
    function run($rootScope) {
        $rootScope.reload();
    }

    app.config(['$routeProvider', '$locationProvider', config]);
    app.run(['$route', run]);

})();
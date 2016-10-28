//Client class to display current temperature received from sensor

(function() {

    //angular app
    var app = angular.module('meanApp');
    var socket;

    //config
    function config ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
    }

    //run function
    function run($rootScope) {
        $rootScope.reload();
    }

    //home controller
    function HomeCtrl($scope) {
        var self = this;
        socket = io('/client');

        $scope.units = ["F", "C"];
        $scope.selectedUnit = "F";
        $scope.currentTemperature = 0;
        $scope.isConnected = true;
        $scope.isServerOnline = false;
        $scope.lastRefreshed = Date.now();

        //connect button
        $scope.connectBtn = function () {
            self.connect($scope);
        };

        //disconnect button
        $scope.disConnectBtn = function () {
            self.disconnect($scope);
        };

        //refresh button
        $scope.refreshBtn = function () {
            self.refresh($scope);
        };

        //get temperature from server
        socket.on('getTemperature', function (data) {
            self.processNewTemperature($scope, data);
        });

        //socket connected
        socket.on('connect', function () {
            $scope.isServerOnline = true;
            console.log('Client connected');
            $scope.$apply();
        });

        //socked disconnected
        socket.on('disconnect', function () {
            console.log('Client disconnected');
        });

        socket.on("connect_error", function() {
            $scope.isServerOnline = false;
            $scope.disConnectBtn();
            console.log('Connection Refused');
        });

    }

    //handler for connection
    HomeCtrl.prototype.connect =function($scope) {
        socket.connect();
        $scope.isConnected = true;
    };

    //handler for disconnection
    HomeCtrl.prototype.disconnect =function($scope) {
        socket.disconnect();
        $scope.isConnected = false;
    };

    //handler for disconnection
    HomeCtrl.prototype.refresh =function() {
        socket.emit("refresh");
    };

    //process new temperature value
    HomeCtrl.prototype.processNewTemperature =function($scope, data) {
        console.log('new temperature value ' + data['currentTemperature']);
        $scope.currentTemperature = data['currentTemperature'];
        if ($scope.selectedUnit == "C") {
            $scope.currentTemperature = ($scope.currentTemperature - 32) * (5 / 9);
        }
        $scope.lastRefreshed = Date.now();
        $scope.$apply();
    };

    //injection
    HomeCtrl.$inject = ['$scope'];

    app.controller('homeCtrl', HomeCtrl);
    app.config(['$routeProvider', config]);
    app.run(['$route', run]);

})();
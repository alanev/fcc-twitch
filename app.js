'use strict';

var app = angular.module('twitchAPI', []);

var channels = ['freecodecamp', 'storbeck', 'terakilobyte', 'habathcx', 'RobotCaleb', 'thomasballinger', 'noobs2ninjas', 'beohoff', 'brunofin', 'comster404', 'test_channel', 'cretetion', 'sheevergaming', 'TR7K', 'OgamingSC2', 'ESL_SC2'];
var getUrl = function getUrl(type, channel) {
    return 'https://api.twitch.tv/kraken/' + type + '/' + channel + '?callback=JSON_CALLBACK';
};

app.controller('twitchCtrl', function ($scope, $http) {

    $scope.status = 'all';
    $scope.channels = [];
    $scope.init = function () {
        channels.forEach(function (channel) {
            $http.jsonp(getUrl('channels', channel)).success(function (data) {
                var channelData = data;
                data.name = channel;
                $http.jsonp(getUrl('streams', channel)).success(function (_ref) {
                    var stream = _ref.stream;

                    channelData.stream = stream;
                    $scope.channels.push(channelData);
                });
            });
        });
    }();
}).filter('filterStreams', [function () {
    return function (input, param) {
        var output;
        switch (param) {
            case 'all':
                output = input;
                break;
            case 'online':
                output = input.filter(function (item) {
                    return item.stream;
                });
                break;
            case 'offline':
                output = input.filter(function (item) {
                    return !item.stream && !item.error;
                });
                break;
        }
        return output;
    };
}]);

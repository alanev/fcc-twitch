const app = angular.module('twitchAPI', []);

const channels = ['freecodecamp', 'storbeck', 'terakilobyte', 'habathcx','RobotCaleb', 'thomasballinger', 'noobs2ninjas', 'beohoff', 'brunofin','comster404', 'test_channel', 'cretetion', 'sheevergaming', 'TR7K', 'OgamingSC2', 'ESL_SC2'];
const getUrl = (type, channel) => `https://api.twitch.tv/kraken/${type}/${channel}?callback=JSON_CALLBACK`;

app.controller('twitchCtrl', ($scope, $http) => {
    
    $scope.status = 'all';
    $scope.channels = [];
    $scope.init = (() => {
        channels.forEach(channel => {
            $http.jsonp(getUrl('channels', channel))
                .success(data => {
                    let channelData = data;
                    data.name = channel;
                    $http.jsonp(getUrl('streams', channel))
                        .success(({stream}) => {
                            channelData.stream = stream;
                            $scope.channels.push(channelData);
                        });
                });
        });
    })();
})
.filter('filterStreams', [function () {
    return function (input, param) {
        var output;
        switch (param) {
            case 'all':
                output = input;
                break;
            case 'online':
                output = input.filter(item => item.stream);
                break;
            case 'offline':
                output = input.filter(item => !item.stream && !item.error);
                break;
        }
        return output;
    }
}]);
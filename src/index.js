"use strict";

var bluebird = require('bluebird');
var r = bluebird.promisify(require('request').defaults({jar: true}));
var uuid = require('uuid/v1');

module.exports = class FindMyFriends {
    constructor() {

    }


    login(email, password) {
        if (email && password) {
            var options = {
                method: 'POST',
                uri: 'https://idmsa.apple.com/appleauth/auth/signin',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json, text/javascript',
                    'X-Apple-Widget-Key': '83545bf919730e51dbfba24e7e8a78d2',
                    'Connection': 'keep-alive'
                },
                json: true,
                body: {
                    accountName: email,
                    password: password,
                    rememberMe: true
                }
            }

            r(options)
                .then((res) => {
                    var opt = {
                        method: 'POST',
                        uri: 'https://setup.icloud.com/setup/ws/1/accountLogin?clientBuildNumber=18AProject103&clientId=CD40A862-DAE1-4410-B897-F3EA2D12BDDF&clientMasteringNumber=18A91',
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
                            'Connection': 'keep-alive',
                            'Origin': 'https://www.icloud.com'
                        },
                        body: {
                            accountCountryCode: 'NOR',
                            dsWebAuthToken: res.headers['X-Apple-Session-Token'],
                            extended_login: false,
                            apple_id: email,
                            password: password
                        },
                        json: true
                    }
                    r(opt).then((res) => {
                        this.ping(res.headers['set-cookie']);
                    });
                })
        }
    }

    ping(cookie) {
        var opts = {
            method: 'POST',
            uri: 'https://p16-fmfweb.icloud.com/fmipservice/client/fmfWeb/selFriend/refreshClient?clientBuildNumber=18AHotfix13&clientMasteringNumber=18AHotfix13&clientId=CA882614-51ED-4DC9-AD5D-15971E1E099D&dsid=610001744',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
                'Origin': 'https://www.icloud.com',
                'Referer': 'https://www.icloud.com/applications/fmf/current/en-us/index.html?',
                'Cookie': cookie
            },
            json: true
        }

        r(opts)
            .then((res) => {
                var opt = {
                    method: 'POST',
                    uri: 'https://p16-fmfweb.icloud.com/fmipservice/client/fmfWeb/selFriend/refreshClient?clientBuildNumber=18AHotfix13&clientMasteringNumber=18AHotfix13&clientId=CA882614-51ED-4DC9-AD5D-15971E1E099D&dsid=610001744',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
                        'Origin': 'https://www.icloud.com',
                        'Referer': 'https://www.icloud.com/applications/fmf/current/en-us/index.html?',
                        'Cookie': cookie
                    },
                    body: {
                        clientContext: {
                            appVersion: '1.0',
                            contextApp: 'com.icloud.web.fmf',
                            mapkitAvailable: true,
                            productType: 'fmfWeb',
                            selectedFriend: 'MTg3MDI1OTYwMg~~',
                            tileServer: 'Apple',
                            userInactivityTimeInMS: 129773,
                            windowInFocus: false,
                            windowVisible: true
                        },
                        dataContext: res.body['dataContext'],
                        serverContext: res.body['server-context']
                    },
                    json: true
                }

                setInterval(() => {
                    r(opt) 
                        .then((res) => console.log(res.body['locations']));
                }, 5000)
            })
    }

}
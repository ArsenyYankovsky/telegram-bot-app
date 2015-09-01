'use strict';

var separator = /[\s.,?!]/,
    mainContainer = {},
    usersContainerDay = {};

var statistic = {
    allTimeStats: allTimeStats,
    takeMsg: takeMsg,
    takeUserInfo: takeUserInfo,
    clearUsersDayStatistic: clearUsersDayStatistic,
    getUsersDayStatistic: getUsersDayStatistic
};

function allTimeStats() {
    var text = 'Most popular words:\n',
        keys = Object.keys(mainContainer),
        amount = keys.length > 10 ? 10 : keys.length;
    keys.sort(compareCount);
    for (var i = 0; i < amount; i++) {
        text += keys[i] + ' : ' + mainContainer[keys[i]] + '\n'
    }
    return text;
}

function takeMsg(msg) {
    splitString(msg, separator).forEach(function (word) {
        if (word.length > 2) {
            mainContainer[word] = word in mainContainer ? mainContainer[word] + 1 : 1;
        }
    });
}

function takeUserInfo(user_info) {
    if (user_info.id in usersContainerDay) {
        usersContainerDay[user_info.id].msgCount += 1;
    } else {
        usersContainerDay[user_info.id] = {
            username: user_info.username,
            msgCount: 1
        }
    }
}

function clearUsersDayStatistic() {
    usersContainerDay = {};
}

function getUsersDayStatistic() {
    var msgAmount = 0,
        msg = 'Users statistic:\n';
    if (usersContainerDay) {
        for (var a in usersContainerDay) {
            msgAmount += usersContainerDay[a].msgCount
        }
        for (var b in usersContainerDay) {
            msg += usersContainerDay[b].username + ': ' + usersContainerDay[b].msgCount +
            ' (' +  Math.floor(100 * usersContainerDay[b].msgCount / msgAmount) + '%)' + '\n'
        }
    } else {
        msg = 'Sorry, some problem';
    }
    return msg;
}

function compareCount(a, b) {
    return mainContainer[b] - mainContainer[a];
}

function splitString(stringToSplit, separator) {
    return stringToSplit.split(separator)
}

module.exports = statistic;


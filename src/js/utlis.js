
import $ from 'jquery';

// const baseURL = 'http://127.0.0.1:3000';

const baseURL = 'http://tools.wgudu.com:3000';

$.ajaxSetup({
    beforeSend: function () {
        var url = baseURL + this.url;

        url = new URL(url);

        url.searchParams.set('version', '3.0');

        this.url = url.toString();

    }
});

function getPlaylist(id, callback) {

    var data = localStorage.getItem('data');

    try {
        data = JSON.parse(data);
    } catch (err) {
        data = null;
    }

    if (data instanceof Object) {
        if (id === data.id && typeof callback === 'function') {
            callback(data.playlist);
            return data;
        }
    }

    $.ajax({
        url: '/playlist/detail',
        type: 'get',
        data: {
            id: id || 4970728784
        },
        success: function (data) {
            if (data.code === 200 && typeof callback === 'function') {
                localStorage.setItem('data', JSON.stringify({
                    id: id,
                    playlist: data.playlist.tracks
                }));
                callback(data.playlist.tracks);
            } else {
                console.log(data);
                alert('获取歌曲列表失败');
            }
        }
    });
}

function getPlayAddress(id, callback) {
    $.ajax({
        url: '/api/song/url',
        type: 'get',
        data: {
            ids: id
        },
        success: function (data) {
            if (typeof callback === 'function') callback(data);
        }
    });
}

function timeFormat(time) {
    var m = parseInt(time / 1000 / 60);
    var s = parseInt(time / 1000 % 60);

    if (isNaN(m)) {
        m = 0;
    }

    if (isNaN(s)) {
        s = 0;
    }

    if (m < 10) {
        m = '0' + m;
    }

    if (s < 10) {
        s = '0' + s;
    }

    return m + ':' + s;
}

function sort(numArr) {

    for (let i = 0; i < numArr.length; i++) {
        for (let j = 0; j < numArr.length; j++) {
            if (numArr[i] < numArr[j]) {
                var g = numArr[j];
                numArr[j] = numArr[i];
                numArr[i] = g;
            }
        }
    }

    return numArr;
}

function shake(callback, time) {
    return function () {

        var arg = arguments;

        if (callback.timer) {
            clearTimeout(callback.timer);
        }

        callback.timer = setTimeout(() => {
            callback && callback.apply(this, arg);
        }, time || 150);
    }
}

export {
    getPlaylist,
    getPlayAddress,
    timeFormat,
    sort,
    shake
}
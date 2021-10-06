
import './css/mCustomScrollbar/jquery.mCustomScrollbar.min.css';

import './css/index.css';

import { getPlaylist, timeFormat, shake } from './js/utlis';

import $ from 'jquery';

import Player from './js/player';

import Progress from './js/progress';

import Lyric from './js/lyric';

var $play_list = $('.play-list');

var audio = $('audio');

var progress = new Progress($('.play-bar > .play-progress'));

var volProgress = new Progress($('#vol-progress'));

var player = Player(audio.get(0), $('#play'), progress);

var showPlayTime = $('.play-time > span');

var lyric;

var $lyric_list;


function volProgressHandled(val) {
    var widthVal = parseInt((val / 1) * 100);
    if (widthVal === 0) {
        $('.vol').addClass('volno');
    } else {
        $('.vol').removeClass('volno');
    }
    player.setVolume(val);
    $('#vol-tip').text(widthVal);
    volProgress.$progressBar.css('width', widthVal + '%');
}

volProgress.dotEvent(function (val) {
    localStorage.setItem('vol', val);
    volProgressHandled(val);
});
volProgress.progressMove(volProgressHandled, function (val) {
    localStorage.setItem('vol', val);
});

player.initPlayMode($('#mode-btn'));

// 播放结束
audio.on('ended', function () {
    /*
           0 列表循环
           1 列表随机
           2 单曲循环
    */
    $('#play').removeClass('suspend');

    switch (player.mode) {
        case 1:
            var index = Math.floor(Math.random() * player.playlist.length);
            console.log('index:' + index);

            $play_list.find('li').eq(index).trigger('click');
            break;
        case 2:
            setTimeout(() => {
                $('#play').click();
            }, 100);
            break;
        default:
            $('.next').click();
            break;
    }
});

progress.dotEvent(function (value) {

    if (player.music.flag) return;

    if (player.musicId != -1) {
        setProgress(value);
        player.setPlayTime(value, lyric);
    }

});

progress.progressMove(function (value) {

    if (player.music.flag) return;

    var time = value * player.audio.duration;

    setProgress(value);

    showPlayTime.find('em').text(timeFormat(time * 1000));

}, function (value) {

    if (player.music.flag) return;

    if (player.musicId != -1) {
        player.setPlayTime(value, lyric);
    }
});


function setProgress(val) {
    var time = val * player.audio.duration;
    var widthVal = (time / player.audio.duration) * 100;
    progress.$progressBar.css('width', widthVal + '%');
}

var noScrolling = true;

function init() {

    volProgressHandled(localStorage.getItem('vol') || 1);

    var lyricList = $('#lyric-list');

    var lyricHeight = lyricList.parents('.music-body').height() - lyricList.get(0).offsetTop;

    lyricList.css('height', lyricHeight + 'px');

    // 滚动条样式
    lyricList.mCustomScrollbar({
        scrollInertia: 500,
        callbacks: {
            whileScrolling: function () {
                // console.log(this.mcs);

                if (this.timer) {
                    clearTimeout(this.timer);
                }

                noScrolling = false;

                this.timer = setTimeout(() => {
                    noScrolling = true;
                }, 2000);
            }
        }
    });

    $lyric_list = $('#mCSB_1_container');
}

init();

$('#play').click(function () {

    if (player.music.flag) {
        alert('此歌曲无版权，无法播放。');
        return true;
    }

    if (player.musicId === -1) {
        $play_list.find('li').eq(0).trigger('click');
    } else {
        if (audio.prop('paused')) {
            audio.get(0).play();
            $(this).addClass('suspend');
        } else {
            audio.get(0).pause();
            $(this).removeClass('suspend');
        }

    }
});

// 上一首
$('.prev').click(function () {
    $play_list.find('li').eq(player.prev()).trigger('click');
});

// 下一首
$('.next').click(function () {
    $play_list.find('li').eq(player.next()).trigger('click');
});

// 列表点击
$play_list.on('click', 'li', function () {

    if (player.musicId != this.music.id) {
        lyric = new Lyric(this.music, $lyric_list);
        $lyric_list.html('');
        lyric.getLyric(function () {
            var _this = this;
            $.each(this.songLyric, function (index, item) {

                var { time, text } = item;

                $lyric_list.append($('<p data-time="' + time + '">' + text + '</p>'));
            });

            $lyric_list.get(0).regionHeight = ($lyric_list.parent().get(0).clientHeight / 2) - 32;
        });
    }

    player.playMusic(this.music);

    $(this).addClass('active').siblings('li').removeClass('active');

    $(this).find('.play-icon').css('visibility', 'visible');

    $(this).siblings('li').find('.play-icon').css('visibility', 'hidden');

    // 设置音乐信息
    setMusicInfo(this.music);

    console.log(this.music);

});

function setMusicInfo(music = {}) {
    var coverImg = $('.play-song-cover img');
    var playSongName = $('.play-song-name');
    var singer = $('.play-song-singer');
    var songCover = $('.play-cover img');
    var songName = $('.song-name');
    var bg = $('#bg');

    const coverUrl = music.al && music.al.picUrl;

    playSongName.text(music.name);
    songName.text(music.name);
    singer.text(music.ar && music.ar[0].name);

    coverImg.prop('src', coverUrl);
    songCover.prop('src', coverUrl);

    bg.css({
        'background-image': 'url("' + coverUrl + '")'
    });
}

var lyricListContainer = $('#lyric-list');

// 播放进度更新
player.audioTimeupdate(function (currentTime, duration, timeStr) {

    if (!progress.isMove) {
        showPlayTime.html(timeStr);
    }

    var value = (currentTime / duration) * 100;

    lyric.currentIndex(currentTime, function (index) {

        var regionHeight = $lyric_list.get(0).regionHeight;

        var currentOffsetTop = $lyric_list.find('p').eq(index).get(0);
        if (currentOffsetTop) {
            currentOffsetTop = currentOffsetTop.offsetTop;
        } else {
            currentOffsetTop = 0;
        }
        // console.log(regionHeight, currentOffsetTop);

        var scrollTop;

        $lyric_list.find('p').eq(index).addClass('active').siblings('p').removeClass('active');

        // 歌词滚动
        if (noScrolling) {
            scrollTop = currentOffsetTop - regionHeight;
            if (scrollTop < 0) {
                scrollTop = 0;
            }
            lyricListContainer.mCustomScrollbar("scrollTo", scrollTop, {
                scrollEasing: 'easeOut',
                scrollInertia: 500,
                callbacks: false
            });
        }
    });

    progress.setProgress(value + '%');
});

// 获取播放列表歌曲
getPlaylist(null, function (playlist) {

    function musicItem(index, music) {
        var li = document.createElement('li');

        li.innerHTML = `
        <i class="play-icon"></i>
        <span class="play-list-name">${music.name}</span>
        <span class="song-time">${timeFormat(music.dt)}</span>
        <span class="play-list-singer">${music.ar && music.ar[0].name}</span>
        <div class="play-list-btns">
            <i class="btn-del"></i>
            <i class="btn-download"></i>
        </div>`;

        li.music = music;

        return li;
    }

    player.playlist = playlist;

    $('#count').text(player.playlist.length);

    $.each(playlist, function (index, item) {
        item = musicItem(index, item);
        // console.log(item);
        $play_list.append(item);
    });
});


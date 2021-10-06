
import { getPlayAddress, timeFormat } from './utlis';

function Player(audio, $playBtn, progress) {
    return new init(audio, $playBtn, progress);
}

function init(audio, playBtn, progress) {
    this.audio = audio;
    this.$playBtn = playBtn;
    this.progress = progress;
    this.music = {};
}


Player.prototype = {
    init,
    mode: 0,
    musicId: -1,
    playlist: [],
    timeStr: '00:00 / 00:00',

    // 播放音乐
    playMusic: function (music) {

        this.music = music;

        if (music.id === this.musicId) {

            if (this.music.flag) {
                alert('此歌曲无版权，无法播放。');
                return true;
            }

            if (this.audio.paused) {
                this.audio.play();
                this.$playBtn.addClass('suspend');
            } else {
                this.audio.pause();
                this.$playBtn.removeClass('suspend');
            }
        } else {
            getPlayAddress(music.id, (data) => {

                this.musicId = music.id;

                var { code, data } = data;

                if (code === 200 && data[0].code === 200) {
                    this.audio.src = data[0].url;
                    this.audio.play();
                    this.$playBtn.addClass('suspend');
                } else {
                    this.audio.src = '';
                    this.music.flag = true;
                    this.progress.setProgress('0%');
                    this.$playBtn.removeClass('suspend');
                    alert('歌曲:' + music.name + ',播放失败,歌曲暂时没有版权!');
                }
            });
        }
    },
    prev: function () {
        var index = this.playlist.findIndex(item => item.id === this.musicId);
        if (index < 0) {
            index = this.playlist.length - 1;
        } else {
            index--;
            if (index < 0) {
                index = this.playlist.length - 1;
            }
        }
        return index;
    },

    next: function () {
        var index = this.playlist.findIndex(item => item.id === this.musicId);
        if (index < 0) {
            index = 0;
        } else {
            index++;
            if (index > this.playlist.length - 1) {
                index = 0;
            }
        }
        return index;
    },

    audioTimeupdate: function (callback) {
        var _this = this;
        this.audio.addEventListener('timeupdate', function () {
            var currentTime = timeFormat(this.currentTime * 1000);
            var totalTime = timeFormat(this.duration * 1000);
            var timeStr = '<em>' + currentTime + '</em>' + ' / ' + totalTime;
            callback.call(_this, this.currentTime, this.duration, timeStr);
        });
    },

    setPlayTime(value) {
        var playValue = value * this.audio.duration;
        this.audio.currentTime = playValue;

    },

    initPlayMode(el, mode) {

        /*
            0 列表循环
            1 列表随机
            2 单曲循环
        */
        this.mode = mode || 0;

        var _this = this;

        // 播放模式
        el.click(function () {
            _this.mode++;
            if (_this.mode >= 3) {
                _this.mode = 0;
            }
            switch (_this.mode) {
                case 0:
                    $(this).prop('title', '列表循环');
                    $(this).addClass('loop').removeClass('one');
                    break;
                case 1:
                    $(this).prop('title', '随机播放');
                    $(this).addClass('shuffle').removeClass('loop');
                    break;
                case 2:
                    $(this).prop('title', '单首循环');
                    $(this).addClass('one').removeClass('shuffle');
                    break;
                default:
                    $(this).prop('title', '列表循环');
                    $(this).addClass('loop').removeClass('one');
                    break;
            }
        });
    },

    setVolume(value) {
        if (value < 0 || value > 1) {
            value = 1;
        }
        this.audio.volume = value;
    }
}

init.prototype = Player.prototype;

export default Player;
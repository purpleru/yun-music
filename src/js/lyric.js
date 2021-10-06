
import $ from 'jquery';

import { sort } from './utlis';

class Lyric {
    constructor(music, lyric_list) {
        this.music = music;
        this.$lyric_list = lyric_list;
    }

    getLyric(callback) {
        var _this = this;
        $.ajax({
            url: '/api/lyric',
            data: {
                id: this.music.id
            },
            success: function (data) {
                if(data.code===200){
                    _this.parserLyric(data.lrc.lyric);
                    callback && callback.call(_this);
                }else{
                    console.log('获取歌词失败');
                }
            }
        });
    }

    parserLyric(lyricText){

        var textArr = lyricText.split('\n');
     
        var _this = this;

        this.index = 0;

        this.songLyric = [];

        // "[00:01.44]辞九门回忆"

        var timeRules = /\[(\d*:\d*.\d*)\]/;

        $.each(textArr,function(index,item){
            
            if(!item) return true;

            var lyric = item.split(']')[1].trim();

            // if(!lyric) return true;

            var time = item.match(timeRules)[1].split(':');

            // var m = parseInt(time[0] * 60);

            var m = time[0] * 60;

            // var s = parseFloat(time[1] * 1);

            var s = time[1] * 1;

            // time = parseFloat(m + s);

            time = m + s;

            _this.songLyric.push({
                time:time,
                text:lyric ? lyric : '-'
            });
  
        });
        
        this.songLyric.sort(function(a,b){
            var time = a.time;
            var time2 = b.time;

            if(time > time2){
                return 1;
            }else if(time < time2){
                return -1;
            }else{
                return 0;
            }
        });

    }

    currentIndex(time,callback){

       var flag = this.songLyric.some((item,index,arr) => {

            var nextTime = arr[index + 1] && arr[index + 1].time;

            if(item.time >= time || time < nextTime){
                this.index = index;  
                callback && callback(index);
                return true;
            }
        });

        if(flag===false){
            callback && callback(this.songLyric.length - 1); 
        }

        return this.index;
    }

}

Lyric.prototype.songLyricTime = Lyric.prototype.songLyric = [];

Lyric.prototype.index = -1;

export default Lyric;
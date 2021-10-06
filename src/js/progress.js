
import $ from 'jquery';

class Progress {
    constructor(progress) {
        this.$progress = progress;
        this.$progressBar = this.$progress.find('.play-progress-mask');
        this.$dot = this.$progressBar.find('span');
    }

    dotEvent(callback) {
        var _this = this;
        this.$progress.click(function (event) {
            var left = this.offsetLeft;
            // _this.$progressBar.css('width', (event.pageX - left) + 'px');
            var value = (event.pageX - left) / $(this).width();
            callback && callback(value);        
        });

        this.$dot.click(function(event){
            event.stopPropagation();
        });
    }

    progressMove(callback,mouseupCallback) {
        var _this = this;
        var progressWidth = this.$progress.width();
        var left = parseInt(this.$progress.offset().left);
        
        this.$progress.mousedown(function (event) {
            // var x = event.clientX;
            // var w = _this.$progressBar.width();
            $(document).mousemove(function (event) {
                // var moveX = event.clientX - x;
                // _this.$progressBar.css('width', moveX + w);
                _this.isMove = true;
                var offset = event.pageX - left;

                if(offset >= progressWidth){
                    offset = progressWidth;
                }else if(offset <= 0){
                    offset = 0;
                }
                callback && callback.call(_this, offset  / progressWidth);

            });
        });

        $(document).mouseup(function (event) {
            if(_this.isMove){
                var offset = event.pageX - left;

                if(offset >= progressWidth){
                    offset = progressWidth;
                }else if(offset <= 0){
                    offset = 0;
                }

                mouseupCallback && mouseupCallback(offset / progressWidth);
            }
            _this.isMove = false;
            $(document).off('mousemove');
            event.stopPropagation();
        });
        
    }

    setProgress(value) {
        if(this.isMove) return;
        this.$progressBar.css('width', value);
    }
}

Progress.prototype.isMove = false;

export default Progress;

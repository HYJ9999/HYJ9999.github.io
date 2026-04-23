// 只负责渲染全站背景，不修改正文/侧栏样式
(function () {
    var theme = localStorage.getItem('bgTheme') || 'video';
    var opacity = parseFloat(localStorage.getItem('bgOpacity'));
    if (isNaN(opacity)) opacity = 0.5;

    function mountBackground() {
        var old = document.getElementById('custom-background');
        if (old) old.remove();

        var wrap = document.createElement('div');
        wrap.id = 'custom-background';
        wrap.style.cssText = [
            'position:fixed',
            'inset:0',
            'z-index:-9999',
            'overflow:hidden',
            'pointer-events:none'
        ].join(';');

        var media;
        if (theme === 'image') {
            media = document.createElement('img');
            media.src = '/img/cover.png';
            media.alt = 'background';
        } else {
            media = document.createElement('video');
            media.autoplay = true;
            media.muted = true;
            media.loop = true;
            media.playsInline = true;

            var source = document.createElement('source');
            source.src = '/img/background.mp4';
            source.type = 'video/mp4';
            media.appendChild(source);

            // 视频加载失败时回退为图片
            media.addEventListener('error', function () {
                theme = 'image';
                mountBackground();
            });
        }

        media.style.cssText = [
            'width:100%',
            'height:100%',
            'object-fit:cover',
            'opacity:' + opacity
        ].join(';');

        wrap.appendChild(media);
        document.body.appendChild(wrap);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountBackground);
    } else {
        mountBackground();
    }
})();

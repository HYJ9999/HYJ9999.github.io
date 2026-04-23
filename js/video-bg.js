// 背景渲染 + 一键图片/视频切换（不修改正文/侧栏样式）
(function () {
    var theme = localStorage.getItem('bgTheme') || 'video';
    var opacity = parseFloat(localStorage.getItem('bgOpacity'));
    if (isNaN(opacity)) opacity = 0.5;

    function injectRuntimeStyle() {
        if (document.getElementById('bg-runtime-style')) return;
        var style = document.createElement('style');
        style.id = 'bg-runtime-style';
        style.textContent = [
            '#page-header.full_page,',
            '#page-header.full_page.fixed,',
            '#page-header.full_page.nav-fixed {',
            '  background: transparent !important;',
            '  background-color: transparent !important;',
            '  background-image: none !important;',
            '  background-attachment: fixed !important;',
            '}',
            '#page-header.full_page::before,',
            '#page-header.full_page:not(.not-top-img)::before {',
            '  background: transparent !important;',
            '  background-color: transparent !important;',
            '  content: none !important;',
            '}',
            '@media screen and (max-width: 768px) {',
            '  #page-header.full_page { background-attachment: scroll !important; }',
            '}'
        ].join('\n');
        document.head.appendChild(style);
    }

    function forceHomeHeaderTransparent() {
        var header = document.getElementById('page-header');
        if (!header || !header.classList.contains('full_page')) return;
        header.style.background = 'transparent';
        header.style.backgroundColor = 'transparent';
        header.style.backgroundImage = 'none';
        header.style.backgroundAttachment = window.innerWidth <= 768 ? 'scroll' : 'fixed';
    }

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
        injectRuntimeStyle();
        forceHomeHeaderTransparent();
    }

    function upsertThemeToggleButton() {
        var menus = document.querySelector('#menus .menus_items');
        if (!menus) return;

        var item = document.getElementById('bg-theme-toggle-item');
        if (!item) {
            item = document.createElement('div');
            item.className = 'menus_item';
            item.id = 'bg-theme-toggle-item';

            var btn = document.createElement('a');
            btn.className = 'site-page';
            btn.id = 'bg-theme-toggle';
            btn.href = 'javascript:void(0)';
            btn.title = '切换背景';
            item.appendChild(btn);
            menus.appendChild(item);
        }

        var toggle = item.querySelector('#bg-theme-toggle');
        if (!toggle) return;

        function renderIcon() {
            toggle.innerHTML = theme === 'video'
                ? '<i class="fas fa-image"></i><span> 图片</span>'
                : '<i class="fas fa-video"></i><span> 视频</span>';
        }

        renderIcon();
        toggle.onclick = function () {
            theme = theme === 'video' ? 'image' : 'video';
            localStorage.setItem('bgTheme', theme);
            mountBackground();
            renderIcon();
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            injectRuntimeStyle();
            mountBackground();
            upsertThemeToggleButton();
            forceHomeHeaderTransparent();
        });
    } else {
        injectRuntimeStyle();
        mountBackground();
        upsertThemeToggleButton();
        forceHomeHeaderTransparent();
    }

    window.addEventListener('resize', forceHomeHeaderTransparent);
})();

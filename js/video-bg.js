// 背景渲染 + 一键图片/视频切换（不修改正文/侧栏样式）
(function () {
    var theme = localStorage.getItem('bgTheme') || 'video';
    var opacity = parseFloat(localStorage.getItem('bgOpacity'));
    if (isNaN(opacity)) opacity = 0.5;
    var panelOpacity = parseFloat(localStorage.getItem('panelOpacity'));
    if (isNaN(panelOpacity)) panelOpacity = 0.9;

    function getBackgroundMedia() {
        var wrap = document.getElementById('custom-background');
        return wrap ? wrap.firstElementChild : null;
    }

    function getMenuContainers() {
        return document.querySelectorAll('#menus .menus_items, #sidebar-menus .menus_items');
    }

    function clampOpacity(value) {
        if (isNaN(value)) return 0.5;
        return Math.min(1, Math.max(0.1, value));
    }

    function clampPanelOpacity(value) {
        if (isNaN(value)) return 0.9;
        return Math.min(1, Math.max(0.5, value));
    }

    function applyPanelOpacity() {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        var color = isDark
            ? 'rgba(25, 25, 25, ' + panelOpacity + ')'
            : 'rgba(255, 255, 255, ' + panelOpacity + ')';

        var selectors = [
            '#recent-posts .recent-post-item',
            '#aside-content .card-widget',
            '#post',
            '#article-container',
            '#post #article-container',
            '#page',
            '#archive',
            '#tag',
            '#category',
            '#post .post-copyright',
            '#post .tag_share',
            '#post #pagination'
        ];

        selectors.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (el) {
                el.style.setProperty('background', color, 'important');
                el.style.setProperty('background-color', color, 'important');
            });
        });

        // 元信息区域保持主题原样，不叠加灰色蒙板
        document.querySelectorAll('#post > #post-info, #page-header #post-info').forEach(function (el) {
            el.style.removeProperty('background');
            el.style.removeProperty('background-color');
        });
    }

    function setOpacity(nextOpacity) {
        opacity = clampOpacity(nextOpacity);
        localStorage.setItem('bgOpacity', opacity.toString());
        var media = getBackgroundMedia();
        if (media) media.style.opacity = opacity;
    }

    function setPanelOpacity(nextPanelOpacity) {
        panelOpacity = clampPanelOpacity(nextPanelOpacity);
        localStorage.setItem('panelOpacity', panelOpacity.toString());
        applyPanelOpacity();
    }

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
            'body[data-bg-theme="video"] #page-header #nav {',
            '  background: rgba(13, 23, 36, 0.42) !important;',
            '  backdrop-filter: blur(8px);',
            '  border-bottom: 1px solid rgba(255, 255, 255, 0.2);',
            '}',
            'body[data-bg-theme="video"] #page-header #nav .site-page,',
            'body[data-bg-theme="video"] #page-header #nav #blog-info .site-name {',
            '  color: #f4f9ff !important;',
            '}',
            'body[data-bg-theme="image"] #page-header #nav {',
            '  background: linear-gradient(90deg, rgba(255, 236, 245, 0.92), rgba(233, 245, 255, 0.92)) !important;',
            '  backdrop-filter: blur(10px);',
            '  border-bottom: 1px solid rgba(255, 255, 255, 0.7);',
            '}',
            'body[data-bg-theme="image"] #page-header #nav .site-page,',
            'body[data-bg-theme="image"] #page-header #nav #blog-info .site-name {',
            '  color: #3b4754 !important;',
            '}',
            'body[data-bg-theme="image"] #page-header #nav .site-page:hover {',
            '  color: #2f6db0 !important;',
            '}',
            '.bg-opacity-toggle-item {',
            '  position: relative;',
            '}',
            '.bg-opacity-panel {',
            '  position: absolute;',
            '  top: 100%;',
            '  left: 0;',
            '  margin-top: 10px;',
            '  min-width: 260px;',
            '  padding: 12px 12px 10px;',
            '  border-radius: 14px;',
            '  border: 1px solid rgba(255, 255, 255, 0.28);',
            '  background: linear-gradient(160deg, rgba(32, 48, 78, 0.9), rgba(24, 28, 40, 0.9));',
            '  color: #f6f9ff;',
            '  box-shadow: 0 12px 32px rgba(2, 8, 24, 0.35);',
            '  backdrop-filter: blur(12px);',
            '  z-index: 10000;',
            '}',
            '.bg-opacity-panel.is-hidden {',
            '  display: none;',
            '}',
            '.bg-opacity-panel-title {',
            '  margin: 0 0 8px;',
            '  font-size: 12px;',
            '  font-weight: 600;',
            '  letter-spacing: 0.4px;',
            '  color: rgba(237, 243, 255, 0.95);',
            '}',
            '.bg-opacity-panel-row {',
            '  display: grid;',
            '  grid-template-columns: 72px 1fr 44px;',
            '  align-items: center;',
            '  gap: 8px;',
            '  font-size: 12px;',
            '}',
            '.bg-opacity-panel-row + .bg-opacity-panel-row {',
            '  margin-top: 10px;',
            '}',
            '.bg-opacity-label {',
            '  color: rgba(228, 235, 250, 0.92);',
            '}',
            '.bg-opacity-value,',
            '.panel-opacity-value {',
            '  text-align: right;',
            '  font-weight: 600;',
            '  color: #ffffff;',
            '  background: rgba(255, 255, 255, 0.14);',
            '  border: 1px solid rgba(255, 255, 255, 0.18);',
            '  border-radius: 999px;',
            '  padding: 1px 8px;',
            '}',
            '.bg-opacity-panel input[type="range"] {',
            '  width: 100%;',
            '  appearance: none;',
            '  height: 6px;',
            '  border-radius: 999px;',
            '  background: linear-gradient(90deg, #7dc5ff, #f7a6d8);',
            '  outline: none;',
            '}',
            '.bg-opacity-panel input[type="range"]::-webkit-slider-thumb {',
            '  appearance: none;',
            '  width: 14px;',
            '  height: 14px;',
            '  border-radius: 50%;',
            '  background: #ffffff;',
            '  border: 2px solid #6ea8ff;',
            '  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);',
            '  cursor: pointer;',
            '}',
            '.bg-opacity-panel input[type="range"]::-moz-range-thumb {',
            '  width: 14px;',
            '  height: 14px;',
            '  border-radius: 50%;',
            '  background: #ffffff;',
            '  border: 2px solid #6ea8ff;',
            '  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);',
            '  cursor: pointer;',
            '}',
            '@media screen and (max-width: 768px) {',
            '  #page-header.full_page { background-attachment: scroll !important; }',
            '  .bg-opacity-panel { left: auto; right: 12px; }',
            '}'
        ].join('\n');
        document.head.appendChild(style);
    }

    function applyNavTheme() {
        if (!document.body) return;
        document.body.setAttribute('data-bg-theme', theme);

        var nav = document.querySelector('#page-header #nav');
        if (!nav) return;

        var config = theme === 'image'
            ? {
                bg: 'linear-gradient(90deg, rgba(255, 236, 245, 0.92), rgba(233, 245, 255, 0.92))',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                text: '#3b4754',
                hover: '#2f6db0',
                blur: 'blur(10px)'
            }
            : {
                bg: 'rgba(13, 23, 36, 0.42)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                text: '#f4f9ff',
                hover: '#ffffff',
                blur: 'blur(8px)'
            };

        nav.style.setProperty('background', config.bg, 'important');
        nav.style.setProperty('border-bottom', config.border, 'important');
        nav.style.setProperty('backdrop-filter', config.blur, 'important');

        nav.querySelectorAll('a, .site-page, #toggle-menu').forEach(function (el) {
            el.style.setProperty('color', config.text, 'important');
        });

        var siteName = nav.querySelector('#blog-info .site-name');
        if (siteName) siteName.style.setProperty('color', config.text, 'important');

        nav.querySelectorAll('a, .site-page, #toggle-menu').forEach(function (el) {
            el.onmouseenter = function () {
                el.style.setProperty('color', config.hover, 'important');
            };
            el.onmouseleave = function () {
                el.style.setProperty('color', config.text, 'important');
            };
        });
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
        applyNavTheme();
        forceHomeHeaderTransparent();
        applyPanelOpacity();
    }

    function upsertThemeToggleButton() {
        function renderIcon() {
            return theme === 'video'
                ? '<i class="fas fa-image"></i><span> 图片</span>'
                : '<i class="fas fa-video"></i><span> 视频</span>';
        }

        var menusList = getMenuContainers();
        if (!menusList.length) return;

        menusList.forEach(function (menus) {
            var item = menus.querySelector('.bg-theme-toggle-item');
            if (!item) {
                item = document.createElement('div');
                item.className = 'menus_item bg-theme-toggle-item';

                var btn = document.createElement('a');
                btn.className = 'site-page bg-theme-toggle';
                btn.href = 'javascript:void(0)';
                btn.title = '切换背景';
                item.appendChild(btn);
                menus.appendChild(item);
            }

            var toggle = item.querySelector('.bg-theme-toggle');
            if (!toggle) return;
            toggle.innerHTML = renderIcon();
            toggle.onclick = function () {
                theme = theme === 'video' ? 'image' : 'video';
                localStorage.setItem('bgTheme', theme);
                mountBackground();
                upsertThemeToggleButton();
            };
        });
    }

    function upsertOpacityButton() {
        function closeAllPanels(exceptPanel) {
            document.querySelectorAll('.bg-opacity-panel').forEach(function (panel) {
                if (panel !== exceptPanel) panel.classList.add('is-hidden');
            });
        }

        function buildPanel() {
            var panel = document.createElement('div');
            panel.className = 'bg-opacity-panel is-hidden';
            panel.innerHTML = [
                '<div class="bg-opacity-panel-title">透明度设置</div>',
                '<div class="bg-opacity-panel-row">',
                '  <span class="bg-opacity-label">背景</span>',
                '  <input class="bg-opacity-range" type="range" min="10" max="100" step="1">',
                '  <span class="bg-opacity-value"></span>',
                '</div>',
                '<div class="bg-opacity-panel-row">',
                '  <span class="bg-opacity-label">白板</span>',
                '  <input class="panel-opacity-range" type="range" min="50" max="100" step="1">',
                '  <span class="panel-opacity-value"></span>',
                '</div>'
            ].join('');
            return panel;
        }

        var menusList = getMenuContainers();
        if (!menusList.length) return;

        menusList.forEach(function (menus) {
            var item = menus.querySelector('.bg-opacity-toggle-item');
            if (!item) {
                item = document.createElement('div');
                item.className = 'menus_item bg-opacity-toggle-item';

                var btn = document.createElement('a');
                btn.className = 'site-page bg-opacity-toggle';
                btn.href = 'javascript:void(0)';
                btn.title = '切换透明度';
                item.appendChild(btn);
                var themeItem = menus.querySelector('.bg-theme-toggle-item');
                if (themeItem) menus.insertBefore(item, themeItem);
                else menus.appendChild(item);
            }

            // 已存在时也强制保证顺序：透明度按钮在主题按钮之前
            var currentThemeItem = menus.querySelector('.bg-theme-toggle-item');
            if (currentThemeItem && item.nextElementSibling !== currentThemeItem) {
                menus.insertBefore(item, currentThemeItem);
            }

            var toggle = item.querySelector('.bg-opacity-toggle');
            if (!toggle) return;
            toggle.innerHTML = '<i class="fas fa-sliders-h"></i><span> 透明度</span>';

            var panel = item.querySelector('.bg-opacity-panel');
            if (!panel) {
                panel = buildPanel();
                item.appendChild(panel);
            }

            var bgInput = panel.querySelector('.bg-opacity-range');
            var bgValue = panel.querySelector('.bg-opacity-value');
            var panelInput = panel.querySelector('.panel-opacity-range');
            var panelValue = panel.querySelector('.panel-opacity-value');
            if (!bgInput || !bgValue || !panelInput || !panelValue) return;

            bgInput.value = String(Math.round(clampOpacity(opacity) * 100));
            bgValue.textContent = bgInput.value + '%';
            panelInput.value = String(Math.round(clampPanelOpacity(panelOpacity) * 100));
            panelValue.textContent = panelInput.value + '%';

            bgInput.oninput = function () {
                var percent = parseInt(bgInput.value, 10);
                bgValue.textContent = percent + '%';
                setOpacity(percent / 100);
            };

            panelInput.oninput = function () {
                var percent = parseInt(panelInput.value, 10);
                panelValue.textContent = percent + '%';
                setPanelOpacity(percent / 100);
            };

            toggle.onclick = function () {
                var isHidden = panel.classList.contains('is-hidden');
                closeAllPanels(panel);
                if (isHidden) panel.classList.remove('is-hidden');
                else panel.classList.add('is-hidden');
            };
        });

        if (!document.body.dataset.bgOpacityPanelBinded) {
            document.body.dataset.bgOpacityPanelBinded = '1';
            document.addEventListener('click', function (event) {
                if (!event.target.closest('.bg-opacity-toggle-item')) {
                    closeAllPanels(null);
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            injectRuntimeStyle();
            mountBackground();
            upsertThemeToggleButton();
            upsertOpacityButton();
            forceHomeHeaderTransparent();
        });
    } else {
        injectRuntimeStyle();
        mountBackground();
        upsertThemeToggleButton();
        upsertOpacityButton();
        forceHomeHeaderTransparent();
    }

    window.addEventListener('resize', forceHomeHeaderTransparent);
    var darkModeObserver = new MutationObserver(function () {
        applyPanelOpacity();
    });
    darkModeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
})();

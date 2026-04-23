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
            '#page',
            '#archive',
            '#tag',
            '#category',
            '#post > #post-info',
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
            '.bg-opacity-toggle-item {',
            '  position: relative;',
            '}',
            '.bg-opacity-panel {',
            '  position: absolute;',
            '  top: 100%;',
            '  left: 0;',
            '  margin-top: 8px;',
            '  min-width: 220px;',
            '  padding: 10px 12px;',
            '  border-radius: 10px;',
            '  background: rgba(20, 20, 20, 0.88);',
            '  color: #fff;',
            '  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);',
            '  z-index: 10000;',
            '}',
            '.bg-opacity-panel.is-hidden {',
            '  display: none;',
            '}',
            '.bg-opacity-panel-row {',
            '  display: flex;',
            '  align-items: center;',
            '  justify-content: space-between;',
            '  gap: 8px;',
            '  font-size: 12px;',
            '}',
            '.bg-opacity-panel-row + .bg-opacity-panel-row {',
            '  margin-top: 8px;',
            '}',
            '.bg-opacity-panel input[type="range"] {',
            '  width: 120px;',
            '}',
            '@media screen and (max-width: 768px) {',
            '  #page-header.full_page { background-attachment: scroll !important; }',
            '  .bg-opacity-panel { left: auto; right: 0; }',
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
                '<div class="bg-opacity-panel-row">',
                '  <span>背景透明度</span>',
                '  <input class="bg-opacity-range" type="range" min="10" max="100" step="1">',
                '  <span class="bg-opacity-value"></span>',
                '</div>',
                '<div class="bg-opacity-panel-row">',
                '  <span>白板透明度</span>',
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
                menus.appendChild(item);
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

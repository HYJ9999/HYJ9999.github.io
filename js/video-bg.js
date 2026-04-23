// 背景主题切换 + 透明度 + 玻璃效果
(function() {
    var currentTheme = localStorage.getItem('bgTheme') || 'video';
    var bgOpacity = parseFloat(localStorage.getItem('bgOpacity'));
    if (isNaN(bgOpacity)) bgOpacity = 0.5;
    var contentOpacity = parseFloat(localStorage.getItem('contentOpacity'));
    if (isNaN(contentOpacity)) contentOpacity = 0.92;
    var postOpacity = parseFloat(localStorage.getItem('postOpacity'));
    if (isNaN(postOpacity)) postOpacity = 0.95;
    var glassEnabled = localStorage.getItem('bgGlass') !== 'false';

    function createBackground() {
        var existing = document.getElementById('custom-background');
        if (existing) existing.remove();

        var bg = document.createElement('div');
        bg.id = 'custom-background';

        if (currentTheme === 'video') {
            bg.innerHTML = '<video autoplay muted loop playsinline><source src="/img/background.mp4" type="video/mp4"></video>';
        } else {
            bg.innerHTML = '<img src="/img/cover.png" alt="background">';
        }

        bg.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;';
        var media = bg.firstElementChild;
        media.style.cssText = 'width:100%;height:100%;object-fit:cover;opacity:' + bgOpacity + ';';

        document.body.appendChild(bg);
    }

    function applyContentOpacity() {
        var content = document.getElementById('content-inner');
        if (content) {
            content.style.background = 'rgba(255,255,255,' + contentOpacity + ')';
            if (glassEnabled) {
                content.style.backdropFilter = 'blur(5px)';
            } else {
                content.style.backdropFilter = 'none';
            }
        }
        var sidebar = document.getElementById('sidebar');
        if (sidebar) {
            if (glassEnabled) {
                sidebar.style.background = 'rgba(255,255,255,' + contentOpacity + ')';
                sidebar.style.backdropFilter = 'blur(5px)';
            } else {
                sidebar.style.background = 'transparent';
                sidebar.style.backdropFilter = 'none';
            }
        }
    }

    function applyPostOpacity() {
        var selectors = '#article-container, .post-content, .post-bg, #post, #post .layout';
        var posts = document.querySelectorAll(selectors);
        posts.forEach(function(post) {
            post.style.background = 'rgba(255,255,255,' + postOpacity + ')';
            if (glassEnabled && postOpacity < 1) {
                post.style.backdropFilter = 'blur(3px)';
            } else {
                post.style.backdropFilter = 'none';
            }
        });
    }

    function createSettingsPanel() {
        var panel = document.createElement('div');
        panel.id = 'bg-settings-panel';
        panel.style.cssText = 'display:none;position:fixed;top:60px;right:20px;background:rgba(0,0,0,0.85);backdrop-filter:blur(10px);padding:15px;border-radius:10px;z-index:1000;color:#fff;min-width:220px;box-shadow:0 4px 20px rgba(0,0,0,0.3);';
        panel.innerHTML = '<div style="margin-bottom:15px;font-weight:bold;font-size:14px;">背景设置</div>' +
            '<div style="margin-bottom:12px;">' +
            '<label style="display:block;margin-bottom:5px;font-size:12px;">背景透明度: <span id="bg-opacity-value">' + Math.round(bgOpacity*100) + '%</span></label>' +
            '<input type="range" id="bg-opacity-slider" min="10" max="100" value="' + Math.round(bgOpacity*100) + '" style="width:100%;cursor:pointer;">' +
            '</div>' +
            '<div style="margin-bottom:12px;">' +
            '<label style="display:block;margin-bottom:5px;font-size:12px;">内容透明度: <span id="content-opacity-value">' + Math.round(contentOpacity*100) + '%</span></label>' +
            '<input type="range" id="content-opacity-slider" min="0" max="100" value="' + Math.round(contentOpacity*100) + '" style="width:100%;cursor:pointer;">' +
            '</div>' +
            '<div style="margin-bottom:12px;">' +
            '<label style="display:block;margin-bottom:5px;font-size:12px;">文章透明度: <span id="post-opacity-value">' + Math.round(postOpacity*100) + '%</span></label>' +
            '<input type="range" id="post-opacity-slider" min="0" max="100" value="' + Math.round(postOpacity*100) + '" style="width:100%;cursor:pointer;">' +
            '</div>' +
            '<div>' +
            '<label style="display:flex;align-items:center;cursor:pointer;">' +
            '<input type="checkbox" id="glass-toggle"' + (glassEnabled ? ' checked' : '') + ' style="margin-right:8px;cursor:pointer;">' +
            '<span style="font-size:12px;">开启玻璃效果</span>' +
            '</label>' +
            '</div>';
        document.body.appendChild(panel);

        var bgSlider = panel.querySelector('#bg-opacity-slider');
        bgSlider.addEventListener('input', function() {
            bgOpacity = this.value / 100;
            localStorage.setItem('bgOpacity', bgOpacity);
            document.getElementById('bg-opacity-value').textContent = this.value + '%';
            var media = document.querySelector('#custom-background video, #custom-background img');
            if (media) media.style.opacity = bgOpacity;
        });

        var contentSlider = panel.querySelector('#content-opacity-slider');
        contentSlider.addEventListener('input', function() {
            contentOpacity = this.value / 100;
            localStorage.setItem('contentOpacity', contentOpacity);
            document.getElementById('content-opacity-value').textContent = this.value + '%';
            applyContentOpacity();
        });

        var postSlider = panel.querySelector('#post-opacity-slider');
        postSlider.addEventListener('input', function() {
            postOpacity = this.value / 100;
            localStorage.setItem('postOpacity', postOpacity);
            document.getElementById('post-opacity-value').textContent = this.value + '%';
            applyPostOpacity();
        });

        var glassCheck = panel.querySelector('#glass-toggle');
        glassCheck.addEventListener('change', function() {
            glassEnabled = this.checked;
            localStorage.setItem('bgGlass', glassEnabled);
            applyContentOpacity();
            applyPostOpacity();
        });
    }

    function createToggleButtons() {
        var settingsBtn = document.createElement('a');
        settingsBtn.className = 'site-page';
        settingsBtn.id = 'bg-settings-btn';
        settingsBtn.href = 'javascript:void(0)';
        settingsBtn.title = '背景设置';
        settingsBtn.innerHTML = '<i class="fas fa-cog"></i>';
        settingsBtn.onclick = function(e) {
            e.stopPropagation();
            var panel = document.getElementById('bg-settings-panel');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
        };

        var themeBtn = document.createElement('a');
        themeBtn.className = 'site-page';
        themeBtn.id = 'theme-toggle';
        themeBtn.href = 'javascript:void(0)';
        themeBtn.title = '切换背景主题';
        themeBtn.innerHTML = currentTheme === 'video' ? '<i class="fas fa-image"></i>' : '<i class="fas fa-video"></i>';
        themeBtn.onclick = function() {
            currentTheme = currentTheme === 'video' ? 'image' : 'video';
            createBackground();
            localStorage.setItem('bgTheme', currentTheme);
            var icon = themeBtn.querySelector('i');
            if (icon) icon.className = currentTheme === 'video' ? 'fas fa-image' : 'fas fa-video';
        };

        return { settingsBtn: settingsBtn, themeBtn: themeBtn };
    }

    function init() {
        createBackground();
        createSettingsPanel();

        var menus = document.querySelector('#menus .menus_items');
        if (menus) {
            var btns = createToggleButtons();
            var btn1 = document.createElement('div');
            btn1.className = 'menus_item';
            btn1.appendChild(btns.settingsBtn);
            var btn2 = document.createElement('div');
            btn2.className = 'menus_item';
            btn2.appendChild(btns.themeBtn);
            menus.appendChild(btn1);
            menus.appendChild(btn2);
        }

        setTimeout(function() {
            applyContentOpacity();
            applyPostOpacity();
        }, 100);

        document.addEventListener('click', function(e) {
            if (!e.target.closest('#bg-settings-panel') && !e.target.closest('#bg-settings-btn')) {
                var panel = document.getElementById('bg-settings-panel');
                if (panel) panel.style.display = 'none';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

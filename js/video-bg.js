// 背景主题切换 + 透明度 + 玻璃效果
(function() {
    var currentTheme = localStorage.getItem('bgTheme') || 'video';
    var opacity = parseFloat(localStorage.getItem('bgOpacity')) || 0.5;
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
        media.style.cssText = 'width:100%;height:100%;object-fit:cover;opacity:' + opacity + ';';

        document.body.appendChild(bg);
    }

    function createSettingsPanel() {
        var panel = document.createElement('div');
        panel.id = 'bg-settings-panel';
        panel.style.cssText = 'display:none;position:fixed;top:60px;right:20px;background:rgba(0,0,0,0.8);backdrop-filter:blur(10px);padding:15px;border-radius:10px;z-index:1000;color:#fff;min-width:180px;';
        panel.innerHTML = `
            <div style="margin-bottom:10px;font-weight:bold;">背景设置</div>
            <div style="margin-bottom:10px;">
                <label style="display:block;margin-bottom:5px;font-size:12px;">透明度: <span id="opacity-value">${Math.round(opacity*100)}%</span></label>
                <input type="range" id="opacity-slider" min="10" max="100" value="${Math.round(opacity*100)}" style="width:100%;cursor:pointer;">
            </div>
            <div>
                <label style="display:flex;align-items:center;cursor:pointer;">
                    <input type="checkbox" id="glass-toggle" ${glassEnabled ? 'checked' : ''} style="margin-right:8px;cursor:pointer;">
                    <span style="font-size:12px;">开启玻璃效果</span>
                </label>
            </div>
        `;
        document.body.appendChild(panel);

        // 透明度滑块
        var slider = panel.querySelector('#opacity-slider');
        slider.addEventListener('input', function() {
            opacity = this.value / 100;
            localStorage.setItem('bgOpacity', opacity);
            document.getElementById('opacity-value').textContent = this.value + '%';
            var media = document.querySelector('#custom-background video, #custom-background img');
            if (media) media.style.opacity = opacity;
        });

        // 玻璃效果开关
        var glassCheck = panel.querySelector('#glass-toggle');
        glassCheck.addEventListener('change', function() {
            glassEnabled = this.checked;
            localStorage.setItem('bgGlass', glassEnabled);
            applyGlassEffect();
        });
    }

    function applyGlassEffect() {
        var content = document.getElementById('content-inner');
        if (content) {
            content.style.background = glassEnabled ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.92)';
            content.style.backdropFilter = glassEnabled ? 'blur(5px)' : 'none';
        }
        var sidebar = document.getElementById('sidebar');
        if (sidebar && glassEnabled) {
            sidebar.style.background = 'rgba(255,255,255,0.75)';
            sidebar.style.backdropFilter = 'blur(5px)';
        }
    }

    function createToggleButtons() {
        // 设置按钮
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

        // 主题切换按钮
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

        // 初始化玻璃效果
        if (glassEnabled) {
            setTimeout(applyGlassEffect, 100);
        }

        // 点击其他地方关闭设置面板
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

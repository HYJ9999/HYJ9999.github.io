// 背景主题切换
(function() {
    var currentTheme = 'video'; // 默认视频主题

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

        bg.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;overflow:hidden;';
        var media = bg.querySelector('video') || bg.querySelector('img');
        if (media.tagName === 'VIDEO') {
            media.style.cssText = 'width:100%;height:100%;object-fit:cover;opacity:0.5;';
        } else {
            media.style.cssText = 'width:100%;height:100%;object-fit:cover;opacity:0.5;';
        }

        document.body.insertBefore(bg, document.body.firstChild);
    }

    function createToggleButton() {
        var btn = document.createElement('a');
        btn.className = 'site-page';
        btn.id = 'theme-toggle';
        btn.href = 'javascript:void(0)';
        btn.title = '切换背景主题';
        btn.innerHTML = '<i class="fas fa-image"></i>';
        btn.style.cssText = 'cursor:pointer;';
        btn.onclick = function() {
            currentTheme = currentTheme === 'video' ? 'image' : 'video';
            createBackground();
            localStorage.setItem('bgTheme', currentTheme);
            updateButtonIcon();
        };
        return btn;
    }

    function updateButtonIcon() {
        var btn = document.getElementById('theme-toggle');
        if (btn) {
            var icon = btn.querySelector('i');
            if (icon) {
                icon.className = currentTheme === 'video' ? 'fas fa-image' : 'fas fa-video';
            }
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        // 恢复保存的主题
        var saved = localStorage.getItem('bgTheme');
        if (saved) currentTheme = saved;

        // 创建背景
        createBackground();

        // 添加切换按钮到导航栏
        var menus = document.querySelector('.menus_items');
        if (menus) {
            var li = document.createElement('div');
            li.className = 'menus_item';
            li.appendChild(createToggleButton());
            menus.appendChild(li);
        }

        updateButtonIcon();
    });
})();

// 背景主题切换
(function() {
    var currentTheme = localStorage.getItem('bgTheme') || 'video';

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
        media.style.cssText = 'width:100%;height:100%;object-fit:cover;opacity:0.5;';

        document.body.appendChild(bg);
    }

    function createToggleButton() {
        var btn = document.createElement('a');
        btn.className = 'site-page';
        btn.id = 'theme-toggle';
        btn.href = 'javascript:void(0)';
        btn.title = '切换背景主题';
        btn.innerHTML = currentTheme === 'video' ? '<i class="fas fa-image"></i>' : '<i class="fas fa-video"></i>';
        btn.onclick = function() {
            currentTheme = currentTheme === 'video' ? 'image' : 'video';
            createBackground();
            localStorage.setItem('bgTheme', currentTheme);
            var icon = btn.querySelector('i');
            if (icon) icon.className = currentTheme === 'video' ? 'fas fa-image' : 'fas fa-video';
        };
        return btn;
    }

    function init() {
        createBackground();

        var menus = document.querySelector('#menus');
        if (menus) {
            var btn = createToggleButton();
            var btnWrapper = document.createElement('div');
            btnWrapper.className = 'menus_item';
            btnWrapper.appendChild(btn);
            menus.querySelector('.menus_items').appendChild(btnWrapper);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

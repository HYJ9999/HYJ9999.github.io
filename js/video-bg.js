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
        media.style.cssText = 'width:100%;height:100%;object-fit:cover;opacity:1;';

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

        var menus = document.querySelector('#menus .menus_items');
        if (menus) {
            var li = document.createElement('div');
            li.className = 'menus_item';
            li.appendChild(createToggleButton());
            menus.appendChild(li);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

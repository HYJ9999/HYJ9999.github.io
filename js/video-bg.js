// 视频背景
document.addEventListener('DOMContentLoaded', function() {
  // 创建视频背景容器
  var videoContainer = document.createElement('div');
  videoContainer.id = 'video-background';
  videoContainer.innerHTML = '<video autoplay muted loop playsinline><source src="/img/background.mp4" type="video/mp4"></video>';
  videoContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;overflow:hidden;';
  videoContainer.querySelector('video').style.cssText = 'width:100%;height:100%;object-fit:cover;opacity:0.6;';

  var firstSection = document.querySelector('#page-header') || document.body.firstElementChild;
  if (firstSection) {
    firstSection.parentNode.insertBefore(videoContainer, firstSection);
  } else {
    document.body.appendChild(videoContainer);
  }
});

// 视频背景
document.addEventListener('DOMContentLoaded', function() {
  var videoContainer = document.createElement('div');
  videoContainer.id = 'video-background';
  videoContainer.innerHTML = '<video autoplay muted loop playsinline><source src="/img/background.mp4" type="video/mp4"></video>';
  videoContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-999;overflow:hidden;pointer-events:none;';
  videoContainer.querySelector('video').style.cssText = 'width:100%;height:100%;object-fit:cover;opacity:0.5;';
  document.body.insertBefore(videoContainer, document.body.firstChild);
});

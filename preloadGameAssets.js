const assetManifest = {
  images: {
    background: 'assets/images/background.png',
    playerShip: 'assets/images/playerShip.png',
    laser: 'assets/images/laser.png',
    alienBlue: 'assets/images/alienBlue.png',
    alienGreen: 'assets/images/alienGreen.png',
    alienRed: 'assets/images/alienRed.png',
    explosion: 'assets/images/explosion.png'
  },
  audio: {
    shoot: 'assets/sounds/shoot.wav',
    explosion: 'assets/sounds/explosion.wav',
    bgm: 'assets/sounds/bgm.mp3'
  }
};

export default function preloadGameAssets(onProgress = () => {}, timeout = 10000) {
  const imagesToLoad = Object.entries(assetManifest.images);
  const audioToLoad = Object.entries(assetManifest.audio);
  const totalAssets = imagesToLoad.length + audioToLoad.length;
  let loadedCount = 0;
  let aborted = false;
  const loadedAssets = { images: {}, audio: {} };

  function safeProgress(ratio) {
    try {
      onProgress(ratio);
    } catch (error) {
      console.error('onProgress callback error:', error);
    }
  }

  function updateProgress() {
    if (aborted) return;
    loadedCount++;
    safeProgress(loadedCount / totalAssets);
  }

  return new Promise((resolve, reject) => {
    if (totalAssets === 0) {
      safeProgress(1);
      resolve(loadedAssets);
      return;
    }

    function handleReject(error) {
      if (aborted) return;
      aborted = true;
      reject(error);
    }

    function handleResolve() {
      if (aborted) return;
      aborted = true;
      resolve(loadedAssets);
    }

    imagesToLoad.forEach(([key, src]) => {
      if (aborted) return;
      const img = new Image();
      let timer = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        handleReject(new Error(`Timeout loading image: ${src}`));
      }, timeout);

      img.onload = () => {
        clearTimeout(timer);
        if (aborted) return;
        loadedAssets.images[key] = img;
        updateProgress();
        if (loadedCount === totalAssets) handleResolve();
      };

      img.onerror = () => {
        clearTimeout(timer);
        handleReject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });

    audioToLoad.forEach(([key, src]) => {
      if (aborted) return;
      const audio = new Audio();
      let timer = setTimeout(() => {
        cleanup();
        handleReject(new Error(`Timeout loading audio: ${src}`));
      }, timeout);

      const onLoad = () => {
        clearTimeout(timer);
        if (aborted) return;
        loadedAssets.audio[key] = audio;
        cleanup();
        updateProgress();
        if (loadedCount === totalAssets) handleResolve();
      };

      const onError = () => {
        clearTimeout(timer);
        cleanup();
        handleReject(new Error(`Failed to load audio: ${src}`));
      };

      function cleanup() {
        audio.removeEventListener('canplaythrough', onLoad);
        audio.removeEventListener('error', onError);
      }

      audio.addEventListener('canplaythrough', onLoad, { once: true });
      audio.addEventListener('error', onError, { once: true });
      audio.src = src;
      audio.load();
    });
  });
}
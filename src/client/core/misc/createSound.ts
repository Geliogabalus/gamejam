export const createSound = (src: string, volume: number = 1) => {
  const sound = document.createElement('audio');
  sound.volume = volume;
  sound.src = src;
  sound.setAttribute('preload', 'auto');
  sound.setAttribute('controls', 'none');
  sound.style.display = 'none';
  document.body.appendChild(sound);

  return {
    sound,
    play: () => {
      sound.currentTime = 0;
      return sound.play();
    },
    stop: () => sound.pause(),
  };
};

export const crash = createSound('assets/music/crash.wav');
export const pickup = createSound('assets/music/pickup.wav');
export const complete = createSound('assets/music/complete.wav');

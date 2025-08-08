export class AudioManager {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.frequencyData = null;
    this.bgMusic = null;
    this.muteBtn = null;
  }

  async init() {
    this.bgMusic = document.getElementById("bg-music");
    this.muteBtn = document.getElementById("mute-btn");

    if (!this.bgMusic || !this.muteBtn) {
      console.warn("Audio elements not found");
      return false;
    }

    this.setupAudio();
    this.setupMuteButton();
    return true;
  }

  setupAudio() {
    this.bgMusic.volume = 1;
    this.bgMusic.muted = false;
    // AUDIO CONTEXT
    this.setupAudioContext();
  }

  async setupAudioContext() {
    try {
      await this.bgMusic.play();
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
        const sourceNode = this.audioContext.createMediaElementSource(
          this.bgMusic
        );
        this.analyser = this.audioContext.createAnalyser();
        sourceNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.0;
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      }
    } catch (error) {
      console.log("Autoplay blocked:", error);
    }
  }

  setupMuteButton() {
    this.muteBtn.style.background = "none";
    this.muteBtn.style.border = "none";

    this.updateButtonIcon();

    this.muteBtn.addEventListener("click", async () => {
      if (this.bgMusic.paused) {
        try {
          await this.bgMusic.play();
          if (!this.audioContext) {
            await this.setupAudioContext();
          }
          this.updateButtonIcon();
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        this.bgMusic.muted = !this.bgMusic.muted;
        this.updateButtonIcon();
      }
    });
  }

  updateButtonIcon() {
    if (this.bgMusic.paused) {
      this.muteBtn.innerHTML =
        '<img src="/sound.svg" alt="Play" width="32" height="32" />';
    } else if (this.bgMusic.muted) {
      this.muteBtn.innerHTML =
        '<img src="/sound.svg" alt="Unmute" width="32" height="32" />';
    } else {
      this.muteBtn.innerHTML =
        '<img src="/muted.svg" alt="Mute" width="32" height="32" />';
    }
  }

  getFrequencyData() {
    if (!this.analyser || !this.frequencyData) return null;
    this.analyser.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
  }

  getBassLevel(bins = 8) {
    const data = this.getFrequencyData();
    if (!data) return 0;

    let sum = 0;
    for (let i = 0; i < bins; i++) {
      sum += data[i];
    }
    return sum / bins / 255;
  }

  getMidLevel(start = 8, count = 16) {
    const data = this.getFrequencyData();
    if (!data) return 0;

    let sum = 0;
    for (let i = start; i < start + count; i++) {
      sum += data[i];
    }
    return sum / count / 255;
  }
}

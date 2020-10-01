/**
 * This class requires the p5 and p5-sound libraries to be loaded before it.
 */
class Spectrum {

    /**
     * Constructor for class.
     * @param id String id for container html element.
     * @param bands Number of frequency bands to display.
     * @param height Height of the canvas. Default is window height.
     * @param width Width of the canvas. Default is window width.
     */
    constructor(id, bands = 64, height, width) {
        if (width == null)
            this.width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        else
            this.width = width;
        if (height == null)
            this.height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        else
            this.height = height;

        this.p5lib = new p5(this.makeSeed(), id);
        this.bands = bands;

        // 0 smoothing, we will handle it ourselves.
        this.fft = new p5.FFT(0);

        // Wether the source is playing.
        this.playing = false;
        // Wether the source is ready.
        this.ready = false;
        // Audio source.
        this.source = null;
    }

    /**
     * @returns Return an interface that binds `setup` and `draw`.
     */
    makeSeed() {
        return (sketch) => {
            sketch.setup = () => {
                // New canvas.
                this.canvas = sketch.createCanvas(this.width, this.height);

                // Alpha for colors, setting lines to semi-transparent white.
                sketch.colorMode(sketch.RGB, 255, 255, 255, 255);
                sketch.stroke(255, 255, 255, 100);

                // ! Get rid of this, find parent size some way.
                this.canvas.class("spectrum");
            };

            sketch.draw = () => {
                if (!this.playing)
                    return;
                sketch.clear();
                let bandW = this.canvas.width / this.bands;
                let bandMaxH = this.canvas.height * 0.6;
                sketch.strokeWeight(bandW * 0.66);
                let leftOffset = bandW / 2;
                if (this.playing) {
                    let spectrum = this.fft.analyze();
                    for (let i = 0; i < this.bands; i++) {
                        let amp = spectrum[i];
                        if (amp == 0)
                            continue;
                        let x = sketch.map(i, 0, this.bands, 0, this.canvas.width);
                        let y = sketch.map(amp, 0, 255, 0, bandMaxH);
                        sketch.line(
                            x + leftOffset,
                            this.canvas.height,
                            x + leftOffset,
                            this.canvas.height - y
                        );
                    }
                }
            };
        };
    }

    /**
     * Stop the playback and set the audio source to `source`.
     * @param source Any suitable audio source for `p5.loadSound`.
     * @param callback Callback for when audio is ready for playback.
     */
    changeSource(source, callback) {
        this.stop();
        this.ready = false;
        let caller = this;
        this.source = this.p5lib.loadSound(
            source,
            function () {
                // Using `this` here refers to `p5lib`.
                caller.ready = true;
                callback();
            }
        );
    }

    /**
     * Play the current source starting at the specified offset in seconds.
     * If already playing, this method does nothing.
     * @param offset The offset in seconds at which to start playback.
     */
    play(offset) {
        if (this.source == null || offset > this.source.duration())
            return;
        if (this.playing || !this.ready)
            return;
        // Play, go to offset.
        this.source.play();
        this.source.jump(offset);
        this.playing = true;
    }

    /**
     * Stop the source being currently played. Does nothing if not playing or
     * the source is null.
     */
    stop() {
        if (this.source == null || !this.playing)
            return;
        this.source.stop();
        this.playing = false;
    }

    /**
     * @returns Wether the audio is being played or not.
     */
    isPlaying() {
        return this.playing;
    }

};
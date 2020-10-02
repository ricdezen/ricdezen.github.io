/**
 * This class requires the p5 and p5-sound libraries to be loaded before it.
 */
class Spectrum {

    /**
     * Constructor for class. The internal canvas is 1080 by 1080 by default.
     * Needs to be squared for proper visualization.
     * Resize it as needed or tweak the css of the parent element.
     * 
     * @param id String id for container html element.
     * @param bands Number of frequency bands to display.
     * @param size Size of the canvas. Default is 1080.
     */
    constructor(id, bands = 87, size = 1080) {
        this.width = size;
        this.height = size;

        this.p5lib = new p5(this.makeSeed(), id);
        this.bands = bands;

        // 0 smoothing, we will handle it ourselves.
        this.fft = new p5.FFT(0.2);

        // Wether the source is playing.
        this.playing = false;
        // Wether the source is ready.
        this.ready = false;
        // Audio source.
        this.source = null;

        // Variable to determine base drawing angle.
        this.baseAngle = 0;
        // Rotation speed in degrees per frame.
        this.speed = 0.3;

        // Array to hold the intensities.
        this.intensities = new Array(this.bands);
        // Max allowed intensity.
        this.maxIntensity = 255 * 255;

        // Radius on previous frame, used when smoothing.
        this.ampSmooth = 0.2;
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

                // Angle between bands to make a circle.
                this.bandAngle = sketch.TWO_PI / this.bands;

                // Diameter ranges from 0.33 to 0.66 of the sketch size.
                this.baseRadius = sketch.height * 0.33 / 2;
                this.maxRadius = sketch.height * 0.66 / 2;
                this.lastRadius = this.baseRadius;
                // Bands can at most fill up the remaining space.
                this.bandMaxH = (sketch.height / 2 - this.maxRadius);

            };

            sketch.draw = () => {
                if (!this.playing)
                    return;
                sketch.clear();

                this.baseAngle += this.speed;
                sketch.translate(sketch.width / 2, sketch.height / 2);
                sketch.rotate(sketch.radians(this.baseAngle));

                // Change both.
                let bandW = 10;
                sketch.strokeWeight(bandW * 0.66);
                if (this.playing) {
                    let intensities = this.fft.analyze();

                    // Radius based on average amplitude.
                    let ampSum = 0;
                    let ampAvg = 0;
                    let wave = this.fft.waveform();
                    for (let i = 0; i < this.bands; i++)
                        ampSum += wave[i];
                    ampAvg = ampSum / this.bands;
                    // Actual radius.
                    let radius = sketch.map(ampAvg, -1, 1, this.baseRadius, this.maxRadius);
                    // Smoothing.
                    radius = this.lastRadius + (radius - this.lastRadius) * this.ampSmooth;
                    this.lastRadius = radius;
                    
                    for (let i = 0; i < this.bands; i++) {
                        let amp = intensities[i] * intensities[i];
                        let y = sketch.map(amp, 0, this.maxIntensity, 0, this.bandMaxH);
                        sketch.line(
                            0,
                            radius - y / 2,
                            0,
                            radius + y / 2
                        );
                        sketch.rotate(this.bandAngle);
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
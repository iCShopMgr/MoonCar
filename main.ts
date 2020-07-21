//% weight=0 color=#CCB72C icon="\uf14e" block="MoonCar"
namespace mooncar {
    pins.setPull(DigitalPin.P7, PinPullMode.PullUp)
	pins.setPull(DigitalPin.P15, PinPullMode.PullNone)
    pins.setPull(DigitalPin.P16, PinPullMode.PullNone)

    function moveMotor(num1: number, num2: number, num3: number, num4: number) {
        pins.analogWritePin(AnalogPin.P2, num1)
        pins.analogWritePin(AnalogPin.P8, num2)
        pins.analogWritePin(AnalogPin.P13, num3)
        pins.analogWritePin(AnalogPin.P14, num4)
    }

	export enum Direction {
		//% block="Forward"
		direct1 = 1,
		//% block="Back"
		direct2 = 2,
		//% block="Left"
		direct3 = 3,
		//% block="Right"
		direct4 = 4,
		//% block="Stop"
		direct5 = 5
	}

	//% block="MoonCar to move %direction |speed %movespeed |(0~100)"
	export function MoonCarGo(direction: Direction = 1, movespeed: number): void {
		if(movespeed > 100)movespeed = 100
		if(movespeed < 0)movespeed = 0
		movespeed = Math.round(Math.map(movespeed, 0, 100, 0, 1023))

        switch(direction) {
			case 1:
				moveMotor(movespeed, movespeed, 0, 0)
				break;
			case 2:
				moveMotor(0, 0, movespeed, movespeed)
				break;
			case 3:
				moveMotor(movespeed, 0, 0, movespeed)
				break;
			case 4:
				moveMotor(0, movespeed, movespeed, 0)
                break;
            case 5:
                moveMotor(0, 0, 0, 0)
                break;
		}
	}

	//% block="MoonCar wheel speed Left %left |Right %right |(-100~100)"
	export function MoonCarLR(left: number=0, right: number=0): void {
		Math.constrain(left, -100, 100)
		Math.constrain(right, -100, 100)
		if (left > 0) {
			left = Math.round(Math.map(left, 0, 100, 0, 1023))
			pins.analogWritePin(AnalogPin.P8, left)
        	pins.analogWritePin(AnalogPin.P14, 0)
		}
		else {
			left = left * -1
			left = Math.round(Math.map(left, 0, 100, 0, 1023))
			pins.analogWritePin(AnalogPin.P8, 0)
        	pins.analogWritePin(AnalogPin.P14, left)
		}
		if (right > 0) {
			right = Math.round(Math.map(right, 0, 100, 0, 1023))
			pins.analogWritePin(AnalogPin.P2, right)
			pins.analogWritePin(AnalogPin.P13, 0)
		}
		else {
			right = right * -1
			right = Math.round(Math.map(right, 0, 100, 0, 1023))
			pins.analogWritePin(AnalogPin.P2, 0)
        	pins.analogWritePin(AnalogPin.P13, right)
		}
	}

    let position = 0
	//% block="Line Follower Sensor"
    export function LineFollowerSensor(): number {
        if (pins.digitalReadPin(DigitalPin.P15) == 1) {
			if (pins.digitalReadPin(DigitalPin.P16) == 1) {
				position = 0
			}
			else {
				position = 1
			}
		}
		else {
			if (pins.digitalReadPin(DigitalPin.P16) == 1) {
				position = 2
			}
			else {
				position = 3
			}
		}
		return position
	}

	//% block="Ultrasonic Sensor"
    export function UltrasonicSensor(): number {
		let distance = 0
		pins.setPull(DigitalPin.P3, PinPullMode.PullNone);

		pins.digitalWritePin(DigitalPin.P3, 0);
		control.waitMicros(2);
		pins.digitalWritePin(DigitalPin.P3, 1);
		control.waitMicros(10)
		pins.digitalWritePin(DigitalPin.P3, 0);

		distance = pins.pulseIn(DigitalPin.P9, PulseValue.High)
		return distance = Math.round(distance / 2 / 29)
	}

	//% block="Push Bottom"
    export function PushBottom(): number {
		let pushvalue = pins.digitalReadPin(DigitalPin.P7)
		if (pushvalue == 1) {
			pushvalue = 0
		}
		else {
			pushvalue = 1
		}
		return pushvalue
	}

	//% block="Color Sensor init"
	export function ColorSensorinit(): void {
		pins.i2cWriteNumber(41, 33276, NumberFormat.UInt16BE, false)
		pins.i2cWriteNumber(41, 32771, NumberFormat.UInt16BE, false)
		pins.digitalWritePin(DigitalPin.P11, 0);
		basic.pause(10)
		let dropout = pins.digitalReadPin(DigitalPin.P11)
	}

	export enum Switch {
		//% block="ON"
		Open = 1,
		//% block="OFF"
		Close = 2
	}

	//% block="Fill Light %switch_"
	export function Filllight(switch_: Switch=1): void {
		if (switch_ == 1) {
			pins.digitalWritePin(DigitalPin.P11, 0);
			basic.pause(10)
			let dropout = pins.digitalReadPin(DigitalPin.P11)
		}
		else {
			pins.digitalWritePin(DigitalPin.P11, 1);
		}
	}

	export enum Channel {
		//% block="R"
		Red = 1,
		//% block="G"
		Green = 2,
		//% block="B"
		Blue = 3
	}

	//% block="Color Sensor read RGB %channel |channel"
	export function ColorSensorRead(channel: Channel=1): number {
		pins.i2cWriteNumber(41, 178, NumberFormat.Int8LE, true)
		//let ID = pins.i2cReadNumber(41, NumberFormat.Int8BE, false)
		pins.i2cWriteNumber(41, 179, NumberFormat.Int8LE, true)
		//let State = pins.i2cReadNumber(41, NumberFormat.Int8BE, false)
		pins.i2cWriteNumber(41, 182, NumberFormat.Int8LE, true)
		let TCS_RED = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
		pins.i2cWriteNumber(41, 184, NumberFormat.Int8LE, true)
		let TCS_GREEN = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
		pins.i2cWriteNumber(41, 186, NumberFormat.Int8LE, true)
		let TCS_BLUE = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)

		let RdCl = 0
		switch(channel) {
			case 1:
				RdCl = Math.round(Math.map(TCS_RED, 0, 65535, 0, 1023))
				break;
			case 2:
				RdCl =  Math.round(Math.map(TCS_GREEN, 0, 65535, 0, 1023))
				break;
			case 3:
				RdCl = Math.round(Math.map(TCS_BLUE, 0, 65535, 0, 1023))
				break;
		}

		return RdCl
	}
	//=============================================================================
	let nowReadColor = [0, 0, 0]
	//% block="Color Sensor read color"
	export function ColorSensorReadColor(): void {
		pins.i2cWriteNumber(41, 178, NumberFormat.Int8LE, true)
		//let ID = pins.i2cReadNumber(41, NumberFormat.Int8BE, false)
		pins.i2cWriteNumber(41, 179, NumberFormat.Int8LE, true)
		//let State = pins.i2cReadNumber(41, NumberFormat.Int8BE, false)
		pins.i2cWriteNumber(41, 182, NumberFormat.Int8LE, true)
		let TCS_RED = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
		pins.i2cWriteNumber(41, 184, NumberFormat.Int8LE, true)
		let TCS_GREEN = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
		pins.i2cWriteNumber(41, 186, NumberFormat.Int8LE, true)
		let TCS_BLUE = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
		TCS_RED = Math.round(Math.map(TCS_RED, 0, 65535, 0, 1023))
		TCS_GREEN =  Math.round(Math.map(TCS_GREEN, 0, 65535, 0, 1023))
		TCS_BLUE = Math.round(Math.map(TCS_BLUE, 0, 65535, 0, 1023))
		nowReadColor = [TCS_RED, TCS_GREEN, TCS_BLUE]
	}

	export enum ColorPart {
		//% block="Red"
		Red = 1,
		//% block="Green"
		Green = 2,
		//% block="Blue"
		Blue = 3,
		//% block="Yellow"
		Yellow = 4,
		//% block="Azure"
		Azure = 5,
		//% block="Purple"
		Purple = 6,
		//% block="Custom1"
		Custom1 = 7,
		//% block="Custom2"
		Custom2 = 8,
		//% block="Custom3"
		Custom3 = 9
	}

	let ReadRedColor = [0, 0, 0]
	let ReadGreenColor = [0, 0, 0]
	let ReadBlueColor = [0, 0, 0]
	let ReadYellowColor = [0, 0, 0]
	let ReadAzureColor = [0, 0, 0]
	let ReadPurpleColor = [0, 0, 0]
	let ReadCustom1Color = [0, 0, 0]
	let ReadCustom2Color = [0, 0, 0]
	let ReadCustom3Color = [0, 0, 0]

	//% block="Color Sensor record %colorpart |color"
	export function ColorSensorRecord(colorpart: ColorPart=1): void {
		pins.i2cWriteNumber(41, 178, NumberFormat.Int8LE, true)
		//let ID = pins.i2cReadNumber(41, NumberFormat.Int8BE, false)
		pins.i2cWriteNumber(41, 179, NumberFormat.Int8LE, true)
		//let State = pins.i2cReadNumber(41, NumberFormat.Int8BE, false)
		pins.i2cWriteNumber(41, 182, NumberFormat.Int8LE, true)
		let TCS_RED = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
		pins.i2cWriteNumber(41, 184, NumberFormat.Int8LE, true)
		let TCS_GREEN = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
		pins.i2cWriteNumber(41, 186, NumberFormat.Int8LE, true)
		let TCS_BLUE = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
		TCS_RED = Math.round(Math.map(TCS_RED, 0, 65535, 0, 1023))
		TCS_GREEN =  Math.round(Math.map(TCS_GREEN, 0, 65535, 0, 1023))
		TCS_BLUE = Math.round(Math.map(TCS_BLUE, 0, 65535, 0, 1023))
		switch(colorpart) {
			case 1:
				ReadRedColor = [TCS_RED, TCS_GREEN, TCS_BLUE]
				break;
			case 2:
				ReadGreenColor = [TCS_RED, TCS_GREEN, TCS_BLUE]
				break;
			case 3:
				ReadBlueColor = [TCS_RED, TCS_GREEN, TCS_BLUE]
				break;
			case 4:
				ReadYellowColor = [TCS_RED, TCS_GREEN, TCS_BLUE]
				break;
			case 5:
				ReadAzureColor = [TCS_RED, TCS_GREEN, TCS_BLUE]
				break;
			case 6:
				ReadPurpleColor = [TCS_RED, TCS_GREEN, TCS_BLUE]
				break;
			case 7:
				ReadCustom1Color = [TCS_RED, TCS_GREEN, TCS_BLUE]
				break;
			case 8:
				ReadCustom2Color = [TCS_RED, TCS_GREEN, TCS_BLUE]
				break;
			case 9:
				ReadCustom3Color = [TCS_RED, TCS_GREEN, TCS_BLUE]
				break;
		}
	}

	let colorright = false
	let forkrange = 50
	//% block="Read color equal %colorpart |color?"
    export function ReadColorEqual(colorpart: ColorPart=1): boolean {
		switch(colorpart) {
			case 1:
				if ((Math.abs(ReadRedColor[0]-nowReadColor[0])<forkrange) && (Math.abs(ReadRedColor[1]-nowReadColor[1])<forkrange) && (Math.abs(ReadRedColor[2]-nowReadColor[2])<forkrange)) {
					colorright = true
				}
				else {
					colorright = false
				}
				break;
			case 2:
				if ((Math.abs(ReadGreenColor[0]-nowReadColor[0])<forkrange) && (Math.abs(ReadGreenColor[1]-nowReadColor[1])<forkrange) && (Math.abs(ReadGreenColor[2]-nowReadColor[2])<forkrange)) {
					colorright = true
				}
				else {
					colorright = false
				}
				break;
			case 3:
				if ((Math.abs(ReadBlueColor[0]-nowReadColor[0])<forkrange) && (Math.abs(ReadBlueColor[1]-nowReadColor[1])<forkrange) && (Math.abs(ReadBlueColor[2]-nowReadColor[2])<forkrange)) {
					colorright = true
				}
				else {
					colorright = false
				}
				break;
			case 4:
				if ((Math.abs(ReadYellowColor[0]-nowReadColor[0])<forkrange) && (Math.abs(ReadYellowColor[1]-nowReadColor[1])<forkrange) && (Math.abs(ReadYellowColor[2]-nowReadColor[2])<forkrange)) {
					colorright = true
				}
				else {
					colorright = false
				}
				break;
			case 5:
				if ((Math.abs(ReadAzureColor[0]-nowReadColor[0])<forkrange) && (Math.abs(ReadAzureColor[1]-nowReadColor[1])<forkrange) && (Math.abs(ReadAzureColor[2]-nowReadColor[2])<forkrange)) {
					colorright = true
				}
				else {
					colorright = false
				}
				break;
			case 6:
				if ((Math.abs(ReadPurpleColor[0]-nowReadColor[0])<forkrange) && (Math.abs(ReadPurpleColor[1]-nowReadColor[1])<forkrange) && (Math.abs(ReadPurpleColor[2]-nowReadColor[2])<forkrange)) {
					colorright = true
				}
				else {
					colorright = false
				}
				break;
			case 7:
				if ((Math.abs(ReadCustom1Color[0]-nowReadColor[0])<forkrange) && (Math.abs(ReadCustom1Color[1]-nowReadColor[1])<forkrange) && (Math.abs(ReadCustom1Color[2]-nowReadColor[2])<forkrange)) {
					colorright = true
				}
				else {
					colorright = false
				}
				break;
			case 8:
				if ((Math.abs(ReadCustom2Color[0]-nowReadColor[0])<forkrange) && (Math.abs(ReadCustom2Color[1]-nowReadColor[1])<forkrange) && (Math.abs(ReadCustom2Color[2]-nowReadColor[2])<forkrange)) {
					colorright = true
				}
				else {
					colorright = false
				}
				break;
			case 9:
				if ((Math.abs(ReadCustom3Color[0]-nowReadColor[0])<forkrange) && (Math.abs(ReadCustom3Color[1]-nowReadColor[1])<forkrange) && (Math.abs(ReadCustom3Color[2]-nowReadColor[2])<forkrange)) {
					colorright = true
				}
				else {
					colorright = false
				}
				break;
		}
		if (colorright == true) {
			return true
		}
		else {
			return false
		}
	}


	//=============================================================================

	//% block="Enable IR"
	export function EnIR() :void{
		pins.onPulsed(DigitalPin.P1, PulseValue.Low, function () {
			readir.push(pins.pulseDuration())
		})
		pins.onPulsed(DigitalPin.P1, PulseValue.High, function () {
			readir.push(pins.pulseDuration())
		})

		pins.setEvents(DigitalPin.P1, PinEventType.Pulse)
		pins.setPull(DigitalPin.P1, PinPullMode.PullUp)
	}

	let readir: number[] = []
	readir = []
	let Pnumber = 0
	let IRREAD: Action;
	let Reading = false
	control.inBackground(function () {
		while(true) {
			if (Reading == true) {
				if (readir[0] > 30000) {
					basic.pause(100)
					let count = 0
					let one_data = 0
					for (let i = 0; i < readir.length; i++) {
						if (readir[i] > 1000 && readir[i] < 2000) {
							count += 1
						}
						if (count == 8) {
							one_data = i + 2
							break
						}
					}

					Pnumber = 0
					for (let i = 0; i < 8; i++) {
						if (readir[one_data] > 1000) {
							Pnumber += (1 << (7 - i))
						}
						one_data += 2
					}
					basic.pause(50)
					readir = []
					if (Reading) {
						IRREAD()
					}
				}
				else {
					readir = []
				}
			}
      basic.pause(1)
		}
	})

	//% block="IR Read"
	export function IRRead(): number {
		return Pnumber
	}

	//% block="IR Remote(NEC)" blockInlineInputs=true
	//% weight=80 blockGap=10
	export function IRRemote(add: Action): void {
		IRREAD = add
		Reading = true
	}

	function IRon(d: number) {
		let r = d;
		while (r > 26) {
			pins.digitalWritePin(DigitalPin.P6, 1)
			control.waitMicros(2);
			pins.digitalWritePin(DigitalPin.P6, 0)
			r = r - 26;
		}
	}

	function IRoff(d: number) {
		control.waitMicros(d);
	}

	function send(code: number) {
		for (let i = 7; i > -1; i--) {
			if (1 << i & code) {
				IRon(560);
				IRoff(1600);
			} else {
				IRon(560);
				IRoff(560);
			}
		}
	}

	function recode(code: number): number {
		let message = 0
		for (let i = 7; i > -1; i--) {
			if (!(1 << i & code)) {
				message += (1 << i)
			}
		}
		return message
	}

	//% block="IR Send(NEC) %irnumber|(0~255)"
	export function IRcommand(irnumber: number) :void{
		let irnumber2 = recode(irnumber)
		IRon(8500);
		IRoff(4500);
		send(0);
		send(255);
		send(irnumber);
		send(irnumber2);
		IRon(560);
		IRoff(4500);
	}

  export enum NeoPixelColors {
    //% block=red
    Red = 0xFF0000,
    //% block=orange
    Orange = 0xFFA500,
    //% block=yellow
    Yellow = 0xFFFF00,
    //% block=green
    Green = 0x00FF00,
    //% block=blue
    Blue = 0x0000FF,
    //% block=indigo
    Indigo = 0x4b0082,
    //% block=violet
    Violet = 0x8a2be2,
    //% block=purple
    Purple = 0xFF00FF,
    //% block=white
    White = 0xFFFFFF,
    //% block=black
    Black = 0x000000
  }

  export enum NeoPixelMode {
    //% block="RGB (GRB format)"
    RGB = 1,
    //% block="RGB+W"
    RGBW = 2,
    //% block="RGB (RGB format)"
    RGB_RGB = 3
  }

  export class Strip {
    buf: Buffer;
    pin: DigitalPin;
    // TODO: encode as bytes instead of 32bit
    brightness: number;
    start: number; // start offset in LED strip
    _length: number; // number of LEDs
    _mode: NeoPixelMode;
    _matrixWidth: number; // number of leds in a matrix - if any

    /**
     * Shows all LEDs to a given color (range 0-255 for r, g, b).
     * @param rgb RGB color of the LED
     */
    //% blockId="neopixel_set_strip_color" block="%strip|show color %rgb=neopixel_colors"
    //% strip.defl=strip
    //% weight=85 blockGap=8
    //% parts="neopixel"
    showColor(rgb: number) {
        rgb = rgb >> 0;
        this.setAllRGB(rgb);
        this.show();
    }

    /**
     * Shows a rainbow pattern on all LEDs.
     * @param startHue the start hue value for the rainbow, eg: 1
     * @param endHue the end hue value for the rainbow, eg: 360
     */
    //% blockId="neopixel_set_strip_rainbow" block="%strip|show rainbow from %startHue|to %endHue"
    //% strip.defl=strip
    //% weight=85 blockGap=8
    //% parts="neopixel"
    showRainbow(startHue: number = 1, endHue: number = 360) {
        if (this._length <= 0) return;

        startHue = startHue >> 0;
        endHue = endHue >> 0;
        const saturation = 100;
        const luminance = 50;
        const steps = this._length;
        const direction = HueInterpolationDirection.Clockwise;

        //hue
        const h1 = startHue;
        const h2 = endHue;
        const hDistCW = ((h2 + 360) - h1) % 360;
        const hStepCW = Math.idiv((hDistCW * 100), steps);
        const hDistCCW = ((h1 + 360) - h2) % 360;
        const hStepCCW = Math.idiv(-(hDistCCW * 100), steps);
        let hStep: number;
        if (direction === HueInterpolationDirection.Clockwise) {
            hStep = hStepCW;
        } else if (direction === HueInterpolationDirection.CounterClockwise) {
            hStep = hStepCCW;
        } else {
            hStep = hDistCW < hDistCCW ? hStepCW : hStepCCW;
        }
        const h1_100 = h1 * 100; //we multiply by 100 so we keep more accurate results while doing interpolation

        //sat
        const s1 = saturation;
        const s2 = saturation;
        const sDist = s2 - s1;
        const sStep = Math.idiv(sDist, steps);
        const s1_100 = s1 * 100;

        //lum
        const l1 = luminance;
        const l2 = luminance;
        const lDist = l2 - l1;
        const lStep = Math.idiv(lDist, steps);
        const l1_100 = l1 * 100

        //interpolate
        if (steps === 1) {
            this.setPixelColor(0, hsl(h1 + hStep, s1 + sStep, l1 + lStep))
        } else {
            this.setPixelColor(0, hsl(startHue, saturation, luminance));
            for (let i = 1; i < steps - 1; i++) {
                const h = Math.idiv((h1_100 + i * hStep), 100) + 360;
                const s = Math.idiv((s1_100 + i * sStep), 100);
                const l = Math.idiv((l1_100 + i * lStep), 100);
                this.setPixelColor(i, hsl(h, s, l));
            }
            this.setPixelColor(steps - 1, hsl(endHue, saturation, luminance));
        }
        this.show();
    }

    /**
     * Displays a vertical bar graph based on the `value` and `high` value.
     * If `high` is 0, the chart gets adjusted automatically.
     * @param value current value to plot
     * @param high maximum value, eg: 255
     */
    //% weight=84
    //% blockId=neopixel_show_bar_graph block="%strip|show bar graph of %value|up to %high"
    //% strip.defl=strip
    //% icon="\uf080"
    //% parts="neopixel"
    showBarGraph(value: number, high: number): void {
        if (high <= 0) {
            this.clear();
            this.setPixelColor(0, NeoPixelColors.Yellow);
            this.show();
            return;
        }

        value = Math.abs(value);
        const n = this._length;
        const n1 = n - 1;
        let v = Math.idiv((value * n), high);
        if (v == 0) {
            this.setPixelColor(0, 0x666600);
            for (let i = 1; i < n; ++i)
                this.setPixelColor(i, 0);
        } else {
            for (let i = 0; i < n; ++i) {
                if (i <= v) {
                    const b = Math.idiv(i * 255, n1);
                    this.setPixelColor(i, neopixel.rgb(b, 0, 255 - b));
                }
                else this.setPixelColor(i, 0);
            }
        }
        this.show();
    }

    /**
     * Set LED to a given color (range 0-255 for r, g, b).
     * You need to call ``show`` to make the changes visible.
     * @param pixeloffset position of the NeoPixel in the strip
     * @param rgb RGB color of the LED
     */
    //% blockId="neopixel_set_pixel_color" block="%strip|set pixel color at %pixeloffset|to %rgb=neopixel_colors"
    //% strip.defl=strip
    //% blockGap=8
    //% weight=80
    //% parts="neopixel" advanced=true
    setPixelColor(pixeloffset: number, rgb: number): void {
        this.setPixelRGB(pixeloffset >> 0, rgb >> 0);
    }

    /**
     * Sets the number of pixels in a matrix shaped strip
     * @param width number of pixels in a row
     */
    //% blockId=neopixel_set_matrix_width block="%strip|set matrix width %width"
    //% strip.defl=strip
    //% blockGap=8
    //% weight=5
    //% parts="neopixel" advanced=true
    setMatrixWidth(width: number) {
        this._matrixWidth = Math.min(this._length, width >> 0);
    }

    /**
     * Set LED to a given color (range 0-255 for r, g, b) in a matrix shaped strip
     * You need to call ``show`` to make the changes visible.
     * @param x horizontal position
     * @param y horizontal position
     * @param rgb RGB color of the LED
     */
    //% blockId="neopixel_set_matrix_color" block="%strip|set matrix color at x %x|y %y|to %rgb=neopixel_colors"
    //% strip.defl=strip
    //% weight=4
    //% parts="neopixel" advanced=true
    setMatrixColor(x: number, y: number, rgb: number) {
        if (this._matrixWidth <= 0) return; // not a matrix, ignore
        x = x >> 0;
        y = y >> 0;
        rgb = rgb >> 0;
        const cols = Math.idiv(this._length, this._matrixWidth);
        if (x < 0 || x >= this._matrixWidth || y < 0 || y >= cols) return;
        let i = x + y * this._matrixWidth;
        this.setPixelColor(i, rgb);
    }

    /**
     * For NeoPixels with RGB+W LEDs, set the white LED brightness. This only works for RGB+W NeoPixels.
     * @param pixeloffset position of the LED in the strip
     * @param white brightness of the white LED
     */
    //% blockId="neopixel_set_pixel_white" block="%strip|set pixel white LED at %pixeloffset|to %white"
    //% strip.defl=strip
    //% blockGap=8
    //% weight=80
    //% parts="neopixel" advanced=true
    setPixelWhiteLED(pixeloffset: number, white: number): void {
        if (this._mode === NeoPixelMode.RGBW) {
            this.setPixelW(pixeloffset >> 0, white >> 0);
        }
    }

    /**
     * Send all the changes to the strip.
     */
    //% blockId="neopixel_show" block="%strip|show" blockGap=8
    //% strip.defl=strip
    //% weight=79
    //% parts="neopixel"
    show() {
        // only supported in beta
        // ws2812b.setBufferMode(this.pin, this._mode);
        ws2812b.sendBuffer(this.buf, this.pin);
    }

    /**
     * Turn off all LEDs.
     * You need to call ``show`` to make the changes visible.
     */
    //% blockId="neopixel_clear" block="%strip|clear"
    //% strip.defl=strip
    //% weight=76
    //% parts="neopixel"
    clear(): void {
        const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
        this.buf.fill(0, this.start * stride, this._length * stride);
    }

    /**
     * Gets the number of pixels declared on the strip
     */
    //% blockId="neopixel_length" block="%strip|length" blockGap=8
    //% strip.defl=strip
    //% weight=60 advanced=true
    length() {
        return this._length;
    }

    /**
     * Set the brightness of the strip. This flag only applies to future operation.
     * @param brightness a measure of LED brightness in 0-255. eg: 255
     */
    //% blockId="neopixel_set_brightness" block="%strip|set brightness %brightness" blockGap=8
    //% strip.defl=strip
    //% weight=59
    //% parts="neopixel" advanced=true
    setBrightness(brightness: number): void {
        this.brightness = brightness & 0xff;
    }

    /**
     * Apply brightness to current colors using a quadratic easing function.
     **/
    //% blockId="neopixel_each_brightness" block="%strip|ease brightness" blockGap=8
    //% strip.defl=strip
    //% weight=58
    //% parts="neopixel" advanced=true
    easeBrightness(): void {
        const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
        const br = this.brightness;
        const buf = this.buf;
        const end = this.start + this._length;
        const mid = Math.idiv(this._length, 2);
        for (let i = this.start; i < end; ++i) {
            const k = i - this.start;
            const ledoffset = i * stride;
            const br = k > mid
                ? Math.idiv(255 * (this._length - 1 - k) * (this._length - 1 - k), (mid * mid))
                : Math.idiv(255 * k * k, (mid * mid));
            const r = (buf[ledoffset + 0] * br) >> 8; buf[ledoffset + 0] = r;
            const g = (buf[ledoffset + 1] * br) >> 8; buf[ledoffset + 1] = g;
            const b = (buf[ledoffset + 2] * br) >> 8; buf[ledoffset + 2] = b;
            if (stride == 4) {
                const w = (buf[ledoffset + 3] * br) >> 8; buf[ledoffset + 3] = w;
            }
        }
    }

    /**
     * Create a range of LEDs.
     * @param start offset in the LED strip to start the range
     * @param length number of LEDs in the range. eg: 4
     */
    //% weight=89
    //% blockId="neopixel_range" block="%strip|range from %start|with %length|leds"
    //% strip.defl=strip
    //% parts="neopixel"
    //% blockSetVariable=range
    range(start: number, length: number): Strip {
        start = start >> 0;
        length = length >> 0;
        let strip = new Strip();
        strip.buf = this.buf;
        strip.pin = this.pin;
        strip.brightness = this.brightness;
        strip.start = this.start + Math.clamp(0, this._length - 1, start);
        strip._length = Math.clamp(0, this._length - (strip.start - this.start), length);
        strip._matrixWidth = 0;
        strip._mode = this._mode;
        return strip;
    }

    /**
     * Shift LEDs forward and clear with zeros.
     * You need to call ``show`` to make the changes visible.
     * @param offset number of pixels to shift forward, eg: 1
     */
    //% blockId="neopixel_shift" block="%strip|shift pixels by %offset" blockGap=8
    //% strip.defl=strip
    //% weight=40
    //% parts="neopixel"
    shift(offset: number = 1): void {
        offset = offset >> 0;
        const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
        this.buf.shift(-offset * stride, this.start * stride, this._length * stride)
    }

    /**
     * Rotate LEDs forward.
     * You need to call ``show`` to make the changes visible.
     * @param offset number of pixels to rotate forward, eg: 1
     */
    //% blockId="neopixel_rotate" block="%strip|rotate pixels by %offset" blockGap=8
    //% strip.defl=strip
    //% weight=39
    //% parts="neopixel"
    rotate(offset: number = 1): void {
        offset = offset >> 0;
        const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
        this.buf.rotate(-offset * stride, this.start * stride, this._length * stride)
    }

    /**
     * Set the pin where the neopixel is connected, defaults to P0.
     */
    //% weight=10
    //% parts="neopixel" advanced=true
    setPin(pin: DigitalPin): void {
        this.pin = pin;
        pins.digitalWritePin(this.pin, 0);
        // don't yield to avoid races on initialization
    }

    /**
     * Estimates the electrical current (mA) consumed by the current light configuration.
     */
    //% weight=9 blockId=neopixel_power block="%strip|power (mA)"
    //% strip.defl=strip
    //% advanced=true
    power(): number {
        const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
        const end = this.start + this._length;
        let p = 0;
        for (let i = this.start; i < end; ++i) {
            const ledoffset = i * stride;
            for (let j = 0; j < stride; ++j) {
                p += this.buf[i + j];
            }
        }
        return Math.idiv(this.length() * 7, 10) /* 0.7mA per neopixel */
            + Math.idiv(p * 480, 10000); /* rought approximation */
    }

    private setBufferRGB(offset: number, red: number, green: number, blue: number): void {
        if (this._mode === NeoPixelMode.RGB_RGB) {
            this.buf[offset + 0] = red;
            this.buf[offset + 1] = green;
        } else {
            this.buf[offset + 0] = green;
            this.buf[offset + 1] = red;
        }
        this.buf[offset + 2] = blue;
    }

    private setAllRGB(rgb: number) {
        let red = unpackR(rgb);
        let green = unpackG(rgb);
        let blue = unpackB(rgb);

        const br = this.brightness;
        if (br < 255) {
            red = (red * br) >> 8;
            green = (green * br) >> 8;
            blue = (blue * br) >> 8;
        }
        const end = this.start + this._length;
        const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
        for (let i = this.start; i < end; ++i) {
            this.setBufferRGB(i * stride, red, green, blue)
        }
    }
    private setAllW(white: number) {
        if (this._mode !== NeoPixelMode.RGBW)
            return;

        let br = this.brightness;
        if (br < 255) {
            white = (white * br) >> 8;
        }
        let buf = this.buf;
        let end = this.start + this._length;
        for (let i = this.start; i < end; ++i) {
            let ledoffset = i * 4;
            buf[ledoffset + 3] = white;
        }
    }
    private setPixelRGB(pixeloffset: number, rgb: number): void {
        if (pixeloffset < 0
            || pixeloffset >= this._length)
            return;

        let stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
        pixeloffset = (pixeloffset + this.start) * stride;

        let red = unpackR(rgb);
        let green = unpackG(rgb);
        let blue = unpackB(rgb);

        let br = this.brightness;
        if (br < 255) {
            red = (red * br) >> 8;
            green = (green * br) >> 8;
            blue = (blue * br) >> 8;
        }
        this.setBufferRGB(pixeloffset, red, green, blue)
    }
    private setPixelW(pixeloffset: number, white: number): void {
        if (this._mode !== NeoPixelMode.RGBW)
            return;

        if (pixeloffset < 0
            || pixeloffset >= this._length)
            return;

        pixeloffset = (pixeloffset + this.start) * 4;

        let br = this.brightness;
        if (br < 255) {
            white = (white * br) >> 8;
        }
        let buf = this.buf;
        buf[pixeloffset + 3] = white;
    }
  }

  //% block="NeoPixel at pin %pin|with %numleds|leds as %mode"
  //% weight=90 blockGap=8
  export function create(pin: DigitalPin, numleds: number, mode: NeoPixelMode): Strip {
      let strip = new Strip();
      let stride = mode === NeoPixelMode.RGBW ? 4 : 3;
      strip.buf = pins.createBuffer(numleds * stride);
      strip.start = 0;
      strip._length = numleds;
      strip._mode = mode || NeoPixelMode.RGB;
      strip._matrixWidth = 0;
      strip.setBrightness(128)
      strip.setPin(pin)
      return strip;
  }

  function packRGB(a: number, b: number, c: number): number {
    return ((a & 0xFF) << 16) | ((b & 0xFF) << 8) | (c & 0xFF);
  }
  function unpackR(rgb: number): number {
      let r = (rgb >> 16) & 0xFF;
      return r;
  }
  function unpackG(rgb: number): number {
      let g = (rgb >> 8) & 0xFF;
      return g;
  }
  function unpackB(rgb: number): number {
      let b = (rgb) & 0xFF;
      return b;
  }

  //% block="red %red|green %green|blue %blue"
  export function rgb(red: number, green: number, blue: number): number {
    return packRGB(red, green, blue);
  }

  /**
   * Converts a hue saturation luminosity value into a RGB color
   * @param h hue from 0 to 360
   * @param s saturation from 0 to 99
   * @param l luminosity from 0 to 99
   */
  //% blockId=neopixelHSL block="hue %h|saturation %s|luminosity %l"
  export function hsl(h: number, s: number, l: number): number {
    h = Math.round(h);
    s = Math.round(s);
    l = Math.round(l);

    h = h % 360;
    s = Math.clamp(0, 99, s);
    l = Math.clamp(0, 99, l);
    let c = Math.idiv((((100 - Math.abs(2 * l - 100)) * s) << 8), 10000); //chroma, [0,255]
    let h1 = Math.idiv(h, 60);//[0,6]
    let h2 = Math.idiv((h - h1 * 60) * 256, 60);//[0,255]
    let temp = Math.abs((((h1 % 2) << 8) + h2) - 256);
    let x = (c * (256 - (temp))) >> 8;//[0,255], second largest component of this color
    let r$: number;
    let g$: number;
    let b$: number;
    if (h1 == 0) {
        r$ = c; g$ = x; b$ = 0;
    } else if (h1 == 1) {
        r$ = x; g$ = c; b$ = 0;
    } else if (h1 == 2) {
        r$ = 0; g$ = c; b$ = x;
    } else if (h1 == 3) {
        r$ = 0; g$ = x; b$ = c;
    } else if (h1 == 4) {
        r$ = x; g$ = 0; b$ = c;
    } else if (h1 == 5) {
        r$ = c; g$ = 0; b$ = x;
    }
    let m = Math.idiv((Math.idiv((l * 2 << 8), 100) - c), 2);
    let r = r$ + m;
    let g = g$ + m;
    let b = b$ + m;
    return packRGB(r, g, b);
  }
}

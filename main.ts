//% weight=0 color=#CCB72C icon="\uf299" block="MoonCar"
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

	//%block="MoonCar to move %direction |speed %movespeed |(0-100)"
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

	//%block="MoonCar wheel speed Left %left |Right %right |(-100-100)"
	export function MoonCarLR(left: number=0, right: number=0): void {
		Math.constrain(left, -100, 100)
		Math.constrain(right, -100, 100)
		if (left > 0) {
			left = Math.round(Math.map(left, 0, 100, 0, 1023))
			pins.analogWritePin(AnalogPin.P2, left)
        	pins.analogWritePin(AnalogPin.P13, 0)	
		}
		else {
			left = left * -1
			left = Math.round(Math.map(left, 0, 100, 0, 1023))
			pins.analogWritePin(AnalogPin.P2, 0)
        	pins.analogWritePin(AnalogPin.P13, left)
		}
		if (right > 0) {
			right = Math.round(Math.map(right, 0, 100, 0, 1023))
			pins.analogWritePin(AnalogPin.P8, right)
			pins.analogWritePin(AnalogPin.P14, 0)	
		}
		else {
			right = right * -1
			right = Math.round(Math.map(right, 0, 100, 0, 1023))
			pins.analogWritePin(AnalogPin.P8, 0)
        	pins.analogWritePin(AnalogPin.P14, right)
		}
	}

    let position = 0
	//%block="Line Follower Sensor"
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
	
	//%block="Ultrasonic Sensor"
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

	//%block="Push Bottom"
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

	//%block="Color Sensor init"
	export function ColorSensorinit(): void {
		pins.i2cWriteNumber(41, 33276, NumberFormat.UInt16BE, false)
		pins.i2cWriteNumber(41, 32771, NumberFormat.UInt16BE, false)
		pins.digitalWritePin(DigitalPin.P11, 0);
		basic.pause(10)
	}

	export enum Channel {
		//% block="R"
		channel1 = 1,
		//% block="G"
		channel2 = 2,
		//% block="B"
		channel3 = 3
	}

	//%block="Color Sensor read RGB %channel |channel"
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

	pins.onPulsed(DigitalPin.P1, PulseValue.Low, function () {
		readir.push(pins.pulseDuration())
	})
	pins.onPulsed(DigitalPin.P1, PulseValue.High, function () {
		readir.push(pins.pulseDuration())
	})
	let readir: number[] = []
	readir = []
	let Pnumber = 0
	pins.setEvents(DigitalPin.P1, PinEventType.Pulse)
	pins.setPull(DigitalPin.P1, PinPullMode.PullUp)

	let IRREAD: Action;
	let Reading = false
	control.inBackground(function () {
		basic.forever(function () {
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
					/*
					if (Pnumber == 192) {
						for (let i = 0; i < readir.length; i++) {
							if (i % 2 != 0) {
								serial.writeLine("," + readir[i] + ",")
							}
							else {
								serial.writeNumber(readir[i])
							}
						}
						serial.writeLine("==========")
					}
					*/
					readir = []
					if (Reading) {
						IRREAD()
					}
				}
				else {
					readir = []
				}
			}
		})
	})

	//%block="IR Read"
	export function IRRead(): number {
		return Pnumber
	}

	//%block="IR Remote(NEC)" blockInlineInputs=true
	//%weight=80 blockGap=10
	export function IRRemote(add: Action): void {
		IRREAD = add
		Reading = true
	}

	function IRon(d: number) {
		let r = d;
		while (r > 26) {
			pins.digitalWritePin(DigitalPin.P0, 1)
			control.waitMicros(2);
			pins.digitalWritePin(DigitalPin.P0, 0)
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
	
	//%block="IR Send(NEC) %irnumber|(0-255)"
	function IRcommand(irnumber: number) {
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
}





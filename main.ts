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
	export function MoonCar_go(direction: Direction = 1, movespeed: number): void {
		if(movespeed > 100)movespeed = 100
		if(movespeed < 0)movespeed = 0
		movespeed = Math.map(movespeed, 0, 100, 0, 1023)
        
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
	export function MoonCar_LR(left: number=0, right: number=0): void {
		if(left > 100)left = 100
		if(left < -100)left = -100
		if(right > 100)right = 100
		if(right < -100)right = -100
		if (left > 0) {
			left = Math.map(left, 0, 100, 0, 1023)
			pins.analogWritePin(AnalogPin.P2, left)
        	pins.analogWritePin(AnalogPin.P13, 0)	
		}
		else {
			left = left * -1
			left = Math.map(left, 0, 100, 0, 1023)
			pins.analogWritePin(AnalogPin.P2, 0)
        	pins.analogWritePin(AnalogPin.P13, left)
		}
		if (right > 0) {
			right = Math.map(right, 0, 100, 0, 1023)
			pins.analogWritePin(AnalogPin.P8, right)
			pins.analogWritePin(AnalogPin.P14, 0)	
		}
		else {
			right = right * -1
			right = Math.map(right, 0, 100, 0, 1023)
			pins.analogWritePin(AnalogPin.P8, 0)
        	pins.analogWritePin(AnalogPin.P14, right)
		}
	}

	//%block="Line Follower Sensor"
    export function Line_Follower_Sensor(): number {
		let position = 0
		let line_follow_Left_Pin = DigitalPin.P15
        let line_follow_Right_Pin = DigitalPin.P16

        if (pins.digitalReadPin(DigitalPin.P15) == 0) {
			if (pins.digitalReadPin(DigitalPin.P16) == 0) {
				position = 3
			}
			else {
				position = 2
			}
		}
		else {
			if (pins.digitalReadPin(DigitalPin.P16) == 0) {
				position = 1
			}
			else {
				position = 0
			}
		}
		return position
	}
	
	//%block="Ultrasonic Sensor"
    export function Ultrasonic_Sensor(): number {
		led.enable(false)

		let distance = 0
		pins.setPull(DigitalPin.P3, PinPullMode.PullNone);
		pins.digitalWritePin(DigitalPin.P3, 1);
		control.waitMicros(1000)
		pins.digitalWritePin(DigitalPin.P3, 0);
		distance = pins.pulseIn(DigitalPin.P9, PulseValue.High)
		
		led.enable(true)
		
		return distance = Math.round(distance / 2 / 29)
	}

	//%block="Push Bottom"
    export function Push_Bottom(): number {
		let pushvalue = pins.digitalReadPin(DigitalPin.P7)
		if (pushvalue == 1) {
			pushvalue = 0
		}
		else {
			pushvalue = 1
		}
		return pushvalue
	}
}


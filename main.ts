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

	//%block="MoonCar to |move %Direction| Speed %number"
	export function MoonCar_go(direction: Direction = 1, movespeed: number): void {
		if(movespeed>100)movespeed = 100
		if(movespeed<0)movespeed = 0
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
}

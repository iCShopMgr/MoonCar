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

	//% weight=16
    //% block="MoonCar to move %direction |speed %movespeed |(0~100)"
    export function MoonCarGo(direction: Direction = 1, movespeed: number): void {
        if (movespeed > 100) movespeed = 100
        if (movespeed < 0) movespeed = 0
        movespeed = Math.round(Math.map(movespeed, 0, 100, 0, 1023))

        switch (direction) {
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

	//% weight=16
    //% block="MoonCar wheel speed Left %left |Right %right |(-100~100)"
    export function MoonCarLR(left: number = 0, right: number = 0): void {
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
	//% weight=15
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

	//% weight=14
    //% block="Ultrasonic Sensor"
    export function UltrasonicSensor(): number {
        led.enable(false)
        let distance = 0
        pins.setPull(DigitalPin.P3, PinPullMode.PullNone);

        pins.digitalWritePin(DigitalPin.P3, 0);
        //control.waitMicros(2);
        control.waitMicros(5);
        pins.digitalWritePin(DigitalPin.P3, 1);
        control.waitMicros(10)
        pins.digitalWritePin(DigitalPin.P3, 0);

        distance = pins.pulseIn(DigitalPin.P9, PulseValue.High)
        return distance = Math.round(distance / 2 / 29)
    }
	
	//% weight=13
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
	
	/*
     * Color Senser
    */
	
	//% weight=12
    //% block="Color Sensor init"
    export function ColorSensorinit(): void {
        pins.i2cWriteNumber(41, 33276, NumberFormat.UInt16BE, false)
        pins.i2cWriteNumber(41, 32771, NumberFormat.UInt16BE, false)
    }

    export enum Switch {
        //% block="ON"
        Open = 1,
        //% block="OFF"
        Close = 2
    }
	
	//% weight=12
    //% block="Fill Light %switch_"
    export function Filllight(switch_: Switch = 1): void {
        if (switch_ == 1) {
            pins.setPull(DigitalPin.P11, PinPullMode.PullDown)
            pins.digitalWritePin(DigitalPin.P11, 0);
            basic.pause(10)
            let dropout = pins.digitalReadPin(DigitalPin.P11)
        }
        else {
            pins.setPull(DigitalPin.P11, PinPullMode.PullUp)
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

	//% weight=12
    //% block="Color Sensor read RGB %channel |channel"
    export function ColorSensorRead(channel: Channel = 1): number {
        pins.i2cWriteNumber(41, 178, NumberFormat.Int8LE, false)

        pins.i2cWriteNumber(41, 179, NumberFormat.Int8LE, false)

        pins.i2cWriteNumber(41, 182, NumberFormat.Int8LE, true)
        let TCS_RED = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
        pins.i2cWriteNumber(41, 184, NumberFormat.Int8LE, true)
        let TCS_GREEN = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
        pins.i2cWriteNumber(41, 186, NumberFormat.Int8LE, true)
        let TCS_BLUE = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)

        let RdCl = 0
        switch (channel) {
            case 1:
                RdCl = Math.round(Math.map(TCS_RED, 0, 65535, 0, 255))
                break;
            case 2:
                RdCl = Math.round(Math.map(TCS_GREEN, 0, 65535, 0, 255))
                break;
            case 3:
                RdCl = Math.round(Math.map(TCS_BLUE, 0, 65535, 0, 255))
                break;
        }

        return RdCl
    }
    
    let nowReadColor = [0, 0, 0]
	//% weight=12
    //% block="Color Sensor read color"
    export function ColorSensorReadColor(): void {
        pins.i2cWriteNumber(41, 178, NumberFormat.Int8LE, false)

        pins.i2cWriteNumber(41, 179, NumberFormat.Int8LE, false)

        pins.i2cWriteNumber(41, 182, NumberFormat.Int8LE, true)
        let TCS_RED = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
        pins.i2cWriteNumber(41, 184, NumberFormat.Int8LE, true)
        let TCS_GREEN = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
        pins.i2cWriteNumber(41, 186, NumberFormat.Int8LE, true)
        let TCS_BLUE = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
        TCS_RED = Math.round(Math.map(TCS_RED, 0, 65535, 0, 255))
        TCS_GREEN = Math.round(Math.map(TCS_GREEN, 0, 65535, 0, 255))
        TCS_BLUE = Math.round(Math.map(TCS_BLUE, 0, 65535, 0, 255))
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

	//% weight=12
    //% block="Color Sensor record %colorpart |color"
    export function ColorSensorRecord(colorpart: ColorPart = 1): void {
        pins.i2cWriteNumber(41, 178, NumberFormat.Int8LE, false)

        pins.i2cWriteNumber(41, 179, NumberFormat.Int8LE, false)

        pins.i2cWriteNumber(41, 182, NumberFormat.Int8LE, true)
        let TCS_RED = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
        pins.i2cWriteNumber(41, 184, NumberFormat.Int8LE, true)
        let TCS_GREEN = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
        pins.i2cWriteNumber(41, 186, NumberFormat.Int8LE, true)
        let TCS_BLUE = pins.i2cReadNumber(41, NumberFormat.UInt16BE, false)
        TCS_RED = Math.round(Math.map(TCS_RED, 0, 65535, 0, 255))
        TCS_GREEN = Math.round(Math.map(TCS_GREEN, 0, 65535, 0, 255))
        TCS_BLUE = Math.round(Math.map(TCS_BLUE, 0, 65535, 0, 255))
        switch (colorpart) {
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
    let forkrange = 10
	//% weight=12
    //% block="Read color equal %colorpart |color?"
    export function ReadColorEqual(colorpart: ColorPart = 1): boolean {
        switch (colorpart) {
            case 1:
                if ((Math.abs(ReadRedColor[0] - nowReadColor[0]) < forkrange) && (Math.abs(ReadRedColor[1] - nowReadColor[1]) < forkrange) && (Math.abs(ReadRedColor[2] - nowReadColor[2]) < forkrange)) {
                    colorright = true
                }
                else {
                    colorright = false
                }
                break;
            case 2:
                if ((Math.abs(ReadGreenColor[0] - nowReadColor[0]) < forkrange) && (Math.abs(ReadGreenColor[1] - nowReadColor[1]) < forkrange) && (Math.abs(ReadGreenColor[2] - nowReadColor[2]) < forkrange)) {
                    colorright = true
                }
                else {
                    colorright = false
                }
                break;
            case 3:
                if ((Math.abs(ReadBlueColor[0] - nowReadColor[0]) < forkrange) && (Math.abs(ReadBlueColor[1] - nowReadColor[1]) < forkrange) && (Math.abs(ReadBlueColor[2] - nowReadColor[2]) < forkrange)) {
                    colorright = true
                }
                else {
                    colorright = false
                }
                break;
            case 4:
                if ((Math.abs(ReadYellowColor[0] - nowReadColor[0]) < forkrange) && (Math.abs(ReadYellowColor[1] - nowReadColor[1]) < forkrange) && (Math.abs(ReadYellowColor[2] - nowReadColor[2]) < forkrange)) {
                    colorright = true
                }
                else {
                    colorright = false
                }
                break;
            case 5:
                if ((Math.abs(ReadAzureColor[0] - nowReadColor[0]) < forkrange) && (Math.abs(ReadAzureColor[1] - nowReadColor[1]) < forkrange) && (Math.abs(ReadAzureColor[2] - nowReadColor[2]) < forkrange)) {
                    colorright = true
                }
                else {
                    colorright = false
                }
                break;
            case 6:
                if ((Math.abs(ReadPurpleColor[0] - nowReadColor[0]) < forkrange) && (Math.abs(ReadPurpleColor[1] - nowReadColor[1]) < forkrange) && (Math.abs(ReadPurpleColor[2] - nowReadColor[2]) < forkrange)) {
                    colorright = true
                }
                else {
                    colorright = false
                }
                break;
            case 7:
                if ((Math.abs(ReadCustom1Color[0] - nowReadColor[0]) < forkrange) && (Math.abs(ReadCustom1Color[1] - nowReadColor[1]) < forkrange) && (Math.abs(ReadCustom1Color[2] - nowReadColor[2]) < forkrange)) {
                    colorright = true
                }
                else {
                    colorright = false
                }
                break;
            case 8:
                if ((Math.abs(ReadCustom2Color[0] - nowReadColor[0]) < forkrange) && (Math.abs(ReadCustom2Color[1] - nowReadColor[1]) < forkrange) && (Math.abs(ReadCustom2Color[2] - nowReadColor[2]) < forkrange)) {
                    colorright = true
                }
                else {
                    colorright = false
                }
                break;
            case 9:
                if ((Math.abs(ReadCustom3Color[0] - nowReadColor[0]) < forkrange) && (Math.abs(ReadCustom3Color[1] - nowReadColor[1]) < forkrange) && (Math.abs(ReadCustom3Color[2] - nowReadColor[2]) < forkrange)) {
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


    /*
     * IR Remote
    */
	//% weight=11
    //% block="Enable IR"
    export function EnIR(): void {
        pins.onPulsed(DigitalPin.P1, PulseValue.Low, function () {
            readir.push(pins.pulseDuration())
        })
        pins.onPulsed(DigitalPin.P1, PulseValue.High, function () {
            readir.push(pins.pulseDuration())
        })

        pins.setEvents(DigitalPin.P1, PinEventType.Pulse)
        pins.setPull(DigitalPin.P1, PinPullMode.PullUp)
    }

    let hexCode: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"]
    let readir: number[] = []
    readir = []
    let Pnumber = ""
    let readCode = 0
    let toHEX = ""
    let IRREAD: Action;
    let Reading = false
    
    control.inBackground(function () {
        while (true) {
            if (Reading == true) {
                if (readir[0] > 4000 && readir[0] < 5000) {
                    basic.pause(100)
                    let one_data = 0
					/*
                    for (let i = 0; i < readir.length; i++) {
                        serial.writeLine("" + readir[i])
                    }
					*/
                    Pnumber = ""
                    //count
                    readCode = 0
                    one_data = 2
                    for (let i = 0; i < 8; i++) {
                        if (readir[one_data] > 1000) {
                            readCode += (1 << (7 - i))
                        }
                        one_data += 2
                    }
                    toHEX = hexCode[readCode / 16] + hexCode[readCode % 16]
                    Pnumber += toHEX

                    readCode = 0
                    one_data = 18
                    for (let i = 0; i < 8; i++) {
                        if (readir[one_data] > 1000) {
                            readCode += (1 << (7 - i))
                        }
                        one_data += 2
                    }
                    toHEX = hexCode[readCode / 16] + hexCode[readCode % 16]
                    Pnumber += toHEX
                    if (Pnumber == "00ff") {
                        Pnumber = ""
                        readCode = 0
                        one_data = 34
                        for (let i = 0; i < 8; i++) {
                            if (readir[one_data] > 1000) {
                                readCode += (1 << (7 - i))
                            }
                            one_data += 2
                        }
                        toHEX = hexCode[readCode / 16] + hexCode[readCode % 16]
                        Pnumber += toHEX

                        readCode = 0
                        one_data = 50
                        for (let i = 0; i < 8; i++) {
                            if (readir[one_data] > 1000) {
                                readCode += (1 << (7 - i))
                            }
                            one_data += 2
                        }
                        toHEX = hexCode[readCode / 16] + hexCode[readCode % 16]
                        Pnumber += toHEX
                    }
                    else {
                        Pnumber = "could not be parsed"
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
	
    //% block="IR Remote(NEC)" blockInlineInputs=true
    //% weight=11 blockGap=10
    export function IRRemote(add: Action): void {
        IRREAD = add
        Reading = true
    }
	
	//% weight=11
    //% block="IR Read"
    export function IRRead(): string {
        return Pnumber
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
                IRoff(1640);
            } else {
                IRon(560);
                IRoff(560);
            }
        }
    }
    
	//% weight=11
    //% block="IR Send(NEC) %irnumber"
    export function IRcommand(irstring: string): void {
        let codeH = 0
        let codeL = 0
        for (let i = 0; i < hexCode.length; i++) {
            if (irstring[0] == hexCode[i]) {
                codeH = i
            }
            if (irstring[1] == hexCode[i]) {
                codeL = i
            }
        }
        let irnumber1 = codeL + codeH*16

        for (let i = 0; i < hexCode.length; i++) {
            if (irstring[2] == hexCode[i]) {
                codeH = i
            }
            if (irstring[3] == hexCode[i]) {
                codeL = i
            }
        }
        let irnumber2 = codeL + codeH * 16
        IRon(8500)
        IRoff(4500)
        send(0);
        send(255);
        send(irnumber1);
        send(irnumber2);
        IRon(550)
        IRoff(40720)
        IRon(10140)
        IRoff(2280)
        IRon(620)
    }
    
    /*
     * RGB LED
    */
    let _brightness = 25
    let neopixel_buf = pins.createBuffer(16 * 3);
    for (let i = 0; i < 16 * 3; i++) {
        neopixel_buf[i] = 0
    }
    for (let i = 0; i < 3; i++) {
        rgb_led_clear();
    }
	
	//% weight=10
    //% rgb.shadow="colorNumberPicker"
    //%  blockId="RGB_LED_show_all" block="All RGB LED show color|%rgb"
    export function rgb_led_show_all(rgb: number): void{
        let r = (rgb >> 16) * (_brightness / 255);
        let g = ((rgb >> 8) & 0xFF) * (_brightness / 255);
        let b = ((rgb) & 0xFF) * (_brightness / 255);
        for (let i = 0; i < 8; i++) {
            neopixel_buf[i * 3 + 0] = Math.round(g)
            neopixel_buf[i * 3 + 1] = Math.round(r)
            neopixel_buf[i * 3 + 2] = Math.round(b)
        }
        ws2812b.sendBuffer(neopixel_buf, DigitalPin.P12)
    }
	
	//% weight=10
    //% index.min=0 index.max=7
    //% rgb.shadow="colorNumberPicker"
    //%  blockId="RGB_LED_show" block="RGB LED number|%index show color|%rgb"
    export function rgb_led_show(index: number, rgb: number): void{
        let f = index;
        let t = index;
        let r = (rgb >> 16) * (_brightness / 255);
        let g = ((rgb >> 8) & 0xFF) * (_brightness / 255);
        let b = ((rgb) & 0xFF) * (_brightness / 255);

        if (index > 15) {
            if (((index >> 8) & 0xFF) == 0x02) {
                f = index >> 16;
                t = index & 0xff;
            } else {
                f = 0;
                t = -1;
            }
        }
        for (let i = f; i <= t; i++) {
            neopixel_buf[i * 3 + 0] = Math.round(g)
            neopixel_buf[i * 3 + 1] = Math.round(r)
            neopixel_buf[i * 3 + 2] = Math.round(b)
        }
        ws2812b.sendBuffer(neopixel_buf, DigitalPin.P12)
    }
	
	//% weight=10
    //% brightness.min=0 brightness.max=255
    //% blockId="RGB_LED_set_brightness" block="RGB LED set brightness to |%brightness |(0~255)"
    export function rgb_led_set_setBrightness(brightness: number) {
        _brightness = brightness;
    }
	
	//% weight=10
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% blockId="RGB_LED_set_RGB" block="Red|%r Green|%g Blue|%b"
    export function rgb_led_set_RGB(r: number, g: number, b: number): number {
        return (r << 16) + (g << 8) + (b);
    }
	
	//% weight=10
    //% blockId="RGB_LED_clear" block="RGB LED clear all"
    export function rgb_led_clear(): void {
        for (let i = 0; i < 16 * 3; i++) {
            neopixel_buf[i] = 0
        }
        ws2812b.sendBuffer(neopixel_buf, DigitalPin.P12)
    }
}

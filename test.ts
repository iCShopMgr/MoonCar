basic.forever(function () {
    if (mooncar.UltrasonicSensor() < 15) {
        mooncar.MoonCarGo(mooncar.Direction.direct3, 70)
    } else {
        mooncar.MoonCarGo(mooncar.Direction.direct1, 70)
    }
})

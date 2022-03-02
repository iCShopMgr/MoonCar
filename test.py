def on_forever():
    if mooncar.ultrasonic_sensor() < 15:
        mooncar.moon_car_go(mooncar.Direction.DIRECT3, 70)
    else:
        mooncar.moon_car_go(mooncar.Direction.DIRECT1, 70)
basic.forever(on_forever)

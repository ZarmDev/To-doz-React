export function changeHue(condition, elem) {
    let hue = Math.floor(Math.random() * 360);
    const rateOfChange = 5;
    elem.style.filter = `hue-rotate(${hue}deg)`;
    let state = 0
    var hueChange = setInterval(function () {
        if (condition == true) {
            clearInterval(hueChange)
        }
        if (state == 0) {
            hue += rateOfChange
            if (hue > 150) {
                state = 1
            }
        } else if (state == 1) {
            hue -= rateOfChange
            if (hue < -150) {
                state = 0
            }
        }
        elem.style.filter = `hue-rotate(${hue}deg)`;
    }, 100)
}
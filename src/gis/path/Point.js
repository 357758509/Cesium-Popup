
export default class Point{

    distance = 0

    length = 0

    angle = 0

    lon = 0

    lat = 0

    height = 0

    car3 = null

    mercator = null

    constructor(lonLat) {
        this.lon = lonLat.lon
        this.lat = lonLat.lat
        this.height = lonLat.height
    }

}
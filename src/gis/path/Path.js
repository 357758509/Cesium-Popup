import Point from "./Point";
import AMap from "../AMap";
import * as turf from '@turf/turf'

export default class Path{

    points = []

    distance = []

    targetPHR = []

    constructor(lonLats) {
        if(lonLats.length == 1){
            throw new Error("点数不可为1")
        }
        let prevLonLat = null
        let distance = 0;
        lonLats.forEach(lonLat=>{
            let point = new Point(lonLat);
            point.car3 = Cesium.Cartesian3.fromDegrees(lonLat.lon , lonLat.lat , lonLat.height || 0)

            if(!prevLonLat){
                point.length = 0
                point.angle = 0
            }else {
                point.length = AMap.measure(prevLonLat , point)
                distance += point.length
                point.distance = distance
            }
            this.points.push(point)
            prevLonLat = point
        })
        this.distance = distance
    }

    getPointObj(distance){
        while (distance > this.distance){
            distance = distance - this.distance
        }
        for (let i = 0; i < this.points.length; i++) {
            if(i == this.points.length - 1){
                return {
                    start : this.points[this.points.length - 2],
                    end : this.points[this.points.length - 1]
                }
            }
            let next = this.points[i + 1]
            if(next.distance > distance){
                return {
                    start : this.points[i],
                    end : this.points[i + 1]
                }
            }
        }
    }

    getXYZAndHPR(distance){
        while (distance > this.distance){
            distance = distance - this.distance
        }
        let pointOBJ = this.getPointObj(distance)
        let start = pointOBJ.start
        let end = pointOBJ.end
        let scale = (distance - start.distance) /  (end.distance - start.distance)
        let xyz = Cesium.Cartesian3.fromDegrees(start.lon +  scale * (end.lon - start.lon),start.lat + scale * (end.lat - start.lat) , end.height)
        // 只计算z的绕
        let pointStart = turf.point([start.lon , start.lat])
        let pointEnd = turf.point([end.lon , end.lat])
        let phr = new Cesium.HeadingPitchRoll()
        phr.heading =  Cesium.Math.toRadians(turf.bearing(pointStart, pointEnd));
        if(phr.heading < 0){
            phr.heading += Math.PI * 2
        }
        return {
            start : pointOBJ.start,
            end : pointOBJ.end,
            position : xyz,
            phr : phr
        }
    }

    destroy(){

    }

}
import AMap from "../gis/AMap";
import * as turf from "@turf/turf";
import Pop from "./Pop";
import PopUtils from "./PopUtils";

export default class ScreenPopManager{

    leftPopMap = {}

    rightPopMap = {}

    topPopMap = {}

    popMap = {}

    heading = 0

    /**
     * point
     * type
     * data
     * @type {{}}
     */
    data = {}

    viewer = null

    option = null

    lonLat = null

    distanceLimit = 300

    lastTime = null

    // 一秒执行一次
    interval = 1000

    onChange = null

    constructor(_viewer , _option) {
        this.viewer = _viewer
        this.option = _option || {}
        _viewer.scene.primitives.add(this)
    }

    setData(_data){
        for (const id in this.data) {
            if(!_data[id]){
                this.release(this.data[id])
            }
        }
        this.data = _data
    }

    update(frame){
        if(this.lastTime == null){
            this.lastTime = new Date().getTime()
            return
        }
        let currTime = new Date().getTime()
        if(currTime - this.lastTime < this.interval){
            return
        }
        if(!this.lonLat){
            return
        }
        this.lastTime = currTime
        this.popMap = {}
        this.leftPopMap = {}
        this.rightPopMap = {}
        // 确定几帧更新一次
        console.log("-------------------------------")
        let count = 0
        for (const id in this.data) {
            let popWrap = this.data[id]
            if(!popWrap.lonLat){
                console.log("无lonlat信息")
                continue
            }
            let distance = AMap.measure(this.lonLat , popWrap.lonLat)
            let visible = AMap.isPointVisible(this.viewer , popWrap.lonLat);
            if(!visible){
                count ++;
            }else {
                continue;
            }
            if(distance > this.distanceLimit){
                continue
            }
            // 计算角度
            let angle = AMap.calculateAngle(this.lonLat, popWrap.lonLat)
            let diffAngle = AMap.getDiffAngle(angle , this.heading)
            let pop = {
                angle :diffAngle,
                id : id,
                lonLat : popWrap.lonLat,
                distance : distance,
                data : popWrap.data
            }
            this.popMap[id] = pop
            if(diffAngle > 20){
                this.rightPopMap[id] = pop
            }else if(diffAngle < -20){
                this.leftPopMap[id] = pop
            }
        }
        console.log("共:" + count)
        this.onChange && this.onChange()
    }

    release(data){

    }

    destroy(){

    }

}

import {createApp , h} from "vue";
import AMap from "../gis/AMap";
import PopContainer from "../pop/PopContainer.vue"
import Pop from "./Pop";

export default class PopUtils{

    static buildPop(viewer , position , param , comParam){
        // const building = import("../pop/BuildingPop.vue")
        let containerDom = document.getElementById("mapContainer")
        let tmp = document.createElement("div")
        tmp.id = AMap.getUuid()
        tmp.setAttribute("class" , "pop_container")
        containerDom.appendChild(tmp)
        let com = createApp(PopContainer , {
            type : param.type || "car" ,
            param : comParam,
            id : tmp.id
        })
        com.mount(tmp)
        return new Popup({
            viewer: viewer,
            element: tmp,
            position : position,
            show: true,
            pixelOffset: param.pixelOffset || new Cesium.Cartesian2(0, 0),
            // translucencyByDistance: new Cesium.NearFarScalar(0, 1, 10000, 0.5),
            // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 11000),
        });
    }


    static buildMyPop(viewer , pixelPosition , param , comParam){
        // const building = import("../pop/BuildingPop.vue")
        let containerDom = document.getElementById("mapContainer")
        let tmp = document.createElement("div")
        tmp.id = AMap.getUuid()
        tmp.setAttribute("class" , "pop_container")
        containerDom.appendChild(tmp)
        let com = createApp(PopContainer , {
            type : param.type || "car" ,
            param : comParam
        })
        com.mount(tmp)
        return new Pop({
            id : tmp.id,
            pixelOffset: param.pixelOffset || new Cesium.Cartesian2(0, 0),
            pixelPosition: pixelPosition
        });
    }

}

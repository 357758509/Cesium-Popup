// import * as Cesium from "cesium";
import TWEEN from "tween.js"
import * as turf from '@turf/turf'
// import {HeadingPitchRange} from "cesium";

export default class AMap {

  static init(id , config){
    window.CESIUM_BASE_URL = "../../Build/Cesium";
    return new Promise(((resolve, reject) => {
      let _config = {
        timeline: false, // 禁止时间轴
        animation: false, // 禁止动画
        shouldAnimate: true,//设置自动播发动画
        baseLayerPicker: false, // 禁止图层选择器
        geocoder: false, // 查找框
        navigationHelpButton: false,
        // 功能文件夹下的离线底图，只有三级切片
        imageryProvider: new Cesium.TileMapServiceImageryProvider({
          url: '../../Build/Cesium/Assets/Textures/NaturalEarthII'
        }),
        vrButton: false,
        homeButton: false,
        sceneModePicker: false,
        selectionIndicator: false,
        infoBox: false,
        terrainShadows: Cesium.ShadowMode.ENABLED,
        fullscreenButton: false,
        ...config
      };
      let _viewer = new Cesium.Viewer(id, _config);
      _viewer.id = id
      _viewer._cesiumWidget._creditContainer.style.display = "none";
      _viewer.scene.postProcessStages.fxaa.enabled = true
      // 关闭地表大气层，默认是 true
      _viewer.scene.globe.showGroundAtmosphere = false;
      setTimeout(() => {
        resolve(_viewer)
      }, 100);
    }))
  }

  static addGDLayer(viewer){
    let layer = new Cesium.UrlTemplateImageryProvider({
      url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
      minimumLevel: 4,
      maximumLevel: 18
    })
    viewer.imageryLayers.addImageryProvider(layer);
  }

  static addARCGIS(viewer){
    viewer.imageryLayers.addImageryProvider(
        new Cesium.ArcGisMapServerImageryProvider({
          url: 'http://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer',
        })
    );
  }

  static addBingMaps(viewer){
    viewer.imageryLayers.addImageryProvider(
      new Cesium.BingMapsImageryProvider({
        key: URL_CONFIG.BING_MAP_KEY, //可至官网（https://www.bingmapsportal.com/）申请key
        url: URL_CONFIG.BINGMAP,
        mapStyle: Cesium.BingMapsStyle.AERIAL,
      })
    );
  }

  static initTween(viewer){
    viewer.scene.preUpdate.addEventListener(function (scene, time){
      TWEEN.update(time);
    });
  }

  static measure(start , end){
    let from = turf.point([start["lon"], start["lat"]]);
    let to = turf.point([end["lon"], end["lat"]]);
    return  turf.distance(from, to, {
      units:"meters"
    });
  }


  static calculateAngle(start , end){
    let from = turf.point([start["lon"], start["lat"]]);
    let to = turf.point([end["lon"], end["lat"]]);
    return  turf.bearing(from, to, {
      units:"meters"
    });
  }

  static getDiffAngle(angle1 , angle2){
    if(angle1 < 0){
      angle1 = angle1 + 360;
    }
    if(angle2 < 0){
      angle2 = angle2 + 360;
    }
    let result = angle1 - angle2
    if(Math.abs(result) > 180){
      if(result > 0){
        return result - 360
      }else {
        return result + 360
      }
    }
    return result
  }

  static isPointVisible(viewer , lonLat){
    let car2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene , Cesium.Cartesian3.fromDegrees(lonLat.lon , lonLat.lat , lonLat.height))
    if(!car2){
      return false
    }
    let dom = document.getElementById(viewer.id)
    let width = dom.offsetWidth
    let height = dom.offsetHeight
    if(car2.x < width && car2.x > 0 && car2.y < height && car2.y > 0){
      return true
    }else {
      return false
    }
  }


  static lookAt(viewer , car3 , other){
    if(!other){
      other = {
        x : 0,
        y : -50,
        z : 50
      }
    }
    if(other instanceof Cesium.HeadingPitchRoll){
      let hpr = new Cesium.HeadingPitchRange()
      hpr.heading = other.heading
      hpr.pitch = other.pitch
      hpr.range = 300
    }
    viewer.camera.lookAt(car3, other)
  }


  static setView(viewer , car3 , other){
    if(!other){
      other = {
        x : 0,
        y : -50,
        z : 50
      }
    }
    let option = {
      destination: car3
    }
    viewer.camera.setView(option)
  }

  static setCamera(viewer , car3 , phr){
    viewer.camera.setView({
      destination: car3,
      orientation: phr || {
        heading:Cesium.Math.toRadians(0.0), //正北
        pitch:Cesium.Math.toDegrees(0.0), //平视
        roll: 0.0
      }
    });
  }

  static car3ToDegree(viewer , car3){
    let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(car3);
    return {
      lon : Cesium.Math.toDegrees(cartographic.longitude),
      lat : Cesium.Math.toDegrees(cartographic.latitude),
      height : cartographic.height
    }
  }

  static xyToDegree(xy){
   let pt = turf.point([xy.x, xy.y]);
   let converted = turf.toWgs84(pt);
   return {
     lon : converted.coordinates[0],
     lat : converted.coordinates[1]
   }
  }

  static getUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }


}

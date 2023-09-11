<script setup>
// import * as Cesium from 'cesium';
import {getCurrentInstance, onMounted, ref} from "vue";
import AMap from "./gis/AMap";
import ModelManager from "./gis/ModelManager";
import Point from "./gis/path/Point";
import axios from "axios";
import {Convert} from "./gis/Convert";
import BuildBuilding from "./gis/theme/BuildBuilding";
import * as turf from '@turf/turf'
import PopUtils from "./pop/PopUtils";
import ScreenPopManager from "./pop/ScreenPopManager";
import AddSymbols from "./gis/AddSymbols";

window.Cesium = Cesium;

const { proxy } = getCurrentInstance(); // 使用proxy代替ctx，因为ctx只在开发环境有效

// 车辆路径
let oriPoints1 = [[116.45604714922383, 39.9120526770304], [116.45748547673374, 39.91205179105195], [116.45899766217047, 39.91209079270708], [116.45951013593948, 39.91206344221192], [116.4596414208619, 39.912376363246075], [116.45958899826836, 39.91292060857534], [116.45953759732619, 39.91361953112914], [116.45949103444723, 39.91412165590477], [116.45945086748321, 39.91424006135494], [116.45930248875688, 39.91450154540027], [116.45923381023046, 39.914732570806954], [116.45922592481563, 39.9149461912523], [116.45925725038977, 39.91508215731933], [116.45913813555434, 39.915099363606025], [116.4589041079278, 39.91509632880709], [116.45592867147842, 39.91513661028139], [116.45550258065947, 39.91492854894899], [116.45529697737625, 39.91464228720629], [116.45537066390033, 39.91236858119759], [116.45566172436263, 39.912180109061964], [116.45604714922383, 39.9120526770304]]
let oriPoints2 = [[116.46340626004476,39.91218130146159],[116.46338238596267,39.91537671821448],[116.45972830840465,39.91642665734589],[116.4591698150186,39.91508390423395],[116.4594137392902,39.91421608442796],[116.45959254487445,39.912137255394036],[116.46344147290897,39.91222805891959]]
let modelManager
let viewer;

let buildingPrimitive = null

let pathBuffered = null

let labelCollection = new Cesium.LabelCollection()

let currType = ref("free")

let speed = ref(30)

//用于演示的demo
let model = null


let leftPops = ref([])
let rightPops = ref([])

let setSpeed = () => {
  model.setSpeed(speed.value)
}

let changeStatus = () => {
  if (currType.value === "free") {
    viewer.scene.camera.setView({
      destination: new Cesium.Cartesian3.fromDegrees(116.4566, 39.9149, 5323.445971240632),
      orientation: {
        heading: 3.1612,
        pitch: -1.5188,
        roll: 6.283185307179563
      }
    });
  }

}


let all = {}
let screenAll = {}
let loadLabel = (center, distanceLimit) => {
  let queryObj = {
    "getFeatureMode": "BUFFER",
    "datasetNames": ["二维数据:Building"],
    "geometry": {
      "id": 0,
      "style": null,
      "parts": [1],
      "points": [{"y": center.lat, "x": center.lon}],
      "type": "POINT"
    },
    "bufferDistance": distanceLimit / 100000
  };
  let dataUrl = "http://www.supermapol.com/realspace/services/data-cbd/rest/data/featureResults.rjson?returnContent=true";
  axios.post(dataUrl, queryObj).then(dt => {
    let features = dt.data.features
    if (!features || features.length == 0) {
      return
    }
    // all.forEach(item=>{
    //   item.destroy()
    // })
    // all = []
    let tmp = {}
    features.forEach(feature => {
      let val = feature.fieldValues
      let id = val[0]
      if (all[id]) {
        tmp[id] = all[id]
        return
      }
      let lon = val[12]
      let lat = val[13]
      let alt = val[14]
      let pop = PopUtils.buildPop(
          viewer,
          Cesium.Cartesian3.fromDegrees(lon, lat, alt),
          {
            pixelOffset: new Cesium.Cartesian2(-10, -140),
            type: "building"
          }, {
            name: "id:" + id
          })
      tmp[id] = (pop)
      let screenItem = {}
      screenItem.lonLat = {
        lon,
        lat,
        height: alt
      }
      screenItem.data = feature
      screenAll[id] = screenItem
    })
    screenManager.setData(screenAll)
    for (const id in all) {
      if (!tmp[id]) {
        all[id].destroy()
      }
    }
    all = tmp

  })
}

let loadLabel2 = () => {
  if (!pathBuffered) {
    let lineString = turf.lineString(oriPoints1);
    pathBuffered = turf.buffer(lineString, 200, {units: 'miles'});
  }
  let instances = buildingPrimitive.geometryInstances.filter(instance => {
    if (!instance.id) {
      return false
    }
    let to = turf.point([instance.id.center["lon"], instance.id.center["lat"]]);
    return turf.booleanContains(pathBuffered, to)
  })
  labelCollection.removeAll()
  instances.forEach(instance => {
    labelCollection.add({
      position: Cesium.Cartesian3.fromDegrees(instance.id.center.lon, instance.id.center.lat, instance.id.prop.floor * 10 + 10),
      text: 'Hello World',
      font: '24px Helvetica',
    })
  })
}


let arr2LonLat = (coords, height = 0) => {
  let points = []
  coords.forEach(coord => {
    points.push(new Point({
      lon: coord[0],
      lat: coord[1],
      height: height
    }))
  })

  return points
}

let screenManager = null

onMounted(() => {
  (async () => {
    viewer = await AMap.init('map')

    // 初始化添加小品
    AddSymbols.init(viewer);

    screenManager = new ScreenPopManager(viewer, {})
    // add by zhangwei 2022.12.11
    let scene = viewer.scene
    scene.lightSource.ambientLightColor = new Cesium.Color(0.65, 0.65, 0.65, 1);
    let promise = scene.open(URL_CONFIG.SCENE_CBD);
    Cesium.when(promise, function (layer) {
      //设置相机位置、视角，便于观察场景
      scene.camera.setView({
        destination: new Cesium.Cartesian3.fromDegrees(116.4566, 39.9149, 5323.445971240632),
        orientation: {
          heading: 3.1612,
          pitch: -1.5188,
          roll: 6.283185307179563
        }
      });

      // 执行添加小品
      AddSymbols.addSymbols(viewer, scene);
    })

    // 加载平面地图底图图层
    AMap.addGDLayer(viewer)
    // 加载BingMaps地图底图图层
    // AMap.addBingMaps(viewer)
    // 加载arcgis地图底图图层
    // AMap.addARCGIS(viewer)
    // viewer.camera.flyTo({
    //   // destination: Cesium.Cartesian3.fromDegrees(116.395946,39.993427,2000),
    //   destination: Cesium.Cartesian3.fromDegrees(118.7776637,31.9790254,2000),
    //   duration: 3
    // });

    // 添加模型
    modelManager = new ModelManager(viewer)
    // 初始化第一条车辆
    let oriModel = Cesium.Model.fromGltf({
      url: '/model/MilkTruck.glb',
      scale:1,
      minimumPixelSize:32
    })
    model = ModelManager.buildModel(oriModel, viewer)
    modelManager.addModel(model, {
      position: Cesium.Cartesian3.fromDegrees(110, 30, 0)
    })
    model.onUpdate = function (position, phr, gradulaPHR) {
      // 处理弹窗
      if (!model.pop) {
        model.pop = PopUtils.buildPop(
            viewer,
            position,
            {
              pixelOffset: new Cesium.Cartesian2(-10, -140)
            },
            null)
      }
      model.pop.setPosition(position)
      if (currType.value == 'free') {
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        return
      }
      screenManager.lonLat = AMap.car3ToDegree(viewer, position)
      screenManager.heading = Cesium.Math.toDegrees(gradulaPHR.heading)
      // 设置动态窗口
      let leftTmpArr = []
      let rightTmpArr = []
      for (const id in screenManager.leftPopMap) {
        leftTmpArr.push(screenManager.leftPopMap[id])
      }
      for (const id in screenManager.rightPopMap) {
        rightTmpArr.push(screenManager.rightPopMap[id])
      }
      leftTmpArr.sort((a, b) => {
        return a.distance - b.distance
      })
      rightTmpArr.sort((a, b) => {
        return a.distance - b.distance
      })
      if (leftTmpArr.length > 5) {
        leftTmpArr.length = 5
      }
      if (rightTmpArr.length > 5) {
        rightTmpArr.length = 5
      }
      leftPops.value = leftTmpArr
      rightPops.value = rightTmpArr

      if (currType.value == 'three') {
        let hpRange = new Cesium.HeadingPitchRange()
        hpRange.heading = gradulaPHR.heading
        hpRange.pitch = Cesium.Math.toRadians(Cesium.Math.toDegrees(gradulaPHR.pitch) - 25)
        hpRange.range = 1500
        AMap.lookAt(viewer, position, hpRange)
      }
      if (currType.value == 'one') {
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        let lonLat = AMap.car3ToDegree(viewer, position)
        let positionClone = Cesium.Cartesian3.fromDegrees(lonLat.lon, lonLat.lat, lonLat.height + 5)
        AMap.setCamera(viewer, positionClone, gradulaPHR)
      }
    }
    model.onPointChanged = function (point) {
      loadLabel({
        lon: point.lon,
        lat: point.lat
      }, 200)
    }

    let oriManModel = Cesium.Model.fromGltf({
      url: '/SampleData/gltf/man/walk.gltf',
      scale:1,
      minimumPixelSize:32
    })
    let manModel = ModelManager.buildModel(oriManModel, viewer)
    modelManager.addModel(manModel, {
      position: Cesium.Cartesian3.fromDegrees(110, 30, 0)
    })
    manModel.start(arr2LonLat(oriPoints2, 5))
    viewer.scene.primitives.add(labelCollection)
    setTimeout(() => {
      let promise = viewer.scene.open("http://www.supermapol.com/realspace/services/3D-CBD/rest/realspace");
      Cesium.when.all(promise, function (layers) {
        let buildingLayer = viewer.scene.layers.find("Building@CBD");
      })
      // 启动
      model.start(arr2LonLat(oriPoints1, 5))
      setSpeed(speed.value)
    }, 1000)

    // 执行添加小品后扩展
    AddSymbols.afterExtend();

    let handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    let lonLats = []
    handler.setInputAction(function(event){

      let _clickP = event.position || event.endPosition;
      // 获取椭球坐标的方法
      let _position = viewer.scene.camera.pickEllipsoid(_clickP, viewer.scene.globe.ellipsoid);
      let lonLat = AMap.car3ToDegree(viewer , _position)
      lonLats.push([lonLat.lon , lonLat.lat])
      console.log(lonLats)
    },Cesium.ScreenSpaceEventType.LEFT_CLICK);

  })()
});

</script>

<template>
  <div id="main">
    <div id="menu" class="param-container tool-bar">
      <div>
        <label>跟随模式</label>
        <select id="viewselect" v-model="currType" @change="changeStatus">
          <option value="one">第一人称</option>
          <option value="three">第三人称</option>
          <option value="free">自由</option>
        </select>
      </div>
      <div>
        <label>速度</label>
        <input id="speedinput" v-model="speed" type="number" @change="setSpeed">
      </div>
    </div>
    <div id="mapContainer">
      <div class="map-screen-pop-left-container" v-show="currType!='free'">
        <div v-for="(val , key , index) in leftPops">
          <div style="width: 200px;height:160px;">
            <bv-border-box name="border12">
              <div class="border-content">
                <div class="building-pop" style="margin: auto">
                  <div>
                    名称 ： {{ val.id }}
                  </div>
                  <div>
                    距离 ： {{ val.distance.toFixed(2) }}
                  </div>
                  <div>
                    夹角 ： {{ val.angle.toFixed(2) }}
                  </div>
                </div>
              </div>
            </bv-border-box>
          </div>
        </div>

      </div>
      <div class="map-screen-pop-right-container" v-show="currType!='free'">
        <div v-for="(val , key , index) in rightPops">
          <div style="width: 200px;height:160px;">
            <bv-border-box name="border12">
              <div class="border-content">
                <div class="building-pop" style="margin: auto">
                  <div>
                    名称 ： {{ val.id }}
                  </div>
                  <div>
                    距离 ： {{ val.distance.toFixed(2) }}
                  </div>
                  <div>
                    夹角 ： {{ val.angle.toFixed(2) }}
                  </div>
                </div>
              </div>
            </bv-border-box>
          </div>
        </div>

      </div>
      <div id="map">
      </div>
    </div>
    <div id='loadingbar' class="spinner">
      <div class="spinner-container container1">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
          <div class="circle4"></div>
      </div>
      <div class="spinner-container container2">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
          <div class="circle4"></div>
      </div>
      <div class="spinner-container container3">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
          <div class="circle4"></div>
      </div>
  </div>
  <div id="nav-bar-div">
      <ul id="nav-bar">
          <li class="level-one" id="flatten"><i class="fa fa-eraser"></i>
              <ul class="level-two">
                  <li>压平
                  </li>
              </ul>
          </li>
          <li class="level-one" id="styleSetting"><i class="fa fa-cubes"></i>
              <ul class="level-two">
                  <li>添加模型
                  </li>
              </ul>
          </li>
      </ul>
  </div>
  <div id="wrapper" style="display:none">
      <div id="login" class="animate form">
          <span class="close" aria-hidden="true">×</span>
          <form>
              <h1 class="title">模型库</h1>
              <p id="icons">
              </p>
              <h1>模型属性编辑</h1>
              <p>
              <div>
                  <label>绕X轴旋转</label><input id="pitch" type="range" min="0" max="360" step="1.0" title="pitch"
                                            data-bind="value: pitch, valueUpdate: 'input'">
              </div>
              <div>
                  <label>绕Y轴旋转</label><input id="roll" type="range" min="0" max="360" step="1.0" title="roll"
                                            data-bind="value: roll, valueUpdate: 'input'">
              </div>
              <div>
                  <label>绕Z轴旋转</label><input id="heading" type="range" min="0" max="360" step="1.0" title="heading"
                                            data-bind="value: heading, valueUpdate: 'input'">
              </div>
              </p>
              <p>
              <div>
                  <label>缩放</label><input type="range" id="scale" min="1" max="10" step="0.1" value="1" title="模型缩放比例"
                                          data-bind="value: scale, valueUpdate: 'input'">
              </div>
              </p>
              <p>
              <div>
                  <label>颜色</label><input class="colorPicker" size="8" data-bind="value: material,valueUpdate: 'input'"
                                          id="colorPicker">
              </div>
              </p>
              <p>
                  <label>移动</label>
              </p>
              <p>
              <div>

                  <div class="positionAdjust">
                      <label>X:</label><input type="text" readonly id="positionX" value="0">
                      <span id="XPlus" style="position: relative; top: -3px; height: 40%; right: 16px; width:8px;"
                            class="fa fa-caret-up"></span>
                      <span id="XMinus" style=" position: relative;top: 5px; height: 40%; right: 28px; width:8px"
                            class="fa fa-caret-down"></span>
                  </div>
                  <div class="positionAdjust">
                      <label>Y:</label><input type="text" readonly id="positionY" value="0">
                      <span id="YPlus" style="position: relative; top: -3px; height: 40%; right: 16px; width:8px"
                            class="fa fa-caret-up"></span>
                      <span id="YMinus" style=" position: relative;top: 5px; height: 40%; right: 28px; width:8px"
                            class="fa fa-caret-down"></span>
                  </div>
                  <div class="positionAdjust">
                      <label>Z:</label><input type="text" readonly id="positionZ" value="0">
                      <span id="ZPlus" style="position: relative; top: -3px; height: 40%; right: 16px; width:8px"
                            class="fa fa-caret-up"></span>
                      <span id="ZMinus" style=" position: relative;top: 5px; height: 40%; right: 28px; width:8px"
                            class="fa fa-caret-down"></span>
                  </div>
                  <label id="delete" style="right:10px;position:relative;top:0;">删除</label>
              </div>
              </p>
          </form>
      </div>
  </div>
  </div>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#main {
  width: 100%;
  height: 100%;
  position: relative;
}

#mapContainer, #map {
  width: 100%;
  height: 100%;
}

#menu {
  background-color: rgba(42, 42, 42, 1);
  opacity: 0.9;
  border-radius: 4px;
  padding: 11px;
  font-family: Microsoft YaHei;
  box-sizing: border-box;
}

#viewselect {
  width: 61%;
}

#speedinput {
  width: 61%;
}

/* add by zhangwei 20221211 */
input[type=checkbox] {
  margin: 0px 4px 0 0px;
}

label {
  display: inline-block;
}

.param-container {
  border: none;
}

.titleBox {
  margin-bottom: 0px;
}

.sm-div-graphic {
  position: absolute;
  color: #fff;
  font-size: 14px;
}

#test .divpoint {
  background: url(./images/qipao1.png) no-repeat;
  background-size: cover;
  width: 128px;
  height: 216px;
}

#test3 .divpoint {
  background: url(./images/qipao2.png) no-repeat;
  background-size: cover;
  width: 230px;
  height: 150px;
}

#test .label-wrap {
  display: flex;
  justify-content: center;
  align-content: center;
  height: 50px;
}

#test3 .label-wrap {
  padding-left: 100px;
  padding-top: 8px;
  box-sizing: border-box;
}

#test .pop-title {
  color: #fff;
  margin-top: 11px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  font-size: 18px;
}


#test .data-li {
  font-size: 14px;
  margin-top: 15px;
  margin-bottom: 5px;
}

#test3 .data-li {
  font-size: 14px;
  margin-top: 6px;
}

#test2 .divpoint {
  background: url(./images/qipao3.png) no-repeat;
  background-size: cover;
  width: 116px;
  height: 120px;
}

#test2 .label-wrap {
  box-sizing: border-box;
  padding-top: 10px;
  padding-left: 51px;
}

.pop_container {
  position: absolute;
}

.map-screen-pop-left-container {
  width: 200px;
  /*height: 800px;*/
  top: 100px;
  left: 20px;
  position: absolute;
  z-index: 9999;
  background-color: rgba(46, 96, 153, 0.3);
}

.map-screen-pop-right-container {
  width: 200px;
  /*height: 800px;*/
  top: 100px;
  right: 20px;
  position: absolute;
  z-index: 9999;
  background-color: rgba(46, 96, 153, 0.3);
}

.border-content {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: justify;
  width: 100%;
  height: 100%;
}


.building-pop{
  width: 90%;
  height: 90%;
  margin: auto;
  font-size: 16px;
  line-height: 24px;
  color: white;
  text-align: left;
}


input[type=range] {
    width: 170px;
}

input[type=text] {
    width: 80px;
    padding: 1px;
    height: 18px;
    margin: 2.5px;
}

label {
    display: inline-block;
    margin: 5px;
    font-weight: bold;
    color: #ffffff;
}

.drawCur {
    cursor: url(./images/cur/draw.cur), auto;
}

.positionAdjust {
    width: 150px;
    margin: 0;
    margin-left: 55px;
    display: inline-block;
    top: -45px;
    position: relative;
}

#nav-bar {
  top: 100px;
}
</style>

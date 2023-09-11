// import * as Cesium from "cesium";
import * as turf from "@turf/turf";
import Car3Feature from "./core/model/Car3Feature";

export class Convert{
  static geojson2Car3s(geojson , height  , canculateCenter){

    if(geojson instanceof Array){
      let array = []
      geojson.forEach(fea=>{
        let car3Feas = Convert.geojson2Car3s(fea , height , canculateCenter)
        array = array.concat(car3Feas)
      })
      return array
    }

    if(!geojson || !geojson.type){
      console.log("非法geojson")
      return
    }

    let type = geojson.type.toLowerCase()
    if(type === 'featurecollection'){
      let array = []
      geojson.features.forEach(fea=>{
        let car3Feas = Convert.geojson2Car3s(fea , height, canculateCenter)
        array = array.concat(car3Feas)
      })
      return array;
    }

    if(type === 'feature'){
      let prop = geojson.properties
      let geos = Convert.geojson2Car3s(geojson.geometry , height, canculateCenter)
      let result = []
      if(geos == null){
        return result
      }
      geos.forEach(geo=>{
        if(geo != null){
          geo.prop = prop
          geo.type = geojson.geometry.type
          result.push(geo)
        }
      })
      return result
    }

    if(type === 'polygon'){
      let car3sArray = []
      try {
        geojson = turf.cleanCoords(geojson)
      }catch (ex){
        console.log("非法图形")
        return null
      }
      // todo 暂时只支持单元素
      geojson.coordinates.forEach(coords=>{
        coords.forEach(coord=>{
          let car3s = []
          coord.forEach(bl=>{
            if(bl[0] == 180){
              bl[0] = 179.99
            }
            if(bl.length == 3){
              car3s.push(Cesium.Cartesian3.fromDegrees(bl[0] , bl[1] , bl[2]));
            } else if(height){
              car3s.push(Cesium.Cartesian3.fromDegrees(bl[0] , bl[1] , height));
            } else {
              car3s.push(Cesium.Cartesian3.fromDegrees(bl[0] , bl[1]));
            }
          })
          car3sArray.push(car3s)
        })
      })
      return car3sArray
    }

    if(type === 'multipolygon'){
      let feaArray = []
      try {
        // geojson = turf.cleanCoords(geojson)
      }catch (ex){
        console.log("非法图形")
        return null
      }
      let contain180 = false
      geojson.coordinates.forEach(rings=>{
        rings.forEach(ring=>{
          let car3s = []
          ring.forEach(coord=>{
            if(coord[0] == 180){
              coord[0] = 179.99
              contain180 = true
            }
            if(coord[0] == -180){
              coord[0] = -179.99
              contain180 = true
            }
            if(coord.length == 3){
              car3s.push(Cesium.Cartesian3.fromDegrees(coord[0] , coord[1] , coord[2]));
            } else if(height){
              car3s.push(Cesium.Cartesian3.fromDegrees(coord[0] , coord[1] , height));
            }  else {
              car3s.push(Cesium.Cartesian3.fromDegrees(coord[0] , coord[1]));
            }
          })

          // 计算bbox
          let fea = new Car3Feature(car3s)
          if(canculateCenter){
            let tPolygon = turf.polygon([ring])
            let center = turf.center(tPolygon);
            fea.center = {
              lon : center.geometry.coordinates[0],
              lat : center.geometry.coordinates[1],
            }
          }
          feaArray.push(fea)
        })
      })
      return feaArray
    }

    if(type === 'multilinestring'){
      let feaArray = []
      try {
        // geojson = turf.cleanCoords(geojson)
      }catch (ex){
        console.log("非法图形")
        return null
      }
      let contain180 = false
      geojson.coordinates.forEach(line=>{
        let car3s = []
        line.forEach(coord=>{
          if(coord[0] == 180){
            coord[0] = 179.99
            contain180 = true
          }
          if(coord[0] == -180){
            coord[0] = -179.99
            contain180 = true
          }
          if(coord.length == 3){
            car3s.push(Cesium.Cartesian3.fromDegrees(coord[0] , coord[1] , coord[2]));
          } else if(height){
            car3s.push(Cesium.Cartesian3.fromDegrees(coord[0] , coord[1] , height));
          }  else {
            car3s.push(Cesium.Cartesian3.fromDegrees(coord[0] , coord[1]));
          }
        })
        // 计算bbox
        let fea = new Car3Feature(car3s)
        feaArray.push(fea)
      })
      return feaArray
    }

  }
}

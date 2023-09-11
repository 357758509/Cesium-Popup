import * as Cesium from "cesium";
import AMap from "../AMap";

export default class BuildBuilding{

    static buildBuildings(option){
        let car3Features = option.car3Features
        let instances = [];
        car3Features.forEach(feature=>{
            if(!feature.type || (feature.type.toLowerCase() != 'polygon' && feature.type.toLowerCase() != 'multipolygon' )){
                return
            }
            let height = feature.prop.floor * 10;
            // 创建topGeo
            let topGeo = new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(
                    JSON.parse(JSON.stringify(feature.car3s))
                ),
                height : height
            });
            let wallGeo = new Cesium.WallGeometry({
                positions :JSON.parse(JSON.stringify(feature.car3s)),
                maximumHeights: new Array(feature.car3s.length).fill(height),
                minimunHeights: new Array(feature.car3s.length).fill(0),
                vertexFormat : Cesium.VertexFormat.ALL
            })
            wallGeo =  Cesium.WallGeometry.createGeometry(wallGeo)
            wallGeo =  Cesium.GeometryPipeline.computeNormal(wallGeo)

            // instances.push(new Cesium.GeometryInstance({
            //     id: {
            //         prop : feature.prop,
            //         id : AMap.getUuid(),
            //         center : feature.center
            //     },
            //     geometry : topGeo
            // }))
            instances.push(new Cesium.GeometryInstance({
                geometry : wallGeo
            }))
        })
        let primitive = new Cesium.Primitive({
            releaseGeometryInstances: false,
            geometryInstances: instances,
            appearance: new Cesium.MaterialAppearance({
                material : new Cesium.Material({
                    translucent : false,
                    fabric : {
                        source : `
                        czm_material czm_getMaterial(czm_materialInput materialInput){
                            czm_material material = czm_getDefaultMaterial(materialInput);
                            material.diffuse = czm_inverseNormal * material.normal;
                            return material;
                        }
                    `
                    }
                })
            }),
            asynchronous : false
        });
        return primitive
    }

}
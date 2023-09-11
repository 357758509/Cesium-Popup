import {HeadingPitchRoll} from "cesium";

export class ModelEx {

    param = null

    phr = new Cesium.HeadingPitchRoll()

    scale = new Cesium.Cartesian3()

    positionMatrix = null

    oriModel = null

    constructor(url , param) {
        this.oriModel = Cesium.Model.fromGltf({
            url : url,
            scale: 1,
            minimumPixelSize: 32
        });
        this.oriModel.ex = this
        this.param = param
        if(param.position){
            this.positionMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(param.position, Cesium.Ellipsoid.WGS84, new Cesium.Matrix4());
        }
        if(param.phr){
            this.updateRotation(param.phr)
        }
        if(param.scale){
            this.updateScale(new Cesium.Cartesian3(param.scale,param.scale,param.scale))
        }
        this.updateMatrix()
        // 执行extend
        this.oriModel.updateRotation = function (phr){
            this.ex.updateRotation(phr)
        }
        this.oriModel.updatePosition = function (position){
            this.ex.updatePosition(position)
        }
        this.oriModel.updateScale = function (scale){
            this.ex.updateScale(scale)
        }
        this.oriModel.updateColor = function (color){
            this.ex.updateColor(color)
        }
    }

    updatePosition(positionMatrix){
        this.positionMatrix = positionMatrix;
        this.updateMatrix()
    }

    updateRotation(phr){
        this.phr = phr
        this.updateMatrix()
    }

    updateScale(scale){
        this.oriModel.scale = scale.x
    }

    updateColor(color){
        this.oriModel.color =  color
    }

    updateMatrix(){
        let rotation = Cesium.Matrix3.fromHeadingPitchRoll(this.phr);
        let result = Cesium.Matrix4.multiplyByMatrix3(this.positionMatrix, rotation , new Cesium.Matrix4());
        this.oriModel.modelMatrix = result
    }

    update(frame){
        this.oriModel.update(frame)
    }

}


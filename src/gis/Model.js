import Path from "./path/Path";
// import * as Cesium from "cesium";
import AMap from "./AMap";

export default class Model {

    scale = 1

    phr = new Cesium.HeadingPitchRoll()

    gradualPHR = new Cesium.HeadingPitchRoll()

    targetPHR = new Cesium.HeadingPitchRoll()

    position =  new Cesium.Cartesian3()

    modelMatrix = null

    isChanged = false

    oriModel = null

    path = null

    currPoint = null

    linePrimitive = null

    prevTime = null

    prevDistance = 0

    tween = null

    speed = 0

    onUpdate = null

    onPointChanged = null

    offset = null

    onFinished = null

    mercator = null

    /**
     * 暂停 0
     *  激活 1
     * @type {number}
     */
    status = 0


    constructor(_model) {
        this.oriModel= _model
        Cesium.when(_model.readyPromise).then(function (mode){
            mode.activeAnimations.addAll({
                loop: Cesium.ModelAnimationLoop.REPEAT,
                speedup: 1,
                reverse: false
            })
        })
    }

    /**
     * 外部驱动
     * @param param
     */
    updateParam(param){
        if(param.phr){
            // mix
            this.phr = param.phr
        }

        if(param.position){
            //
            this.position = param.position
        }

        this.isChanged = true
    }

    update(frame){
        // 开启了path模式
        if(this.path){
            this.prevTime = this.prevTime || new Date().getTime()
            let currTime = new Date().getTime()
            let diffTime = currTime - this.prevTime
            this.prevDistance = (diffTime / 1000) * this.speed + this.prevDistance

            let result = this.path.getXYZAndHPR(this.prevDistance)
            if(this.currPoint != result.start){
                this.currPoint = result.start
                this.onPointChanged && this.onPointChanged(this.currPoint)
            }
            this.prevTime = currTime
            this.position = result.position
            this.targetPHR = result.phr
            if(this.phr == null){
                this.phr = new Cesium.HeadingPitchRoll()
            }
            this.phr.heading = this.targetPHR.heading
            if(this.gradualPHR.heading != this.targetPHR.heading){
                // 旋转，暂时只考虑heading,每秒360度
                if(this.gradualPHR.heading < 0){
                    this.gradualPHR.heading = this.gradualPHR.heading + Math.PI * 2
                }
                let diffAll = this.targetPHR.heading - this.gradualPHR.heading
                if(Math.abs(diffAll) > Math.PI){
                    if(diffAll > 0){
                        diffAll = 0 - (Math.PI * 2 - diffAll)
                    }else {
                        diffAll = Math.PI * 2 + diffAll
                    }
                }
                if(diffAll > Math.PI){
                    console.log("异常")
                }
                let absRadiusDiff = Math.abs(diffAll)
                // 1 s 转一圈
                let rotationSpeed;
                if(absRadiusDiff > Cesium.Math.toRadians(90)){
                    rotationSpeed = 500
                }else if((absRadiusDiff > Cesium.Math.toRadians(45))){
                    rotationSpeed = 700
                }else if((absRadiusDiff > Cesium.Math.toRadians(20))){
                    rotationSpeed = 1000
                }else {
                    rotationSpeed = 30000
                }
                let nextDiff = (diffTime / rotationSpeed) * Math.PI * 2
                if(nextDiff >= Math.abs(diffAll)){
                    nextDiff = Math.abs(diffAll)
                }
                if(diffAll > 0){
                    this.gradualPHR.heading = this.gradualPHR.heading + nextDiff
                }else {
                    this.gradualPHR.heading =  this.gradualPHR.heading - nextDiff
                }
            }
            //
            this.isChanged = true
            this.linePrimitive.update(frame)
        }
        if(this.isChanged){
            this.reBuildModelMatrix()
        }
        if(this.onUpdate){
            this.onUpdate(this.position , this.phr , this.gradualPHR)
        }
        this.oriModel.update(frame)
    }

    start(pathPoints){
        this.end()
        this.prevTime = new Date().getTime()
        this.path = new Path(pathPoints)
        this.speed = 1
        this.buildLineApper({})
    }

    setSpeed(_speed){
        this.speed = _speed
    }

    pause(){
        this.status = 0
    }

    resume(){
        this.status = 1
    }

    end(){
        if(this.path){
            this.path.destroy()
            this.path = null
        }
        this.prevTime = null
        this.prevDistance = 0
        this.currPoint = null
    }

    buildLineApper(option){
        let materialGLSL = `
            uniform float speed;
            uniform float length;
            uniform  vec4 startColor;
            uniform  vec4 endColor;
            czm_material czm_getMaterial(czm_materialInput materialInput){
                czm_material material = czm_getDefaultMaterial(materialInput);
                vec4 diff = endColor - startColor;
                vec2 st = materialInput.st;
                float s = fract(czm_frameNumber * speed / 1000.0);
                float percent = fract((st.s - s) / (length));
                vec4 rgba = startColor + diff * percent ;
                material.diffuse = rgba.rgb;
                return material;
            }
        `
        let apper = new Cesium.PolylineMaterialAppearance({
            material : new Cesium.Material({
                translucent : false,
                fabric : {
                    source: materialGLSL,
                    type: "line",
                    uniforms : {
                        startColor : new Cesium.Color(252 / 255,209 / 255 , 209 / 255 , 0.2),
                        endColor :  new Cesium.Color(136 / 255, 1.0, 1.0, 1.0),
                        speed :  10,
                        length : .5
                    },
                }
            })
        })
        // 线段
        let positions = []
        this.path.points.forEach(point=>{
            positions.push(Cesium.Cartesian3.fromDegrees(point.lon , point.lat , point.height || 0))
        })
        let polyline = new Cesium.PolylineGeometry({
            positions: positions,
            width : 5
        });
        let geometryInstance = new Cesium.GeometryInstance({
            geometry : polyline
        })
        this.linePrimitive = new Cesium.Primitive({
            appearance :apper,
            geometryInstances : geometryInstance
        })
    }

    reBuildModelMatrix(){
        let fixedFrameTransforms =  Cesium.Transforms.localFrameToFixedFrameGenerator('north', 'west');
        // 重新计算矩阵
        this.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(this.position, this.phr, Cesium.Ellipsoid.WGS84, fixedFrameTransforms)
        this.oriModel.modelMatrix = this.modelMatrix
    }

}
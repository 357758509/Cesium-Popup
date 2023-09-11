import {ModelEx} from "./ModelEx";

export default class S3MInstanceCollectionEx extends Cesium.S3MInstanceCollection{

    _viewer =  null

    _model = null

    _primitiveCollection = new Cesium.PrimitiveCollection()

    _handler = null

    constructor(viewer) {
        super(viewer.scene._context);
        viewer.scene.primitives.add(this._primitiveCollection)
    }

    add(url , param){
        if(url.includes(".gltf") || url.includes(".glb") ){
            this._primitiveCollection.add(new ModelEx(url , param))
            return
        }
        super.add(url , param)
    }



}

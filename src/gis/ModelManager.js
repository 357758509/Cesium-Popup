import Model from "./Model";

export default class ModelManager{

    viewer = null

    modelCollection = new Cesium.PrimitiveCollection()

    static buildModel(model , viewer){
        return new Model(model , viewer)
    }

    addModel(model , param){
        model.updateParam(param)
        this.modelCollection.add(model)
    }

    removeModel(model){
        this.modelCollection.remove(model)
    }

    constructor(_viewer) {
        this.viewer = _viewer
        this.viewer.scene.primitives.add(this.modelCollection)
    }
}
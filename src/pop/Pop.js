
export default class Pop{

    dom = null

    pixelOffset = null

    pixelPosition = null

    constructor(option) {
        this.dom = document.getElementById(option.id)
        if(!this.dom){
            throw new Error("no this id")
        }
        this.pixelPosition = option.pixelPosition
        this.pixelOffset = option.offset
        this.update()
    }

    setPosition(position , offset){
        this.pixelPosition = position
        this.pixelOffset = offset
        this.update()
    }

    update(){
        this.dom.style.left = this.pixelPosition.x + this.pixelOffset.x;
        this.dom.style.top = this.pixelPosition.y + this.pixelOffset.y;
    }
}
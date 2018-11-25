const {ccclass, property} = cc._decorator;

@ccclass
export default class myCarScript extends cc.Component {

    @property(Number)
    positionX: number = 0;

    @property(Number)
    positionY: number = 0;

    @property(Number)
    speed = 0;

    @property(Boolean)
    isDestroy : boolean = false;

    public init(positionX, positionY) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.updatePosition();
    }

    public updatePosition(){
        this.node.setPosition(this.positionX, this.positionY);
    }

    onCollisionEnter(other, self) {
        this.isDestroy = true;
        this.node.group = "default";
    }
}

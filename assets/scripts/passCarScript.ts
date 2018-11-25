const {ccclass, property} = cc._decorator;

@ccclass
export default class passCarScript extends cc.Component {

    @property({type: cc.Sprite})
    carSprite: cc.Sprite = null;

    @property(Number)
    carIndex = 0;

    @property(Number)
    speed = 0;

    @property(Boolean)
    isDestroy : boolean = false;

    public init(carIndex, positionX, speed) {
        this.isDestroy = false;
        this.carIndex = carIndex;
        this.speed = speed;
        this.node.setPosition(positionX, 800);

        let self = this;
        let imgPath = 'cars/' + carIndex;
        cc.loader.loadRes(imgPath, cc.SpriteFrame, function (err, sprite) {
            if (self.carSprite != null) {
                let spr = self.carSprite.getComponent(cc.Sprite);
                if (spr) spr.spriteFrame = sprite;
            }
        });
    }

    onCollisionEnter(other, self) {
        this.isDestroy = true;
    }
}

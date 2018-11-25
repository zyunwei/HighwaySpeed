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
        this.node.setPosition(positionX, 700);

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
        console.log("pass car collision!")
        this.isDestroy = true;

        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        var world = self.world;

        // 碰撞组件的 aabb 碰撞框
        var aabb = world.aabb;

        // 节点碰撞前上一帧 aabb 碰撞框的位置
        var preAabb = world.preAabb;

        // 碰撞框的世界矩阵
        var t = world.transform;

        // 以下属性为圆形碰撞组件特有属性
        var r = world.radius;
        var p = world.position;

        // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        var ps = world.points;
    }
}

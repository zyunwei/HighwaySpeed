import myCarScript from "./myCarScript";

const {ccclass, property} = cc._decorator;
import defines from './defines';
import global from './global';
import car from './car';
import * as TWEEN from '../lib/Tween.js';

@ccclass
export default class playSceneScript extends cc.Component {
    @property(cc.Sprite)
    MyCarSprite: cc.Sprite = null;
    _myCar: myCarScript = null;

    @property(cc.Label)
    LabelSpeed: cc.Label = null;

    @property(cc.Node)
    Road1: cc.Node = null;

    @property(cc.Node)
    Road2: cc.Node = null;

    @property(cc.Node)
    PassCars: cc.Node = null;

    @property({type: cc.AudioClip})
    BrakeSound: cc.AudioClip = null;

    @property({type: cc.AudioClip})
    CrashSound: cc.AudioClip = null

    @property({type: cc.AudioClip})
    AccSound: cc.AudioClip = null;

    @property(cc.Prefab)
    passCarPrefab: cc.Prefab = null;

    _accSoundNumber: number = 0;
    _brakeSoundNumber: number = 0;

    protected onLoad() {
        let collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;
        //collisionManager.enabledDebugDraw = true;
    }

    protected start() {
        global.TotalMileage = 0;

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this._myCar = this.MyCarSprite.node.getComponent("myCarScript");
        this._myCar.init(100, -480);

        function animate() {
            requestAnimationFrame(animate);
            TWEEN.update();
        }

        animate();

        this.initMap();
    }

    protected update(dt: number) {
        this._myCar.updatePosition()

        this.LabelSpeed.string = Math.round(this._myCar.speed) + " km/h";

        let offsetPixel = Math.round(this._myCar.speed / 10);

        global.TotalMileage += offsetPixel * 0.046875;

        if (Math.round(this._myCar.speed) > 0) {
            let roadPosition1 = this.Road1.getPosition();
            let roadPosition2 = this.Road2.getPosition();

            this.Road1.setPosition(roadPosition1.x, roadPosition1.y - offsetPixel);
            this.Road2.setPosition(roadPosition2.x, roadPosition2.y - offsetPixel);

            if (roadPosition1.y <= -1920) {
                this.Road1.setPosition(roadPosition1.x, roadPosition1.y + 2560 - offsetPixel);
                this.createPassCar();
            }

            if (roadPosition2.y <= -1920) {
                this.Road2.setPosition(roadPosition2.x, roadPosition2.y + 2560 - offsetPixel);
                this.createPassCar();
            }
        }

        if (this._myCar.isDestroy) {
            cc.audioEngine.play(this.CrashSound, false, 1);
            this._myCar.isDestroy = false;
            cc.director.loadScene("scoreScene");
        }

        this.updatePassCar(this._myCar.speed);
    }

    protected createPassCar() {
        let newPassCar = null;

        if (global.PassCarPool.size() > 0) {
            console.log("对象池:" + global.PassCarPool.size());
            newPassCar = global.PassCarPool.get();
        } else {
            console.log("创建新对象");
            newPassCar = cc.instantiate(this.passCarPrefab);
        }

        let carIndex = Math.floor(Math.random() * 9 + 1);
        let positionX = Math.floor(Math.random() * 450 - 200);
        let passCarScript = newPassCar.getComponent("passCarScript");
        let speed = Math.floor(Math.random() * 100 + 50);
        passCarScript.init(carIndex, positionX, speed);

        newPassCar.parent = this.PassCars;
    }

    protected updatePassCar(mySpeed) {
        let passCarList = this.PassCars.children;
        let removePassCarList = [];

        for (let passCar of passCarList) {
            let passCarScript = passCar.getComponent("passCarScript");
            let offsetPixel = Math.round((passCarScript.speed - mySpeed) / 10);
            let newPositionY = passCar.position.y + offsetPixel;
            passCar.setPosition(passCar.position.x, newPositionY);
            if (passCarScript.isDestroy || newPositionY > 800 || newPositionY < -800) {
                removePassCarList.push(passCar);
            }
        }

        for (let passCar of removePassCarList) {
            global.PassCarPool.put(passCar);
        }
    }

    protected onTouchStart(e: cc.Event.EventTouch) {
        let duration = Math.round(defines.TOP_SPEED_TIME * (1 - this._myCar.speed / defines.TOP_SPEED));

        cc.audioEngine.stop(this._brakeSoundNumber);
        this._accSoundNumber = cc.audioEngine.play(this.AccSound, false, 0.5);

        TWEEN.removeAll();
        new TWEEN.Tween(this._myCar)
            .to({speed: defines.TOP_SPEED}, duration)
            .easing(TWEEN.Easing.Circular.InOut)
            .start();
    };

    protected onTouchMove(e: cc.Event.EventTouch) {
        let delta = e.touch.getDelta();
        let checkPositionX = this._myCar.positionX + delta.x;
        if (checkPositionX < -300) {
            checkPositionX = -300;
        }
        if (checkPositionX > 300) {
            checkPositionX = 300;
        }

        this._myCar.positionX = checkPositionX;
    };

    protected onTouchEnd(e: cc.Event.EventTouch) {
        let duration = Math.round(defines.BRAKE_TIME * (this._myCar.speed / defines.TOP_SPEED));

        cc.audioEngine.stop(this._accSoundNumber);
        this._brakeSoundNumber = cc.audioEngine.play(this.BrakeSound, false, 1);

        TWEEN.removeAll();
        new TWEEN.Tween(this._myCar)
            .to({speed: 0}, duration)
            .easing(TWEEN.Easing.Circular.Out)
            .start();
    };

    protected initMap() {
        let graphics1 = this.Road1.addComponent(cc.Graphics);
        graphics1.lineWidth = 1;
        graphics1.clear();
        graphics1.fillColor = new cc.Color(255, 255, 255);

        graphics1.fillRect(60, 0, 10, 1400);
        graphics1.fillRect(650, 0, 10, 1400);

        for (let y = 0; y < 1280; y += 320) {
            graphics1.fillRect(355, y, 10, 128);
        }

        let graphics2 = this.Road2.addComponent(cc.Graphics);
        graphics2.lineWidth = 1;
        graphics2.clear();
        graphics2.fillColor = new cc.Color(255, 255, 255);

        graphics2.fillRect(60, 0, 10, 1400);
        graphics2.fillRect(650, 0, 10, 1400);

        for (let y = 0; y < 1280; y += 320) {
            graphics2.fillRect(355, y, 10, 128);
        }
    }
}

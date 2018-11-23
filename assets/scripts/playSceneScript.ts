const {ccclass, property} = cc._decorator;
import car from './car';
import * as TWEEN from '../lib/Tween.js';
import defines from './defines';

@ccclass
export default class playSceneScript extends cc.Component {
    @property(car)
    _myCar = null;

    @property(cc.Sprite)
    CarSprite = null;

    @property(cc.Label)
    LabelSpeed = null;

    @property(cc.Node)
    Road1 = null;

    @property(cc.Node)
    Road2 = null;

    @property({type: cc.AudioClip})
    EngineSound = null;
    EngineSoundNumber = -1;

    @property({type: cc.AudioClip})
    BrakeSound = null;
    BrakeSoundNumber = -1;

    @property({type: cc.AudioClip})
    CrashSound = null;
    CrashSoundNumber = -1;

    protected start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this._myCar = new car(100, -480);

        function animate() {
            requestAnimationFrame(animate);
            TWEEN.update();
        }

        animate();

        this.initMap();
    }

    protected update(dt: number) {
        this.CarSprite.node.setPosition(this._myCar.positionX, this._myCar.positionY);
        this.LabelSpeed.string = Math.round(this._myCar.speed) + " km/h";

        let moveLength = Math.round(this._myCar.speed / 10);
        if (Math.round(this._myCar.speed) > 0) {
            let roadPosition1 = this.Road1.getPosition();
            let roadPosition2 = this.Road2.getPosition();

            this.Road1.setPosition(roadPosition1.x, roadPosition1.y - moveLength);
            this.Road2.setPosition(roadPosition2.x, roadPosition2.y - moveLength);

            if (roadPosition1.y <= -1920) {
                this.Road1.setPosition(roadPosition1.x, roadPosition1.y + 2560 - moveLength);
            }

            if (roadPosition2.y <= -1920) {
                this.Road2.setPosition(roadPosition2.x, roadPosition2.y + 2560 - moveLength);
            }
        }
    }

    protected onTouchStart(e: cc.Event.EventTouch) {
        this._myCar.isAccelerating = true;
        let duration = Math.round(defines.TOP_SPEED_TIME * (1 - this._myCar.speed / defines.TOP_SPEED));

        this.EngineSoundNumber = cc.audioEngine.play(this.EngineSound, true, 1);
        cc.audioEngine.stop(this.BrakeSoundNumber);

        TWEEN.removeAll();
        new TWEEN.Tween(this._myCar)
            .to({speed: defines.TOP_SPEED}, duration)
            .easing(TWEEN.Easing.Circular.InOut)
            .start();
    };

    protected onTouchMove(e: cc.Event.EventTouch) {
        let delta = e.touch.getDelta();
        this._myCar.positionX = this._myCar.positionX + delta.x;
    };

    protected onTouchEnd(e: cc.Event.EventTouch) {
        this._myCar.isAccelerating = false;
        let duration = Math.round(defines.BRAKE_TIME * (this._myCar.speed / defines.TOP_SPEED));

        this.BrakeSoundNumber = cc.audioEngine.play(this.BrakeSound, false, 1);
        cc.audioEngine.stop(this.EngineSoundNumber);

        TWEEN.removeAll();
        new TWEEN.Tween(this._myCar)
            .to({speed: 0}, duration)
            .easing(TWEEN.Easing.Circular.InOut)
            .start();
    };

    protected initMap() {
        let graphics1 = this.Road1.addComponent(cc.Graphics);
        graphics1.lineWidth = 1;
        graphics1.clear();
        graphics1.fillColor = new cc.Color(255, 255, 255);

        graphics1.fillRect(60, 0, 10, 1280);
        graphics1.fillRect(650, 0, 10, 1280);

        for (let y = 0; y < 1280; y += 320) {
            graphics1.fillRect(355, y, 10, 128);
        }

        let graphics2 = this.Road2.addComponent(cc.Graphics);
        graphics2.lineWidth = 1;
        graphics2.clear();
        graphics2.fillColor = new cc.Color(255, 255, 255);

        graphics2.fillRect(60, 0, 10, 1280);
        graphics2.fillRect(650, 0, 10, 1280);

        for (let y = 0; y < 1280; y += 320) {
            graphics2.fillRect(355, y, 10, 128);
        }
    }
}

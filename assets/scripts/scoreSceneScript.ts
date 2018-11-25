import global from "./global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class scoreSceneScript extends cc.Component {
    @property(cc.Label)
    LabelScore: cc.Label = null;

    start() {
        this.LabelScore.string = "总里程：" + Math.round(global.TotalMileage) + "米";
    };

    btnRetry_Click(event, data) {
        cc.director.loadScene("playScene");
    }
}

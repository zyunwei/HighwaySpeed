const {ccclass, property} = cc._decorator;

@ccclass
export default class loginSceneScript extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;

    start () {

    };

    btnLogin_Click(event, data){
        cc.director.loadScene("playScene");
    }
}

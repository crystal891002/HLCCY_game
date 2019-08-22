// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        sharebtn:cc.Node,
        carimg:cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.ShareBtnFangSuo();
        let self = this;
        Global.carlvl++;
        let url_car ="car_"+Global.carlvl+'.png';
        cc.loader.loadRes(url_car, cc.SpriteFrame, function (err, spriteFrame) {
            self.carimg.spriteFrame = spriteFrame;
        });
        Global.SetUserInfo();
    },
    init(){

    },
    closeBtn(){
        cc.find("Canvas").getComponent("start").UserPower();
        this.node.destroy();
    },
    shareBtn(){
        Global.ShareApp();
    },
    /**
     * 炫耀一下的放缩
     */
    ShareBtnFangSuo: function () {
        var self = this;
        this.schedule(function () {
            var action = self.FangSuoFun();
            self.sharebtn.runAction(action);
        }, 1.0, cc.macro.REPEAT_FOREVER, 0.1);
    },

    /**
     * 按钮放缩方法
     */
    FangSuoFun: function () {
        var action = cc.sequence(
            cc.scaleTo(0.5, 0.9, 0.9),
            cc.scaleTo(0.5, 1.1, 1.1),
        );
        return action;
    },
    // update (dt) {},
});

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
        prefab_tips:{
            default: null,
            type: cc.Prefab,
        },
        prefab_boxview:{
            default: null,
            type: cc.Prefab,
        },
        prefab_carview:{
            default: null,
            type: cc.Prefab,
        },
        prefab_taskview:{
            default: null,
            type: cc.Prefab,
        },
        prefab_peopleupview:{
            default: null,
            type: cc.Prefab,
        },
        prefab_rankview:{
            default: null,
            type: cc.Prefab,
        },
        prefab_userview:{
            default: null,
            type: cc.Prefab,
        },
        prefab_addpower:{
            default:null,
            type:cc.Prefab,
        },
        prefab_nationaldat:{
            default: null,
            type: cc.Prefab,
        },
        clip_backmusic: {
            default: null,
            type: cc.AudioClip,
        },
        clip_click:{
            default:null,
            type:cc.AudioClip,
        },
        clip_click_2:{
            default:null,
            type:cc.AudioClip,
        },
        clip_win:{
            default:null,
            type:cc.AudioClip,
        },
        anim_target:cc.Node,
        anim_pos:cc.Node,
        powerbg:cc.Node,
        player_name:cc.Label,
        player_img:cc.Sprite,
        car_img:cc.Sprite,
        lvlup_player:cc.Node,
        lvlup_car:cc.Node,
        lvl_label:cc.Label,
        musicbtn:{
            default: null,
            type: cc.Sprite,
        },
        btnSprite: {
            default: [],
            type: cc.SpriteFrame
        },
        jumpAppPrefab: {
            default: [],
            type: cc.Node,
        },
        userlvlsprite:{
            default:[],
            type: cc.SpriteFrame,
        },
        carlvlsprite:{
            default:[],
            type: cc.SpriteFrame,
        },
        power_prefab:{
            default:null,
            type:cc.Prefab,
        },
        btn_guoqing:{
            default:null,
            type:cc.Node,
        },
        prefab_gongzhonghao:{
            default:null,
            type:cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        wx.aldSendEvent('游戏首页_页面访问数');
        this.startTime = Date.now();

        var date = new Date();
        let gqtime = date.toLocaleDateString()
        var arr_gqtime = gqtime.split("/");
        console.log("当前日期",arr_gqtime);
        // if(gqtime === "2019/10/9"){
        //     //国庆活动结束显示弹窗
        //     this.btn_guoqing.active = true;
        // }

        let self = this;
        this.isplaymusic = true;
        this.isOK = false;
        if(this.clip_backmusic){
            cc.audioEngine.playMusic(this.clip_backmusic, true);
            cc.audioEngine.setMusicVolume(0.6);
        }
        this.power_string = this.powerbg.getChildByName("number").getComponent(cc.Label);
        this.power_max = this.powerbg.getChildByName("max");
        this.power_time = this.powerbg.getChildByName("time");
        Global.prefab_tip = this.prefab_tips;
        Global.clip_click = this.clip_click;
        Global.clip_click_2 = this.clip_click_2;
        Global.clip_win = this.clip_win;

        if (CC_WECHATGAME) {
            self.UserPower();
        }

        Global.addListener();
        //this.ShowBoxView();
        this.ChangeJumpAppSelectSprite();

        //判断如果玩家授权过。就调用一下我们自己的授权(因为授权成功之后是不会再出现的)
        wx.getSetting({
            success: function (res) {
                var authSetting = res.authSetting;
                if (authSetting['scope.userInfo'] === true) {
                    if (Global.UserAuthPostCount == 0) {
                        wx.getUserInfo({
                            success(res){
                                Global.UserAuthPost(res, Global.sessionId);
                            }
                        });
                    }
                }
            }
        });
        //第一关时新手引导
        // Global.gamedata = {data:{"data":
        //                         {"lvl":1,"conf":{"id":1,
        //                         "word":["独","一","心","一","意","无","接","二","连","三"],
        //                         "idiom":["独一无二","一心一意","接二连三"],
        //                         "posx":[4,2,3,4,5,4,3,4,5,6],
        //                         "posy":[5,4,4,4,4,3,2,2,2,2],
        //                         "answer":[3,7,9],
        //                         "barrier":[]}},
        //                         "errcode":0,
        //                         "errmsg":""
        //                     },
        //                     lvl:1
        //                 }
        //cc.director.loadScene("game.fire");

        cc.director.preloadScene("game", function () {
            cc.log("预加载开始scene");
        });
    },
    BackMusicBtn(){
        if(this.isplaymusic == false){
            cc.audioEngine.resumeMusic();
            this.musicbtn.spriteFrame = this.btnSprite[0];
        }else{
            cc.audioEngine.pauseMusic();
            this.musicbtn.spriteFrame = this.btnSprite[1];
        }
        this.isplaymusic = !this.isplaymusic;
    },
    //玩家数据 赋值等
    UserPower(){
        let self = this;
        Global.GetUserInfo((res)=>{
            if(res.state == 1){
                this.isOK =true;
                Global.power = res.result.power;
                Global.level = res.result.lvl;

                Global.isgqlogin = res.result.isgqlogin;
                Global.ismpday = res.result.ismpday;
                Global.isteam = res.result.isteam;
                
                if(Global.ismpday ==false &&Global.isGongZhonghao){
                    let powerview = cc.instantiate(self.power_prefab);
                    self.node.addChild(powerview);
                }

                Global.playerlvl = res.result.playerlvl;
                Global.carlvl = res.result.carlvl;
                this.player_name.string = Global.UserLvlData[Global.playerlvl-1].name.trim();

                self.player_img.spriteFrame = this.userlvlsprite[Global.playerlvl-1];
                self.car_img.spriteFrame =  this.carlvlsprite[Global.carlvl-1];
                
                //显示升级按钮
                if(Global.playerlvl&&Global.level>=Global.UserLvlData[Global.playerlvl].gamelvl){
                    self.lvlup_player.active =true;
                }else{
                    self.lvlup_player.active =false;
                }
                if(Global.carlvl&&Global.level>=Global.CarLvlData[Global.carlvl-1].gamelvl){
                    self.lvlup_car.active = true;
                }else{
                    self.lvlup_car.active =false;
                }
                if(Global.playerlvl<Global.carlvl){
                    let num_lvl = Global.UserLvlData[Global.playerlvl].gamelvl - Global.level;
                    if(num_lvl<=0){
                        self.lvl_label.string = "当前可以升级人物";
                    }else{
                        self.lvl_label.string = "还有"+num_lvl+"关后可升级最新人物";
                    }
                }else{
                    let num_lvl = Global.CarLvlData[Global.carlvl-1].gamelvl - Global.level;
                    if(num_lvl<=0){
                        self.lvl_label.string = "当前可以升级车辆";
                    }else{
                        self.lvl_label.string = "还有"+num_lvl+"关后可升级最新车辆";
                    }
                }
                self.power_string.string = res.result.power;
                if(res.result.nexttime>0){
                    Global.nexttime = res.result.nexttime;
                    self.power_max.active = false;
                    self.power_time.active = true;
                    this._time = Math.round(res.result.nexttime/1000) -Math.round(Date.now() / 1000)+10;
                    if(this._time>0){
                        var minute  = Math.floor((this._time%3600)/60);
                        var second = this._time %3600%60;
                        minute = minute < 10 ? ('0' + minute) : minute;
                        second = second < 10 ? ('0' + second) : second;
                        self.power_time.getComponent(cc.Label).string = minute+":"+second;
                        this.schedule(this.doCountdownTime,1);
                    }
                }else{
                    self.power_max.active = true;
                    self.power_time.active = false;
                }
            }
        });
    },
    //倒计时
    doCountdownTime(){
        //每秒更新显示信息
        if (this._time > 0 ) {
            this._time -= 1;
            var minute  = Math.floor((this._time%3600)/60);
            var second = this._time %3600%60;
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            this.power_time.getComponent(cc.Label).string = minute+":"+second;
            this.countDownShow(this._time);
        }
    },
    countDownShow(temp){
        if(temp<=0){
            this.unschedule(this.doCountdownTime);
            this.UserPower();
        }
    },
    //分享按钮
    shareBtn(){
        wx.aldSendEvent('分享',{'页面' : '游戏游戏_分享好友'});
        Global.ShareApp();

    },
    //分享按钮
    nationaldayBtn(){
        let gzh = cc.instantiate(this.prefab_gongzhonghao);
        if(gzh){
            this.node.addChild(gzh);
        }

    },
    //排行榜
    rankBtn(){
        wx.aldSendEvent('游戏首页_荣耀榜');
        let ranview = cc.instantiate(this.prefab_rankview);
        if(ranview){
            this.node.addChild(ranview);
        }
    },
    //免费体力(试玩任务)
    FreePowerBtn(event, customEventData){
        if(customEventData == "taskBtn"){
            wx.aldSendEvent('游戏首页_免费体力');
        }else{
            wx.aldSendEvent('游戏首页_体力加');
        }
        let freepowerview = cc.instantiate(this.prefab_taskview);
        if(freepowerview){
            this.node.addChild(freepowerview);
        }
    },
    //升级车辆
    CarLevelUpBtn(){
        if (CC_WECHATGAME) {
            if(wx.createRewardedVideoAd){
                //看视频成功显示页面TODO
                wx.aldSendEvent('视频广告');
                wx.aldSendEvent('视频广告_游戏首页_升级车辆');
                Global.showAdVedio(this.CarLevelUp.bind(this), this.CarFailed.bind(this));
            }
        }
    },
    CarLevelUp(){
        wx.aldSendEvent('视频广告',{'是否有效' : '是'});
        wx.aldSendEvent('视频广告',{'是否有效' : '游戏首页_升级车辆_是'});
        let carview = cc.instantiate(this.prefab_carview);
        if(carview){
            this.node.addChild(carview);
        }
    },
    CarFailed(){
        wx.aldSendEvent('视频广告',{'是否有效' : '否'});
        wx.aldSendEvent('视频广告',{'是否有效' : '游戏首页_升级车辆_否'});
        Global.ShowTip(this.node, "观看完视频才能升级哦");
    },
    //升级人物
    UserLevelUpBtn(){
        if (CC_WECHATGAME) {
            if(wx.createRewardedVideoAd){
                //看视频成功显示页面TODO
                wx.aldSendEvent('视频广告');
                wx.aldSendEvent('视频广告_游戏首页_升级人物');
                Global.showAdVedio(this.UserLevelUp.bind(this), this.UserFailed.bind(this));
            }
        }
    },
    UserLevelUp(){
        wx.aldSendEvent('视频广告',{'是否有效' : '是'});
        wx.aldSendEvent('视频广告',{'是否有效' : '游戏首页_升级人物_是'});
        let user= cc.instantiate(this.prefab_userview);
        if(user){
            this.node.addChild(user);
        }
    },
    UserFailed(){
        wx.aldSendEvent('视频广告',{'是否有效' : '否'});
        wx.aldSendEvent('视频广告',{'是否有效' : '游戏首页_升级人物_否'});
        Global.ShowTip(this.node, "观看完视频才能升级哦");
    },
    ShowPeopleUpView(){
        wx.aldSendEvent('游戏首页_人物');
        let peopleview = cc.instantiate(this.prefab_peopleupview)
        if(peopleview){
            this.node.addChild(peopleview);
        }
    },
    //宝箱
    ShowBoxView(){
        if(Global.boxcount != 0){
            Global.GetUserData((res)=>{
                if(res.state == 1){
                    Global.boxnum = res.result.ucount;
                    if(Global.boxnum >5){
                        let probability = Math.floor(Math.random() * 10);
                        if(probability<=3){
                            let boxview = cc.instantiate(this.prefab_boxview);
                            if(boxview){
                                this.node.addChild(boxview);
                            }
                        }
                    }
                }
            })
        }else{
            Global.boxcount++;
        }
    },
    //开始游戏
    PlayerBtn(){
        if(this.isOK){
            this.isOK = false;
            let self =this;
            wx.aldSendEvent('游戏首页_答题升级');
            //如果体力够
            if(Global.power>0){
                //如果体力是满的
                if(Global.power == Global.maxpower){
                    self.power_max.active = false;
                    self.power_time.active = true;
                    self._time = 310;
                    self.schedule(self.doCountdownTime,1);
                }
                Global.power -=1;
                self.power_string.string = Global.power;
                //动画
                cc.tween(this.anim_target)
                .to(1, { position: cc.v2(this.anim_pos.x, this.anim_pos.y)})
                .call(() => {
                    //获取关卡数据
                    Global.GetLvldata(Global.level,(res)=>{
                        if(res.state==1){
                            Global.gamedata = res.result;
                            cc.director.loadScene("game.fire");
                            wx.aldSendEvent("游戏首页_页面停留时间",{
                                "耗时" : (Date.now()-this.startTime)/1000
                            });
                        }else{
                            this.isOK = true;
                        }
                    });
                })
                .start()
            }else{
                this.ShowAddPower();
                this.isOK = true;
            }
        }
    },
    ShowAddPower(){
        let addpower = cc.instantiate(this.prefab_addpower)
        if(addpower){
            this.node.addChild(addpower);
        }
    },
    ShowNationaldat(){
        let nationaldat = cc.instantiate(this.prefab_nationaldat)
        if(nationaldat){
            this.node.addChild(nationaldat);
        }
    },
    /**
     * 循环切换广告图片的方法
     */
    ChangeJumpAppSelectSprite() {
        let Arr_jumpApp_Sprite = [];
        for (let i = 0; i < this.jumpAppPrefab.length; i++) {
            let sprite = this.jumpAppPrefab[i].getChildByName("sprite");
            let temp = sprite.getComponent(cc.Sprite);
            Arr_jumpApp_Sprite.push(temp);
            this.jumpAppPrefab[i].index = i;
            this.jumpAppPrefab[i].on("touchend",this.TouchEnd,this);
            this.JumpAppFangSuo(this.jumpAppPrefab[i]);
        }
        this.schedule(() => {
            for (let j = 0; j < this.jumpAppPrefab.length; j++) {
                // // 上线前注释console.log(" Arr_jumpApp_Sprite[j].index == ", Arr_jumpApp_Sprite[j].index);
                if (this.jumpAppPrefab[j].index < Global.jumpappObject.length - 1) {
                    this.jumpAppPrefab[j].index++;
                } else {
                    this.jumpAppPrefab[j].index = 0;
                }
                Arr_jumpApp_Sprite[j].spriteFrame = Global.jumpappObject[this.jumpAppPrefab[j].index].sprite;
            }
        }, 3.0, cc.macro.REPEAT_FOREVER, 0.1);
    },

    /**
    * 游戏广告按钮的放缩
    */
    JumpAppFangSuo: function (node) {
        var self = this;
        this.schedule(function () {
            var action = self.GGFangSuoFun();
            node.runAction(action);
        }, 1.0, cc.macro.REPEAT_FOREVER, 0.1);
    },

    /**
     * 按钮放缩方法
     */
    GGFangSuoFun: function () {
        var action = cc.sequence(
            cc.scaleTo(0.5, 1.0, 1.0),
            cc.scaleTo(0.5, 1.2, 1.2),
        );
        return action;
    },

    TouchEnd(event) {
        // 上线前注释console.log("event == ", event.target);
       
        event.stopPropagation();
        // 阿拉丁埋点
        wx.aldSendEvent('游戏推广');
        wx.aldSendEvent('游戏推广_游戏首页_图片推广');

        if (CC_WECHATGAME) {
            wx.navigateToMiniProgram({
                appId: Global.jumpappObject[event.target.index].apid,
                path: Global.jumpappObject[event.target.index].path,
                success: function (res) {
                    // 上线前注释console.log(res);
                },
                fail: function (res) {
                    // 上线前注释console.log(res);
                },
            });
        }
    },
    // update (dt) {},
});

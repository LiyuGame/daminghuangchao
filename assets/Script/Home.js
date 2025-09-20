var GameTools = require("GameTools");
var GameUiTools = require("GameUiTools");
var GameConfig = require("GameConfig");

cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label,
            displayName:"加载字",
        },
        
    },

    onLoad: function () {
        GameConfig.buyGoldUpgrade[1] = Math.floor(GameTools.getItemByLocalStorage("buyGoldUpgrade1", 100));
        GameConfig.buyGoldUpgrade[2] = Math.floor(GameTools.getItemByLocalStorage("buyGoldUpgrade2", 1500));
        for(let i=3;i<=42;i++){
            // GameTools.setItemByLocalStorage("buyGoldUpgrade"+i,Math.floor(Math.pow((3+Math.ceil(i/10)*0.1),i-2)*1500));
            GameConfig.buyGoldUpgrade[i]=Math.floor(GameTools.getItemByLocalStorage("buyGoldUpgrade"+i,Math.floor(Math.pow((3+Math.ceil(i/10)*0.1),i-2)*1500)));
        }

        // GameTools.setItemByLocalStorage("buyCoinUpgrade1", 40);
        GameConfig.buyCoinUpgrade[1] = Math.floor(GameTools.getItemByLocalStorage("buyCoinUpgrade1", 40));
        for(let i=2;i<=42;i++){
            if(i<10){
                // GameTools.setItemByLocalStorage("buyCoinUpgrade"+i,Math.floor(40+20*(i-1)));
                GameConfig.buyCoinUpgrade[i]=Math.floor(GameTools.getItemByLocalStorage("buyCoinUpgrade"+i,Math.floor(40+20*(i-1))));
            }else{
                // GameTools.setItemByLocalStorage("buyCoinUpgrade"+i,Math.floor(200*Math.pow(1.5,i)));
                GameConfig.buyCoinUpgrade[i]=Math.floor(GameTools.getItemByLocalStorage("buyCoinUpgrade"+i,Math.floor(200*Math.pow(1.5,i))));
            }
        }

        this.setMessage();
        
        cc.director.preloadScene("helloworld", function () {
            cc.director.loadScene("helloworld");
        });
    },
    //判断今天是否是第一次进游戏,以及是否可以离线收益(换成数据的加载)
    setMessage(){
        GameConfig.GameMoney = GameTools.getItemByLocalStorage("GameMoney",1000);
        GameConfig.GameCoin = GameTools.getItemByLocalStorage("GameCoin",0);
        GameConfig.GamePersonMaxLevel = GameTools.getItemByLocalStorage("GamePersonMaxLevel", 1);
        GameConfig.turnTableNum = GameTools.getItemByLocalStorage("turnNum",0);
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            // wx.request({
            //     url: 'https://damingchao.oss-cn-shenzhen.aliyuncs.com/Global.json',
            //     success: function (res) {
            //         console.log(res);
            //         GameConfig.IS_GAME_SHARE = res.data.allow_share;
            //         GameConfig.shareData.title = res.data.share_title;
            //         GameConfig.shareData.url = res.data.share_img;
            //         console.log('获取Global资源成功',GameConfig.IS_GAME_SHARE);
            //     },
            //     fail: function () {
            //         console.log('获取Global资源失败',GameConfig.IS_GAME_SHARE);
            //     }
            // })
        }else if (cc.sys.platform === cc.sys.BYTEDANCE_GAME){

        }else if(cc.sys.platform === cc.sys.QQ_PLAY){
            BK.QQ.fetchOpenKey(function (errCode, cmd, data) {
                if (errCode == 0) {
                    GameConfig.OPENID = data.openId;
                    console.log('openId='+data.openId);
                }
            });
        }
    },
    start(){
        this.num = 0;
        this.schedule(this.updatelabel,0.2);
    },

    updatelabel(){
        this.index++;
        if (this.index % 4 == 0) {
            this.label.string = "游戏正在加载..";
        } else if (this.index % 4 == 1) {
            this.label.string = "游戏正在加载...";
        } else if (this.index % 4 == 2) {
            this.label.string = "游戏正在加载。...";
        } else if (this.index % 4 == 3) {
            this.label.string = "游戏正在加载。....";
        }
    }
    // update: function (dt) {

    // },
});

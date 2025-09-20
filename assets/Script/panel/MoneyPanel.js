var GameConfig = require("GameConfig");
var GameUiTools = require("GameUiTools");
var GameTools = require("GameTools");
cc.Class({
    extends: cc.Component,

    properties: {
        moneylabel:{
            default:null,
            type:cc.Label,
            displayName:"金钱数"
        },
        num:0,
    },

    onLoad () {
        this.moneylabel.string = Math.floor(GameConfig.buyGoldUpgrade[GameConfig.GamePersonMaxLevel]*2);
    },

    start () {},

    doubletakeClick(){
        GameTools.playSimpleAudioEngine(3);
        GameConfig.shareComponent = this;
        GameTools.sharePicture();
        GameConfig.shareTime = (new Date()).getTime();
    },
    shareSuccess(){
        GameConfig.GameMoney += GameConfig.buyGoldUpgrade[GameConfig.GamePersonMaxLevel]*2;
        GameConfig.main.setGameMoney();
        this.closeClick();
        GameTools.showToast('获得'+GameConfig.buyGoldUpgrade[GameConfig.GamePersonMaxLevel]*2+'铜钱');
    },
    closeClick(){
        GameTools.playSimpleAudioEngine(3);
        this.node.destroy();
    },
    // update (dt) {},
});

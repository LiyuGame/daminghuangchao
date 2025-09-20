var GameConfig = require("GameConfig");
var GameTools = require("GameTools");
var GameUiTools = require("GameUiTools");

cc.Class({
    extends: cc.Component,

    properties: {
        closebtn:{
            default:null,
            type:cc.Node,
            displayName:"关闭按钮"
        },
        shopItemPrefab:{
            default:null,
            type:cc.Prefab,
            displayName:"商品节点"
        },
        showContent:{
            default:null,
            type:cc.Node,
            displayName:"显示商品内容"
        },
        moneyLabel:{
            default:null,
            type:cc.Label,
            displayName:"金钱"
        }
    },
    

    onLoad () {
        this.setMoney();
        this.init(0);
        let i=1;
        this.schedule(()=>{
            this.init(i++);
        },0.5,5,0.5)
    },

    start () {
        GameUiTools.setButtonClickEvents(this,this.closebtn,"buttonFunc");
    },
    closePanel(){
        GameTools.playSimpleAudioEngine(3);
        this.node.destroy();
    },
    setMoney(){
        this.moneyLabel.string = GameTools.getNumberString(GameConfig.GameMoney);
    },
    init(count){
        for(let i=count*6;i<count*6+6;i++){
            let shopItem = cc.instantiate(this.shopItemPrefab);
            shopItem.getComponent('ShopItemList').initItem(i+1);
            // if(count == 0){
            //     setTimeout(() => {
            //         this.showContent.addChild(shopItem, i, "shopItem");
            //         this.showContent.y = 0;
            //     }, 200);
            // }else{
                this.showContent.addChild(shopItem,i,"shopItem");
            // }
            
        }
    },
    buttonFunc(event){
        let button = event.target;
        if(this.closebtn == button){
            this.closePanel();
        }
    },
    update (dt) {
        this.setMoney();
    },
});

var GameConfig = require("GameConfig");

if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    var  EQ  = require("eq4096");
    EQ.init({
        debug: false,
        showself: true
    });
}
var GameTools = {
    numberLabelAtlas: null,
    backMusicIsPlay: null,
    playSimpleAudioEngine: function (engineType) {
        if (GameConfig.IS_GAME_VOICE) {
            switch (engineType) {
                case 0:
                    cc.loader.loadRes('music/bg01', cc.AudioClip, function (err, clip) {
                        cc.audioEngine.play(clip, true, 0.5);
                    });
                    break;
                case 1:
                    cc.loader.loadRes('music/click', cc.AudioClip, function (err, clip) {
                        cc.audioEngine.play(clip, false, 0.5);
                    });
                    break;
                case 2:
                    cc.loader.loadRes('music/new', cc.AudioClip, function (err, clip) {
                        cc.audioEngine.play(clip, false, 0.5);
                    });
                    break;
                case 3:
                    cc.loader.loadRes('music/select', cc.AudioClip, function (err, clip) {
                        cc.audioEngine.play(clip, false, 0.5);
                    });
                    break;
                default:
                    break;
            }
        }
    },
    playAudio(src) {
        cc.loader.loadRes(src, cc.AudioClip, function (err, clip) {
            cc.audioEngine.play(clip, false, 0.5);
        });
    },
    playBackgroundMusic: function () {
        if (GameTools.backMusicIsPlay == null && GameConfig.IS_GAME_MUSIC) {
            cc.loader.loadRes('music/bg01', cc.AudioClip, function (err, clip) {
                GameTools.backMusicIsPlay = cc.audioEngine.play(clip, true, 0.5);
            });
        }
    },
    stopBackgroundMusic: function () {
        if (GameTools.backMusicIsPlay != null) {
            cc.audioEngine.stop(GameTools.backMusicIsPlay);
            GameTools.backMusicIsPlay = null;
        }
    },
    getItemByLocalStorage: function (key, value) {
        let values = cc.sys.localStorage.getItem(key);
        if (values === undefined || values === null || values === '') {
            cc.sys.localStorage.setItem(key, value);
            return value;
        }
        if (typeof value === 'boolean') {
            if (typeof values === 'boolean') {
                return values;
            }
            return "true" == values;
        } else if (typeof value === 'number') {
            return Number(values);
        }
        return values;
    },
    setItemByLocalStorage: function (key, value) {
        cc.sys.localStorage.setItem(key, value);
    },
    // moreGameButtonFunc() {
    //     // wx.navigateToMiniProgram({appId: "wx327688f6a69e2888",});
    // },
    // showVideoAd(successCallFunc, failCallFunc) {//显示视频广告
    //     try {
    //         GameConfig.videoAd.load().then(() => GameConfig.videoAd.show());
    //         GameConfig.videoAd.offClose();
    //         GameConfig.videoAd.onClose(res => {
    //             // 用户点击了【关闭广告】按钮
    //             // 小于 2.1.0 的基础库版本，res 是一个 undefined
    //             if (res && res.isEnded || res === undefined) {
    //                 // 正常播放结束，可以下发游戏奖励
    //                 if (successCallFunc) {
    //                     successCallFunc();
    //                 }
    //             } else {
    //                 // 播放中途退出，不下发游戏奖励
    //                 if (failCallFunc) {
    //                     failCallFunc();
    //                 }
    //             }
    //         });
    //     } catch (e) {
    //         this.toastMessage(3);
    //     }
    // },
    showToast(msg) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.showToast({
                title: msg
            })
        }if(cc.sys.platform === cc.sys.QQ_PLAY){
            BK.UI.showToast({
                title: msg,
                duration:1500
            });
        } else {
            console.log(msg);
        }

    },
    toastMessage(toastType) {
        cc.loader.loadRes("Panel/ShowMessage", (err, prefab) => {
            if (!err) {
                var node = cc.instantiate(prefab);
                node.getComponent(cc.Component).setMessage(toastType);
                cc.director.getScene().children[0].addChild(node);
            }
        });
    },
    sharePicture(pictureName, successCallFunc) {
        if(!GameConfig.IS_GAME_SHARE){
            return;
        }
        GameTools.setItemByLocalStorage("GameCompoundShareNumber", GameTools.getItemByLocalStorage("GameCompoundShareNumber", 0) + 1);
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let shareAppMessageValue = {   
                title: GameConfig.shareData.title,
                query: "x=" + GameConfig.MAIN_MENU_NUM, //+ "&" + qingjs.instance.get_share_token(),
                imageUrl: GameConfig.shareData.url,
            };
            if (wx.aldShareAppMessage) {
                wx.aldShareAppMessage(shareAppMessageValue);
            } else {
                window.wx.shareAppMessage(shareAppMessageValue);
            }
        }else if(cc.sys.platform === cc.sys.QQ_PLAY){
            BK.Share.share({
                qqImgUrl: GameConfig.shareData.url,
                // socialPicPath: 'GameRes://localImage.png',
                title: '大明朝',
                summary: GameConfig.shareData.title,
                // extendInfo: '扩展信息，可选，默认为空',
                success: function (succObj) {
                    // callback && callback(true);
                    BK.Console.log('分享成功', succObj.code, JSON.stringify(succObj.data));
                    GameConfig.shareComponent.shareSuccess();
                },
                fail: function (failObj) {
                    // callback && callback(false);
                    BK.Console.log('分享失败', failObj.code, JSON.stringify(failObj.msg));
                },
                complete: () => {
                    BK.Console.log('分享完成，不论成功失败');
                }
            });
        } else {
            if (successCallFunc != undefined) {
                successCallFunc();
            }
            this.toastMessage(0);
            cc.log("执行了截图");
        }
    },
    getNumberString(number) {
        if (number < 1000) {
            return Math.round(number);
        } else if (number < 1000000) {
            return (number / 1000).toFixed(2) + "K";
        } else if (number < 1000000000) {
            return (number / 1000000).toFixed(2) + "M";
        } else if (number < 1000000000000) {
            return (number / 1000000000).toFixed(2) + "B";
        } else if (number < 1000000000000000) {
            return (number / 1000000000000).toFixed(2) + "T";
        } else if (number < 1000000000000000000) {
            return (number / 1000000000000000).toFixed(2) + "aa";
        } else if (number < 1000000000000000000000) {
            return (number / 1000000000000000000).toFixed(2) + "Q";
        } else {
            return (number / 1000000000000000000).toFixed(2) + "Q+";
        }
    },
    // getBatteryAtkNumber(number) {//获取炮台火力值
    //     if (number == 1) {
    //         return 8;
    //     }
    //     let startAtkNumber = 18;
    //     for (let i = 2; i < number; i++) {
    //         startAtkNumber = Math.ceil(startAtkNumber * 2.10001);
    //     }
    //     return startAtkNumber;
    // },
    // getCardAtkNumber(GameLevel, GameCardNumber) {//获取卡片血量值
    //     let startAtkNumber = 179;
    //     for (let i = 1; i < GameLevel; i++) {
    //         if (i % 3 != 0) {
    //             startAtkNumber = Math.floor(startAtkNumber * 1.386);
    //         } else {
    //             startAtkNumber = Math.floor(startAtkNumber * 1.105);
    //         }
    //     }
    //     for (let j = 1; j < GameCardNumber; j++) {
    //         if (j == 1) {
    //             startAtkNumber = Math.floor(startAtkNumber * (1.05));
    //         } else if (j == 2) {
    //             startAtkNumber = Math.floor(startAtkNumber * (1.293));
    //         } else if (j == 3) {
    //             startAtkNumber = Math.floor(startAtkNumber * (1.226));
    //         } else if (j == 4) {
    //             startAtkNumber = Math.floor(startAtkNumber * (1.185));
    //         } else {
    //             startAtkNumber = Math.floor(startAtkNumber * (1.15));
    //         }
    //     }
    //     return startAtkNumber;
    // },

    // getPlayerAtkNumber(GameLevel) {//获取英雄血量值
    //     let startAtkNumber = 179;
    //     for (let i = 1; i < GameLevel; i++) {
    //         if (i % 3 != 0) {
    //             startAtkNumber = Math.floor(startAtkNumber * 1.386);
    //         } else {
    //             startAtkNumber = Math.floor(startAtkNumber * 1.105);
    //         }
    //     }
    //     for (let j = 1; j < GameConfig.GameCardLevel; j++) {
    //         if (j == 1) {
    //             startAtkNumber = Math.floor(startAtkNumber * (1.05));
    //         } else if (j == 2) {
    //             startAtkNumber = Math.floor(startAtkNumber * (1.293));
    //         } else if (j == 3) {
    //             startAtkNumber = Math.floor(startAtkNumber * (1.2266));
    //         } else if (j == GameConfig.GameCardLevel - 1) {
    //             // startAtkNumber = Math.floor(startAtkNumber * (1.3));
    //             startAtkNumber = Math.floor(startAtkNumber * (3));
    //         } else if (j == 4) {
    //             startAtkNumber = Math.floor(startAtkNumber * (1.185));
    //         } else {
    //             startAtkNumber = Math.floor(startAtkNumber * (1.15));
    //         }
    //     }
    //     return startAtkNumber;
    // },

    // getLotteryCoinNumber(number) {//获取奖励金币数量
    //     let GamePlayerLevel = GameTools.getItemByLocalStorage("GamePlayerLevel", 1);
    //     let startAtkNumber = number;
    //     for (let i = 1; i <= Math.floor(GamePlayerLevel / 10); i++) {
    //         if (i < 3) {
    //             startAtkNumber = startAtkNumber * 1000;
    //         } else if (i == 3) {
    //             startAtkNumber = startAtkNumber * 10;
    //         } else if (i == 4) {
    //             startAtkNumber = startAtkNumber * 5;
    //         } else if (i == 5) {
    //             startAtkNumber = startAtkNumber * 2;
    //         }
    //     }
    //     return startAtkNumber;
    // },

    // getPlayerExpNumber(number) {//获取经验值
    //     let startAtkNumber = 0;
    //     for (let i = 1; i <= number; i++) {
    //         startAtkNumber += 15;
    //     }
    //     return startAtkNumber;
    // },

    // getPlayerLevelExpNumber(number) {//获取人物升级经验值
    //     return 150 * (number + 1);
    // },

    getEXPNumber(number) {
        if(number == 0){
            return false;
        }
        if (number <= 3) {
            let num = Math.pow(2,(number-1))*5;
            return num;
        } else if (number > 3) {
            let num = Math.pow(2.1,(number-3))*20;
            return num;
        }
    },

    // getPlayerPkNumberByLevel(level) {
    //     let levelNum = 500;
    //     for (let i = 0; i < level; i++) {
    //         levelNum *= 1.25;
    //     }
    //     return levelNum;
    // },

    // getPlayerPkAtkNumber() {//获取战斗力
    //     let startAtkNumber = 0;
    //     let levelNum = 500;
    //     for (let i = 1; i < GameConfig.GameLevel; i++) {
    //         startAtkNumber += levelNum;
    //         levelNum *= 1.25;
    //     }
    //     for (let i = 1; i <= GameConfig.GameBatteryMaxLevel; i++) {
    //         startAtkNumber += GameTools.getBatteryAtkNumber(i);
    //     }
    //     startAtkNumber = startAtkNumber + GameTools.getItemByLocalStorage("GameDaLiWang", 0) * 50000000;
    //     return startAtkNumber;
    // },

    // getPlayerLevelName() {//获取段位
    //     let names = ["倔强青铜", "秩序白银", "荣耀黄金", "尊贵铂金", "永恒钻石", "最强王者"];

    //     let pkAtk = GameTools.getPlayerPkAtkNumber();
    //     if (pkAtk > 200 * 1000 ** 1000 * 1000 * 1000) {
    //         return names[5];
    //     } else if (pkAtk > 50 * 1000 * 1000 * 1000 * 1000) {
    //         return names[4];
    //     } else if (pkAtk > 1000 * 1000 * 1000 * 1000) {
    //         return names[3];
    //     } else if (pkAtk > 1000 * 1000 * 1000) {
    //         return names[2];
    //     } else if (pkAtk > 1000 * 1000) {
    //         return names[1];
    //     } else {
    //         return names[0];
    //     }
    // },
    createImageApp(avatarUrl, sprite) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            try {
                let image = wx.createImage();
                image.src = avatarUrl;
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        texture.width = 110;
                        texture.height = 110;
                        sprite.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        console.log(e);
                        sprite.node.active = false;
                    }
                };
            } catch (e) {
                console.log(e);
                sprite.node.active = false;
            }
        }
    },
    createImage(avatarUrl, sprite) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            try {
                let image = wx.createImage();
                image.src = avatarUrl;
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        sprite.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        console.log(e);
                        sprite.node.active = false;
                    }
                };
            } catch (e) {
                console.log(e);
                sprite.node.active = false;
            }
        }
    },
    //小游戏跳转
    navigateToMiniProgram(appId, path) {
        if (path == undefined && appId == undefined) {
            console.log("直接离开");
            return;
        }
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            //console.log(appId);

            if (appId === null) {
                console.log("二维码跳转");
                if (typeof (path) == 'array') {
                    wx.previewImage({
                        urls: path
                    })
                } else {
                    wx.previewImage({
                        urls: [path]
                    })
                }
            } else {
                console.log("直接跳转");
                wx.navigateToMiniProgram({
                    appId: appId,
                    path: path,
                    envVersion: "release",
                    success: function () {
                        console.log("navigate success");
                    },
                    fail: function () {
                        console.log("navicate fail");
                    }
                });

            }
        } else {
            cc.log("小程序跳转");
        }
    },
    //小游戏显示
    showMinProgram(node,flag) {
        if (GameConfig.MiniProgram == undefined || GameConfig.MiniProgram.length == 0) {
            return;
        }
        let randomIndex;
        // if(flag == 2){
            let length = GameConfig.MiniProgram.length - 1;
            randomIndex = Math.round(Math.random() * length);
        // }
        let miniProgram = GameConfig.MiniProgram[randomIndex];
        let image = wx.createImage();
        image.src = miniProgram.icon;
        image.onload = () => {
            try {
                if(node == undefined){
                    return ;
                }
                node.active = true;
                let texture = new cc.Texture2D();
                texture.initWithElement(image);
                texture.handleLoadedTexture();
                texture.width = 90;
                texture.height = 90;
                if(node.getComponent(cc.Sprite) != undefined){
                    node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                }
                // cc.loader.load(miniProgram.path, (err, tex) => {
                //     if (!err) {
                //         node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
                //     }
                // });
                GameConfig.APPID = miniProgram.appId;
                GameConfig.PATH = miniProgram.path;
            } catch (e) {
                console.log(e);
            }
        };
    },
    //自家的appid
    initSelfMiniProgram: function (callback) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            //加载小程序导航
            wx.request({
                url: 'https://damingchao.oss-cn-shenzhen.aliyuncs.com/navigate.json',
                success: function (res) {
                    let obj = res.data;
                    // GameConfig.ownIndex = obj.length;
                    for (let i = 0; i < obj.length; i++) {
                        let data = obj[i];
                        if (data.QrCodeUrl == undefined) {
                            GameConfig.selfBoxApps.push({
                                icon: data.avatarUrl,
                                appId: data.appId,
                                path: data.path
                            });
                        } else {
                            GameConfig.selfBoxApps.push({
                                icon: data.avatarUrl,
                                appId: null,
                                path: data.QrCodeUrl
                            });
                        }
                    }
                    callback && callback(true);
                },
                fail: function () {
                    callback && callback(false);
                    console.log('获取navigate资源失败');
                }
            });
        }
    },
    //获取跳转的信息
    initEQMiniProgram: function (userInfo, callback){
        // if (userInfo == null) {
        //     callback(false);
        //     return;
        // }
        let launchOption = wx.getLaunchOptionsSync();
        EQ.setuserinfo(userInfo,launchOption);
        EQ.Enable();
        // let can = EQ.more();
        // if (can) {
            let config = EQ.getconfig();
            let recommender = config.data.recommender;
            if (recommender != undefined) {
                for (let i = 0; i < recommender.length; i++) {
                    let ad = recommender[i];
                    if (ad.type == 'wxapp') {
                        GameConfig.MiniProgram.push({
                            icon: ad.icon[0],
                            appId: ad.appId,
                            path: ad.path,
                            name: ad.name
                        });
                    }
                    if (ad.type == 'img') {
                        GameConfig.MiniProgram.push({
                            icon: ad.icon[0],
                            appId: null,
                            path: ad.path,
                            name: ad.name
                        });
                    }
                }
                console.log("可以",GameConfig.MiniProgram)
                // callback && callback(true);
            // }else{
            //     this.initEQMiniProgram();
            }
            //解析盒子数据
            let box = config.data.box;
            if(box != undefined && GameConfig.boxApps.length == 0){
                if(box.title != undefined){
                    GameConfig.boxTitle = box.title;
                }
                for (let i = 0; i < box.apps.length; i++) {
                    let ad = box.apps[i];
                    // console.log(ad);
                    if (ad.type == 'wxapp') {
                        GameConfig.boxApps.push({
                            icon: ad.icon[0],
                            appId: ad.appId,
                            path: ad.path,
                            name: ad.name
                        });
                    }else if (ad.type == 'img') {
                        GameConfig.boxApps.push({
                            icon: ad.icon[0],
                            appId: null,
                            path: ad.path,
                            name: ad.name
                        });
                    }
                }
                
            }
            callback && callback(true);
        // } else {
        //     callback && callback(false);
        // } 
    },

    getUserInfo() {//获取用户信息
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.getSetting({
                success(res) {
                    if (res.authSetting['scope.userInfo']) {//是否授权用户信息
                        wx.getUserInfo({
                            success: function (res) {
                                let userInfo = res.userInfo;
                                GameConfig.UserInfo.nickName = userInfo.nickName;
                                GameConfig.UserInfo.avatarUrl = userInfo.avatarUrl;
                                GameConfig.UserInfo = userInfo;
                            }
                        });
                    } else {
                        wx.authorize({
                            scope: 'scope.userInfo',
                            success() {
                                wx.getUserInfo({
                                    success: function (res) {
                                        let userInfo = res.userInfo;
                                        GameConfig.UserInfo.nickName = userInfo.nickName;
                                        GameConfig.UserInfo.avatarUrl = userInfo.avatarUrl;
                                        GameConfig.UserInfo = userInfo;
                                    }
                                });
                            },
                            fail() {
                                GameTools.toastMessage(1);
                            }
                        })
                    }
                }
            });
        } else {
            GameConfig.UserInfo.nickName = GameConfig.playerName[Math.floor(Math.random() * 107)] + Math.floor(Math.random() * 107);
        }
    },

    // saveImageToPhotosAlbum() { //保存图片进相册
    //     if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    //         wx.getSetting({
    //             success(res) {
    //                 if (res.authSetting['scope.writePhotosAlbum']) {
    //                     let tempFilePath = canvas.toTempFilePathSync({});
    //                     wx.saveImageToPhotosAlbum({
    //                         filePath: tempFilePath,
    //                         success() {
    //                             GameTools.toastMessage(14);
    //                         }
    //                     });
    //                 } else {
    //                     wx.authorize({
    //                         scope: 'scope.writePhotosAlbum',
    //                         success() {
    //                             // 用户已经同意小程序使用保存图片到相册，后续调用保存图片到相册接口不会弹窗询问
    //                             let tempFilePath = canvas.toTempFilePathSync({});
    //                             wx.saveImageToPhotosAlbum({
    //                                 filePath: tempFilePath,
    //                                 success() {
    //                                     GameTools.toastMessage(14);
    //                                 }
    //                             });
    //                         },
    //                         fail() {
    //                             GameTools.toastMessage(1);
    //                         }
    //                     })
    //                 }
    //             }
    //         });
    //     } else {
    //         GameTools.toastMessage(0);
    //     }
    // },
    // commentGame() { //评论
    //     window.wx.openCustomerServiceConversation({});
    // },
    getRankData(shareTicket) { //获取排行榜
        cc.loader.loadRes("panel/RankingListView", (err, prefab) => {
            if (!err) {
                var node = cc.instantiate(prefab);
                if (shareTicket != undefined) {
                    node.getComponent(cc.Component).shareTicket = shareTicket;
                }
                cc.director.getScene().children[0].addChild(node);
            }
        });
    },
    removeRankData() {//移除排行榜数据
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            window.wx.postMessage({
                messageType: 0,
            });
        } else {
            cc.log("移除排行榜数据。");
        }
    },
    submitScore(score) { //提交得分
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
                score: score,
                level: GameConfig.GamePersonMaxLevel,
            });
        }else if(cc.sys.platform === cc.sys.QQ_PLAY){
            var data = {
                userData: [{
                    openId: GameConfig.OPENID,
                    startMs: GameConfig.startMs + '', //必填，游戏开始时间，单位为毫秒，字符串类型
                    endMs: ((new Date()).getTime()).toString(), //必填，游戏结束时间，单位为毫秒，字符串类型
                    scoreInfo: {
                        score: score, //分数，类型必须是整型数
                        a1: GameConfig.GamePersonMaxLevel
                    }
                }, ],
                // type 描述附加属性的用途
                // order 排序的方式，
                // 1: 从大到小，即每次上报的分数都会与本周期的最高得分比较，如果大于最高得分则覆盖，否则忽略
                // 2: 从小到大，即每次上报的分数都会与本周期的最低得分比较，如果低于最低得分则覆盖，否则忽略
                // 3: 累积，即每次上报的积分都会累积到本周期已上报过的积分上（本质上是从大到小的一种特例）
                // 4: 直接覆盖，每次上报的积分都会将本周期的得分覆盖，不管大小
                // 如score字段对应，上个属性.
                attr: {
                    score: {
                        type: 'rank',
                        order: 1,
                    },
                    a1:{
                        type: 'rank',
                        order: 1,
                    }
                },
            };
            // gameMode: 游戏模式，如果没有模式区分，直接填 1
            // 必须配置好周期规则后，才能使用数据上报和排行榜功能
            BK.QQ.uploadScoreWithoutRoom(1, data, function (errCode, cmd, data) {
                // 返回错误码信息
                if (errCode !== 0) {
                    BK.Script.log(1, 1, '上传分数失败!错误码：' + errCode);
                }
            });
        } else {
            cc.log("提交得分:" + GameConfig.MAIN_MENU_NUM + " : " + score)
        }
    },
    //流量主
    _createVedioAd: function (callback) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            // wx.aldSendEvent('观看视频',{'key' : 'value'});
            let videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-680bdebeaab453de'
            });
            videoAd.load()
                .then(() => videoAd.show())
                .catch(function (err) {
                    console.log("视频加载失败",err);
                    wx.showModal({
                        title: '提示',
                        content: '视频加载失败',
                        showCancel: false
                    });
                });
            videoAd.onClose(function (res) {
                if(!videoAd){
                    return ;
                }
                if(res.isEnded){
                    // wx.aldSendEvent('完整观看视频',{'key' : 'value'});
                    callback(res);
                    videoAd.offClose();
                }else{
                    videoAd.offClose();
                }
            });
            videoAd.onError(function(msg){
                wx.showToast({
                    title: '错误'
                });
                console.log(msg);
            });
        }else if(cc.sys.platform === cc.sys.QQ_PLAY){
            var videoAd = BK.Advertisement.createVideoAd();
            videoAd.onLoad(function () {
                //加载成功
                BK.Script.log(1, 1, "onLoad")
            });

            videoAd.onPlayStart(function () {
                //开始播放
                BK.Script.log(1, 1, "onPlayStart")
            });

            videoAd.onPlayFinish(function () {
                //播放结束
                BK.Script.log(1, 1, "onPlayFinish");
                callback({isEnded : true});
            });

            videoAd.onError(function (err) {
                //加载失败
                BK.Script.log(1, 1, "onError code:" + err.code + " msg:" + err.msg);
            });

            videoAd.show();
        } else {
            callback({ raw: true });
        }
    },
    _createBannerAd: function () {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (this.bannerAd != undefined) {
                return ;
                // this.bannerAd.destroy();
            }
            this.bannerAd = wx.createBannerAd({
                adUnitId: 'adunit-59945d0fb14e9bca',
                style: {
                    left: 0,
                    top: 0,
                    width: 350
                }
            });
            let sysInfo = wx.getSystemInfoSync();
            this.bannerAd.style.width = sysInfo.screenWidth * 0.65;
            this.bannerAd.onResize(res => {
                this.bannerAd.style.left = (sysInfo.screenWidth - this.bannerAd.style.realWidth) / 2;
                this.bannerAd.style.top = sysInfo.screenHeight - this.bannerAd.style.realHeight;
            });
            this.bannerAd.onError(function (res) {
                console.log('广告位错误：' + res.errMsg + " : " + res.errCode);
            });
            this.bannerAd.show();
        }else if(cc.sys.platform === cc.sys.QQ_PLAY){
            var banner = BK.Advertisement.createBannerAd({
                viewId:1001,
              });
              banner.onLoad(function () {
                //广告加载成功
                console.log("广告加载成功，显示广告"+banner)
                // banner.show();
                // BK.Advertisement.BannerAd.show();
              });
              banner.onError(function (err) {
                //加载失败
                var msg = err.msg;
                var code = err.code;
                BK.Script.log("加载广告失败","onError code:"+code+" msg:"+msg);
              });
              banner.show();
        }
    },
    showBannerAd: function () {
        //先创建一个广告位
        this._createBannerAd();
    },
    closeBannerAd: function () {
        if (this.bannerAd != undefined) {
            // clearInterval(this.intervalID);
            this.bannerAd.destroy();
            this.bannerAd = undefined;
        }
    }
};

module.exports = GameTools;
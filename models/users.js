let mongoose=require('mongoose');
let {Head}=require('../untils/config');
mongoose.set('useCreateIndex',true);   //允许创建索引

//注册接口的数据库骨架
let userSchema=new mongoose.Schema({
    username:{type:String,required:true,index:{unique:true}},  //唯一的
    token:{type:String,default:''},   //token
    metaUserId:{type:String,index:{unique:true},default:""},   //metaUserId
    userSex:{type:String,default:'male'},  //性别
    email:{type:String,required:true,index:{unique:true}},  //唯一的
    date:{type:Date,default:Date.now()},
    isAdmin:{type:Boolean,default:false},
    isFreeze:{type:Boolean,default:false},   //用户冻结状态
    // uploadRobot:{type:String,default:new URL('default.jpg',Head.baseUrl)},   //上传的小助手图片
    uploadRobot:{type:String,default:""},   //上传的小助手图片
    uploadSelectItemBg:{type:String,default:''},  //上传的选择模块的背景图片
    uploadCinemaBg:{type:String,default:''}, //上传的观影的背景图片
    shopCart:{type:Array,default:[]},   //购物车信息
    isLogin:{type:Boolean,default:false}, //用户的登录状态
    address:{type:Array,default:[]},   //地址
    websiteTitle:{type:String,default:'metamovie'},  //网站标题
    personModel:{type:String,default:"personModel1"}, //人物形象模型
    selectItemSceneSetting:{type:Object,default:{
            ambientColor : "#ffffff",
            intensity : 1,
            bgNum : 1
        }},   //选择模块页面的场景设置
    aboutMineSceneSetting:{type:Object,default:{
            ambientColor : "#ffffff",
            intensity : 1
        }},   //个人信息页面的场景设置
    cinemaSceneSetting:{type:Object,default:{
            ambientColor : "#ffffff",
            intensity : 1,
            bgNum : 1
        }},   //观影页面的场景设置
    watchRecord:{type:Array,default:[]},  //用户观看记录
    interestedMovie:{type:Array,default:[]},  //用户感兴趣的电影
    miningRecord:{type:Array,default:[]},  //挖矿记录
    consumeRecord:{type:Array,default:[]},   //消费记录
    purchaseMovie:{type:Array,default:[]},  //已购买的电影
    wallet:{type:Object,default:{
            iconNum:0,
            address:''
        }},   //钱包
    settingObj:{type:Object,default:{
            menuNav:[
                "正在热映",
                "电影分类",
                "电影推荐",
                // "情怀电影",
                "关于本站",
                "个人信息",
                "全部电影",
                "电影搜索",
                "电影竞价区"
            ],
            movieTypeNav:[
                "爱情",
                "喜剧",
                "动画",
                "剧情",
                "恐怖",
                "惊悚",
                "科幻",
                "动作",
                "悬疑",
                "犯罪",
                "冒险",
                "战争",
                "家庭",
                "古装",
                "武侠",
                "历史",
                "灾难",
                "都市"
            ],
            userNav:[
                "username",
                "sex",
                "registerDay",
                "metaIconNum",
                "consumeRecord",
                "watchRecord"
            ],
            movieSortMethod:'byScore',
            movieSortOrder: "order1",
            movieMsgShowDate: [Date.now()- 3600 * 1000 * 24 * 7, Date.now()],
            movieLoadingMethod:'分页加载模式',
            onePageNum:16,
            onePageCommentNum : 6,
            onePageWatchRecordNum:8,
            recommendMethod:"基于用户信息过滤",
            robotStyle:'style1',
            themeColor:'rgba(0, 0, 0, 1)',
            fontColor:'rgba(255,255,255,1)'
        }}
})

//注册接口的数据库模型
let userModel=mongoose.model('user',userSchema);
userModel.createIndexes();  //使得索引唯一值生效

//数据保存的方法
let save=(data)=>{
    // console.log(data);
    let user=new userModel(data);
    return user.save().then(()=>{
        return true
    }).catch(()=>{
        return false
    })
}

//数据查找的方法
let findLogin=(data)=>{
    return userModel.findOne(data);
}


//根据id查找到对应用户
let findUserMsgById=(id)=>{
    return userModel.find({"_id":id})
}


//根据id查找到对应用户
let findUserByName=(username)=>{
    return userModel.find({username})
}


//返回所有用户数据的方法
let userList=()=>{
    return userModel.find();
}

//更新账号的冻结状态
let updateFreeze=(email,isFreeze)=>{
    return userModel.updateOne({email},{$set:{isFreeze}}).then(()=>{
      return true
    }).catch(()=>{
        return false
    })
}

//更新metaUserId
let updateMetaUserId=(email,metaUserId)=>{
    return userModel.updateOne({email},{$set:{metaUserId}}).then(()=>{
        return true
    }).catch(()=>{
        return false
    })
}


//更新钱包
let updateWallet=(metaUserId,wallet)=>{
    return userModel.updateOne({metaUserId},{$set:{wallet}}).then(()=>{
        return true
    }).catch(()=>{
        return false
    })
}


//删除用户账号
let deleteUser=(email)=>{
    return userModel.deleteOne({email})
}

//更新小助手图片
let updateRobot=(metaUserId,uploadRobot)=>{
    return userModel.updateOne({metaUserId},{$set:{uploadRobot}}).then(()=>{
        return true
    }).catch(()=>{
        return false
    })
}

//更新小助手图片路径为空
let updateRobotToNone=(metaUserId)=>{
    return userModel.updateOne({metaUserId},{$set:{uploadRobot:''}}).then(()=>{
        return true
    }).catch(()=>{
        return false
    })
}


//更新选择模块的背景图片
let uploadSelectItemBg=(metaUserId,uploadSelectItemBg)=>{
    return userModel.updateOne({metaUserId},{$set:{uploadSelectItemBg}}).then(()=>{
        return true
    }).catch(()=>{
        return false
    })
}


//更新观影的背景图片
let uploadCinemaBg=(metaUserId,uploadCinemaBg)=>{
    return userModel.updateOne({metaUserId},{$set:{uploadCinemaBg}}).then(()=>{
        return true
    }).catch(()=>{
        return false
    })
}



//搜索用户信息
let searchUsersList=(searchVal)=>{
    return userModel.find({username:{ $regex: new RegExp(searchVal), $options: 'i'}});
}


//更新用户个性化设置信息
let updateSetting=(metaUserId,settingObj)=>{
    return userModel.updateOne({
        metaUserId
    }, {
        $set: {
            settingObj
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//用户数据查找的方法
let findUser = (data) => {
    return userModel.find(data)
}


//更新用户登录状态的方法
let updateLoginStatus=(metaUserId,loginStatus)=>{
    return userModel.updateOne({
        metaUserId
    }, {
        $set: {
            isLogin:loginStatus
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//更新地址信息
let updateAddress=(username,address)=>{
    return userModel.updateOne({
        username
    }, {
        $set: {
            address:address
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//metaUserId查找的方法
let findMetaUserId=(metaUserId)=>{
    return userModel.findOne({metaUserId});
}



//用户信息查找的方法
let findUserIsExits=(username,metaUserId)=>{
    return userModel.findOne({username,metaUserId});
}


//更新用户感兴趣的电影类型信息的方法
let updateUserInterestedType=(metaUserId,hobbiesMovieType)=>{
    return userModel.updateOne({
        metaUserId
    }, {
        $set: {
            hobbiesMovieType:hobbiesMovieType
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//更新用户的人物形象
let updateUserPersonModel=(metaUserId,personModel)=>{
    return userModel.updateOne({
        metaUserId
    }, {
        $set: {
            personModel
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//更新用户昵称
let updateUserName=(metaUserId,username)=>{
    return userModel.updateOne({
        metaUserId
    }, {
        $set: {
            username
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//更新用户性别
let updateUserSex=(metaUserId,userSex)=>{
    return userModel.updateOne({
        metaUserId
    }, {
        $set: {
            userSex
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//更新网站标题
let updateWebsiteTitle=(metaUserId,websiteTitle)=>{
    return userModel.updateOne({
        metaUserId
    }, {
        $set: {
            websiteTitle
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//更新选择模块页面的场景设置
let updateSelectItemSceneSetting=(metaUserId,selectItemSceneSetting)=>{
    return userModel.updateOne({
        metaUserId
    }, {
        $set: {
            selectItemSceneSetting
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//更新个人信息页面的场景设置
let updateAboutMineSceneSetting=(metaUserId,aboutMineSceneSetting)=>{
    return userModel.updateOne({
        metaUserId
    }, {
        $set: {
            aboutMineSceneSetting
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//更新观影页面的场景设置
let updateCinemaSceneSetting=(metaUserId,cinemaSceneSetting)=>{
    return userModel.updateOne({
        metaUserId
    }, {
        $set: {
            cinemaSceneSetting
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}



//更新用户的观看记录的方法
let updateWatchRecord=(metaUserId,watchRecord)=>{
    return userModel.updateOne({
        metaUserId
    }, {
        $set: {
            watchRecord
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//更新用户感兴趣的电影的方法
let updateInterestedMovie=(metaUserId,interestedMovie)=>{
    return userModel.updateOne({
        metaUserId
    }, {
        $set: {
            interestedMovie
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//显示所有的用户电影倒排表（用户对应的观影记录/感兴趣的电影）
let showAllUserMovies=()=>{
    return userModel.find({},{metaUserId:1,watchRecord:1,interestedMovie:1},(err,res)=>{
        // console.log(res);
        return res
    })
}



//更新用户挖矿记录的方法
let updateMiningRecord=(metaUserId,miningRecord)=>{
    return userModel.updateOne({
        metaUserId
    }, {
        $set: {
            miningRecord
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}



//更新用户消费记录的方法
let updateConsumeRecord=(metaUserId,consumeRecord)=>{
    return userModel.updateOne({
        metaUserId
    }, {
        $set: {
            consumeRecord
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}




module.exports={
    save,
    findLogin,
    userList,
    updateFreeze,
    deleteUser,
    updateRobot,
    searchUsersList,
    updateSetting,
    findUser,
    findUserByName,
    updateLoginStatus,
    updateAddress,
    updateMetaUserId,
    findMetaUserId,
    findUserIsExits,
    updateUserInterestedType,
    updateRobotToNone,
    updateUserPersonModel,
    updateUserName,
    updateUserSex,
    updateWebsiteTitle,
    updateSelectItemSceneSetting,
    updateAboutMineSceneSetting,
    updateCinemaSceneSetting,
    uploadSelectItemBg,
    uploadCinemaBg,
    updateWatchRecord,
    updateInterestedMovie,
    showAllUserMovies,
    updateWallet,
    updateMiningRecord,
    updateConsumeRecord,
    findUserMsgById
}
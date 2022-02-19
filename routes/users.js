var express = require('express');
var usersController=require('../controllers/users');   //引入控制器
var router = express.Router();

//引入multer(上传)模块
var multer  = require('multer');
var upload = multer({ dest: 'public/images/users' });   //小助手图片上传的指定路径

var uploadBg = multer({ dest: 'public/images/bg' });   //背景图片上传的指定路径

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//配置各接口的路由

//登录接口的路由
router.post('/login',usersController.login);

//注册接口的路由
router.post('/register',usersController.register);

//验证接口的路由
router.get('/verify',usersController.verify);

//登出接口的路由
router.get('/logout',usersController.logout);

//获取用户信息接口的路由
router.get('/getUser',usersController.getUser);

//生成图形验证码接口的路由
router.get('/verifyImg',usersController.verifyImg);

//上传小助手图片文件接口的路由
router.post('/uploadRobot',upload.single('file'),usersController.uploadRobot);


//搜索用户信息的路由
router.get('/searchUser',usersController.searchUser)

//更新用户购物车信息的路由
router.post('/updateShopCart',usersController.updateShopCart)


//获取对应用户的信息
router.get('/findUserMsg',usersController.findUser)


//根据用户名获取对应用户的信息
router.get('/findUserMsgByName',usersController.findUserMsgByName)


//更新用户的登录状态
router.post('/updateLoginStatus',usersController.updateLoginStatus)


//更新用户的收货地址
router.post('/updateAddress',usersController.updateAddress)


//更新用户的metaUserId
router.post('/saveMetaUserId',usersController.saveMetaUserId)

//用户的metaUserId是否存在
router.post('/isExitMetaUserId',usersController.isExitMetaUserId)


//更新用户的钱包
router.post('/updateWallet',usersController.updateWallet)


//更新用户的个性化设置
router.post('/updateSetting',usersController.updateSetting)


//保存网站留言数据
router.post('/saveLeaveMsg',usersController.saveLeaveMsg)


//获取所有网站留言数据
router.get('/getLeaveMsgList',usersController.getLeaveMsgList)

//验证用户身份是否存在
router.post('/isExistsUser',usersController.isExistsUser);


//更新用户感兴趣的电影类型信息
router.post('/updateUserInterestedType',usersController.updateUserInterestedType)


//更新小助手图片为空的路由
router.get('/uploadRobotToNone',usersController.uploadRobotToNone);

//更新人物形象的路由
router.post('/updateUserPersonModel',usersController.updateUserPersonModel);

//更新用户昵称的路由
router.post('/updateUserName',usersController.updateUserName);

//更新用户性别的路由
router.post('/updateUserSex',usersController.updateUserSex);


//更新网站标题的路由
router.post('/updateWebsiteTitle',usersController.updateWebsiteTitle);


//搜索讨论内容的路由
router.get('/searchDiscuss',usersController.searchDiscuss)


//更新选择模块页面的场景设置的路由
router.post('/updateSelectItemSceneSetting',usersController.updateSelectItemSceneSetting);

//更新个人信息页面的场景设置的路由
router.post('/updateAboutMineSceneSetting',usersController.updateAboutMineSceneSetting);

//更新观影页面的场景设置的路由
router.post('/updateCinemaSceneSetting',usersController.updateCinemaSceneSetting);



//上传选择模块背景图片文件接口的路由
router.post('/uploadSelectItemBg',uploadBg.single('file'),usersController.uploadSelectItemBg);


//上传观影背景图片文件接口的路由
router.post('/uploadCinemaBg',uploadBg.single('file'),usersController.uploadCinemaBg);



//更新用户的观看记录的路由
router.post('/updateWatchRecord',usersController.updateWatchRecord);


//更新用户感兴趣的电影的路由
router.post('/updateInterestedMovie',usersController.updateInterestedMovie);


//显示所有的用户电影倒排表的路由
router.post('/getRecommendMovieList',usersController.getRecommendMovieList);


//更新用户挖矿记录的路由
router.post('/updateMiningRecord',usersController.updateMiningRecord);


//更新钱包的icon数量的路由
router.post('/updateIconNum',usersController.updateIconNum);


//更新用户消费记录的路由
router.post('/updateConsumeRecord',usersController.updateConsumeRecord);

//校验token
router.get('/checkToken',usersController.checkToken)


module.exports = router;

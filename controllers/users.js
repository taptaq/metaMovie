let {Email,Head,bg}=require('../untils/config');
let userModel=require('../models/users');
let movieModel = require('../models/movies');
let leaveMsgModel=require('../models/disscuss');
let {createVerifyImg,setCrypto}=require('../untils/base');
let {
    RecommendUserService,
    RecommendGoodsService,
}= require("../public/JS/recommendMethods/index");
let fs=require('fs');

let v = require('voca');  //处理字符串

const jwt = require('jsonwebtoken');

const SECRET = 'metaMovieMovieMeta';  //秘钥


//登录接口的方法
var login=async(req,res,next)=>{
    var {username,metaUserId,verifyImg,token,loginLongTime}=req.body;  //login为post请求
    // console.log(username,metaUserId,verifyImg);
    if(verifyImg!==req.session.verifyImg){
        res.send({
            msg:'验证码输入不正确',
            status:-3
        })
        return;
    }
    var result=await userModel.findLogin({
        username,
        metaUserId
    })
    // console.log(result);
    if(result){
        req.session.username=username;
        req.session.metaUserId=metaUserId;

        // console.log(req.session);

        if(result.isFreeze){
            res.send({
                msg:'账号已冻结',
                status:-2
            })
        }
        else{
            if ( !token ) {
                let token = jwt.sign({
                    id:String(result._id)
                },SECRET,{
                    expiresIn: 60 * 60 * Number(loginLongTime)  //规定几小时过期
                })

                // console.log(token,'token')
                res.send({
                    msg:'登录成功',
                    status:0,
                    token
                })
            }
            else{
                res.send({
                    msg:'登录成功',
                    status:0
                })
            }
        }
    }
    else{
        res.send({
            msg:'登录失败',
            status:-1
        })
    }
}


//校验token
let checkToken=async (req,res,next)=>{
    const raw = String(req.headers['authorization']);
    // 验证
    if(raw){
        jwt.verify(raw,SECRET,async (err,decoded)=>{
            if(err){
                // console.log(err);
                res.send({
                    msg:'登录认证已过期',
                    status:401
                })
                return;
            }
            // console.log(decoded);
            let userMsg = await userModel.findUserMsgById(decoded['id']);
            if(userMsg){
                res.send({
                    msg:'校验成功',
                    status:0,
                    userMsg
                })
            }else{
                res.send({
                    msg:'校验失败',
                    status:-1
                })
            }
        });
    }else{
        return res.status(403).send({
            msg:'没有提供token'
        })
    }


}

//注册接口的方法
var register=async(req,res,next)=>{
    var {username,email,verify,userSex,personModel}=req.body;  //register为post请求
        // console.log(username,email,verify,userSex,personModel);
    //判断传进来的邮箱或者验证码是否与session中存放的相等
    if(email!==req.session.email || verify!==req.session.verify){
        res.send({
            session:req.session,
            msg:'验证码错误',
            status:-1
        })
        return;
    }

    //验证码时间大于1分钟
    if((Email.time-req.session.time)/1000 >60){
        res.send({
            msg:'验证码已过期',
            status:-3
        })
        return;
    }

    var result=await userModel.save({
        username,
        email,
        userSex,
        personModel
    });

    if(result){
        res.send({
            msg:'注册成功',
            status:0
        })
    }
    else{
        res.send({
            msg:'注册失败',
            status:-2
        })
    }
}

//登出接口的方法
var logout=async(req,res,next)=>{
    req.session.username='';
    res.send({
        msg:'退出成功',
        status:0
    })
}

//验证接口的方法
var verify=async(req,res,next)=>{
    var email=req.query.email;  //接收传过来的接收方邮箱的参数
    var verify=Email.verify;   //定义一个变量保存接收的验证码
    req.session.verify=verify;   //把验证码存入session中
    req.session.email=email;  //把邮箱号存入session中(邮箱要和验证码相对应)
    req.session.time=Email.time;  //把发送验证码的当前时间存入session中

    var mailOptions={
        from: 'METAMOVIE 2902716634@qq.com', // sender address
        to: email, // list of receivers
        subject: "METAMOVIE给你发邮箱验证码啦!!!", // Subject line
        text: "验证码"+verify, // plain text body
    };
    var info = await Email.transporter.sendMail(mailOptions,(err)=>{
        if(!err){
            res.send({
                msg:'验证码发送成功',
                status:0
            })
        }
        else{
            res.send({
                msg:'验证码发送失败',
                status:-1
            })
        }
    });
}

//获取用户信息接口的方法
var getUser=async(req,res,next)=>{
    if(req.session.username){
        res.send({
            msg:'获取用户信息成功',
            status:0,
            data: {   //获取用户登录的数据(把其显示到前端页面)
                username:req.session.username,
                metaUserId:req.session.metaUserId
            }
        })
    }
    else{
        res.send({
            msg:'获取用户信息失败',
            status:-1
        })
    }
}

//生成图形验证码的方法
var verifyImg=async (req,res,next)=>{
    var result=await createVerifyImg(req,res);
    if(result){
        res.send(result);
    }
}

//更新小助手图片
var uploadRobot=async (req,res,next)=>{
    // console.log(req.file.filename);
   // 文件重命名成带有对应用户名的文件
   await fs.rename('public/images/users/'+req.file.filename,'public/images/users/'+req.session.username+'.jpg',(err) => {
       if (err) throw err;
       console.log('重命名完成');
   });

   var result=await userModel.updateRobot(req.session.metaUserId,new URL(req.session.username+'.jpg',Head.baseUrl));
   if(result){
       res.send({
           msg:'小助手图片上传成功',
           status:0,
           data:{
               robotImg:new URL(req.session.username+'.jpg',Head.baseUrl)
           }
       })
   }
   else{
       res.send({
           msg:'小助手图片上传失败',
           status:-1
       })
   }
}

//更新小助手图片为空
let uploadRobotToNone=async (req,res,next)=>{
    var result=await userModel.updateRobotToNone(req.session.metaUserId);
    if(result){
        res.send({
            msg:'设置小助手图片路径为空成功',
            status:0,
        })
    }
    else{
        res.send({
            msg:'设置小助手图片路径为空失败',
            status:-1
        })
    }
}


//更新选择模块的背景图片
let uploadSelectItemBg=async (req,res,next)=>{
    // let randomNum=Math.random().toFixed(2);
    // console.log(req.file.filename);
    // 文件重命名成带有对应用户名的文件
    await fs.rename('public/images/bg/'+req.file.filename,'public/images/bg/'+req.session.username+'selectItemBg.jpg',(err) => {
        if (err) throw err;
        console.log('重命名完成');
    });

    var result=await userModel.uploadSelectItemBg(req.session.metaUserId,new URL(req.session.username+'selectItemBg.jpg',bg.baseUrl));
    if(result){
        res.send({
            msg:'选择模块的背景图片上传成功',
            status:0,
            data:{
                selectItemBgImg:new URL(req.session.username+'selectItemBg.jpg',bg.baseUrl)
            }
        })
    }
    else{
        res.send({
            msg:'选择模块的背景图片上传失败',
            status:-1
        })
    }
}


//更新观影的背景图片
let uploadCinemaBg=async (req,res,next)=>{
    // let randomNum=Math.random().toFixed(2);
    // console.log(req.file.filename);
    // 文件重命名成带有对应用户名的文件
    await fs.rename('public/images/bg/'+req.file.filename,'public/images/bg/'+req.session.username+'cinemaBg.jpg',(err) => {
        if (err) throw err;
        console.log('重命名完成');
    });

    var result=await userModel.uploadCinemaBg(req.session.metaUserId,new URL(req.session.username+'cinemaBg.jpg',bg.baseUrl));
    if(result){
        res.send({
            msg:'观影的背景图片上传成功',
            status:0,
            data:{
                cinemaBgImg:new URL(req.session.username+'cinemaBg.jpg',bg.baseUrl)
            }
        })
    }
    else{
        res.send({
            msg:'观影的背景图片上传失败',
            status:-1
        })
    }
}



//搜索用户信息
let searchUser=async(req,res,next)=>{
    let {key}=req.query;
    let result=await userModel.searchUsersList(key);
    // console.log(result);
    if(result.length){
        res.send({
            msg:'获取用户搜索内容成功',
            status:0,
            data:result
        })
    }else{
        res.send({
            msg:'获取用户搜索内容失败',
            status:-1
        })
    }
}


//更新用户购物车信息
let updateShopCart=async(req,res,next)=>{
    let {username,newShopCart}=req.body;
    console.log(newShopCart);
    if (username) {
        let msg = await userModel.updateShopCart(username,newShopCart);
        if(msg){
            res.send({
                msg: '更新用户购物车信息成功',
                status:0
            })
        }else{
            res.send({
                msg: '更新用户购物车信息失败',
                status:-1
            })
        }
    }else{
        res.send({
            msg: '更新用户购物车信息失败',
            status:-2
        })
    }

}


// 获取对应用户的信息
let findUser=async(req,res,next)=>{
    let url = new URL(req.url, 'http://localhost:8895');
    let query = new URLSearchParams(url.search)
    let metaUserId = query.get('metaUserId')
    if (metaUserId) {
        let msg = await userModel.findUser({
            "metaUserId": metaUserId
        });
        if(msg.length>0){
            res.send({
                msg: '获取用户信息成功',
                status: 0,
                data: {
                    detailMsg: msg
                }
            })
        }
        else{
            res.send({
                msg: '获取用户信息失败',
                status: -1
            })
        }
    } else {
        res.send({
            msg: '获取用户信息失败',
            status: -1
        })
    }
}


// 根据用户名获取对应用户的信息
let findUserMsgByName=async(req,res,next)=>{
    let url = new URL(req.url, 'http://localhost:8895');
    let query = new URLSearchParams(url.search)
    let username = query.get('username')
    if (username) {
        let msg = await userModel.findUserByName(username);
        if(msg.length>0){
            res.send({
                msg: '获取用户信息成功',
                status: 0,
                data: {
                    detailMsg: msg
                }
            })
        }
        else{
            res.send({
                msg: '获取用户信息失败',
                status: -1
            })
        }
    } else {
        res.send({
            msg: '获取用户信息失败',
            status: -1
        })
    }
}


// 更新用户的登录状态
let updateLoginStatus=async(req,res,next)=>{
    let {metaUserId,loginStatus}=req.body;
    // console.log(username,loginStatus);
    let result = await userModel.updateLoginStatus(metaUserId,loginStatus);
    if(result){
        res.send({
            msg: '更新用户登录状态成功',
            status:0
        })
    }else{
        res.send({
            msg: '更新用户登录状态失败',
            status:-1
        })
    }
}


// 更新用户的个性化设置
let updateSetting=async(req,res,next)=>{
    let {metaUserId,settingObj}=req.body;
    // console.log(settingObj);
    let result = await userModel.updateSetting(metaUserId,settingObj);
    if(result){
        res.send({
            msg: '更新用户个性化设置成功',
            status:0
        })
    }else{
        res.send({
            msg: '更新用户个性化设置失败',
            status:-1
        })
    }
}


// 更新用户的地址
let updateAddress=async(req,res,next)=>{
    let {username,address}=req.body;
    // console.log(username,address);
    let result = await userModel.updateAddress(username,address);
    if(result){
        res.send({
            msg: '更新用户收货地址成功',
            status:0
        })
    }else{
        res.send({
            msg: '更新用户收货地址失败',
            status:-1
        })
    }
}


//保存metaUserId
let saveMetaUserId=async(req,res,next)=>{
    let {email,metaUserId}=req.body;
    let result = await userModel.updateMetaUserId(email,metaUserId);
    if(result){
        res.send({
            msg: '更新metaUserId成功',
            status:0
        })
    }else{
        res.send({
            msg: '更新metaUserId失败',
            status:-1
        })
    }
}


//更新钱包
let updateWallet=async(req,res,next)=>{
    let {metaUserId,wallet}=req.body;
    let result = await userModel.updateWallet(metaUserId,wallet);
    if(result){
        res.send({
            msg: '更新钱包成功',
            status:0
        })
    }else{
        res.send({
            msg: '更新钱包失败',
            status:-1
        })
    }
}



//更新钱包的icon数量
let updateIconNum=async(req,res,next)=>{
    let {metaUserId,iconNum,type}=req.body;
    let msg = await userModel.findUser({
        "metaUserId": metaUserId
    });
    let wallet=msg[0].wallet;
    wallet.iconNum=Number(wallet.iconNum);
    if(type==='add'){
        wallet.iconNum=wallet.iconNum+iconNum;
    } else if(type==='sub'){
        wallet.iconNum=wallet.iconNum-iconNum;
    }


    let result = await userModel.updateWallet(metaUserId,wallet);
    if(result){
        res.send({
            msg: '更新icon数量成功',
            status:0
        })
    }else{
        res.send({
            msg: '更新icon数量失败',
            status:-1
        })
    }
}



//判断对应的metaUserId是否存在
let isExitMetaUserId=async (req,res,next)=>{
    let {metaUserId}=req.body;
    let result=await userModel.findMetaUserId(metaUserId);
    if(result){
        res.send({
            msg: 'metaUserId存在',
            status:0
        })
    }else {
        res.send({
            msg: 'metaUserId不存在',
            status: -1
        })
    }
}



//保存留言数据的方法
let saveLeaveMsg=async(req,res,next)=> {
    let {username,msgContent}=req.body;
    msgContent=v.escapeHtml(msgContent);  //转义字符串，防止html注入

    let result=await leaveMsgModel.saveLeaveMsg({name:username,msgContent});
    if(result){
        res.send({
            msg: '保存留言数据成功',
            status:0
        })
    }else {
        res.send({
            msg: '保存留言数据失败',
            status: -1
        })
    }
    console.log(username,msgContent)
}


//显示所有留言数据的操作
let getLeaveMsgList=async (req,res,next)=>{
    let result=await leaveMsgModel.LeaveMsgList();
    if(result){
        res.send({
            msg:'所有留言数据获取成功',
            status:0,
            data:{
                leaveMsgList:result
            }
        })
    }
    else{
        res.send({
            msg:'所有留言数据获取失败',
            status:-1
        })
    }
}


// 验证对应用户是否存在
let isExistsUser=async(req,res,next)=>{
   let {username,metaUserId}=req.body;
   console.log(username,metaUserId);
    if (username && metaUserId) {
        let userMsg = await userModel.findUserIsExits(
            username,
            metaUserId
        );
        if(userMsg){
            res.send({
                msg: '验证用户信息存在成功',
                status: 0,
                data: {
                    userMsg: userMsg
                }
            })
        }
        else{
            res.send({
                msg: '验证用户信息存在失败',
                status: -1
            })
        }
    } else {
        res.send({
            msg: '验证用户信息存在失败',
            status: -1
        })
    }
}



// 更新用户感兴趣的电影类型信息
let updateUserInterestedType=async(req,res,next)=>{
    let {metaUserId,hobbiesMovieType}=req.body;
    // console.log(username,loginStatus);
    let result = await userModel.updateUserInterestedType(metaUserId,hobbiesMovieType);
    if(result){
        res.send({
            msg: '更新用户感兴趣的电影类型信息成功',
            status:0
        })
    }else{
        res.send({
            msg: '更新用户感兴趣的电影类型信息失败',
            status:-1
        })
    }
}


// 更新用户人物形象信息
let updateUserPersonModel=async(req,res,next)=>{
    let {metaUserId,personModel}=req.body;
    // console.log(username,loginStatus);
    let result = await userModel.updateUserPersonModel(metaUserId,personModel);
    if(result){
        res.send({
            msg: '更新用户人物形象成功',
            status:0
        })
    }else{
        res.send({
            msg: '更新用户人物形象失败',
            status:-1
        })
    }
}


// 更新用户昵称
let updateUserName=async(req,res,next)=>{
    let {metaUserId,username}=req.body;
    // console.log(username,loginStatus);
    let result = await userModel.updateUserName(metaUserId,username);
    if(result){
        res.send({
            msg: '更新用户昵称成功',
            status:0
        })
    }else{
        res.send({
            msg: '更新用户昵称失败',
            status:-1
        })
    }
}

// 更新用户性别
let updateUserSex=async(req,res,next)=>{
    let {metaUserId,userSex}=req.body;
    // console.log(username,loginStatus);
    let result = await userModel.updateUserSex(metaUserId,userSex);
    if(result){
        res.send({
            msg: '更新用户性别成功',
            status:0
        })
    }else{
        res.send({
            msg: '更新用户性别失败',
            status:-1
        })
    }
}


// 更新网站标题
let updateWebsiteTitle=async(req,res,next)=>{
    let {metaUserId,websiteTitle}=req.body;
    // console.log(username,loginStatus);
    let result = await userModel.updateWebsiteTitle(metaUserId,websiteTitle);
    if(result){
        res.send({
            msg: '更新网站标题成功',
            status:0
        })
    }else{
        res.send({
            msg: '更新网站标题失败',
            status:-1
        })
    }
}



//搜索对应的讨论内容
let searchDiscuss=async(req,res,next)=>{
    let {key,byWay}=req.query;
    // console.log(key,byWay);
    let result=await leaveMsgModel.searchDiscuss(key,byWay);
    // console.log(result);
    if(result.length){
        res.send({
            msg:'获取对应搜索的讨论内容成功',
            status:0,
            data:result
        })
    }else{
        res.send({
            msg:'获取对应搜索的讨论内容失败',
            status:-1
        })
    }
}



//更新选择模块页面的场景设置
let updateSelectItemSceneSetting=async(req,res,next)=>{
    let {metaUserId,selectItemSceneSetting}=req.body;
    // console.log(username,loginStatus);
    let result = await userModel.updateSelectItemSceneSetting(metaUserId,selectItemSceneSetting);
    if(result){
        res.send({
            msg: '更新选择模块页面的场景设置成功',
            status:0
        })
    }else{
        res.send({
            msg: '更新选择模块页面的场景设置失败',
            status:-1
        })
    }
}

//更新个人信息页面的场景设置
let updateAboutMineSceneSetting=async(req,res,next)=>{
    let {metaUserId,aboutMineSceneSetting}=req.body;
    let result = await userModel.updateAboutMineSceneSetting(metaUserId,aboutMineSceneSetting);
    if(result){
        res.send({
            msg: '更新个人信息页面的场景设置成功',
            status:0
        })
    }else{
        res.send({
            msg: '更新个人信息页面的场景设置失败',
            status:-1
        })
    }
}


//更新观影页面的场景设置
let updateCinemaSceneSetting=async(req,res,next)=>{
    let {metaUserId,cinemaSceneSetting}=req.body;
    let result = await userModel.updateCinemaSceneSetting(metaUserId,cinemaSceneSetting);
    if(result){
        res.send({
            msg: '更新观影页面的场景设置成功',
            status:0
        })
    }else{
        res.send({
            msg: '更新观影页面的场景设置失败',
            status:-1
        })
    }
}



//更新用户的观看记录的方法
let updateWatchRecord=async(req,res,next)=>{
    let {metaUserId,watchRecordObj}=req.body;
    let userMsg = await userModel.findUser({
        "metaUserId": metaUserId
    });
    // console.log(userMsg[0])
    let oldWatchRecord=userMsg[0].watchRecord;
    let newWatchRecord=[...oldWatchRecord,watchRecordObj];
    // console.log(newWatchRecord);
    let result = await userModel.updateWatchRecord(metaUserId,newWatchRecord);
    if(result){
        res.send({
            msg: '更新用户的观看记录成功',
            status:0
        })
    }else{
        res.send({
            msg: '更新用户的观看记录失败',
            status:-1
        })
    }
}



//更新用户感兴趣的电影的方法
let updateInterestedMovie=async(req,res,next)=>{
    let {metaUserId,interestedMovie}=req.body;
    let userMsg = await userModel.findUser({
        "metaUserId": metaUserId
    });
    // console.log(userMsg[0])
    let oldInterestedMovie=userMsg[0].interestedMovie;
    let newInterestedMovie=[...oldInterestedMovie,interestedMovie];
    // console.log(newWatchRecord);
    let obj = {};
    let newInterestedMovieRes = [];
    for(let i =0; i<newInterestedMovie.length; i++){
        if(!obj[newInterestedMovie[i].movieId]){
            newInterestedMovieRes.push(newInterestedMovie[i]);
            obj[newInterestedMovie[i].movieId] = true;
        }
    }

    let result = await userModel.updateInterestedMovie(metaUserId,newInterestedMovieRes);
    if(result){
        res.send({
            msg: '更新用户感兴趣的电影成功',
            status:0
        })
    }else{
        res.send({
            msg: '更新用户感兴趣的电影失败',
            status:-1
        })
    }
}


//基于基于协同过滤的电影推荐信息
let getRecommendMovieList=async (req,res,next)=>{
    let {filterWay}=req.body;
    // console.log(filterWay)
    let userList=await userModel.showAllUserMovies();
    // console.log(userList);
    let allUserMovies=[];
    let allUserMoreMovieIdArr=[];

    for(let i=0;i<userList.length;i++){
        let item=userList[i];
        let movieIdArr=[];
        let temp={};
        let tempObj={};
        if(item.watchRecord.length){
            item.watchRecord.forEach(item=>{
                    if(tempObj[item.movieId]){
                        tempObj[item.movieId]++;
                    }else{
                        tempObj[item.movieId]=1;
                    }
            })
            item.watchRecord=item.watchRecord.reduce((item, cur)=> {
                if(!temp[cur.movieId]){
                    temp[cur.movieId] = true;
                    item.push(cur.movieId);
                    movieIdArr.push(cur.movieId);
                }
                return item
            }, [])
        }

        if(item.interestedMovie.length) {
            item.interestedMovie.forEach(item => {
                if(tempObj[item.movieId]){
                    tempObj[item.movieId]++;
                }else{
                    tempObj[item.movieId]=1;
                }
                movieIdArr.push(item.movieId);
            })
        }
        movieIdArr=[...new Set(movieIdArr)];

        // console.log(movieIdArr,'movieIdArr');
        if(JSON.stringify(tempObj)!=='{}'){
             let moreMovieId=Object.entries(tempObj).sort((a,b)=>{
                return b[1]-a[1]
            })[0][0];

            let moreMovieIdObj={};
            moreMovieIdObj.metaUserId=item.metaUserId;
            moreMovieIdObj.moreMovieId=moreMovieId;

            allUserMoreMovieIdArr.push(moreMovieIdObj);


            for(let j=0;j<movieIdArr.length;j++){
                let newObj={};
                newObj.metaUserId=item.metaUserId;
                newObj.movieId=movieIdArr[j];
                allUserMovies.push(newObj);
            }
        }
    }


    let movieList=[];
    let metaUserId=req.session.metaUserId;
    if(filterWay==='byUser'){
        const recommendUserService = new RecommendUserService(
            allUserMovies,
            metaUserId,
            10
        );
        const recommendMovieId = recommendUserService.start();
        for (let i = 0; i < recommendMovieId.length; i++) {
            let item = await movieModel.findMovie({
                "movieId": recommendMovieId[i]
            });
            movieList.push(item[0]);
        }
    }
    else if(filterWay==='byMovie'){
        allUserMoreMovieIdArr=allUserMoreMovieIdArr.filter(item=>{
            return item.metaUserId===metaUserId;
        })
        // console.log(allUserMoreMovieIdArr[0],'allUserMoreMovieIdArr');
        const recommendGoodsService = new RecommendGoodsService(
            allUserMovies,
            metaUserId,
            10,
            allUserMoreMovieIdArr[0].moreMovieId
        );
        const recommendMovieId = recommendGoodsService.start();
        for (let i = 0; i < recommendMovieId.length; i++) {
            let item = await movieModel.findMovie({
                "movieId": recommendMovieId[i]
            });
            movieList.push(item[0]);
        }
    }

    // console.log(movieList)


    if(movieList){
        res.send({
            msg: '推荐电影信息获取成功',
            status:0,
            movieList:movieList
        })
    }else{
        res.send({
            msg: '推荐电影信息获取失败',
            status:-1
        })
    }
}


//更新用户挖矿记录的方法
let updateMiningRecord=async(req,res,next)=>{
    let {metaUserId,miningRecord}=req.body;
    let userMsg = await userModel.findUser({
        "metaUserId": metaUserId
    });
    // console.log(userMsg[0])
    let oldMiningRecord=userMsg[0].miningRecord;
    let newMiningRecord=[...oldMiningRecord,miningRecord];
    // console.log(newWatchRecord);
    let result = await userModel.updateMiningRecord(metaUserId,newMiningRecord);
    if(result){
        res.send({
            msg: '更新用户挖矿记录成功',
            status:0
        })
    }else{
        res.send({
            msg: '更新用户挖矿记录失败',
            status:-1
        })
    }
}



//更新用户消费记录的方法
let updateConsumeRecord=async(req,res,next)=>{
    let {metaUserId,consumeRecord}=req.body;
    let userMsg = await userModel.findUser({
        "metaUserId": metaUserId
    });
    let oldConsumeRecord=userMsg[0].consumeRecord;
    let newConsumeRecord=[...oldConsumeRecord,consumeRecord];
    let result = await userModel.updateConsumeRecord(metaUserId,newConsumeRecord);
    if(result){
        res.send({
            msg: '更新用户消费记录成功',
            status:0
        })
    }else{
        res.send({
            msg: '更新用户消费记录失败',
            status:-1
        })
    }
}



module.exports={
    login,
    checkToken,
    register,
    logout,
    verify,
    getUser,
    verifyImg,
    uploadRobot,
    searchUser,
    updateShopCart,
    findUser,
    updateLoginStatus,
    updateAddress,
    saveMetaUserId,
    isExitMetaUserId,
    updateSetting,
    saveLeaveMsg,
    getLeaveMsgList,
    isExistsUser,
    updateUserInterestedType,
    uploadRobotToNone,
    updateUserPersonModel,
    updateUserName,
    updateUserSex,
    updateWebsiteTitle,
    searchDiscuss,
    updateSelectItemSceneSetting,
    updateAboutMineSceneSetting,
    updateCinemaSceneSetting,
    uploadSelectItemBg,
    uploadCinemaBg,
    updateWatchRecord,
    updateInterestedMovie,
    getRecommendMovieList,
    updateWallet,
    updateIconNum,
    updateMiningRecord,
    updateConsumeRecord,
    findUserMsgByName
}



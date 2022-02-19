var userModel=require('../models/users');
var adminModel=require('../models/admins');
var leaveMsgModel=require('../models/disscuss');
var {setCrypto}=require('../untils/base');
var {Email}=require('../untils/config');

var index=async (req,res,next)=>{
    res.send({
        msg:'管理员权限',
        status:0
    })
}


//用户管理接口的方法
//显示所有用户信息的操作
var userList=async (req,res,next)=>{
    var result=await userModel.userList();
    if(result){
        res.send({
            msg:'所有用户信息获取成功',
            status:0,
            data:{
                userList:result
            }
        })
    }
    else{
        res.send({
            msg:'所有用户信息获取失败',
            status:-1
        })
    }
}


//更新账号冻结状态的操作
var updateFreeze=async (req,res,next)=>{
    var {email,isFreeze}=req.body;
    var result=await userModel.updateFreeze(email,isFreeze);
    if(result){
        res.send({
            msg:'账号冻结操作成功',
            status:0
        })
    }
    else{
        res.send({
            msg:'账号冻结操作失败',
            status:-1
        })
    }
}

//删除用户账号的操作
var deleteUser=async (req,res,next)=>{
    var {email}=req.body;
    var result=await userModel.deleteUser(email);
    if(result){
        res.send({
            msg:'账号删除操作成功',
            status:0
        })
    }
    else{
        res.send({
            msg:'账号删除操作失败',
            status:-1
        })
    }
}


//管理员管理接口的方法

//监听管理员在线状态的操作
var isAdmin=async(req,res,next)=>{
    if(req.session.adminName){   //判断session是否存入了adminName
        res.send({
            msg:'管理员登陆成功',
            status:0
        })
    }
    else{
        res.send({
            msg:'抱歉，没有管理权限',
            status:-1
        })
    }
}



//管理员登录的操作
var adminLogin =async (req,res,next)=>{
    var {adminName,adminPassword,verifyImg}=req.body;  //login为post请求
    console.log(adminName,adminPassword,verifyImg);

    if(verifyImg!==req.session.verifyImg){
        res.send({
            msg:'验证码输入不正确',
            status:-3
        })
        return;
    }

    var result=await adminModel.adminLogin({
        adminName,
        adminPassword:setCrypto(adminPassword)
    })

    if(result){
        req.session.adminName=adminName;
        // console.log(req.session.adminName)
            res.send({
                msg:'登录成功',
                status:0
            })
    }
    else{
        res.send({
            msg:'登录失败',
            status:-1
        })
    }
}


//管理员注册的操作
var adminRegister=async(req,res,next)=>{
    var {registerName,registerPassword,registerEmail,verify}=req.body;  //register为post请求
    // console.log(registerName,registerPassword,registerEmail);
    //判断传进来的邮箱或者验证码是否与session中存放的相等
    if(registerEmail!==req.session.adminEmail || verify!==req.session.adminVerify){
        res.send({
            session:req.session,
            msg:'验证码错误',
            status:-1
        })
        return;
    }

    //验证码时间大于1分钟
    if((Email.time-req.session.adminTime)/1000 >60){
        res.send({
            msg:'验证码已过期',
            status:-3
        })
        return;
    }

    var result=await adminModel.adminSave({
        adminName:registerName,
        adminPassword:setCrypto(registerPassword),   //密码加密存储
        adminEmail:registerEmail
    });
    console.log(result);
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


//管理员登出接口的方法
var adminLogout=async(req,res,next)=>{
    req.session.adminName='';
    res.send({
        msg:'退出成功',
        status:0
    })
}


//验证接口的方法
var adminVerifyMethod=async(req,res,next)=>{
    var email=req.query.email;  //接收传过来的接收方邮箱的参数
    var verify=Email.verify;   //定义一个变量保存接收的验证码
    req.session.adminVerify=verify;   //把验证码存入session中
    req.session.adminEmail=email;  //把邮箱号存入session中(邮箱要和验证码相对应)
    req.session.adminTime=Email.time;  //把发送验证码的当前时间存入session中

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



//删除用户讨论内容的操作
var deleteLeaveMsg=async (req,res,next)=>{
    var {name,msgContent}=req.body;
    var result=await leaveMsgModel.deleteLeaveMsg(name,msgContent);
    if(result){
        res.send({
            msg:'讨论内容删除操作成功',
            status:0
        })
    }
    else{
        res.send({
            msg:'讨论内容删除操作失败',
            status:-1
        })
    }
}




module.exports={
    index,
    userList,
    updateFreeze,
    deleteUser,
    adminLogin,
    adminRegister,
    isAdmin,
    adminVerifyMethod,
    deleteLeaveMsg,
    adminLogout
}

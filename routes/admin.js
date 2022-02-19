var express = require('express');
var adminController=require('../controllers/admin');   //引入控制器
var router = express.Router();

/* GET users listing. */
// router.use((req,res,next)=>{   //一个拦截功能
//     console.log(req.session.adminName)
//     if(req.session.adminName){  //若有对应的用户名和管理权限则可进入后台管理页面
//         next();
//     }
//     else{
//         res.send({
//             msg:'抱歉，没有管理权限',
//             status:-1
//         })
//     }
// })


router.get('/', adminController.index);
router.get('/userList', adminController.userList);
router.post('/updateFreeze', adminController.updateFreeze);
router.post('/deleteUser', adminController.deleteUser);

//删除用户讨论内容的路由
router.post('/deleteLeaveMsg', adminController.deleteLeaveMsg);



//监听管理员在线状态
router.get('/isAdmin',adminController.isAdmin);

//管理员登录
router.post('/adminLogin', adminController.adminLogin);

//管理员注册
router.post('/adminRegister', adminController.adminRegister);

//管理员验证码接口
router.get('/adminVerifyMethod',adminController.adminVerifyMethod);

//管理员登出接口的路由
router.get('/adminLogout',adminController.adminLogout);




module.exports = router;

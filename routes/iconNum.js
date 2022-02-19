var express = require('express');
var iconNumController=require('../controllers/iconNum');   //引入控制器
var router = express.Router();


//更新metaIcon的数量的路由
router.get('/updateIconNum',iconNumController.updateIconNum)



//增加metaIcon的数量的路由
router.post('/editIconNum',iconNumController.editIconNum)


//获取metaIcon的数量的路由
router.get('/getTotalIconNum',iconNumController.getTotalIconNum)





module.exports = router;

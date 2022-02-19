var express = require('express');
var iconRateController=require('../controllers/iconRate');   //引入控制器
var router = express.Router();


//生成每天的metaIcon兑换率
router.post('/generateMetaIconRate',iconRateController.generateMetaIconRate)


//生成上个月的metaIcon平均兑换率
router.get('/generateMetaIconRateAvg',iconRateController.generateMetaIconRateAvg)



module.exports = router;

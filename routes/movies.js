var express = require('express');
var moviesController = require('../controllers/movies'); //引入控制器
var router = express.Router();



/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


//配置各接口的路由
//获取电影信息接口的路由
router.get('/getMovie', moviesController.getMovie);

//获取所有电影信息接口的路由
router.get('/movieList', moviesController.movieList);

//删除电影信息接口的路由
router.post('/deleteMovie', moviesController.deleteMovie);

//增加电影信息接口的路由
router.post('/addMovie', moviesController.addMovie);

//更新电影信息接口的路由
router.post('/updateMovie', moviesController.updateMovie);


//获取电影分类字段接口的路由
router.get('/movieField', moviesController.getMovieField);


//获取电影分类内容接口的路由
router.post('/categoryMovie', moviesController.getCategoryMovie);


//电影评分接口的路由
router.post('/scoreMovie', moviesController.scoreMovie);

//更新参与某电影评分的用户信息的路由
router.post('/updateScorePerson', moviesController.updateScorePerson);


//电影搜索接口的路由
router.get('/searchMovie', moviesController.searchMovie);


//实时获取猫眼电影数据的路由
router.get('/getMaoYanmovie', moviesController.getMaoYanmovie);

//批量添加电影数据
router.post('/addMoreMovieData', moviesController.addMoreMovieData);


//保存电影评论数据
router.post('/saveMovieComments', moviesController.saveMovieComments);


//删除电影评论数据
router.post('/deleteMovieComments', moviesController.deleteMovieComments);


//更新电影热度值的路由
router.post('/updateHotVal', moviesController.updateHotVal);



//更新电影竞选价格的路由
router.post('/updateMovieBiddingPrice', moviesController.updateMovieBiddingPrice);


//更新电影的最后竞选人的路由
router.post('/updateMovieLastBiddingPerson', moviesController.updateMovieLastBiddingPerson);


//更新电影开始和结束的竞选日期的路由
router.post('/updateMovieBiddingDate', moviesController.updateMovieBiddingDate);



//更新参与该电影竞选的用户的路由
router.post('/updateMovieBiddingPerson', moviesController.updateMovieBiddingPerson);


//更新电影的购买状态的路由
router.post('/updateMoviePurchaseStatus', moviesController.updateMoviePurchaseStatus);


//更新电影购买后的唯一标识的路由
router.post('/updateMovieIdentificationID', moviesController.updateMovieIdentificationID);


//更新电影的播放量的路由
router.post('/updateMoviePlayNum', moviesController.updateMoviePlayNum);




module.exports = router;
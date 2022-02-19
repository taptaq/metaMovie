var {
    Poster
} = require('../untils/config');
var movieModel = require('../models/movies');
var fs = require('fs');
let request = require('request');
let cheerio = require('cheerio');

var xlsx = require('node-xlsx');

let v = require('voca');  //操作字符串



//获取电影信息接口的方法
var getMovie = async (req, res, next) => {
    let url = new URL(req.url, 'http://localhost:8895');
    let query = new URLSearchParams(url.search)
    let movieId = query.get('movieId')
    if (movieId) {
        let msg = await movieModel.findMovie({
            "movieId": movieId
        });
        res.send({
            msg: '获取电影信息成功',
            status: 0,
            data: {
                detailMsg: msg
            }
        })
    } else {
        res.send({
            msg: '获取电影信息失败',
            status: -1
        })
    }
}


//显示所有电影信息的操作
var movieList = async (req, res, next) => {
    var result = await movieModel.movieList();
    if (result) {
        res.send({
            msg: '所有电影信息获取成功',
            status: 0,
            data: {
                movieList: result
            }
        })
    } else {
        res.send({
            msg: '所有电影信息获取失败',
            status: -1
        })
    }
}




//删除电影信息的操作
var deleteMovie = async (req, res, next) => {
    var {
        movieId
    } = req.body;
    var result = await movieModel.deleteMovie(movieId);
    if (result) {
        res.send({
            msg: '电影删除操作成功',
            status: 0
        })
    } else {
        res.send({
            msg: '电影删除操作失败',
            status: -1
        })
    }
}


//更新电影信息的方法
var updateMovie = async (req, res, next) => {
    let {
        movieId,
        movieName,
        moviePoster,
        actor,
        score,
        movieType,
        area,
        dra,
        year,
        price,
        sales
    } = req.body.movieForm;
    actor = JSON.parse(actor); //转为JSON对象
    // if(Object.prototype.toString.call(movieType)==='[object Array]'){
    //     movieType.slice(1,-2);
    // }

    if (typeof movieType === "string") {
        movieType = movieType.split(','); //转为数组形式
    }

    //
    // if (typeof director === "string") {
    //     director = director.split(','); //转为数组形式
    // }


    let result = await movieModel.updateMovie(movieId, movieName, moviePoster, actor, score, movieType, area, dra, year,price,sales);
    // console.log(result);
    if (result) {
        res.send({
            msg: '更新电影数据操作成功',
            status: 0
        })
    } else {
        res.send({
            msg: '更新电影数据操作失败',
            status: -1
        })
    }
}

//添加电影信息的方法
var addMovie = async (req, res, next) => {
    let {
        movieId,
        movieName,
        moviePoster,
        actor,
        score,
        movieType,
        area,
        dra,
        year,
        price,
        sales
    } = req.body.movieForm;
    actor = JSON.parse(actor);
    let result = await movieModel.saveMovie({
        movieId,
        movieName,
        moviePoster,
        actor,
        score,
        movieType,
        area,
        dra,
        year,
        price,
        sales
    });

    if (result) {
        res.send({
            msg: '添加数据成功',
            status: 0
        })
    } else {
        res.send({
            msg: '添加数据失败',
            status: -1
        })
    }
}


//获取电影分类字段的方法
var getMovieField = async (req, res, next) => {
    let data = fs.readFileSync('public/data/categoryMovieField.json', 'utf-8');
    if (data) {
        res.send({
            msg: '获取电影分类字段数据成功',
            status: 0,
            data
        })
    }
}


// 更新电影评分的方法
var scoreMovie = async (req, res, next) => {
    // console.log(req.body);
    let {
        movieId,
        score
    } = req.body;

    let result = await movieModel.updateScore(movieId, score);
    // console.log(result);
    if (result) {
        res.send({
            msg: '评分成功',
            status: 0
        })
    } else {
        res.send({
            msg: '评分失败',
            status: -1
        })
    }
}


// 更新参与某电影评分的用户信息
var updateScorePerson = async (req, res, next) => {
    // console.log(req.body);
    let {
        movieId,
        scorePerson
    } = req.body;

    let result = await movieModel.updateScorePerson(movieId, scorePerson);
    // console.log(result);
    if (result) {
        res.send({
            msg: '更新参与某电影评分的用户信息成功',
            status: 0
        })
    } else {
        res.send({
            msg: '更新参与某电影评分的用户信息失败',
            status: -1
        })
    }
}


// 更新电影热度值的方法
var updateHotVal = async (req, res, next) => {
    // console.log(req.body);
    let {
        movieId,
        hotVal
    } = req.body;
    let result = await movieModel.updateHotVal(movieId, hotVal);
    if (result) {
        res.send({
            msg: '更新热度值成功',
            status: 0
        })
    } else {
        res.send({
            msg: '更新热度值失败',
            status: -1
        })
    }
}

//获取电影分类内容的方法
var getCategoryMovie = async (req, res, next) => {
    let {
        movieType,
        movieArea,
        movieYear
    } = req.body;
    let result = await movieModel.categoryMovieList(movieType, movieArea, movieYear);
    if (result) {
        res.send({
            msg: '获取电影分类内容成功',
            status: 0,
            data: result
        })
    } else {
        res.send({
            msg: '获取电影分类内容失败',
            status: -1
        })
    }
}

//获取电影搜索内容的方法
var searchMovie = async (req, res, next) => {
    let {
        key
    } = req.query;
    let result = await movieModel.searchMovieList(key);
    // console.log(result);
    if (result.length) {
        res.send({
            msg: '获取电影搜索内容成功',
            status: 0,
            data: result
        })
    } else {
        res.send({
            msg: '获取电影搜索内容失败',
            status: -1
        })
    }
}



let host = 'https://maoyan.com'; //请求的域名
let movieDataArr = [];
//实时获取猫眼电影数据并导出到execl文件
let getMaoYanmovie = async (req, res, next) => {
    let url = host + '/films?requestCode=91c7e65d9c891503e1e608b8cfff82e4bzdvu&sortId=2&offset=30';
    request({
        url: url,
        method: "GET",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
            'Cookie': '__mta=142449933.1633419276333.1635147054774.1635147059072.34; __mta=142449933.1633419276333.1635147059072.1643175881523.35; _lxsdk_cuid=17c4f602f7b13-0e35203a9ed18d-b7a1a38-100200-17c4f602f7cc8; ci=1%2C%E5%8C%97%E4%BA%AC; __mta=142449933.1633419276333.1635048623230.1635147053591.33; selectci=true; uuid_n_v=v1; uuid=3B7211C07E6911EC856A3FE2D937CE1BED520E4949A64870881973ED20BE63E4; _lxsdk=3B7211C07E6911EC856A3FE2D937CE1BED520E4949A64870881973ED20BE63E4; _csrf=274f5d5fd6637ac9d7cfe59da87db7bba12f8d98bcdf56112554d33af0a45fcc; lt=NEpd-ditgd7iVSWVVqjcQ8uyca0AAAAAGhAAAP7QTyurDHr5c7LsLZ7UFzTNxH2KycLiXtl2j69xa4UvoYDucp0s3b23BD3pXQDVig; lt.sig=D73wUUv7riJeGo1qj3_LWl7Qvlw; uid=769653097; uid.sig=-ofjdZvEQPWnxgRjhxvsYIMU6cI; Hm_lvt_703e94591e87be68cc8da0da7cbd0be2=1643175101,1643175104,1643175105,1643175116; Hm_lpvt_703e94591e87be68cc8da0da7cbd0be2=1643175885; __mta=142449933.1633419276333.1635147059072.1643175885185.35; _lxsdk_s=17e94c1e2b6-5d-583-6a7%7C%7C79'
        },
    }, (err, response, body) => {
        if (response.statusCode === 200) {
            let $ = cheerio.load(body);
            $('dl.movie-list dd').each((index, item) => {
                let itemHtml = $(item).html();
                let $1 = cheerio.load(itemHtml);
                getMovieDetail($1).then(res => {
                    movieDataArr.push(res);
                }).catch(e => {
                    res.send({
                        msg: '获取数据失败：' + e,
                        status: -1
                    })
                    throw e
                });
            });

            console.log(movieDataArr);

            //将数据写入execl文件中
            try {
                //excel数据
                var excelData = []; {
                    //添加数据
                    var addInfo = {};
                    //名称
                    addInfo.name = "电影数据表";
                    //数据数组
                    addInfo.data = [
                        ["movieId", "movieName", "movieEnName", "moviePoster", "director", "actor", "score", "date", "movieType", "hot", "dra", 'background', 'dur', 'area', 'year'],
                    ];

                    //添加数据
                    movieDataArr.forEach(item => {
                        addInfo.data.push(Object.values(item));
                    })

                    //添加数据
                    excelData.push(addInfo);
                }


                // 写xlsx
                var buffer = xlsx.build(excelData);
                //写入数据
                fs.writeFile('./movieData.xls', buffer, function (err) {
                    if (err) {
                        res.send({
                            msg: '获取数据失败',
                            status: -1
                        })
                        throw err;
                    }
                    res.send({
                        msg: '获取数据成功并写入execl文件中',
                        status: 0
                    })
                    //输出日志
                    console.log('Write to xls has finished');
                });
            } catch (e) {
                res.send({
                    msg: '获取数据失败',
                    status: -1
                })
                //输出日志
                console.log("excel写入异常,error=%s", e.stack);
            }


        }
    })
}
//获取详情信息
let getMovieDetail = ($) => {
    return new Promise((resolve, reject) => {
        let movieData = {};
        let movieId = $('div.movie-item.film-channel > a').attr('data-val'); //电影id
        movieId = (new Function("return " + movieId))().movieid;
        let movieScore = $('div.channel-detail.channel-detail-orange > i.integer').text() + $('div.channel-detail.channel-detail-orange > i.fraction').text() === '' ? '暂无评分' : $('div.channel-detail.channel-detail-orange > i.integer').text() + $('div.channel-detail.channel-detail-orange > i.fraction').text();
        console.log(movieId);
        let url = host + '/films/' + movieId;
        request({
            url: url,
            method: "GET",
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
                'Cookie': '__mta=142449933.1633419276333.1635147054774.1635147059072.34; __mta=142449933.1633419276333.1635147059072.1643175881523.35; _lxsdk_cuid=17c4f602f7b13-0e35203a9ed18d-b7a1a38-100200-17c4f602f7cc8; ci=1%2C%E5%8C%97%E4%BA%AC; __mta=142449933.1633419276333.1635048623230.1635147053591.33; selectci=true; uuid_n_v=v1; uuid=3B7211C07E6911EC856A3FE2D937CE1BED520E4949A64870881973ED20BE63E4; _lxsdk=3B7211C07E6911EC856A3FE2D937CE1BED520E4949A64870881973ED20BE63E4; _csrf=274f5d5fd6637ac9d7cfe59da87db7bba12f8d98bcdf56112554d33af0a45fcc; lt=NEpd-ditgd7iVSWVVqjcQ8uyca0AAAAAGhAAAP7QTyurDHr5c7LsLZ7UFzTNxH2KycLiXtl2j69xa4UvoYDucp0s3b23BD3pXQDVig; lt.sig=D73wUUv7riJeGo1qj3_LWl7Qvlw; uid=769653097; uid.sig=-ofjdZvEQPWnxgRjhxvsYIMU6cI; Hm_lvt_703e94591e87be68cc8da0da7cbd0be2=1643175101,1643175104,1643175105,1643175116; Hm_lpvt_703e94591e87be68cc8da0da7cbd0be2=1643175885; __mta=142449933.1633419276333.1635147059072.1643175885185.35; _lxsdk_s=17e94c1e2b6-5d-583-6a7%7C%7C79'
            },
        }, (err, response, body) => {
            if (response.statusCode === 200) {
                let $2 = cheerio.load(body);
                console.log(body,'$2')
                let movieTypeArr = []; //电影类型数组
                let movieDirectorArr = []; //电影导演数组
                let movieActorArr = []; //电影演员数组
                let movieName = $2('div.banner > div > div.celeInfo-right.clearfix > div.movie-brief-container > h1').text();
                let movieEnName = $2('div.banner > div > div.celeInfo-right.clearfix > div.movie-brief-container > div.enname').text();
                let moviePoster = $2('div.banner > div > div.celeInfo-left > div > img').attr('src');
                $2('div.banner > div > div.celeInfo-right.clearfix > div.movie-brief-container > ul > li:nth-child(1) > a').each((index, item) => {
                    movieTypeArr.push($2(item).text().trim());
                });
                let movieType = movieTypeArr;

                let movieArea = $2('div.banner > div > div.celeInfo-right.clearfix > div.movie-brief-container > ul > li:nth-child(2)').text().split('/')[0].trim();
                let movieDur = $2('div.banner > div > div.celeInfo-right.clearfix > div.movie-brief-container > ul > li:nth-child(2)').text().split('/')[1].trim();
                let movieDate = $2('div.banner > div > div.celeInfo-right.clearfix > div.movie-brief-container > ul > li:nth-child(3)').text().slice(0, 10);
                let movieDra = $2('div.main-content > div > div.tab-content-container > div.tab-desc.tab-content.active > div:nth-child(1) > div.mod-content > span').text();
                let movieBackground = '#392f59';
                $2('div.main-content > div > div.tab-content-container > div.tab-desc.tab-content.active > div:nth-child(2) > div.mod-content > div > div:nth-child(1) > ul > li > div > a').each((index, item) => {
                    movieDirectorArr.push($(item).text().trim());
                });
                let movieDirector = movieDirectorArr;
                $2('div.main-content > div > div.tab-content-container > div.tab-desc.tab-content.active > div:nth-child(2) > div.mod-content > div > div:nth-child(2) > ul > li').each((index, item) => {
                    let $3 = cheerio.load($2(item).html());
                    let img = $3('a.portrait img.default-img').attr('data-src');
                    let name = $3('div.info a.name').text().trim();
                    let role = $3('div.info span.role').text().slice(2, 5);
                    let movieActorObj = {};
                    movieActorObj.name = name;
                    movieActorObj.role = role;
                    movieActorObj.img = img;
                    movieActorArr.push(JSON.stringify(movieActorObj));
                })
                let movieActor = movieActorArr;
                let movieYear = movieDate.slice(0, 4);
                let movieHot = Math.floor((Math.random() * 20 + 70)).toString();

                movieData = {
                    movieId,
                    movieName,
                    movieEnName,
                    moviePoster,
                    movieDirector,
                    movieActor,
                    movieScore,
                    movieDate,
                    movieType,
                    movieHot,
                    movieDra,
                    movieBackground,
                    movieDur,
                    movieArea,
                    movieYear
                }
                // console.log(movieData);
                resolve(movieData);
            }
        });
    })

}


//批量添加数据
let addMoreMovieData = async (req, res, next) => {
    let count = 0;
    for (let i = 0; i < req.body.moreData.length; i++) {
        let item = req.body.moreData[i];
        let {
            movieId,
            movieName,
            movieEnName,
            moviePoster,
            director,
            actor,
            score,
            movieType,
            hot,
            date,
            dur,
            area,
            dra,
            background,
            year
        } = item;
        // console.log(item);
        let judgeExistmovieId = await movieModel.ismovieIdExist(movieId);
        //存在对应的电影信息则直接更新对应的电影信息
        if (judgeExistmovieId.length) {
            console.log('更新')
            let result = await movieModel.updateMovie(movieId, movieName, movieEnName, moviePoster, director, actor, score, movieType, hot, date, dur, area, dra, background, year);
            if (result) {
                count++;
            }
        }
        //不存在对应的电影信息则直接添加
        else {
            console.log('添加')
            let result = await movieModel.savemovie({
                movieId,
                movieName,
                movieEnName,
                moviePoster,
                director,
                actor,
                score,
                movieType,
                hot,
                date,
                dur,
                area,
                dra,
                background,
                year
            });
            if (result) {
                count++;
            }
        }
    }
    if (count === req.body.moreData.length) {
        res.send({
            msg: '添加电影数据操作成功',
            status: 0
        })
    } else {
        res.send({
            msg: '添加电影数据操作失败',
            status: -1
        })
    }
}




//保存电影评论
let saveMovieComments = async (req, res, next) => {
    let {
        movieId,
        comments,
        username
    } = req.body;

    let movieMsg = await movieModel.isMovieIdExist(movieId);
    // console.log(movieMsg);

    comments=v.escapeHtml(comments);  //转义字符串，防止html注入

    if (movieMsg) {
       let obj={};
       obj.username=username;
       obj.comments=comments;
       obj.commentDate=Date.now();
       movieMsg[0].comments.push(obj);

       let isUpdateComments = await movieModel.updateMovieComments(movieId,movieMsg[0].comments);
        if(isUpdateComments){
            res.send({
                msg: '电影评论成功',
                status: 0
            })
        }else{
            res.send({
                msg: '电影评论失败',
                status: -1
            })
        }

    } else {
        res.send({
            msg: '电影评论失败',
            status: -1
        })
    }
}



//删除电影评论数据的
let deleteMovieComments = async (req, res, next) => {
    let {
        movieId,
        commentId
    } = req.body;

    let movieMsg = await movieModel.isMovieIdExist(movieId);
    movieMsg=movieMsg[0];
    if (movieMsg) {
        movieMsg.comments=movieMsg.comments.filter((item,index)=>{
            return index!=commentId
        })
        // console.log(movieMsg.comments);
        let isUpdateComments = await movieModel.updateMovieComments(movieId,movieMsg.comments);
        if(isUpdateComments){
            res.send({
                msg: '电影评论删除成功',
                status: 0
            })
        }else{
            res.send({
                msg: '电影评论删除失败',
                status: -1
            })
        }

    } else {
        res.send({
            msg: '电影评论删除失败',
            status: -1
        })
    }
}


// 更新电影价格的方法
var updateMovieBiddingPrice = async (req, res, next) => {
    // console.log(req.body);
    let {
        movieId,
        biddingPrice
    } = req.body;
    let result = await movieModel.updateMovieBiddingPrice(movieId, biddingPrice);
    if (result) {
        res.send({
            msg: '更新电影价格成功',
            status: 0
        })
    } else {
        res.send({
            msg: '更新电影价格失败',
            status: -1
        })
    }
}



// 更新电影的最后竞选人
let updateMovieLastBiddingPerson = async (req, res, next) => {
    // console.log(req.body);
    let {
        movieId,
        lastBiddingPerson
    } = req.body;
    let result = await movieModel.updateMovieLastBiddingPerson(movieId, lastBiddingPerson);
    if (result) {
        res.send({
            msg: '更新电影的最后竞选人成功',
            status: 0
        })
    } else {
        res.send({
            msg: '更新电影的最后竞选人失败',
            status: -1
        })
    }
}


// 更新电影最开始的竞选日期
let updateMovieBiddingDate = async (req, res, next) => {
    // console.log(req.body);
    let {
        movieId
    } = req.body;
    let nowDate=new Date(Date.now());
    let afterThreeDate=new Date(Date.now()+86400000*3);
    let startBiddingDate=`${nowDate.getFullYear()}-${nowDate.getMonth()+1}-${nowDate.getDate()} ${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}`;
    let endBiddingDate=`${afterThreeDate.getFullYear()}-${afterThreeDate.getMonth()+1}-${afterThreeDate.getDate()} ${afterThreeDate.getHours()}:${afterThreeDate.getMinutes()}:${afterThreeDate.getSeconds()}`;
    let result = await movieModel.updateMovieBiddingDate(movieId, startBiddingDate,endBiddingDate);
    if (result) {
        res.send({
            msg: '更新电影开始和结束的竞选日期成功',
            status: 0
        })
    } else {
        res.send({
            msg: '更新电影开始和结束的竞选日期失败',
            status: -1
        })
    }
}



// 更新参与该电影竞选的用户
let updateMovieBiddingPerson = async (req, res, next) => {
    // console.log(req.body);
    let {
        movieId,
        username
    } = req.body;

    let movieMsg = await movieModel.isMovieIdExist(movieId);
    movieMsg=movieMsg[0];
    if(movieMsg){
        let oldBiddingPerson=movieMsg.biddingPerson;
        let newBiddingPerson=[...oldBiddingPerson,username];
        newBiddingPerson=[...new Set(newBiddingPerson)];

        let result = await movieModel.updateMovieBiddingPerson(movieId, newBiddingPerson);
        if (result) {
            res.send({
                msg: '更新参与该电影竞选的用户成功',
                status: 0
            })
        } else {
            res.send({
                msg: '更新参与该电影竞选的用户失败',
                status: -1
            })
        }
    }
}




// 更新电影的购买状态
let updateMoviePurchaseStatus = async (req, res, next) => {
    // console.log(req.body);
    let {
        movieId,
        isPurchase
    } = req.body;

        let result = await movieModel.updateMoviePurchaseStatus(movieId, isPurchase);
        if (result) {
            res.send({
                msg: '更新电影的购买状态成功',
                status: 0
            })
        } else {
            res.send({
                msg: '更新电影的购买状态失败',
                status: -1
            })
        }

}




// 更新电影购买后的唯一标识
let updateMovieIdentificationID = async (req, res, next) => {
    // console.log(req.body);
    let {
        movieId,
        identificationID
    } = req.body;

    let result = await movieModel.updateMovieIdentificationID(movieId, identificationID);
    if (result) {
        res.send({
            msg: '更新电影购买后的唯一标识成功',
            status: 0
        })
    } else {
        res.send({
            msg: '更新电影购买后的唯一标识失败',
            status: -1
        })
    }

}



// 更新电影的播放量
let updateMoviePlayNum = async (req, res, next) => {
    // console.log(req.body);
    let {
        movieId
    } = req.body;

    let msg = await movieModel.findMovie({
        "movieId": movieId
    });

    let playNum=msg[0].playNum+1;

    let result = await movieModel.updateMoviePlayNum(movieId, playNum);
    if (result) {
        res.send({
            msg: '更新电影的播放量成功',
            status: 0
        })
    } else {
        res.send({
            msg: '更新电影的播放量失败',
            status: -1
        })
    }

}









module.exports = {
    getMovie,
    movieList,
    deleteMovie,
    updateMovie,
    addMovie,
    getMovieField,
    getCategoryMovie,
    scoreMovie,
    searchMovie,
    getMaoYanmovie,
    addMoreMovieData,
    saveMovieComments,
    deleteMovieComments,
    updateHotVal,
    updateScorePerson,
    updateMovieBiddingPrice,
    updateMovieLastBiddingPerson,
    updateMovieBiddingDate,
    updateMovieBiddingPerson,
    updateMoviePurchaseStatus,
    updateMovieIdentificationID,
    updateMoviePlayNum
}
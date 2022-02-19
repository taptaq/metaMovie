let mongoose = require('mongoose');
let {
    bg
} = require('../untils/config');
mongoose.set('useCreateIndex', true); //允许创建索引

//电影数据接口的数据库骨架
let movieSchema = new mongoose.Schema({
    movieId: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    }, //电影ID
    movieName: {
        type: String,
        required: true
    }, //电影
    moviePoster: {
        type: String,
        default: new URL('default.jpg', bg.baseUrl)
    }, // 电影封面
    actor: {
        type: Array
    }, //主演
    director: {
        type: Array
    }, //导演
    score: {
        type: Number,
        default:0
    }, //评分
    scorePerson:{
        type:Array,
        default:[]
    },  //评分人数
    dur:{
      type:String
    },  //时长
    movieType: {
        type: Array
    }, //类型
    dra: {
        type: String
    }, //电影描述
    area: {
        type: String
    }, //地区,
    year: {
        type: String
    }, //出版年份
    price: {
        type: Number,
        default:0
    }, //电影售价
    sales:{
       type:String,
       default:'0'
    }, //电影热度值
    vip:{
        type:Boolean,
        default:false
    },   //是否为vip电影
    date:{
        type:String,
        default:''
    },  //上映日期
    comments:{type:Array,default:[]},  //电影评论内容
    sourceSrc:{type:String,default:""},  //电影资源
    isPurchase:{type:Boolean,default:false},  //是否已被购买
    lastBiddingPerson:{type:Object,default:{
         username:"",
         metaUserId:""
        }},   //最后竞选成功的用户
    identificationID:{type:String,default:""},   //购买该电影后的唯一标识ID
    startBiddingDate:{type:String,default:""},   //该电影开始竞选的日期
    endBiddingDate:{type:String,default:""},   //该电影结束竞选的日期
    biddingPerson:{type:Array,default:[]},    //该电影参与竞选的用户
    biddingPrice:{type:Number,default:0},    //竞选的价格
    playNum:{type:Number,default:0}
})

//电影接口的数据库模型
let movieModel = mongoose.model('movie', movieSchema);
movieModel.createIndexes(); //使得索引唯一值生效


//获取电影的平均分
let getMovieArgScore=()=>{
    return new Promise((resolve,reject)=>{
        movieModel.find({},{score:1},(err,res)=> {
            let sum=0;
            let argNum=0;
            res.forEach(item => {
                if (item.score === '暂无评分') {
                    item.score = 0;
                }
                sum += Number(item.score);
            })
            argNum = Number(sum / res.length).toFixed(1);
            // console.log(argNum,'argNum')
            resolve(argNum);
        })
    })
}


//获取某电影的评分人数
let getMovieScoreNum=(movieId)=>{
    return new Promise((resolve,reject)=>{
        movieModel.find({movieId},{scorePerson:1},(err,res)=> {
            resolve(res);
        })
    })
}


//获取当前电影当前的分数
let getMovieScore=(movieId)=>{
    return new Promise((resolve,reject)=>{
        movieModel.find({movieId},{score:1},(err,res)=> {
            resolve(res[0].score);
        })
    })
}


//电影数据保存的方法
let saveMovie =async (data) => {
    if(!data.score){
        let newScore=await getMovieArgScore();
        data.score=newScore;
    }

    // console.log(data);

    let movie = new movieModel(data);

    return movie.save().then(() => {
        return true
    }).catch(() => {
        return false
    })
}

//电影数据查找的方法
let findMovie = (data) => {
    return movieModel.find(data)
}


//返回所有电影数据的方法
let movieList = () => {
    return movieModel.find();
}


//删除电影数据
let deleteMovie = (movieId) => {
    return movieModel.deleteOne({
        movieId
    })
}

//更新电影数据
let updateMovie = (movieId, movieName, moviePoster, actor, score, movieType, area, dra, year,price,sales) => {
    return movieModel.updateOne({
        movieId
    }, {
        $set: {
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
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}

//更新电影分数
/**
 * 基础的打分人数为1000
 * */
let updateScore = async (movieId, score) => {
    let scorePersonRes=await getMovieScoreNum(movieId);
    let nowMovieScore=await getMovieScore(movieId);
    let nowSumScore=0;
    scorePersonRes=scorePersonRes[0].scorePerson
    scorePersonRes.forEach(item=>{
        nowSumScore+=Number(item.score);
    })
    let sumScore=Number(nowMovieScore)*1000+nowSumScore+Number(score);
    let newScore=(sumScore/(1000+scorePersonRes.length+1)).toFixed(1);
    // console.log(sumScore/(1000+scorePersonRes.length+1),'newScore');

        return movieModel.updateOne({
            movieId
        }, {
            $set: {
                score:newScore
            }
        }).then(() => {
            return true
        }).catch(() => {
            return false
        })
}


//更新参与某电影评分的用户信息
let updateScorePerson = async (movieId, scorePerson) => {
    return movieModel.updateOne({
        movieId
    }, {
        $set: {
            scorePerson
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}

//更新电影热度值
let updateHotVal = (movieId, hotVal) => {
    return movieModel.updateOne({
        movieId
    }, {
        $set: {
            sales:hotVal
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}



//获取电影分类内容的所有数据
let categoryMovieList = (movieType, movieArea, movieYear) => {
    if (movieType === '全部' && movieArea === '全部' && movieYear === '全部') {
        return movieModel.find();
    } else if (movieType === '全部' && movieArea !== '全部' && movieYear !== '全部') {
        return movieModel.find({
            area: movieArea,
            year: movieYear
        });
    } else if (movieArea === '全部' && movieType !== '全部' && movieYear !== '全部') {
        return movieModel.find({
            movieType: {
                $elemMatch: {
                    $eq: movieType
                }
            },
            year: movieYear
        });
    } else if (movieYear === '全部' && movieType !== '全部' && movieArea !== '全部') {
        return movieModel.find({
            movieType: {
                $elemMatch: {
                    $eq: movieType
                }
            },
            area: movieArea
        });
    } else if (movieType !== '全部' && movieArea === '全部' && movieYear === '全部') {
        return movieModel.find({
            movieType: {
                $elemMatch: {
                    $eq: movieType
                }
            }
        });
    } else if (movieArea !== '全部' && movieType === '全部' && movieYear === '全部') {
        return movieModel.find({
            area: movieArea
        });
    } else if (movieYear !== '全部' && movieArea === '全部' && movieType === '全部') {
        return movieModel.find({
            year: movieYear
        });
    } else if (movieType !== '全部' && movieArea !== '全部' && movieYear !== '全部') {
        return movieModel.find({
            movieType: {
                $elemMatch: {
                    $eq: movieType
                }
            },
            area: movieArea,
            year: movieYear
        });
    }
}


//获取电影搜索内容的所有数据
let searchMovieList = (searchVal) => {
    return movieModel.find({
        movieName: {
            $regex: new RegExp(searchVal),
            $options: 'i'
        }
    });
}


//判断电影id是否存在的方法
let isMovieIdExist = (movieId) => {
    return movieModel.find({
        movieId: movieId
    })
}


//更新电影评论
let updateMovieComments = (movieId, comments) => {
    return movieModel.updateOne({
        movieId
    }, {
        $set: {
            comments
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//更新电影竞选价格
let updateMovieBiddingPrice = (movieId, biddingPrice) => {
    return movieModel.updateOne({
        movieId
    }, {
        $set: {
            biddingPrice
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}



//更新电影的最后竞选人
let updateMovieLastBiddingPerson = (movieId, lastBiddingPerson) => {
    return movieModel.updateOne({
        movieId
    }, {
        $set: {
            lastBiddingPerson
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//更新电影开始和结束的竞选日期
let updateMovieBiddingDate = (movieId, startBiddingDate,endBiddingDate) => {
    return movieModel.updateOne({
        movieId
    }, {
        $set: {
            startBiddingDate,
            endBiddingDate
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}



//更新参与该电影竞选的用户
let updateMovieBiddingPerson = (movieId, biddingPerson) => {
    return movieModel.updateOne({
        movieId
    }, {
        $set: {
            biddingPerson
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//更新电影的购买状态
let updateMoviePurchaseStatus = (movieId, isPurchase) => {
    return movieModel.updateOne({
        movieId
    }, {
        $set: {
            isPurchase
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//更新电影购买后的唯一标识
let updateMovieIdentificationID = (movieId, identificationID) => {
    return movieModel.updateOne({
        movieId
    }, {
        $set: {
            identificationID
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}



//更新电影的播放量
let updateMoviePlayNum = (movieId, playNum) => {
    return movieModel.updateOne({
        movieId
    }, {
        $set: {
            playNum
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}









module.exports = {
    saveMovie,
    movieList,
    findMovie,
    deleteMovie,
    updateMovie,
    categoryMovieList,
    updateScore,
    searchMovieList,
    isMovieIdExist,
    updateMovieComments,
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
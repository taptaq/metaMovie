let mongoose = require('mongoose');
// mongoose.set('useCreateIndex', true); //允许创建索引

//metaIcon兑换率接口的数据库骨架
let rateSchema = new mongoose.Schema({
    rateDate: {
        type: String,
    }, //兑换率的日期
    iconRate: {
        type: Number,
    },  //对应的兑换率

})

//兑换率接口的数据库模型
let rateModel = mongoose.model('iconRate', rateSchema);
// leaveMsgModel.createIndexes(); //使得索引唯一值生效


//兑换率数据保存的方法
let saveIconRate = (data) => {
    let iconRate = new rateModel(data);
    return iconRate.save().then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//查看对应日期的兑换率是否存在
let isExitsIconRate=(rateDate)=>{
    return rateModel.findOne({rateDate});
}


//返回所有兑换率数据的方法
let iconRateList = () => {
    return rateModel.find();
}



//更新兑换率数据
let updateIconRate = (rateId, iconRate) => {
    return rateModel.updateOne({
        rateId
    }, {
        $set: {
            iconRate
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}

//获取兑换率搜索内容的所有数据
let searchIconRate = (searchVal) => {
        return rateModel.find({
            rateDate: {
                $regex: new RegExp(searchVal),
                $options: 'i'
            },
        });
}


//获取含对应月份的所有数据
let iconRateMonthList = (yearMonth) => {
    return rateModel.find({
        rateDate: {
            $regex: new RegExp(yearMonth),
            $options: 'i'
        }
    },{iconRate:1});
}



module.exports = {
    saveIconRate,
    iconRateList,
    updateIconRate,
    searchIconRate,
    isExitsIconRate,
    iconRateMonthList
}
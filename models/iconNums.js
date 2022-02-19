let mongoose = require('mongoose');
// mongoose.set('useCreateIndex', true); //允许创建索引

//metaIcon兑换率接口的数据库骨架
let iconNumSchema = new mongoose.Schema({
    iconNum: {
        type: Number,
        default:10000000
    },  //icon总数(初始为1000万个)
    miningCount: {
        type: Number,
        default:0
    },  //挖矿次数
    yieldNum:{
        type:Number,
        default:20
    }   //挖矿时的每次产出

})

//货币数量接口的数据库模型
let iconNumModel = mongoose.model('iconNum', iconNumSchema);
// leaveMsgModel.createIndexes(); //使得索引唯一值生效


//获取当前货币总数量的方法
let getIconNum = () => {
    return iconNumModel.find()
}


//更新货币数量的方法
let updateIconNum = (iconNum) => {
    return iconNumModel.updateOne({
    }, {
        $set: {
            iconNum
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}

//更新挖矿次数的方法
let updateMiningCount = (miningCount) => {
    return iconNumModel.updateOne({
    }, {
        $set: {
            miningCount
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//更新挖矿的每次产出的方法
let updateYieldNum = (yieldNum) => {
    return iconNumModel.updateOne({
    }, {
        $set: {
            yieldNum
        }
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}





module.exports = {
    getIconNum,
    updateIconNum,
    updateMiningCount,
    updateYieldNum
}
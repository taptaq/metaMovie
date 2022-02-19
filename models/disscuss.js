let mongoose = require('mongoose');
// mongoose.set('useCreateIndex', true); //允许创建索引

//留言数据接口的数据库骨架
let discussSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
    }, //用户名
    msgDate: {
        type: Date,
        default:Date.now()
    },  //留言日期
    msgContent: {
        type: String,
        default:""
    } //留言
})

//电影接口的数据库模型
let leaveMsgModel = mongoose.model('discuss', discussSchema);
// leaveMsgModel.createIndexes(); //使得索引唯一值生效


//网站留言数据保存的方法
let saveLeaveMsg = (data) => {
    let leaveMsg = new leaveMsgModel(data);
    console.log(leaveMsg);
    return leaveMsg.save().then(() => {
        return true
    }).catch(() => {
        return false
    })
}


//返回所有网站留言数据的方法
let LeaveMsgList = () => {
    return leaveMsgModel.find();
}


//删除网站留言数据
let deleteLeaveMsg = (name,msgContent) => {
    return leaveMsgModel.deleteOne({
        name,msgContent
    })
}

//更新网站留言数据
let updateLeaveMsg = (movieId, comments) => {
    return leaveMsgModel.updateOne({
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

//获取网站留言搜索内容的所有数据
let searchDiscuss = (searchVal,byWay) => {
    byWay=byWay || 'name';
    if(byWay==='name'){
        return leaveMsgModel.find({
            name: {
                $regex: new RegExp(searchVal),
                $options: 'i'
            },

        });
    }else if(byWay==='msgContent'){
        return leaveMsgModel.find({
            msgContent: {
                $regex: new RegExp(searchVal),
                $options: 'i'
            },

        });
    }

}






module.exports = {
    saveLeaveMsg,
    LeaveMsgList,
    deleteLeaveMsg,
    updateLeaveMsg,
    searchDiscuss
}
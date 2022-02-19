let mongoose=require('mongoose');
mongoose.set('useCreateIndex',true);   //允许创建索引

//管理员注册接口的数据库骨架
let adminSchema=new mongoose.Schema({
    adminName:{type:String,required:true,index:{unique:true}},  //唯一的
    adminPassword:{type:String,required:true},
    adminEmail:{type:String,required:true},
    date:{type:Date,default:Date.now()},
})

//注册接口的数据库模型
let adminModel=mongoose.model('admin',adminSchema);
adminModel.createIndexes();  //使得索引唯一值生效


//数据保存的方法
let adminSave=(data)=>{
    let admin=new adminModel(data);
    // console.log(admin);
    return admin.save().then((res)=>{
        console.log(res);
        return true
    }).catch((e)=>{
        console.log(e);
        return false
    })
}

//数据查找的方法
let adminLogin=(data)=>{
    return adminModel.findOne(data);
}

//修改密码的方法
let updatePassword=(email,password)=>{
    return adminModel.updateOne({adminEmail:email},{$set:{adminPassword:password}}).then(()=>{
        return true
    }).catch(()=>{
        return false
    })
}

//返回所有管理员数据的方法
let adminList=()=>{
    return adminModel.find();
}



//删除（注销）管理员账号
let deleteAdmin=(email)=>{
    return adminModel.deleteOne({adminEmail:email})
}



module.exports={
    adminSave,
    adminLogin,
    updatePassword,
    adminList,
    deleteAdmin
}

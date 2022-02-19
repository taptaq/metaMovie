let iconNumModel=require('../models/iconNums');



//更新metaIcon的数量
let updateIconNum=async (req,res,next)=>{
    let total=await iconNumModel.getIconNum();
    let totalNum=total[0].iconNum;
    if(totalNum.toFixed(2)<0.01){
        res.send({
            msg: 'metaIcon的数量已为空',
            status:0
        })
        return;
    }
    let miningCount=total[0].miningCount;
    let yieldNum=total[0].yieldNum;
    let updateMiningCountResult=await iconNumModel.updateMiningCount(miningCount+1);
    if(updateMiningCountResult){
        let yieldIconNum=0;
        let total1=await iconNumModel.getIconNum();
        let totalNum1=total1[0].iconNum;
        let miningCount1=total1[0].miningCount;
        if(miningCount1>0){
            yieldIconNum=yieldNum
        } else if(miningCount1>(Math.pow(2,1))*(Math.pow(10,4))){
             yieldIconNum=yieldNum/2
        }else if(miningCount1>(Math.pow(2,2))*(Math.pow(10,4))){
             yieldIconNum=yieldNum/4
        } else if(miningCount1>(Math.pow(2,3))*(Math.pow(10,4))){
             yieldIconNum=yieldNum/8
        }else if(miningCount1>(Math.pow(2,4))*(Math.pow(10,4))){
             yieldIconNum=yieldNum/16
        }else if(miningCount1>(Math.pow(2,5))*(Math.pow(10,4))){
             yieldIconNum=yieldNum/32
        }else if(miningCount1>(Math.pow(2,6))*(Math.pow(10,4))){
            yieldIconNum=yieldNum/64
        }else if(miningCount1>(Math.pow(2,7))*(Math.pow(10,4))){
            yieldIconNum=yieldNum/128
        }else if(miningCount1>(Math.pow(2,8))*(Math.pow(10,4))){
            yieldIconNum=yieldNum/256
        }


        let result=await iconNumModel.updateIconNum(totalNum1-yieldIconNum);
        if(result){
            let total2=await iconNumModel.getIconNum();
            let totalNum2=total2[0].iconNum;

            if(totalNum2.toFixed(2)>0.01){
                res.send({
                    msg: '更新metaIcon的数量成功',
                    status:0,
                    iconNum:yieldIconNum
                })
            }else{
                res.send({
                    msg: '更新metaIcon的数量失败',
                    status:-1
                })
            }
        }
    }
}



//增加metaIcon数量
let editIconNum=async (req,res,next)=>{
    let {iconNum,editType}=req.body;
    let newIconNum=0;
    let total=await iconNumModel.getIconNum();
    iconNum=Number(iconNum);
    total=Number(total[0].iconNum)
    console.log(iconNum,'iconNum')
    console.log(total,'total')
    newIconNum=editType==='add'?total+iconNum:total-iconNum;
    console.log(newIconNum,'newIconNum');

    let result=await iconNumModel.updateIconNum(newIconNum);
    if(result){
        res.send({
            msg: '更新metaIcon的数量成功',
            status:0,
        })
    }else{
        res.send({
            msg: '更新metaIcon的数量失败',
            status:-1,
        })
    }
}


//获取metaIcon的总数
let getTotalIconNum=async (req,res,next)=>{
    let total=await iconNumModel.getIconNum();
    let totalNum=total[0].iconNum;

    if(totalNum){
            res.send({
                msg: '获取metaIcon的数量成功',
                status:0,
                totalNum:totalNum
            })
    }
    else {
        res.send({
            msg: '获取metaIcon的数量失败',
            status: -1
        })
    }
}








module.exports={
    updateIconNum,
    getTotalIconNum,
    editIconNum
}
let iconRateModel=require('../models/iconRates');

let dayJs = require('dayjs')  //处理日期

//生成每天的metaIcon兑换率
let generateMetaIconRate=async (req,res,next)=>{
    let {isTomorrow}=req.body;
    let thisYear= dayJs().year();
    let thisMonth= dayJs().month()+1;
    let thisDate= dayJs().date();
    // console.log(thisMonth,'month')
    // console.log(thisDate,'date')
    let thisMonthDays=dayJs(thisMonth).daysInMonth();
    let iconRateData=[];
    let initIconRate=1;
    let newIconRate=0;
    let todayIconRate=0;
    let yesterdayIconRate=0;
    //近7天的兑换率
    if(!isTomorrow){
        for(let i=6;i>=0;i--){
            let item=dayJs().subtract(i, 'day')['$d'];
            let today=`${item.getFullYear()}-${item.getMonth()+1}-${item.getDate()}`
            let isRateExits=await iconRateModel.isExitsIconRate(today);
            // console.log(isRateExits,'isExits');
            //对应的兑换率不存在，则直接生成新的
            if(isRateExits==null){
                newIconRate=initIconRate+Number((Math.random()*0.5-0.2).toFixed(3));
                let obj={};
                obj.rateDate=today;
                obj.iconRate=newIconRate;
                let isSaveSuccess=await iconRateModel.saveIconRate(obj);
                if(isSaveSuccess){
                    iconRateData.push(obj)
                }
            }else{
                let obj={};
                obj.rateDate=isRateExits.rateDate;
                obj.iconRate=isRateExits.iconRate;
                iconRateData.push(obj)
            }
        }

        //生成今天的兑换率（实时变化）
        // todayIconRate=initIconRate+Number((Math.random()*0.5-0.2).toFixed(3));
        // let obj={};
        // obj.rateDate=`${thisYear}-${thisMonth}-${thisDate}`;
        // obj.iconRate=todayIconRate;
        // iconRateData.push(obj)
    }
        // else{
    //     //保存昨天的兑换率
    //     yesterdayIconRate=initIconRate+Number((Math.random()*0.5-0.2).toFixed(3));
    //     let lastItem=dayJs().subtract(1, 'day')['$d'];
    //     let lastDay=`${lastItem.getFullYear()}-${lastItem.getMonth()+1}-${lastItem.getDate()}`
    //     let obj={};
    //     obj.rateDate=lastDay;
    //     obj.iconRate=yesterdayIconRate;
    //     // console.log(obj,'newObj');
    //     let isSaveSuccess=await iconRateModel.saveIconRate(obj);
    //     if(isSaveSuccess){
    //         iconRateData.push(obj)
    //     }
    // }


    if(iconRateData){
        res.send({
            msg: '生成每天的metaIcon兑换率成功',
            status:0,
            iconRateData:iconRateData,
            totalDays:thisMonthDays
        })
    }else{
        res.send({
            msg: '生成每天的metaIcon兑换率失败',
            status:-1
        })
    }
}


//生成上个月的metaIcon平均兑换率
let generateMetaIconRateAvg=async (req,res,next)=>{
    let thisYear= dayJs().year();
    let lastMonth = dayJs().subtract(1, "month")["$M"] + 1;
    if(lastMonth===12){
        thisYear-=1;
    }
    let result=await iconRateModel.iconRateMonthList(`${thisYear}-${lastMonth}-`);
    let sum=0;
    let avg=0;
    result.forEach(item=>{
        sum+=item.iconRate;
    })

    avg=(sum/result.length).toFixed(3);

    if(result){
        res.send({
            msg: '生成上个月的metaIcon平均兑换率成功',
            status:0,
            result:avg
        })
    }else{
        res.send({
            msg: '生成上个月的metaIcon平均兑换率失败',
            status:-1
        })
    }
}



module.exports={
    generateMetaIconRate,
    generateMetaIconRateAvg
}
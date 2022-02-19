const crypto = require('crypto');
const captcha = require('trek-captcha');
const querystring=require('querystring');
const xmlJs=require('xml-js');


//密码加密方法
var setCrypto=(info)=>{
    return crypto.createHmac('sha256', '$%%%%&**').update(info).digest('hex');
}

//图形验证码生成方法
var createVerifyImg=(req,res,next)=>{
    return captcha().then((info)=>{
        req.session.verifyImg=info.token;  //将图形验证码中的信息存入session
        return info.buffer;
    }).catch(()=>{
        return false
    })
}


//微信支付接口的生成签名算法
function getSign(data,key){
    let orderedData=Object.keys(data).sort().reduce((obj,key)=>{
        obj[key]=data[key];
        return obj;
    },{});

    //拼接字符串，注意url地址不编码
    let stringA=querystring.stringify(orderedData,null,null,{
        encodeURIComponent:(value)=>{
            return decodeURIComponent(value);  //把编码部分进行解码
        }
    })

    //拼接key值
    let stringSignTemp=stringA+'&key='+key;

    //利用md5加密
    let stringValue=crypto.createHash('md5').update(stringSignTemp).digest('hex');

    return stringValue;
}

//把文件转为xml数据格式
function getXml(data,sign){
//    整合对象
    let obj={
        xml:{
            ...data,
            sign
        }
    }

    let xmlBody=xmlJs.js2xml(obj,{
        compact:true
    })

    return xmlBody
}


//把xml文件转为js文件
function getJs(xml){
    let orderJs=xmlJs.xml2js(xml,{
        compact:true,
        textKey:'value',
        cdataKey:'value'
    })

    let prePayObj=Object.keys(orderJs.xml).sort().reduce((obj,key)=>{
        obj[key]=orderJs.xml[key]['value'];
        return obj
    },{})

    return prePayObj
}

module.exports={
    setCrypto,
    createVerifyImg,
    getSign,
    getXml,
    getJs
}

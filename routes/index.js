let express = require('express');
let router = express.Router();

let {alipaySdk,wechatSdk}=require('../untils/config');
let alipayFormData=require('alipay-sdk/lib/form').default;
let {getSign,getXml,getJs}=require('../untils/base');

let axios=require('axios');

let qrCode=require('qrcode');

let fs=require('fs');

let usersController=require('../controllers/users');   //引入user控制器



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//支付宝支付接口
router.post('/aliPayment', (req, res, next)=> {
  //前端给后端的数据
  let sum=req.body.sum;
  let name=req.body.name;
  let subject=req.body.subjectTitle;
  // console.log(req.body);

  //生成订单号(唯一且随机)
  let orderId=new Date().getTime()+Math.random().toString(36).slice(2,15);

  //后端处理
  let formData=new alipayFormData();
  formData.setMethod('get');
  formData.addField("signType", "RSA2");
  formData.addField('returnUrl','http://localhost:8081/aboutMine');
  formData.addField('bizContent',{
    outTradeNo:orderId,   //订单号
    productCode:'FAST_INSTANT_TRADE_PAY',
    totalAmount:sum,  //金额
    subject:subject ,  //商品标题
    body:name  //商品描述
  })

  let result=alipaySdk.exec('alipay.trade.page.pay',{},{formData:formData})

  result.then(data=>{
    res.send({
      success:'true',
      code:200,
      'msg':data
    })
  })
});


//支付宝支付后的订单状态查询
router.post('/queryOrderAliPay', async (req, res,next) => {
  let {orderId}=req.body;
  let formData = new alipayFormData();
  formData.setMethod('get');
  formData.addField("signType", "RSA2");
  formData.addField('bizContent', {
      outTradeNo:orderId
  });

  // 通过该接口主动查询订单状态
  const result = alipaySdk.exec(
      'alipay.trade.query',
      {},
      { formData: formData },
  );

    result.then(url=>{
        axios({
            method: 'GET',
            url: url
        }).then(data => {
            let r = data.data.alipay_trade_query_response;
            if(r.code === '10000') { // 接口调用成功
                switch(r.trade_status) {
                    case 'WAIT_BUYER_PAY':
                        res.send(
                            {
                                "success": true,
                                "message": "success",
                                "code": 200,
                                "timestamp": (new Date()).getTime(),
                                "result": {
                                    "status":0,
                                    "message":'交易创建，等待买家付款'
                                }
                            }
                        )
                        break;
                    case 'TRADE_CLOSED':
                        res.send(
                            {
                                "success": true,
                                "message": "success",
                                "code": 200,
                                "timestamp": (new Date()).getTime(),
                                "result": {
                                    "status":1,
                                    "message":'未付款交易超时关闭，或支付完成后全额退款'
                                }
                            }
                        )
                        break;
                    case 'TRADE_SUCCESS':
                        res.send(
                            {
                                "success": true,
                                "message": "success",
                                "code": 200,
                                "timestamp": (new Date()).getTime(),
                                "result": {
                                    "status":2,
                                    "message":'交易支付成功'
                                }
                            }
                        )
                        break;
                    case 'TRADE_FINISHED':
                        res.send(
                            {
                                "success": true,
                                "message": "success",
                                "code": 200,
                                "timestamp": (new Date()).getTime(),
                                "result": {
                                    "status":3,
                                    "message":'交易结束，不可退款'
                                }
                            }
                        )
                        break;
                }
            } else if(r.code === '40004') {
                res.send({
                    "success": false,
                    "message": "fail",
                    "code": 200,
                    "timestamp": (new Date()).getTime(),
                    "result": {
                        "status":-1,
                        "message":'交易不存在'
                    }})
            }
        })
            .catch(err => {
                // console.log(err,'err');
                res.json({
                    msg: '查询失败',
                    err
                });
            });

    })

})


//微信支付接口
router.post('/wechatPayment',(req,res,next)=>{
  //前端给后端的数据
  let sum=req.body.sum;
  let name=req.body.name;
  console.log(name)

  let appid=wechatSdk.appid;  // appid
  let mch_id=wechatSdk.mch_id;  //商户id
  let nonce_str=Math.random().toString(36).slice(2,15);   //随机字符串
  let body=name;   // 商品描述
  let out_trade_no=new Date().getTime()+Math.random().toString(36).slice(2,15);  //商户订单号
  let total_fee=sum*100;   //金额（单位为分）
  let notify_url=wechatSdk.notify_url;  //回调结果地址
  let trade_type=wechatSdk.trade_type;  //交易类型

  //整合数据
  let payData={
    appid,
    mch_id,
    nonce_str,
    body,
    out_trade_no,
    total_fee,
    notify_url,
    trade_type
  }

  let sign=getSign(payData,wechatSdk.key); //签名算法

  //将数据转成xml文件
  let xmlBody=getXml(payData,sign);

  //调用统一下单接口
  axios({
    method: "post",
    url: wechatSdk.unifiedorder,
    data: xmlBody,
  }).then((result) => {
    let unifiedorderRes=getJs(result.data);
    //获取预支付的url
    let {code_url}=unifiedorderRes;
    //将url转化为二维码
    qrCode.toDataURL(code_url,(err,url)=>{
      res.send({
        code:200,
        msg:'生成支付二维码',
        data:url
      });
    });

  });
})


//城市数据接口
router.get('/cityData',(req,res,next)=>{
  let data = fs.readFileSync('public/data/city.json', 'utf-8');
  if(data){
    res.send({
      msg:'获取城市数据成功',
      status:0,
      data
    })
  }
})





module.exports = router;

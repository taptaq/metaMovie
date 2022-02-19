let nodemailer = require('nodemailer');

let mongoose = require('mongoose');

let Alipay = require('alipay-sdk').default;

let Mongoose = {
    url: 'mongodb://192.168.62.128:27017/spiderDB', //连接数据库的url(spiderDB为要连接的数据库名)
    connect() { //数据库的连接方法
        mongoose.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }, (err) => {
            if (err) {
                console.log('数据库连接失败');
            }
            console.log('数据库连接成功');
        })
    }
};

//发送邮箱验证码的配置
let Email = {
    config: {
        host: "smtp.qq.com",
        port: 587,
        auth: {
            user: '2902716634@qq.com', // 发送人
            pass: 'aeuumzynulqkdhbg', // smtp服务的密钥(授权码)
        },
    },
    //使用默认的SMTP传输创建可重用的传输对象
    get transporter() { //加上get可直接通过对象来调用此方法
        return nodemailer.createTransport(this.config);
    },
    //生成验证码
    get verify() {
        return Math.random().toString().substring(2, 6); //截取四位
    },
    //获取当前时间
    get time() {
        return Date.now();
    }
}

//设置用户头像的基础公共路径
var Head = {
    baseUrl: 'http://localhost:8895/images/users/'
}

//设置电影海报的基础公共路径
var bg = {
    baseUrl: 'http://localhost:8895/images/bg/'
}


//支付宝支付接口配置
let alipaySdk = new Alipay({
    appId: "2021000118626229",
    // appId:"2021000119612341",
    signType: 'RSA2', //算法签名
    gateway: 'https://openapi.alipaydev.com/gateway.do', //支付宝网关地址
    alipayPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhLBkyP3VkantL6QtK0677XtRWepUURgq03NWXOO9DMzOyaFqmDi+yu4+RETEyTko/LWPyGdgFNS7BZ2uFwfQv+FwOxcLgJw6i6YwHaXYbva0FQkV3AMX7s/C2Kzas7jUiuBZUjAJELC5afXlWMd5wsoXs+UW5EDarBImYXit0th/TL0xOVy5+c6dBZClkEd/7efDQCeYrN+FqM0dHpv4S2Yx/OCHrjukJbcY3c67ac6Gv6dkjOQ8XBqUbZN5wm4tPpMdWX6RwxmAKgok/zLxGYrfMzSiirJpDF6JHkEQOIBTt46oH7fR7wC43K/l7LKBTdXx1sFdPS95l/5UpIc4OQIDAQAB', //支付宝公钥
    // alipayPublicKey:'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCRa4M3gLiWZ4Bb5NM2PDTycc90YXOyEenuKCAIotRLRb57ujK+SnlCpJ/pL0DsXSSZ5b2txuhn+zNQB2tyZyMOzbpU3U/R9iWbq48fSHXLWM1Pm+dd/XzWxWabLGwkm06V7fgM03t6HhjcRqcL0p+GJTwc6k4dQR4u5roWbTEwNwIDAQAB',

    privateKey: 'MIIEpAIBAAKCAQEAmqWSQ3qcTXVp2pNS5TDoGWpkxP0vfwzL7Ws+7KMm6AuoMNWtWtA+P0aabF/nZ6CvclAcFWhJK3ig5M5mnfgz6TRZkkdDw6Y/cFhu7eRFABd2mKGVOlMr3TfFXLiXIupPWS3QZpgZmQEbARxG3eYcH75OqksPxrEa7zAmd30ZhYwU6K70RvI2B0fGgJ+FFQAf7hhpOfOQzq92OeeEoKBeDzmfyFEiibow5KlAk97oxtWzMti8+DfW/jDCSYHfqCSwxt2VjHp7qAIX1v5nx4RJUlK5GM21CoI9uIL88wzYd5TwtpjXAVo8G0DcVCoMDy7g9zKr8yzHzR0+VcyRDkgtcQIDAQABAoIBADxexmpxQvM6EsixGns+TF0fm5cK/6+pXzKf20ClsFqFsnLd936sLKCm/0GvbraVk+gcPdpdi7LctHKd4JFqg1lWhmEEUP/ftoQ1AZj8s7MFdda/vXG3ZjhFvVYk+Vs3/SHjMKfcWKHSPKiCUWfunKwHrs3r34zBNrKJKXsb6wqmuIdBao04SvyeIKvYPBk560nPTtZwyLr428olBLdcVwWF1H7cbx8J49UnTqOdWSzukIR2JYNaIp/IqsJ1saOgnIX8xKtHxu5KL5mMlZgkmNjELdj6BjXih+acsuW07mIPvoTid3oesPvloQBm32ictCoJUvBwy+nqhKrpxExsYMECgYEA3VsenuiHndnLwKCI0nR9xwhAA3QyGcuRfMWGjw47dCNZ8r7LA3s7hRd3EcGHYmJ1ve+GwubMH8HkvOwL2gWEeGo74vlNxlCPs3tP4I2tRZd3JBsKZG45j9hhl/cS9AZ3FFmtv4B+kIuoolFFs8jevTmLs8acLMqbyq7uF5ikWcMCgYEAstmsA0BKAxNMBSKZ5nwbMpi7LD0xtA2B+CTNCcfbZ2vTP3tYg1MWas98bm6jw8SEfIRqDVhZPpS4JKIjsIdi5nwUD/4oNBSDizmeXd9xBVt3xgKltFqOL04Suu8W/Vj11HjEEFU/yBzllgIsO008esSPyQHH4GLSUQQQHQUVNLsCgYAI/biCr+NCUCRskJi+I6kwOm+PNFsMnS4tqUBL80IK95yhtYo9e/Xw9AEMIZZEMsehjWcl54YHDDMkUVox4uN8mKQSFhpIoeEUYz/dWSPencZjGw4TAj8oTpu4Nnr4moKfuvzJuIhriqCw5ygzo0cY3IuGI90YHKqzUuOs5bBXTQKBgQCxevaKp2KK2LxooCSPJ3sp44xiYzuOjJT8NTDPUuf0InkYlwOIFoy5Y7r8L4kNvVcn5ZMEOTcetiBiIhA+nqtTQ6/5CuLEg9Lh90SjrRcQFOuvsHLVncNZSCWoIZjzwjL5LPqLpr1LjPl7uh5Anu20epihBMZfclF5GgoPcjrP/wKBgQDX/GRHmu9emMIm1bInUbPZwTBebo6sTZDsLcLsetUKOlfSigODOjdjbnS80ylTLNR0zk2FXDhaSGzwULF5fE36c/m1/8SjJ223x9L8dD5wv6HBDw3E+8RbrqqRHf/CPe7XkfyKEWSVqyRvZ7AP49b/wPQzelxa02dYc2Drl/iaVA==' //应用私钥
    // privateKey:'MIICWwIBAAKBgQCRa4M3gLiWZ4Bb5NM2PDTycc90YXOyEenuKCAIotRLRb57ujK+SnlCpJ/pL0DsXSSZ5b2txuhn+zNQB2tyZyMOzbpU3U/R9iWbq48fSHXLWM1Pm+dd/XzWxWabLGwkm06V7fgM03t6HhjcRqcL0p+GJTwc6k4dQR4u5roWbTEwNwIDAQABAoGAez+tCciOKeN1Fe1d2dSzZ1xwYIoL3btzEgduBwPCfD2TURgh08gY+BPA+Ii1NN9ImyrtVTCFX0O3XLe9KEwjmCw9pQxuLtBdxFNMuHqFGu26w/Cm70Gf+wmK4wb88jhv6oEUZwkkRT4Jk3tWd3Vsnyrwi8HtyJ7C+9+eNyZbVlkCQQDFcM0sAovaBYHUfYq+6AzLTLli0ZiA/hYZHRUJ4W49LeyQaijOQ8D8KZSUhLK7yyA/7TIiH+Wrtcejq2O9npazAkEAvIzn5wt9gYqAu6LtP3MSGmuKIve2d8+5EOGA7W8Tm6tVbbosGJi5cvuL5yoEovsJPtr90H4RZrQLwSpBalvibQJAIlaZ+FuBAywOBmzHIqitAPaZD2ywf06xfTCnpg5E4/MGv58W9bim6bQ5mRLzGuIa+8M/AtxVT2XQENEQCbx5LQJAL1jOzxTykjn+c5/JJbq2nA3PJVLA7jsqRNPrtTPEX73ZePFcK10GjJogGo9RlL+nJbKGM/nEUt75aKs8vAGQzQJAIBVxwd/v4EN2so39HJUgyvjFiTJn5Fw0JPRCbGQGK7Pst914rTl8F2TrKeTh7QS3aIgM6yZ0QHS8mvuzX1IDSw=='
})


//微信支付接口配置
let wechatSdk = {
    unifiedorder: 'https://api.mch.weixin.qq.com/pay/unifiedorder', //统一下单地址
    appid: 'wx632c8f211f8122c6', // appid
    mch_id: '1497984412', //商户号
    notify_url: 'https://www.baidu.com', //支付结果的回调地址
    key: 'sbNCm1JnevqI36LrEaxFwcaT0hkGxFnC', //拼接API的密钥
    trade_type: 'NATIVE' //支付交易类型
}

module.exports = {
    Mongoose,
    Email,
    Head,
    bg,
    alipaySdk,
    wechatSdk
}
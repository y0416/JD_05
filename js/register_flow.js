// 定义并立即执行匿名函数，创建私有作用域
(function(){
  // 定义本地存储的键名，用于存储注册流程的状态数据
  var STORAGE_KEY = 'registerFlow';
  
  // 获取当前注册状态的函数
  function getState(){
    try { 
      // 尝试从localStorage读取数据并解析，如果不存在或解析失败则返回空对象
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; 
    } catch(e){ 
      // 如果解析出错（如格式错误），返回空对象
      return {}; 
    }
  }
  
  // 保存状态更新的函数
  function saveState(update){
    // 获取当前完整状态
    var s = getState();
    // 遍历update对象的每个属性，更新到状态对象中
    Object.keys(update||{}).forEach(function(k){ 
      s[k] = update[k]; 
    });
    // 将更新后的状态保存回localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    // 返回更新后的完整状态
    return s;
  }
  
  // 重置注册状态（清除数据）的函数
  function reset(){ 
    // 从localStorage中移除注册流程数据
    localStorage.removeItem(STORAGE_KEY); 
  }
  
  // 验证手机号格式的函数
  function validatePhone(phone){
    // 使用正则表达式验证：以1开头，第二位3-9，总共11位数字
    return /^1[3-9]\d{9}$/.test(String(phone||'').trim());
  }
  
  // 生成随机字符串的函数
  function randomString(len){
    // 定义字符集（排除易混淆字符：I、L、1、0、O）
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var out = ''; 
    // 循环生成指定长度的字符串
    for (var i=0;i<len;i++){ 
      // 从字符集中随机选取一个字符
      out += chars[Math.floor(Math.random()*chars.length)]; 
    }
    return out;
  }
  
  // 绘制验证码图像的函数
  function drawCaptcha(canvas){
    // 如果canvas元素不存在，直接返回空字符串
    if (!canvas) return '';
    
    // 获取canvas的2D绘图上下文
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    
    // 清除整个canvas区域
    ctx.clearRect(0,0,w,h);
    
    // 绘制背景
    ctx.fillStyle = '#f6f6f6';
    ctx.fillRect(0,0,w,h);
    
    // 生成4位随机验证码
    var code = randomString(4);
    
    // 添加干扰线
    for (var i=0;i<8;i++){ 
      // 随机生成线条颜色（半透明黑色）
      ctx.strokeStyle = 'rgba(0,0,0,'+(0.1+Math.random()*0.3)+')'; 
      // 开始绘制路径
      ctx.beginPath(); 
      // 设置线条起点（随机位置）
      ctx.moveTo(Math.random()*w, Math.random()*h); 
      // 设置线条终点（随机位置）
      ctx.lineTo(Math.random()*w, Math.random()*h); 
      // 绘制线条
      ctx.stroke(); 
    }
    
    // 添加噪点（干扰点）
    for (var j=0;j<30;j++){ 
      // 随机生成点颜色（更透明的黑色）
      ctx.fillStyle = 'rgba(0,0,0,'+(Math.random()*0.2)+')'; 
      // 绘制1x1像素的小点
      ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1); 
    }
    
    // 绘制验证码文字
    for (var k=0;k<code.length;k++){
      // 获取当前字符
      var ch = code[k];
      // 保存当前绘图状态
      ctx.save();
      // 设置字体样式
      ctx.font = 'bold 26px sans-serif';
      // 设置字体颜色
      ctx.fillStyle = '#333';
      // 随机生成文字旋转角度（-0.3到0.3弧度之间）
      var angle = (Math.random()*0.6 - 0.3);
      // 移动绘图原点到字符位置（横向间距26像素，垂直居中）
      ctx.translate(20 + k*26, h/2 + 6);
      // 旋转画布
      ctx.rotate(angle);
      // 绘制字符
      ctx.fillText(ch, 0, 0);
      // 恢复之前的绘图状态
      ctx.restore();
    }
    
    // 将验证码保存到状态中，用于后续验证
    saveState({ captchaCode: code });
    // 返回生成的验证码字符串
    return code;
  }
  
  // 验证用户输入验证码是否正确的函数
  function verifyCaptcha(input){
    // 获取当前状态
    var s = getState();
    // 获取保存的验证码并转为小写（忽略大小写）
    var code = (s.captchaCode||'').toLowerCase();
    // 将用户输入转为小写后比较，同时确保验证码非空
    return String(input||'').trim().toLowerCase() === code && code.length>0;
  }
  
  // 根据当前状态创建用户对象的函数
  function createUserFromState(){
    // 获取当前完整状态
    var s = getState();
    // 生成用户名：如果没有指定用户名，则使用"JD_手机号后4位_随机数"
    var username = s.username || ('JD_' + (s.phone||'').slice(-4) + '_' + Math.floor(Math.random()*1000));
    
    // 构建用户对象
    var user = {
      username: username,        // 用户名
      phone: s.phone || '',      // 手机号
      email: s.email || '',      // 邮箱
      createdAt: Date.now()      // 创建时间戳
    };
    return user;
  }
  
  // 将所有函数暴露到全局对象RegFlow中，供外部调用
  window.RegFlow = {
    getState: getState,                  // 获取状态
    saveState: saveState,                // 保存状态
    reset: reset,                        // 重置状态
    validatePhone: validatePhone,        // 验证手机号
    drawCaptcha: drawCaptcha,            // 绘制验证码
    verifyCaptcha: verifyCaptcha,        // 验证验证码
    createUserFromState: createUserFromState  // 创建用户对象
  };
})(); // 立即执行函数结束
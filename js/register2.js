// 定义并立即执行匿名函数，创建私有作用域
(function(){
  // 简化版选择器函数：返回匹配的第一个DOM元素
  function q(sel){ return document.querySelector(sel); }
  
  // 事件绑定辅助函数：如果元素存在，则绑定事件监听器
  function on(el, ev, fn){ el && el.addEventListener(ev, fn); }
  
  // 提示消息显示函数：设置元素文本内容和颜色
  function tip(el, text){ 
    if(el){ 
      el.textContent = text||''; // 设置文本，空文本则清空
      el.style.color = text ? '#e2211c' : ''; // 有文本时设为红色，无文本时重置
    } 
  }
  
  // 验证邮箱格式函数
  function validateEmail(email){ 
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email||'').trim()); 
  }
  
  // 验证密码长度函数（至少6位）
  function validatePwd(p){ 
    var s = String(p||''); 
    return s.length>=6; 
  }
  
  // 当DOM内容加载完成时执行
  document.addEventListener('DOMContentLoaded', function(){
    // 导航守卫：检查是否从正确的注册流程进入
    // 1. 检查RegFlow对象是否存在
    if (!window.RegFlow){ 
      window.location.href = 'register.html'; 
      return; 
    }
    // 2. 获取注册状态，要求手机号已验证且当前步骤为第2步
    var state = RegFlow.getState();
    if (!state.verified || state.step !== 2){ 
      window.location.href = 'register.html'; 
      return; 
    }

    // 初始化验证码
    var canvas = q('#captchaCanvas'); // 获取验证码canvas元素
    if (window.RegFlow) RegFlow.drawCaptcha(canvas); // 绘制初始验证码
    var refreshBtn = q('#refreshCaptcha'); // 获取刷新验证码按钮
    on(refreshBtn, 'click', function(){ 
      RegFlow.drawCaptcha(canvas); // 点击刷新按钮时重新绘制验证码
    });

    // 获取表单元素
    var username = q('input[name="username"]');      // 用户名输入框
    var password = q('input[name="password"]');      // 密码输入框
    var confirm = q('input[name="confirm"]');        // 确认密码输入框
    var email = q('input[name="email"]');            // 邮箱输入框
    var captchaInput = q('input[name="captcha"]');   // 验证码输入框
    var finishBtn = q('#finishRegister');            // 完成注册按钮

    // 显示/隐藏密码功能（立即执行函数）
    (function(){
      var eye = document.querySelector('.eye-btn');         // 眼睛按钮
      var icon = eye ? eye.querySelector('.eye-icon') : null; // 眼睛图标
      if (eye && icon && confirm){ // 确认所有必需元素都存在
        eye.addEventListener('click', function(){
          // 判断当前是否显示明文
          var show = confirm.getAttribute('type') !== 'text';
          // 切换输入框类型（text/password）
          confirm.setAttribute('type', show ? 'text' : 'password');
          // 更新aria-pressed属性（无障碍支持）
          eye.setAttribute('aria-pressed', show ? 'true' : 'false');
          // 切换图标样式类
          icon.classList.toggle('open', show);
          icon.classList.toggle('closed', !show);
        });
      }
    })();

    // 设置提示消息函数（带样式类）
    function setHint(id, text, type){
      var el = document.getElementById(id); // 根据ID获取提示元素
      if (!el) return;
      el.textContent = text || ''; // 设置文本
      el.classList.remove('ok','error'); // 移除已有样式类
      if (type === 'ok') el.classList.add('ok');    // 成功样式
      if (type === 'error') el.classList.add('error'); // 错误样式
    }
    
    // 评估密码强度等级
    function strengthLevel(pwd){
      var s = String(pwd||'');
      var len = s.length; // 密码长度
      var groups = 0;     // 字符类别计数
      
      // 检查包含的字符类别
      if (/[a-z]/.test(s)) groups++; // 小写字母
      if (/[A-Z]/.test(s)) groups++; // 大写字母
      if (/\d/.test(s)) groups++;    // 数字
      if (/[^A-Za-z0-9]/.test(s)) groups++; // 特殊字符
      
      // 根据长度和字符类别确定强度等级
      if (len >= 8 && groups >= 3) return 'strong'; // 强：至少8位且3类以上字符
      if (len >= 6 && groups >= 2) return 'medium'; // 中：至少6位且2类以上字符
      return 'weak'; // 弱：其他情况
    }
    
    // 更新密码强度显示
    function updateStrength(pwd){
      var meter = document.getElementById('pwdStrength'); // 强度指示器
      if (!meter) return;
      var level = strengthLevel(pwd); // 获取强度等级
      // 更新样式类
      meter.classList.remove('weak','medium','strong');
      meter.classList.add(level);
      // 更新强度文字标签
      var label = meter.querySelector('.level');
      if (label){ 
        label.textContent = level==='strong' ? '强' : (level==='medium' ? '中' : '弱'); 
      }
    }

    // 为用户名输入框添加实时验证
    if (username){ 
      username.addEventListener('input', function(){
        var v = username.value.trim();
        if (v.length >= 3) 
          setHint('hint-username', '账号名可用', 'ok'); // 成功提示
        else if (v.length === 0) 
          setHint('hint-username', '', ''); // 清空提示
        else 
          setHint('hint-username', '账号名至少3个字符', 'error'); // 错误提示
      }); 
    }
    
    // 为密码输入框添加实时验证
    if (password){ 
      password.addEventListener('input', function(){
        var v = password.value;
        updateStrength(v); // 更新密码强度显示
        
        if (v.length === 0) { 
          setHint('hint-password', '', ''); 
          return; 
        }
        
        var hasLetter = /[A-Za-z]/.test(v), hasDigit = /\d/.test(v);
        if (v.length >= 6 && hasLetter && hasDigit) 
          setHint('hint-password', '密码合规', 'ok');
        else 
          setHint('hint-password', '至少6位，需包含字母和数字', 'error');
        
        // 同步检查确认密码一致性
        if (confirm){ 
          var cv = confirm.value; 
          if (cv){
            if (cv === v) 
              setHint('hint-confirm', '两次输入一致', 'ok');
            else 
              setHint('hint-confirm', '两次输入不一致', 'error');
          } 
        }
      }); 
    }
    
    // 为确认密码输入框添加实时验证
    if (confirm){ 
      confirm.addEventListener('input', function(){
        var v = confirm.value, pv = password ? password.value : '';
        if (v.length === 0) { 
          setHint('hint-confirm', '', ''); 
          return; 
        }
        if (v === pv) 
          setHint('hint-confirm', '两次输入一致', 'ok');
        else 
          setHint('hint-confirm', '两次输入不一致', 'error');
      }); 
    }
    
    // 为邮箱输入框添加实时验证
    if (email){ 
      email.addEventListener('input', function(){
        var v = email.value.trim();
        if (v.length === 0) { 
          setHint('hint-email', '', ''); 
          return; 
        }
        if (validateEmail(v)) 
          setHint('hint-email', '邮箱格式正确', 'ok');
        else 
          setHint('hint-email', '邮箱格式不正确', 'error');
      }); 
    }
    
    // 为验证码输入框添加实时验证
    if (captchaInput){ 
      captchaInput.addEventListener('input', function(){
        var v = captchaInput.value.trim();
        if (v.length < 4){ 
          setHint('hint-captcha', '请输入4位验证码', 'error'); 
          return; 
        }
        if (RegFlow.verifyCaptcha(v)) 
          setHint('hint-captcha', '验证码正确', 'ok');
        else 
          setHint('hint-captcha', '验证码错误', 'error');
      }); 
    }

    // 检查所有字段是否都有效（用于控制提交按钮状态）
    function allValid(){
      var u = username && username.value.trim();            // 用户名
      var p = password && password.value || '';             // 密码
      var c = confirm && confirm.value || '';               // 确认密码
      var e = email && email.value.trim();                  // 邮箱
      var cap = captchaInput && captchaInput.value.trim();  // 验证码
      
      var hasUser = !!u && u.length >= 3; // 用户名至少3位
      var hasPwd = validatePwd(p) && /[A-Za-z]/.test(p) && /\d/.test(p); // 密码有效且包含字母和数字
      var match = p === c && c.length > 0; // 两次密码一致且非空
      var mailOk = validateEmail(e); // 邮箱格式正确
      var capOk = !!cap && cap.length >= 4 && RegFlow.verifyCaptcha(cap); // 验证码正确
      
      return hasUser && hasPwd && match && mailOk && capOk; // 所有条件都满足
    }
    
    // 更新提交按钮状态（启用/禁用）
    function updateSubmitState(){ 
      if (finishBtn) finishBtn.disabled = !allValid(); 
    }
    
    // 为所有输入框绑定输入事件，实时更新提交按钮状态
    [username, password, confirm, email, captchaInput].forEach(function(el){ 
      if (el) el.addEventListener('input', updateSubmitState); 
    });
    
    // 刷新验证码后更新提交按钮状态
    if (refreshBtn) refreshBtn.addEventListener('click', function(){ 
      setTimeout(updateSubmitState, 50); // 延迟50ms确保验证码已刷新
    });
    
    updateSubmitState(); // 初始更新一次

    // 完成注册按钮点击事件
    on(finishBtn, 'click', function(){
      var errs = []; // 错误信息数组
      
      // 逐项验证并收集错误
      if (!username || username.value.trim().length < 3) 
        errs.push('账号名至少3个字符');
      
      var pwdVal = password && password.value || '';
      if (!validatePwd(pwdVal)) 
        errs.push('密码至少6位');
      
      // 检查密码是否包含字母和数字
      if (!(/[A-Za-z]/.test(pwdVal) && /\d/.test(pwdVal))) 
        errs.push('密码需包含字母和数字');
      
      // 检查两次密码是否一致
      if ((password && password.value) !== (confirm && confirm.value)) 
        errs.push('两次密码不一致');
      
      // 检查邮箱格式
      if (!validateEmail(email && email.value)) 
        errs.push('邮箱格式不正确');
      
      // 检查验证码
      if (!RegFlow.verifyCaptcha(captchaInput && captchaInput.value)) 
        errs.push('验证码错误');
      
      var msgBox = document.querySelector('.verify-msg'); // 获取消息显示框
      
      // 如果有错误，显示第一个错误并停止
      if (errs.length){ 
        tip(msgBox, errs[0]); 
        return; 
      }

      // 所有验证通过，保存注册信息
      RegFlow.saveState({ 
        username: username.value.trim(), 
        email: email.value.trim(), 
        step: 3 
      });
      
      // 创建用户对象
      var user = RegFlow.createUserFromState();
      
      // 保存用户信息到localStorage（模拟注册成功）
      try { 
        localStorage.setItem('jd_user', JSON.stringify(user)); 
      } catch(e){}
      
      // 跳转到注册完成页面
      window.location.href = 'register_3.html';
    });
  });
})(); // 立即执行函数结束
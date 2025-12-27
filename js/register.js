// 定义并立即执行匿名函数，创建私有作用域
(function(){
  // 简化版选择器函数：返回匹配的第一个DOM元素
  function $(sel){ return document.querySelector(sel); }
  
  // 事件绑定辅助函数：如果元素存在，则绑定事件监听器
  function on(el, ev, fn){ el && el.addEventListener(ev, fn); }
  
  // 显示消息提示的函数
  function showMsg(text, type){
    // 获取消息显示容器
    var box = document.querySelector('.verify-msg');
    // 如果容器不存在则退出
    if (!box) return;
    // 设置消息文本内容
    box.textContent = text || '';
    // 根据消息类型设置颜色：错误为红色(#e2211c)，成功为绿色(#2fb02f)
    box.style.color = (type==='error' ? '#e2211c' : '#2fb02f');
  }
  
  // 当DOM内容加载完成时执行
  document.addEventListener('DOMContentLoaded', function(){
    // 获取页面元素
    var phoneInput = document.querySelector('input[name="phone"]');  // 手机号输入框
    var btnVerify = document.querySelector('.btn-verify');            // 验证按钮
    var btnAgree = document.querySelector('.btn-agree');              // 同意协议按钮
    var agreeChk = document.querySelector('.agree input[type="checkbox"]');  // 同意协议复选框

    // 给验证按钮绑定点击事件
    on(btnVerify, 'click', function(){
      // 获取手机号输入值并去除空格
      var phone = phoneInput ? phoneInput.value.trim() : '';
      // 检查RegFlow对象是否存在，并验证手机号格式
      if (!window.RegFlow || !RegFlow.validatePhone(phone)){
        // 格式不正确则显示错误消息
        showMsg('手机号格式不正确，请重新输入', 'error');
        return; // 停止执行
      }
      // 验证成功，保存状态信息
      RegFlow.saveState({ 
        phone: phone,      // 保存手机号
        verified: true,    // 标记已验证
        step: 1           // 当前步骤设为第1步
      });
      // 显示成功消息
      showMsg('手机号已验证成功', 'ok');
      // 可选操作：自动勾选同意协议复选框
      if (agreeChk) agreeChk.checked = true;
    });

    // 给同意协议按钮绑定点击事件
    on(btnAgree, 'click', function(){
      // 获取当前注册状态
      var s = RegFlow.getState();
      // 检查是否已完成手机号验证
      if (!s.verified){ 
        showMsg('请先完成手机号验证', 'error'); 
        return; // 停止执行
      }
      // 检查是否已勾选同意协议
      if (!agreeChk || !agreeChk.checked){ 
        showMsg('请勾选协议后继续', 'error'); 
        return; // 停止执行
      }
      // 所有检查通过，更新步骤状态
      RegFlow.saveState({ step: 2 });
      // 跳转到注册流程的第二个页面
      window.location.href = 'register_2.html';
    });
  });
})(); // 立即执行函数结束
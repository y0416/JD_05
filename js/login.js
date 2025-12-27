// 页面加载完成后执行
$(function() {
    // 获取本地注册用户信息
    function getRegisteredUser(){
        try { return JSON.parse(localStorage.getItem('jd_user')) || null; }
        catch(e){ return null; }
    }

    // 如果尚未注册则引导到注册页
    if (!getRegisteredUser()) {
        window.location.href = 'register.html';
        return;
    }

    // 获取所有的tab选项卡元素（登录方式选择）
    var $tabs = $('.tabs .tab');
    // 获取所有的登录表单容器
    var $forms = $('.login-form');
    // 获取验证码显示元素
    var $captchaText = $('.captcha-text');
    // 存储当前验证码的变量
    var currentCaptcha = '';

    // 验证手机号格式的函数
    function isPhone(value) {
        // 正则表达式：以1开头，第二位是3-9，后面是9位数字
        return /^1[3-9]\d{9}$/.test(value);
    }

    // 验证邮箱格式的函数
    function isEmail(value) {
        // 正则表达式：基本邮箱格式验证
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    // 生成验证码的函数
    function generateCaptcha() {
        // 定义验证码字符集（去除容易混淆的字符：I、L、1、0、O）
        var chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
        var code = '';
        // 生成4位验证码
        for (var i = 0; i < 4; i++) {
            // 从字符集中随机选取一个字符
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        // 保存当前验证码
        currentCaptcha = code;
        // 在页面上显示验证码
        $captchaText.text(code);
    }

    // 切换选项卡的函数
    function switchTab(targetId) {
        // 移除所有tab的active类，设置aria-selected为false
        $tabs.removeClass('active').attr('aria-selected', 'false');
        // 隐藏所有表单，移除active类
        $forms.removeClass('active').hide();
        // 为选中的tab添加active类，设置aria-selected为true
        $tabs.filter('[data-target="' + targetId + '"]').addClass('active').attr('aria-selected', 'true');
        // 显示对应ID的表单，添加active类
        $('#' + targetId).addClass('active').show();
    }

    // 给所有tab绑定点击事件
    $tabs.on('click', function() {
        // 获取点击的tab对应的目标表单ID
        var target = $(this).data('target');
        // 切换到对应的表单
        switchTab(target);
    });

    // 给验证码区域和刷新按钮绑定点击事件
    $('.captcha-box, .captcha-refresh').on('click', function() {
        // 点击时重新生成验证码
        generateCaptcha();
    });

    // 短信登录表单的提交事件
    $('#sms-panel').on('submit', function(event) {
        // 阻止表单默认提交行为
        event.preventDefault();
        // 获取手机号输入值并去除空格
        var phone = $.trim($(this).find('input[name="phone"]').val());
        // 获取验证码输入值并转换为大写
        var code = $.trim($(this).find('input[name="code"]').val()).toUpperCase();
        var regUser = getRegisteredUser();
        // 手机号验证
        if (!phone) {
            alert('请输入手机号');
            return; // 停止执行
        }
        // 验证码非空验证
        if (!code) {
            alert('请输入验证码');
            return; // 停止执行
        }
        // 验证码正确性验证
        if (code !== currentCaptcha) {
            alert('验证码错误，请重试');
            generateCaptcha(); // 重新生成验证码
            return; // 停止执行
        }
        // 校验是否已注册且手机号匹配
        if (!regUser || regUser.phone !== phone) {
            alert('该手机号未注册，请先注册');
            window.location.href = 'register.html';
            return;
        }
        // 登录成功，保存用户信息到本地存储
        try {
            localStorage.setItem('jd_user', JSON.stringify({ 
                type: 'sms',       // 登录方式为短信
                phone: phone,      // 手机号
                loginAt: Date.now() // 登录时间戳
            }));
        } catch(e){
            // 忽略localStorage异常
        }
        // 提示登录成功
        alert('登录成功');
        // 跳转到首页
        window.location.href = 'index.html';
    });

    // 密码登录表单的提交事件
    $('#password-panel').on('submit', function(event) {
        // 阻止表单默认提交行为
        event.preventDefault();
        // 获取用户名输入值并去除空格
        var username = $.trim($(this).find('input[name="username"]').val());
        // 获取密码输入值并去除空格
        var password = $.trim($(this).find('input[name="password"]').val());
        var regUser = getRegisteredUser();
        // 用户名非空验证
        if (!username) {
            alert('请输入账号');
            return; // 停止执行
        }
        // 用户名格式验证
        if (!isPhone(username) && !isEmail(username)) {
            alert('账号格式不正确，请输入11位手机号或邮箱');
            return; // 停止执行
        }
        // 密码非空验证
        if (!password) {
            alert('请输入密码');
            return; // 停止执行
        }
        // 密码长度验证
        if (password.length < 6 || password.length > 20) {
            alert('密码长度需为6-20位');
            return; // 停止执行
        }
        // 密码空格验证
        if (/\s/.test(password)) {
            alert('密码不能包含空格');
            return; // 停止执行
        }
        // 校验是否已注册且账号匹配（用户名/手机号/邮箱任一匹配即可）
        if (!regUser || (regUser.username !== username && regUser.phone !== username && regUser.email !== username)) {
            alert('该账号未注册，请先注册');
            window.location.href = 'register.html';
            return;
        }
        // 登录成功，保存用户信息到本地存储
        try {
            localStorage.setItem('jd_user', JSON.stringify({ 
                type: 'password',  // 登录方式为密码
                account: username, // 账号（手机号或邮箱）
                loginAt: Date.now() // 登录时间戳
            }));
        } catch(e){
            // 忽略localStorage异常
        }
        // 提示登录成功
        alert('登录成功');
        // 跳转到首页
        window.location.href = 'index.html';
    });

    // 初始化操作
    // 先隐藏所有表单
    $forms.hide();
    // 切换到短信登录面板（默认面板）
    switchTab('sms-panel');
    // 生成初始验证码
    generateCaptcha();
});
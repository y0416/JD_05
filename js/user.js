// 页面加载完成后执行
$(function() {
    // 格式化用户显示名称的函数
    function formatName(user) {
        // 如果没有用户信息，返回默认值
        if (!user) return "未登录用户";
        // 如果有手机号，格式化为带星号的保护格式（如：138****1234）
        if (user.phone) return user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        // 如果有账户信息（可能是邮箱或用户名），直接使用
        if (user.account) return user.account;
        // 其他情况返回默认值
        return "京东用户";
    }

    // 初始化用户信息显示的函数
    function initUserInfo() {
        // 从本地存储获取用户信息
        var user = null;
        try { 
            // 尝试从localStorage读取并解析用户数据
            user = JSON.parse(localStorage.getItem('jd_user')) || null; 
        } catch(e) {} // 忽略解析错误
        
        // 1. 更新用户名称显示
        $('#uc-name').text(formatName(user));
        
        // 2. 更新用户头像显示
        // 获取用户名称用于生成头像
        var name = (user && (user.username || user.account)) || formatName(user);
        // 生成备用头像（首字母头像）如果window下有该函数
        var fallback = window.generateInitialAvatar ? window.generateInitialAvatar(name) : '';
        // 优先使用用户自定义头像，否则使用备用头像
        var avatarUrl = (user && user.avatar) ? user.avatar : fallback;
        
        // 获取头像元素：img元素（用于显示图片头像）和div元素（用于显示首字母头像）
        var $img = $('#uc-avatar-img');
        var $init = $('#uc-avatar');
        
        if ($img.length && avatarUrl) {
            // 如果存在图片头像URL，显示img元素，隐藏首字母div
            $img.attr('src', avatarUrl).show();
            $init.hide();
        } else {
            // 否则生成首字母头像
            // 取用户名的前两个字符并转为大写
            var initials = (formatName(user) || 'JD').substring(0,2).toUpperCase();
            // 获取背景颜色（如果window下有颜色生成函数）
            var bg = window.initialColor ? window.initialColor(name) : '#edf0f3';
            // 设置首字母div的内容和样式
            $init.text(initials).css({ 
                background: bg,  // 背景色
                color: '#fff'    // 文字颜色
            }).show();
            // 隐藏图片元素
            $img.hide();
        }
        
        // 3. 更新用户等级显示
        $('#uc-level').text(user ? '普通会员' : '未登录');
        
        // 4. 如果用户未登录，调整相关UI
        if (!user) {
            // 将VIP标签改为"去登录"
            $('.uc-hero__tags .tag-vip').text('去登录');
            // 隐藏退出登录按钮
            $('#uc-logout').hide();
        }
    }

    // 页面加载时立即初始化用户信息
    initUserInfo();

    // 退出登录按钮点击事件
    $('#uc-logout').on('click', function() {
        // 调用全局的退出登录函数（如果存在）
        if (window.logoutUser) { 
            window.logoutUser(); 
        }
        // 跳转到登录页面
        window.location.href = 'login.html';
    });

    // 头像上传功能
    $('#uc-avatar-upload').on('change', function(evt){
        // 获取用户选择的文件
        var file = (evt.target && evt.target.files && evt.target.files[0]) || null;
        // 如果没有文件选择，直接返回
        if (!file) return;
        
        // 创建FileReader对象读取文件
        var reader = new FileReader();
        
        // 文件读取完成时的回调函数
        reader.onload = function(e){
            // 获取文件的DataURL（base64编码的图片数据）
            var dataUrl = e.target.result;
            
            // 获取当前用户信息
            var user = null; 
            try { 
                user = JSON.parse(localStorage.getItem('jd_user')) || {}; 
            } catch(err){ 
                user = {}; 
            }
            
            // 更新用户头像URL
            user.avatar = dataUrl;
            
            // 保存更新后的用户信息到localStorage
            try { 
                localStorage.setItem('jd_user', JSON.stringify(user)); 
            } catch(err){}
            
            // 更新当前页面的用户信息显示
            initUserInfo();
            
            // 如果存在更新页面头部登录状态的函数，调用它以同步更新首页
            if (window.updateHeaderLoginState) 
                window.updateHeaderLoginState();
        };
        
        // 开始读取文件为DataURL
        reader.readAsDataURL(file);
    });
});
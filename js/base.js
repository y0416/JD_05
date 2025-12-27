// 页面加载完成后执行
$(function() {

    // 当鼠标移入导航栏的li元素时
    $(".nav>li").mouseover(function() {
        // 显示当前li元素下的下拉层（dropdown-layer）
        $(this).children(".dropdown-layer").show();
    });

    // 当鼠标移出导航栏的li元素时
    $(".nav>li").mouseout(function() {
        // 隐藏当前li元素下的下拉层
        $(this).children(".dropdown-layer").hide();
    });

    // 当点击关闭按钮时
    $(".close-btn").click(function() {
        // 隐藏自己（关闭按钮）和同级的所有img元素
        $(this).hide().siblings("img").hide();
    });

    // 全站购物车徽标更新功能定义开始
    function getCartCount() {
        try {
            // 从localStorage读取购物车数据，若无则返回空数组
            var list = JSON.parse(localStorage.getItem("cartItems")) || [];
            var count = 0;
            // 遍历购物车列表，累加每个商品的数量（默认为1）
            list.forEach(function(it) { count += parseInt(it.qty || 1, 10); });
            // 返回总数
            return count;
        } catch (e) { 
            // 若解析失败，返回0
            return 0; 
        }
    }

    // 更新购物车徽标显示（侧边栏与头部同步）
    function updateCartBadge() {
        // 读取购物车总数
        var count = getCartCount();
        // 侧边栏徽标
        var $badge = $(".fixedtool .sb-cart .badge");
        if ($badge.length) {
            if (count > 0) {
                $badge.text(count).show();
            } else {
                $badge.text("0").hide();
            }
        }
        // 头部购物车数量
        var $headerCount = $(".shopCar span");
        if ($headerCount.length) {
            // 头部通常保持显示，直接同步数字
            $headerCount.text(count);
        }
    }

    // 暴露更新购物车徽标函数到全局对象，便于其他页面/脚本调用
    window.updateCartBadge = updateCartBadge;
    // 暴露获取购物车总数函数到全局对象
    window.getCartCount = getCartCount;

    // 初始加载时立即更新一次购物车徽标
    updateCartBadge();

    // 监听localStorage的变化事件，实现跨页面实时同步购物车徽标
    window.addEventListener("storage", function(ev) {
        // 只有当变化的是cartItems键时，才更新徽标
        if (ev && ev.key === "cartItems") { 
            updateCartBadge(); 
        }
    });

    // 登录态相关工具函数开始
    // 获取当前登录用户信息
    function getUser() {
        try { 
            // 从localStorage读取jd_user数据并解析，若无则返回null
            return JSON.parse(localStorage.getItem('jd_user')) || null; 
        } catch(e) { 
            return null; 
        }
    }

    // 判断用户是否已登录
    function isLoggedIn() { 
        // 若getUser返回非null，则视为已登录
        return !!getUser(); 
    }

    // 用户登出，删除localStorage中的用户数据
    function logoutUser() { 
        localStorage.removeItem('jd_user'); 
    }

    // 将登录相关函数暴露到全局对象
    window.getUser = getUser;
    window.isLoggedIn = isLoggedIn;
    window.logoutUser = logoutUser;

    // 生成首字母头像（以SVG格式Data URI形式返回）
    function generateInitialAvatar(text) {
        // 获取文本，若无则用'JD'
        text = String(text || 'JD').trim();
        // 取第一个字符的大写作为首字母
        var initial = text.charAt(0).toUpperCase();
        // 定义一组背景颜色
        var colors = ['#E2211C','#2FB02F','#1A73E8','#F5A623','#7B61FF','#FF6F61'];
        // 根据用户名计算颜色索引（简单哈希）
        var code = 0; 
        for (var i=0;i<text.length;i++){ 
            code = (code + text.charCodeAt(i)) % colors.length; 
        }
        // 选定背景色
        var bg = colors[code];
        // 构建SVG字符串（圆形背景+首字母文字）
        var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>"
                + "<rect width='64' height='64' rx='32' fill='"+bg+"'/>"
                + "<text x='50%' y='52%' text-anchor='middle' dominant-baseline='middle' font-family='Arial, sans-serif' font-size='28' fill='#fff'>"+initial+"</text>"
                + "</svg>";
        // 将SVG编码为Data URI返回
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }
    // 暴露头像生成函数到全局对象
    window.generateInitialAvatar = generateInitialAvatar;

    // 根据文本获取颜色（逻辑与头像生成函数相同）
    function initialColor(text){
        text = String(text || 'JD').trim();
        var colors = ['#E2211C','#2FB02F','#1A73E8','#F5A623','#7B61FF','#FF6F61'];
        var code = 0; 
        for (var i=0;i<text.length;i++){ 
            code = (code + text.charCodeAt(i)) % colors.length; 
        }
        return colors[code];
    }
    // 暴露颜色生成函数到全局对象
    window.initialColor = initialColor;

    // 更新页面头部登录区的显示状态（若已登录则显示用户信息）
    function updateHeaderLoginState() {
        // 选择登录区元素
        var $lt = $(".login-t");
        // 若元素不存在则直接返回
        if (!$lt.length) return;
        // 获取当前用户信息
        var user = getUser();
        // 若用户已登录
        if (user) {
            // 获取用户名，若无则用默认名
            var name = user.username || "京东用户";
            // 若用户有自定义头像则使用，否则生成首字母头像
            var avatar = (user && user.avatar) ? user.avatar : generateInitialAvatar(name);
            // 构建用户信息HTML：欢迎语、两个链接、用户头像
            var html = ''
                + 'Hi，' + name + '！<br/>'
                + '<a href="user.html">我的京东</a>'
                + '<span class="sep"> | </span>'
                + '<a href="pay.html">我的订单</a>'
                + '<a href="#" class="user_info"><img class="avatar" src="'+avatar+'" alt="用户头像" style="width:40px;height:40px;border-radius:50%;object-fit:cover"></a>';
            // 将生成的HTML替换到登录区
            $lt.html(html);
        } else {
            // 若用户未登录，保持页面原有的登录/注册链接（由模板提供）
        }
    }

    // 暴露头部登录状态更新函数到全局对象
    window.updateHeaderLoginState = updateHeaderLoginState;
    // 初始加载时立即更新一次头部登录状态
    updateHeaderLoginState();

    // 监听localStorage中jd_user的变化，当登录状态变化时更新头部显示
    window.addEventListener("storage", function(ev) {
        if (ev && ev.key === "jd_user") { 
            updateHeaderLoginState(); 
        }
    });
});
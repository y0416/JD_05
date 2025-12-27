$(function() {
    // 页面加载完成后执行
    $(document).ready(function() {
        // 立即执行倒计时函数
        countdown();
        // 设置每秒执行一次倒计时
        setInterval(countdown, 1000);
    });
    
    // 定义倒计时函数
    function countdown() {
        // 获取当前时间戳（毫秒）
        var nowtime = +new Date();
        // 获取目标时间戳（2019年11月25日24点）
        var inputtime = +new Date('2019-11-25 24:00:00');
        // 计算剩余时间（秒）
        var times = (inputtime - nowtime) / 1000;
        
        // 计算小时数，并格式化为两位数
        var h = parseInt(times / 60 / 60 % 24);
        h = h < 10 ? '0' + h : h;
        // 将小时数显示到页面上
        $(".hour").html(h);
        
        // 计算分钟数，并格式化为两位数
        var m = parseInt(times / 60 % 60);
        m = m < 10 ? '0' + m : m;
        // 将分钟数显示到页面上
        $(".minute").html(m);
        
        // 计算秒数，并格式化为两位数
        var s = parseInt(times % 60);
        s = s < 10 ? '0' + s : s;
        // 将秒数显示到页面上
        $(".second").html(s);
    };

    // 判断是否在首页左侧导航区域，避免影响其他页面
    // 检查是否存在左侧内容区域
    if ($('.grid-col1 .content').length) {
        // 左侧导航项鼠标移入事件
        $("#navi li").mouseover(function() {
            // 显示左侧内容区域
            $(".grid-col1 .content").show();
            // 获取当前导航项的索引
            var index = $(this).index();
            // 显示对应索引的内容，隐藏其他内容
            $(".grid-col1 .content>div").eq(index).show().siblings().hide();
        });
        // 左侧导航项鼠标移出事件
        $("#navi li").mouseout(function() {
            // 隐藏左侧内容区域
            $(".grid-col1 .content").hide();
        });
    }

    // 新闻标签切换功能
    // 新闻标签鼠标移入事件
    $(".news-t a").mouseover(function() {
        // 获取当前标签的索引
        var index = $(this).index();
        // 显示对应索引的新闻内容，隐藏其他
        $(".news-b ul").eq(index).show().siblings().hide();
        // 显示对应索引的红色指示线，隐藏其他
        $(".redline").eq(index).show().siblings('.redline').hide();
    })
    
    // 限定首页分类浮层的悬停显示/隐藏
    // 再次检查是否存在左侧内容区域
    if ($('.grid-col1 .content').length) {
        // 左侧内容区域鼠标移入事件
        $(".grid-col1 .content").mouseover(function() {
            // 显示该区域
            $(this).show();
        });
        // 左侧内容区域鼠标移出事件
        $(".grid-col1 .content").mouseout(function() {
            // 隐藏该区域
            $(this).hide();
        });
    }

    // 轮播图指示器初始化
    // 根据轮播图数量创建对应数量的指示点
    for(var i = 0; i < $(".t-img li").length; i++) {
        // 在指示器容器中添加li元素
        $(".circle").append("<li></li>");
    }
    // 默认激活第4个指示点（索引从0开始）
    $(".circle li").eq(3).addClass("current");

    // 当前轮播图索引，从第4张开始（索引3）
    var index=3;
    
    // 指示点鼠标移入事件
    $(".circle li").mouseover(function() {
        // 获取当前指示点的索引
        var index = $(this).index();
        // 为当前指示点添加激活样式，移除兄弟元素的激活样式
        $(this).addClass("current").siblings().removeClass("current");
        // 淡入显示对应索引的轮播图，淡出其他轮播图
        $(".t-img li").eq(index).stop().fadeIn(1000).siblings().stop().fadeOut(1000);
    });

    // 设置自动轮播定时器，每2秒切换一次
    var time = setInterval(move,2000);
    
    // 定义自动轮播函数
    function move() {
        // 索引递增
        index++;
        // 如果索引超出轮播图数量，重置为0
        if (index==$(".t-img li").length){
            index=0
        }
        // 更新指示点激活状态
        $(".circle li").eq(index).addClass("current").siblings().removeClass("current");
        // 切换轮播图
        $(".t-img li").eq(index).stop().fadeIn(1000).siblings().stop().fadeOut(1000);
    };
    
    // 轮播区域鼠标悬停事件
    $(".grid-col2-t").hover(
        // 鼠标移入时，清除自动轮播定时器
        function () {
            clearInterval(time);
        },
        // 鼠标移出时，重新开始自动轮播
        function () {
            time=setInterval(move,2000);
        }
    );
    
    // 右箭头点击事件
    $(".arrow-r").click(function () {
        // 切换到下一张
        move();
    });
    
    // 定义向左切换函数
    function moveL() {
        // 索引递减
        index--;
        // 如果索引小于0，跳转到最后一张
        if (index==-1){
            index=$(".t-img li").length-1;
        }
        // 更新指示点激活状态
        $(".circle li").eq(index).addClass("current").siblings().removeClass("current");
        // 切换轮播图
        $(".t-img li").eq(index).stop().fadeIn(1000).siblings().stop().fadeOut(1000);
    }
    
    // 左箭头点击事件
    $(".arrow-l").click(function () {
        // 切换到上一张
        moveL();
    });

    // 固定导航栏交互：点击定位并随滚动高亮（立即执行函数）
    (function() {
        // 定义导航项与对应页面区域的映射关系
        var sections = [
            // 类名 -> 目标选择器
            { cls: ".seckill", target: ".recommend-wall" },
            { cls: ".discover", target: ".recommend-wall" },
            { cls: ".appliance", target: ".home_electric" },
            { cls: ".phone", target: ".phone_address" },
            { cls: ".pc", target: ".computer_working" },
            { cls: ".service", target: "footer" }
        ];

        // 过滤掉页面上不存在的目标区域
        sections = sections.filter(function(item) {
            // 只保留页面上存在的元素
            return $(item.target).length > 0;
        });

        // 存储各个区域的顶部偏移量
        var offsetTopList = [];

        // 刷新各区域顶部偏移量的函数
        function refreshOffsets() {
            offsetTopList = sections.map(function(item) {
                return {
                    cls: item.cls,  // 导航项类名
                    top: $(item.target).offset().top  // 区域顶部距离文档顶部的距离
                };
            });
        }

        // 根据滚动位置高亮对应导航项
        function highlightByScroll() {
            // 获取当前滚动位置，加120像素作为缓冲
            var scrollTop = $(window).scrollTop() + 120;
            // 默认第一个为当前区域
            var current = offsetTopList[0];
            // 遍历所有区域，找到当前滚动位置所在的区域
            offsetTopList.forEach(function(item) {
                if (scrollTop >= item.top) {
                    current = item;
                }
            });
            // 如果有匹配的区域
            if (current) {
                // 移除所有导航项的高亮样式
                $(".fixedtool li").removeClass("current");
                // 为当前区域对应的导航项添加高亮样式
                $(".fixedtool " + current.cls).addClass("current");
            }
        }

        // 导航项点击事件
        $(".fixedtool li").on("click", function() {
            // 获取导航项的类名（排除ft-item类）
            var cls = this.className.split(" ").filter(function(c) { 
                return c.indexOf("ft-item") === -1; 
            })[0];
            // 在sections数组中查找对应的配置
            var match = sections.find(function(item) { 
                return item.cls.indexOf(cls) !== -1; 
            });
            if (!match) return;
            // 计算目标滚动位置（区域顶部减去60像素偏移）
            var top = $(match.target).offset().top - 60;
            // 平滑滚动到目标位置
            $("html, body").stop().animate({ scrollTop: top }, 300);
        });

        // 窗口滚动时触发高亮函数
        $(window).on("scroll", highlightByScroll);
        // 窗口大小改变时刷新偏移量并重新高亮
        $(window).on("resize", function() {
            refreshOffsets();
            highlightByScroll();
        });

        // 初始化：刷新偏移量并设置初始高亮状态
        refreshOffsets();
        highlightByScroll();
    })();

    // 新侧边栏交互：回顶部与收起功能（立即执行函数）
    (function() {
        // 回顶部按钮点击事件
        $(document).on('click', '.fixedtool .sb-top', function() {
            // 平滑滚动到页面顶部
                // 使用jQuery的动画效果实现平滑滚动到页面顶部
    
                // 选择html和body元素，确保跨浏览器兼容性
                // .stop() - 停止当前正在进行的任何动画，防止动画队列堆积
                // .animate() - 执行动画效果
                // { scrollTop: 0 } - 将scrollTop属性（垂直滚动位置）设置为0，即页面顶部
                // 300 - 动画持续时间300毫秒（0.3秒），提供平滑的滚动体验
            $("html, body").stop().animate({ scrollTop: 0 }, 300);
        });
        
        // 收起/展开按钮点击事件
        $(document).on('click', '.fixedtool .sb-collapse', function() {
            // 获取侧边栏元素
            var $bar = $('.fixedtool.sidebar');
            // 切换收起/展开状态
            $bar.toggleClass('collapsed');
            // 获取按钮文字元素
            var $label = $(this).find('.label');
            // 根据状态更新按钮文字
            if ($bar.hasClass('collapsed')) {
                $label.text('展开');
            } else {
                $label.text('收起');
            }
        });
    })();

    // 侧边栏功能按钮交互（立即执行函数）
    (function() {
        // 打开模态框函数
        function openModal(opts) {
            // 创建模态框容器
            var $modal = $('<div class="sb-modal" role="dialog" aria-modal="true"></div>');
            // 创建对话框
            var $dlg = $('<div class="dialog"></div>');
            // 创建标题
            var $title = $('<h4></h4>').text(opts.title || '提示');
            // 创建内容区域
            var $content = $('<div class="content"></div>').html(opts.html || '');
            // 创建操作按钮区域
            var $actions = $('<div class="actions"></div>');
            // 创建关闭按钮
            var $close = $('<button type="button" class="btn-close">关闭</button>');
            // 添加关闭按钮到操作区域
            $actions.append($close);
            
            // 如果有提交回调函数，添加确定按钮
            if (typeof opts.onSubmit === 'function') {
                var $ok = $('<button type="button" class="btn-primary">确定</button>');
                $actions.prepend($ok);
                // 确定按钮点击事件
                $ok.on('click', function(){ opts.onSubmit($modal); });
            }
            
            // 关闭按钮点击事件
            $close.on('click', function(){ $modal.remove(); });
            // 组装对话框
            $dlg.append($title, $content, $actions);
            // 将对话框添加到模态框
            $modal.append($dlg);
            // 将模态框添加到页面body
            $('body').append($modal);
            
            // 点击模态框背景关闭
            $modal.on('click', function(e){ 
                if (e.target === this) $(this).remove(); 
            });
            
            // ESC键关闭模态框
            $(document).on('keydown.sbmodal', function(ev){ 
                if (ev.key === 'Escape') { 
                    $modal.remove(); 
                    $(document).off('keydown.sbmodal'); 
                } 
            });
            
            return $modal;
        }

        // 显示短暂提示信息函数
        function toast(text) {
            // 创建提示元素
            var $t = $('<div class="sb-toast"></div>').text(text);
            // 添加到页面body
            $('body').append($t);
            // 延迟10毫秒后显示
            setTimeout(function(){ $t.addClass('show'); }, 10);
            // 2秒后隐藏并移除
            setTimeout(function(){ 
                $t.removeClass('show'); 
                $t.remove(); 
            }, 2000);
        }

        // 首页按钮点击事件
        $(document).on('click', '.fixedtool .sb-home', function(){ 
            location.href = 'index.html'; 
        });
        
        // 购物车按钮点击事件
        $(document).on('click', '.fixedtool .sb-cart', function(){ 
            location.href = 'cart.html'; 
        });
        
        // 用户按钮点击事件
        $(document).on('click', '.fixedtool .sb-user', function(){
            // 检查用户是否登录（假设有全局函数isLoggedIn）
            if (window.isLoggedIn && window.isLoggedIn()) {
                location.href = 'user.html';
            } else {
                location.href = 'login.html';
            }
        });

        // 客服按钮点击事件
        $(document).on('click', '.fixedtool .sb-service', function(){
            openModal({
                title: '联系客服',
                html: '<div class="service-links">'
                    + '<p>QQ客服：<a href="#" aria-label="QQ客服">在线咨询</a></p>'
                    + '<p>微信客服：<img src="images/iconfonts/weixin.png" alt="微信客服" style="width:28px;height:28px;vertical-align:middle;margin-left:6px"></p>'
                    + '<p>电话：400-123-4567</p>'
                    + '</div>'
            });
        });

        // 手机查看按钮点击事件（显示二维码）
        $(document).on('click', '.fixedtool .sb-mobile', function(){
            openModal({
                title: '手机查看',
                html: '<div style="text-align:center"><img src="images/erweima.png" alt="二维码" style="width:200px;height:200px"></div>'
            });
        });

        // 反馈按钮点击事件
        $(document).on('click', '.fixedtool .sb-feedback', function(){
            openModal({
                title: '反馈',
                html: '<div class="feedback-form"><textarea placeholder="请输入您的反馈" style="width:100%;height:100px;border:1px solid #eee;border-radius:4px;padding:8px;resize:vertical"></textarea></div>',
                onSubmit: function($modal){
                    // 获取反馈内容
                    var txt = $modal.find('textarea').val().trim();
                    var list = [];
                    // 从本地存储获取已有反馈列表
                    try { 
                        list = JSON.parse(localStorage.getItem('feedbacks')) || []; 
                    } catch(e){}
                    // 添加新反馈
                    list.push({ text: txt, time: Date.now() });
                    // 保存到本地存储
                    localStorage.setItem('feedbacks', JSON.stringify(list));
                    // 关闭模态框
                    $modal.remove();
                    // 显示提交成功提示
                    toast('反馈已提交~');
                }
            });
        });

        // 插件版按钮点击事件
        $(document).on('click', '.fixedtool .sb-plugin', function(){
            openModal({ 
                title: '插件版', 
                html: '<p>插件版暂未开放，敬请期待。</p>' 
            });
        });
    })();

});
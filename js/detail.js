// 页面加载完成后执行
$(function() {
    // 当鼠标移入预览图片区域时
    $(".preview_img").mouseover(function(e) {
        // 显示半透明遮罩层
        $(this).children(".mask").show();
        // 显示右侧大图预览区域
        $(this).children(".big").show();
    });
    
    // 当鼠标移出预览图片区域时
    $(".preview_img").mouseout(function() {
        // 隐藏半透明遮罩层
        $(this).children(".mask").hide();
        // 隐藏右侧大图预览区域
        $(this).children(".big").hide();
    });
    
    // 当鼠标在预览图片区域内移动时（实现放大镜效果）
    $(".preview_img").mousemove(function(e) {
        // 计算鼠标相对于预览图片容器的坐标
        var x = e.pageX -  this.offsetLeft;
        var y = e.pageY -  this.offsetTop;
        
        // 计算遮罩层应该显示的位置（居中于鼠标）
        var maskX = x - parseInt($(this).children(".mask").css("width")) / 2;
        var maskY = y - parseInt($(this).children(".mask").css("height")) / 2;
        
        // 计算遮罩层可移动的最大范围（预览图片宽度减去遮罩层宽度）
        var maskMax = parseInt($(this).css("width")) - parseInt($(this).children(".mask").css("width"));
        
        // 边界检查：防止遮罩层移出预览图片区域
        if (maskX <= 0) {
            maskX = 0;
        } else if (maskX >= maskMax) {
            maskX = maskMax;
        }
        if (maskY <= 0) {
            maskY = 0;
        } else if (maskY >= maskMax) {
            maskY = maskMax;
        }
        
        // 设置遮罩层的显示位置
        $(this).children(".mask").css("left" , maskX + 'px');
        $(this).children(".mask").css("top" , maskY +'px');
        
        // 计算大图需要移动的距离（实现大图与遮罩层同步移动）
        var bigMax = parseInt($(".bigimg").css("width")) - parseInt($(".big").css("width"));
        var bigX = maskX * bigMax / maskMax;
        var bigY = maskY * bigMax / maskMax;
        
        // 设置大图的显示位置（负值表示向左/上移动）
        $(".bigimg").css("left" , -bigX + 'px');
        $(".bigimg").css("top" , -bigY + 'px');
    });
    
    // 当鼠标移入缩略图列表项时
    $(".list_item li").mouseover(function() {
        // 为当前缩略图添加选中样式
        $(this).addClass("current")
               // 移除其他兄弟元素的选中样式
               .siblings().removeClass("current");
        // 将预览区主图切换为当前缩略图的图片
        $(".preview_img img").attr('src',$(this).children("img")[0].src);
        // 同时切换右侧大图预览区的图片
        $(".big img").attr('src',$(this).children("img")[0].src);
    });
    
    // 当点击颜色选择链接时
    $(".choose_color a").click(function() {
        // 为当前点击的颜色选项添加选中样式
        $(this).addClass("current")
               // 移除同组其他颜色选项的选中样式
               .siblings().removeClass("current");
    });
    
    // 当点击版本选择链接时
    $(".choose_version a").click(function() {
        // 为当前点击的版本选项添加选中样式
        $(this).addClass("current")
               // 移除同组其他版本选项的选中样式
               .siblings().removeClass("current");
    });
    
    // 当点击类型选择链接时
    $(".choose_type a").click(function() {
        // 为当前点击的类型选项添加选中样式
        $(this).addClass("current")
               // 移除同组其他类型选项的选中样式
               .siblings().removeClass("current");
    });

    // 当鼠标移入减少数量按钮时
    $(".reduce").mouseover(function() {
        // 检查当前输入框的值是否小于等于1
        if ($(".choose_amount input[type='text']").val() <= 1) {
            // 如果是，设置鼠标样式为"禁止操作"
            $(".reduce").css("cursor","not-allowed");
        }
        else {
            // 否则，设置鼠标样式为"可点击"
            $(".reduce").css("cursor","pointer");
        }
    });
    
    // 当点击减少数量按钮时
    $(".reduce").click(function() {
        // 检查当前输入框的值是否小于等于1
        if ($(".choose_amount input[type='text']").val() <= 1) {
            // 如果是，设置鼠标样式为"禁止操作"（防止继续减少）
            $(".reduce").css("cursor","not-allowed");
        }
        else {
            // 否则，设置鼠标样式为"可点击"
            $(".reduce").css("cursor","pointer");
            // 获取当前数量
            num =  $(".choose_amount input[type='text']").val();
            // 将数量减1后设置回输入框
            $(".choose_amount input[type='text']").val(num-1);
        }
    });
    
    // 当点击增加数量按钮时
    $(".add").click(function() {
        // 获取当前数量
        num =  $(".choose_amount input[type='text']").val();
        // 将数量加1后设置回输入框（使用Number确保数值类型）
        $(".choose_amount input[type='text']").val(Number(num)+1);
    });

    // 当鼠标移入标签页列表项时（商品详情区的标签切换）
    $(".tab_list li").mouseover(function() {
        // 为当前标签添加选中样式
        $(this).addClass("current")
               // 移除其他标签的选中样式
               .siblings().removeClass("current");
    });

    // 当点击详情标签页列表项时（类似选项卡切换）
    $(".detail_tab_list li").click(function() {
        // 获取当前点击项的索引
        var index = $(this).index();
        // 为当前标签添加选中样式
        $(this).addClass("current")
               // 移除其他标签的选中样式
               .siblings().removeClass("current");
        // 显示对应索引的内容区域
        $(".item").eq(index).show()
                  // 隐藏其他内容区域
                  .siblings().hide();
    });

    // 加入购物车按钮点击事件
    $(".addCar").click(function(e) {
        // 阻止默认行为（通常是a标签的跳转）
        e.preventDefault();
        
        // 收集商品信息
        // 获取商品标题（去除前后空格）
        var title = $.trim($(".sku_name").text());
        // 获取商品价格（提取数字部分，转换为浮点数）
        var price = parseFloat($(".summary_price .price").text().replace(/[^\d.]/g, "")) || 0;
        // 获取商品图片URL
        var img = $(".preview_img img").attr("src") || "";
        // 获取选择的颜色
        var color = $(".choose_color a.current").text() || "";
        // 获取选择的版本
        var version = $(".choose_version").eq(0).find("a.current").text() || "";
        // 获取选择的内存大小
        var memory = $(".choose_version").eq(1).find("a.current").text() || "";
        // 获取选择的套餐类型
        var bundle = $(".choose_type").eq(0).find("a.current").text() || "";
        // 获取选择的包装类型
        var packageName = $(".choose_type").eq(1).find("a.current").text() || "";
        // 获取购买数量
        var qty = parseInt($(".choose_amount input[type='text']").val(), 10) || 1;

        // 获取现有购物车数据
        var cart = [];
        try {
            // 从localStorage读取购物车数据
            cart = JSON.parse(localStorage.getItem("cartItems")) || [];
        } catch (err) {
            // 如果读取失败，初始化为空数组
            cart = [];
        }

        // 将当前商品添加到购物车数组
        cart.push({
            title: title,
            price: price,
            img: img,
            color: color,
            version: version,
            memory: memory,
            bundle: bundle,
            packageName: packageName,
            qty: qty
        });
        // 保存购物车数据到localStorage并即时刷新徽标
        localStorage.setItem("cartItems", JSON.stringify(cart));
        if (window.updateCartBadge) { window.updateCartBadge(); }
        // 跳转到购物车页面
        window.location.href = "cart.html";
    });

    // 缩略图左右箭头滚动功能（立即执行函数）
    (function() {
        // 获取缩略图预览列表容器
        var $previewList = $(".preview_list");
        // 获取缩略图列表的ul元素
        var $ul = $previewList.find(".list_item");
        // 获取所有缩略图li元素
        var $lis = $ul.find("li");
        // 如果没有缩略图，直接退出
        if ($lis.length === 0) return;

        // 获取单个缩略图的宽度（包含margin）
        var liWidth = $lis.outerWidth(true);
        // 固定每屏显示4张缩略图
        var visibleCount = 4;
        // 获取缩略图总数
        var total = $lis.length;

        // 设置ul元素的样式，使其可以横向滚动
        $ul.css({
            // 设置ul总宽度为所有缩略图宽度之和
            width: liWidth * total,
            // 设置为相对定位，便于通过left属性移动
            position: "relative",
            // 初始位置为0
            left: 0,
            // 去除默认margin
            margin: 0
        });

        // 当前显示的最左侧缩略图索引
        var startIndex = 0;

        // 滑动到指定索引位置的函数
        function slideTo(index) {
            // 边界控制：不能小于0
            if (index < 0) index = 0;
            // 边界控制：不能超过最大可滚动索引
            if (index > total - visibleCount) index = total - visibleCount;
            // 更新当前起始索引
            startIndex = index;
            // 执行平滑滚动动画（200毫秒）
            $ul.stop(true).animate({ left: -startIndex * liWidth }, 200);
        }

        // 下一屏按钮点击事件
        $previewList.find(".arrow_next").on("click", function() {
            // 如果还有更多缩略图可以向右滚动
            if (startIndex < total - visibleCount) {
                // 向右滚动一整屏（4张图）
                slideTo(startIndex + visibleCount);
            }
        });

        // 上一屏按钮点击事件
        $previewList.find(".arrow_prev").on("click", function() {
            // 如果还有更多缩略图可以向左滚动
            if (startIndex > 0) {
                // 向左滚动一整屏（4张图）
                slideTo(startIndex - visibleCount);
            }
        });
    })(); // 立即执行函数结束
}); // 页面加载完成回调结束

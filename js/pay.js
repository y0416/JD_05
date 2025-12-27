// 页面加载完成后执行
$(function() {
    // 初始渲染订单列表
    renderOrderList();
    // 渲染完成后，若存在徽标更新函数则主动刷新一次
    if (window.updateCartBadge) { window.updateCartBadge(); }

    // 物流选择功能：为物流选项绑定点击事件
    $(".option-grid.logistics .option").on("click", function() {
        // 为当前点击的选项添加选中样式
        $(this).addClass("selected")
               // 移除其他兄弟元素的选中样式
               .siblings().removeClass("selected");
        
        // 获取选中的物流公司名称（从.title元素获取）
        const carrier = $(this).find(".title").text().trim();
        // 获取物流描述信息（从small元素获取）
        const desc = $(this).find("small").text().trim();
        
        // 更新配送信息显示区域
        $(".delivery-meta .value").text(
            // 格式化显示：物流公司 · 描述 · 预计送达时间
            `${carrier} · ${desc ? desc + " · " : ""}预计8月10日（周三）09:00-15:00送达`
        );
    });

    // 支付方式选择：为支付选项绑定点击事件
    $(".option-grid.pay .option").on("click", function() {
        // 为当前点击的选项添加选中样式
        $(this).addClass("selected")
               // 移除其他兄弟元素的选中样式
               .siblings().removeClass("selected");
    });

    // 提交订单按钮点击事件
    $(".pay-btn").on("click", function(e) {
        // 阻止按钮默认行为（如果是a标签或表单按钮的默认提交）
        e.preventDefault();
        
        // 显示提交成功提示
        alert("提交成功!");
        // 清空购物车数据
        try { localStorage.removeItem("cartItems"); } catch(e) {}
        // 支付提交后刷新一次购物车徽标（不改购物车业务逻辑）
        if (window.updateCartBadge) { window.updateCartBadge(); }
        
        // 跳转回首页
        window.location.href = "index.html";
    });

    // 加载购物车数据的函数
    function loadCart() {
        try {
            // 从localStorage读取购物车数据，如果没有则返回空数组
            return JSON.parse(localStorage.getItem("cartItems")) || [];
        } catch (e) {
            // 如果解析出错（如格式错误），返回空数组
            return [];
        }
    }

    // 渲染订单列表的函数
    function renderOrderList() {
        // 加载购物车数据
        const cart = loadCart();
        // 获取订单列表容器元素
        const $list = $(".order-list");
        // 如果容器不存在，直接返回
        if (!$list.length) return;
        // 清空列表容器原有内容
        $list.empty();

        // 如果购物车为空，添加一个演示商品
        if (!cart.length) {
            var demo = {
                title: "Apple iPhone 6s (A1700) 64G 玫瑰金色",
                img: "uploads/mobile.png",
                price: 5399,
                qty: 1,
                tag: "7天无理由退货",
                stock: "有货"
            };
            cart.push(demo);
        }

        // 初始化商品总金额
        let total = 0;
        // 遍历购物车中的每个商品
        cart.forEach(function(item) {
            // 获取商品数量，默认为1
            const qty = parseInt(item.qty, 10) || 1;
            // 获取商品价格，默认为0
            const priceNum = Number(item.price || 0);
            // 计算当前商品小计
            const sub = priceNum * qty;
            // 累加到总金额
            total += sub;
            
            // 构建订单项HTML结构
            const html =
                '<div class="order-item">' +
                    '<div class="thumb">' +  // 商品缩略图区域
                        '<img src="' + (item.img || "uploads/mobile.png") + '" alt="' + (item.title || "商品") + '">' +
                    '</div>' +
                    '<div class="info">' +  // 商品信息区域
                        '<p>' + (item.title || "未命名商品") + '</p>' +
                        '<span class="tag">' + (item.tag || "7天无理由退货") + '</span>' +
                    '</div>' +
                    '<div class="price">¥' + priceNum.toFixed(2) + '</div>' +  // 单价
                    '<div class="qty">x' + qty + '</div>' +  // 数量
                    '<div class="stock">' + (item.stock || "有货") + '</div>' +  // 库存状态
                '</div>';
            // 将HTML添加到列表容器
            $list.append(html);
        });

        // 更新总计金额（初始运费和返现均为0）
        updateTotals(total, 0, 0);
    }

    // 更新总计金额的函数
    function updateTotals(goodsTotal, cashback, freight) {
        // 将各项金额格式化为两位小数
        const goodsStr = goodsTotal.toFixed(2);
        const cashbackStr = (cashback || 0).toFixed(2);
        const freightStr = (freight || 0).toFixed(2);
        // 计算应付金额：商品总价 - 返现 + 运费
        const payable = (goodsTotal - (cashback || 0) + (freight || 0)).toFixed(2);

        // 更新页面显示的应付金额
        $(".summary-total").text('¥' + payable);
        
        // 获取所有明细行
        const $rows = $(".summary-breakdown .row");
        // 更新商品总额行
        $rows.eq(0).find("span").eq(1).text('¥' + goodsStr);
        // 更新返现行
        $rows.eq(1).find("span").eq(1).text('-¥' + cashbackStr);
        // 更新运费行
        $rows.eq(2).find("span").eq(1).text('¥' + freightStr);
    }
});
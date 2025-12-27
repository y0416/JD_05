// 当DOM加载完成后执行的函数
$(function() {
    // 初始渲染购物车
    renderCart();
    // 绑定所有事件监听器
    bindEvents();

    // 从localStorage加载购物车数据
    function loadCart() {
        try {
            // 尝试从localStorage解析购物车数据，如果不存在则返回空数组
            return JSON.parse(localStorage.getItem("cartItems")) || [];
        } catch (e) {
            // 如果解析失败（如数据损坏），返回空数组
            return [];
        }
    }

    // 保存购物车数据到localStorage
    function saveCart(list) {
        // 将购物车列表转为JSON字符串存储
        localStorage.setItem("cartItems", JSON.stringify(list));
        // 如果存在全局的更新购物车徽标函数，则调用它
        if (window.updateCartBadge) { window.updateCartBadge(); }
    }

    // 渲染购物车UI
    function renderCart() {
        // 加载购物车数据
        var cart = loadCart();
        // 获取购物车列表容器
        var $list = $(".cart-list");
        // 清空现有内容
        $list.empty();
        
        // 如果购物车为空
        if (!cart.length) {
            // 显示空购物车提示
            $list.html('<p class="empty">购物车为空</p>');
            // 重置总计显示
            $(".summoney span").html("0.00");
            $(".sumprice strong").text("0");
            // 取消全选状态
            $(".cart-th input[type='checkbox']").prop("checked", false);
            // 退出函数
            return;
        }
        
        // 遍历购物车中的每个商品
        cart.forEach(function(item, idx) {
            // 获取商品数量，默认为1
            var qty = item.qty || 1;
            // 计算小计金额（单价×数量）
            var sum = (Number(item.price || 0) * qty).toFixed(2);
            // 构建商品HTML结构
            var html = '' +
            // 商品列表项，使用data-index存储索引
            '<ul class="goods-list yui3-g" data-index="' + idx + '">' +
                // 第一列：选择框和商品信息
                '<li class="yui3-u-3-8 pr">' +
                    // 单个商品选择框，默认选中
                    '<input type="checkbox" class="good-checkbox" checked>' +
                    '<div class="good-item">' +
                        '<div class="item-img">' +
                            // 商品图片，默认使用备用图片
                            '<img src="' + (item.img || "uploads/mobile.png") + '">' +
                        '</div>' +
                        // 商品标题
                        '<div class="item-msg">' + (item.title || "") + '</div>' +
                    '</div>' +
                '</li>' +
                // 第二列：商品属性（颜色、版本等）
                '<li class="yui3-u-1-8">' +
                    '<span>颜色: ' + (item.color || "") + '</span><br>' +
                    '<span>版本: ' + (item.version || "") + '</span><br>' +
                    '<span>内存: ' + (item.memory || "") + '</span><br>' +
                    '<span>套餐: ' + (item.bundle || item.packageName || "") + '</span><br>' +
                '</li>' +
                // 第三列：单价
                '<li class="yui3-u-1-8">' +
                    '<span class="price">' + Number(item.price || 0).toFixed(2) + '</span>' +
                '</li>' +
                // 第四列：数量选择器
                '<li class="yui3-u-1-8">' +
                    '<div class="clearfix">' +
                        // 减少数量按钮
                        '<a href="javascript:;" class="increment mins">-</a>' +
                        // 数量输入框
                        '<input autocomplete="off" type="text" value="' + qty + '" minnum="1" class="itxt">' +
                        // 增加数量按钮
                        '<a href="javascript:;" class="increment plus">+</a>' +
                    '</div>' +
                    // 库存状态显示
                    '<div class="youhuo">有货</div>' +
                '</li>' +
                // 第五列：小计金额
                '<li class="yui3-u-1-8">' +
                    '<span class="sum">' + sum + '</span>' +
                '</li>' +
                // 第六列：操作按钮
                '<li class="yui3-u-1-8">' +
                    // 删除按钮
                    '<div class="del1"><a href="javascript:;">删除</a></div>' +
                    // 移动按钮
                    '<div>移到我的关注</div>' +
                '</li>' +
            '</ul>';
            // 将商品HTML添加到列表容器
            $list.append(html);
        });
        
        // 设置全选框为选中状态
        $(".cart-th input[type='checkbox']").prop("checked", true);
        // 设置所有商品选择框为选中状态
        $(".good-checkbox").prop("checked", true);
        // 计算总计
        me_sum();
    }

    // 计算选中的商品总金额和总数量
    function me_sum() {
        // 总金额
        var sum = 0;
        // 总数量
        var count = 0;
        
        // 遍历每个商品项
        $(".goods-list").each(function() {
            var $ul = $(this);
            // 获取商品选择框
            var checked = $ul.find(".good-checkbox")[0];
            // 如果未选中，跳过计算
            if (!checked || !checked.checked) return;
            
            // 获取商品数量
            var qty = parseInt($ul.find(".itxt").val(), 10) || 0;
            // 获取小计金额
            var sub = parseFloat($ul.find(".sum").text()) || 0;
            
            // 累加总数量和总金额
            count += qty;
            sum += sub;
        });
        
        // 更新UI显示
        $(".summoney span").html(sum.toFixed(2));
        $(".sumprice strong").text(count);
        
        // 更新购物车徽标
        if (window.updateCartBadge) { window.updateCartBadge(); }
    }

    // 从DOM同步数据到localStorage
    function syncStorageFromDom() {
        var cart = [];
        
        // 遍历每个商品项
        $(".goods-list").each(function() {
            var $ul = $(this);
            
            // 从DOM提取商品数据
            cart.push({
                // 商品标题
                title: $ul.find(".item-msg").text(),
                // 商品图片
                img: $ul.find(".item-img img").attr("src"),
                // 从属性文本中提取颜色（移除"颜色: "前缀）
                color: ($ul.find("li.yui3-u-1-8 span").eq(0).text().split(":")[1] || "").trim(),
                // 提取版本
                version: ($ul.find("li.yui3-u-1-8 span").eq(1).text().split(":")[1] || "").trim(),
                // 提取内存
                memory: ($ul.find("li.yui3-u-1-8 span").eq(2).text().split(":")[1] || "").trim(),
                // 提取套餐（兼容packageName字段）
                bundle: ($ul.find("li.yui3-u-1-8 span").eq(3).text().split(":")[1] || "").trim(),
                // 单价
                price: parseFloat($ul.find(".price").text()) || 0,
                // 数量
                qty: parseInt($ul.find(".itxt").val(), 10) || 1
            });
        });
        
        // 保存到localStorage
        saveCart(cart);
    }

    // 绑定所有事件监听器
    function bindEvents() {
        // 鼠标悬停效果：高亮当前商品行
        $(".cart-list").on("mouseover", "ul.goods-list", function() {
            $(this).addClass("active").siblings().removeClass("active");
        });

        // 全选/全不选功能
        $(".cart-th input[type='checkbox']").on("click", function() {
            // 获取全选框状态
            var checked = this.checked;
            // 设置所有商品选择框状态
            $(".good-checkbox").prop("checked", checked);
            // 重新计算总计
            me_sum();
        });

        // 单个商品选择框点击事件
        $(".cart-list").on("click", ".good-checkbox", function() {
            var all = true;
            // 检查是否所有商品都被选中
            $(".good-checkbox").each(function() {
                if (!this.checked) { 
                    all = false; 
                    // 发现未选中的就停止循环
                    return false; 
                }
            });
            // 更新全选框状态
            $(".cart-th input[type='checkbox']").prop("checked", all);
            // 重新计算总计
            me_sum();
        });

        // 增加数量按钮点击事件
        $(".cart-list").on("click", ".plus", function() {
            // 找到对应的商品行
            var $ul = $(this).closest(".goods-list");
            // 获取数量输入框
            var $input = $ul.find(".itxt");
            // 当前数量+1
            var qty = parseInt($input.val(), 10) || 1;
            qty += 1;
            $input.val(qty);
            
            // 重新计算小计金额
            var price = parseFloat($ul.find(".price").text()) || 0;
            $ul.find(".sum").text((price * qty).toFixed(2));
            
            // 同步到localStorage
            syncStorageFromDom();
            // 重新计算总计
            me_sum();
        });

        // 减少数量按钮鼠标悬停效果
        $(".cart-list").on("mouseover", ".mins", function() {
            var $input = $(this).siblings(".itxt");
            // 如果数量<=1，显示禁止操作光标
            if ((parseInt($input.val(), 10) || 1) <= 1) {
                $(this).css("cursor", "not-allowed");
            } else {
                $(this).css("cursor", "pointer");
            }
        });

        // 减少数量按钮点击事件
        $(".cart-list").on("click", ".mins", function() {
            var $ul = $(this).closest(".goods-list");
            var $input = $ul.find(".itxt");
            var qty = parseInt($input.val(), 10) || 1;
            
            // 如果数量<=1，不执行减少操作
            if (qty <= 1) {
                $(this).css("cursor", "not-allowed");
                return;
            }
            
            // 数量-1
            qty -= 1;
            $input.val(qty);
            
            // 重新计算小计金额
            var price = parseFloat($ul.find(".price").text()) || 0;
            $ul.find(".sum").text((price * qty).toFixed(2));
            
            // 同步到localStorage
            syncStorageFromDom();
            // 重新计算总计
            me_sum();
        });

        // 删除按钮点击事件
        $(".cart-list").on("click", ".del1 a", function() {
            // 获取商品索引
            var index = $(this).closest(".goods-list").data("index");
            // 从localStorage加载数据
            var cart = loadCart();
            // 删除指定索引的商品
            cart.splice(index, 1);
            // 保存修改后的数据
            saveCart(cart);
            // 重新渲染购物车
            renderCart();
        });
    }
});
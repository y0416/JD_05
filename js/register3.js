// 定义并立即执行匿名函数，创建私有作用域
(function(){
  // 当DOM内容加载完成时执行
  document.addEventListener('DOMContentLoaded', function(){
    // 导航守卫：检查是否从正确的注册流程进入
    
    // 1. 检查RegFlow对象是否存在
    // RegFlow是前面代码中定义的注册流程管理对象
    if (!window.RegFlow){ 
      // 如果不存在，说明用户没有按照正确流程访问，跳回注册首页
      window.location.href = 'register.html'; 
      return; // 停止执行后续代码
    }
    
    // 2. 获取当前注册流程状态
    var s = RegFlow.getState();
    
    // 3. 检查当前步骤是否为第3步（注册完成步骤）
    // 步骤说明：step 1=手机验证，step 2=填写信息，step 3=注册完成
    if (s.step !== 3){ 
      // 如果不是第3步，说明用户跳过了前面的步骤，跳回注册首页
      window.location.href = 'register.html'; 
      return; // 停止执行后续代码
    }

    // 获取显示用户名的DOM元素
    var nameEl = document.getElementById('user-name');
    var user = null; // 初始化用户变量
    
    // 尝试从本地存储中获取已注册的用户信息
    try { 
      // 从localStorage读取键为'jd_user'的数据并解析
      user = JSON.parse(localStorage.getItem('jd_user')) || null; 
    } catch(e){
      // 如果解析失败，user保持为null
    }
    
    // 如果获取到用户信息且显示元素存在
    if (user && nameEl){ 
      // 在页面上显示用户名，如果没有则显示默认名称'JD用户'
      nameEl.textContent = user.username || 'JD用户'; 
    }

    // 成功页加载后清理注册流程状态
    // 这是一个重要的安全措施，防止用户直接访问该页面
    RegFlow.reset();
    // reset()函数会删除localStorage中的'registerFlow'键
    // 这样用户如果刷新或直接访问此页面，就会被导航守卫拦截
  });
})(); // 立即执行函数结束
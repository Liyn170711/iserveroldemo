/**
 * @des: 观察者设计模式
 * @date: 2022-1-29 10:28:49
 */
var schedule = {
  list: [], // 商品列表[key: [], key: [],]
  listen: function(key, fn) {
      if (!this.list[key]) {
          this.list[key] = [];    
      }
      shopObj.list[key].push(fn); // 往特定的商品列表中添加订阅
  },
  publish: function(){
      var key = arguments[0];
      var fns = this.list[key];
      for(var i = 0, fn; fn = fns[i++];) {
          // 执行订阅的fn, arguments 是 js内置对象 存储所有实参
          fn.apply(this, arguments);
      }
  }
}
var initSchedule = function(obj) {
  for(let property in schedule) {
      obj[property] = schedule[property];          
  }
}
// 发布者
var shopObj = {};
initSchedule(shopObj);
// A添加订阅 huawei
shopObj.listen('huawei', function(brand, model){
  console.log('A订阅：', brand, model);
})
// B添加订阅 apple
shopObj.listen('apple', function(brand, model){
  console.log('B订阅：', brand, model);
})
// 双11 商家发布消息
shopObj.publish('huawei', 'P30');
shopObj.publish('apple', 'iphone 11');
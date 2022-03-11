/**
 * @des: 装饰器设计模式 —— 注解形式
 * @date: 2022-1-30 10:37:59
 */
// 装饰器 —— 注解形式
class Boy {
  @run // 注解装饰，需要转义成ES5才能运行
  speak() {
    console.log('我能唱歌。')
  }
}
// 装饰器 参数
function run(target, key, descriptor) {
  // target：boy 对象，key：被装饰的方法名，desc：描述对象 value=speak()
  // console.log(target)
  // console.log(key)
  // console.log(descriptor)
  console.log('我能跑步。')
}
var boy = new Boy();
boy.speak();
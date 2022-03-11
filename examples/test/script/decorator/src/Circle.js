/**
 * @des: 装饰器设计模式
 * @date: 2022-1-30 10:28:49
 */
// 装饰器实现
// 定义一个圆
class Circle{
  draw() { // 行为
    console.log('画一个圆');
  }
}
// 使用装饰器添加一个边框
class Decorator{
  constructor(circle) {
    this.circle = circle;
  }
  draw() {
    this.circle.draw(); // 圆自己的绘制方法
    this.setBorder(this.circle);
  }
  setBorder(circle) {
    console.log('绘制边框');
  }
}

var circle = new Circle();
var decorator = new Decorator(circle);
decorator.draw();
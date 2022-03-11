'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

/**
 * @des: 装饰器设计模式 —— 注解形式
 * @date: 2022-1-30 10:37:59
 */
// 装饰器 —— 注解形式
var Boy = (_class = function () {
  function Boy() {
    _classCallCheck(this, Boy);
  }

  _createClass(Boy, [{
    key: 'speak',
    // 注解装饰，需要转义成ES5才能运行
    value: function speak() {
      console.log('我能唱歌。');
    }
  }]);

  return Boy;
}(), (_applyDecoratedDescriptor(_class.prototype, 'speak', [run], Object.getOwnPropertyDescriptor(_class.prototype, 'speak'), _class.prototype)), _class);
// 装饰器 参数

function run(target, key, descriptor) {
  // target：boy 对象，key：被装饰的方法名，desc：描述对象 value=speak()
  // console.log(target)
  // console.log(key)
  // console.log(descriptor)
  console.log('我能跑步。');
}
var boy = new Boy();
boy.speak();

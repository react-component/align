webpackJsonp([0],{

/***/ 128:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(129);


/***/ }),

/***/ 129:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rc_align__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_dom__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_react_dom__);









var Test = function (_Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(Test, _Component);

  function Test() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Test);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = Test.__proto__ || Object.getPrototypeOf(Test)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      monitor: true,
      random: false,
      randomWidth: 100,
      align: {
        points: ['cc', 'cc']
      }
    }, _this.getTarget = function () {
      if (!_this.$container) {
        // parent ref not attached
        _this.$container = document.getElementById('container');
      }
      return _this.$container;
    }, _this.containerRef = function (ele) {
      _this.$container = ele;
    }, _this.alignRef = function (node) {
      _this.$align = node;
    }, _this.toggleMonitor = function () {
      _this.setState({
        monitor: !_this.state.monitor
      });
    }, _this.toggleRandom = function () {
      _this.setState({
        random: !_this.state.random
      });
    }, _this.forceAlign = function () {
      _this.$align.forceAlign();
    }, _temp), __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Test, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.id = setInterval(function () {
        var random = _this2.state.random;

        if (random) {
          _this2.setState({
            randomWidth: 60 + 40 * Math.random()
          }, function () {
            _this2.forceAlign();
          });
        }
      }, 1000);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearInterval(this.id);
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          random = _state.random,
          randomWidth = _state.randomWidth;


      return __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
        'div',
        {
          style: {
            margin: 50
          }
        },
        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
          'p',
          null,
          __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
            'button',
            { onClick: this.forceAlign },
            'Force align'
          ),
          '\xA0\xA0\xA0',
          __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
            'label',
            null,
            __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement('input', { type: 'checkbox', checked: this.state.monitor, onChange: this.toggleMonitor }),
            '\xA0 Monitor window resize'
          ),
          __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
            'label',
            null,
            __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement('input', { type: 'checkbox', checked: this.state.random, onChange: this.toggleRandom }),
            '\xA0 Random Size'
          )
        ),
        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
          'div',
          {
            ref: this.containerRef,
            id: 'container',
            style: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({
              width: '80%',
              height: 500,
              border: '1px solid red'
            }, random ? {
              width: randomWidth + '%'
            } : null)
          },
          __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_5_rc_align__["a" /* default */],
            {
              ref: this.alignRef,
              target: this.getTarget,
              monitorWindowResize: this.state.monitor,
              align: this.state.align
            },
            __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
              'div',
              {
                style: {
                  position: 'absolute',
                  width: 50,
                  height: 50,
                  background: 'yellow'
                }
              },
              __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement('input', {
                defaultValue: 'source',
                style: { width: '100%' }
              })
            )
          )
        )
      );
    }
  }]);

  return Test;
}(__WEBPACK_IMPORTED_MODULE_6_react__["Component"]);

__WEBPACK_IMPORTED_MODULE_7_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(Test, null), document.getElementById('__react-content'));

/***/ }),

/***/ 130:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(131);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),

/***/ 131:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(132), __esModule: true };

/***/ }),

/***/ 132:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(133);
module.exports = __webpack_require__(2).Object.assign;


/***/ }),

/***/ 133:
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(7);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(134) });


/***/ }),

/***/ 134:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(18);
var gOPS = __webpack_require__(36);
var pIE = __webpack_require__(20);
var toObject = __webpack_require__(49);
var IObject = __webpack_require__(47);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(14)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ })

},[128]);
//# sourceMappingURL=simple.js.map
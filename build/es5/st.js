'use strict';

var _Loader = require('./Loader');

var _Loader2 = _interopRequireDefault(_Loader);

var _Route = require('./Route');

var _Route2 = _interopRequireDefault(_Route);

var _Sence = require('./Sence');

var _Sence2 = _interopRequireDefault(_Sence);

var _SenceConfManager = require('./SenceConfManager');

var _SenceConfManager2 = _interopRequireDefault(_SenceConfManager);

var _observable = require('./observable');

var _observable2 = _interopRequireDefault(_observable);

var _Statge = require('./Statge');

var _Statge2 = _interopRequireDefault(_Statge);

var _StatgeManager = require('./StatgeManager');

var _StatgeManager2 = _interopRequireDefault(_StatgeManager);

var _ui = require('./ui');

var _ui2 = _interopRequireDefault(_ui);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var st = {
    Loader: _Loader2.default,
    Route: _Route2.default,
    observable: _observable2.default,
    Statge: _Statge2.default,
    util: _util2.default
};

$.extend(st, _SenceConfManager2.default, _StatgeManager2.default, _ui2.default, _Sence2.default);

window.st = st;
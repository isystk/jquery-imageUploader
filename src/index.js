import './assets/css/normalize.css';
import './assets/css/prettify.css';
import './assets/index.css';

var $ = require('jquery');
window.$ = $;
window.jQuery = $;
var _ = require('lodash');
window._ = _;
require('./assets/js/prettify.js');
require('./assets/js/lang-css.js');
require('./assets/js/jquery-stickyNavigator.js');
require('./assets/js/jquery-imageUploader.js');
require('./assets/js/common.js');
var heic2any = require('heic2any');
window.heic2any = heic2any;

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./controllers/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./controllers/forms/add_task_form.js":
/*!********************************************!*\
  !*** ./controllers/forms/add_task_form.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var counter = function(){\r\n  console.log(\"que pasa bro\");\r\n};\r\n\r\nmodule.exports = counter;\r\n\n\n//# sourceURL=webpack:///./controllers/forms/add_task_form.js?");

/***/ }),

/***/ "./controllers/index.js":
/*!******************************!*\
  !*** ./controllers/index.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*jshint esversion: 6 */\r\n\r\n\r\nconst addTaks_view = __webpack_require__(/*! ./forms/add_task_form */ \"./controllers/forms/add_task_form.js\");\r\nconsole.log(addTaks_view);\r\n\r\n//Loading the list\r\nconst ol = document.getElementById('mainList');\r\n\r\n\r\n$(document).ready(function(){\r\n\r\n  $('#formBtn').on('click', function(){\r\n\r\n      var item = $('form input');\r\n      var todo = {item: item.val()};\r\n\r\n      const secondList = $('#mainList');\r\n\r\n      console.log(\"button clicked\");\r\n      console.log(todo);\r\n\r\n      $.ajax({\r\n        type: 'POST',\r\n        url: '/',\r\n        data: todo,\r\n        success: function(data){\r\n\r\n          secondList.append('<li>' + todo.item + '</li>');\r\n          // for (let i = 0; i<data.length;i++){\r\n          //   secondList.append('<li>' + data[i].item + '</li>');\r\n          // }\r\n\r\n          //do something with the data via front-end framework\r\n          //location.reload();\r\n        }\r\n      });\r\n      return false;\r\n  });\r\n\r\n  // $('li').on('click', function(){\r\n  //\r\n  //     console.log($(this));\r\n  //     let item = {item: $(this).text()};\r\n  //\r\n  //     $.ajax({\r\n  //       type: 'POST',\r\n  //       url: '/remove',\r\n  //       data: item,\r\n  //       success: function(item){\r\n  //\r\n  //         console.log(\"listo\");\r\n  //         //do something with the data via front-end framework\r\n  //         // location.reload();\r\n  //       }\r\n  //     });\r\n  // });\r\n\r\n  ol.addEventListener('slip:beforereorder', function(e){\r\n      if (/demo-no-reorder/.test(e.target.className)) {\r\n          e.preventDefault();\r\n      }\r\n  }, false);\r\n\r\n  ol.addEventListener('slip:swipe', function(e){\r\n    console.log(e.detail.direction);\r\n  },false);\r\n\r\n\r\n  ol.addEventListener('slip:beforeswipe', function(e){\r\n      if (e.target.nodeName == 'INPUT' || /demo-no-swipe/.test(e.target.className)) {\r\n          e.preventDefault();\r\n      }\r\n  }, false);\r\n\r\n  ol.addEventListener('slip:beforewait', function(e){\r\n      if (e.target.className.indexOf('instant') > -1)\r\n      e.preventDefault();\r\n  }, false);\r\n\r\n  ol.addEventListener('slip:afterswipe', function(e){\r\n      e.target.parentNode.removeChild(e.target);\r\n  }, false);\r\n\r\n  ol.addEventListener('slip:reorder', function(e){\r\n      e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);\r\n      return false;\r\n  }, false);\r\n\r\n  new Slip(ol);\r\n\r\n\r\n  // Left menu mobile button\r\n  $('#top_bar_menu_icon').on('click', function(){\r\n    if ($( window ).width()<950){\r\n      if($(\"#left_menu\").hasClass(\"show_left_menu\")){\r\n        $(\"#left_menu\").removeClass(\"show_left_menu\");\r\n        $(\"#content\").removeClass(\"grey_content\");\r\n        $(\"#top_bar_menu_icon\").attr(\"src\", \"/assets/btn_topbar_menuicon.svg\");\r\n      }else{\r\n        $(\"#content\").addClass(\"grey_content\");\r\n        $(\"#left_menu\").addClass(\"show_left_menu\");\r\n        $(\"#top_bar_menu_icon\").attr(\"src\", \"/assets/btn_top_close_menu.svg\");\r\n\r\n      }\r\n    }\r\n  });\r\n\r\n  // removes mobile left menu\r\n  $( window ).resize(function() {\r\n   if($( window ).width()>950 &&  $(\"#left_menu\").hasClass(\"show_left_menu\")){\r\n     $(\"#content\").removeClass(\"grey_content\");\r\n     $(\"#left_menu\").removeClass(\"show_left_menu\");\r\n     $(\"#top_bar_menu_icon\").attr(\"src\", \"/assets/btn_topbar_menuicon.svg\");\r\n   }\r\n});\r\n\r\n\r\n  // $('#content').on('click', function(){\r\n  //   if($(\"#left_menu\").hasClass(\"show_left_menu\")){\r\n  //     $(\"#left_menu\").removeClass(\"show_left_menu\");\r\n  //     $(\"#content\").removeClass(\"grey_content\");\r\n  //     $(\"#top_bar_menu_icon\").attr(\"src\", \"/assets/btn_topbar_menuicon.svg\");\r\n  //   }\r\n  // });\r\n\r\n\r\n});\r\n\n\n//# sourceURL=webpack:///./controllers/index.js?");

/***/ })

/******/ });
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var m$1 = _interopDefault(require('mithril'));

var g = null;
var w = null;

/* eslint-disable no-undef, no-empty */
try {
  g = global;
} catch (err) {}

try {
  w = window;
} catch (err) {}
/* eslint-enable no-undef, no-empty */

var $ = (g || w).jQuery || (g || w).$;

var Modal = {
  view: function view(vnode) {
    var instanceId = vnode.attrs.instanceId;
    var options = vnode.attrs.options;
    return m$1('.modal', {
      id: instanceId,
      class: !options.fade ? '' : 'fade',
      tabindex: '-1',
      role: 'dialog',
      'aria-hidden': 'true',
      'aria-labelledby': instanceId + '_title',
      'aria-describedby': options.description
    }, m$1('.modal-dialog', {
      class: !options.large ? '' : 'modal-lg',
      role: 'document'
    }, m$1('.modal-content', vnode.children)));
  }
};

var CloseButton = {
  view: function view(vnode) {
    var instanceId = vnode.attrs.instanceId;
    var options = vnode.attrs.options;
    return m$1('button.close[type="button"]', {
      'data-dismiss': 'modal',
      'aria-label': options.closeButtonLabel || 'Close'
    }, m$1('span[aria-hidden="true"]', m$1.trust('&times;')));
  }
};

var ModalHeader = {
  view: function view(vnode) {
    var instanceId = vnode.attrs.instanceId;
    var options = vnode.attrs.options;
    return m$1('.modal-header', m$1('h5.modal-title', {
      id: instanceId + '_title'
    }, options.title), m$1(CloseButton, { instanceId: instanceId, options: options }));
  }
};

var ModalBody = {
  view: function view(vnode) {
    var instanceId = vnode.attrs.instanceId;
    var options = vnode.attrs.options;
    return m$1('.modal-body', vnode.children);
  }
};

var ModalFooter = {
  view: function view(vnode) {
    var instanceId = vnode.attrs.instanceId;
    var options = vnode.attrs.options;
    return m$1('.modal-footer', vnode.children);
  }
};

var _uniqueId_counter = 0;
var MAX_VALUE = 10000000000;

var uniqueId = function (prefix) {
  _uniqueId_counter++;
  if (_uniqueId_counter >= MAX_VALUE) {
    _uniqueId_counter = 0;
  }
  return '_' + (prefix || '') + Date.now() + '_' + _uniqueId_counter;
};

function boolOption(options, property, defaultValue) {
  return options.hasOwnProperty(property) ? options[property] : defaultValue;
}

function getOptions(options) {
  options = options || {};
  return {
    title: options.title || '',
    description: options.description || '',
    fade: boolOption(options, 'fade', true),
    large: boolOption(options, 'large', false),
    closeButton: boolOption(options, 'closeButton', true),
    enterCommits: boolOption(options, 'enterCommits', true),
    closeButtonLabel: options.closeButtonLabel || null,
    before: options.before || null,
    after: options.after || null,
    footer: options.footer || null,
    modalView: options.modalView || null,
    headerView: options.headerView || null,
    bodyView: options.bodyView || null,
    footerView: options.footerView || null
  };
}

var ignoredElementNames = ['SELECT', 'TEXTAREA'];

var ENTER_KEY = 13;

function attachHandlers(vnode) {
  var $modal = $(vnode.dom);
  var options = vnode.attrs.dialog || {};
  var enterCommits = boolOption(options, 'enterCommits', true);
  if (enterCommits) {
    $modal.on('keypress', function (event) {
      var target = event.target;
      var ignored = ignoredElementNames.indexOf(target.nodeName) > -1;
      if (!ignored && event.keyCode === ENTER_KEY) {
        vnode.state.close(event, true);
        m.redraw();
      }
    });
  }
  $modal.on('shown.bs.modal', function (event) {
    vnode.state.visible = true;
    $modal.find('.autofocus').focus();
  });
  $modal.on('hide.bs.modal', function (event) {
    // console.log('modal hide.bs.modal', vnode.attrs.dialog.model, event, {state: vnode.state, attrs: vnode.attrs});
    vnode.state.close(event, false);
    vnode.state.visible = false;
  });
}

var MODAL_REMOVE_FALLBACK_DELAY = 1500;

var main = {
  Modal: Modal,
  ModalHeader: ModalHeader,
  ModalBody: ModalBody,
  ModalFooter: ModalFooter,

  MODAL_REMOVE_FALLBACK_DELAY: MODAL_REMOVE_FALLBACK_DELAY,

  oninit: function oninit(vnode) {
    // console.log('modal oninit');
    vnode.state.instanceId = uniqueId('dialog');
    vnode.state.visible = false;
    vnode.state.transitioning = false;
    vnode.state.close = function (event, saved) {
      if (vnode.state.visible) {
        if (vnode.attrs.dialog.onclose) {
          vnode.attrs.dialog.onclose(event, saved);
        }
        // unless close prevented, update visibility
        if (!event.defaultPrevented) {
          vnode.attrs.dialog.model = null;
        }
      }
    };
    vnode.state.refresh = function (model) {
      var stateVisibility = vnode.state.visible;
      var configuredVisibility = !!model;
      // console.log('modal refresh', {model, stateVisibility, configuredVisibility});
      if (stateVisibility !== configuredVisibility) {
        try {
          $(vnode.dom).modal(configuredVisibility ? 'show' : 'hide');
        } catch (err) {
          console.debug(err.stack || err);
        }
      }
    };
  },

  oncreate: function oncreate(vnode) {
    // console.log('oncreate', vnode.attrs.dialog.model, {state: vnode.state, attrs: vnode.attrs});
    attachHandlers(vnode);
    vnode.state.refresh(vnode.attrs.dialog.model);
  },

  onupdate: function onupdate(vnode) {
    // console.log('onupdate', vnode.attrs.dialog.model, {state: vnode.state, attrs: vnode.attrs});
    vnode.state.refresh(vnode.attrs.dialog.model);
  },

  onbeforeremove: function onbeforeremove(vnode) {
    var $modal = $(vnode.dom);
    return new Promise(function (resolve, reject) {
      var fallback = setTimeout(function () {
        return resolve();
      }, MODAL_REMOVE_FALLBACK_DELAY);
      $modal.on('hidden.bs.modal', function () {
        clearTimeout(fallback);
        resolve();
      });
    });
  },

  view: function view(vnode) {
    var instanceId = vnode.state.instanceId;
    var options = getOptions(vnode.attrs.dialog);
    // console.log('options', options);
    return m$1(options.modalView || Modal, { instanceId: instanceId, options: options }, [m$1(options.headerView || ModalHeader, { instanceId: instanceId, options: options }), options.before, m$1(options.bodyView || ModalBody, { instanceId: instanceId, options: options }, vnode.children), options.after, m$1(options.footerView || ModalFooter, { instanceId: instanceId, options: options }, options.footer)]);
  }
};

module.exports = main;
//# sourceMappingURL=mithril-dialog.cjs.js.map

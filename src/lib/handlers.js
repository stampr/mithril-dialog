import $ from './jquery.js';
import { boolOption } from './options.js';

export const ignoredElementNames = [
  'SELECT',
  'TEXTAREA',
];

const ENTER_KEY = 13;

export function attachHandlers(vnode) {
  let $modal        = $(vnode.dom);
  let options       = vnode.attrs.dialog || {};
  let enterCommits  = boolOption(options, 'enterCommits', true);
  if (enterCommits) {
    $modal.on('keypress', (event) => {
      let target  = event.target;
      let ignored = ignoredElementNames.indexOf(target.nodeName) > -1;
      if (!ignored && event.keyCode === ENTER_KEY) {
        vnode.state.close(event, true);
        m.redraw();
      }
    });
  }
  $modal.on('shown.bs.modal', (event) => {
    vnode.state.visible = true;
    $modal.find('.autofocus').focus();
  });
  $modal.on('hide.bs.modal', (event) => {
    // console.log('modal hide.bs.modal', vnode.attrs.dialog.model, event, {state: vnode.state, attrs: vnode.attrs});
    vnode.state.close(event, false);
    vnode.state.visible = false;
  });
}

import 'core-js/es6/map';
import 'core-js/es6/set';
import $ from 'jquery';
import Align from '../src';

$('<style>html,body {padding:0;margin:0;border:none;}</style>')
  .appendTo(document.getElementsByTagName('head'));

describe('rc-align', () => {
  it('exists', () => {
    expect(Align).to.be.ok();
  });
});

require('./point.spec');
require('./util.spec');

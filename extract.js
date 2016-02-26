'use strict';

import webPage from 'webpage';
import system  from 'system';
import fs      from 'fs';

if (system.args.length < 3) {
  console.error('Error: phantomjs [options] extract.js <url>');
  phantom.exit(1);
}

const url   = system.args[1];
const model = system.args[2];
const page  = webPage.create();

page.open(url, status => {
  if (status !== 'success') {
    console.Error('Error: failed to open', url);
    phantom.exit(1);
  }
  console.log('File open success!');
  page.evaluateJavaScript('function(){' + fs.read('dist/evaluation.js') + ';}');
  phantom.exit(0);
});

page.onConsoleMessage = msg => {
  console.log(msg);
};

page.onCallback = data => {
  if (data.error !== undefined) {
    console.error('Error:', data.error);
    phantom.exit(1);
  }
}

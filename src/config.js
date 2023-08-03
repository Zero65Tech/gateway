const cluster = '2fn4cwcjeq-uc';

const helloApp = [
  [ '/assets/', null, `hello-vue3-${ cluster }.a.run.app`, path => path ],
  [ '/images/', null, `hello-vue3-${ cluster }.a.run.app`, path => path ],
  [ '/css/',    null, `hello-vue3-${ cluster }.a.run.app`, path => path ],
  [ '/js/',     null, `hello-vue3-${ cluster }.a.run.app`, path => path ],
  [ '',         null, `hello-vue3-${ cluster }.a.run.app`, path => '/'  ],
];



try {

  let config = require('@zero65/config');
  config[ 'hello.zero65.in' ] = helloApp;
  module.exports = config;

} catch (e) {

  module.exports = { 'hello.zero65.in': helloApp };

}

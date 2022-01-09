const config = {

  "devo": {
    "gateway": {
      "port": 8080
    },
    "market": {
      "port": 8081
    },
    "zerodha": {
      "port": 8082
    },
    "invest": {
      "port": 8083
    },
    "paisa": {
      "port": 8084
    }
  },

  "test": {
    "gateway": {
      "port": 8080
    },
    "market": {
      "port": 8081
    },
    "invest": {
      "port": 8083
    }
  },

  "prod": {
    "gateway": {
      "port": 8080
    },
    "market": {
      "port": 8080
    },
    "invest": {
      "port": 8080
    }
  }

};

(() => {

  let nodeEnv = process.env.NODE_ENV;
  let appName = process.env.npm_package_name;
  let appConfig = config[process.env.NODE_ENV][process.env.npm_package_name];

  if(nodeEnv == 'devo' && appName == 'invest')
    process.argv.forEach(arg => {
      switch(arg) {
        case 'cron':          appConfig.cronData     = true;
                              appConfig.cronValidate = true; break;
        case 'cron-data':     appConfig.cronData     = true; break;
        case 'cron-validate': appConfig.cronValidate = true; break;
      }
    });

}) ();

exports.get = (appName) => {
  return config[process.env.NODE_ENV][appName || process.env.npm_package_name];
}
let updateNotifier = require("update-notifier");
let pkg = require("../package.json");
let notifier = updateNotifier({ pkg, updateCheckInterval: 60 * 60 * 1000 });

notifier.notify();

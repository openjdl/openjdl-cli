let updateNotifier = require("update-notifier");
let pkg = require("../package.json");
let notifier = updateNotifier({ pkg });

notifier.notify();

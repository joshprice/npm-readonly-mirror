"use strict";

var http = require("http");

module.exports.get_changes = function get_changes(since, registry, callback) {
  if (typeof since === "string") {
    callback = registry;
    registry = since;
    since = null;
  }

  var url = registry + "_changes";

  if (since) {
    url += "?since=" + since;
  }

  http.get(url, function(res) {
    var bodyParts = []
    var bytes = 0;

    res.on("data", function(c) {
      bodyParts.push(c);
      bytes += c.length;
    });
    res.on("end", function() {
      var body = Buffer.concat(bodyParts, bytes).toString("utf8");

      try {
        var changes = JSON.parse(body);
      } catch (ex) {
        return callback(ex);
      }

      callback(null, changes);
    });
    res.on("error", callback);
  }).on("error", callback);
};
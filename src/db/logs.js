const { Model } = require("./objection");

class Logs extends Model {
  static get tableName() {
    return "logs";
  }

  static getCallerFile() {
    try {
        var err = new Error();
        var callerfile;
        var currentfile;

        Error.prepareStackTrace = function (err, stack) { return stack; };

        currentfile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();

            if(currentfile !== callerfile) return callerfile;
        }
    } catch (err) {}
    return undefined;
}
  
  static error(title, info) {
    const module = Logs.getCallerFile();
    
    this.query().insert({
      severity: 'error',
      module: module,
      title: title,
      info: info,
    }).then(() => {});
  }
}

module.exports = Logs;

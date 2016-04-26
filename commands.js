var fs = require('fs');
var rl = require('readline');
var request = require('request');


var commands = {
    pwd : () => process.env.PWD,
    date: () => new Date(),
    ls: function (){
      fs.readdir('.',function(err, files){
        if(err) throw err;
        files.forEach(function(file){
          process.stdout.write(file.toString() + "\n");
        })
        commands.done();
      })
    },
    echo: function(stringArgs) {
      // console.log('this should not be undefined: ' + stringArgs);
        return stringArgs.slice(1).join(' ');
    },
    done: function() {
      process.stdout.write('\nprompt > ')
    },
    cat: function(args) {
      fs.readFile(args[1], function(err, fileData){
        if(err) throw err;
        process.stdout.write(fileData.toString() + '\n');
        commands.done();
      })
    },
    head: function(args) {
      var lines = args[2] || 20;
      var path = args[1];
      var lineCount = 0;
      var readHead = rl.createInterface({
        input: fs.createReadStream(path)
      });
      readHead.on('line', (line) => {
        // debugger;
        if(lineCount < lines) {
          process.stdout.write(line.toString());
          process.stdout.write('\n');
        };
        lineCount++;
      });
      readHead.on('close', function() {
        commands.done();
      });
    },
    tail: function(args) {
      var path = args[1];
      var lines = args[2] || 20;
      fs.readFile(args[1], function(err, fileData){
        if(err) throw err;
        var tailFile = fileData.toString().split('\n').slice(lines*-1).join('\n');
        process.stdout.write(tailFile);
        commands.done();
      })
    },
    curl: function(args) {
      var url = args[1];
      var outputPath = args[2] || null;
      request(url, function(err, res, body){
        if(err) throw err;
        if (!outputPath) {
          process.stdout.write(body + '\n');
        } else {
          fs.writeFile(outputPath, body, 'utf8', (err) => {
            console.log(outputPath);
            if(err) throw err;
            console.log('wrote ' + url + ' to file ' + outputPath);
            commands.done();
          })
        }
        commands.done();
      }).on('close', (err, res, body) => {
        if (err) throw err;
        commands.done()
      });
    }
    // sort,
    // wc,
    // uniq
}


module.exports = commands;

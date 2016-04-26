var c = require("./commands")

// console.log(Object.keys(process));
process.stdout.write('prompt > ');
process.stdin.on('data', function (data) {
  var args = data.toString().trim().split(' ');
  var cmd = args[0];
  // console.log(cmd, args);
  process.stdout.write("You typed: " + cmd + '\n');
  if(cmd == 'ls') {
    //put asynchronous calls here.
    c[cmd](args);
  } else {
    //put synchronous calls here.
    console.log(c[cmd](args));
    c.done();
  }
})

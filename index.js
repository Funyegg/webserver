const net = require("net");
const fs = require("fs");
const config = require('./config.js');
const port = config.port;
const hostenabled = config.enabled;
var err405 = config.e405;
var err404 = config.e404;
var defaultd = config.def;
var hosterr = config.hosterr;
var errordir = config.errdir;
var indexf = config.indexfile;
var hosts = config.hostnames;
let index = config.indexfile;
let dir = config.webdir;
let site = defaultd;
const head = "HTTP/1.1 200 OK\ncontent-type: text/html\n\n";
const server = net.createServer();
server.on('connection', res => {
  res.on("data", data => {
    data = data.toString();
    if (data.includes("Host: ")) {
      hostd = data.substring(data.indexOf("Host: "), data.length);
      host = hostd.substring(hostd.indexOf("Host: ") + 6, hostd.indexOf("\n") - 1);
    }
    if (hostenabled == true) {
      if (hosts.includes(host)){
        index = indexf;
        site = host + "/";
      } else {
        site = errordir;
        index = hosterr;
      }
    } else{
        index = indexf;
        site = defaultd;
    }
    if (data.substring(0, data.toString().indexOf('HTTP/1.1')).includes("GET /")) {
      get = data.substring(data.indexOf("GET ") + 4, data.indexOf("HTTP/1.1") - 1);
      if (get == '/'){
        get = "/"+index;
      }
    } else {
      site = errordir;
      get = err405;
    }
          if(hosts.includes(host) || hostenabled == 0){
    if (fs.existsSync(dir + site + get)&&fs.lstatSync(dir+site+get).isDirectory()) {
      get = get +'/'+ indexf;
    }
    if (fs.existsSync(dir + site + get)) {
      if(extens(get) == ".html"){
      res.write(head + fs.readFileSync(dir + site + get).toString().replace(/&NTShost/g, host).replace(/&NTSget/g,get).replace(/&NTSip/g,res.remoteAddress));


    }else{
res.write('HTTP/1.1 200 OK\n\n');
res.write(fs.readFileSync(dir + site + get));
      }
    } else {

      if (fs.existsSync(dir + errordir+err404)){

        res.write(head+ fs.readFileSync(dir + errordir+err404).toString().replace(/&NTSget/g,get).replace(/&NTShost/g,host).replace(/&NTSip/g,res.remoteAddress));

      } else {
        res.write(head + "double 404 theres no 404 error file");
      }
         
    }
  }else{
if (fs.existsSync(dir + errordir + hosterr)){
        res.write(head + fs.readFileSync(dir + errordir + hosterr));
} else{
  res.write(head + 'a host error has occured, in addition a 404 error has occured when trying to get the host error file');
}
      }
        res.on('error',()=>{
    
  });
    res.end();
  })
})
function extens(x){
  return x.substring(x.lastIndexOf('.'),x.length);
  }
  server.on('error',()=>{

  })
server.listen(port);
# webserver
node js web server with the net module. supports hostnames.

you can enable hostnames in the config file. each hostname should have its own
folder in the web folder (eg funy.tk). 

if hostnames are disabled the server picks the def folder instead.

there are also 3 types of errors it can detect: 404, 405 and wrong hostname.

use &NTSget &NTShost &NTSip to get the path, hostname used or ip.

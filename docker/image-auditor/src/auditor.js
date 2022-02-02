const PROTOCOL_PORT = 6969
const PROTOCOL_MULTICAST_ADDRESS = '239.255.22.5'

/*
 * We use a standard Node.js module to work with UDP
 */
const dgram = require('dgram');

const instruments = {
    piano: 'ti-ta-ti',
    trumpet: 'pouet',
    flute: 'trulu',
    violin: 'gzi-gzi',
    drum: 'boum-boum'
};

var activeMusicians = {};

/* 
 * Let's create a datagram socket. We will use it to listen for datagrams published in the
 * multicast group by thermometers and containing measures
 */
const s = dgram.createSocket('udp4');
s.bind(PROTOCOL_PORT, function() {
  console.log("Joining multicast group");
  s.addMembership(PROTOCOL_MULTICAST_ADDRESS);
});

/* 
 * This call back is invoked when a new datagram has arrived.
 */
s.on('message', function(msg, source) {
	console.log("Data has arrived: " + msg + ". Source port: " + source.port);

    var data = JSON.parse(msg.toString());

    activeMusicians[data['id']] = [data['instrument'], Date.now()];
});

function getRecentMusicians(object){
    let arr = [];

    for (const [key, value] of Object.entries(object)) {
        if(Date.now() - value[1] > 5000){
            delete object[key];
        } else {

            

            arr.push({
                'uuid': key,
                'instrument': Object.keys(instruments).find(key => instruments[key] === value[0]),
                'activeSince': value[1].toString()
            });
        }
    }

    return arr;
}

var net = require('net');
var server = net.createServer();    
server.on('connection', handleConnection);
server.listen(2205, function() {    
  console.log('server listening to %j', server.address());  
});

function handleConnection(conn) {    
    var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;  
    console.log('new client connection from %s', remoteAddress);

    var musiciens = getRecentMusicians(activeMusicians);

    /*console.log('connection data from %s: %j', remoteAddress, musiciens);*/
    conn.write(JSON.stringify(musiciens));

    conn.on('error', onConnError);
    function onConnError(err) {  
        console.log('Connection %s error: %s', remoteAddress, err.message);  
    }

    conn.end();
}



// We use a standard Node.js module to work with UDP
const dgram = require('dgram');

// Let's create a datagram socket. We will use it to send our UDP datagrams
const s = dgram.createSocket('udp4');

const PROTOCOL_PORT = 6969
const PROTOCOL_MULTICAST_ADDRESS = '239.255.22.5'

const instruments = {
    piano: 'ti-ta-ti',
    trumpet: 'pouet',
    flute: 'trulu',
    violin: 'gzi-gzi',
    drum: 'boum-boum'
};

if(instruments.hasOwnProperty(process.argv[2])){
    const musicien = {
        instrument: instruments[process.argv[2]]
    };
    
    setInterval(function(){
        /// fonction envoyant un bruit
    
        var payload = JSON.stringify(musicien.instrument);
    
    
        // Send the payload via UDP (multicast)
        message = new Buffer(payload);
        s.send(message, 0, message.length, PROTOCOL_PORT, PROTOCOL_MULTICAST_ADDRESS,
        function() {
            console.log("Musicien envoi: " + payload + " via le port " + s.address().port);
        });
      }, 1000);
}else{
    console.log("Instrument invalide.");
}
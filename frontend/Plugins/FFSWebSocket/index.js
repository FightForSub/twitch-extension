const EventEmitter = require('events');


let FFSAPI = {

    ws: null,
    eventEmitter: new EventEmitter(),
    pingInterval: null,
    connect(endpoint) {
        this.ws = new WebSocket(endpoint);

        this.ws.addEventListener('open', this.onConnect.bind(this));
        this.ws.addEventListener('close', this.onDisconnect.bind((this)));
        this.ws.addEventListener('message', function (event) {
            this.onMessage(JSON.parse(event.data))
        }.bind(this));
    },
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }

    },
    onConnect() {
        this.pingInterval = setInterval(function () {
            //TODO check expiration
            this.sendPing()
        }.bind(this), 20000);
        this.eventEmitter.emit('connected');
    },
    onConnected(cb){
      this.eventEmitter.on('connected',cb)
    },
    onDisconnect() {
        clearInterval(this.pingInterval);
        //TODO reconnect strategy
    },
    onMessage(message) {
        switch (message.type) {
            case "MESSAGE":
                let topic = message.data.topic;
                let topicType = topic.split(".")[0];
                if (topicType === 'event-score-v1') {
                    this.eventEmitter.emit('event-update', JSON.parse(message.data.message))
                }
                //subscription message
                //TODO handle the data type

                break;
            case "RESPONSE":
                //when we subscribe to a topic

                break;
            case "PONG":
                //TODO remove expiration detection
                //we get the response to our ping

                break;
        }
        this.eventEmitter.emit('')
    },
    sendMessage(message) {
        if (this.ws && this.ws.readyState === 1) {
            let _message;
            if(typeof message!=='string'){
                _message = JSON.stringify(message)
            }
            else{
                _message = message
            }
            this.ws.send(_message)
        }
    },
    sendPing() {
        this.sendMessage({
            "type": "PING"
        })
    },
    subscribeToEvent(eventId) {

        const message = {
            "type":"SUBSCRIBE",
            "nonce":"randomString", //TODO generate random string
            "topics":["event-score-v1."+eventId],
        }
        this.sendMessage(message)

    },
    onEventUpdate(cb) {
        this.eventEmitter.on('event-update', cb)
    },
    install: function (vue) {
        Object.defineProperty(vue.prototype, '$ffsApi', {
            get() {
                return FFSAPI
            }
        })

    }
};

export default FFSAPI

// var mqtt = require('mqtt')
// var client  = mqtt.connect('mqtt://test.mosquitto.org')

// client.on('connect', function () {
//   client.subscribe('presence')
//   client.publish('presence', 'Hello mqtt')
// })

// client.on('message', function (topic, message) {
//   // message is Buffer
//   console.log(message.toString())
//   client.end()
// })


const mqtt = require('mqtt');

class MqttHandler {
    constructor() {
        this.mqttClient = null;
        this.host = 'mqtt://broker.emqx.io';
        this.username = 'dash'; // mqtt credentials if these are needed to connect
        this.password = 'dash_password';
    }

    // constructor() {
    //     this.mqttClient = null;
    //     this.host = 'mqtt://mqtt.realtime-tec.com';
    //     this.username = 'rttadmin'; // mqtt credentials if these are needed to connect
    //     this.password = 'pvtPVT123';
    // }

    connect() {
        // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
        this.mqttClient = mqtt.connect(this.host, { username: this.username, password: this.password });

        // Mqtt error calback
        this.mqttClient.on('error', (err) => {
            console.log(err);
            this.mqttClient.end();
        });

        // Connection callback
        this.mqttClient.on('connect', () => {
            console.log(`mqtt client connected`);
        });

        // mqtt subscriptions
        this.mqttClient.subscribe('mqtt', { qos: 0 });

        // When a message arrives, console.log it
        this.mqttClient.on('message', function (topic, message) {
            console.log(message.toString());
        });

        this.mqttClient.on('close', () => {
            console.log(`mqtt client disconnected`);
        });
    }

    // Sends a mqtt message to topic: mytopic
    sendMessage(message) {
        this.mqttClient.publish('mqtt', message);
    }

    receiveMessage() {
        this.mqttClient.subscribe('message');
        this.mqttClient.subscribe('iamhere/q_get_patient_mobile_settings/97337288090');
    }
}

module.exports = MqttHandler;
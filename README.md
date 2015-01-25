The Future Is Now 2015
=======================
This repository contains code for our workshop at BBC - The Future Is Now:

> **Modeling animal behavior with connected robots.**

  - Using Sphero as robots: controlling color, movement, position, impact, ...
  - Building a Node.js application to controll the robots:
   - Using Cylon.js as a main robotics framework
   - Using Skynet.im as a chatroom for robots
   

Sphero
-----------

Sphero 2.0 are robotic balls:
  - Bluetooth connection, 30m range
  - Goes 4.5 mph
  - Led glow, RGB colors

To control a Sphero robot, you need to pair it with your computer. Follow [instruction for OSX, Ubuntu or Windows](https://github.com/hybridgroup/cylon-sphero#how-to-connect).


Skynet.im
-----------

Skynet is an open source cross-protocol mesh network for machine-to-machine instant messaging. We use Skynet as a chatroom to allow our robots to talk to each other.
Official site: [skynet.im](http://www.skynet.im)

Node.js
-----------

Node.js® is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications.

To install Node on your machine, follow instructions on the [official site](http://nodejs.org/).

Cylon.js
--------------

Cylon.js is a next generation robotics framework with support for 27 different platforms. Technically it's a module for Node.js, and each plugin for a platform is a npm module as well.
  - Official page: [cylonjs.com](http://cylonjs.com)
  - [List of supported platforms](http://cylonjs.com/documentation/platforms/)

To install Cylon.js, open a terminal in the directory of your project and run the following command:

```sh
$ npm install cylon
```

Cylon is intuitive and easy to use. See example below on how to blink an LED on an Arduino:

```sh
var Cylon = require("cylon");

// Initialize the robot
var robot = Cylon.robot({
  // Change the port to the correct port for your Arduino.
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: { name: 'led', driver: 'led', pin: 13 },

  work: function(my) {
    // we do our thing here
    every((1).second(), function() { my.led.toggle(); });
  }
});

// start working
robot.start();
```
## Using this code
--------------

Sphero color
--------------
This first application will allow the connected robot to change color randomly.

1. Start by cloning this repository into a local folder:
```sh
git clone https://github.com/cyberducksupport/FutureIsNow.git .
```
2. Install the dependencies:
```sh
npm install
```
3. Pair a Sphero robot using bluetooth
4. Update the port value in sphero_color.js 
5. Run the app:
```sh
node sphero_color.js
```

Sphero movement
--------------
This application will make a Sphero roll in a random direction every 3s.
As above, pair a Sphero with Bluetooth, update the port value in sphero_roll.js and run the application:
```sh
node sphero_roll.js
```

Testing Skynet
--------------
A lion sends direction to a chatroom. A gnu listens to the chatroom and finds the oposite direction.
1. Open a terminal, run the lion app:
```sh
node lion_skynet-log.js
```
2. Open ANOTHER terminal, run the gnu app:
```sh
node gnu_skynet-log.js
```
3. Both applications are now communicating using Skynet.

The lion and the Gnu herd
--------------

Using the sample code provided here, we will mimic the following behavior:
  - A lion is moving, changing direction randomly every 5 seconds.
  - A herd of gnu is moving in the opposite direction each time the lion is changing direction

1. Pair your Spheros with Bluetooth
2. Update the ports in animals.js, using 1 lion and as many gnus as you want
3. Run the application:
```sh
node animals.js
```

Authors
----

* Benjamin Maugain - [@HerrBen]
* Gareth Drew - [@FrogStew]

License
----

MIT

[@HerrBen]:http://twitter.com/HerrBen
[@FrogStew]:http://twitter.com/frogstew

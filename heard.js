/*
 * Hearding sheep
 * 
 * */

var Cylon = require('cylon');

// Update Bluetooth ports with real values, add or remove robots 
var dog = [
  { port: '/dev/cu.Sphero-BOW-AMP-SPP', name: 'Dog' }
];

var sheep = [
    { port: '/dev/cu.Sphero-BYO-AMP-SPP', name: 'Sheep1' },
    { port: '/dev/cu.Sphero-RBR-AMP-SPP', name: 'Sheep2' },
    { port: '/dev/cu.Sphero-YRB-AMP-SPP', name: 'Sheep3' }
];

// Define color of types of robots
var dog_color = 'red';
var sheep_color = 'darkblue';

// Dog speed: between 1 and 100
var dog_speed = 100;

// Sheep speed: between 1 and 100
var sheep_speed = 100;

var opts = { n: 200, m: 1, pcnt: 0,};

var DogRobot = (function() {

  function DogRobot() {}

  DogRobot.prototype.connection = [
  	{ port: '', name: '', adaptor: 'sphero' },
  	{ name: 'skynet', adaptor: 'skynet', uuid: "eee99e91-58aa-11e4-a406-e361fc970baa", token: "3vlrauvp274d9529ppan51ag3hr27qfr" }
  ];
  
  DogRobot.prototype.device = { name: 'sphero', driver: 'sphero' };

  DogRobot.prototype.born = function() {

    var _this = this;

    // On creation, set the default direction and color
    _this.direction = 0;
    _this.sphero.setColor(dog_color);
    _this.sphero.setBackLED(100);

  };

  DogRobot.prototype.move = function(direction) {

    var _this = this;

    _this.sphero.roll(dog_speed, direction);
  };

  DogRobot.prototype.stop = function() {

    var _this = this;

    _this.sphero.stop();
  };

  // Main Robot logic
  DogRobot.prototype.work = function(me) {

    var _this = this;

    this.born();

    console.log('Calibration Start Dog');
    me.sphero.startCalibration();

    after((10).seconds(), function() {
        console.log('Calibration finish Dog');
        me.sphero.finishCalibration()
    });

    me.sphero.setDataStreaming(['locator', 'accelOne', 'velocity'], opts);
    // SetBackLED turns on the tail LED of the sphero that helps
    // identify the direction the sphero is heading.
    // accepts a param with a value from 0 to 255, led brightness.
    me.sphero.setBackLED(255);

    me.sphero.configureLocator(1, 0, 0, 0);

    me.sphero.on('data', function(data) {
      //console.log("locator:");
      //console.log(data);

      me.skynet.message({
        "devices": "eee99e91-58aa-11e4-a406-e361fc970baa",
        "payload": { "direction": _this.direction, "x": data[0], "y": data[1] }
      });

    });

  };

  return DogRobot;

})();


var SheepRobot = (function() {
  function SheepRobot() {}

  SheepRobot.prototype.connection = [
    { port: '', name: '', adaptor: 'sphero' },
    { name: 'skynet', adaptor: 'skynet', uuid: "eee99e91-58aa-11e4-a406-e361fc970baa", token: "3vlrauvp274d9529ppan51ag3hr27qfr" }
  ];
  
  SheepRobot.prototype.device = { name: 'sphero', driver: 'sphero' };

  SheepRobot.prototype.born = function() {

    var _this = this;

    // On creation, set direction and color
    _this.coordx = 0;
    _this.coordy = 0;
    _this.sphero.setColor(sheep_color);
    _this.sphero.setBackLED(255);
  };

  SheepRobot.prototype.move = function() {

    var _this = this;
    console.log('This should go');

    _this.sphero.roll(sheep_speed, _this.direction);
  };

  SheepRobot.prototype.stop = function() {

    var _this = this;

    _this.sphero.stop();
  };

  // Main Robot logic
  SheepRobot.prototype.work = function(me) {

    var _this = this;

    me.born();

    console.log('Calibration Start Sheep');
    me.sphero.startCalibration();

    after((10).seconds(), function() {
        console.log('Calibration finish Sheep');
        me.sphero.finishCalibration()
    });

    me.sphero.setDataStreaming(['locator', 'accelOne', 'velocity'], opts);
    // SetBackLED turns on the tail LED of the sphero that helps
    // identify the direction the sphero is heading.
    // accepts a param with a value from 0 to 255, led brightness.
    me.sphero.setBackLED(255);

    me.sphero.configureLocator(1, 0, 0, 0);

  // When received a message from the lion
  me.skynet.on('message', function(data) {
      // Get dog's direction
      coordx = data.payload.x;
      coordy = data.payload.y;

      var heading = Math.atan2(coordy - _this.coordy, coordx - _this.coordx) * 180 / Math.PI;
      console.log(Math.sqrt((coordx -= _this.coordx) * coordx + (coordy -= _this.coordy) * coordy));

      console.log('Device: ' + coordx + ','+coordy+'--'+_this.coordx+','+_this.coordy);
      var distance = (((coordx -= _this.coordx) * coordx + (coordy -= _this.coordy) * coordy) / 1000);
      console.log('Distance: ' + distance);
      if(distance < 10)
      {
        console.log('heading: ' + heading);
        _this.sphero.roll(100, (( heading + 180 ) % 360));
      }
      else
      {
        console.log('stop');
        _this.sphero.stop();
      }
    });

  me.sphero.on('data', function(data) {

      _this.coordx = data[0];
      _this.coordy = data[1];

    });

  };

  return SheepRobot;

})();

var Keyboard = (function() {

  function Keyboard() {}

  Keyboard.prototype.connection = { name: 'keyboard', adaptor: 'keyboard' };
  
  Keyboard.prototype.device = { name: 'keyboard', driver: 'keyboard' };

  // Main Robot logic
  Keyboard.prototype.work = function(me) {

    var _this = this;

    var dog = Cylon.robots['Dog'];

    me.keyboard.on('up', function(){
      dog.move(0);
    });
    me.keyboard.on('down', function(){
      dog.move(180);
    });
    me.keyboard.on('left', function(){
      dog.move(270);
    });
    me.keyboard.on('right', function(){
      dog.move(90);
    });
    me.keyboard.on('space', function(){
      dog.stop();
    });
    
  };

  return Keyboard;

})();


// Create the dog
var bot = dog[0];
var dogbot = new DogRobot;

dogbot.connection[0].port = bot.port;
dogbot.name = bot.name;

Cylon.robot(dogbot);


// Create the sheep
for (var i = 0; i < sheep.length; i++) {
  var bot = sheep[i];
  var robot = new SheepRobot;

  robot.connection[0].port = bot.port;
  robot.name = bot.name;

  Cylon.robot(robot);

  var robot = new Keyboard;
  Cylon.robot(robot);
}

// Run Cylon
Cylon.start();
'use strict'
var Discordie = require("discordie");
var Events = Discordie.Events;

var client = new Discordie();

client.connect({
  email: "",
  password: ""
});

var roll = function(count, die) {
  let results = {rolls: [], total: 0};
  for (let i = 0; i < count; i++) {
    let value = Math.floor(Math.random() * die) + 1;
    results.rolls.push(value);
    results.total += value;
  }
  return results;
}

client.Dispatcher.on(Events.GATEWAY_READY, (e) => {
	console.log("Ready");
});

client.Dispatcher.on(Events.MESSAGE_CREATE, (e) => {
  if(e.message.content.startsWith('/roll')) {
    console.log('parsing', e.message.content);

    var rest = e.message.content.slice(6);
    var diceRegex = /(\d+)d(\d+)([+-]\d+)?/i;
    var results = rest.match(diceRegex);
    if(results === null || results.length < 2) {
      e.message.channel.sendMessage('format: XdY+Z');
      return;
    }
    var count = parseInt(results[1]);
    var die = parseInt(results[2]);

    var rollResults = roll(count, die);
    var value = rollResults.total;

    console.log(results);
    if(results[3] !== undefined) {
      var addSub = results[3].substr(0, 1);
      var modifier = parseInt(results[3].slice(1));
      if(addSub === '-') {
        modifier *= -1;
      }
      console.log(addSub, modifier);
      value += modifier;
    }


    e.message.channel.sendMessage(`${e.message.member.username}: ${value} (${rollResults.rolls})`);
  }
});

setInterval(function() {

}, 1000);

const _ = require('lodash');
const Primus = require('primus');
const argv = require('minimist')(process.argv.slice(2));
const isQuiet = process.env.QUIET;
const al = require('../../shared/asset-loader');
// get a big list of names (don't really care what)
let names = [
    'Jombocom', 'Carple', 'Danret', 'Swilia', 'Bripz', 'Goop',
    'Jeut', 'Axce', 'Groat', 'Jack', 'Xefe', 'Ooola', 'Getry',
    'Seripity', 'Tence', 'Rawgle', 'Plez', 'Zep', 'Shet', 'Jezza',
    'Lord Sirpy', 'Sir Pipe', 'Pleb', 'Rekter', 'Pilu', 'Sengai',
    'El Shibe', 'La Gpoy', 'Wizzrobu', 'Banana', 'Chelpe', 'Q',
    'Azerty'
];
_.each(['mainhand', 'offhand', 'monster', 'trainer', 'bread', 'meat', 'veg'], type => {
    names.push(_.map(al.ObjectAssets[type], o => o.name));
});
_.each(['deity'], type => {
    names.push(al.StringAssets[type]);
});
const players = [].concat.apply([], names);
names = {};
const numPlayers = Math.max(1, Math.min(players.length, argv.players)) || 1;
let numConnected = 0;
let doDisplayConnections = false;
console.log(`Testing with ${numPlayers} players.` + (process.env.QUIET ? ' (quiet mode. ssh...)' : ''));
const sockets = {};
const play = (name, index) => {
    const Socket = Primus.createSocket({
        transformer: 'websockets',
        parser: 'JSON',
        plugin: {
            emit: require('primus-emit')
        }
    });
    const socket = new Socket('ws://localhost:' + (process.env.PORT || 8080));
    const login = () => {
        const userId = `local|${name}`;
        socket.emit('plugin:player:login', { name, userId });
        socket.emit('plugin:player:request:pets');
    };
    sockets[name] = socket;
    socket.on('open', () => {
        numConnected++;
        if (!isQuiet || doDisplayConnections) {
            console.log(`${name} connected.`);
        }
        login();
    });
    socket.on('close', () => {
        console.log(`${name} disconnected.`);
        numConnected--;
    });
    socket.on('data', msg => {
        if (msg.update === 'player') {
            const choices = msg.data.choices;
            const name = msg.data.name;
            if (choices.length > 0) {
                _.each(choices, choice => {
                    // if(choice.event === 'PartyLeave') return;
                    socket.emit('plugin:player:makechoice', {
                        playerName: name,
                        id: choice.id,
                        response: 'Yes'
                    });
                });
            }
        }
        if (msg.update === 'petbasic') {
            _.each(msg.data, petInfo => {
                if (petInfo.bought)
                    return;
                console.log(`Buying ${petInfo.name}`);
                socket.emit('plugin:pet:buy', { petType: petInfo.name, petName: petInfo.name });
            });
        }
        if (!msg.type || !msg.text)
            return;
        if (isQuiet)
            return;
        if (msg.type === 'Global' && index === 1) {
            console.log(`[${msg.type}] ${msg.text}`);
        }
        else if (msg.type === 'Single' && msg.targets[0] === name) {
            _.each(msg.targets, target => {
                console.log(`[${target}] ${msg.text}`);
            });
        }
    });
};
if (argv.random) {
    _.each(_.sampleSize(players, numPlayers), play);
}
else if (argv.name) {
    console.log(`Playing with ${argv.name}`);
    play(argv.name, 0);
}
else {
    _.each(players.slice(0, numPlayers), play);
}
// expect 50 players a second to join. Do it this way so quiet mode is quieter
setTimeout(() => {
    if (numConnected == numPlayers) {
        console.log('all players connected');
    }
    else {
        console.log(numConnected + ' of ' + numPlayers + ' connected.');
    }
    doDisplayConnections = true;
}, 1000 * Math.ceil(numPlayers / 50));

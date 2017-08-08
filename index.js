var request = require('request');

// Declare API endpoint for the IOTA node
var iotaNode = 'http://localhost:15265'


var snapshot = function() {

    var command = {
        'command': 'Snapshot.getState'
    }

    var options = {
        url: iotaNode,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(command))
        },
        json: command
    };

    request(options, function (error, response, data) {

        if (!error && response.statusCode == 200) {

            var latestState = data.ixi.state;

            // FIRST VALIDATION
            // Check if total sum is equal to the supply 2779530283277761
            var totalSupply = (Math.pow(3, 33) - 1) / 2
            var snapshotBalance = 0;

            for (var key in latestState) {

                if (latestState.hasOwnProperty(key)) {

                    snapshotBalance += parseInt(latestState[key]);

                }

            }

            console.log("BALANCE CORRECT: ", snapshotBalance === totalSupply);

            validateSnapshot(latestState);

        } else {
            console.log("COULD NOT PROCESS REQUEST!", error);
        }
    });

}

var validateSnapshot = function(latestState) {

    // Snapshot as posted by Paul H (Core Developer of IOTA)
    var snapshotUrl = 'https://ipfs.io/ipfs/QmRwdX9mwYof1qkMbQgphnsh9kr32itmTtohusWYH1menV'

    request(snapshotUrl, function (error, response, body) {

        var snapshot = JSON.parse(body);
        var numEntries = snapshot.length;

        console.log("VALIDATING SNAPSHOT ENTRIES: ", numEntries);
        // We now compare the snapshot to the latest state
        snapshot.forEach(function(entry) {

            var address = entry.address;
            var balance = entry.balance;

            var sameBalance = parseInt(latestState[address]) === parseInt(balance);

            if (!sameBalance) {
                console.log("FATAL ERROR: Balance incorrect for: ", address);
                console.log("Balance (proposed snapshot vs. local): ", balance, parseInt(latestState[address]))
            }

            // now we remove the address from the latestState
            delete latestState[address];
        })

        console.log("LATEST STATE EQUALS SNAPSHOT: ", Object.keys(latestState).length === 0 && latestState.constructor === Object);

    })

}

snapshot()

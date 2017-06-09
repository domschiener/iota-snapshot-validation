var request = require('request');

// Declare API endpoint for the IOTA node
var iotaNode = 'http://localhost:14600'


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

            // add manual claims to the snapshot
            addManualClaims(latestState, function(e, updatedState) {

                var nullHash = '999999999999999999999999999999999999999999999999999999999999999999999999999999999';

                var nullHashBalance = updatedState[nullHash];
                // empty nullHash
                delete updatedState[nullHash];

                // address controlled by the IOTA Foundation
                var foundationAddress = 'MCQVDPXBCCANXCFYAYWOZNYKDBTFPSUGPTOFYEMPYVOCKOTDIJLUBBUSQIEHTYUIEORPMIS9ZDXQDSJDR';

                // Send nullHashBalance to the IOTA Foundation Address
                updatedState[foundationAddress] = nullHashBalance;

                // Case 1
                //
                // 500Gi sent to recipient
                // Reason: Unknowingly sent funds to nullHash. Funds could be easily recovered
                // via other means
                var case1recipient = 'M9HNETZSOLPXOFSDELYLAD9Y9YVXAWCYMLCORHGDOYYASJZUPCTGZWWSOHKSFRVNNVR9VXFXMREULIYFJ';
                var case1Funds = 500000000000;
                updatedState[foundationAddress] -= case1Funds;
                updatedState[case1recipient] = updatedState[case1recipient] ? updatedState[case1recipient] += case1Funds : updatedState[case1recipient] = case1Funds;

                // Case 2
                //
                // 386697000000 sent to recipient
                // Reason: Sent funds to old address scheme. Funds could be easily recovered
                // via other means
                var case2recipient = 'YX9PFDCREJKYOOQGKXKGPLKOEXTCOXMWCNAMQDFV9WYU9K9OOWPWD9DNBRFMKSJWYTTOGUVBNJXLQM9HF';
                var case2oldAddress = 'ZQQXBSLFRN9EYOKQUKQ9RGIEFQACIEKUMLTEFSKH9NGSH9VIVJTBGYTCYSBNCJB9QLIVFCPMMTPJVVHOY';
                var case2Funds = 386697000000
                updatedState[case2oldAddress] -= case2Funds;
                updatedState[case2recipient] = updatedState[case2recipient] ? updatedState[case2recipient] += case2Funds : updatedState[case2recipient] = case2Funds;

                delete updatedState[case2oldAddress];

                // Case 3
                //
                // 24497000000 sent to recipient
                // Reason: Sent funds to old address scheme. Funds could be easily recovered
                // via other means
                var case3recipient = 'YQXBRVKJOJXWLMI9BUK9XZTOASUTTMKFYCHTQNJSFWCYKSUMB9AUZLZCPU9WFNUOYCYKEB9EXCIN9SEDW';
                var case3oldAddress = 'MITICUBQBYLYOXIMOBVWSTHEDSOD9OIFNAICTOEONKQTZITZEEYCATHDLHBQULWERMXFLJHALGOG9D9RH';
                var case3Funds = 24497000000
                updatedState[case3oldAddress] -= case3Funds;
                updatedState[case3recipient] = updatedState[case3recipient] ? updatedState[case3recipient] += case3Funds : updatedState[case3recipient] = case3Funds;

                delete updatedState[case3oldAddress];

                // Case 4
                //
                // 138129000000 sent to recipient
                // Reason: Sent funds to old address scheme. Funds could be easily recovered
                // via other means
                var case4recipient = 'WP9QVUIREAXFUQH9LNQDCXDJIMWMSDUMJHAHMGCPCFLVKLHGXEIDKKCKDYQH9TXLQUEZVITSTMSMPDWUV';
                var case4oldAddress = 'HYDMUQPRGGTCSVSGPDCFEZQXKHMZSKIOTJLNOSYKJCRSVMYTVEEF9YTG9LZHUJGJJRUUSPTVFNAPZOMDR';
                var case4Funds = 138129000000
                updatedState[case4oldAddress] -= case4Funds;
                updatedState[case4recipient] = updatedState[case4recipient] ? updatedState[case4recipient] += case4Funds : updatedState[case4recipient] = case4Funds;

                delete updatedState[case4oldAddress];

                // as a final step, compare the two
                validateSnapshot(updatedState);
            })


        } else {
            console.log("COULD NOT PROCESS REQUEST!", error);
        }
    });

}

var addManualClaims = function(snapshot, callback) {

    console.log("ADDING MANUAL CLAIMS NOW");

    var manualClaimsList = {
        'JFKECWKBTQIIBRRZFGUMEROJSSDKLCK9E9CJ9OHQIKKWRYLAZIELNQVHBADXRRNQGSXGESADYMXRANV9K' : '4302318738691',
        'TWJEAUEYTME9VCCFHNKKIJUKVDVMVHCXCYVJSQVGPMKURYZVJEXZHMOZKAP9RLF9ULN9OODUIZV9ZMBQR' : '333543720000',
        'BQTVMZFGUABNTZ9HLUAYWKOFVMFPFO9GAGPDUYXDXIRSNEYVBGHLTFHFHPIZXYWVQZJKKO9ZHYAQUEPOE' : '239017429752',
        'WYVVWUE9RVXJTDBVXRFKYOFMXNUDNSHGTNLKSVVDFAYRCMXOPCRLXANUYMXF9THCVKPDTUXS9HUIQXA9D' : '38913434000',
        'KFQFBYDCXKMEUPAVSFTNKBYSD9CZVQKI9ZQERAPARLRFQOEM9GCSVSGYMCFNSOKGBUGDMLOSHIKFZBUII' : '12166529484609',
        'GIOGHJSBRSNITUS9DWSSQRDJKLEIMNOHQBAWTOKJKMHCE9EVXB9AKYYQRTBOSJGYDKHAHJQKLBQUDF9MB' : '1085972906988',
        'ZZXXCFMPSLMJPNFZZXWICLAYEDHHIAEIJMMTMZLESWHBOAUMCMJL9MFKGPEMMGBOMYSQKGOZII9BFRKHX' : '4780354154102',
        'UQ9YHOITIZTSVSVEHGYQLVLTLBFLWBM9CQDCRIEVOMFX9SOGSGVQS9LMYUXPCIFIMFR9CIWEGXYKGUHFX' : '2366275306280',
        'YYVOIYDHRMYWHTCIDVLNWEESKQKHKPPPZIQHKULUC9ZCHXFKYCI9JDQH9DBRKLEEGRYNL9LYMPKPSTAJD' : '4541336446396',
        'FIEE9MMWGAHWFMGVOLQOSIEMIWEEXUMWZJ9ERQB9AUFFSUTJSATLQXO9BCSFQLVLAXAPEVEEBUCVUFLQX' : '2222864681657',
        'IXHNYAWKPYTSEECDNONMFAMFXMMDXRMEZHGZKYPAQROAHAXIPKTFUXMXRRESAH9AATWYXTXZMEZFKALAZ' : '1023951425090',
        'OCWLWWSDFRJYNQKLFZDAKRTFDZMTYFWZPKOUETWWYKSXFMZMRLRBHMPQFKEXPJSAQGHUMZPLNBKVUTYAF' : '38913434000',
        'ZHFHYNEGUPYVJRTHRSFITNCYYEKLWAHGPMW9VYASNOKZYJLXCUQUTQGODKLGSGNBJLIFWZFLZYZDYRVBD' : '107557843388',
        'RDZXVRWQBICNM9VVNPERMSGTBFIKGEHRYPHVZNGNTSZVSLKNYZBBSYPKLAMYVQGICKJIWVTGMJVMGPSVU' : '207635968856', 'XYQVEKSSCDKZPXPYIUYF9YAJGKNBXSJUQEONPMCLGWKEPOKAC9JYDVPTZADWRMSCKWEGSYNJUEGKFGTYI': '28351208889433'
    }

    var addedToSnapshot = 0;

    // This address is owned by the Foundation and is being used to subtract the funds from
    var addressToSubtract = 'PPLNDRIWPOJZNKEGGPUNFVBEBENBBTQSXKXNOGKNVQBLQNHULLMFRT9RKHOAUCD9JAQNTRFHKEITPVJDC';

    for (var key in manualClaimsList) {

        if (manualClaimsList.hasOwnProperty(key)) {

            var balance = parseInt(manualClaimsList[key]);

            // Add claim to snapshot
            // If address already existent, simply increment
            snapshot[key] = snapshot[key] ? snapshot[key] += balance : snapshot[key] = balance;
            // Subtract claim balance from IOTA Foundation address
            snapshot[addressToSubtract] -= balance;
            // Just for logging purposes
            addedToSnapshot += balance;
        }

    }

    console.log("ADDED MANUAL CLAIMS: ", addedToSnapshot);

    return callback(null, snapshot);

}

var validateSnapshot = function(latestState) {

    var snapshotUrl = 'https://gist.githubusercontent.com/domschiener/ac11dd4481f940856f07ecf4f2a6b5b9/raw/8872dd1faae3312e1fc953f5539e5cfefc6cd3a5/Snapshot.json'

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

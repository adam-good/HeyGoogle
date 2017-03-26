
/*
*   My handy dandy "hey google" extension
*   Author: Adam Good
*   Date:   03-26-17
*/

var voiceRec;
var text = '';
var ready2search = false;

/*
*   This function will set up the script to
*/
var setup = function() {
    // First just make sure chrome has the ability to use speech recognition
    // If not, try to upgrade so it can
    if (!('webkitSpeechRecognition' in window)) {
        upgrade();
    } else {
        voiceRec = new webkitSpeechRecognition();   // Create a new speech recognition object
        voiceRec.continuous = false;                // Set it so it only listens to one phrase at a time
        voiceRec.interimResults = false;            // Set it so it only returns results after the phrase is finished

        // Here we force the extension to get permissions
        chrome.tabs.create({ url: "/app/src/micpermission.html"});

        voiceRec.onstart = function() {
            console.log("Starting...");     // This was just for debugging. Will remove when I stop working on this extension
        }
        voiceRec.onresult = function(event) {
            text = event.results[0][0].transcript;  // We store the final transcript in text to be processed later
        }
        voiceRec.onerror = function(event) {
            console.log(event.error);           // Log any error we get
        }
        voiceRec.onend = function() {
            // After the recorder stops (AKA when the user stops speaking)
            console.log(text);
            if (ready2search) {
                search (text);  // If the user has said "hey google" we search
            } else {
                readText()      // Otherwise just read whatever gibberish they're saying until they say "hey google"
            }
        }
    }

    // Once everything is set up go ahead and start listening
    if (voiceRec != null)
        voiceRec.start();
}

// This is just where we wat to here "hello google"
var readText = function() {
    if (text == 'hey Google') {
        ready2search = true;        // Flip this so we know to search the next phrase
        playAudio("WHAAATTT.wav");  // Play the awesome audio
    }
    // We always restart the listener here because we want to listen indefinately
    text = '';
    voiceRec.start();
}

// This well perform the actualy search for the user
var search = function() {
    ready2search = false;                   // Set this to false so we can listen for "hey google" again
    var url = "https://google.com/#q=";     // Define the base of the url.

    // Here we build the rest of the url
    // Should be in the format:     https://google.com/#q=words+to+search&*
    var words = text.split(" ");
    for (var i in words)
        url += words[i] + '+';  // Append the word and a + sign for each word we're searching for
    url = url.slice(0, -1);     // Remove the + sign at the end that we just put on
    url += "&*";                // I don't know why we need this at the end, it's just how google URLs seem to be built

    playAudio("OKAAAYY.wav");           // Play the awesome audio
    chrome.tabs.create({ "url": url }); // Create a new tab with our search url

    text = '';
    voiceRec.start();                   // Start listening again
}

// This literally just plays the audio files
var playAudio = function(source) {
    var audio = new Audio();                        // Create an audio object
    audio.src = "app/resources/audio/" + source;    // Give it a file to play
    audio.play();                                   // Play the file
}

setup();

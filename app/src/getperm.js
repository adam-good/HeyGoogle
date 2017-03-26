/*
*   This script literally just exists to ask the user for mic permissions
*   For some reason you can't ask for permissions from a background script so I just force it here
*/
if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    voiceRec = new webkitSpeechRecognition();
    voiceRec.start();
    voiceRec.stop();
}

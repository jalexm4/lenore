//
// Audio
//
export function save_audio_time() {
    const bg_audio = document.getElementById("bg-audio");
    // Event listener executes every update to the audio time
    bg_audio.addEventListener("timeupdate", () => {
        if (localStorage.getItem("bg") === "0") {
            bg_audio.pause();
            return;
        }
        // Store the current audio time with two decimal digits in stiring format
        localStorage.setItem("bg-audio-time", bg_audio.currentTime.toFixed(2));
    });
}
// Wait until audio file has fully loaded
window.addEventListener("load", audio);
// Only executes on index - Checks for audio time, then starts saving
function audio() {
    load_audio_time();
    save_audio_time();
}
function load_audio_time() {
    const bg_audio = document.getElementById("bg-audio");
    // Set volume
    bg_audio.volume = 0.2;
    // Get time if present
    const time = localStorage.getItem("bg-audio-time");
    if (!time) {
        return;
    }
    // Only set time if it was stored in localStorage
    bg_audio.currentTime = Number(time);
}

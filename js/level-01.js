//
// Lenore - Level 1
// 2D Sidescrolling Game
// MIT License
//
import { handleKeyDown, handleKeyUp } from "./event_handlers.js"; // User Input Event Listeners
// Wait for all resources to be loaded before executing
window.addEventListener("load", main);
// --- Constants ---
const GRAVITY = 1; // Downward force
// Canvas API
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
// Player Object
const player = {
    x: 100, // 2D space X coordinate (Starting Pos)
    y: 100, // 2D space Y coordinate (Starting Pos)
    width: 100, // Width
    height: 100, // Height
    x_velocity: 0, // Movement to apply on X axis
    y_velocity: 0, // Movement to apply on Y axis
};
// Which keys are currently being pressed for a frame
const keys = {
    a: false,
    d: false,
    space: false,
};
// Starting function - Setups up the game
function main() {
    // Set canvas size to viewport size
    canvas.width = window.innerWidth;
    ;
    canvas.height = window.innerHeight;
    // Start User Input Event Listeners
    handleKeyDown(keys);
    handleKeyUp(keys);
    // Start game loop
    requestAnimationFrame(game_loop);
}
// Executed every frame
function game_loop() {
    // Clear previous frame
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Checking for user input
    if (keys.a && !keys.d) {
        // Player should move left
        player.x_velocity = -10;
    }
    else if (keys.d && !keys.a) {
        // Player should move right
        player.x_velocity = 10;
    }
    else {
        // Player should not move
        player.x_velocity = 0;
    }
    // Player should jump
    if (keys.space) {
        player.y_velocity = -15;
    }
    // Apply gravity if player is in the air
    if (player.y + player.height + player.y_velocity < canvas.height) {
        player.y_velocity += GRAVITY;
    }
    else {
        // On the ground - Y position shouldnt update
        player.y_velocity = 0;
    }
    // Apply any velocity on x and y axis
    player.x += player.x_velocity;
    player.y += player.y_velocity;
    // Render Background 
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Render Player
    context.fillStyle = "white";
    context.fillRect(player.x, player.y, player.width, player.height);
    // Draw next frame
    requestAnimationFrame(game_loop);
}

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
    // Render Background 
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Render Player
    context.fillStyle = "white";
    context.fillRect(player.x, player.y, player.width, player.height);
    // Draw next frame
    requestAnimationFrame(game_loop);
}

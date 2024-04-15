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
const SCALE = 3; //
const TILE = 24; //
// --- Classes ---
// Used as a constructor to create a collison tile object
class collison_tile {
    constructor(x, y) {
        this.x = x * SCALE + background_x_offset; // X should be offseted by the scale (300%) and horizontal perspective shift
        this.y = y * SCALE + background_y_offset; // Y should be offseted by the scale (300%) and vertical perspective shift
        this.width = TILE * SCALE; // 24x24 Tilesize * 300% Zoom
        this.height = TILE * SCALE; // 24x24 Tilesize * 300% Zoom
    }
}
// --- Loaded Assets ---
const background = new Image();
background.src = "/assets/levels/level1.png";
const player_spritesheet = new Image();
player_spritesheet.src = "/assets/player/spritesheet.png";
// Canvas API
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
// Other - Find a better spot
let background_x_offset = 0;
let background_y_offset = 0;
const collison_tiles = [];
// Player Object
const player = {
    x: 100, // 2D space X coordinate (Starting Pos)
    y: 100, // 2D space Y coordinate (Starting Pos)
    width: player_spritesheet.width / 10, // Width of a single player sprite
    height: player_spritesheet.height / 8, // Height of a single player sprite
    x_velocity: 0, // Movement to apply on X axis
    y_velocity: 0, // Movement to apply on Y axis
    crop: {
        x: 0, // Animation offset
        y: 0 // Sprite type offset
    },
    hitbox: {
        x: 0, // Tied to player x + offset
        y: 0, // Tied to player y + offset
        width: 70, // Horziontal Length of player in game-world
        height: 112, // Vertical Length of player in game-world
    },
    hitbox_x_offset: 130, // Amount to offset from left side of player image being drawn
    hitbox_y_offset: 130, // Amount to offset from top side of player image being drawn
};
// Which keys are currently being pressed for a frame
const keys = {
    a: false, // Move left on true
    d: false, // Move right on true
    space: false, // Jump on true
};
// Starting function - Setups up the game
function main() {
    // Set canvas size to viewport size
    canvas.width = window.innerWidth;
    ;
    canvas.height = window.innerHeight;
    // Set background y offset to position image bottom with canvas bottom.
    background_y_offset = -background.height + canvas.height;
    // Setup player hitbox
    player.hitbox.x = player.x + player.hitbox_x_offset;
    player.hitbox.y = player.y + player.hitbox_y_offset;
    // Setup Collision Blocks
    setup_collisions();
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
    // Apply X velocity 
    player.x += player.x_velocity;
    // Update hitbox for horizontal collsions
    player.hitbox.x = player.x + player.hitbox_x_offset;
    player.hitbox.y = player.y + player.hitbox_y_offset;
    // Check for Horizontal  Collisions
    for (let i = 0, n = collison_tiles.length; i < n; i++) {
        // Check if the player and any collison block are colliding
        if (aabb_collison_detection({ x: player.hitbox.x, y: player.hitbox.y, width: player.hitbox.width, height: player.hitbox.height }, { x: collison_tiles[i].x, y: collison_tiles[i].y, width: collison_tiles[i].width, height: collison_tiles[i].height })) {
            // Player is moving right
            if (player.x_velocity > 0) {
                // Kill horizontal velocity
                player.x_velocity = 0;
                // Update player Y pos to be to the left of the collision tile
                const offset = player.hitbox.x - player.x + player.hitbox.width;
                player.x = collison_tiles[i].x - player.width - offset - 0.01;
                // No need to check for any more collisions
                break;
            }
            // Player is moving left 
            if (player.x_velocity < 0) {
                // Kill horizontal velocity
                player.x_velocity = 0;
                // Update player Y pos to be to the right of the collision tile
                const offset = player.hitbox.x - player.x;
                player.x = collison_tiles[i].x + collison_tiles[i].width - offset + 0.01;
                // No need to check for any more collisions
                break;
            }
        }
    }
    // Apply gravity if player is in the air
    if (player.y + player.height + player.y_velocity < canvas.height) {
        player.y_velocity += GRAVITY;
    }
    else {
        // On the ground - Y position shouldnt update
        player.y_velocity = 0;
    }
    // Apply Y velocity
    player.y += player.y_velocity;
    // Update hitbox again for vertical collisions
    player.hitbox.x = player.x + player.hitbox_x_offset;
    player.hitbox.y = player.y + player.hitbox_y_offset;
    // Check for Vertical Collisions
    for (let i = 0, n = collison_tiles.length; i < n; i++) {
        // Check if the player and any collison block are colliding  
        if (aabb_collison_detection({ x: player.hitbox.x, y: player.hitbox.y, width: player.hitbox.width, height: player.hitbox.height }, { x: collison_tiles[i].x, y: collison_tiles[i].y, width: collison_tiles[i].width, height: collison_tiles[i].height })) {
            // Player is moving downwards
            if (player.y_velocity > 0) {
                // Kill vertical velocity
                player.y_velocity = 0;
                // Update player Y pos to be on top of the collision tile
                const offset = player.hitbox.y - player.y + player.hitbox.height;
                player.y = collison_tiles[i].y - offset - 0.01;
                // No need to check for any more collisions
                break;
            }
            // Player is moving up
            if (player.y_velocity < 0) {
                // Kill vertical velocity
                player.y_velocity = 0;
                // Update player Y pos to be below the collsion tile
                const offset = player.hitbox.y - player.y;
                player.y = collison_tiles[i].y + collison_tiles[i].height - offset + 0.01;
                // No need to check for any more collisions
                break;
            }
        }
    }
    // Final hitbox update before rendering
    player.hitbox.x = player.x + player.hitbox_x_offset;
    player.hitbox.y = player.y + player.hitbox_y_offset;
    // Render Background 
    context.drawImage(background, background_x_offset, background_y_offset);
    // Render Player
    context.drawImage(// Nine Argument Version
    player_spritesheet, // Image to be drawn
    player.crop.x, // Cropping rectangle x pos
    player.crop.y, // Cropping rectangle y pos 
    player.width, // Crop width (same as player)
    player.height, // Crop height (same as player)
    player.x, // Destination X
    player.y, // Destination Y
    player.width, // Destination Width
    player.height);
    // Visual - Draw Collision Blocks
    context.fillStyle = "rgba(255, 0, 0, 0.5)";
    for (let i = 0; i < collison_tiles.length; i++) {
        context.fillRect(collison_tiles[i].x, collison_tiles[i].y, collison_tiles[i].width, collison_tiles[i].height);
    }
    // Visual - Draw Player Hitbox
    context.fillStyle = "rgba(0, 255, 0, 0.5)";
    context.fillRect(player.hitbox.x, player.hitbox.y, player.hitbox.width, player.hitbox.height);
    // Draw next frame
    requestAnimationFrame(game_loop);
}
// Returns True if collision detected between rect1 and rect2. False otherwise.
function aabb_collison_detection(rect1, rect2) {
    // Axis Aligned Bounding Box Collision Detection.
    // Fine for current scope of game but should be replaced with some advanced datastructures and detection algorithms if expanding
    return (rect1.y + rect1.height >= rect2.y && rect1.y <= rect2.y + rect2.height && rect1.x <= rect2.x + rect2.width && rect1.x + rect1.width >= rect2.x);
}
// Generates collision tiles from raw tiledata
function setup_collisions() {
    let columns = raw_tile_data.length;
    let rows = raw_tile_data[0].length;
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (raw_tile_data[i][j] == 316) {
                // Create collision block
                let block = new collison_tile(j * TILE, i * TILE);
                collison_tiles.push(block);
            }
        }
    }
    return;
}
// Tile data for level 1
// 0 - Ignore/Placeholder
// 316 - Collision tile
const raw_tile_data = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [316, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [316, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [316, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316, 316]
];

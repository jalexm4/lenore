//
// Lenore - Level 1
// 2D Sidescrolling Game
// MIT License
//

// --- Attribution  ----
//
// - Background
// -- Oak Woods Tileset (brullov) @ https://brullov.itch.io/oak-woods
//
// - Player
// -- Fantasy Knight (aamatniekss) @ https://aamatniekss.itch.io/fantasy-knight-free-pixelart-animated-character

// --- Imports ---
import { Keys, CollisionObject } from "./interfaces.js";                             // Interfaces - Only for TypeScript
import { handleKeyDown, handleKeyUp } from "./event_handlers.js";   // User Input Event Listeners

// Wait for all resources to be loaded before executing
window.addEventListener("load", main);

// --- Constants ---
const GRAVITY = 1;  // Downward force
const SCALE = 3;    //
const TILE = 24;    //

// --- Classes ---

// ...
class collison_tile
{
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number)
    {
        this.x = x * SCALE + background_x_offset;
        this.y = y * SCALE + background_y_offset;
        this.width = TILE * SCALE;
        this.height = TILE * SCALE;
    }
}

// --- Loaded Assets ---
const background = new Image();
background.src = "/assets/levels/level1.png";

const player_spritesheet = new Image();
player_spritesheet.src = "/assets/player/spritesheet.png";

// Canvas API
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

let background_x_offset = 0;
let background_y_offset = 0;
const collison_tiles: collison_tile[] = [];

// Player Object
const player = {
    x: 100,                                 // 2D space X coordinate (Starting Pos)
    y: 100,                                 // 2D space Y coordinate (Starting Pos)
    width: player_spritesheet.width / 10,   // Width of a single player sprite
    height: player_spritesheet.height / 8,  // Height of a single player sprite

    x_velocity: 0,                          // Movement to apply on X axis
    y_velocity: 0,                          // Movement to apply on Y axis

    crop: {                                 // Crop to apply to spritesheet to get a single sprite
        x: 0,                               // Animation offset
        y: 0                                // Sprite type offset
    },
};

// Which keys are currently being pressed for a frame
const keys: Keys = {
    a: false,
    d: false,
    space: false,
};

// Starting function - Setups up the game
function main()
{   
    // Set canvas size to viewport size
    canvas.width = window.innerWidth;;
    canvas.height = window.innerHeight;

    // Set background y offset to position image bottom with canvas bottom.
    background_y_offset = -background.height + canvas.height;

    // Setup Collision Blocks
    setup_collisions();

    // Start User Input Event Listeners
    handleKeyDown(keys);
    handleKeyUp(keys);

    // Start game loop
    requestAnimationFrame(game_loop);
}

// Executed every frame
function game_loop()
{
    // Clear previous frame
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Checking for user input
    if (keys.a && !keys.d)
    {
        // Player should move left
        player.x_velocity = -10;
    }
    else if (keys.d && !keys.a)
    {
        // Player should move right
        player.x_velocity = 10;
    }
    else
    {
        // Player should not move
        player.x_velocity = 0;
    }

    // Player should jump
    if (keys.space)
    {
        player.y_velocity = -15;
    }

    // Apply X velocity 
    player.x += player.x_velocity;

    // Check for Horziontal Collisions
    for (let i = 0, n = collison_tiles.length; i < n; i++)
        {
            // Check if the player and any collison block are colliding
            if (aabb_collison_detection({x: player.x, y: player.y, width: player.width, height: player.height}, {x: collison_tiles[i].x, y: collison_tiles[i].y, width: collison_tiles[i].width, height: collison_tiles[i].height}))
            {
                // Player is moving right
                if (player.x_velocity > 0)
                {
                    // Kill horizontal velocity
                    player.x_velocity = 0;

                    // Update player Y pos to be to the left of the collision tile
                    const offset = player.x - player.x + player.width;
                    player.x = collison_tiles[i].x - player.width - offset - 0.01;
                    
                    // No need to check for any more collisions
                    break;
                }
                
                // Player is moving left 
                if (player.x_velocity < 0)
                {
                    // Kill horizontal velocity
                    player.x_velocity = 0;
    
                    // Update player Y pos to be to the right of the collision tile
                    const offset = player.x - player.x;
                    player.x = collison_tiles[i].x + collison_tiles[i].width - offset + 0.01;
                    
                    // No need to check for any more collisions
                    break;
                }
            }
        }

    // Apply gravity if player is in the air
    if (player.y + player.height + player.y_velocity < canvas.height)
    {
        player.y_velocity += GRAVITY;
    }
    else
    {
        // On the ground - Y position shouldnt update
        player.y_velocity = 0;
    }

    // Apply Y velocity
    player.y += player.y_velocity;

    // Check for Vertical Collisions
    for (let i = 0, n = collison_tiles.length; i < n; i++)
    {
        // Check if the player and any collison block are colliding  
        if (aabb_collison_detection({x: player.x, y: player.y, width: player.width, height: player.height}, {x: collison_tiles[i].x, y: collison_tiles[i].y, width: collison_tiles[i].width, height: collison_tiles[i].height}))
        {
            // Player is moving downwards
            if (player.y_velocity > 0)
                {
                    // Kill vertical velocity
                    player.y_velocity = 0;

                    // Update player Y pos to be on top of the collision tile
                    const offset = player.y - player.y + player.height;
                    player.y = collison_tiles[i].y - offset - 0.01;

                    // No need to check for any more collisions
                    break;
                }
    
                // Player is moving up
                if (player.y_velocity < 0)
                {
                    // Kill vertical velocity
                    player.y_velocity = 0;

                    // Update player Y pos to be below the collsion tile
                    const offset = player.y - player.y;
                    player.y = collison_tiles[i].y + collison_tiles[i].height - offset + 0.01;
                    
                    // No need to check for any more collisions
                    break;
                }
        }
    }

    // Render Background 
    context.drawImage(background, background_x_offset, background_y_offset);

    // Render Player
    context.drawImage(          // Nine Argument Version
        player_spritesheet,     // Image to be drawn
        player.crop.x,          // Cropping rectangle x pos
        player.crop.y,          // Cropping rectangle y pos 
        player.width,           // Crop width (same as player)
        player.height,          // Crop height (same as player)
        player.x,               // Destination X
        player.y,               // Destination Y
        player.width,           // Destination Width
        player.height,          // Destination Height 
    );

    // Visual - Draw Collision Blocks
    context.fillStyle = "rgba(255, 0, 0, 0.5)";
    for (let i = 0; i < collison_tiles.length; i++)
    {
        context.fillRect(collison_tiles[i].x, collison_tiles[i].y, collison_tiles[i].width, collison_tiles[i].height);
    }

    // Draw next frame
    requestAnimationFrame(game_loop);
}

function aabb_collison_detection(rect1: CollisionObject, rect2: CollisionObject)
{
    // Axis Aligned Bounding Box Collision Detection.
    // Fine for current scope of game but should be replaced with some advanced datastructures and detection algorithms if expanding

    return (rect1.y + rect1.height >= rect2.y && rect1.y <= rect2.y + rect2.height && rect1.x <= rect2.x + rect2.width && rect1.x + rect1.width >= rect2.x);
}

function setup_collisions()
{
    let columns = raw_tile_data.length;
    let rows = raw_tile_data[0].length;

    for (let i = 0; i < columns; i++)
    {
        for (let j = 0; j < rows; j++)
        {
            if (raw_tile_data[i][j] == 316)
            {
                // Create collision block
                let block = new collison_tile(j * TILE, i * TILE);
                collison_tiles.push(block);
            }
        }
    }

    return;
}

// Tile data for level 1
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
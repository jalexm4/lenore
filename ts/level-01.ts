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
import { Keys, CollisionObject } from "./interfaces.js";            // Interfaces - Only for TypeScript
import { player, player_state, player_dir } from "./player.js";     // Player object and enums
import { handleKeyDown, handleKeyUp } from "./event_handlers.js";   // User Input Event Listeners

// Wait for all resources to be loaded before executing
window.addEventListener("load", main);

// --- Constants ---
const GRAVITY = 1;  // Downward force
const SCALE = 3;    //
const TILE = 24;    //

// --- Classes ---

// Used as a constructor to create a collison tile object
class collison_tile
{
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number)
    {
        this.x = x * SCALE + background_x_offset;   // X should be offseted by the scale (300%) and horizontal perspective shift
        this.y = y * SCALE + background_y_offset;   // Y should be offseted by the scale (300%) and vertical perspective shift
        this.width = TILE * SCALE;                  // 24x24 Tilesize * 300% Zoom
        this.height = TILE * SCALE;                 // 24x24 Tilesize * 300% Zoom
    }
}

// --- Loaded Assets ---
const background = new Image();
background.src = "/assets/levels/level1.png";

player.spritesheet.src = "/assets/player/spritesheet.png";

// Canvas API
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

// Other - Find a better spot
let background_x_offset = 0;
let background_y_offset = 0;
const collison_tiles: collison_tile[] = [];

// Which keys are currently being pressed for a frame
const keys: Keys = {
    a: false,           // Move left on true
    d: false,           // Move right on true
    space: false,       // Jump on true
};

// Starting function - Setups up the game
function main()
{   
    // Set canvas size to viewport size
    canvas.width = window.innerWidth;;
    canvas.height = window.innerHeight;

    // Set background y offset to position image bottom with canvas bottom.
    background_y_offset = -background.height + canvas.height;

    // Setup player hitbox
    player.hitbox.x = player.x + player.hitbox_x_offset;
    player.hitbox.y = player.y + player.hitbox_y_offset;

    // Set spritesheet

    // Set width and height
    player.width = player.spritesheet.width / 10;
    player.height = player.spritesheet.height / 8;

    // Set starting IDLE paramters
    player.sprite_animation.buffer = player.indices.idle.buffer;
    player.sprite_animation.max = player.indices.idle.max - 1;

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
    if (keys.space)
    {
        player.state = player_state.JUMP;
    }
    else if (keys.d && !keys.a)
    {
        player.state = player_state.RUN;
        player.direction = player_dir.RIGHT;
    }
    else if (keys.a && !keys.d)
    {
        player.state = player_state.RUN;
        player.direction = player_dir.LEFT;
    }
    else
    {
        player.state = player_state.IDLE;
    }

    // Attempt to tranistion player to another state
    switch_state();

    // Apply X velocity 
    player.x += player.x_velocity;

    // Update hitbox for horizontal collsions
    player.hitbox.x = player.x + player.hitbox_x_offset;
    player.hitbox.y = player.y + player.hitbox_y_offset;

    // Check for Horizontal  Collisions
    for (let i = 0, n = collison_tiles.length; i < n; i++)
        {
            // Check if the player and any collison block are colliding
            if (aabb_collison_detection({x: player.hitbox.x, y: player.hitbox.y, width: player.hitbox.width, height: player.hitbox.height}, {x: collison_tiles[i].x, y: collison_tiles[i].y, width: collison_tiles[i].width, height: collison_tiles[i].height}))
            {
                // Player is moving right
                if (player.x_velocity > 0)
                {
                    // Kill horizontal velocity
                    player.x_velocity = 0;

                    // Update player Y pos to be to the left of the collision tile
                    const offset = player.hitbox.x - player.x;
                    player.x = collison_tiles[i].x - player.hitbox.width - offset - 0.01;
                    
                    // No need to check for any more collisions
                    break;
                }
                
                // Player is moving left 
                if (player.x_velocity < 0)
                {
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

    // Update hitbox again for vertical collisions
    player.hitbox.x = player.x + player.hitbox_x_offset;
    player.hitbox.y = player.y + player.hitbox_y_offset;

    // Check for Vertical Collisions
    for (let i = 0, n = collison_tiles.length; i < n; i++)
    {
        // Check if the player and any collison block are colliding  
        if (aabb_collison_detection({x: player.hitbox.x, y: player.hitbox.y, width: player.hitbox.width, height: player.hitbox.height}, {x: collison_tiles[i].x, y: collison_tiles[i].y, width: collison_tiles[i].width, height: collison_tiles[i].height}))
        {
            // Player is moving downwards
            if (player.y_velocity > 0)
                {
                    // Kill vertical velocity
                    player.y_velocity = 0;

                    // Update player Y pos to be on top of the collision tile
                    const offset = player.hitbox.y - player.y + player.hitbox.height;
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

    // Iterate across the sprites to create a animation
    player.crop.x = player.sprite_animation.current_frame * player.width;

    // Render Background 
    context.drawImage(background, background_x_offset, background_y_offset);

    // Render Player
    context.drawImage(          // Nine Argument Version
        player.spritesheet,     // Image to be drawn
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

    // Visual - Draw Player Hitbox
    context.fillStyle = "rgba(0, 255, 0, 0.5)";
    context.fillRect(player.hitbox.x, player.hitbox.y, player.hitbox.width, player.hitbox.height);

    // Move to next player sprite frame
    player.sprite_animation.elapsed++;
    if (player.sprite_animation.elapsed % player.sprite_animation.buffer == 0)
    {
        if (player.sprite_animation.current_frame >= player.sprite_animation.max)
        {
            player.sprite_animation.current_frame = 0;
        }
        else
        {
            player.sprite_animation.current_frame++;
        }
    }

    // Draw next frame
    requestAnimationFrame(game_loop);
}

// Switch player between its animation states
function switch_state()
{
    switch (player.state)
    {
        case player_state.JUMP:

            if (player.previous_state != player_state.JUMP)
            {
                player.previous_state = player.state;

                player.y_velocity = player.jump_height;
            }

            break;

        case player_state.IDLE:

            // Transition to idle state if player is in a different state
            if (player.previous_state != player_state.IDLE)
            {
                //
                player.previous_state = player.state;

                // Reset back to first sprite animation frame
                player.sprite_animation.current_frame = 0;
                
                //
                player.sprite_animation.buffer = player.indices.idle.buffer;
                player.sprite_animation.max = player.indices.idle.max - 1;

                if (player.direction == player_dir.RIGHT)
                {
                    player.crop.y = player.indices.idle.right;
                }
                else
                {
                    player.crop.y = player.indices.idle.left;
                }
                
                // Kill velocity
                player.x_velocity = 0;
            }

            break;
        case player_state.RUN:

            //
            if (player.previous_state != player_state.RUN)
            {
                //
                player.previous_state = player.state;

                // Reset back to first sprite animation frame
                player.sprite_animation.current_frame = 0;

                //
                player.sprite_animation.buffer = player.indices.run.buffer;
                player.sprite_animation.max = player.indices.run.max - 1;

                if (player.direction == player_dir.RIGHT)
                {
                    //
                    player.x_velocity = player.speed;

                    //
                    player.crop.y = player.indices.run.right;
                }
                else
                {
                    //
                    player.x_velocity = -player.speed;

                    //
                    player.crop.y = player.indices.run.left;
                }
            }

            break;
        default:
            // Skip
            break;
    }

    return;
}


// Returns True if collision detected between rect1 and rect2. False otherwise.
function aabb_collison_detection(rect1: CollisionObject, rect2: CollisionObject)
{
    // Axis Aligned Bounding Box Collision Detection.
    // Fine for current scope of game but should be replaced with some advanced datastructures and detection algorithms if expanding

    return (rect1.y + rect1.height >= rect2.y && rect1.y <= rect2.y + rect2.height && rect1.x <= rect2.x + rect2.width && rect1.x + rect1.width >= rect2.x);
}


// Generates collision tiles from raw tiledata
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
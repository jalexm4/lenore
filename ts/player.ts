//
//
//


export enum player_state
{
    IDLE = "IDLE",
    RUN = "RUN",
    JUMP = "JUMP"
}

export enum player_dir
{
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}

// Player Object
export const player = {
    x: 100,                                 // 2D space X coordinate (Starting Pos)
    y: 100,                                 // 2D space Y coordinate (Starting Pos)
    width: 0,                               // Width of a single player sprite
    height: 0,                              // Height of a single player sprite

    speed: 10,                              // How fast the player should move at once
    jump_height: -20,                       // How high the player should be able to jump
    x_velocity: 0,                          // Movement to apply on X axis
    y_velocity: 0,                          // Movement to apply on Y axis

    direction: player_dir.RIGHT,            // Direction the player is facing
    state: player_state.IDLE,               // Current state the player is in
    previous_state: player_state.IDLE,      // Previous state the player was in
    on_ground: true,                       // Is the player touching the ground

    crop: {                                 // Crop to apply to spritesheet to get a single sprite
        x: 0,                               // Animation offset
        y: 0                                // Sprite type offset
    },

    hitbox: {                               // Hitbox represents the player size in game-world not the sprite image / spritesheet
        x: 0,                               // Tied to player x + offset
        y: 0,                               // Tied to player y + offset
        width: 70,                          // Horziontal Length of player in game-world
        height: 112,                        // Vertical Length of player in game-world
    },
    hitbox_x_offset: 130,                   // Amount to offset from left side of player image being drawn
    hitbox_y_offset: 130,                   // Amount to offset from top side of player image being drawn

    spritesheet: new Image(),               // Player spritesheet image 

    sprite_animation: {                     // Player's sprite animation state
        current_frame: 0,                   //
        buffer: 0,                          //
        elapsed: 0,                         //
        max: 0,                             //
    },

    indices: {                              // Spritesheet Offsets for player state
        idle: {                             // Default state
            right: 0,
            left: 240,
            max: 10,
            buffer: 6
        },
        run: {                              // Movement State
            right: 480,
            left: 720,
            max: 10,
            buffer: 6
        },
        jump: {                             // Jump state
            right: 960,
            left: 1200,
            max: 3,
            buffer: 1
            
        }
    },

    camera: {                               // Player locked camera
        x: 0,
        y: 0,
        width: 600,
        height: 250
    },
};
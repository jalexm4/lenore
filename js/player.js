//
//
//
export var player_state;
(function (player_state) {
    player_state["IDLE"] = "IDLE";
    player_state["RUN"] = "RUN";
    player_state["JUMP"] = "JUMP";
})(player_state || (player_state = {}));
export var player_dir;
(function (player_dir) {
    player_dir["LEFT"] = "LEFT";
    player_dir["RIGHT"] = "RIGHT";
})(player_dir || (player_dir = {}));
// Player Object
export const player = {
    x: 100, // 2D space X coordinate (Starting Pos)
    y: 100, // 2D space Y coordinate (Starting Pos)
    width: 0, // Width of a single player sprite
    height: 0, // Height of a single player sprite
    speed: 10, // How fast the player should move at once
    jump_height: -20, // How high the player should be able to jump
    x_velocity: 0, // Movement to apply on X axis
    y_velocity: 0, // Movement to apply on Y axis
    direction: player_dir.RIGHT, // Direction the player is facing
    state: player_state.IDLE, // Current state the player is in
    previous_state: player_state.IDLE, // Previous state the player was in
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
    spritesheet: new Image(), // Player spritesheet image 
    sprite_animation: {
        current_frame: 0, //
        buffer: 0, //
        elapsed: 0, //
        max: 0, //
    },
    indices: {
        idle: {
            right: 0,
            left: 240,
            max: 10,
            buffer: 6,
        },
        run: {
            right: 480,
            left: 720,
            max: 10,
            buffer: 6,
        },
    },
};

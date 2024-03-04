//
// Lenore
//

// Wait for all resources to be loaded before executing
window.addEventListener("load", main);

// Canvas API
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

// Player Object
const player = {
    x: 100,         // X Pos
    y: 100,         // Y Pos
    width: 100,     // Width
    height: 100     // Height
};


// Starting function - Setups up the game
function main()
{   
    // Set canvas size to viewport size
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    // Start game loop
    requestAnimationFrame(game_loop);
}

// Executed every frame
function game_loop()
{
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
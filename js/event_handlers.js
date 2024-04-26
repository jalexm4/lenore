//
//
//
//
export function handleKeyDown(keys) {
    // Arrow function
    window.addEventListener("keydown", (event) => {
        switch (event.code) {
            case "KeyA":
                keys.a = true;
                break;
            case "KeyD":
                keys.d = true;
                break;
            case "Space":
                keys.space = true;
                break;
            case "KeyX":
                keys.x = true;
                break;
            default:
                // Some other key - Do nothing
                break;
        }
    });
    return;
}
//
export function handleKeyUp(keys) {
    // Arrow Function
    window.addEventListener("keyup", (event) => {
        switch (event.code) {
            case "KeyA":
                keys.a = false;
                break;
            case "KeyD":
                keys.d = false;
                break;
            case "Space":
                keys.space = false;
                break;
            case "KeyX":
                keys.x = false;
                break;
            default:
                // Some other key - Do nothing
                break;
        }
    });
    return;
}

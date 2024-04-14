//
//
//


import { Keys } from "./interfaces.js";

//
export function handleKeyDown(keys: Keys)
{
    // Arrow function
    window.addEventListener("keydown", (event: KeyboardEvent) =>
    {
        switch (event.code)
        {
            case "KeyA":
                keys.a = true;
                break;
            case "KeyD":
                keys.d = true;
                break;
            case "Space":
                keys.space = true;
                break;
            default:
                // Some other key - Do nothing
                break;
        }
    });

    return;
}

//
export function handleKeyUp(keys: Keys)
{
    // Arrow Function
    window.addEventListener("keyup", (event: KeyboardEvent) =>
    {
        switch (event.code)
        {
            case "KeyA":
                keys.a = false;
                break;
            case "KeyD":
                keys.d = false;
                break;
            case "Space":
                keys.space = false;
                break;
            default:
                // Some other key - Do nothing
                break;
        }
    });

    return;
}

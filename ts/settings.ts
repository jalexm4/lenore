//
// Settings
//

document.addEventListener("DOMContentLoaded", () => {
    // DOM is fully loaded

    // Array of settings that can toggled
    const toggles = ["hitbox", "collision", "camera"];
    
    // Every setting category
    const settings = document.querySelectorAll(".setting-item");

    for (let i = 0; i < settings.length; i++)
    {
        // Add event listener to each category to switch to the newly selected setting.
        const setting = settings[i];
        setting.addEventListener("click", () => {
            switch_setting_cat(setting);
        });
    }

    // Add a event listener to each toggle setting
    for (let i = 0, n = toggles.length; i < n; i++)
    {
        const toggle = document.getElementById(toggles[i] + "-toggle") as HTMLElement;
        toggle.addEventListener("click", () => {
            toggle_setting(toggles[i]);
        });
    }
});


function switch_setting_cat(setting: Element)
{
    // Remove current actively selecting setting.
    const current_active_setting = document.querySelector(".active") as HTMLElement;
    current_active_setting.classList.remove("active");

    // Make newly selected setting active
    setting.classList.add("active");

    // Hide currently shown setting content
    const content_to_hide = document.querySelector(".content-active") as HTMLElement;
    content_to_hide.classList.remove("content-active");
    content_to_hide.style.display = "none";
    
    // Make selected setting's content visible
    const content = document.querySelector("#" + setting.id + "-content") as HTMLElement;
    content.classList.add("content-active");
    content.style.display = "block";
}

// Switch toggle setting between true, false ("1", "0")
function toggle_setting(key: string)
{
    const setting = localStorage.getItem(key);
    if (setting === "1")
    {
        localStorage.setItem(key, "0");
    }
    else
    {
        // Value is currently 0 / null (not been set before)
        localStorage.setItem(key, "1");
    }
}
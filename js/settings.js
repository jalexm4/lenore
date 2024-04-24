"use strict";
//
// Settings
//
document.addEventListener("DOMContentLoaded", () => {
    // DOM is fully loaded
    // Every setting category
    const settings = document.querySelectorAll(".setting-item");
    for (let i = 0; i < settings.length; i++) {
        // Add event listener to each category to switch to the newly selected setting.
        const setting = settings[i];
        setting.addEventListener("click", () => {
            switch_settings(setting);
        });
    }
});
function switch_settings(setting) {
    // Remove current actively selecting setting.
    const current_active_setting = document.querySelector(".active");
    current_active_setting.classList.remove("active");
    // Make newly selected setting active
    setting.classList.add("active");
    // Hide currently shown setting content
    const content_to_hide = document.querySelector(".content-active");
    content_to_hide.classList.remove("content-active");
    content_to_hide.style.display = "none";
    // Make selected setting's content visible
    const content = document.querySelector("#" + setting.id + "-content");
    content.classList.add("content-active");
    content.style.display = "block";
}

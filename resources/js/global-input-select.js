document.addEventListener("focusin", function (e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        if (e.target.type !== "button" &&
            e.target.type !== "checkbox" &&
            e.target.type !== "radio") {

            // Select text after the element receives focus
            setTimeout(() => {
                e.target.select();
            }, 10);
        }
    }
});

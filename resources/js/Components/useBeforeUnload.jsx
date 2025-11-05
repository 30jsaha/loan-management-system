import { useEffect } from "react";

function useBeforeUnload(shouldWarn, formData) {
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (shouldWarn) {
                console.log("User is trying to leave with unsaved changes.");

                // Send data to backend before leaving
                try {
                    const blob = new Blob([JSON.stringify(formData)], { type: "application/json" });
                    navigator.sendBeacon("/api/temp-customer", blob);
                    console.log("Temp data sent using Beacon API");
                } catch (err) {
                    console.error("Beacon send failed:", err);
                }

                // Show browser confirmation dialog
                event.preventDefault();
                event.returnValue = ""; // Chrome requires this
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [shouldWarn, formData]);
}

export default useBeforeUnload;

"use client";

import { useEffect } from "react";

// Registers only the Material 3 web components used on the landing page.
// Loaded after hydration so Lit never runs on the server and the LCP is not blocked.
export default function MaterialRegistry() {
    useEffect(() => {
        void Promise.all([
            import("@material/web/button/filled-button.js"),
            import("@material/web/button/filled-tonal-button.js"),
            import("@material/web/button/outlined-button.js"),
            import("@material/web/button/text-button.js"),
            import("@material/web/textfield/outlined-text-field.js"),
            import("@material/web/select/outlined-select.js"),
            import("@material/web/select/select-option.js"),
            import("@material/web/chips/chip-set.js"),
            import("@material/web/chips/filter-chip.js"),
            import("@material/web/chips/assist-chip.js"),
            import("@material/web/checkbox/checkbox.js"),
            import("@material/web/icon/icon.js"),
            import("@material/web/divider/divider.js"),
            import("@material/web/elevation/elevation.js"),
        ]);
    }, []);

    return null;
}

"use client";

import { useEffect } from "react";

// Registers only the Material 3 web components used on the landing page.
// Loaded after hydration so Lit never runs on the server and the LCP is not blocked.
export default function MaterialRegistry() {
    useEffect(() => {
        // md-select-option must be defined before md-outlined-select: the select reads its
        // options (and the pre-selected one) when it upgrades. Parallel imports raced and
        // sometimes left the calculator selects empty.
        const loadSelect = async () => {
            await import("@material/web/select/select-option.js");
            await import("@material/web/select/outlined-select.js");
        };

        void Promise.all([
            loadSelect(),
            import("@material/web/button/filled-button.js"),
            import("@material/web/button/filled-tonal-button.js"),
            import("@material/web/button/outlined-button.js"),
            import("@material/web/button/text-button.js"),
            import("@material/web/textfield/outlined-text-field.js"),
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

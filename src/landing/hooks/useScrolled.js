/**
 * useScrolled.js
 *
 * Isolated behaviour: detects whether the page has scrolled past a threshold.
 * Used by Navbar to switch from transparent to frosted-glass style.
 *
 * Keeping this in its own hook means the Navbar is not responsible for
 * scroll logic — it only consumes the boolean result.
 */

"use client";

import { useState, useEffect } from "react";

/**
 * @param {number} threshold - Scroll Y position (px) that triggers the state change.
 * @returns {boolean} true when window.scrollY > threshold
 */
export function useScrolled(threshold = 12) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        function handleScroll() {
            setScrolled(window.scrollY > threshold);
        }

        // Set initial value on mount
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    return scrolled;
}

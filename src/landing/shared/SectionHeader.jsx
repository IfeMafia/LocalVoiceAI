/**
 * SectionHeader.jsx
 *
 * Shared primitive used by every landing page section.
 * Enforces consistent visual hierarchy: eyebrow → headline → body.
 *
 * This component exists to prevent each section from independently
 * inventing its own h2 size or spacing — keeping the page coherent.
 */

import React from "react";

/**
 * @param {string} eyebrow  - Small all-caps label above the headline (e.g. "THE PROBLEM")
 * @param {string} headline - Section h2 headline
 * @param {string} [body]   - Optional supporting paragraph
 * @param {"left"|"center"} [align="center"] - Text alignment
 */
export default function SectionHeader({ eyebrow, headline, body, align = "center" }) {
  const alignClass = align === "left" ? "text-left items-start" : "text-center items-center";

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      {eyebrow && (
        <span className="eyebrow">{eyebrow}</span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl text-voxy-text leading-tight">
        {headline}
      </h2>
      {body && (
        <p className="text-voxy-muted text-base sm:text-lg leading-relaxed max-w-2xl">
          {body}
        </p>
      )}
    </div>
  );
}

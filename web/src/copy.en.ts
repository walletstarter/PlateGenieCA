export const SEO = {
  title: "CA Plate Helper — Generate Vanity Plate Ideas & Check Availability (California)",
  description:
    "Generate short, catchy California vanity plate ideas with AI and check availability fast. Filter by length, allow numbers, save favorites, and jump straight to the DMV order page.",
  ogTitle: "CA Plate Helper — Find a plate you’ll actually get",
  ogDescription:
    "Type a seed, get tight 2–7 character ideas, check California availability, and save favorites."
};

export const HERO = {
  headline: "Find a plate you’ll actually get.",
  subhead:
    "Type a seed word. We’ll generate tight, 2–7 character plates and check California availability in seconds.",
  ctaPrimary: "Generate ideas",
  ctaSecondary: "See how it works"
};

export const INPUT = {
  placeholder: "Seed a theme or name (e.g., FAST, AI, SURF, GROW)",
  minLabel: "Min length",
  maxLabel: "Max length",
  allowNumbers: "Allow numbers",
  generate: "Generate",
  generating: "Generating…"
};

export const STATUS = {
  unchecked: "unchecked",
  available: "available",
  taken: "taken",
  invalid: "not allowed",
  unknown: "unknown"
};

export const ACTIONS = {
  check: "Check",
  save: "☆ Save",
  saved: "★ Saved",
  order: "Order ▸"
};

export const HOW_IT_WORKS = {
  title: "How it works",
  steps: [
    "Seed — Enter a word or two.",
    "Generate — AI + rules propose 2–7 character plates.",
    "Filter — Adjust min/max and numbers.",
    "Check — Verify California availability.",
    "Save — Star your favorites.",
    "Order — Jump to the DMV flow."
  ]
};

export const TIPS = {
  title: "Quick tips",
  bullets: [
    "Short wins: 4–6 characters read best.",
    "Drop vowels (GRWTH). Use numerals sparingly (E→3, O→0).",
    "Avoid ambiguous 1/I and 0/O unless intentional.",
    "“Not allowed” usually means a blocked or disguised offending pattern."
  ]
};

export const RULES = {
  title: "California basics",
  bullets: [
    "Length: 2–7 characters (A–Z, 0–9).",
    "No spaces or punctuation.",
    "Some words/substitutions are restricted.",
    "Availability can change; order quickly if you love it."
  ]
};

export const EMPTY = {
  suggestions: "Start with a seed word to generate plate ideas.",
  favorites: "Tap ☆ on any plate to save it here."
};

export const ERRORS = {
  invalidInput: "Use A–Z and 0–9 only, 2–7 characters.",
  rateLimited: "Too many requests. Try again in a minute.",
  dmvUnknown: "The DMV didn’t return a clear result. Try again or pick another idea.",
  scrapeOff: "Live checks are off. Using mock availability."
};

export const HINTS = {
  keyboard: "Shortcuts: Enter (generate), C (check), S (save)"
};

export const FAQ = {
  title: "FAQ",
  items: [
    {
      q: "How accurate is the availability?",
      a: "We simulate the DMV’s check and classify the response. Results are near-real-time but not official until you complete the DMV order."
    },
    {
      q: "Do you place the order for me?",
      a: "No. We send you to the DMV ordering page to complete purchase."
    },
    {
      q: "Why is a plate “not allowed”?",
      a: "California blocks offensive or confusing patterns. We pre-filter with a conservative list and fuzzy matching."
    },
    {
      q: "Will you support other states?",
      a: "Yes, the engine is adapter-based and more states are planned."
    },
    {
      q: "Do you store my plates?",
      a: "We cache recent checks (≈15 minutes) for speed. Favorites are stored locally in your browser."
    }
  ]
};

export const FOOTER = {
  line1: "Not affiliated with the California DMV. Availability can change at any time.",
  line2: "Order on the DMV site to finalize your plate.",
  copyright: `“CA Plate Helper” © ${new Date().getFullYear()}. All rights reserved.`
};

export const TOOLTIPS = {
  seed: "A short word or theme to inspire ideas (e.g., RUN, AI, SURF).",
  min: "Minimum characters for suggestions (2–7).",
  max: "Maximum characters for suggestions (2–7).",
  allowNumbers: "Toggle numeric substitutions and digits in results.",
  check: "Query the DMV and classify availability.",
  save: "Pin this plate to your favorites.",
  order: "Open the DMV ordering page in a new tab."
};

export const LINKS = {
  dmvOrder:
    "https://www.google.com/search?q=California+DMV+Personalized+Plates+Order"
};


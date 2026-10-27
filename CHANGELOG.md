# Changelog

## 4.0.0

- Fixed entry-point wrapping so loader evaluators that prepend `return` receive the plugin object rather than `undefined` because of automatic semicolon insertion.
- Added lookup for the Revenge API injected by the runtime, while retaining Bunny/Vendetta compatibility fallbacks.
- Exported both classic (`onLoad`, `onUnload`, `settings`) and newer (`start`, `stop`, `SettingsComponent`) lifecycle aliases.
- Added three matching modes, case sensitivity, bold, italic, letter spacing, custom two-color cycling, additional color palettes, reverse cycling, and reduce-motion settings.
- Improved saved-settings seeding/merging and reduced long settings lists with compact/expanded pickers.
- Added a GitHub Pages landing page with the site-root URL and a copy button.

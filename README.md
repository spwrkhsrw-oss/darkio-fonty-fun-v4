# Darkio Fonty Fun V4 — 4.0.0

A local-only display text styling plugin for the classic Revenge/Bunny/Vendetta-compatible loader. The root now includes a GitHub Pages landing page and keeps the plugin manifest and JavaScript bundle in stable relative paths.

## What's new in V4

- Runtime lookup checks the injected `revenge` API argument as well as Bunny/Vendetta globals.
- Exposes classic lifecycle names (`onLoad`, `onUnload`, `settings`) and newer aliases (`start`, `stop`, `SettingsComponent`) from one self-contained bundle.
- More settings: exact/contains/starts-with matching, case sensitivity, bold/italic, letter spacing, a custom two-color cycle, reverse/ping-pong animation, and reduce-motion mode.
- Extra palettes: Fire, Ice, Rose, Mint, Cosmic, and custom-cycle, plus Rainbow, Ocean, Sunset, Aurora, Neon Pulse, and Gummy.
- Four animation speeds, compact/expanded font and color pickers, and a simpler live preview.
- Storage defaults are merged with existing settings rather than replacing a saved setting with a default.
- `index.html` provides a mobile-friendly GitHub Pages front page that displays and copies the current site base URL.

## GitHub Pages hosting

GitHub Pages is static hosting. It serves the same files from an `https://OWNER.github.io/REPOSITORY/` URL rather than `raw.githubusercontent.com`; it does not independently repair a plugin runtime mismatch. The host page is included to make installation simpler.

1. Upload the **contents** of this folder to the repository root. The root should contain `index.html`, `manifest.json`, `repo.json`, `builds/`, and `source/` directly.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**, branch **main**, folder **/(root)**, and save.
4. Open the resulting Pages URL. The front page displays the correct base URL and has a copy button.
5. In Revenge Classic, use that copied base URL in the plugin repository/import flow that accepts a plugin base URL. If your client asks specifically for a manifest, use the site's `manifest.json` URL instead. Client versions differ; avoid appending `repo.json` unless the screen specifically asks for a repository index.

If your actual GitHub repository name or account differs from the repository currently linked in the footer, update that footer URL. The Pages base URL displayed on the page is derived automatically from the address that successfully loads it.

## Plugin settings and usage

Open the plugin's own settings (wrench/options) and enter the display name exactly as it appears in the client. Enable local styling, then choose a font and optional color effect. Exact match is the default and least broad option. `Contains` can affect matching text inside longer strings, while `Starts with` only affects a matching prefix.

## Structure

```text
index.html
.nojekyll
manifest.json
repo.json
README.md
source/
  README.md
  font-data.js
builds/dev.darkio.fonty-fun/
  manifest.json
  index.js
```

## Validation and limitations

The bundle is intended for a Vendetta-compatible Classic runtime. It was syntax-checked, its JSON manifests are validated, and a mock loader test checks that it returns the plugin object and provides a settings component when the supplied API exposes React/Forms. It has **not** been live-tested on your exact Revenge Classic installation, so the wrench UI and text patch targets still need device testing.

Unicode characters are approximations, vary by installed fonts, and do not unlock Nitro or modify your actual public Discord profile. With `contains` and `starts-with`, only matching name characters receive the Unicode transformation. Color, bold, and italic are text-element styles, so if the matching text is embedded in a longer single text element, those styles can affect that whole element. Exact mode is selected by default. The plugin code does not make network requests or read authentication tokens.

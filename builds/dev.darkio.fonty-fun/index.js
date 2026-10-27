(/* Darkio Fonty Fun V4 — classic/Vendetta-compatible plugin with Revenge API support.
 * Local-only display styling. No token access, network calls, or profile edits.
 */
globalThis.plugin = (() => {
  "use strict";
  // Revenge Classic/Bunny/Vendetta expose slightly different global API surfaces.
  // Prefer the legacy-compatible UI when running from the classic manifest, while
  // keeping each lookup independent so a partial shim cannot mask a working API.
  const safeRead = getter => { try { return getter(); } catch (_) { return undefined; } };
  // Revenge's evaluator injects its API as the `revenge` argument. Older builds
  // only checked globals, which can be absent when the loader injects the API.
  const injectedRevenge = safeRead(() => (typeof revenge !== 'undefined' ? revenge : undefined));
  const injectedBunny = safeRead(() => (typeof bunny !== 'undefined' ? bunny : undefined));
  const injectedVendetta = safeRead(() => (typeof vendetta !== 'undefined' ? vendetta : undefined));
  const revengeApi = injectedRevenge || safeRead(() => globalThis.revenge) || injectedBunny || safeRead(() => globalThis.bunny);
  const legacy = injectedVendetta || safeRead(() => globalThis.vendetta);
  const runtime = revengeApi || legacy || injectedBunny || injectedVendetta;

  // Resolve each capability independently. A partial compatibility shim should
  // not mask a complete API supplied through the loader.
  const React = safeRead(() => revengeApi?.metro?.common?.React)
    || safeRead(() => legacy?.metro?.common?.React)
    || safeRead(() => injectedBunny?.metro?.common?.React)
    || safeRead(() => runtime?.metro?.common?.React)
    || safeRead(() => revengeApi?.metro?.findByProps?.('createElement', 'useState'))
    || safeRead(() => legacy?.metro?.findByProps?.('createElement', 'useState'))
    || safeRead(() => globalThis.React);
  const RN = safeRead(() => revengeApi?.metro?.common?.ReactNative)
    || safeRead(() => legacy?.metro?.common?.ReactNative)
    || safeRead(() => injectedBunny?.metro?.common?.ReactNative)
    || safeRead(() => runtime?.metro?.common?.ReactNative)
    || safeRead(() => revengeApi?.metro?.findByProps?.('View', 'Text', 'ScrollView'))
    || safeRead(() => legacy?.metro?.findByProps?.('View', 'Text', 'ScrollView'))
    || safeRead(() => globalThis.ReactNative);
  const Forms = safeRead(() => revengeApi?.ui?.components?.Forms)
    || safeRead(() => legacy?.ui?.components?.Forms)
    || safeRead(() => injectedBunny?.ui?.components?.Forms)
    || safeRead(() => runtime?.ui?.components?.Forms)
    || safeRead(() => revengeApi?.ui?.components)
    || safeRead(() => legacy?.ui?.components);
  const logger = safeRead(() => revengeApi?.plugin?.logger)
    || safeRead(() => legacy?.logger)
    || safeRead(() => runtime?.logger)
    || safeRead(() => runtime?.plugin?.logger);
  const patcher = safeRead(() => revengeApi?.api?.patcher)
    || safeRead(() => revengeApi?.patcher)
    || safeRead(() => legacy?.patcher)
    || safeRead(() => injectedBunny?.patcher);
  const findByProps = safeRead(() => revengeApi?.metro?.findByPropsLazy)
    || safeRead(() => revengeApi?.metro?.findByProps)
    || safeRead(() => legacy?.metro?.findByPropsLazy)
    || safeRead(() => legacy?.metro?.findByProps)
    || safeRead(() => injectedBunny?.metro?.findByProps);
const h = React?.createElement?.bind(React);
const Animated = RN?.Animated;
const Text = RN?.Text;
const View = RN?.View;
const ScrollView = RN?.ScrollView;
const TextInput = RN?.TextInput;
const Switch = RN?.Switch;
const Pressable = RN?.Pressable || RN?.TouchableOpacity || RN?.Button;

const DEFAULT_SETTINGS = {
  enabled: false,
  targetName: '',
  fontStyle: 'medieval',
  colorEnabled: true,
  color: '#B69CFF',
  colorMode: 'solid',
  animationSpeed: 'normal',
  targetMatchMode: 'exact',
  caseSensitive: true,
  bold: false,
  italic: false,
  letterSpacing: 'normal',
  secondaryColor: '#55D6BE',
  reduceMotion: false,
  reverseAnimation: false,
};

const COLOR_MODE_OPTIONS = [
  { id: 'solid', label: 'Solid', sample: '●' },
  { id: 'rainbow', label: 'Prism / Rainbow', sample: '🌈' },
  { id: 'ocean', label: 'Ocean', sample: '🌊' },
  { id: 'sunset', label: 'Sunset', sample: '🌅' },
  { id: 'aurora', label: 'Aurora', sample: '✨' },
  { id: 'neon-pulse', label: 'Neon Pulse', sample: '💜' },
  { id: 'gummy', label: 'Gummy', sample: '🍬' },
  { id: 'fire', label: 'Fire', sample: '🔥' },
  { id: 'ice', label: 'Ice', sample: '🧊' },
  { id: 'rose', label: 'Rose', sample: '🌹' },
  { id: 'mint', label: 'Mint', sample: '🌿' },
  { id: 'cosmic', label: 'Cosmic', sample: '🌌' },
  { id: 'custom-cycle', label: 'Custom cycle', sample: '🎨' },
];
const SPEED_OPTIONS = [
  { id: 'very-slow', label: 'Very slow' },
  { id: 'slow', label: 'Slow' },
  { id: 'normal', label: 'Normal' },
  { id: 'fast', label: 'Fast' },
];
const MATCH_MODE_OPTIONS = [
  { id: 'exact', label: 'Exact match', note: 'Safest: only the whole text must match.' },
  { id: 'contains', label: 'Contains', note: 'Styles only the matching name inside longer text.' },
  { id: 'starts-with', label: 'Starts with', note: 'Styles the starting part that matches your name.' },
];
const SPACING_OPTIONS = [
  { id: 'normal', label: 'Normal' },
  { id: 'loose', label: 'Loose' },
  { id: 'wide', label: 'Wide' },
];
const ANIMATION_DURATIONS = { 'very-slow': 16000, slow: 10000, normal: 6200, fast: 3400 };
const COLOR_PALETTES = {
  rainbow: { inputRange: [0,1,2,3,4,5,6], outputRange: ['#FF4D6D','#FFB84D','#F9F871','#55E6A5','#49C6FF','#A78BFA','#FF4D6D'] },
  ocean: { inputRange: [0,2,4,6], outputRange: ['#22D3EE','#38BDF8','#6366F1','#22D3EE'] },
  sunset: { inputRange: [0,2,4,6], outputRange: ['#FB7185','#F97316','#FACC15','#FB7185'] },
  aurora: { inputRange: [0,2,4,6], outputRange: ['#5EEAD4','#60A5FA','#C084FC','#5EEAD4'] },
  gummy: { inputRange: [0,1.5,3,4.5,6], outputRange: ['#FF8FAB','#F9A8D4','#C4B5FD','#93C5FD','#FF8FAB'] },
  fire: { inputRange: [0,2,4,6], outputRange: ['#FFD166','#FF7B00','#EF233C','#FFD166'] },
  ice: { inputRange: [0,2,4,6], outputRange: ['#D9F7FF','#67E8F9','#3B82F6','#D9F7FF'] },
  rose: { inputRange: [0,2,4,6], outputRange: ['#FDA4AF','#F472B6','#C084FC','#FDA4AF'] },
  mint: { inputRange: [0,2,4,6], outputRange: ['#BBF7D0','#34D399','#2DD4BF','#BBF7D0'] },
  cosmic: { inputRange: [0,2,4,6], outputRange: ['#7C3AED','#EC4899','#38BDF8','#7C3AED'] },
};

const FONT_OPTIONS = [
  {
    "id": "gg-sans",
    "label": "gg sans",
    "sample": "Darkio",
    "note": "Classic / unchanged text"
  },
  {
    "id": "tempo",
    "label": "Tempo",
    "sample": "𝗗𝗮𝗿𝗸𝗶𝗼",
    "note": "Bold sans approximation"
  },
  {
    "id": "sakura",
    "label": "Sakura",
    "sample": "𝒟𝒶𝓇𝓀𝒾𝑜",
    "note": "Script approximation"
  },
  {
    "id": "jellybean",
    "label": "Jellybean",
    "sample": "𝔻𝕒𝕣𝕜𝕚𝕠",
    "note": "Double-struck approximation"
  },
  {
    "id": "modern",
    "label": "Modern",
    "sample": "𝘋𝘢𝘳𝘬𝘪𝘰",
    "note": "Sans italic approximation"
  },
  {
    "id": "medieval",
    "label": "Medieval",
    "sample": "𝔇𝔞𝔯𝔨𝔦𝔬",
    "note": "Fraktur / blackletter"
  },
  {
    "id": "8bit",
    "label": "8Bit",
    "sample": "🄳🄰🅁🄺🄸🄾",
    "note": "Squared characters"
  },
  {
    "id": "vampyre",
    "label": "Vampyre",
    "sample": "𝕯𝖆𝖗𝖐𝖎𝖔",
    "note": "Bold blackletter approximation"
  },
  {
    "id": "monkey-bars",
    "label": "Monkey Bars",
    "sample": "ⓓⓐⓡⓚⓘⓞ",
    "note": "Circled / bubble approximation"
  },
  {
    "id": "mainframe",
    "label": "Mainframe",
    "sample": "𝙳𝚊𝚛𝚔𝚒𝚘",
    "note": "Monospace characters"
  },
  {
    "id": "headbang",
    "label": "Headbang",
    "sample": "𝑫𝒂𝒓𝒌𝒊𝒐",
    "note": "Bold italic approximation"
  },
  {
    "id": "journal",
    "label": "Journal",
    "sample": "𝐷𝑎𝑟𝑘𝑖𝑜",
    "note": "Italic serif approximation"
  },
  {
    "id": "bold-serif",
    "label": "Bold Serif",
    "sample": "𝐃𝐚𝐫𝐤𝐢𝐨",
    "note": "Extra style"
  },
  {
    "id": "italic-serif",
    "label": "Italic Serif",
    "sample": "𝐷𝑎𝑟𝑘𝑖𝑜",
    "note": "Extra style"
  },
  {
    "id": "bold-italic",
    "label": "Bold Italic",
    "sample": "𝑫𝒂𝒓𝒌𝒊𝒐",
    "note": "Extra style"
  },
  {
    "id": "bold-fraktur",
    "label": "Bold Fraktur",
    "sample": "𝕯𝖆𝖗𝖐𝖎𝖔",
    "note": "Extra style"
  },
  {
    "id": "double-struck",
    "label": "Double-Struck",
    "sample": "𝔻𝕒𝕣𝕜𝕚𝕠",
    "note": "Extra style"
  },
  {
    "id": "small-caps",
    "label": "Small Caps",
    "sample": "ᴅᴀʀᴋɪᴏ",
    "note": "Extra style"
  },
  {
    "id": "fullwidth",
    "label": "Fullwidth",
    "sample": "Ｄａｒｋｉｏ",
    "note": "Extra style"
  },
  {
    "id": "sans-italic",
    "label": "Sans Italic",
    "sample": "𝘋𝘢𝘳𝘬𝘪𝘰",
    "note": "Extra style"
  },
  {
    "id": "bubble",
    "label": "Bubble Letters",
    "sample": "ⓓⓐⓡⓚⓘⓞ",
    "note": "Extra style"
  }
];
const FONT_ALPHABET = {
  "gg-sans": "plain",
  "tempo": "bold-sans",
  "sakura": "script",
  "jellybean": "double-struck",
  "modern": "sans-italic",
  "medieval": "fraktur",
  "8bit": "squared",
  "vampyre": "bold-fraktur",
  "monkey-bars": "circled",
  "mainframe": "monospace",
  "headbang": "bold-italic",
  "journal": "italic-serif",
  "double-struck": "double-struck",
  "small-caps": "small-caps",
  "fullwidth": "fullwidth",
  "bold-serif": "bold-serif",
  "italic-serif": "italic-serif",
  "bold-italic": "bold-italic",
  "bold-fraktur": "bold-fraktur",
  "sans-italic": "sans-italic",
  "bubble": "bubble"
};
const ALPHABETS = {
  "plain": {
    "upper": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ],
    "lower": [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z"
    ],
    "digits": [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9"
    ]
  },
  "fraktur": {
    "upper": [
      "𝔄",
      "𝔅",
      "ℭ",
      "𝔇",
      "𝔈",
      "𝔉",
      "𝔊",
      "ℌ",
      "ℑ",
      "𝔍",
      "𝔎",
      "𝔏",
      "𝔐",
      "𝔑",
      "𝔒",
      "𝔓",
      "𝔔",
      "ℜ",
      "𝔖",
      "𝔗",
      "𝔘",
      "𝔙",
      "𝔚",
      "𝔛",
      "𝔜",
      "ℨ"
    ],
    "lower": [
      "𝔞",
      "𝔟",
      "𝔠",
      "𝔡",
      "ℯ",
      "𝔣",
      "ℊ",
      "𝔥",
      "𝔦",
      "𝔧",
      "𝔨",
      "𝔩",
      "𝔪",
      "𝔫",
      "ℴ",
      "𝔭",
      "𝔮",
      "𝔯",
      "𝔰",
      "𝔱",
      "𝔲",
      "𝔳",
      "𝔴",
      "𝔵",
      "𝔶",
      "𝔷"
    ]
  },
  "script": {
    "upper": [
      "𝒜",
      "ℬ",
      "𝒞",
      "𝒟",
      "ℰ",
      "ℱ",
      "𝒢",
      "ℋ",
      "ℐ",
      "𝒥",
      "𝒦",
      "ℒ",
      "ℳ",
      "𝒩",
      "𝒪",
      "𝒫",
      "𝒬",
      "ℛ",
      "𝒮",
      "𝒯",
      "𝒰",
      "𝒱",
      "𝒲",
      "𝒳",
      "𝒴",
      "𝒵"
    ],
    "lower": [
      "𝒶",
      "𝒷",
      "𝒸",
      "𝒹",
      "ℯ",
      "𝒻",
      "ℊ",
      "𝒽",
      "𝒾",
      "𝒿",
      "𝓀",
      "𝓁",
      "𝓂",
      "𝓃",
      "ℴ",
      "𝓅",
      "𝓆",
      "𝓇",
      "𝓈",
      "𝓉",
      "𝓊",
      "𝓋",
      "𝓌",
      "𝓍",
      "𝓎",
      "𝓏"
    ]
  },
  "double-struck": {
    "upper": [
      "𝔸",
      "𝔹",
      "ℂ",
      "𝔻",
      "𝔼",
      "𝔽",
      "𝔾",
      "ℍ",
      "𝕀",
      "𝕁",
      "𝕂",
      "𝕃",
      "𝕄",
      "ℕ",
      "𝕆",
      "ℙ",
      "ℚ",
      "ℝ",
      "𝕊",
      "𝕋",
      "𝕌",
      "𝕍",
      "𝕎",
      "𝕏",
      "𝕐",
      "ℤ"
    ],
    "lower": [
      "𝕒",
      "𝕓",
      "𝕔",
      "𝕕",
      "𝕖",
      "𝕗",
      "𝕘",
      "𝕙",
      "𝕚",
      "𝕛",
      "𝕜",
      "𝕝",
      "𝕞",
      "𝕟",
      "𝕠",
      "𝕡",
      "𝕢",
      "𝕣",
      "𝕤",
      "𝕥",
      "𝕦",
      "𝕧",
      "𝕨",
      "𝕩",
      "𝕪",
      "𝕫"
    ],
    "digits": [
      "𝟘",
      "𝟙",
      "𝟚",
      "𝟛",
      "𝟜",
      "𝟝",
      "𝟞",
      "𝟟",
      "𝟠",
      "𝟡"
    ]
  },
  "monospace": {
    "upper": [
      "𝙰",
      "𝙱",
      "𝙲",
      "𝙳",
      "𝙴",
      "𝙵",
      "𝙶",
      "𝙷",
      "𝙸",
      "𝙹",
      "𝙺",
      "𝙻",
      "𝙼",
      "𝙽",
      "𝙾",
      "𝙿",
      "𝚀",
      "𝚁",
      "𝚂",
      "𝚃",
      "𝚄",
      "𝚅",
      "𝚆",
      "𝚇",
      "𝚈",
      "𝚉"
    ],
    "lower": [
      "𝚊",
      "𝚋",
      "𝚌",
      "𝚍",
      "𝚎",
      "𝚏",
      "𝚐",
      "𝚑",
      "𝚒",
      "𝚓",
      "𝚔",
      "𝚕",
      "𝚖",
      "𝚗",
      "𝚘",
      "𝚙",
      "𝚚",
      "𝚛",
      "𝚜",
      "𝚝",
      "𝚞",
      "𝚟",
      "𝚠",
      "𝚡",
      "𝚢",
      "𝚣"
    ],
    "digits": [
      "𝟶",
      "𝟷",
      "𝟸",
      "𝟹",
      "𝟺",
      "𝟻",
      "𝟼",
      "𝟽",
      "𝟾",
      "𝟿"
    ]
  },
  "small-caps": {
    "upper": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ],
    "lower": [
      "ᴀ",
      "ʙ",
      "ᴄ",
      "ᴅ",
      "ᴇ",
      "ꜰ",
      "ɢ",
      "ʜ",
      "ɪ",
      "ᴊ",
      "ᴋ",
      "ʟ",
      "ᴍ",
      "ɴ",
      "ᴏ",
      "ᴘ",
      "ǫ",
      "ʀ",
      "ꜱ",
      "ᴛ",
      "ᴜ",
      "ᴠ",
      "ᴡ",
      "x",
      "ʏ",
      "ᴢ"
    ]
  },
  "fullwidth": {
    "upper": [
      "Ａ",
      "Ｂ",
      "Ｃ",
      "Ｄ",
      "Ｅ",
      "Ｆ",
      "Ｇ",
      "Ｈ",
      "Ｉ",
      "Ｊ",
      "Ｋ",
      "Ｌ",
      "Ｍ",
      "Ｎ",
      "Ｏ",
      "Ｐ",
      "Ｑ",
      "Ｒ",
      "Ｓ",
      "Ｔ",
      "Ｕ",
      "Ｖ",
      "Ｗ",
      "Ｘ",
      "Ｙ",
      "Ｚ"
    ],
    "lower": [
      "ａ",
      "ｂ",
      "ｃ",
      "ｄ",
      "ｅ",
      "ｆ",
      "ｇ",
      "ｈ",
      "ｉ",
      "ｊ",
      "ｋ",
      "ｌ",
      "ｍ",
      "ｎ",
      "ｏ",
      "ｐ",
      "ｑ",
      "ｒ",
      "ｓ",
      "ｔ",
      "ｕ",
      "ｖ",
      "ｗ",
      "ｘ",
      "ｙ",
      "ｚ"
    ],
    "digits": [
      "０",
      "１",
      "２",
      "３",
      "４",
      "５",
      "６",
      "７",
      "８",
      "９"
    ]
  },
  "bold-serif": {
    "upper": [
      "𝐀",
      "𝐁",
      "𝐂",
      "𝐃",
      "𝐄",
      "𝐅",
      "𝐆",
      "𝐇",
      "𝐈",
      "𝐉",
      "𝐊",
      "𝐋",
      "𝐌",
      "𝐍",
      "𝐎",
      "𝐏",
      "𝐐",
      "𝐑",
      "𝐒",
      "𝐓",
      "𝐔",
      "𝐕",
      "𝐖",
      "𝐗",
      "𝐘",
      "𝐙"
    ],
    "lower": [
      "𝐚",
      "𝐛",
      "𝐜",
      "𝐝",
      "𝐞",
      "𝐟",
      "𝐠",
      "𝐡",
      "𝐢",
      "𝐣",
      "𝐤",
      "𝐥",
      "𝐦",
      "𝐧",
      "𝐨",
      "𝐩",
      "𝐪",
      "𝐫",
      "𝐬",
      "𝐭",
      "𝐮",
      "𝐯",
      "𝐰",
      "𝐱",
      "𝐲",
      "𝐳"
    ],
    "digits": [
      "𝟎",
      "𝟏",
      "𝟐",
      "𝟑",
      "𝟒",
      "𝟓",
      "𝟔",
      "𝟕",
      "𝟖",
      "𝟗"
    ]
  },
  "italic-serif": {
    "upper": [
      "𝐴",
      "𝐵",
      "𝐶",
      "𝐷",
      "𝐸",
      "𝐹",
      "𝐺",
      "𝐻",
      "𝐼",
      "𝐽",
      "𝐾",
      "𝐿",
      "𝑀",
      "𝑁",
      "𝑂",
      "𝑃",
      "𝑄",
      "𝑅",
      "𝑆",
      "𝑇",
      "𝑈",
      "𝑉",
      "𝑊",
      "𝑋",
      "𝑌",
      "𝑍"
    ],
    "lower": [
      "𝑎",
      "𝑏",
      "𝑐",
      "𝑑",
      "𝑒",
      "𝑓",
      "𝑔",
      "ℎ",
      "𝑖",
      "𝑗",
      "𝑘",
      "𝑙",
      "𝑚",
      "𝑛",
      "𝑜",
      "𝑝",
      "𝑞",
      "𝑟",
      "𝑠",
      "𝑡",
      "𝑢",
      "𝑣",
      "𝑤",
      "𝑥",
      "𝑦",
      "𝑧"
    ]
  },
  "bold-italic": {
    "upper": [
      "𝑨",
      "𝑩",
      "𝑪",
      "𝑫",
      "𝑬",
      "𝑭",
      "𝑮",
      "𝑯",
      "𝑰",
      "𝑱",
      "𝑲",
      "𝑳",
      "𝑴",
      "𝑵",
      "𝑶",
      "𝑷",
      "𝑸",
      "𝑹",
      "𝑺",
      "𝑻",
      "𝑼",
      "𝑽",
      "𝑾",
      "𝑿",
      "𝒀",
      "𝒁"
    ],
    "lower": [
      "𝒂",
      "𝒃",
      "𝒄",
      "𝒅",
      "𝒆",
      "𝒇",
      "𝒈",
      "𝒉",
      "𝒊",
      "𝒋",
      "𝒌",
      "𝒍",
      "𝒎",
      "𝒏",
      "𝒐",
      "𝒑",
      "𝒒",
      "𝒓",
      "𝒔",
      "𝒕",
      "𝒖",
      "𝒗",
      "𝒘",
      "𝒙",
      "𝒚",
      "𝒛"
    ]
  },
  "bold-sans": {
    "upper": [
      "𝗔",
      "𝗕",
      "𝗖",
      "𝗗",
      "𝗘",
      "𝗙",
      "𝗚",
      "𝗛",
      "𝗜",
      "𝗝",
      "𝗞",
      "𝗟",
      "𝗠",
      "𝗡",
      "𝗢",
      "𝗣",
      "𝗤",
      "𝗥",
      "𝗦",
      "𝗧",
      "𝗨",
      "𝗩",
      "𝗪",
      "𝗫",
      "𝗬",
      "𝗭"
    ],
    "lower": [
      "𝗮",
      "𝗯",
      "𝗰",
      "𝗱",
      "𝗲",
      "𝗳",
      "𝗴",
      "𝗵",
      "𝗶",
      "𝗷",
      "𝗸",
      "𝗹",
      "𝗺",
      "𝗻",
      "𝗼",
      "𝗽",
      "𝗾",
      "𝗿",
      "𝘀",
      "𝘁",
      "𝘂",
      "𝘃",
      "𝘄",
      "𝘅",
      "𝘆",
      "𝘇"
    ],
    "digits": [
      "𝟬",
      "𝟭",
      "𝟮",
      "𝟯",
      "𝟰",
      "𝟱",
      "𝟲",
      "𝟳",
      "𝟴",
      "𝟵"
    ]
  },
  "bold-fraktur": {
    "upper": [
      "𝕬",
      "𝕭",
      "𝕮",
      "𝕯",
      "𝕰",
      "𝕱",
      "𝕲",
      "𝕳",
      "𝕴",
      "𝕵",
      "𝕶",
      "𝕷",
      "𝕸",
      "𝕹",
      "𝕺",
      "𝕻",
      "𝕼",
      "𝕽",
      "𝕾",
      "𝕿",
      "𝖀",
      "𝖁",
      "𝖂",
      "𝖃",
      "𝖄",
      "𝖅"
    ],
    "lower": [
      "𝖆",
      "𝖇",
      "𝖈",
      "𝖉",
      "𝖊",
      "𝖋",
      "𝖌",
      "𝖍",
      "𝖎",
      "𝖏",
      "𝖐",
      "𝖑",
      "𝖒",
      "𝖓",
      "𝖔",
      "𝖕",
      "𝖖",
      "𝖗",
      "𝖘",
      "𝖙",
      "𝖚",
      "𝖛",
      "𝖜",
      "𝖝",
      "𝖞",
      "𝖟"
    ]
  },
  "sans-italic": {
    "upper": [
      "𝘈",
      "𝘉",
      "𝘊",
      "𝘋",
      "𝘌",
      "𝘍",
      "𝘎",
      "𝘏",
      "𝘐",
      "𝘑",
      "𝘒",
      "𝘓",
      "𝘔",
      "𝘕",
      "𝘖",
      "𝘗",
      "𝘘",
      "𝘙",
      "𝘚",
      "𝘛",
      "𝘜",
      "𝘝",
      "𝘞",
      "𝘟",
      "𝘠",
      "𝘡"
    ],
    "lower": [
      "𝘢",
      "𝘣",
      "𝘤",
      "𝘥",
      "𝘦",
      "𝘧",
      "𝘨",
      "𝘩",
      "𝘪",
      "𝘫",
      "𝘬",
      "𝘭",
      "𝘮",
      "𝘯",
      "𝘰",
      "𝘱",
      "𝘲",
      "𝘳",
      "𝘴",
      "𝘵",
      "𝘶",
      "𝘷",
      "𝘸",
      "𝘹",
      "𝘺",
      "𝘻"
    ]
  },
  "circled": {
    "upper": [
      "Ⓐ",
      "Ⓑ",
      "Ⓒ",
      "Ⓓ",
      "Ⓔ",
      "Ⓕ",
      "Ⓖ",
      "Ⓗ",
      "Ⓘ",
      "Ⓙ",
      "Ⓚ",
      "Ⓛ",
      "Ⓜ",
      "Ⓝ",
      "Ⓞ",
      "Ⓟ",
      "Ⓠ",
      "Ⓡ",
      "Ⓢ",
      "Ⓣ",
      "Ⓤ",
      "Ⓥ",
      "Ⓦ",
      "Ⓧ",
      "Ⓨ",
      "Ⓩ"
    ],
    "lower": [
      "ⓐ",
      "ⓑ",
      "ⓒ",
      "ⓓ",
      "ⓔ",
      "ⓕ",
      "ⓖ",
      "ⓗ",
      "ⓘ",
      "ⓙ",
      "ⓚ",
      "ⓛ",
      "ⓜ",
      "ⓝ",
      "ⓞ",
      "ⓟ",
      "ⓠ",
      "ⓡ",
      "ⓢ",
      "ⓣ",
      "ⓤ",
      "ⓥ",
      "ⓦ",
      "ⓧ",
      "ⓨ",
      "ⓩ"
    ],
    "digits": [
      "⓪",
      "①",
      "②",
      "③",
      "④",
      "⑤",
      "⑥",
      "⑦",
      "⑧",
      "⑨"
    ]
  },
  "squared": {
    "upper": [
      "🄰",
      "🄱",
      "🄲",
      "🄳",
      "🄴",
      "🄵",
      "🄶",
      "🄷",
      "🄸",
      "🄹",
      "🄺",
      "🄻",
      "🄼",
      "🄽",
      "🄾",
      "🄿",
      "🅀",
      "🅁",
      "🅂",
      "🅃",
      "🅄",
      "🅅",
      "🅆",
      "🅇",
      "🅈",
      "🅉"
    ],
    "lower": [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z"
    ],
    "digits": [
      "⓪",
      "①",
      "②",
      "③",
      "④",
      "⑤",
      "⑥",
      "⑦",
      "⑧",
      "⑨"
    ]
  },
  "bubble": {
    "upper": [
      "Ⓐ",
      "Ⓑ",
      "Ⓒ",
      "Ⓓ",
      "Ⓔ",
      "Ⓕ",
      "Ⓖ",
      "Ⓗ",
      "Ⓘ",
      "Ⓙ",
      "Ⓚ",
      "Ⓛ",
      "Ⓜ",
      "Ⓝ",
      "Ⓞ",
      "Ⓟ",
      "Ⓠ",
      "Ⓡ",
      "Ⓢ",
      "Ⓣ",
      "Ⓤ",
      "Ⓥ",
      "Ⓦ",
      "Ⓧ",
      "Ⓨ",
      "Ⓩ"
    ],
    "lower": [
      "ⓐ",
      "ⓑ",
      "ⓒ",
      "ⓓ",
      "ⓔ",
      "ⓕ",
      "ⓖ",
      "ⓗ",
      "ⓘ",
      "ⓙ",
      "ⓚ",
      "ⓛ",
      "ⓜ",
      "ⓝ",
      "ⓞ",
      "ⓟ",
      "ⓠ",
      "ⓡ",
      "ⓢ",
      "ⓣ",
      "ⓤ",
      "ⓥ",
      "ⓦ",
      "ⓧ",
      "ⓨ",
      "ⓩ"
    ],
    "digits": [
      "⓪",
      "①",
      "②",
      "③",
      "④",
      "⑤",
      "⑥",
      "⑦",
      "⑧",
      "⑨"
    ]
  }
};

let apiStorage = null;
function readSettings() {
  const out = { ...DEFAULT_SETTINGS };
  const apiCache = safeRead(() => apiStorage?.cache);
  const source = { ...(apiCache && typeof apiCache === 'object' ? apiCache : {}), ...(storage || {}) };
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    if (source[key] !== undefined && source[key] !== null) out[key] = source[key];
  }
  if (!FONT_ALPHABET[out.fontStyle]) out.fontStyle = DEFAULT_SETTINGS.fontStyle;
  if (!COLOR_MODE_OPTIONS.some(x => x.id === out.colorMode)) out.colorMode = DEFAULT_SETTINGS.colorMode;
  if (!SPEED_OPTIONS.some(x => x.id === out.animationSpeed)) out.animationSpeed = DEFAULT_SETTINGS.animationSpeed;
  if (!MATCH_MODE_OPTIONS.some(x => x.id === out.targetMatchMode)) out.targetMatchMode = DEFAULT_SETTINGS.targetMatchMode;
  if (!SPACING_OPTIONS.some(x => x.id === out.letterSpacing)) out.letterSpacing = DEFAULT_SETTINGS.letterSpacing;
  if (!validHexColor(out.color)) out.color = DEFAULT_SETTINGS.color;
  if (!validHexColor(out.secondaryColor)) out.secondaryColor = DEFAULT_SETTINGS.secondaryColor;
  out.enabled = !!out.enabled;
  out.caseSensitive = !!out.caseSensitive;
  out.colorEnabled = !!out.colorEnabled;
  out.bold = !!out.bold;
  out.italic = !!out.italic;
  out.reduceMotion = !!out.reduceMotion;
  out.reverseAnimation = !!out.reverseAnimation;
  out.targetName = typeof out.targetName === 'string' ? out.targetName : '';
  return out;
}
function writeSettings(partial) {
  if (storage) for (const [key, value] of Object.entries(partial)) storage[key] = value;
  const next = { ...readSettings(), ...partial };
  if (storage) for (const [key, value] of Object.entries(next)) storage[key] = value;
  // Spec-3 storage is supported when a host passes it through, but the primary
  // build deliberately exports the Classic/Vendetta plugin shape.
  try { const pending = apiStorage?.set?.(next); pending?.catch?.(() => {}); } catch (_) {}
  syncAnimation(next);
}
function validHexColor(value) { return /^#[0-9a-fA-F]{6}$/.test(value || ''); }
function lightenHex(hex, amount) {
  if (!validHexColor(hex)) hex = '#B69CFF';
  const values = [1,3,5].map(i => parseInt(hex.slice(i, i+2), 16));
  return '#' + values.map(v => Math.round(v + (255-v)*(amount ?? 0.42)).toString(16).padStart(2,'0')).join('');
}
function mapText(input, style) {
  const map = ALPHABETS[FONT_ALPHABET[style]] || ALPHABETS.fraktur;
  return Array.from(input, char => {
    const code = char.codePointAt(0);
    if (style === '8bit') {
      const up = char.toUpperCase().codePointAt(0);
      if (up >= 65 && up <= 90) return map.upper[up - 65] || char;
      return char;
    }
    if (code >= 65 && code <= 90) return map.upper[code - 65] || char;
    if (code >= 97 && code <= 122) return map.lower[code - 97] || char;
    if (code >= 48 && code <= 57 && map.digits) return map.digits[code - 48] || char;
    return char;
  }).join('');
}

let storage = Object.create(null);
let colorProgress;
let colorLoop;
let colorLoopKey = '';
const unpatches = [];
function getProgress() {
  if (!colorProgress && Animated?.Value) colorProgress = new Animated.Value(0);
  return colorProgress;
}
function stopAnimation() {
  try { colorLoop?.stop?.(); } catch (_) {}
  colorLoop = null;
  colorLoopKey = '';
  try { colorProgress?.setValue?.(0); } catch (_) {}
}
function syncAnimation(settings) {
  const shouldAnimate = !!Animated && settings.enabled && settings.colorEnabled && !settings.reduceMotion && settings.colorMode !== 'solid';
  if (!shouldAnimate) { if (colorLoop) stopAnimation(); return; }
  const key = settings.colorMode + ':' + settings.animationSpeed + ':' + !!settings.reverseAnimation + ':' + settings.color + ':' + settings.secondaryColor;
  if (colorLoop && colorLoopKey === key) return;
  try { colorLoop?.stop?.(); } catch (_) {}
  const progress = getProgress();
  if (!progress) return;
  progress.setValue(0);
  const duration = ANIMATION_DURATIONS[settings.animationSpeed] || ANIMATION_DURATIONS.normal;
  const forward = Animated.timing(progress, { toValue: 6, duration, useNativeDriver: false, isInteraction: false });
  const animation = settings.reverseAnimation && typeof Animated.sequence === 'function'
    ? Animated.sequence([forward, Animated.timing(progress, { toValue: 0, duration, useNativeDriver: false, isInteraction: false })])
    : forward;
  colorLoop = Animated.loop(animation);
  colorLoopKey = key;
  colorLoop.start();
}
function colorValue(settings) {
  if (!settings.colorEnabled) return undefined;
  const safeCustom = validHexColor(settings.color) ? settings.color : '#B69CFF';
  if (settings.colorMode === 'solid' || settings.reduceMotion) return safeCustom;
  const progress = getProgress();
  if (!progress) return safeCustom;
  if (settings.colorMode === 'neon-pulse') return progress.interpolate({
    inputRange: [0,3,6], outputRange: [lightenHex(safeCustom), safeCustom, lightenHex(safeCustom)], extrapolate: 'clamp'
  });
  if (settings.colorMode === 'custom-cycle') {
    const second = validHexColor(settings.secondaryColor) ? settings.secondaryColor : '#55D6BE';
    return progress.interpolate({ inputRange: [0,3,6], outputRange: [safeCustom, second, safeCustom], extrapolate: 'clamp' });
  }
  const palette = COLOR_PALETTES[settings.colorMode] || COLOR_PALETTES.rainbow;
  return progress.interpolate({ inputRange: palette.inputRange, outputRange: palette.outputRange, extrapolate: 'clamp' });
}
function transformTextForSettings(input, settings) {
  const target = (settings.targetName || '').trim();
  if (!target) return input;
  const normalize = value => settings.caseSensitive ? value : value.toLocaleLowerCase();
  const haystack = normalize(input);
  const needle = normalize(target);
  const mode = settings.targetMatchMode || 'exact';
  if (mode === 'exact') return haystack.trim() === needle ? mapText(input, settings.fontStyle) : input;
  if (mode === 'starts-with') {
    const leading = input.length - input.trimStart().length;
    const visible = input.slice(leading);
    if (!normalize(visible).startsWith(needle)) return input;
    return input.slice(0, leading) + mapText(visible.slice(0, target.length), settings.fontStyle) + visible.slice(target.length);
  }
  // Replace all exact occurrences while leaving adjacent text and punctuation alone.
  let result = '';
  let cursor = 0;
  let found = haystack.indexOf(needle, cursor);
  if (found < 0) return input;
  while (found >= 0) {
    result += input.slice(cursor, found) + mapText(input.slice(found, found + target.length), settings.fontStyle);
    cursor = found + target.length;
    found = haystack.indexOf(needle, cursor);
  }
  return result + input.slice(cursor);
}
function textMatchesSettings(input, settings) {
  const target = (settings.targetName || '').trim();
  if (!target || typeof input !== 'string') return false;
  const normalize = value => settings.caseSensitive ? value : value.toLocaleLowerCase();
  const source = normalize(input.trim());
  const needle = normalize(target);
  if (settings.targetMatchMode === 'contains') return source.includes(needle);
  if (settings.targetMatchMode === 'starts-with') return source.startsWith(needle);
  return source === needle;
}
function patchElementArgs(_thisObject, args) {
  // Bunny/Revenge Classic's before() callback receives (thisObject, args).
  // The argument array must be mutated; returning a replacement array is ignored.
  try {
    if (!Array.isArray(args) || args.length < 2) return;
    const settings = readSettings();
    const type = args[0];
    const props = args[1];
    if (!settings.enabled || !settings.targetName?.trim() || !props || typeof props !== 'object') return;
    const children = props.children;
    if (typeof children !== 'string' || !textMatchesSettings(children, settings)) return;

    const typeName = type?.displayName || type?.name || type?.render?.displayName || type?.render?.name || '';
    const isKnownText = type === Text || type === RN?.Text || type === Animated?.Text;
    const looksLikeText = typeof typeName === 'string' && /text/i.test(typeName);
    // Discord may render usernames through custom Text wrappers. Exact-string matching
    // plus a style prop lets these wrappers pass through while keeping other content alone.
    if (!isKnownText && !looksLikeText && props.style === undefined) return;

    const nextProps = { ...props, children: transformTextForSettings(children, settings) };
    const nextColor = colorValue(settings);
    const stylePatch = {};
    if (nextColor !== undefined) stylePatch.color = nextColor;
    if (settings.bold) stylePatch.fontWeight = '700';
    if (settings.italic) stylePatch.fontStyle = 'italic';
    if (settings.letterSpacing === 'loose') stylePatch.letterSpacing = 0.35;
    if (settings.letterSpacing === 'wide') stylePatch.letterSpacing = 0.8;
    if (Object.keys(stylePatch).length) nextProps.style = [props.style, stylePatch];

    // Animated.Text is only substituted for native Text; preserve custom Discord wrappers.
    const nativeText = type === Text || type === RN?.Text;
    const useAnimated = nativeText && settings.colorEnabled && !settings.reduceMotion && settings.colorMode !== 'solid' && !!Animated?.Text;
    args[0] = useAnimated ? Animated.Text : type;
    args[1] = nextProps;
  } catch (e) {
    logger?.warn?.('Could not transform a matching text element', e);
  }
}
function addPatcher(target, method) {
  if (!target || typeof target[method] !== 'function' || !patcher?.before) return;
  try {
    // Correct API order: before(targetObject, methodName, callback).
    const unpatch = patcher.before(target, method, patchElementArgs);
    if (typeof unpatch === 'function') unpatches.push(unpatch);
  } catch (e) { logger?.warn?.('Could not patch ' + method, e); }
}

function rowLabel(label, note) {
  return h(View, { style: { gap: 3, marginTop: 5 } },
    h(Text, { style: { color: '#F4F0FF', fontWeight: '700' } }, label),
    note ? h(Text, { style: { color: '#AAA7B5', fontSize: 12 } }, note) : null
  );
}
function choiceButton(label, active, onPress, sample) {
  return h(Pressable, {
    onPress,
    style: { borderWidth: 1, borderColor: active ? '#B69CFF' : '#4A4857', backgroundColor: active ? '#302744' : '#1C1B24', borderRadius: 10, padding: 11, marginBottom: 7, gap: 4 }
  },
    h(Text, { style: { color: '#F5F2FF', fontWeight: active ? '700' : '500' } }, label + (active ? '  ✓' : '')),
    sample ? h(Text, { style: { color: '#F5F2FF', fontSize: 18 } }, sample) : null
  );
}
function chip(label, active, onPress) {
  return h(Pressable, { onPress, style: { borderWidth: 1, borderColor: active ? '#B69CFF' : '#4A4857', backgroundColor: active ? '#302744' : '#1C1B24', borderRadius: 18, paddingVertical: 8, paddingHorizontal: 11, marginRight: 7, marginBottom: 7 } },
    h(Text, { style: { color: '#F5F2FF', fontWeight: active ? '700' : '400' } }, label + (active ? ' ✓' : ''))
  );
}
function toggleControl(value, onValueChange) {
  if (Switch) return h(Switch, { value: !!value, onValueChange });
  return h(Pressable, {
    onPress: () => onValueChange(!value),
    style: { borderWidth: 1, borderColor: value ? '#B69CFF' : '#4A4857', borderRadius: 18, paddingVertical: 8, paddingHorizontal: 12 }
  }, h(Text, { style: { color: '#F5F2FF', fontWeight: '700' } }, value ? 'ON' : 'OFF'));
}
function SettingsComponent(props = {}) {
  if (!React || !h || typeof React.useState !== 'function') {
    return h && Forms?.FormSection && Forms?.FormRow
      ? h(Forms.FormSection, { title: 'Darkio Fonty Fun' }, h(Forms.FormRow, { label: 'Settings could not start', subLabel: 'This client did not expose React hooks to the plugin settings page.' }))
      : null;
  }
  const [, setRevision] = React.useState(0);
  const [showAllFonts, setShowAllFonts] = React.useState(false);
  const [showAllColors, setShowAllColors] = React.useState(false);
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const suppliedStorage = safeRead(() => props?.api?.jsonStorage) || safeRead(() => props?.jsonStorage);
  if (suppliedStorage && typeof suppliedStorage === 'object') apiStorage = suppliedStorage;
  const liveSettings = safeRead(() => suppliedStorage?.use?.());
  // Seed a settings page opened before onLoad from persisted data, but do not
  // overlay a stale hook snapshot on the local value that the user just changed.
  if (liveSettings && typeof liveSettings === 'object') {
    for (const key of Object.keys(DEFAULT_SETTINGS)) {
      if (storage[key] === undefined && liveSettings[key] !== undefined) storage[key] = liveSettings[key];
    }
  }
  const settings = readSettings();
  const update = partial => {
    writeSettings(partial);
    setRevision(n => n + 1);
  };
  const target = settings.targetName || 'Darkio';
  const preview = mapText(target, settings.fontStyle);
  const previewColor = colorValue(settings) || '#FFFFFF';
  const inputStyle = { borderWidth: 1, borderColor: '#4A4857', borderRadius: 10, padding: 12, color: '#F5F2FF', backgroundColor: '#1C1B24', marginTop: 7 };
  const popularFontIds = new Set(['gg-sans', 'tempo', 'sakura', 'medieval', 'vampyre', 'mainframe', 'small-caps', 'fullwidth']);
  const fontOptions = showAllFonts ? FONT_OPTIONS : FONT_OPTIONS.filter(option => popularFontIds.has(option.id));
  const commonColorModes = new Set(['solid', 'rainbow', 'ocean', 'sunset', 'aurora', 'neon-pulse', 'custom-cycle']);
  const colorOptions = showAllColors ? COLOR_MODE_OPTIONS : COLOR_MODE_OPTIONS.filter(option => commonColorModes.has(option.id));

  // Classic Vendetta/Bunny clients supply their own settings components. Keep the
  // component requirements light: a missing switch/input must not suppress the page.
  const FormSection = Forms?.FormSection;
  const FormRow = Forms?.FormRow;
  const FormSwitchRow = Forms?.FormSwitchRow;
  const FormInput = Forms?.FormInput;
  const FormDivider = Forms?.FormDivider;
  if (FormSection && FormRow) {
    const row = (key, label, subLabel, onPress) => h(FormRow, { key, label, subLabel, onPress });
    const toggleRow = (key, label, subLabel, value, onValueChange) => FormSwitchRow
      ? h(FormSwitchRow, { key, label, subLabel, value: !!value, onValueChange })
      : row(key, label + (value ? ' · ON' : ' · OFF'), subLabel || 'Tap to change this option.', () => onValueChange(!value));
    const divider = key => FormDivider ? h(FormDivider, { key }) : null;
    const textInput = (key, title, value, placeholder, onChange, autoCapitalize = 'none') => {
      if (FormInput) return h(FormInput, { key, title, value, placeholder, onChange });
      if (TextInput) return h(TextInput, { key, value, onChangeText: onChange, placeholder, placeholderTextColor: '#8A8A95', autoCapitalize, style: inputStyle });
      return row(key + '-missing', title, 'Text input is not exposed by this client.');
    };
    const items = [];
    items.push(row('hero', 'DARKIO FONTY FUN · V4', 'Local display styling, live preview, 21 font presets and more color effects.'));
    items.push(toggleRow('enabled', 'Enable local styling', 'Only matching text is changed on this device.', settings.enabled, enabled => update({ enabled })));
    items.push(divider('div-target'));
    items.push(textInput('target', 'Display name', settings.targetName, 'Type your exact display name', targetName => update({ targetName })));
    items.push(row('match-mode-title', 'Name matching', 'Current: ' + (MATCH_MODE_OPTIONS.find(x => x.id === settings.targetMatchMode)?.label || 'Exact match')));
    for (const option of MATCH_MODE_OPTIONS) {
      items.push(row('match-' + option.id, (settings.targetMatchMode === option.id ? '✓ ' : '') + option.label, option.note, () => update({ targetMatchMode: option.id })));
    }
    items.push(toggleRow('case-sensitive', 'Case sensitive', 'When off, upper/lowercase differences are ignored.', settings.caseSensitive, caseSensitive => update({ caseSensitive })));
    items.push(divider('div-font'));
    items.push(row('fonts-title', 'FONT LAB', 'Choose a Unicode look-alike. Some glyphs vary by device.'));
    for (const option of fontOptions) {
      items.push(row('font-' + option.id, (settings.fontStyle === option.id ? '✓ ' : '') + option.label, option.sample + ' · ' + option.note, () => update({ fontStyle: option.id })));
    }
    items.push(row('show-fonts', showAllFonts ? 'Show fewer fonts' : 'Show all 21 fonts', showAllFonts ? 'Return to the compact font list.' : 'Reveal every available font style.', () => setShowAllFonts(v => !v)));
    items.push(divider('div-effects'));
    items.push(toggleRow('color-enabled', 'Color FX', 'Enable solid color or animated palettes.', settings.colorEnabled, colorEnabled => update({ colorEnabled })));
    items.push(textInput('custom-color', 'Primary color', settings.color, '#B69CFF', color => update({ color }), 'characters'));
    items.push(row('colors-title', 'COLOR EFFECT', 'Current: ' + (COLOR_MODE_OPTIONS.find(x => x.id === settings.colorMode)?.label || 'Solid')));
    for (const option of colorOptions) {
      items.push(row('color-' + option.id, (settings.colorMode === option.id ? '✓ ' : '') + option.sample + ' ' + option.label, option.id === 'custom-cycle' ? 'Uses your primary and secondary colors.' : undefined, () => update({ colorMode: option.id })));
    }
    items.push(row('show-colors', showAllColors ? 'Show fewer effects' : 'Show all color effects', showAllColors ? 'Hide extra color presets.' : 'Reveal Fire, Ice, Rose, Mint and Cosmic.', () => setShowAllColors(v => !v)));
    if (settings.colorMode === 'custom-cycle') {
      items.push(textInput('secondary-color', 'Secondary color', settings.secondaryColor, '#55D6BE', secondaryColor => update({ secondaryColor }), 'characters'));
    }
    if (settings.colorMode !== 'solid') {
      items.push(row('speed-title', 'Animation speed', 'Current: ' + settings.animationSpeed));
      for (const option of SPEED_OPTIONS) items.push(row('speed-' + option.id, (settings.animationSpeed === option.id ? '✓ ' : '') + option.label, undefined, () => update({ animationSpeed: option.id })));
      items.push(toggleRow('reverse-animation', 'Ping-pong animation', 'Reverses direction smoothly at the end of each cycle.', settings.reverseAnimation, reverseAnimation => update({ reverseAnimation })));
      items.push(toggleRow('reduce-motion', 'Reduce motion', 'Stops animated color changes and uses the primary color.', settings.reduceMotion, reduceMotion => update({ reduceMotion })));
    }
    items.push(divider('div-advanced'));
    items.push(row('advanced-toggle', advancedOpen ? 'Hide text details' : 'More customization', 'Bold, italic and character spacing.', () => setAdvancedOpen(v => !v)));
    if (advancedOpen) {
      items.push(toggleRow('bold', 'Bold weight', 'Adds a bold style where the client supports it.', settings.bold, bold => update({ bold })));
      items.push(toggleRow('italic', 'Italic style', 'Adds an italic style where the client supports it.', settings.italic, italic => update({ italic })));
      items.push(row('spacing-title', 'Character spacing', 'Current: ' + settings.letterSpacing));
      for (const option of SPACING_OPTIONS) items.push(row('spacing-' + option.id, (settings.letterSpacing === option.id ? '✓ ' : '') + option.label, undefined, () => update({ letterSpacing: option.id })));
    }
    items.push(divider('div-preview'));
    items.push(row('preview', 'LIVE PREVIEW · ' + preview, validHexColor(settings.color) ? 'Color: ' + settings.color : 'Enter a six-digit hex color.'));
    items.push(row('reset', 'Reset all settings', 'Return every option to its default value.', () => update({ ...DEFAULT_SETTINGS })));
    items.push(row('note', 'Privacy & compatibility', 'Local rendering only. This does not change your public Discord profile, unlock Nitro, or make any network requests.'));
    return h(FormSection, { title: 'Darkio Fonty Fun' }, ...items.filter(Boolean));
  }

  // React Native fallback used when the classic Forms wrapper is missing.
  const Container = ScrollView || View;
  if (Container && Text && View && Pressable) {
    const fontItems = fontOptions.map(option => choiceButton(option.label + ' · ' + option.note, settings.fontStyle === option.id, () => update({ fontStyle: option.id }), option.sample));
    const colorItems = colorOptions.map(option => chip(option.sample + ' ' + option.label, settings.colorMode === option.id, () => update({ colorMode: option.id })));
    return h(Container, { contentContainerStyle: { padding: 16, paddingBottom: 34, gap: 11, backgroundColor: '#111018' }, style: { flex: 1 } },
      h(View, { style: { borderRadius: 16, borderWidth: 1, borderColor: '#493B65', backgroundColor: '#1C1728', padding: 16, gap: 7 } },
        h(Text, { style: { color: '#C4B5FD', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 } }, 'DARKIO · V4'),
        h(Text, { style: { color: '#F5F2FF', fontSize: 24, fontWeight: '800' } }, 'Fonty Fun'),
        h(Text, { style: { color: '#BEBACB', fontSize: 13, lineHeight: 19 } }, 'Local display styling with smoother color effects and more control.')
      ),
      h(View, { style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 } },
        h(View, { style: { flex: 1, paddingRight: 10 } }, rowLabel('Enable local styling', 'Only matching text is changed on this device.')),
        toggleControl(settings.enabled, enabled => update({ enabled }))
      ),
      rowLabel('Display name', 'Type capitalization and spacing as shown in Discord.'),
      TextInput ? h(TextInput, { value: settings.targetName, onChangeText: targetName => update({ targetName }), placeholder: 'Your display name', placeholderTextColor: '#777383', autoCapitalize: 'none', style: inputStyle }) : null,
      rowLabel('Name matching', 'Choose how a text element is matched.'),
      h(View, { style: { flexDirection: 'row', flexWrap: 'wrap' } }, ...MATCH_MODE_OPTIONS.map(option => chip(option.label, settings.targetMatchMode === option.id, () => update({ targetMatchMode: option.id }))),
      ),
      h(View, { style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 } },
        h(View, { style: { flex: 1, paddingRight: 10 } }, rowLabel('Case sensitive', 'Disable to ignore uppercase/lowercase.')),
        toggleControl(settings.caseSensitive, caseSensitive => update({ caseSensitive }))
      ),
      rowLabel('Font Lab · Unicode presets'),
      ...fontItems,
      choiceButton(showAllFonts ? 'Show fewer fonts' : 'Show all 21 fonts', false, () => setShowAllFonts(v => !v)),
      h(View, { style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 } },
        h(View, { style: { flex: 1, paddingRight: 10 } }, rowLabel('Color FX', 'Solid color or an animated palette.')),
        toggleControl(settings.colorEnabled, colorEnabled => update({ colorEnabled }))
      ),
      rowLabel('Primary color'),
      TextInput ? h(TextInput, { value: settings.color, onChangeText: color => update({ color }), placeholder: '#B69CFF', placeholderTextColor: '#777383', autoCapitalize: 'characters', style: { ...inputStyle, borderColor: validHexColor(settings.color) ? '#4A4857' : '#FF657A' } }) : null,
      rowLabel('Color effect'),
      h(View, { style: { flexDirection: 'row', flexWrap: 'wrap' } }, ...colorItems),
      choiceButton(showAllColors ? 'Show fewer effects' : 'Show all color effects', false, () => setShowAllColors(v => !v)),
      settings.colorMode === 'custom-cycle' && TextInput ? h(React.Fragment || View, null,
        rowLabel('Secondary color'),
        h(TextInput, { value: settings.secondaryColor, onChangeText: secondaryColor => update({ secondaryColor }), placeholder: '#55D6BE', placeholderTextColor: '#777383', autoCapitalize: 'characters', style: inputStyle })
      ) : null,
      settings.colorMode !== 'solid' ? h(View, { style: { borderRadius: 12, backgroundColor: '#1B1924', padding: 12, gap: 8 } },
        rowLabel('Animation speed'),
        h(View, { style: { flexDirection: 'row', flexWrap: 'wrap' } }, ...SPEED_OPTIONS.map(option => chip(option.label, settings.animationSpeed === option.id, () => update({ animationSpeed: option.id })))),
        h(View, { style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } },
          h(View, { style: { flex: 1, paddingRight: 8 } }, rowLabel('Ping-pong animation', 'Reverse smoothly at the end of a cycle.')),
          toggleControl(settings.reverseAnimation, reverseAnimation => update({ reverseAnimation }))
        ),
        h(View, { style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } },
          h(View, { style: { flex: 1, paddingRight: 8 } }, rowLabel('Reduce motion', 'Stop animated color changes.')),
          toggleControl(settings.reduceMotion, reduceMotion => update({ reduceMotion }))
        )
      ) : null,
      choiceButton(advancedOpen ? 'Hide more customization' : 'More customization', advancedOpen, () => setAdvancedOpen(v => !v)),
      advancedOpen ? h(View, { style: { borderRadius: 12, backgroundColor: '#1B1924', padding: 12, gap: 10 } },
        h(View, { style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } },
          h(View, { style: { flex: 1, paddingRight: 8 } }, rowLabel('Bold weight')),
          toggleControl(settings.bold, bold => update({ bold }))
        ),
        h(View, { style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } },
          h(View, { style: { flex: 1, paddingRight: 8 } }, rowLabel('Italic style')),
          toggleControl(settings.italic, italic => update({ italic }))
        ),
        rowLabel('Character spacing'),
        h(View, { style: { flexDirection: 'row', flexWrap: 'wrap' } }, ...SPACING_OPTIONS.map(option => chip(option.label, settings.letterSpacing === option.id, () => update({ letterSpacing: option.id }))))
      ) : null,
      h(View, { style: { borderRadius: 14, backgroundColor: '#1B1924', padding: 16, gap: 8, marginTop: 3 } },
        h(Text, { style: { color: '#A9A5B8', fontSize: 11, fontWeight: '800', letterSpacing: 1.1 } }, 'LIVE PREVIEW'),
        Animated?.Text && settings.colorEnabled && !settings.reduceMotion && settings.colorMode !== 'solid'
          ? h(Animated.Text, { style: { fontSize: 26, fontWeight: settings.bold ? '800' : '700', fontStyle: settings.italic ? 'italic' : 'normal', color: previewColor } }, preview)
          : h(Text, { style: { fontSize: 26, fontWeight: settings.bold ? '800' : '700', fontStyle: settings.italic ? 'italic' : 'normal', color: typeof previewColor === 'string' ? previewColor : '#B69CFF' } }, preview)
      ),
      choiceButton('Reset all settings', false, () => update({ ...DEFAULT_SETTINGS }), null),
      h(Text, { style: { color: '#918C9F', fontSize: 12, lineHeight: 17 } }, 'Local-only rendering. This does not change your public profile or make network requests.')
    );
  }

  // A visible, actionable fallback is preferable to a silent blank settings page.
  if (Forms?.FormSection && Forms?.FormRow) {
    return h(Forms.FormSection, { title: 'Darkio Fonty Fun' },
      h(Forms.FormRow, { label: 'Settings UI components unavailable', subLabel: 'This client exposes neither the expected classic Forms nor React Native settings controls. Update Revenge Classic or install the V4 package in the matching client.' })
    );
  }
  return h && Text ? h(Text, null, 'Darkio Fonty Fun settings controls are unavailable in this client version.') : null;
}

const lifecycle = {
  start(context = {}) {
    const suppliedStorage = safeRead(() => context?.jsonStorage);
    if (suppliedStorage && typeof suppliedStorage === 'object') apiStorage = suppliedStorage;
    if (!React || !h) {
      logger?.error?.('Darkio Fonty Fun: React was not available; settings and rendering hooks could not be initialized.');
      return;
    }
    // createStorage is available in some Revenge Classic/Bunny builds too; do
    // not gate it on the newer spec-3 loader check.
    const persistentStorage = safeRead(() => legacy?.plugin?.storage)
      || safeRead(() => revengeApi?.plugin?.storage)
      || safeRead(() => legacy?.storage)
      || safeRead(() => revengeApi?.plugin?.createStorage?.());
    if (persistentStorage && typeof persistentStorage === 'object') storage = persistentStorage;
    else logger?.warn?.('Darkio Fonty Fun: persistent storage is unavailable; settings will last only for this session.');
    const savedApiSettings = safeRead(() => apiStorage?.cache);
    if (savedApiSettings && typeof savedApiSettings === 'object') {
      for (const [key, value] of Object.entries(savedApiSettings)) if (Object.prototype.hasOwnProperty.call(DEFAULT_SETTINGS, key)) storage[key] = value;
    }
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) if (storage[key] === undefined) storage[key] = value;
    if (apiStorage && !savedApiSettings) {
      try { const pending = apiStorage.set?.({ ...DEFAULT_SETTINGS }); pending?.catch?.(() => {}); } catch (_) {}
    }
    // React Native's classic JSX transform uses createElement. Some Discord builds use jsx/jsxs helpers.
    addPatcher(React, 'createElement');
    try {
      const jsxRuntime = findByProps?.('jsx', 'jsxs');
      if (jsxRuntime) { addPatcher(jsxRuntime, 'jsx'); addPatcher(jsxRuntime, 'jsxs'); if (typeof jsxRuntime.jsxDEV === 'function') addPatcher(jsxRuntime, 'jsxDEV'); }
    } catch (_) {}
    syncAnimation(readSettings());
    logger?.log?.('Darkio Fonty Fun started (local rendering only).');
  },
  stop() {
    stopAnimation();
    while (unpatches.length) { try { unpatches.pop()(); } catch (_) {} }
    logger?.log?.('Darkio Fonty Fun stopped.');
  },
  SettingsComponent,
};

  // Classic/Vendetta plugin shape, matching the known-working reference plugins.
  // The settings key is intentional: Classic's wrench invokes this function.
  return {
    // Classic Vendetta/Bunny lifecycle names.
    onLoad: lifecycle.start,
    onUnload: lifecycle.stop,
    settings: lifecycle.SettingsComponent,
    // Newer Revenge lifecycle aliases. Unknown fields are harmless to Classic.
    start: lifecycle.start,
    stop: lifecycle.stop,
    SettingsComponent: lifecycle.SettingsComponent,
  };
})())

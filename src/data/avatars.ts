export interface BuiltInAvatar {
  id: string;
  name: string;
  category: string;
  svgDataUri: string;
  accentColor: string;
}

// Function to encode SVG to data URI
const toSvgUri = (svgString: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

export const BUILT_IN_AVATARS: BuiltInAvatar[] = [
  {
    id: 'crystal-gem',
    name: 'Cristal d’Émeraude',
    category: 'Minéral & Géométrie',
    accentColor: '#0d9488',
    svgDataUri: toSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2dd4bf"/>
            <stop offset="50%" stop-color="#0f766e"/>
            <stop offset="100%" stop-color="#134e4a"/>
          </linearGradient>
          <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#5eead4"/>
            <stop offset="100%" stop-color="#14b8a6"/>
          </linearGradient>
          <radialGradient id="bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#134e4a"/>
            <stop offset="100%" stop-color="#042f2e"/>
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#bg)"/>
        <polygon points="50,15 78,35 68,80 32,80 22,35" fill="url(#g1)" stroke="#5eead4" stroke-width="1.5"/>
        <polygon points="50,15 62,35 50,55 38,35" fill="url(#g2)" opacity="0.9"/>
        <polygon points="50,55 68,80 32,80" fill="#042f2e" opacity="0.4"/>
        <polygon points="22,35 38,35 32,80" fill="#0f766e" opacity="0.7"/>
        <polygon points="78,35 62,35 68,80" fill="#14b8a6" opacity="0.6"/>
        <circle cx="50" cy="35" r="3" fill="#ffffff" opacity="0.8"/>
      </svg>
    `),
  },
  {
    id: 'cosmic-planet',
    name: 'Planète Cosmique',
    category: 'Astronomie',
    accentColor: '#8b5cf6',
    svgDataUri: toSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <radialGradient id="p1" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#c084fc"/>
            <stop offset="50%" stop-color="#7c3aed"/>
            <stop offset="100%" stop-color="#3b0764"/>
          </radialGradient>
          <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="50%" stop-color="#c084fc"/>
            <stop offset="100%" stop-color="#f43f5e"/>
          </linearGradient>
          <radialGradient id="bgP" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="100%" stop-color="#090514"/>
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#bgP)"/>
        <!-- Background stars -->
        <circle cx="20" cy="25" r="1.5" fill="#fff" opacity="0.8"/>
        <circle cx="80" cy="20" r="1" fill="#fff" opacity="0.6"/>
        <circle cx="85" cy="75" r="1.5" fill="#fff" opacity="0.7"/>
        <circle cx="25" cy="80" r="1" fill="#fff" opacity="0.5"/>
        <!-- Planet body -->
        <circle cx="50" cy="50" r="28" fill="url(#p1)"/>
        <!-- Ring -->
        <ellipse cx="50" cy="50" rx="42" ry="12" fill="none" stroke="url(#ring)" stroke-width="4.5" transform="rotate(-25 50 50)"/>
      </svg>
    `),
  },
  {
    id: 'origami-fox',
    name: 'Renard Origami',
    category: 'Art Géométrique',
    accentColor: '#ea580c',
    svgDataUri: toSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <radialGradient id="bgFox" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#431407"/>
            <stop offset="100%" stop-color="#1c0702"/>
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#bgFox)"/>
        <!-- Left ear -->
        <polygon points="50,42 22,20 30,55" fill="#f97316"/>
        <!-- Right ear -->
        <polygon points="50,42 78,20 70,55" fill="#fb923c"/>
        <!-- Forehead -->
        <polygon points="50,42 30,55 70,55" fill="#fdba74"/>
        <!-- Left cheek -->
        <polygon points="30,55 18,65 50,78" fill="#ea580c"/>
        <!-- Right cheek -->
        <polygon points="70,55 82,65 50,78" fill="#c2410c"/>
        <!-- Snout white cheeks -->
        <polygon points="35,65 50,78 28,76" fill="#fff7ed"/>
        <polygon points="65,65 50,78 72,76" fill="#fed7aa"/>
        <!-- Nose tip -->
        <polygon points="46,75 54,75 50,81" fill="#18181b"/>
      </svg>
    `),
  },
  {
    id: 'zen-lotus',
    name: 'Lotus Zen',
    category: 'Botanique & Sérénité',
    accentColor: '#ec4899',
    svgDataUri: toSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <radialGradient id="bgLotus" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#500724"/>
            <stop offset="100%" stop-color="#1c020d"/>
          </radialGradient>
          <linearGradient id="petalPink" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#db2777"/>
            <stop offset="100%" stop-color="#fbcfe8"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#bgLotus)"/>
        <!-- Outer petals -->
        <path d="M 50 80 C 20 80 15 50 50 35 C 85 50 80 80 50 80 Z" fill="#9d174d" opacity="0.8"/>
        <path d="M 50 78 C 30 75 25 45 50 25 C 75 45 70 75 50 78 Z" fill="url(#petalPink)"/>
        <path d="M 50 78 C 38 72 35 48 50 35 C 65 48 62 72 50 78 Z" fill="#f472b6"/>
        <circle cx="50" cy="46" r="3.5" fill="#fde047"/>
      </svg>
    `),
  },
  {
    id: 'golden-vault',
    name: 'Coffre d’Or & Prospérité',
    category: 'Finance & Succès',
    accentColor: '#eab308',
    svgDataUri: toSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <radialGradient id="bgGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#422006"/>
            <stop offset="100%" stop-color="#1a0c02"/>
          </radialGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="40%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#854d0e"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#bgGold)"/>
        <rect x="26" y="26" width="48" height="48" rx="14" fill="none" stroke="url(#goldGrad)" stroke-width="4.5"/>
        <circle cx="50" cy="50" r="14" fill="none" stroke="url(#goldGrad)" stroke-width="3"/>
        <circle cx="50" cy="50" r="5" fill="#fef08a"/>
        <line x1="50" y1="26" x2="50" y2="36" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="50" y1="64" x2="50" y2="74" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="26" y1="50" x2="36" y2="50" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="64" y1="50" x2="74" y2="50" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `),
  },
  {
    id: 'cyber-cube',
    name: 'Cube Isométrique Cyber',
    category: 'Technologie Futuriste',
    accentColor: '#06b6d4',
    svgDataUri: toSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <radialGradient id="bgCyber" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#083344"/>
            <stop offset="100%" stop-color="#02141c"/>
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#bgCyber)"/>
        <!-- Top face -->
        <polygon points="50,22 76,37 50,52 24,37" fill="#22d3ee" opacity="0.95"/>
        <!-- Left face -->
        <polygon points="24,37 50,52 50,80 24,65" fill="#0891b2" opacity="0.85"/>
        <!-- Right face -->
        <polygon points="50,52 76,37 76,65 50,80" fill="#0e7490" opacity="0.9"/>
        <!-- Inner glow lines -->
        <line x1="50" y1="22" x2="50" y2="52" stroke="#e0f2fe" stroke-width="1.5"/>
        <line x1="24" y1="37" x2="50" y2="52" stroke="#e0f2fe" stroke-width="1.5"/>
        <line x1="76" y1="37" x2="50" y2="52" stroke="#e0f2fe" stroke-width="1.5"/>
        <circle cx="50" cy="52" r="3" fill="#ffffff"/>
      </svg>
    `),
  },
  {
    id: 'alps-summit',
    name: 'Sommet Alpin',
    category: 'Nature & Altitude',
    accentColor: '#3b82f6',
    svgDataUri: toSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <linearGradient id="bgSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1e3a8a"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#bgSky)"/>
        <!-- Moon / Sun -->
        <circle cx="70" cy="30" r="9" fill="#f8fafc" opacity="0.9"/>
        <!-- Background peak -->
        <polygon points="32,80 62,35 88,80" fill="#334155"/>
        <!-- Foreground peak -->
        <polygon points="12,80 44,25 76,80" fill="#1e293b"/>
        <!-- Snowcap -->
        <polygon points="44,25 35,42 42,40 46,45 53,40 55,44 60,42" fill="#ffffff"/>
      </svg>
    `),
  },
  {
    id: 'shield-fortress',
    name: 'Bouclier Protecteur',
    category: 'Sécurité & Sauvegarde',
    accentColor: '#10b981',
    svgDataUri: toSvgUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <radialGradient id="bgShield" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#064e3b"/>
            <stop offset="100%" stop-color="#022c22"/>
          </radialGradient>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#34d399"/>
            <stop offset="100%" stop-color="#059669"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#bgShield)"/>
        <!-- Shield shape -->
        <path d="M 50 18 L 76 28 C 76 56 50 78 50 82 C 50 78 24 56 24 28 Z" fill="url(#shieldGrad)" stroke="#6ee7b7" stroke-width="2"/>
        <path d="M 50 24 L 70 32 C 70 54 50 72 50 75 Z" fill="#10b981" opacity="0.5"/>
        <!-- Checkmark inside -->
        <polyline points="38,48 46,56 62,38" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `),
  },
];

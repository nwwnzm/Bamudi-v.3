import React from 'react';

export type BamuMood = 'waving' | 'happy' | 'encouraging' | 'celebrating' | 'thinking';
export type BamuSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface Props {
  mood?: BamuMood;
  size?: BamuSize;
  className?: string;
  speech?: string;
  speechPosition?: 'top' | 'right' | 'bottom';
}

const sizeMap: Record<BamuSize, { w: number; h: number; px: string }> = {
  xs: { w: 28, h: 28, px: 'w-7 h-7' },
  sm: { w: 40, h: 40, px: 'w-10 h-10' },
  md: { w: 56, h: 56, px: 'w-14 h-14' },
  lg: { w: 76, h: 76, px: 'w-19 h-19' },
  xl: { w: 104, h: 104, px: 'w-26 h-26' },
  '2xl': { w: 148, h: 148, px: 'w-37 h-37' },
};

export const BamuMascot: React.FC<Props> = ({
  mood = 'happy',
  size = 'md',
  className = '',
  speech,
  speechPosition = 'right',
}) => {
  const uid = React.useId().replace(/:/g, '');
  const { w, h } = sizeMap[size];

  const wingGradId = `bamuWingGrad-${uid}`;
  const tailGlowId = `bamuTailGlow-${uid}`;
  const faceGradId = `bamuFaceGrad-${uid}`;
  const hoodGradId = `bamuHoodGrad-${uid}`;
  const backpackGradId = `bamuBackpackGrad-${uid}`;
  const bulbGlowId = `bamuBulbGlow-${uid}`;

  // SVG representation of Bamu the Firefly Teacher Companion:
  // Warm friendly firefly with glowing antennae tips, translucent sky-blue wings,
  // blue teacher backpack, glowing tail abdomen, and expressive idea lightbulb.
  const renderSvg = () => (
    <svg
      width={w}
      height={h}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform hover:scale-105 duration-200"
      aria-label={`Bamu firefly mascot (${mood})`}
    >
      <defs>
        {/* Translucent Sky-Blue Wing Gradient */}
        <linearGradient id={wingGradId} x1="65" y1="35" x2="122" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
          <stop offset="60%" stopColor="#bfe8ff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#70c4ff" stopOpacity="0.75" />
        </linearGradient>

        {/* Glowing Firefly Tail / Abdomen Gradient */}
        <linearGradient id={tailGlowId} x1="72" y1="78" x2="108" y2="112" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff59d" />
          <stop offset="55%" stopColor="#ffc107" />
          <stop offset="100%" stopColor="#cc310e" />
        </linearGradient>

        {/* Warm Face Gradient */}
        <linearGradient id={faceGradId} x1="60" y1="32" x2="60" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff6dc" />
          <stop offset="100%" stopColor="#ffe0a3" />
        </linearGradient>

        {/* Firefly Hood / Cap Gradient */}
        <linearGradient id={hoodGradId} x1="40" y1="24" x2="85" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4e3629" />
          <stop offset="100%" stopColor="#2a1b14" />
        </linearGradient>

        {/* Teacher Backpack Sky Blue Gradient */}
        <linearGradient id={backpackGradId} x1="45" y1="68" x2="90" y2="108" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0099ff" />
          <stop offset="100%" stopColor="#0055aa" />
        </linearGradient>

        {/* Idea Lightbulb Radial Glow */}
        <radialGradient id={bulbGlowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff9c4" stopOpacity="1" />
          <stop offset="55%" stopColor="#ffd54f" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffb300" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="66" cy="117" rx="34" ry="6" fill="#062447" fillOpacity="0.14" />

      {/* 1. TRANSLUCENT FIREFLY WINGS (Right/Back) */}
      <g>
        {/* Upper Wing */}
        <path
          d="M 76 62 C 94 38 120 36 122 52 C 124 66 102 76 78 72 Z"
          fill={`url(#${wingGradId})`}
          stroke="#5ab8ff"
          strokeWidth="1.6"
        />
        {/* Wing Veins */}
        <path
          d="M 82 64 Q 102 52 116 49 M 96 56 Q 104 62 112 61"
          stroke="#7cc8ff"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Lower Wing */}
        <path
          d="M 78 72 C 98 66 118 72 115 85 C 112 95 92 92 76 80 Z"
          fill={`url(#${wingGradId})`}
          stroke="#5ab8ff"
          strokeWidth="1.5"
        />
      </g>

      {/* 2. GLOWING FIREFLY TAIL ABDOMEN */}
      <g>
        {/* Outer Warm Bioluminescent Halo */}
        <ellipse cx="89" cy="96" rx="22" ry="16" fill={`url(#${bulbGlowId})`} opacity="0.55" />
        {/* Striped Glowing Abdomen */}
        <path
          d="M 68 84 C 86 78 106 86 105 101 C 104 113 84 116 66 105 Z"
          fill={`url(#${tailGlowId})`}
          stroke="#3b261d"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Firefly Abdomen Segment Bands */}
        <path d="M 82 82 C 86 92 85 103 80 111" stroke="#803300" strokeWidth="2" strokeLinecap="round" />
        <path d="M 93 85 C 96 93 95 103 91 109" stroke="#803300" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* 3. BLUE TEACHER BACKPACK (Back Shell) */}
      <path
        d="M 72 67 C 87 67 94 76 92 91 C 90 101 80 104 69 101 Z"
        fill={`url(#${backpackGradId})`}
        stroke="#003d80"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Backpack Flap & Pocket */}
      <path d="M 75 72 Q 86 73 89 82" stroke="#66c2ff" strokeWidth="1.8" strokeLinecap="round" />

      {/* 4. TORSO & BACKPACK STRAPS */}
      <path
        d="M 44 74 C 42 88 45 105 56 109 C 67 112 77 107 78 93 C 79 81 74 72 60 72 Z"
        fill={`url(#${faceGradId})`}
        stroke="#3b261d"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Dark Brown Firefly Belly Vest */}
      <path
        d="M 45 77 C 54 79 66 79 75 76 C 77 86 75 98 69 105 C 58 108 48 104 45 92 Z"
        fill="#3b261d"
      />
      {/* Warm Cream Chest Patch */}
      <ellipse cx="58" cy="91" rx="10" ry="12" fill="#ffe7b3" />
      {/* Blue Backpack Shoulder Straps on Chest */}
      <path
        d="M 48 75 C 46 84 47 94 51 101"
        stroke="#0088ee"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M 68 75 C 71 84 71 95 67 103"
        stroke="#0088ee"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/*Cute Little Feet */}
      <ellipse cx="51" cy="111" rx="7.5" ry="4.5" fill="#3b261d" />
      <ellipse cx="68" cy="111" rx="7.5" ry="4.5" fill="#3b261d" />

      {/* 5. FIREFLY ANTENNAE WITH GLOWING ORBS */}
      <g>
        {/* Left Antenna */}
        <path
          d="M 49 32 Q 42 15 31 16"
          stroke="#3b261d"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="30" cy="16" r="8" fill={`url(#${bulbGlowId})`} />
        <circle cx="30" cy="16" r="4.5" fill="#ffd54f" stroke="#cc310e" strokeWidth="1.5" />

        {/* Right Antenna */}
        <path
          d="M 69 31 Q 78 14 90 16"
          stroke="#3b261d"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="91" cy="16" r="8" fill={`url(#${bulbGlowId})`} />
        <circle cx="91" cy="16" r="4.5" fill="#ffd54f" stroke="#cc310e" strokeWidth="1.5" />
      </g>

      {/* 6. FIREFLY HEAD & HOOD */}
      <g>
        {/* Outer Head Contour (Dark Warm Cap/Hood) */}
        <path
          d="M 59 27
             C 82 27 94 40 93 58
             C 92 73 79 81 59 81
             C 39 81 27 72 27 57
             C 27 39 38 27 59 27 Z"
          fill={`url(#${hoodGradId})`}
          stroke="#23150f"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        {/* Inner Cream Heart-Shaped Face Mask */}
        <path
          d="M 58 37
             C 66 37 73 33 80 39
             C 87 45 88 57 85 66
             C 81 75 71 79 58 79
             C 45 79 35 75 32 66
             C 29 57 30 45 37 39
             C 44 33 50 37 58 37 Z"
          fill={`url(#${faceGradId})`}
        />

        {/* Soft Rosy Cheek Blushes */}
        <ellipse cx="38" cy="65" rx="5.5" ry="3.5" fill="#ff758f" fillOpacity="0.48" />
        <ellipse cx="78" cy="65" rx="5.5" ry="3.5" fill="#ff758f" fillOpacity="0.48" />
      </g>

      {/* 7. EXPRESSIONS: EYES & EYEBROWS */}
      {mood === 'happy' || mood === 'celebrating' ? (
        // Joyful sparkling eyes with happy arched brows
        <g>
          {/* Eyebrows */}
          <path d="M 38 44 Q 44 40 49 43" stroke="#3b261d" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M 67 43 Q 72 40 78 44" stroke="#3b261d" strokeWidth="2.4" strokeLinecap="round" />
          {/* Big Glossy Firefly Eyes */}
          <ellipse cx="44" cy="55" rx="6.5" ry="7.5" fill="#23150f" />
          <circle cx="42" cy="52" r="2.6" fill="#ffffff" />
          <circle cx="46.5" cy="58" r="1.3" fill="#ffffff" />

          <ellipse cx="72" cy="55" rx="6.5" ry="7.5" fill="#23150f" />
          <circle cx="70" cy="52" r="2.6" fill="#ffffff" />
          <circle cx="74.5" cy="58" r="1.3" fill="#ffffff" />
        </g>
      ) : mood === 'thinking' ? (
        // Inquiring eyes looking up-right toward idea bulb
        <g>
          <path d="M 38 45 Q 44 43 49 45" stroke="#3b261d" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M 67 41 Q 73 38 79 42" stroke="#3b261d" strokeWidth="2.3" strokeLinecap="round" />
          <ellipse cx="44" cy="55" rx="6" ry="7" fill="#23150f" />
          <circle cx="46" cy="52" r="2.4" fill="#ffffff" />
          <ellipse cx="72" cy="54" rx="6" ry="7" fill="#23150f" />
          <circle cx="74" cy="51" r="2.4" fill="#ffffff" />
        </g>
      ) : (
        // Waving & Encouraging: warm welcoming eyes
        <g>
          <path d="M 38 44 Q 44 41 49 44" stroke="#3b261d" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M 67 44 Q 72 41 78 44" stroke="#3b261d" strokeWidth="2.3" strokeLinecap="round" />
          <ellipse cx="44" cy="55" rx="6.5" ry="7.5" fill="#23150f" />
          <circle cx="42" cy="52" r="2.6" fill="#ffffff" />
          <circle cx="46.5" cy="58" r="1.2" fill="#ffffff" />

          <ellipse cx="72" cy="55" rx="6.5" ry="7.5" fill="#23150f" />
          <circle cx="70" cy="52" r="2.6" fill="#ffffff" />
          <circle cx="74.5" cy="58" r="1.2" fill="#ffffff" />
        </g>
      )}

      {/* 8. MOUTH */}
      {mood === 'happy' || mood === 'celebrating' || mood === 'waving' ? (
        // Warm open cheerful smile (matching the firefly reference)
        <g>
          <path
            d="M 51 62 Q 58 64 65 62 C 65 71 51 71 51 62 Z"
            fill="#d93829"
            stroke="#23150f"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M 54 66 Q 58 69 62 66"
            fill="#ff8fa3"
          />
        </g>
      ) : mood === 'thinking' ? (
        // Cute thoughtful 'o' mouth
        <ellipse cx="59" cy="65" rx="3" ry="3.8" fill="#23150f" />
      ) : (
        // Encouraging gentle smile
        <path
          d="M 51 63 Q 58 70 65 63"
          stroke="#23150f"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* 9. ARMS, IDEA LIGHTBULB & MOOD ACCESSORIES */}
      {mood === 'celebrating' && (
        // Graduation Mortarboard Cap + Confetti
        <g>
          <path
            d="M 59 14 L 85 23 L 59 31 L 33 23 Z"
            fill="#062447"
            stroke="#0099ff"
            strokeWidth="1.5"
          />
          <circle cx="59" cy="22.5" r="2.2" fill="#ffc107" />
          <path d="M 59 22.5 Q 74 25 78 35" stroke="#cc310e" strokeWidth="2" strokeLinecap="round" />
          <circle cx="18" cy="30" r="2.5" fill="#0099ff" />
          <circle cx="108" cy="28" r="2.5" fill="#cc310e" />
        </g>
      )}

      {mood === 'thinking' ? (
        // Right hand on chin + floating glowing idea bulb above
        <g>
          {/* Left resting arm */}
          <path
            d="M 44 76 C 34 78 31 86 37 90 C 42 92 46 86 47 80"
            fill="#ffe0a3"
            stroke="#3b261d"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Right hand raised to chin */}
          <path
            d="M 69 78 C 72 71 67 66 62 68 C 58 70 61 77 66 80 Z"
            fill="#ffe0a3"
            stroke="#3b261d"
            strokeWidth="2.2"
          />
          {/* Floating Idea Bulb at Top-Left */}
          <circle cx="18" cy="40" r="14" fill={`url(#${bulbGlowId})`} />
          <path
            d="M 18 29 C 12.5 29 9 33 9 38 C 9 41.5 11.5 44 13.5 46 L 22.5 46 C 24.5 44 27 41.5 27 38 C 27 33 23.5 29 18 29 Z"
            fill="#fff59d"
            stroke="#cc310e"
            strokeWidth="1.8"
          />
          <rect x="14" y="46" width="8" height="4" rx="1.5" fill="#64748b" stroke="#334155" strokeWidth="1.2" />
          {/* Light rays */}
          <line x1="18" y1="22" x2="18" y2="25" stroke="#ffb300" strokeWidth="2" strokeLinecap="round" />
          <line x1="6" y1="29" x2="8.5" y2="31" stroke="#ffb300" strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="29" x2="27.5" y2="31" stroke="#ffb300" strokeWidth="2" strokeLinecap="round" />
        </g>
      ) : (
        // Standard Firefly Pose: Left arm holding the glowing Idea Lightbulb!
        <g>
          {/* Extended Left Arm Holding Idea Bulb */}
          <path
            d="M 43 76 C 31 73 22 65 20 57 C 19 52 25 51 28 56 C 31 61 38 67 46 71 Z"
            fill="#ffe0a3"
            stroke="#3b261d"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* Glowing Idea Lightbulb Held in Hand */}
          <circle cx="18" cy="44" r="16" fill={`url(#${bulbGlowId})`} />
          {/* Lightbulb Glass */}
          <path
            d="M 16 31 C 9.8 32 6.5 37.5 7.5 43.2 C 8.2 46.8 11 49.2 13 51.5 L 21.5 50 C 23 47.5 25 44.5 24.3 40.5 C 23.3 34.5 21.5 30.2 16 31 Z"
            fill="#fff9c4"
            stroke="#d97706"
            strokeWidth="2"
          />
          {/* Inner Filament Glow */}
          <path
            d="M 14.5 48 L 14 41 C 14 39 18 39 18 41 L 18.5 47.5"
            stroke="#cc310e"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Lightbulb Screw Base */}
          <path
            d="M 13.5 51.5 L 21.5 50 L 22.2 55.5 C 22.4 57 14.8 58 14.2 56.5 Z"
            fill="#64748b"
            stroke="#1e293b"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Radiant Spark Rays Around Lightbulb */}
          <line x1="14" y1="23" x2="15" y2="27" stroke="#ffb300" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="3" y1="33" x2="6.5" y2="35.5" stroke="#ffb300" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="2" y1="46" x2="5.5" y2="45.5" stroke="#cc310e" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="27" y1="27" x2="24.5" y2="30" stroke="#ffb300" strokeWidth="2.4" strokeLinecap="round" />

          {/* Right Arm (Waving or Resting Cheerfully) */}
          {mood === 'waving' ? (
            <path
              d="M 73 77 C 82 72 89 64 87 58 C 85 54 79 58 76 64 C 73 69 70 72 68 74 Z"
              fill="#ffe0a3"
              stroke="#3b261d"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M 68 79 C 75 82 77 90 71 93 C 66 95 62 89 64 83"
              fill="#ffe0a3"
              stroke="#3b261d"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          )}
        </g>
      )}
    </svg>
  );

  if (!speech) {
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderSvg()}</div>;
  }

  // With friendly speech bubble in Cloudy White with Sky Blue border
  return (
    <div
      className={`inline-flex items-center gap-3 ${
        speechPosition === 'top'
          ? 'flex-col-reverse'
          : speechPosition === 'bottom'
          ? 'flex-col'
          : 'flex-row'
      } ${className}`}
    >
      {renderSvg()}
      <div className="relative bg-[#fdfdfe] border border-sky-200 rounded-2xl px-4 py-2.5 shadow-sm max-w-sm text-left">
        {speechPosition === 'right' && (
          <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#fdfdfe] border-l border-b border-sky-200 rotate-45" />
        )}
        {speechPosition === 'top' && (
          <span className="absolute -bottom-1.5 left-6 w-3 h-3 bg-[#fdfdfe] border-r border-b border-sky-200 rotate-45" />
        )}
        <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
          {speech}
        </p>
      </div>
    </div>
  );
};

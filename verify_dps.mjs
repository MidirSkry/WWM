import { readFileSync } from 'fs';

const src = readFileSync('d:/Repo/WWM/wwm-calculator.jsx', 'utf8');
const lines = src.split('\n');

// Lines 7-332 contain BASE_STATS_85, BUILDS, calcDamageExpectation, calcBuildDPS
const codeLines = lines.slice(6, 405);
const codeStr = codeLines.join('\n');

// Write extracted code to a temp file and import it
import { writeFileSync } from 'fs';
const wrapper = codeStr + '\nexport { BASE_STATS_85, BUILDS, calcBuildDPS };\n';
writeFileSync('d:/Repo/WWM/_temp_calc.mjs', wrapper);

const mod = await import('file:///d:/Repo/WWM/_temp_calc.mjs');
const { BUILDS, calcBuildDPS } = mod;

const targets = {
  nameless: 15480,
  jade: 15525,
  umber: 16513,
  twinblades: 19383,
  moblade: 16553,
  healer: 27560
};

console.log('=== WWM DPS Verification ===');
console.log('Build        Computed  Target   Error');
console.log('-----------  -------  -------  -------');

for (const [key, build] of Object.entries(BUILDS)) {
  const result = calcBuildDPS(build.defaultPanel, key);
  const target = targets[key];
  const err = ((result.dps - target) / target * 100).toFixed(3);
  const line = key.padEnd(13) + String(result.dps).padStart(6) + '   ' + String(target).padStart(6) + '   ' + err.padStart(7) + '%';
  console.log(line);
}

// Cleanup
import { unlinkSync } from 'fs';
unlinkSync('d:/Repo/WWM/_temp_calc.mjs');

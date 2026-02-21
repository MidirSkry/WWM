import { useState, useMemo, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
// DATA TABLES — extracted from spreadsheet, using official EN localization
// ═══════════════════════════════════════════════════════════

const BASE_STATS_85 = {
  minAtk: 577, maxAtk: 1024, precision: 0.853, criti: 0.234,
  dirCriti: 0, critiDmg: 0.5, affinity: 0.115, dirAffinity: 0,
  affinityDmg: 0.35, minAttri: 198, maxAttri: 397,
  phyPen: 0, physDmgBonus: 0,
  attriPen: 8, attriDmgBonus: 0.04, judgmentRes: 0.15,
};

const BUILDS = {
  nameless: {
    name: "Nameless 85",
    subtitle: "Nameless Sword & Nameless Spear",
    path: "Bellstrike – Splendor",
    rotationTime: 64.3,
    gradMax: 47962,
    defaultPanel: { minAtk: 570, maxAtk: 1800, precision: 0.983, criti: 0.7, dirCriti: 0.087, critiDmg: 0.5, affinity: 0.35, dirAffinity: 0, affinityDmg: 0.582, minAttri: 163, maxAttri: 327, phyPen: 11.2, physDmgBonus: 0, attriPen: 6.8, attriDmgBonus: 0.034, bossBoost: 0, attune: 0, dmgBoost: 0.265 },
    rotation: [
      { axis:"Spear Q", skill:"Xiao – Shooting Star (5-hit)", count:1, atkMult:7.348, fixDmg:1550, attriMult:11.022 },
      { axis:"Xiao Blow", skill:"Vagrant Sword (Lv2 Charge)", count:1, atkMult:4.7037, fixDmg:1300, attriMult:7.056 },
      { axis:"Sword Qi x5", skill:"Vagrant Sword (Lv2 Charge)", count:1, atkMult:4.7037, fixDmg:1300, attriMult:7.056 },
      { axis:"Spear Q", skill:"Vagrant Sword (Lv2 Charge)", count:1, atkMult:4.7037, fixDmg:1300, attriMult:7.056 },
      { axis:"Sword Qi x4", skill:"Vagrant Sword (Lv2 Charge)", count:1, atkMult:4.7037, fixDmg:1300, attriMult:7.056 },
      { axis:"Legion Crusher", skill:"Vagrant Sword (Lv2 Charge)", count:1, atkMult:4.7037, fixDmg:1300, attriMult:7.056 },
      { axis:"Sword Qi", skill:"Vagrant Sword (Lv2 Charge)", count:1, atkMult:4.7037, fixDmg:1300, attriMult:7.056 },
      { axis:"Spear Q", skill:"Vagrant Sword (Lv2 Charge)", count:2, atkMult:4.7037, fixDmg:1300, attriMult:7.056 },
      { axis:"Sword Qi x4", skill:"Vagrant Sword (Lv2 Charge)", count:5, atkMult:4.7037, fixDmg:1300, attriMult:7.056 },
      { axis:"Legion Crusher", skill:"Vagrant Sword (Lv2 Charge)", count:1, atkMult:4.7037, fixDmg:1300, attriMult:7.056 },
      { axis:"Sword Qi", skill:"Vagrant Sword (Lv2 Charge)", count:1, atkMult:4.7037, fixDmg:1300, attriMult:7.056 },
      { axis:"Spear Q", skill:"Legion Crusher", count:3, atkMult:7.1024, fixDmg:1069, attriMult:10.654 },
      { axis:"Sword Qi x2", skill:"Xiao – Shooting Star (Full)", count:1, atkMult:12.7366, fixDmg:2690, attriMult:19.105 },
      { axis:"Sword Q1", skill:"Daunting Strike (Q1)", count:1, atkMult:1.0253, fixDmg:283, attriMult:1.538 },
      { axis:"Xiao Blow (Full)", skill:"Vagrant Sword (Lv2 Charge)", count:5, atkMult:4.7037, fixDmg:1300, attriMult:7.056 },
      { axis:"Sword Qi x2", skill:"Vagrant Sword (Lv2 Charge)", count:4, atkMult:4.7037, fixDmg:1300, attriMult:7.056 },
    ],
    specialEntries: [
      { skill:"Morale Chant Lv6", count:5.6584, atkMult:1, fixDmg:0, attriMult:1, isSpecial:true },
      { skill:"Wildfire Spark DoT", countFromTime:true, atkMult:0.276, fixDmg:0, attriMult:0, isSpecial:true },
    ],
    config: { morale:true, hawking:true, atkFood:true, qianshan:true, bow:"affinity", monsterDef:270, breakRatio:0, exhaustRatio:0.1 }
  },
  jade: {
    name: "Jade 85",
    subtitle: "Vernal Umbrella & Inkwell Fan",
    path: "Silkbind – Jade",
    rotationTime: 28.5,
    gradMax: 47962,
    defaultPanel: { minAtk: 891, maxAtk: 1796, precision: 0.983, criti: 0.7, dirCriti: 0.087, critiDmg: 0.5, affinity: 0.35, dirAffinity: 0, affinityDmg: 0.402, minAttri: 163, maxAttri: 327, phyPen: 11.2, physDmgBonus: 0, attriPen: 6.8, attriDmgBonus: 0.034, bossBoost: 0.05, attune: 0, dmgBoost: 0 },
    rotation: [
      { axis:"Jadewind Shield", skill:"Fan Light Charge 1", count:1, atkMult:1.9004, fixDmg:178, attriMult:2.851 },
      { axis:"Unfading Flower", skill:"Spring Sorrow (Accel)", count:1, atkMult:2.3397, fixDmg:648, attriMult:3.510 },
      { axis:"Spring Sorrow x3", skill:"Spring Sorrow (Accel)", count:2, atkMult:2.3397, fixDmg:648, attriMult:3.510 },
      { axis:"Unfading Flower", skill:"Spring Away", count:1.5, atkMult:1.0217, fixDmg:282, attriMult:1.533 },
      { axis:"Dragon's Breath", skill:"Dragon's Breath x1", count:1, atkMult:1.3604, fixDmg:195.5, attriMult:2.041 },
      { axis:"Jadewind Shield", skill:"Jadewind Shield", count:1, atkMult:0.9271, fixDmg:257, attriMult:1.391 },
      { axis:"Unfading Flower", skill:"Spring Away", count:8.5, atkMult:1.0217, fixDmg:282, attriMult:1.533 },
      { axis:"Fan Combo", skill:"Fan Light 1–4", count:4, atkMult:1.023, fixDmg:138, attriMult:1.535 },
      { axis:"Fan Special", skill:"Fan Light 5", count:1, atkMult:1.705, fixDmg:230, attriMult:2.558 },
      { axis:"Fan Combo", skill:"Drunken Poet", count:5, atkMult:0.7016, fixDmg:100, attriMult:0.702 },
      { axis:"Jadewind Shield", skill:"Peak's Springless Silence", count:1, atkMult:1.2798, fixDmg:355, attriMult:1.920 },
      { axis:"", skill:"Wildfire Spark Proc", count:40, atkMult:0.2954, fixDmg:42, attriMult:0.295 },
    ],
    specialEntries: [
      { skill:"Morale Chant Lv6", count:2.508, atkMult:1, fixDmg:0, attriMult:1, isSpecial:true },
      { skill:"Wildfire Spark DoT", countFromTime:true, atkMult:0.276, fixDmg:0, attriMult:0, isSpecial:true },
    ],
    config: { morale:true, hawking:true, atkFood:true, qianshan:false, bow:"affinity", monsterDef:270, breakRatio:0, exhaustRatio:0.1 }
  },
  umber: {
    name: "Umber 85",
    subtitle: "Strategic Sword & Heavenquaker Spear",
    path: "Bellstrike – Umbra",
    rotationTime: 44,
    gradMax: 47962,
    defaultPanel: { minAtk: 638, maxAtk: 1897, precision: 0.983, criti: 0.558, dirCriti: 0.087, critiDmg: 0.5, affinity: 0.35, dirAffinity: 0, affinityDmg: 0.402, minAttri: 163, maxAttri: 327, phyPen: 11.2, physDmgBonus: 0, attriPen: 6.8, attriDmgBonus: 0.034, bossBoost: 0.05, attune: 0, dmgBoost: 0 },
    rotation: [
      { axis:"Sword Q", skill:"Inner Track Slash", count:3, atkMult:2.7205, fixDmg:749, attriMult:4.081 },
      { axis:"Spear Q", skill:"Sweep All (Full)", count:3, atkMult:2.1401, fixDmg:588, attriMult:3.210 },
      { axis:"Dragon's Breath Lv2", skill:"Dragon's Breath (Lv2)", count:3, atkMult:4.22, fixDmg:606, attriMult:5.580 },
      { axis:"Sword Normal", skill:"Strategic Sword Normals", count:12, atkMult:0.9808, fixDmg:198, attriMult:1.471 },
      { axis:"", skill:"Crisscrossing Swords", count:9, atkMult:0.6, fixDmg:0, attriMult:0.9 },
      { axis:"", skill:"Drifting Thrust (Quick)", count:5, atkMult:0.3744, fixDmg:65.71, attriMult:0.562 },
      { axis:"", skill:"Inner Balance Strike (Bleed Burst)", count:18, atkMult:2.4, fixDmg:0, attriMult:3.6 },
      { axis:"", skill:"Fivefold Bleed (5 stacks)", count:12, atkMult:0.33, fixDmg:0, attriMult:0.495 },
      { axis:"", skill:"Fivefold Bleed (4 stacks)", count:8, atkMult:0.264, fixDmg:0, attriMult:0.396 },
      { axis:"", skill:"Fivefold Bleed (2 stacks)", count:22, atkMult:0.165, fixDmg:0, attriMult:0.248 },
      { axis:"", skill:"Wildfire Spark Proc", count:66, atkMult:0.2954, fixDmg:42, attriMult:0.295 },
    ],
    specialEntries: [
      { skill:"Morale Chant Lv6", count:3.872, atkMult:1, fixDmg:0, attriMult:1, isSpecial:true },
      { skill:"Wildfire Spark DoT", countFromTime:true, atkMult:0.276, fixDmg:0, attriMult:0, isSpecial:true },
    ],
    config: { morale:true, hawking:true, atkFood:true, qianshan:false, bow:"affinity", monsterDef:270, breakRatio:0, exhaustRatio:0 }
  },
  twinblades: {
    name: "Twinblades 85",
    subtitle: "Infernal Twinblades & Mortal Rope Dart",
    path: "Bamboocut – Wind",
    rotationTime: 65.5,
    gradMax: 47962,
    defaultPanel: { minAtk: 867, maxAtk: 1669, precision: 0.983, criti: 0.711, dirCriti: 0.087, critiDmg: 0.5, affinity: 0.35, dirAffinity: 0, affinityDmg: 0.402, minAttri: 163, maxAttri: 327, phyPen: 11.2, physDmgBonus: 0, attriPen: 6.8, attriDmgBonus: 0.034, bossBoost: 0.05, attune: 0, dmgBoost: 0 },
    rotation: [
      { axis:"Rope Dart Q", skill:"Bladebound Thread", count:3, atkMult:0.1242, fixDmg:34, attriMult:0.186 },
      { axis:"Light Combo", skill:"Twinblades Light Combo", count:7, atkMult:1.9567, fixDmg:546, attriMult:2.935 },
      { axis:"", skill:"Twinblades Light 1–2", count:1, atkMult:0.8713, fixDmg:243, attriMult:1.307 },
      { axis:"", skill:"Twinblades Light Hit 1", count:2, atkMult:0.4205, fixDmg:117, attriMult:0.631 },
      { axis:"Rodent Rampage", skill:"Rodent Rampage Hits", count:133, atkMult:0.35, fixDmg:0, attriMult:0.525 },
      { axis:"Flamelash", skill:"Flamelash Light 1", count:13, atkMult:0.6472, fixDmg:180, attriMult:0.971 },
      { axis:"", skill:"Flamelash Light 2", count:13, atkMult:0.9012, fixDmg:250, attriMult:1.352 },
      { axis:"", skill:"Flamelash Light 3", count:13, atkMult:1.4455, fixDmg:401, attriMult:2.168 },
      { axis:"", skill:"Flamelash Light 4", count:5, atkMult:1.7358, fixDmg:481, attriMult:2.604 },
      { axis:"", skill:"Flamelash Light 5", count:3, atkMult:2.5342, fixDmg:702, attriMult:3.801 },
      { axis:"", skill:"Addled Mind", count:7, atkMult:1.3548, fixDmg:376, attriMult:2.032 },
      { axis:"", skill:"Flaming Meteor (5-hit)", count:2, atkMult:7.348, fixDmg:1550, attriMult:11.022 },
      { axis:"", skill:"Serene Breeze", count:2, atkMult:0.8718, fixDmg:425, attriMult:1.308 },
      { axis:"", skill:"Shadow Step", count:4, atkMult:2.0416, fixDmg:312, attriMult:3.062 },
    ],
    specialEntries: [
      { skill:"Morale Chant Lv6", count:5.764, atkMult:1, fixDmg:0, attriMult:1, isSpecial:true },
      { skill:"Echoes of Oblivion DoT", count:65.5, atkMult:0.0239, fixDmg:0, attriMult:0, isSpecial:true },
      { skill:"Echoes of Oblivion Burst", count:17, atkMult:2, fixDmg:0, attriMult:0, isSpecial:true },
      { skill:"Wildfire Spark DoT", countFromTime:true, atkMult:0.276, fixDmg:0, attriMult:0, isSpecial:true },
    ],
    config: { morale:true, hawking:true, atkFood:true, qianshan:false, bow:"affinity", monsterDef:270, breakRatio:0, exhaustRatio:0 }
  },
  moblade: {
    name: "Mo Blade 85",
    subtitle: "Thundercry Blade & Stormbreaker Spear",
    path: "Stonesplit – Might",
    rotationTime: 24.9,
    gradMax: 47962,
    defaultPanel: { minAtk: 653, maxAtk: 1637, precision: 1.003, criti: 0.58, dirCriti: 0.087, critiDmg: 0.5, affinity: 0.35, dirAffinity: 0, affinityDmg: 0.402, minAttri: 163, maxAttri: 327, phyPen: 11.2, physDmgBonus: 0, attriPen: 6.8, attriDmgBonus: 0.034, bossBoost: 0.05, attune: 0, dmgBoost: 0 },
    rotation: [
      { axis:"Breaker", skill:"Flaming Meteor (5-hit)", count:1, atkMult:7.348, fixDmg:1550, attriMult:11.022 },
      { axis:"Lv3 Charge", skill:"Galecloud Cleave (Lv3)", count:5, atkMult:7.2368, fixDmg:2002, attriMult:10.855 },
      { axis:"Guard", skill:"Galecloud Cleave Followup", count:5, atkMult:3.2929, fixDmg:462, attriMult:3.949 },
    ],
    specialEntries: [
      { skill:"Morale Chant Lv6", count:2.1912, atkMult:1, fixDmg:0, attriMult:1, isSpecial:true },
      { skill:"Wildfire Spark DoT", countFromTime:true, atkMult:0.276, fixDmg:0, attriMult:0, isSpecial:true },
    ],
    config: { morale:true, hawking:false, atkFood:true, qianshan:false, bow:"affinity", monsterDef:270, breakRatio:0, exhaustRatio:0 }
  },
  healer: {
    name: "Healer 85",
    subtitle: "Panacea Fan & Soulshade Umbrella",
    path: "Silkbind – Deluge",
    rotationTime: 2,
    gradMax: 47962,
    isHealer: true,
    defaultPanel: { minAtk: 1227, maxAtk: 1476, precision: 0.823, criti: 0.752, dirCriti: 0.046, critiDmg: 0.5, affinity: 0.35, dirAffinity: 0, affinityDmg: 0.402, minAttri: 163, maxAttri: 327, phyPen: 11.2, physDmgBonus: 0, attriPen: 6.8, attriDmgBonus: 0.034, bossBoost: 0, attune: 0, dmgBoost: 0 },
    rotation: [
      { axis:"", skill:"Emerald Dewtouch (Heavy Heal)", count:1, atkMult:6.7025, fixDmg:1966, attriMult:10.054 },
      { axis:"", skill:"Soulshade Passive Heal", count:2, atkMult:0.7721, fixDmg:199, attriMult:1.158 },
    ],
    specialEntries: [],
    config: { morale:false, hawking:false, atkFood:true, qianshan:false, bow:"affinity", monsterDef:270, breakRatio:0, exhaustRatio:0 }
  },
};

// ═══════════════════════════════════════════════════════════
// DAMAGE CALCULATION ENGINE
// ═══════════════════════════════════════════════════════════

function calcDamageExpectation(panel, skill, config) {
  const judgRes = panel.judgmentRes || BASE_STATS_85.judgmentRes;

  // Effective rates after judgment resistance reduction
  const realPrecision = Math.min(1, 0.65 + (panel.precision - 0.65) / (1 + judgRes));
  const realCriti     = Math.min(1, (panel.criti || 0) / (1 + judgRes));
  const dirCriti      = panel.dirCriti || 0;
  const realAffinity  = (panel.affinity || 0) / (1 + judgRes);
  const dirAffinity   = panel.dirAffinity || 0;

  // Hit zone distribution (mirrors Excel AK/AL/AM/AN formulas exactly)
  // Excel condition: IF((realCriti + realAffinity + dirCriti + dirAffinity) <= 1, ...)
  // TRUE branch: AK = precision × (realCriti + dirCriti)  — dirCriti still goes through precision
  // FALSE branch: AK = precision × (1 - realAffinity - dirAffinity)
  let effectiveCriti, effectiveAffinity, effectiveNormal, effectiveGraze;
  if (realCriti + realAffinity + dirCriti + dirAffinity <= 1) {
    effectiveCriti    = realPrecision * (realCriti + dirCriti);
    effectiveAffinity = realAffinity + dirAffinity;
    effectiveGraze    = (1 - realPrecision) * (1 - effectiveAffinity);
    effectiveNormal   = Math.max(0, 1 - effectiveCriti - effectiveAffinity - effectiveGraze);
  } else {
    effectiveCriti    = realPrecision * (1 - realAffinity - dirAffinity);
    effectiveAffinity = realAffinity + dirAffinity;
    effectiveGraze    = 0;
    effectiveNormal   = Math.max(0, 1 - effectiveCriti - effectiveAffinity);
  }

  // Per-zone damage multipliers
  const critiDmg    = panel.critiDmg || 0.5;
  const affinityDmg = panel.affinityDmg || 0.35;
  // affZoneMult: only affinityDmg (会意伤/ED column) applies inside the affinity hit zone
  const affZoneMult = 1 + affinityDmg;

  // Outer damage bonuses (applied to all hits, regardless of zone):
  // physDmgBonus (外伤增加/BW column): outer multiplier on ALL physical damage
  const physDmgBonus  = panel.physDmgBonus || 0;
  // attriDmgBonus (本系伤害加深/CG column): outer multiplier on ALL attribute damage
  const attriDmgBonus = panel.attriDmgBonus || 0;

  // General damage bonus (AO zone)
  // Morale chant (易水歌0) is a combat buff not in panel stats: +5% when active
  const dmgBoostA = (panel.dmgBoost || 0) + (panel.bossBoost || 0)
    + (config.exhaustRatio || 0) * 0.1
    + (config.breakRatio  || 0) * 0.25
    + (config.morale ? 0.05 : 0);

  // Penetration multipliers — Excel formula: (1 + pen/200), not /100
  // Hawking (飞隼4) adds +10 to physical penetration when active
  const phyPenVal    = (panel.phyPen || 0) + (config.hawking ? 10 : 0);
  const phyPenMult   = 1 + phyPenVal / 200;
  const attriPenVal  = panel.attriPen || 0;
  const attriPenMult = 1 + attriPenVal / 200;
  const attuneMult   = 1 + (panel.attune || 0);

  // Hawking (飞隼4) physical ATK amplification: +10% to physical ATK only (HA6=0.1 in Excel)
  const hawkAtkAmp = config.hawking ? 0.1 : 0;

  // ATK values net of monster defense.
  // Food+hawking (食物小攻-飞/食物大攻-飞) adds flat buffs to physical ATK before defense.
  const monsterDef  = config.monsterDef || 270;
  const foodMinBuff = (config.atkFood && config.hawking) ? 1200 / 11 : 0;
  const foodMaxBuff = (config.atkFood && config.hawking) ? 2400 / 11 : 0;
  const minAtk = Math.max(0, (panel.minAtk || 0) + foodMinBuff - monsterDef);
  const maxAtk = Math.max(0, (panel.maxAtk || 0) + foodMaxBuff - monsterDef);
  const avgAtk = minAtk >= maxAtk ? minAtk : (minAtk + maxAtk) / 2;

  // Physical ATK component (Excel Y6):
  // Affinity zone uses maxAtk; graze uses minAtk; crit and normal use avgAtk.
  // Hawking amplification (1+HA6) applies to physical ATK only, not attribute or fixed.
  const phyAtkDmg = (
    (effectiveCriti * (1 + critiDmg) + effectiveNormal) * avgAtk
    + effectiveAffinity * affZoneMult * maxAtk
    + effectiveGraze * minAtk
  ) * skill.atkMult * (1 + hawkAtkAmp);

  // Fixed damage component (Excel AC6):
  // Graze hits take full fixed damage — fixDmg has no ATK value to scale down, so no reduction.
  const fixDmgHit = (
    effectiveCriti * (1 + critiDmg)
    + effectiveNormal
    + effectiveAffinity * affZoneMult
    + effectiveGraze
  ) * (skill.fixDmg || 0);

  // Attribute ATK component (Excel AA6): same per-zone ATK logic as physical, no hawking
  const minAttri = panel.minAttri || 0;
  const maxAttri = panel.maxAttri || 0;
  const avgAttri = minAttri >= maxAttri ? minAttri : (minAttri + maxAttri) / 2;
  const attriAtkDmg = (
    (effectiveCriti * (1 + critiDmg) + effectiveNormal) * avgAttri
    + effectiveAffinity * affZoneMult * maxAttri
    + effectiveGraze * minAttri
  ) * (skill.attriMult || 0);

  const phyTotal   = (phyAtkDmg + fixDmgHit) * (1 + physDmgBonus) * (1 + dmgBoostA) * phyPenMult  * attuneMult;
  const attriTotal = attriAtkDmg               * (1 + attriDmgBonus) * (1 + dmgBoostA) * attriPenMult * attuneMult;

  return (phyTotal + attriTotal) * (skill.count || 0);
}

function calcBuildDPS(panel, buildKey) {
  const build = BUILDS[buildKey];
  if (!build) return { dps: 0, skills: [], total: 0 };
  const config = build.config;
  let skills = [];
  let total = 0;

  for (const entry of build.rotation) {
    const dmg = calcDamageExpectation(panel, entry, config);
    skills.push({ ...entry, totalDmg: dmg });
    total += dmg;
  }
  for (const entry of build.specialEntries) {
    const count = entry.countFromTime ? build.rotationTime : entry.count;
    const dmg = calcDamageExpectation(panel, { ...entry, count }, config);
    skills.push({ ...entry, count, totalDmg: dmg });
    total += dmg;
  }

  const dps = Math.floor(total / build.rotationTime);
  skills = skills.map(s => ({ ...s, pct: total > 0 ? s.totalDmg / total : 0 }));
  skills.sort((a, b) => b.totalDmg - a.totalDmg);
  return { dps, skills, total };
}

function calcStatPriority(panel, buildKey) {
  const base = calcBuildDPS(panel, buildKey);
  const priorities = [];
  const testStats = [
    { key: "power", label: "Power", value: 29.8 },
    { key: "agility", label: "Agility", value: 29.8 },
    { key: "momentum", label: "Momentum", value: 29.8 },
    { key: "minAtk", label: "Min Phys ATK", value: 47 },
    { key: "maxAtk", label: "Max Phys ATK", value: 47 },
    { key: "precision", label: "Precision Rate", value: 0.048 },
    { key: "criti", label: "Critical Rate", value: 0.054 },
    { key: "affinity", label: "Affinity Rate", value: 0.028 },
    { key: "minAttri", label: "Min Attribute ATK", value: 26.6 },
    { key: "maxAttri", label: "Max Attribute ATK", value: 26.6 },
    { key: "phyPen", label: "Physical Penetration", value: 6.6 },
    { key: "attriPen", label: "Attribute Penetration", value: 7.6 },
  ];

  for (const stat of testStats) {
    let modified = { ...panel };
    if (stat.key === "power") { modified.minAtk += stat.value * 0.225; modified.maxAtk += stat.value * 1.36; }
    else if (stat.key === "agility") { modified.minAtk += stat.value * 0.9; modified.criti += stat.value * 0.00076; }
    else if (stat.key === "momentum") { modified.maxAtk += stat.value * 0.9; modified.affinity += stat.value * 0.00038; }
    else { modified[stat.key] = (modified[stat.key] || 0) + stat.value; }
    const result = calcBuildDPS(modified, buildKey);
    const improvement = base.dps > 0 ? (result.dps - base.dps) / base.dps : 0;
    priorities.push({ ...stat, newDps: result.dps, improvement });
  }

  priorities.sort((a, b) => b.improvement - a.improvement);
  const minPositive = priorities.filter(p => p.improvement > 0).reduce((m, p) => Math.min(m, p.improvement), Infinity);
  return priorities.map(p => ({
    ...p,
    lead: p.improvement > 0 && minPositive > 0 ? p.improvement / minPositive - 1 : (p.improvement <= 0 ? -1 : 0),
  }));
}

// ═══════════════════════════════════════════════════════════
// THEMES
// ═══════════════════════════════════════════════════════════

const THEMES = {
  dusk: {
    name: "Dusk", btnSwatch: "#7c6aaa",
    bg: "linear-gradient(170deg, #080810 0%, #0c0c1a 40%, #12101e 100%)",
    headerOverlay: "rgba(40,30,60,.5)", headerBorder: "#1a1832",
    accent: "#7c6aaa", accentSoft: "#9988bb", accentBright: "#d4c4ee",
    accentMid: "#666680", accentDim: "#444460", accentDeep: "#252540",
    accentBtn: "linear-gradient(135deg, #2a2050, #3a2868)",
    text: "#c8c8e0",
    panelBg: "linear-gradient(135deg, #101020, #14122a)", panelBorder: "#1e1c38",
    dpsBg: "linear-gradient(135deg, #16122e, #1a1540)", dpsBorder: "#2a2550",
    inputBg: "#0a0a18", sectionBg: "#101020",
    footerBg: "#0a0a16", footerBorder: "#181830",
    dpsGrad: "linear-gradient(90deg, #d4a0ff, #ffd700)",
    barBg: "#1a1a2e", barSpecial: "#664422",
    goodColor: "#88cc88", badColor: "#ff6b6b",
    statGood: "#88dd88", statBad: "#ff6666", statBadBg: "#332222", statBadText: "#553333",
  },
  ocean: {
    name: "Ocean", btnSwatch: "#4a7aaa",
    bg: "linear-gradient(170deg, #080c14 0%, #0a1020 40%, #0e1428 100%)",
    headerOverlay: "rgba(20,40,70,.5)", headerBorder: "#162240",
    accent: "#4a7aaa", accentSoft: "#6699bb", accentBright: "#b0ccee",
    accentMid: "#4a7090", accentDim: "#2a4a60", accentDeep: "#1a2e44",
    accentBtn: "linear-gradient(135deg, #102040, #183060)",
    text: "#c0d4e8",
    panelBg: "linear-gradient(135deg, #0c1020, #0e1430)", panelBorder: "#182840",
    dpsBg: "linear-gradient(135deg, #0e1830, #101c40)", dpsBorder: "#1e3058",
    inputBg: "#08101c", sectionBg: "#0c1020",
    footerBg: "#080e18", footerBorder: "#142030",
    dpsGrad: "linear-gradient(90deg, #60c8ff, #00ffcc)",
    barBg: "#0e1a28", barSpecial: "#335544",
    goodColor: "#66ddaa", badColor: "#ff7766",
    statGood: "#66ddaa", statBad: "#ff7766", statBadBg: "#221818", statBadText: "#553333",
  },
  ember: {
    name: "Ember", btnSwatch: "#aa5522",
    bg: "linear-gradient(170deg, #100808 0%, #180c08 40%, #1c1008 100%)",
    headerOverlay: "rgba(60,25,10,.5)", headerBorder: "#2c1808",
    accent: "#aa5522", accentSoft: "#cc7744", accentBright: "#eebb88",
    accentMid: "#886644", accentDim: "#554433", accentDeep: "#332211",
    accentBtn: "linear-gradient(135deg, #301808, #482210)",
    text: "#e0c8a8",
    panelBg: "linear-gradient(135deg, #140c08, #1c1008)", panelBorder: "#2c1c10",
    dpsBg: "linear-gradient(135deg, #1c1008, #241408)", dpsBorder: "#3a2010",
    inputBg: "#100808", sectionBg: "#140c08",
    footerBg: "#0e0808", footerBorder: "#201408",
    dpsGrad: "linear-gradient(90deg, #ffaa44, #ffdd00)",
    barBg: "#1c1008", barSpecial: "#553300",
    goodColor: "#aacc66", badColor: "#ff7755",
    statGood: "#aacc66", statBad: "#ff7755", statBadBg: "#220808", statBadText: "#553322",
  },
  jade: {
    name: "Jade", btnSwatch: "#4a8855",
    bg: "linear-gradient(170deg, #080e08 0%, #0a120a 40%, #0e160e 100%)",
    headerOverlay: "rgba(20,45,20,.5)", headerBorder: "#162218",
    accent: "#4a8855", accentSoft: "#66aa77", accentBright: "#aaddbb",
    accentMid: "#4a7055", accentDim: "#2a4433", accentDeep: "#1a2e22",
    accentBtn: "linear-gradient(135deg, #102018, #183028)",
    text: "#c0dcc8",
    panelBg: "linear-gradient(135deg, #0c1410, #0e1814)", panelBorder: "#182c1e",
    dpsBg: "linear-gradient(135deg, #0e1c12, #102018)", dpsBorder: "#1e3828",
    inputBg: "#080e0a", sectionBg: "#0c1410",
    footerBg: "#080e08", footerBorder: "#141e14",
    dpsGrad: "linear-gradient(90deg, #66ffaa, #ccff44)",
    barBg: "#101c12", barSpecial: "#334422",
    goodColor: "#88dd88", badColor: "#ffaa66",
    statGood: "#88dd88", statBad: "#ffaa66", statBadBg: "#181c10", statBadText: "#446633",
  },
  dawn: {
    name: "Dawn", btnSwatch: "#f4edd8", light: true,
    bg: "linear-gradient(170deg, #faf6ee 0%, #f4edd8 40%, #ede4c8 100%)",
    headerOverlay: "rgba(160,130,60,.06)", headerBorder: "#d4c89c",
    accent: "#8b6010", accentSoft: "#7a5010", accentBright: "#3c2008",
    accentMid: "#806040", accentDim: "#a08060", accentDeep: "#ddd0a8",
    accentBtn: "linear-gradient(135deg, #d4c070, #c0a840)",
    text: "#2a1c08",
    panelBg: "linear-gradient(135deg, #f4ecd8, #ece0c0)", panelBorder: "#ccc090",
    dpsBg: "linear-gradient(135deg, #ece4c4, #e4d8a8)", dpsBorder: "#c0ac70",
    inputBg: "#fdf8f0", sectionBg: "#f4ecd8",
    footerBg: "#f0e8d0", footerBorder: "#d0c490",
    dpsGrad: "linear-gradient(90deg, #8b6010, #c84000)",
    barBg: "#ddd4b0", barSpecial: "#c09050",
    goodColor: "#2a6a2a", badColor: "#cc2020",
    statGood: "#1a5a1a", statBad: "#aa1010", statBadBg: "#f0d0d0", statBadText: "#883030",
  },
  sky: {
    name: "Sky", btnSwatch: "#deeaf6", light: true,
    bg: "linear-gradient(170deg, #eef4fa 0%, #deeaf6 40%, #d0e0f0 100%)",
    headerOverlay: "rgba(60,110,170,.06)", headerBorder: "#a8c4dc",
    accent: "#1a5c8c", accentSoft: "#144c78", accentBright: "#0a2844",
    accentMid: "#2a5c88", accentDim: "#5080a0", accentDeep: "#b8d4e8",
    accentBtn: "linear-gradient(135deg, #9cc4e0, #80b0d4)",
    text: "#081828",
    panelBg: "linear-gradient(135deg, #ddeaf6, #d0e2f0)", panelBorder: "#a4c4dc",
    dpsBg: "linear-gradient(135deg, #d0e4f4, #c4d8ec)", dpsBorder: "#90b8d8",
    inputBg: "#eef4f8", sectionBg: "#ddeaf6",
    footerBg: "#d8e8f4", footerBorder: "#acc8e0",
    dpsGrad: "linear-gradient(90deg, #1a5c8c, #0088cc)",
    barBg: "#c0d8ec", barSpecial: "#3888aa",
    goodColor: "#1a6020", badColor: "#c02020",
    statGood: "#145015", statBad: "#991010", statBadBg: "#f0d0d0", statBadText: "#883030",
  },
};

// ═══════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════

const PANEL_FIELDS = [
  { key: "minAtk", label: "Min Physical ATK", step: 1 },
  { key: "maxAtk", label: "Max Physical ATK", step: 1 },
  { key: "precision", label: "Precision Rate", step: 0.001, pct: true },
  { key: "criti", label: "Critical Rate", step: 0.001, pct: true },
  { key: "dirCriti", label: "Direct Critical Rate", step: 0.001, pct: true },
  { key: "critiDmg", label: "Critical DMG Bonus", step: 0.01, pct: true },
  { key: "affinity", label: "Affinity Rate", step: 0.001, pct: true },
  { key: "dirAffinity", label: "Direct Affinity Rate", step: 0.001, pct: true },
  { key: "affinityDmg", label: "Affinity DMG Bonus", step: 0.01, pct: true },
  { key: "minAttri", label: "Min Attribute ATK", step: 1 },
  { key: "maxAttri", label: "Max Attribute ATK", step: 1 },
  { key: "phyPen", label: "Physical Penetration", step: 0.1 },
  { key: "attriPen", label: "Attribute Penetration", step: 0.1 },
  { key: "attriDmgBonus", label: "Attribute DMG Bonus", step: 0.001, pct: true },
  { key: "bossBoost", label: "Boss DMG Bonus", step: 0.01, pct: true },
  { key: "attune", label: "Attunement", step: 0.01, pct: true },
  { key: "dmgBoost", label: "DMG Bonus", step: 0.01, pct: true },
];

function BarChart({ value, max, color, bg = "#1a1a2e" }) {
  const w = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div style={{ width: "100%", height: 6, background: bg, borderRadius: 3, overflow: "hidden" }}>
      <div style={{ width: `${w}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.4s ease" }} />
    </div>
  );
}

function GradMeter({ value, t }) {
  const pct = Math.min(100, Math.max(0, value * 100));
  const hue = pct * 1.2;
  return (
    <div style={{ textAlign: "center", margin: "12px 0" }}>
      <div style={{ fontSize: 11, color: t.accentDim, marginBottom: 4, letterSpacing: 1 }}>GRADUATION DEGREE</div>
      <div style={{ position: "relative", width: "100%", height: 22, background: t.accentDeep, borderRadius: 11, overflow: "hidden", border: `1px solid ${t.panelBorder}` }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: `linear-gradient(90deg, hsl(${hue},70%,38%), hsl(${hue},80%,52%))`,
          borderRadius: 11, transition: "width 0.6s ease",
          boxShadow: `0 0 10px hsl(${hue},70%,45%)`
        }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,.8)" }}>
          {(pct).toFixed(1)}%
        </div>
      </div>
    </div>
  );
}

export default function WWMCalculator() {
  const [buildKey, setBuildKey] = useState("nameless");
  const [panel, setPanel] = useState({ ...BUILDS.nameless.defaultPanel });
  const [showPriority, setShowPriority] = useState(false);
  const [themeKey, setThemeKey] = useState("ocean");
  const t = THEMES[themeKey];

  const handleBuildChange = useCallback((key) => {
    setBuildKey(key);
    setPanel({ ...BUILDS[key].defaultPanel });
    setShowPriority(false);
  }, []);

  const handlePanelChange = useCallback((key, val) => {
    setPanel(prev => ({ ...prev, [key]: parseFloat(val) || 0 }));
  }, []);

  const build = BUILDS[buildKey];
  const result = useMemo(() => calcBuildDPS(panel, buildKey), [panel, buildKey]);
  const priorities = useMemo(() => showPriority ? calcStatPriority(panel, buildKey) : [], [panel, buildKey, showPriority]);
  const gradDegree = build.gradMax > 0 ? result.dps / build.gradMax : 0;
  const critiAffinity = useMemo(() => {
    const jr = panel.judgmentRes || 0.15;
    return (panel.criti || 0) / (1 + jr) + (panel.affinity || 0) / (1 + jr) + (panel.dirCriti || 0) + (panel.dirAffinity || 0);
  }, [panel]);

  const maxSkillDmg = result.skills.length > 0 ? Math.max(...result.skills.map(s => s.totalDmg)) : 1;

  return (
    <div style={{
      minHeight: "100vh",
      background: t.bg,
      color: t.text,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      fontSize: 17,
    }}>
      {/* Header */}
      <div style={{
        padding: "28px 24px 16px",
        background: `linear-gradient(180deg, ${t.headerOverlay} 0%, transparent 100%)`,
        borderBottom: `1px solid ${t.headerBorder}`,
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: 2, color: t.accentBright }}>
            Where Winds Meet · Tuning Tool
          </h1>
          <div style={{ fontSize: 13, color: t.accentMid, marginTop: 4, letterSpacing: 1 }}>
            LV85 DPS CALCULATOR
          </div>
        </div>
        {/* Theme Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 6 }}>
          <span style={{ fontSize: 11, color: t.accentMid, letterSpacing: 1 }}>THEME</span>
          {Object.entries(THEMES).map(([key, th]) => {
            const isActive = themeKey === key;
            return (
              <button key={key} onClick={() => setThemeKey(key)} title={th.name} style={{
                width: 22, height: 22, borderRadius: "50%",
                background: th.btnSwatch,
                border: `2px solid ${isActive ? t.text : th.light ? th.accent : "transparent"}`,
                cursor: "pointer", padding: 0,
                boxShadow: isActive ? `0 0 8px ${th.accent}` : "none",
                transition: "all .2s",
              }} />
            );
          })}
        </div>
      </div>

      {/* Build Selector */}
      <div style={{ padding: "14px 24px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {Object.entries(BUILDS).map(([key, b]) => (
          <button key={key} onClick={() => handleBuildChange(key)} style={{
            padding: "8px 18px", borderRadius: 6, border: "1px solid",
            borderColor: buildKey === key ? t.accent : t.accentDeep,
            background: buildKey === key ? t.accentBtn : "transparent",
            color: buildKey === key ? t.accentBright : t.accentMid,
            fontSize: 13, fontWeight: buildKey === key ? 700 : 400,
            cursor: "pointer", transition: "all .2s",
            boxShadow: buildKey === key ? `0 0 12px ${t.accent}66` : "none",
          }}>
            {b.name}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ padding: "0 24px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 1300 }}>

        {/* LEFT: Panel Input */}
        <div style={{
          background: t.panelBg,
          border: `1px solid ${t.panelBorder}`, borderRadius: 10, padding: 20,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.accentSoft, marginBottom: 4, letterSpacing: 1 }}>
            YOUR PANEL
          </div>
          <div style={{ fontSize: 14, color: t.accentSoft, marginBottom: 4 }}>
            {build.subtitle}
          </div>
          <div style={{ fontSize: 13, color: t.accentDim, marginBottom: 8 }}>
            {build.path}
          </div>
          <div style={{ fontSize: 13, color: t.accentDim, marginBottom: 12 }}>
            Crit + Affinity: <span style={{ color: critiAffinity > 1 ? t.badColor : t.goodColor }}>{(critiAffinity * 100).toFixed(1)}%</span>
            &nbsp;|&nbsp;Rotation: {build.rotationTime}s
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 14px" }}>
            {PANEL_FIELDS.map(f => (
              <label key={f.key} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 12, color: t.accentMid, letterSpacing: 0.5 }}>
                  {f.label}
                </span>
                <input
                  type="number"
                  step={f.step}
                  value={panel[f.key] ?? 0}
                  onChange={e => handlePanelChange(f.key, e.target.value)}
                  style={{
                    background: t.inputBg, border: `1px solid ${t.accentDeep}`, borderRadius: 4,
                    color: t.text, padding: "8px 10px", fontSize: 15, fontWeight: 600,
                    outline: "none", width: "100%", boxSizing: "border-box",
                  }}
                />
              </label>
            ))}
          </div>
        </div>

        {/* RIGHT: Results */}
        <div>
          {/* DPS Display */}
          <div style={{
            background: t.dpsBg,
            border: `1px solid ${t.dpsBorder}`, borderRadius: 10, padding: 20, marginBottom: 16,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 12, color: t.accentSoft, letterSpacing: 2, fontWeight: 600 }}>
              {build.isHealer ? "HEALING PER SECOND" : "DAMAGE PER SECOND"}
            </div>
            <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: 2, lineHeight: 1.1, margin: "4px 0", color: t.accentBright }}>
              {result.dps.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: t.accentDim }}>
              Total: {Math.floor(result.total).toLocaleString()} over {build.rotationTime}s rotation
            </div>
            <GradMeter value={gradDegree} t={t} />
          </div>

          {/* Stat Priority Toggle */}
          <button onClick={() => setShowPriority(!showPriority)} style={{
            width: "100%", padding: "10px", marginBottom: 16, borderRadius: 6,
            background: showPriority ? t.accentBtn : "transparent",
            border: `1px solid ${t.accentDeep}`, color: t.accentSoft, cursor: "pointer",
            fontSize: 13, fontWeight: 600, letterSpacing: 1,
          }}>
            {showPriority ? "▼" : "▶"} STAT PRIORITY
          </button>

          {showPriority && (
            <div style={{
              background: t.sectionBg, border: `1px solid ${t.panelBorder}`,
              borderRadius: 10, padding: 16, marginBottom: 16,
            }}>
              {priorities.map((p, i) => {
                const isGood = p.improvement > 0;
                return (
                  <div key={p.key} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                      <span style={{ color: isGood ? t.text : t.accentDim }}>
                        <span style={{ color: t.accentMid, marginRight: 4, fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                        {p.label}
                      </span>
                      <span style={{ color: isGood ? t.statGood : t.statBad, fontWeight: 700, fontSize: 13 }}>
                        {isGood ? "+" : ""}{(p.improvement * 100).toFixed(2)}%
                        {isGood && p.lead > 0 && <span style={{ color: t.accentMid, fontWeight: 400 }}> (lead {p.lead.toFixed(1)})</span>}
                        {!isGood && <span style={{ color: t.statBadText }}> waste</span>}
                      </span>
                    </div>
                    <BarChart
                      value={Math.max(0, p.improvement)}
                      max={priorities[0]?.improvement || 1}
                      color={isGood ? `hsl(${150 - i * 12}, 60%, 45%)` : t.statBadBg}
                      bg={t.barBg}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Skill Breakdown */}
          <div style={{
            background: t.sectionBg, border: `1px solid ${t.panelBorder}`,
            borderRadius: 10, padding: 16,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.accentSoft, marginBottom: 10, letterSpacing: 1 }}>
              SKILL BREAKDOWN
            </div>
            <div style={{ maxHeight: 460, overflowY: "auto" }}>
              {result.skills.filter(s => s.totalDmg > 0).map((s, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
                    <span>
                      <span style={{ color: t.accentSoft }}>{s.skill}</span>
                      <span style={{ color: t.accentDim, marginLeft: 4 }}>x{typeof s.count === 'number' ? (Number.isInteger(s.count) ? s.count : s.count.toFixed(1)) : s.count}</span>
                    </span>
                    <span style={{ display: "flex", gap: 10 }}>
                      <span style={{ color: t.text, fontWeight: 600 }}>{Math.floor(s.totalDmg).toLocaleString()}</span>
                      <span style={{ color: t.accentMid, width: 44, textAlign: "right" }}>{(s.pct * 100).toFixed(1)}%</span>
                    </span>
                  </div>
                  <BarChart
                    value={s.totalDmg}
                    max={maxSkillDmg}
                    color={s.isSpecial ? t.barSpecial : `hsl(${250 - i * 8}, 55%, 50%)`}
                    bg={t.barBg}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Damage Formula Reference */}
      <div style={{
        margin: "0 24px 32px", padding: 16,
        background: t.footerBg, border: `1px solid ${t.footerBorder}`, borderRadius: 10,
        fontSize: 12, color: t.accentDim, lineHeight: 1.6,
      }}>
        <div style={{ fontWeight: 700, color: t.accentMid, marginBottom: 4, letterSpacing: 1 }}>DAMAGE FORMULA</div>
        <div>Damage = Raw DMG x Crit Zone x DMG Bonus x Penetration x Attunement x Attribute DMG Bonus</div>
        <div>Raw DMG = (Phys ATK - Enemy DEF) x ATK Multiplier + Fixed DMG + Attribute ATK x Attribute Multiplier</div>
        <div>Crit Zone = P(crit) x (1 + Crit DMG Bonus) + P(affinity) x (1 + Affinity DMG Bonus) + P(normal) x 1 + P(abrasion) x 0.5</div>
        <div style={{ marginTop: 4 }}>
          Five Dimensions: 1 Power = 0.225 Min + 1.36 Max Phys ATK | 1 Agility = 0.9 Min Phys ATK + 0.076% Crit Rate | 1 Momentum = 0.9 Max Phys ATK + 0.038% Affinity Rate
        </div>
        <div style={{ marginTop: 4 }}>
          Based on yoka's spreadsheet · Rotation data from Lv85 version · Simplified buff interactions
        </div>
      </div>
    </div>
  );
}

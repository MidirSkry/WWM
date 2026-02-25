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
    assumptions: [
      "Buffs: Morale Chant Lv6, Hawking (飞隼4), ATK Food, Qianshan",
      "Rotation: Xiao loop → Vagrant Sword charges → Legion Crusher → Shooting Star",
      "10% Exhaust uptime, Monster DEF 270",
    ],

    defaultPanel: { minAtk: 570, maxAtk: 1800, precision: 0.983, criti: 0.7, dirCriti: 0.087, critiDmg: 0.5, affinity: 0.35, dirAffinity: 0, affinityDmg: 0.582, minAttri: 163, maxAttri: 327, phyPen: 11.2, physDmgBonus: 0, attriPen: 6.8, attriDmgBonus: 0.034, bossBoost: 0, attune: 0, dmgBoost: 0.265 },
    rotation: [
      { axis:"Spear Q",           skill:"Xiao – Shooting Star (5-hit)",  count:1, atkMult:7.3480,  fixDmg:1550, attriMult:11.0220, ak:0.653611, al:0.304348, am:0,     an:0.042042, ao:0.325, ed:0.582, fk:163, fr:327 },
      { axis:"Xiao Blow",         skill:"Vagrant Sword (Lv2 Charge)",     count:1, atkMult:4.7037,  fixDmg:1300, attriMult:7.0556,  ak:0.653611, al:0.334348, am:-0.03, an:0.042042, ao:0.742, ed:0.492, fk:313, fr:477 },
      { axis:"Sword Qi x5",       skill:"Vagrant Sword (Lv2 Charge)",     count:1, atkMult:4.7037,  fixDmg:1300, attriMult:7.0556,  ak:0.653611, al:0.334348, am:-0.03, an:0.042042, ao:0.855, ed:0.492, fk:313, fr:477 },
      { axis:"Spear Q",           skill:"Vagrant Sword (Lv2 Charge)",     count:1, atkMult:4.7037,  fixDmg:1300, attriMult:7.0556,  ak:0.653611, al:0.334348, am:-0.03, an:0.042042, ao:0.885, ed:0.672, fk:313, fr:477 },
      { axis:"Sword Qi x4",       skill:"Vagrant Sword (Lv2 Charge)",     count:1, atkMult:4.7037,  fixDmg:1300, attriMult:7.0556,  ak:0.653611, al:0.334348, am:-0.03, an:0.042042, ao:0.925, ed:0.672, fk:313, fr:477 },
      { axis:"Legion Crusher",    skill:"Vagrant Sword (Lv2 Charge)",     count:1, atkMult:4.7037,  fixDmg:1300, attriMult:7.0556,  ak:0.653611, al:0.334348, am:-0.03, an:0.042042, ao:0.925, ed:0.672, fk:313, fr:477 },
      { axis:"Sword Qi",          skill:"Vagrant Sword (Lv2 Charge)",     count:1, atkMult:4.7037,  fixDmg:1300, attriMult:7.0556,  ak:0.653611, al:0.304348, am:0,     an:0.042042, ao:0.925, ed:0.672, fk:313, fr:477 },
      { axis:"Spear Q",           skill:"Vagrant Sword (Lv2 Charge)",     count:2, atkMult:4.7037,  fixDmg:1300, attriMult:7.0556,  ak:0.653611, al:0.304348, am:0,     an:0.042042, ao:0.725, ed:0.672, fk:313, fr:477 },
      { axis:"Sword Qi x4",       skill:"Vagrant Sword (Lv2 Charge)",     count:5, atkMult:4.7037,  fixDmg:1300, attriMult:7.0556,  ak:0.653611, al:0.304348, am:0,     an:0.042042, ao:0.925, ed:0.672, fk:313, fr:477 },
      { axis:"Legion Crusher",    skill:"Vagrant Sword (Lv2 Charge)",     count:1, atkMult:4.7037,  fixDmg:1300, attriMult:7.0556,  ak:0.653611, al:0.334348, am:-0.03, an:0.042042, ao:0.725, ed:0.672, fk:313, fr:477 },
      { axis:"Sword Qi",          skill:"Vagrant Sword (Lv2 Charge)",     count:1, atkMult:4.7037,  fixDmg:1300, attriMult:7.0556,  ak:0.653611, al:0.304348, am:0,     an:0.042042, ao:0.525, ed:0.672, fk:313, fr:477 },
      { axis:"Spear Q",           skill:"Legion Crusher",                 count:3, atkMult:7.1024,  fixDmg:1069, attriMult:10.6536, ak:0.653611, al:0.304348, am:0,     an:0.042042, ao:0.125, ed:0.582, fk:163, fr:327 },
      { axis:"Sword Qi x2",       skill:"Xiao – Shooting Star (Full)",    count:1, atkMult:12.7366, fixDmg:2690, attriMult:19.1049, ak:0.653611, al:0.304348, am:0,     an:0.042042, ao:0.325, ed:0.582, fk:163, fr:327 },
      { axis:"Sword Q1",          skill:"Daunting Strike (Q1)",           count:1, atkMult:1.0253,  fixDmg:283,  attriMult:1.5379,  ak:0.653611, al:0.304348, am:0,     an:0.042042, ao:0.125, ed:0.582, fk:313, fr:477 },
      { axis:"Xiao Blow (Full)",  skill:"Vagrant Sword (Lv2 Charge)",     count:5, atkMult:4.7037,  fixDmg:1300, attriMult:7.0556,  ak:0.653611, al:0.334348, am:-0.03, an:0.042042, ao:0.725, ed:0.672, fk:313, fr:477 },
      { axis:"Sword Qi x2",       skill:"Vagrant Sword (Lv2 Charge)",     count:4, atkMult:4.7037,  fixDmg:1300, attriMult:7.0556,  ak:0.653611, al:0.334348, am:-0.03, an:0.042042, ao:0.525, ed:0.672, fk:313, fr:477 },
    ],
    specialEntries: [
      { skill:"Morale Chant Lv6",   count:5.6584,        atkMult:1,     fixDmg:0, attriMult:1, isSpecial:true, ak:0.653611, al:0.304348, am:0, an:0.042042, ao:0.125, ed:0.402, fk:163, fr:327 },
      { skill:"Wildfire Spark DoT", countFromTime:true,  atkMult:0.276, fixDmg:0, attriMult:0, isSpecial:true, ak:0,        al:0,        am:1, an:0,        ao:0.125, ed:0.402, fk:163, fr:327 },
    ],
    config: { morale:true, hawking:true, atkFood:true, qianshan:true, bow:"affinity", monsterDef:270, breakRatio:0, exhaustRatio:0.1 }
  },
  jade: {
    name: "Jade 85",
    subtitle: "Vernal Umbrella & Inkwell Fan",
    path: "Silkbind – Jade",
    rotationTime: 28.5,
    assumptions: [
      "Buffs: Morale Chant Lv6, Hawking (飞隼4 17.5%), ATK Food",
      "Rotation: Fan Light combos → Spring Sorrow → Spring Away → Drunken Poet (3 cycles)",
      "10% Exhaust uptime, Monster DEF 270",
    ],

    defaultPanel: { minAtk: 891, maxAtk: 1796, precision: 0.983, criti: 0.7, dirCriti: 0.087, critiDmg: 0.5, affinity: 0.35, dirAffinity: 0, affinityDmg: 0.350, minAttri: 163, maxAttri: 327, phyPen: 16.3, physDmgBonus: 0, attriPen: 5.1, attriDmgBonus: 0.025, bossBoost: 0, attune: 0, dmgBoost: 0.745 },
    rotation: [
      { axis:"Jadewind Shield",    skill:"Fan Light Charge 1",         count:1,   atkMult:1.9004, fixDmg:178,   attriMult:2.8506, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:0.805, ed:0.350, fk:250, fr:350, dfBonus:0.035 },
      { axis:"Unfading Flower",    skill:"Spring Sorrow (Accel)",      count:1,   atkMult:2.3397, fixDmg:648,   attriMult:3.5095, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:0.805, ed:0.350, fk:250, fr:350, dfBonus:0.275 },
      { axis:"Spring Sorrow x3",   skill:"Spring Sorrow (Accel)",      count:2,   atkMult:2.3397, fixDmg:648,   attriMult:3.5095, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:1.005, ed:0.350, fk:250, fr:350, dfBonus:0.275 },
      { axis:"Unfading Flower",    skill:"Spring Away",                count:1.5, atkMult:1.0217, fixDmg:282,   attriMult:1.5326, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:1.005, ed:0.350, fk:250, fr:350, dfBonus:0.275 },
      { axis:"喷火1下",              skill:"喷火1下",         count:1,   atkMult:1.3604, fixDmg:195.5, attriMult:2.0406, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:0.305, ed:0.350, fk:100, fr:200, dfBonus:0.035 },
      { axis:"Jadewind Shield",    skill:"Jadewind Shield",            count:1,   atkMult:0.9271, fixDmg:257,   attriMult:1.3906, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:0.305, ed:0.350, fk:250, fr:350, dfBonus:0.035 },
      { axis:"Unfading Flower",    skill:"Spring Away",                count:8.5, atkMult:1.0217, fixDmg:282,   attriMult:1.5326, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:1.005, ed:0.350, fk:250, fr:350, dfBonus:0.275 },
      { axis:"Fan Combo",          skill:"Fan Light 1–4",              count:4,   atkMult:1.0230, fixDmg:138,   attriMult:1.5345, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:0.305, ed:0.350, fk:100, fr:200, dfBonus:0.035 },
      { axis:"Fan Special",        skill:"Fan Light 5",                count:1,   atkMult:1.7050, fixDmg:230,   attriMult:2.5575, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:1.105, ed:0.350, fk:100, fr:200, dfBonus:0.035 },
      { axis:"Fan Combo",          skill:"Drunken Poet",               count:5,   atkMult:0.7016, fixDmg:100,   attriMult:0.7016, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:0.305, ed:0.350, fk:100, fr:200, dfBonus:0.035 },
      { axis:"Jadewind Shield",    skill:"Peak's Springless Silence",  count:1,   atkMult:1.2798, fixDmg:355,   attriMult:1.9197, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:0.305, ed:0.350, fk:250, fr:350, dfBonus:0.035 },
      { axis:"Fan Combo",          skill:"Fan Light 1–4",              count:4,   atkMult:1.0230, fixDmg:138,   attriMult:1.5345, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:0.305, ed:0.350, fk:100, fr:200, dfBonus:0.035 },
      { axis:"Fan Special",        skill:"Fan Light 5",                count:1,   atkMult:1.7050, fixDmg:230,   attriMult:2.5575, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:0.305, ed:0.350, fk:100, fr:200, dfBonus:0.035 },
      { axis:"Fan Combo",          skill:"Drunken Poet",               count:5,   atkMult:0.7016, fixDmg:100,   attriMult:0.7016, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:0.305, ed:0.350, fk:100, fr:200, dfBonus:0.035 },
      { axis:"Jadewind Shield",    skill:"Jadewind Shield",            count:1,   atkMult:0.9271, fixDmg:257,   attriMult:1.3906, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:0.305, ed:0.350, fk:250, fr:350, dfBonus:0.035 },
      { axis:"",                   skill:"Spring Sorrow (Accel)",      count:2,   atkMult:2.3397, fixDmg:648,   attriMult:3.5095, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:0.305, ed:0.350, fk:250, fr:350, dfBonus:0.275 },
      { axis:"Unfading Flower",    skill:"Spring Away",                count:7,   atkMult:1.0217, fixDmg:282,   attriMult:1.5326, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:1.005, ed:0.350, fk:250, fr:350, dfBonus:0.275 },
      { axis:"",                   skill:"Spring Away",                count:2,   atkMult:1.0217, fixDmg:282,   attriMult:1.5326, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:1.005, ed:0.350, fk:250, fr:350, dfBonus:0.275 },
      { axis:"",                   skill:"Fan Light Charge 1",         count:1,   atkMult:1.9004, fixDmg:178,   attriMult:2.8506, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:0.805, ed:0.350, fk:250, fr:350, dfBonus:0.035 },
      { axis:"Fan Combo",          skill:"Fan Light 1–4",              count:4,   atkMult:1.0230, fixDmg:138,   attriMult:1.5345, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:0.305, ed:0.350, fk:100, fr:200, dfBonus:0.035 },
      { axis:"Fan Special",        skill:"Fan Light 5",                count:1,   atkMult:1.7050, fixDmg:230,   attriMult:2.5575, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:1.105, ed:0.350, fk:100, fr:200, dfBonus:0.035 },
      { axis:"Fan Combo",          skill:"Drunken Poet",               count:5,   atkMult:0.7016, fixDmg:100,   attriMult:0.7016, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:0.305, ed:0.350, fk:100, fr:200, dfBonus:0.035 },
      { axis:"",                   skill:"Wildfire Spark Proc",        count:27,  atkMult:0.2954, fixDmg:42,    attriMult:0.2954, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:0.305, ed:0.350, fk:100, fr:200, dfBonus:0.035 },
      { axis:"",                   skill:"Wildfire Spark Proc",        count:13,  atkMult:0.2954, fixDmg:42,    attriMult:0.2954, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:0.305, ed:0.350, fk:100, fr:200, dfBonus:0.035 },
    ],
    specialEntries: [
      { skill:"Morale Chant Lv6",   count:2.508,        atkMult:1,     fixDmg:0, attriMult:1, isSpecial:true, ak:0.653651, al:0.096522, am:0.19523, an:0.054602, ao:0.305, ed:0.350, fk:100, fr:200, dfBonus:0.035 },
      { skill:"Wildfire Spark DoT", countFromTime:true, atkMult:0.276, fixDmg:0, attriMult:0, isSpecial:true, ak:0,        al:0,        am:1,       an:0,        ao:0.305, ed:0.350, fk:100, fr:200, dfBonus:0.035 },
    ],
    config: { morale:true, hawking:true, hawkAtkAmp:0.175, atkFood:true, qianshan:false, bow:"affinity", monsterDef:270, breakRatio:0, exhaustRatio:0.1 }
  },
  umber: {
    name: "Umber 85",
    subtitle: "Strategic Sword & Heavenquaker Spear",
    path: "Bellstrike – Umbra",
    rotationTime: 44,
    assumptions: [
      "Buffs: Morale Chant Lv6, Hawking (飞隼4), ATK Food",
      "Rotation: 3x (Sword Q → Spear Q → Normals → Crisscrossing) → Blood Burst + Bleed Ticks",
      "Monster DEF 270",
    ],

    defaultPanel: { minAtk: 638, maxAtk: 1897, precision: 0.983, criti: 0.558, dirCriti: 0.087, critiDmg: 0.5, affinity: 0.35, dirAffinity: 0, affinityDmg: 0.402, minAttri: 163, maxAttri: 327, phyPen: 16.8, physDmgBonus: 0, attriPen: 6.8, attriDmgBonus: 0.034, bossBoost: 0, attune: 0, dmgBoost: 0.025 },
    rotation: [
      { axis:"Sword Q",              skill:"Inner Track Slash",                count:1,  atkMult:2.7205, fixDmg:749,  attriMult:4.0808, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:0.075, ed:0.402, fk:313, fr:477 },
      { axis:"Spear Q",              skill:"Sweep All (Full)",                 count:1,  atkMult:2.1401, fixDmg:588,  attriMult:3.2102, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:0.175, ed:0.402, fk:313, fr:477 },
      { axis:"",                     skill:"Drifting Thrust (Quick)",          count:5,  atkMult:0.3744, fixDmg:65.7, attriMult:0.5616, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:0.375, ed:0.502, fk:313, fr:477 },
      { axis:"喷火2段",                skill:"喷火2段",           count:1,  atkMult:4.2200, fixDmg:606,  attriMult:5.5804, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:0.375, ed:0.502, fk:163, fr:327 },
      { axis:"",                     skill:"Wildfire Spark Proc",             count:22, atkMult:0.2954, fixDmg:42,   attriMult:0.2954, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:1.075, ed:0.802, fk:163, fr:327 },
      { axis:"Sword Normal",         skill:"Strategic Sword Normals",         count:4,  atkMult:0.9808, fixDmg:198,  attriMult:1.4712, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:0.375, ed:0.502, fk:313, fr:477 },
      { axis:"",                     skill:"Crisscrossing Swords",            count:3,  atkMult:0.6000, fixDmg:0,    attriMult:0.9000, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:0.375, ed:0.502, fk:313, fr:477 },
      { axis:"Sword Q",              skill:"Inner Track Slash",                count:1,  atkMult:2.7205, fixDmg:749,  attriMult:4.0808, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:0.375, ed:0.502, fk:313, fr:477 },
      { axis:"Spear Q",              skill:"Sweep All (Full)",                 count:1,  atkMult:2.1401, fixDmg:588,  attriMult:3.2102, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:0.475, ed:0.502, fk:313, fr:477 },
      { axis:"喷火2段",                skill:"喷火2段",           count:1,  atkMult:4.2200, fixDmg:606,  attriMult:5.5804, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:0.375, ed:0.502, fk:163, fr:327 },
      { axis:"",                     skill:"Wildfire Spark Proc",             count:22, atkMult:0.2954, fixDmg:42,   attriMult:0.2954, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:1.075, ed:0.802, fk:163, fr:327 },
      { axis:"Sword Normal",         skill:"Strategic Sword Normals",         count:4,  atkMult:0.9808, fixDmg:198,  attriMult:1.4712, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:0.375, ed:0.502, fk:313, fr:477 },
      { axis:"",                     skill:"Crisscrossing Swords",            count:3,  atkMult:0.6000, fixDmg:0,    attriMult:0.9000, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:0.375, ed:0.502, fk:313, fr:477 },
      { axis:"Sword Q",              skill:"Inner Track Slash",                count:1,  atkMult:2.7205, fixDmg:749,  attriMult:4.0808, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:0.375, ed:0.502, fk:313, fr:477 },
      { axis:"Spear Q",              skill:"Sweep All (Full)",                 count:1,  atkMult:2.1401, fixDmg:588,  attriMult:3.2102, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:0.475, ed:0.502, fk:313, fr:477 },
      { axis:"喷火2段",                skill:"喷火2段",           count:1,  atkMult:4.2200, fixDmg:606,  attriMult:5.5804, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:0.375, ed:0.502, fk:163, fr:327 },
      { axis:"",                     skill:"Wildfire Spark Proc",             count:22, atkMult:0.2954, fixDmg:42,   attriMult:0.2954, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:1.075, ed:0.802, fk:163, fr:327 },
      { axis:"Sword Normal",         skill:"Strategic Sword Normals",         count:4,  atkMult:0.9808, fixDmg:198,  attriMult:1.4712, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:0.375, ed:0.502, fk:313, fr:477 },
      { axis:"",                     skill:"Crisscrossing Swords",            count:3,  atkMult:0.6000, fixDmg:0,    attriMult:0.9000, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:0.375, ed:0.502, fk:313, fr:477 },
      { axis:"",                     skill:"Blood Burst (血爆)",                count:18, atkMult:2.4000, fixDmg:0, attriMult:3.6000, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:1.025, ed:0.502, fk:163, fr:327, blBonus:15, cbBonus:15 },
      { axis:"",                     skill:"Bleed Tick (5 stacks)",           count:12, atkMult:0.3300, fixDmg:0,    attriMult:0.4950, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:1.075, ed:0.802, fk:163, fr:327, blBonus:15, cbBonus:15 },
      { axis:"",                     skill:"Bleed Tick (2 stacks)",           count:22, atkMult:0.1650, fixDmg:0,    attriMult:0.2475, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:1.075, ed:0.802, fk:163, fr:327, blBonus:15, cbBonus:15 },
      { axis:"",                     skill:"Bleed Tick (4 stacks)",           count:8,  atkMult:0.2640, fixDmg:0,    attriMult:0.3960, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:1.075, ed:0.802, fk:163, fr:327, blBonus:15, cbBonus:15 },
      { axis:"",                     skill:"Crisscrossing Swords (Affinity)", count:3,  atkMult:0.6000, fixDmg:0,    attriMult:0.9000, ak:0,        al:1,        am:0,       an:0,        ao:0.375, ed:0.502, fk:313, fr:477 },
    ],
    specialEntries: [
      { skill:"Morale Chant Lv6",   count:3.872,        atkMult:1,     fixDmg:0, attriMult:1, isSpecial:true, ak:0.537493, al:0.229843, am:0.18612, an:0.046544, ao:0.375, ed:0.402, fk:163, fr:327 },
      { skill:"Wildfire Spark DoT", countFromTime:true, atkMult:0.276, fixDmg:0, attriMult:0, isSpecial:true, ak:0,        al:0,        am:1,       an:0,        ao:1.075, ed:0.802, fk:163, fr:327 },
    ],
    config: { morale:true, hawking:true, atkFood:true, qianshan:false, bow:"affinity", monsterDef:270, breakRatio:0, exhaustRatio:0 }
  },
  twinblades: {
    name: "Twinblades 85",
    subtitle: "Infernal Twinblades & Mortal Rope Dart",
    path: "Bamboocut – Wind",
    rotationTime: 65.5,
    assumptions: [
      "Buffs: Morale Chant Lv6, Hawking (飞隼4), ATK Food",
      "Rotation: Rope Dart Q → Light combos → Rodent Rampage (133 hits) → 3x Flamelash combos → Shooting Star",
      "Monster DEF 270",
    ],

    defaultPanel: { minAtk: 894, maxAtk: 1696, precision: 0.983, criti: 0.711, dirCriti: 0.087, critiDmg: 0.5, affinity: 0.35, dirAffinity: 0, affinityDmg: 0.350, minAttri: 163, maxAttri: 327, phyPen: 11.2, physDmgBonus: 0, attriPen: 22.8, attriDmgBonus: 0.034, bossBoost: 0, attune: 0, dmgBoost: 0.175 },
    rotation: [
      { axis:"Rope Dart Q",  skill:"Bladebound Thread",        count:3,  atkMult:0.1242, fixDmg:34,   attriMult:0.1863, ak:0.663027, al:0.096522, am:0.18585, an:0.054602, ao:0.225, ed:0.350, fk:333, fr:477, dfBonus:0.035 },
      { axis:"Light Combo",  skill:"Twinblades Light Combo",   count:3,  atkMult:1.9567, fixDmg:546,  attriMult:2.9350, ak:0.663027, al:0.096522, am:0.18585, an:0.054602, ao:0.245, ed:0.350, fk:333, fr:477, dfBonus:0.035 },
      { axis:"",             skill:"Twinblades Light 1–2",     count:1,  atkMult:0.8713, fixDmg:243,  attriMult:1.3070, ak:0.663027, al:0.096522, am:0.18585, an:0.054602, ao:0.475, ed:0.350, fk:333, fr:477, dfBonus:0.035 },
      { axis:"",             skill:"Twinblades Light Combo",   count:2,  atkMult:1.9567, fixDmg:546,  attriMult:2.9350, ak:0.663027, al:0.096522, am:0.18585, an:0.054602, ao:0.475, ed:0.350, fk:333, fr:477, dfBonus:0.035 },
      { axis:"",             skill:"Twinblades Light Hit 1",   count:2,  atkMult:0.4205, fixDmg:117,  attriMult:0.6308, ak:0.663027, al:0.096522, am:0.18585, an:0.054602, ao:0.345, ed:0.350, fk:333, fr:477, dfBonus:0.035 },
      { axis:"Rodent Rampage", skill:"Rodent Rampage Hits",   count:13, atkMult:0.3500, fixDmg:0,    attriMult:0.5250, ak:0.663027, al:0.096522, am:0.18585, an:0.054602, ao:1.045, ed:0.350, fk:183, fr:327, dfBonus:0.035, bwBonus:0.24, hm:0.3 },
      { axis:"",             skill:"Rodent Rampage Hits",      count:31, atkMult:0.3500, fixDmg:0,    attriMult:0.5250, ak:0.663027, al:0.096522, am:0.18585, an:0.054602, ao:1.295, ed:0.350, fk:183, fr:327, dfBonus:0.035, bwBonus:0.24, hm:0.3 },
      { axis:"",             skill:"Rodent Rampage Hits",      count:7,  atkMult:0.3500, fixDmg:0,    attriMult:0.5250, ak:0.663027, al:0.096522, am:0.18585, an:0.054602, ao:1.125, ed:0.350, fk:183, fr:327, dfBonus:0.035, bwBonus:0.24, hm:0.3 },
      { axis:"",             skill:"Rodent Rampage Hits",      count:11, atkMult:0.3500, fixDmg:0,    attriMult:0.5250, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:1.295, ed:0.350, fk:183, fr:327, dfBonus:0.535, bwBonus:0.24, hm:0.3 },
      { axis:"",             skill:"Rodent Rampage Hits",      count:41, atkMult:0.3500, fixDmg:0,    attriMult:0.5250, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:1.275, ed:0.350, fk:183, fr:327, dfBonus:0.535, bwBonus:0.24, hm:0.3 },
      { axis:"",             skill:"Rodent Rampage Hits",      count:26, atkMult:0.3500, fixDmg:0,    attriMult:0.5250, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:1.145, ed:0.350, fk:183, fr:327, dfBonus:0.535, bwBonus:0.24, hm:0.3 },
      { axis:"",             skill:"Rodent Rampage Hits",      count:4,  atkMult:0.3500, fixDmg:0,    attriMult:0.5250, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:1.125, ed:0.350, fk:183, fr:327, dfBonus:0.535, bwBonus:0.24, hm:0.3 },
      { axis:"Flamelash",    skill:"Flamelash Light 1",        count:4,  atkMult:0.6472, fixDmg:180,  attriMult:0.9708, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.495, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"",             skill:"Flamelash Light 2",        count:4,  atkMult:0.9012, fixDmg:250,  attriMult:1.3518, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.495, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"",             skill:"Flamelash Light 3",        count:4,  atkMult:1.4455, fixDmg:401,  attriMult:2.1683, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.495, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"",             skill:"Flamelash Light 4",        count:1,  atkMult:1.7358, fixDmg:481,  attriMult:2.6037, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.495, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"",             skill:"Addled Mind",              count:2,  atkMult:1.3548, fixDmg:376,  attriMult:2.0322, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.495, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"Flamelash",    skill:"Flamelash Light 1",        count:4,  atkMult:0.6472, fixDmg:180,  attriMult:0.9708, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.475, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"",             skill:"Flamelash Light 2",        count:4,  atkMult:0.9012, fixDmg:250,  attriMult:1.3518, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.475, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"",             skill:"Flamelash Light 3",        count:4,  atkMult:1.4455, fixDmg:401,  attriMult:2.1683, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.475, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"",             skill:"Flamelash Light 4",        count:2,  atkMult:1.7358, fixDmg:481,  attriMult:2.6037, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.475, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"",             skill:"Flamelash Light 5",        count:1,  atkMult:2.5342, fixDmg:702,  attriMult:3.8013, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.475, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"",             skill:"Addled Mind",              count:3,  atkMult:1.3548, fixDmg:376,  attriMult:2.0322, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.475, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"Flamelash",    skill:"Flamelash Light 1",        count:4,  atkMult:0.6472, fixDmg:180,  attriMult:0.9708, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.345, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"",             skill:"Flamelash Light 2",        count:4,  atkMult:0.9012, fixDmg:250,  attriMult:1.3518, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.345, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"",             skill:"Flamelash Light 3",        count:4,  atkMult:1.4455, fixDmg:401,  attriMult:2.1683, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.345, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"",             skill:"Flamelash Light 4",        count:2,  atkMult:1.7358, fixDmg:481,  attriMult:2.6037, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.345, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"",             skill:"Flamelash Light 5",        count:2,  atkMult:2.5342, fixDmg:702,  attriMult:3.8013, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.345, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"",             skill:"Addled Mind",              count:2,  atkMult:1.3548, fixDmg:376,  attriMult:2.0322, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.345, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"",             skill:"Flamelash Light 1",        count:1,  atkMult:0.6472, fixDmg:180,  attriMult:0.9708, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.325, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"",             skill:"Flamelash Light 2",        count:1,  atkMult:0.9012, fixDmg:250,  attriMult:1.3518, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.325, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"",             skill:"Flamelash Light 3",        count:1,  atkMult:1.4455, fixDmg:401,  attriMult:2.1683, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.325, ed:0.350, fk:333, fr:477, dfBonus:0.535 },
      { axis:"",             skill:"Xiao – Shooting Star (5-hit)",   count:1,  atkMult:7.3480, fixDmg:1550, attriMult:11.022, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.495, ed:0.350, fk:183, fr:327, dfBonus:0.535 },
      { axis:"",             skill:"Xiao – Shooting Star (5-hit)",   count:1,  atkMult:7.3480, fixDmg:1550, attriMult:11.022, ak:0.663027, al:0.096522, am:0.18585, an:0.054602, ao:0.345, ed:0.350, fk:183, fr:327, dfBonus:0.035 },
      { axis:"",             skill:"Serene Breeze",            count:2,  atkMult:0.8718, fixDmg:425,  attriMult:1.3077, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.495, ed:0.350, fk:183, fr:327, dfBonus:0.535 },
      { axis:"",             skill:"Echoes Burst",             count:4,  atkMult:2.0000, fixDmg:0,    attriMult:0,      ak:0.663027, al:0.096522, am:0.18585, an:0.054602, ao:0.345, ed:0.350, fk:183, fr:327, dfBonus:0.035 },
      { axis:"",             skill:"Shadow Step",              count:4,  atkMult:2.0416, fixDmg:312,  attriMult:3.0624, ak:1,        al:0,        am:0,       an:0,        ao:0.225, ed:0.350, fk:183, fr:327, dfBonus:0.035 },
      { axis:"",             skill:"Echoes Burst",             count:13, atkMult:2.0000, fixDmg:0,    attriMult:0,      ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.345, ed:0.350, fk:183, fr:327, dfBonus:0.535 },
    ],
    specialEntries: [
      { skill:"Morale Chant Lv6",       count:5.764,        atkMult:1,      fixDmg:0, attriMult:1, isSpecial:true, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.345, ed:0.350, fk:183, fr:327, dfBonus:0.535 },
      { skill:"Echoes of Oblivion DoT", count:65.5,         atkMult:0.0239, fixDmg:0, attriMult:0, isSpecial:true, ak:0.756983, al:0.096522, am:0.09189, an:0.054602, ao:0.345, ed:0.350, fk:183, fr:327, dfBonus:0.535 },
      { skill:"Wildfire Spark DoT",     countFromTime:true, atkMult:0.276,  fixDmg:0, attriMult:0, isSpecial:true, ak:0,        al:0,        am:1,       an:0,        ao:0.225, ed:0.350, fk:183, fr:327, dfBonus:0.035 },
    ],
    config: { morale:true, hawking:true, atkFood:true, qianshan:false, bow:"affinity", monsterDef:270, breakRatio:0, exhaustRatio:0 }
  },
  moblade: {
    name: "Mo Blade 85",
    subtitle: "Thundercry Blade & Stormbreaker Spear",
    path: "Stonesplit – Might",
    rotationTime: 24.9,
    assumptions: [
      "Buffs: Morale Chant Lv6, ATK Food (no Hawking)",
      "Rotation: Shooting Star → 5x Galecloud Cleave (Lv3 Charge) + Followups",
      "Monster DEF 270",
    ],

    defaultPanel: { minAtk: 653, maxAtk: 1637, precision: 1.003, criti: 0.58, dirCriti: 0.087, critiDmg: 0.5, affinity: 0.35, dirAffinity: 0, affinityDmg: 0.350, minAttri: 163, maxAttri: 327, phyPen: 11.2, physDmgBonus: 0, attriPen: 6.8, attriDmgBonus: 0.034, bossBoost: 0, attune: 0, dmgBoost: 0.195 },
    rotation: [
      { axis:"Breaker",    skill:"Xiao – Shooting Star (5-hit)",    count:1, atkMult:7.3480, fixDmg:1550, attriMult:11.0220, ak:0.565894, al:0.076522, am:0.31783, an:0.039750, ao:0.245, ed:0.350, fk:163, fr:327, dfBonus:0.29 },
      { axis:"Lv3 Charge", skill:"Galecloud Cleave (Lv3)",   count:5, atkMult:7.2368, fixDmg:2002, attriMult:10.8552, ak:0.795564, al:0.076522, am:0.08816, an:0.039750, ao:0.795, ed:0.350, fk:313, fr:477, dfBonus:0.59, maxAtkBonus:60 },
      { axis:"Guard",      skill:"Galecloud Cleave Followup", count:5, atkMult:3.2929, fixDmg:462,  attriMult:3.9492,  ak:0.795564, al:0.076522, am:0.08816, an:0.039750, ao:0.795, ed:0.350, fk:313, fr:477, dfBonus:0.59, maxAtkBonus:60 },
    ],
    specialEntries: [
      { skill:"Morale Chant Lv6",   count:2.1912,       atkMult:1,     fixDmg:0, attriMult:1, isSpecial:true, ak:0.565894, al:0.076522, am:0.31783, an:0.039750, ao:0.225, ed:0.350, fk:163, fr:327, dfBonus:0.29 },
      { skill:"Wildfire Spark DoT", countFromTime:true, atkMult:0.276, fixDmg:0, attriMult:0, isSpecial:true, ak:0,        al:0,        am:1,       an:0,        ao:0.225, ed:0.350, fk:163, fr:327, dfBonus:0.29 },
    ],
    config: { morale:true, hawking:false, atkFood:true, qianshan:false, bow:"affinity", monsterDef:270, breakRatio:0, exhaustRatio:0 }
  },
  healer: {
    name: "Healer 85",
    subtitle: "Panacea Fan & Soulshade Umbrella",
    path: "Silkbind – Deluge",
    rotationTime: 2,
    assumptions: [
      "Buffs: ATK Food (no Morale, no Hawking)",
      "Rotation: Emerald Dewtouch (Heavy Heal) + 2x Soulshade Passive Heal",
      "Monster DEF 270",
    ],

    isHealer: true,
    defaultPanel: { minAtk: 1227, maxAtk: 1476, precision: 0.823, criti: 0.752, dirCriti: 0.046, critiDmg: 0.5, affinity: 0.35, dirAffinity: 0, affinityDmg: 0.350, minAttri: 163, maxAttri: 327, phyPen: 11.2, physDmgBonus: 0.025, attriPen: 6.8, attriDmgBonus: 0.034, bossBoost: 0, attune: 0, dmgBoost: 0.835 },
    rotation: [
      { axis:"", skill:"Emerald Dewtouch (Heavy Heal)", count:1, atkMult:6.7025, fixDmg:1966, attriMult:10.0538, ak:0.743652, al:0, am:0.25635, an:0, ao:0.835, ed:0.350, fk:313, fr:477, dfBonus:0.23 },
      { axis:"", skill:"Soulshade Passive Heal",        count:2, atkMult:0.7721, fixDmg:199,  attriMult:1.1582,  ak:0.743652, al:0, am:0.25635, an:0, ao:0.535, ed:0.350, fk:313, fr:477, dfBonus:0.48 },
    ],
    specialEntries: [],
    config: { morale:false, hawking:false, atkFood:true, qianshan:false, bow:"affinity", monsterDef:270, breakRatio:0, exhaustRatio:0 }
  },
};

// ═══════════════════════════════════════════════════════════
// DAMAGE CALCULATION ENGINE
// ═══════════════════════════════════════════════════════════

function calcDamageExpectation(panel, skill, config, forcePanel) {
  // Hit zone coefficients: use per-entry Excel values (ak/al/am/an) if present
  let critiCoeff, affCoeff, grazeCoeff;
  if (skill.ak !== undefined && !forcePanel) {
    const critiDmg = (panel.critiDmg || 0.5) + (skill.dfBonus || 0);
    critiCoeff = skill.ak * (1 + critiDmg) + (skill.am || 0);
    affCoeff   = skill.al || 0;
    grazeCoeff = skill.an || 0;
  } else {
    // Fallback: compute from panel stats (for user-customized panels)
    const judgRes       = panel.judgmentRes || BASE_STATS_85.judgmentRes;
    const realPrecision = Math.min(1, 0.65 + (panel.precision - 0.65) / (1 + judgRes));
    const realCriti     = Math.min(1, (panel.criti || 0) / (1 + judgRes));
    const dirCriti      = panel.dirCriti || 0;
    const realAffinity  = (panel.affinity || 0) / (1 + judgRes);
    const dirAffinity   = panel.dirAffinity || 0;
    const critiDmg      = panel.critiDmg || 0.5;
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
    critiCoeff = effectiveCriti * (1 + critiDmg) + effectiveNormal;
    affCoeff   = effectiveAffinity;
    grazeCoeff = effectiveGraze;
  }

  // Per-entry overrides for affinityDmg (ed) and dmgBoostA (ao)
  const affinityDmg = skill.ed !== undefined ? skill.ed : (panel.affinityDmg || 0.35);
  const affZoneMult = 1 + affinityDmg;

  const physDmgBonus  = (panel.physDmgBonus || 0) + (skill.bwBonus || 0);
  const attriDmgBonus = panel.attriDmgBonus || 0;

  const dmgBoostA = skill.ao !== undefined ? skill.ao :
    ((panel.dmgBoost || 0) + (panel.bossBoost || 0)
    + (config.exhaustRatio || 0) * 0.1
    + (config.breakRatio  || 0) * 0.25
    + (config.morale ? 0.05 : 0));

  // Penetration multipliers — Excel formula: (1 + pen/200)
  const phyPenVal    = (panel.phyPen || 0) + (config.atkFood ? 10 : 0) + (skill.blBonus || 0);
  const phyPenMult   = 1 + phyPenVal / 200;
  const attriPenVal  = (panel.attriPen || 0) + (skill.cbBonus || 0);
  const attriPenMult = 1 + attriPenVal / 200;
  const attuneMult   = 1 + (panel.attune || 0);

  const hawkAtkAmp = config.hawkAtkAmp !== undefined ? config.hawkAtkAmp : (config.hawking ? 0.1 : 0);

  const monsterDef  = config.monsterDef || 270;
  const foodMinBuff = config.atkFood ? (config.hawking ? 1200 / 11 : 120) : 0;
  const foodMaxBuff = config.atkFood ? (config.hawking ? 2400 / 11 : 240) : 0;
  const minAtk = Math.max(0, (panel.minAtk || 0) + (skill.minAtkBonus || 0) + foodMinBuff - monsterDef);
  const maxAtk = Math.max(0, (panel.maxAtk || 0) + (skill.maxAtkBonus || 0) + foodMaxBuff - monsterDef);
  const avgAtk = minAtk >= maxAtk ? minAtk : (minAtk + maxAtk) / 2;

  // Per-entry attribute range (fk/fr)
  const entryMinAttri = (skill.fk !== undefined && !forcePanel) ? skill.fk : (panel.minAttri || 0);
  const entryMaxAttri = (skill.fr !== undefined && !forcePanel) ? skill.fr : (panel.maxAttri || 0);
  const avgAttri = entryMinAttri >= entryMaxAttri ? entryMinAttri : (entryMinAttri + entryMaxAttri) / 2;

  // Physical ATK: affinity zone uses maxAtk, graze uses minAtk, crit/normal use avgAtk
  const phyAtkDmg = (
    critiCoeff * avgAtk
    + affCoeff * affZoneMult * maxAtk
    + grazeCoeff * minAtk
  ) * skill.atkMult * (1 + hawkAtkAmp);

  // Fixed damage
  const fixDmgHit = (critiCoeff + affCoeff * affZoneMult + grazeCoeff) * (skill.fixDmg || 0);

  // Attribute ATK: affinity zone uses entryMaxAttri, graze uses entryMinAttri
  const attriAtkDmg = (
    critiCoeff * avgAttri
    + affCoeff * affZoneMult * entryMaxAttri
    + grazeCoeff * entryMinAttri
  ) * (skill.attriMult || 0);

  const phyTotal   = (phyAtkDmg + fixDmgHit) * (1 + physDmgBonus) * (1 + dmgBoostA) * phyPenMult  * attuneMult;
  const attriTotal = attriAtkDmg               * (1 + attriDmgBonus) * (1 + dmgBoostA) * attriPenMult * attuneMult;

  return (phyTotal + attriTotal) * (1 + (skill.hm || 0)) * (skill.count || 0);
}

function calcBuildDPS(panel, buildKey, forcePanel) {
  const build = BUILDS[buildKey];
  if (!build) return { dps: 0, skills: [], total: 0 };
  const config = build.config;
  let skills = [];
  let total = 0;

  for (const entry of build.rotation) {
    const dmg = calcDamageExpectation(panel, entry, config, forcePanel);
    skills.push({ ...entry, totalDmg: dmg });
    total += dmg;
  }
  for (const entry of build.specialEntries) {
    const count = entry.countFromTime ? build.rotationTime : entry.count;
    const dmg = calcDamageExpectation(panel, { ...entry, count }, config, forcePanel);
    skills.push({ ...entry, count, totalDmg: dmg });
    total += dmg;
  }

  const dps = Math.floor(total / build.rotationTime);
  skills = skills.map(s => ({ ...s, pct: total > 0 ? s.totalDmg / total : 0 }));
  skills.sort((a, b) => b.totalDmg - a.totalDmg);
  return { dps, skills, total };
}

function calcStatPriority(panel, buildKey) {
  const base = calcBuildDPS(panel, buildKey, true);
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
    const result = calcBuildDPS(modified, buildKey, true);
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
  ocean: {
    name: "Ocean", btnSwatch: "#4a7aaa",
    bg: "linear-gradient(170deg, #080c14 0%, #0a1020 40%, #0e1428 100%)",
    headerOverlay: "rgba(20,40,70,.5)", headerBorder: "#162240",
    accent: "#4a7aaa", accentSoft: "#6699bb", accentBright: "#b0ccee",
    accentMid: "#6090b0", accentDim: "#4a7090", accentDeep: "#1a2e44",
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
  dusk: {
    name: "Dusk", btnSwatch: "#7c6aaa",
    bg: "linear-gradient(170deg, #080810 0%, #0c0c1a 40%, #12101e 100%)",
    headerOverlay: "rgba(40,30,60,.5)", headerBorder: "#1a1832",
    accent: "#7c6aaa", accentSoft: "#9988bb", accentBright: "#d4c4ee",
    accentMid: "#777799", accentDim: "#5c5c7a", accentDeep: "#252540",
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
  ember: {
    name: "Ember", btnSwatch: "#aa5522",
    bg: "linear-gradient(170deg, #100808 0%, #180c08 40%, #1c1008 100%)",
    headerOverlay: "rgba(60,25,10,.5)", headerBorder: "#2c1808",
    accent: "#aa5522", accentSoft: "#cc7744", accentBright: "#eebb88",
    accentMid: "#998866", accentDim: "#776655", accentDeep: "#332211",
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
    accentMid: "#6a9077", accentDim: "#4a7058", accentDeep: "#1a2e22",
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
];

function BarChart({ value, max, color, bg = "#1a1a2e" }) {
  const w = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div style={{ width: "100%", height: 6, background: bg, borderRadius: 3, overflow: "hidden" }}>
      <div style={{ width: `${w}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.4s ease" }} />
    </div>
  );
}


export default function WWMCalculator() {
  const [buildKey, setBuildKey] = useState("nameless");
  const [overrides, setOverrides] = useState(() => {
    const init = {};
    for (const k of Object.keys(BUILDS)) init[k] = {};
    return init;
  });
  const [showPriority, setShowPriority] = useState(true);
  const [themeKey, setThemeKey] = useState("ocean");
  const t = THEMES[themeKey];
  const buildOverrides = overrides[buildKey];
  const build = BUILDS[buildKey];
  const panel = useMemo(() => ({ ...build.defaultPanel, ...buildOverrides }), [build, buildOverrides]);

  const handleBuildChange = useCallback((key) => {
    setBuildKey(key);
  }, []);

  const handlePanelChange = useCallback((key, val, isPct) => {
    setOverrides(prev => ({
      ...prev,
      [buildKey]: { ...prev[buildKey], [key]: val === "" ? undefined : (isPct ? (parseFloat(val) || 0) / 100 : (parseFloat(val) || 0)) },
    }));
  }, [buildKey]);

  const result = useMemo(() => calcBuildDPS(panel, buildKey), [panel, buildKey]);
  const priorities = useMemo(() => showPriority ? calcStatPriority(panel, buildKey) : [], [panel, buildKey, showPriority]);

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
          <div style={{ fontSize: 15, fontWeight: 700, color: t.accentBright, marginBottom: 4, letterSpacing: 1 }}>
            YOUR PANEL
          </div>
          <div style={{ fontSize: 15, color: t.accentSoft, marginBottom: 4 }}>
            {build.subtitle}
          </div>
          <div style={{ fontSize: 14, color: t.accentMid, marginBottom: 8 }}>
            {build.path}
          </div>
          <div style={{ fontSize: 14, color: t.accentMid, marginBottom: 8 }}>
            Crit + Affinity: <span style={{ color: critiAffinity > 1 ? t.badColor : t.goodColor, fontWeight: 700 }}>{(critiAffinity * 100).toFixed(1)}%</span>
            &nbsp;|&nbsp;Rotation: {build.rotationTime}s
          </div>
          {build.assumptions && (
            <div style={{ fontSize: 12, color: t.accentDim, marginBottom: 12, lineHeight: 1.6 }}>
              {build.assumptions.map((a, i) => <div key={i}>{a}</div>)}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 14px" }}>
            {PANEL_FIELDS.map(f => (
              <label key={f.key} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 13, color: t.accentMid, letterSpacing: 0.5, fontWeight: 500 }}>
                  {f.label}{f.pct ? " (%)" : ""}
                </span>
                <input
                  type="number"
                  step={f.pct ? f.step * 100 : f.step}
                  placeholder={f.pct ? +((build.defaultPanel[f.key] ?? 0) * 100).toFixed(4) : (build.defaultPanel[f.key] ?? 0)}
                  value={buildOverrides[f.key] !== undefined ? (f.pct ? +((buildOverrides[f.key]) * 100).toFixed(4) : buildOverrides[f.key]) : ""}
                  onChange={e => handlePanelChange(f.key, e.target.value, f.pct)}
                  style={{
                    background: t.inputBg, border: `1px solid ${t.accentDeep}`, borderRadius: 4,
                    color: t.text, padding: "8px 10px", fontSize: 16, fontWeight: 600,
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
                        {isGood && <span style={{ color: t.accentMid, fontWeight: 400 }}> (+{Math.round(result.dps * p.improvement)} DPS)</span>}
                        {!isGood && <span style={{ color: t.statBadText }}> {p.improvement === 0 ? "capped" : "waste"}</span>}
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
          Based on yoka's spreadsheet · Rotation data from Lv85 version · Per-row Excel buff values
        </div>
      </div>
    </div>
  );
}

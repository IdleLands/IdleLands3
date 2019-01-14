
export const perks = [
  { name: '+15% XP (1 day)', cost: 5000,
    description: 'Give the world +15% XP for 1 day.',
    festivalDuration: 24,
    festivalData: { xp: 0.15 } },

  { name: '+15% XP (1 week)', cost: 25000,
    description: 'Give the world +15% XP for 1 week.',
    festivalDuration: 24 * 7,
    festivalData: { xp: 0.15 } },

  { name: '+60% XP (1 week)', cost: 125000,
    description: 'Give the world +60% XP for 1 week.',
    festivalDuration: 24 * 7,
    festivalData: { xp: 0.60 } },
  
  { name: '+10% Item Find (1 day)', cost: 3000,
    description: 'Give the world +10% Item Find for 1 day.',
    festivalDuration: 24,
    festivalData: { itemFindRangeMultiplier: 0.10 } },

  { name: '+10% Item Find (1 week)', cost: 15000,
    description: 'Give the world +10% Item Find for 1 week.',
    festivalDuration: 24 * 7,
    festivalData: { itemFindRangeMultiplier: 0.10 } },

  { name: '+40% Item Find (1 week)', cost: 75000,
    description: 'Give the world +40% Item Find for 1 week.',
    festivalDuration: 24 * 7,
    festivalData: { itemFindRangeMultiplier: 0.40 } },

  { name: '+10% Combat (1 day)', cost: 1400,
    description: 'Give the world +10% to combat stats for 1 day.',
    festivalDuration: 24,
    festivalData: { str: 0.1, dex: 0.1, con: 0.1, int: 0.1, agi: 0.1 } },
  
  { name: '+10% Combat (1 week)', cost: 7000,
    description: 'Give the world +10% to combat stats for 1 week.',
    festivalDuration: 24 * 7,
    festivalData: { str: 0.1, dex: 0.1, con: 0.1, int: 0.1, agi: 0.1 } },

  { name: '+40% Combat (1 week)', cost: 35000,
    description: 'Give the world +40% to combat stats for 1 week.',
    festivalDuration: 24 * 7,
    festivalData: { str: 0.4, dex: 0.4, con: 0.4, int: 0.4, agi: 0.4 } },

  { name: '+20% Luck (1 day)', cost: 5000,
    description: 'Give the world +20% luck for 1 day.',
    festivalDuration: 24,
    festivalData: { luk: 0.2 } },
  
  { name: '+20% Luck (1 week)', cost: 25000,
    description: 'Give the world +20% luck for 1 week.',
    festivalDuration: 24 * 7,
    festivalData: { luk: 0.2 } },

  { name: '+80% Luck (1 week)', cost: 125000,
    description: 'Give the world +80% luck for 1 week.',
    festivalDuration: 24 * 7,
    festivalData: { luk: 0.8 } },
  
  { name: 'Effects (1 day)', cost: 1400,
    description: ' Give the world +1% gold, +1% XP, +1% critical chance, +1% HP, and 1% MP for 1 day.',
    festivalDuration: 24,
    festivalData: { gold: 0.01, xp: 0.01, crit: 0.01, hp: 0.01, mp: 0.01 } },
  
  { name: 'Effects (1 week)', cost: 7000,
    description: ' Give the world +1% gold, +1% XP, +1% critical chance, +1% HP, and 1% MP for 1 week.',
    festivalDuration: 24 * 7,
    festivalData: { gold: 0.01, xp: 0.01, crit: 0.01, hp: 0.01, mp: 0.01 } },

  { name: '+30% Salvage (1 day)', cost: 3500,
    description: 'Give the world +30% salvage for 1 day.',
    festivalDuration: 24,
    festivalData: { salvage: 3 } },

  { name: '+70% Salvage (1 day)', cost: 7000,
    description: 'Give the world +70% salvage for 1 day.',
    festivalDuration: 24,
    festivalData: { salvage: 7 } },

  { name: '+100% Salvage (1 day)', cost: 12000,
    description: 'Give the world +100% salvage for 1 day.',
    festivalDuration: 24,
    festivalData: { salvage: 10 } },
  
  { name: '+100% Salvage (1 week)', cost: 60000,
    description: 'Give the world +100% salvage for 1 week.',
    festivalDuration: 24 * 7,
    festivalData: { salvage: 10 } },

  { name: '+400% Salvage (1 week)', cost: 300000,
    description: 'Give the world +400% salvage for 1 week.',
    festivalDuration: 24 * 7,
    festivalData: { salvage: 40 } },

  { name: 'Teleport: Norkos', cost: 3000,
    description: 'Teleport to Norkos.',
    teleportData: { toLoc: 'norkos' } },

  { name: 'Teleport: Maeles', cost: 3000,
    description: 'Teleport to Maeles.',
    teleportData: { toLoc: 'maeles' } },

  { name: 'Teleport: Vocalnus', cost: 3000,
    description: 'Teleport to Vocalnus.',
    teleportData: { toLoc: 'vocalnus' } },

  { name: 'Teleport: Frigri', cost: 3000,
    description: 'Teleport to Frigri.',
    teleportData: { toLoc: 'frigri' } },
  
  { name: 'Teleport: Homlet', cost: 5000,
    description: 'Teleport to Homlet.',
    teleportData: { toLoc: 'homlet' } },

  { name: 'Teleport: Astral Control Room', cost: 1000,
    description: 'Teleport to the Astral Control Room.',
    teleportData: { toLoc: 'astralcontrolroom' } },

  { name: 'Teleport: Guild Base', cost: 5000,
    description: 'Teleport to your Guild Base. Will not work for non-guild-members.',
    teleportData: { toLoc: 'guildbase' } },

  { name: 'Rename Tag: Pet', cost: 1000,
    description: 'Rename a single pet.',
    consumableKey: 'renameTagPet' },

  { name: 'Rename Tag: Guild', cost: 3000,
    description: 'Rename your guild. Only Leaders can use this.',
    consumableKey: 'renameTagGuild' },

  { name: 'Gender: Blue', cost: 100,
    description: 'Unlock the Blue gender.',
    oneTimeData: { gender: 'blue' } },

  { name: 'Gender: Boss Monster', cost: 300,
    description: 'Unlock the Boss Monster gender.',
    oneTimeData: { gender: 'boss monster' } },
  
  { name: 'Gender: Gold Boss Monster', cost: 5000,
    description: 'Unlock the Gold Boss Monster gender.',
    oneTimeData: { gender: 'gold boss monster' } },

  { name: 'Gender: Fighter (Gold)', cost: 25000,
    description: 'Unlock the Fighter (Gold) gender.',
    requireAchievement: 'Classy: Fighter',
    oneTimeData: { gender: 'Fighter-gold' } },

  { name: 'Gender: Mage (Gold)', cost: 25000,
    description: 'Unlock the Mage (Gold) gender.',
    requireAchievement: 'Classy: Mage',
    oneTimeData: { gender: 'Mage-gold' } },

  { name: 'Gender: Cleric (Gold)', cost: 25000,
    description: 'Unlock the Cleric (Gold) gender.',
    requireAchievement: 'Classy: Cleric',
    oneTimeData: { gender: 'Cleric-gold' } },

  { name: 'Gender: Generalist (Gold)', cost: 25000,
    description: 'Unlock the Generalist (Gold) gender.',
    requireAchievement: 'Classy: Generalist',
    oneTimeData: { gender: 'Generalist-gold' } },

  { name: 'Gender: Jester (Gold)', cost: 25000,
    description: 'Unlock the Jester (Gold) gender.',
    requireAchievement: 'Classy: Jester',
    oneTimeData: { gender: 'Jester-gold' } },

  { name: 'Gender: Rogue (Gold)', cost: 25000,
    description: 'Unlock the Rogue (Gold) gender.',
    requireAchievement: 'Classy: Rogue',
    oneTimeData: { gender: 'Rogue-gold' } },

  { name: 'Gender: Archer (Gold)', cost: 25000,
    description: 'Unlock the Archer (Gold) gender.',
    requireAchievement: 'Classy: Archer',
    oneTimeData: { gender: 'Archer-gold' } },

  { name: 'Gender: Pirate (Gold)', cost: 25000,
    description: 'Unlock the Pirate (Gold) gender.',
    requireAchievement: 'Classy: Pirate',
    oneTimeData: { gender: 'Pirate-gold' } },

  { name: 'Gender: Monster (Gold)', cost: 25000,
    description: 'Unlock the Monster (Gold) gender.',
    requireAchievement: 'Classy: Monster',
    oneTimeData: { gender: 'Monster-gold' } },

  { name: 'Gender: MagicalMonster (Gold)', cost: 25000,
    description: 'Unlock the MagicalMonster (Gold) gender.',
    requireAchievement: 'Classy: MagicalMonster',
    oneTimeData: { gender: 'MagicalMonster-gold' } },

  { name: 'Gender: Barbarian (Gold)', cost: 25000,
    description: 'Unlock the Barbarian (Gold) gender.',
    requireAchievement: 'Classy: Barbarian',
    oneTimeData: { gender: 'Barbarian-gold' } },

  { name: 'Gender: Bard (Gold)', cost: 25000,
    description: 'Unlock the Bard (Gold) gender.',
    requireAchievement: 'Classy: Bard',
    oneTimeData: { gender: 'Bard-gold' } },

  { name: 'Gender: SandwichArtist (Gold)', cost: 25000,
    description: 'Unlock the SandwichArtist (Gold) gender.',
    requireAchievement: 'Classy: SandwichArtist',
    oneTimeData: { gender: 'SandwichArtist-gold' } },

  { name: 'Gender: Necromancer (Gold)', cost: 25000,
    description: 'Unlock the Necromancer (Gold) gender.',
    requireAchievement: 'Classy: Necromancer',
    oneTimeData: { gender: 'Necromancer-gold' } },

  { name: 'Gender: Bitomancer (Gold)', cost: 25000,
    description: 'Unlock the Bitomancer (Gold) gender.',
    requireAchievement: 'Classy: Bitomancer',
    oneTimeData: { gender: 'Bitomancer-gold' } }
];

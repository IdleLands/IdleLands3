
export const perks = [
  { name: '+15% XP (1 day)', cost: 1000,
    description: 'Give the world +15% XP for 1 day.',
    festivalDuration: 24,
    festivalData: { xp: 0.15 } },

  { name: '+15% XP (1 week)', cost: 5000,
    description: 'Give the world +15% XP for 1 week.',
    festivalDuration: 24 * 7,
    festivalData: { xp: 0.15 } },

  { name: '+15% Gold (1 day)', cost: 2000,
    description: 'Give the world +15% Gold for 1 day.',
    festivalDuration: 24,
    festivalData: { gold: 0.15 } },

  { name: '+15% Gold (1 week)', cost: 10000,
    description: 'Give the world +15% Gold for 1 week.',
    festivalDuration: 24 * 7,
    festivalData: { gold: 0.15 } },

  { name: '+10% Item Find (1 day)', cost: 4000,
    description: 'Give the world +10% Item Find for 1 day.',
    festivalDuration: 24,
    festivalData: { itemFindRangeMultiplier: 0.10 } },

  { name: '+10% Item Find (1 week)', cost: 20000,
    description: 'Give the world +10% Item Find for 1 week.',
    festivalDuration: 24 * 7,
    festivalData: { itemFindRangeMultiplier: 0.10 } },

  { name: '+10% Combat (1 day)', cost: 1400,
    description: 'Give the world +10% to combat stats for 1 day.',
    festivalDuration: 24,
    festivalData: { str: 0.1, dex: 0.1, con: 0.1, int: 0.1, agi: 0.1 } },

  { name: '+20% Luck (1 day)', cost: 3000,
    description: 'Give the world +20% luck for 1 day.',
    festivalDuration: 24,
    festivalData: { luk: 0.2 } },

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
    oneTimeData: { gender: 'boss monster' } }
];
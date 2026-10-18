// Generated from pinned official CC BY 4.0 SRDs by scripts/build-magic-item-catalog.ts.
import type { MagicItemReference } from "@/types/magic-item-reference";
export const SRD_MAGIC_ITEMS: readonly MagicItemReference[] = [
  {
    id: "srd51:adamantine-armor",
    edition: "2014",
    name: "Adamantine Armor",
    metadata: "Armor (medium or heavy, but not hide), uncommon",
    rules:
      "This suit of armor is reinforced with adamantine,\none of the hardest substances in existence. While\nyou’re wearing it, any critical hit against you\nbecomes a normal hit.",
    page: 207,
    endPage: 207,
    category: "armor",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:ammunition-1-2-or-3",
    edition: "2014",
    name: "Ammunition, +1, +2, or +3",
    metadata: "Weapon (any ammunition), uncommon (+1), rare (+2), or very rare (+3)",
    rules:
      "You have a bonus to attack and damage rolls made\nwith this piece of magic ammunition. The bonus is\ndetermined by the rarity of the ammunition. Once it\nhits a target, the ammunition is no longer magical.",
    page: 207,
    endPage: 207,
    category: "weapon",
    rarities: ["uncommon", "rare", "veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:amulet-of-health",
    edition: "2014",
    name: "Amulet of Health",
    metadata: "Wondrous item, rare (requires attunement)",
    rules:
      "Your Constitution score is 19 while you wear this\namulet. It has no effect on you if your Constitution is\nalready 19 or higher.",
    page: 207,
    endPage: 207,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:amulet-of-proof-against-detection-and-location",
    edition: "2014",
    name: "Amulet of Proof against Detection and Location",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "While wearing this amulet, you are hidden from\ndivination magic. You can’t be targeted by such\nmagic or perceived through magical scrying sensors.",
    page: 207,
    endPage: 207,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:amulet-of-the-planes",
    edition: "2014",
    name: "Amulet of the Planes",
    metadata: "Wondrous item, very rare (requires attunement)",
    rules:
      "While wearing this amulet, you can use an action to\nname a location that you are familiar with on\nanother plane of existence. Then make a DC 15\nIntelligence check. On a successful check, you cast\nthe plane shift spell. On a failure, you and each\ncreature and object within 15 feet of you travel to a\nrandom destination. Roll a d100. On a 1–60, you\ntravel to a random location on the plane you named.\nOn a 61–100, you travel to a randomly determined\nplane of existence.",
    page: 207,
    endPage: 207,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:animated-shield",
    edition: "2014",
    name: "Animated Shield",
    metadata: "Armor (shield), very rare (requires attunement)",
    rules:
      "While holding this shield, you can speak its\ncommand word as a bonus action to cause it to\nanimate. The shield leaps into the air and hovers in\nyour space to protect you as if you were wielding it,\nleaving your hands free. The shield remains\nanimated for 1 minute, until you use a bonus action\nto end this effect, or until you are incapacitated or\ndie, at which point the shield falls to the ground or\ninto your hand if you have one free.",
    page: 208,
    endPage: 208,
    category: "armor",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:apparatus-of-the-crab",
    edition: "2014",
    name: "Apparatus of the Crab",
    metadata: "Wondrous item, legendary",
    rules:
      "This item first appears to be a Large sealed iron\nbarrel weighing 500 pounds. The barrel has a hidden\ncatch, which can be found with a successful DC 20\nIntelligence (Investigation) check. Releasing the\ncatch unlocks a hatch at one end of the barrel,\nallowing two Medium or smaller creatures to crawl\ninside. Ten levers are set in a row at the far end, each\nin a neutral position, able to move either up or down.\nWhen certain levers are used, the apparatus\ntransforms to resemble a giant lobster.\nThe apparatus of the Crab is a Large object with\nthe following statistics:\nArmor Class: 20\nHit Points: 200\nSpeed: 30 ft., swim 30 ft. (or 0 ft. for both if the legs\nand tail aren’t extended)\nDamage Immunities: poison, psychic\nTo be used as a vehicle, the apparatus requires one\npilot. While the apparatus’s hatch is closed, the\ncompartment is airtight and watertight. The\ncompartment holds enough air for 10 hours of\nbreathing, divided by the number of breathing\ncreatures inside.\nThe apparatus floats on water. It can also go\nunderwater to a depth of 900 feet. Below that, the\nvehicle takes 2d6 bludgeoning damage per minute\nfrom pressure.\nA creature in the compartment can use an action\nto move as many as two of the apparatus’s levers up\nor down. After each use, a lever goes back to its\nneutral position. Each lever, from left to right,\nfunctions as shown in the Apparatus of the Crab\nLevers table.\nApparatus of the Crab Levers\nLever Up Down\n1 Legs and tail extend, Legs and tail retract,\nallowing the apparatus reducing the apparatus’s\nto walk and swim. speed to 0 and making it\nunable to benefit from\nbonuses to speed.\n2 Forward window shutter Forward window shutter\nopens. closes.\n3 Side window shutters Side window shutters\nopen (two per side). close (two per side).\n4 Two claws extend from The claws retract.\nthe front sides of the\napparatus.\n5 Each extended claw Each extended claw\nmakes the following makes the following\nmelee weapon attack: melee weapon attack: +8\n+8 to hit, reach 5 ft., one to hit, reach 5 ft., one\ntarget. Hit: 7 (2d6) target. Hit: The target is\nbludgeoning damage. grappled (escape DC 15).\n6 The apparatus walks or The apparatus walks or\nswims forward. swims backward.\n7 The apparatus turns 90 The apparatus turns 90\ndegrees left. degrees right.\n8 Eyelike fixtures emit The light turns off.\nbright light in a 30-‐foot\nradius and dim light for\nan additional 30 feet.\n9 The apparatus sinks as The apparatus rises up\nmuch as 20 feet in to 20 feet in liquid.\nliquid.\n10 The rear hatch unseals The rear hatch closes\nand opens. and seals.",
    page: 208,
    endPage: 208,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:armor-1-2-or-3",
    edition: "2014",
    name: "Armor, +1, +2, or +3",
    metadata: "Armor (light, medium, or heavy), rare (+1), very rare (+2), or legendary (+3)",
    rules: "You have a bonus to AC while wearing this armor.\nThe bonus is determined by its rarity.",
    page: 208,
    endPage: 208,
    category: "armor",
    rarities: ["rare", "veryRare", "legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:armor-of-invulnerability",
    edition: "2014",
    name: "Armor of Invulnerability",
    metadata: "Armor (plate), legendary (requires attunement)",
    rules:
      "You have resistance to nonmagical damage while\nyou wear this armor. Additionally, you can use an\naction to make yourself immune to nonmagical\ndamage for 10 minutes or until you are no longer\nwearing the armor. Once this special action is used,\nit can’t be used again until the next dawn.",
    page: 208,
    endPage: 208,
    category: "armor",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:armor-of-resistance",
    edition: "2014",
    name: "Armor of Resistance",
    metadata: "Armor (light, medium, or heavy), rare (requires attunement)",
    rules:
      "You have resistance to one type of damage while you\nwear this armor. The GM chooses the type or\ndetermines it randomly from the options below.\nd10 Damage Type d10 Damage Type\n1 Acid 6 Necrotic\n2 Cold 7 Poison\n3 Fire 8 Psychic\n4 Force 9 Radiant\n5 Lightning 10 Thunder",
    page: 208,
    endPage: 209,
    category: "armor",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:armor-of-vulnerability",
    edition: "2014",
    name: "Armor of Vulnerability",
    metadata: "Armor (plate), rare (requires attunement)",
    rules:
      "While wearing this armor, you have resistance to\none of the following damage types: bludgeoning,\npiercing, or slashing. The GM chooses the type or\ndetermines it randomly.\nCurse. This armor is cursed, a fact that is revealed\nonly when an identify spell is cast on the armor or\nyou attune to it. Attuning to the armor curses you\nuntil you are targeted by the remove curse spell or\nsimilar magic; removing the armor fails to end the\ncurse. While cursed, you have vulnerability to two of\nthe three damage types associated with the armor\n(not the one to which it grants resistance).",
    page: 209,
    endPage: 209,
    category: "armor",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:arrow-catching-shield",
    edition: "2014",
    name: "Arrow-Catching Shield",
    metadata: "Armor (shield), rare (requires attunement)",
    rules:
      "You gain a +2 bonus to AC against ranged attacks\nwhile you wield this shield. This bonus is in addition\nto the shield’s normal bonus to AC. In addition,\nwhenever an attacker makes a ranged attack against\na target within 5 feet of you, you can use your\nreaction to become the target of the attack instead.",
    page: 209,
    endPage: 209,
    category: "armor",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:arrow-of-slaying",
    edition: "2014",
    name: "Arrow of Slaying",
    metadata: "Weapon (arrow), very rare",
    rules:
      "An arrow of slaying is a magic weapon meant to slay\na particular kind of creature. Some are more focused\nthan others; for example, there are both arrows of\ndragon slaying and arrows of blue dragon slaying. If a\ncreature belonging to the type, race, or group\nassociated with an arrow of slaying takes damage\nfrom the arrow, the creature must make a DC 17\nConstitution saving throw, taking an extra 6d10\npiercing damage on a failed save, or half as much\nextra damage on a successful one.\nOnce an arrow of slaying deals its extra damage to\na creature, it becomes a nonmagical arrow.\nOther types of magic ammunition of this kind exist,\nsuch as bolts of slaying meant for a crossbow, though\narrows are most common.",
    page: 209,
    endPage: 209,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:bag-of-beans",
    edition: "2014",
    name: "Bag of Beans",
    metadata: "Wondrous item, rare",
    rules:
      "Inside this heavy cloth bag are 3d4 dry beans. The\nbag weighs 1/2 pound plus 1/4 pound for each bean\nit contains.\nIf you dump the bag’s contents out on the ground,\nthey explode in a 10-‐‑foot radius, extending from the\nbeans. Each creature in the area, including you, must\nmake a DC 15 Dexterity saving throw, taking 5d4 fire\ndamage on a failed save, or half as much damage on\na successful one. The fire ignites flammable objects\nin the area that aren’t being worn or carried.\nIf you remove a bean from the bag, plant it in dirt\nor sand, and then water it, the bean produces an\neffect 1 minute later from the ground where it was\nplanted. The GM can choose an effect from the\nfollowing table, determine it randomly, or create an\neffect.\nd100 Effect\n01 5d4 toadstools sprout. If a creature eats a\ntoadstool, roll any die. On an odd roll, the eater\nmust succeed on a DC 15 Constitution saving\nthrow or take 5d6 poison damage and become\npoisoned for 1 hour. On an even roll, the eater\ngains 5d6 temporary hit points for 1 hour.\n02–10 A geyser erupts and spouts water, beer, berry\njuice, tea, vinegar, wine, or oil (GM’s choice) 30\nfeet into the air for 1d12 rounds.\n11–20 A treant sprouts. There’s a 50 percent chance\nthat the treant is chaotic evil and attacks.\n21–30 An animate, immobile stone statue in your\nlikeness rises. It makes verbal threats against\nyou. If you leave it and others come near, it\ndescribes you as the most heinous of villains and\ndirects the newcomers to find and attack you. If\nyou are on the same plane of existence as the\nstatue, it knows where you are. The statue\nbecomes inanimate after 24 hours.\n31–40 A campfire with blue flames springs forth and\nburns for 24 hours (or until it is extinguished).\n41–50 1d6 + 6 shriekers sprout\n51–60 1d4 + 8 bright pink toads crawl forth. Whenever\na toad is touched, it transforms into a Large or\nsmaller monster of the GM’s choice. The\nmonster remains for 1 minute, then disappears\nin a puff of bright pink smoke.\n61–70 A hungry bulette burrows up and attacks.\n71–80 A fruit tree grows. It has 1d10 + 20 fruit, 1d8 of\nwhich act as randomly determined magic\npotions, while one acts as an ingested poison of\nthe GM’s choice. The tree vanishes after 1 hour.\nPicked fruit remains, retaining any magic for 30\ndays.\n81–90 A nest of 1d4 + 3 eggs springs up. Any creature\nthat eats an egg must make a DC 20 Constitution\nsaving throw. On a successful save, a creature\npermanently increases its lowest ability score by\n1, randomly choosing among equally low scores.\nOn a failed save, the creature takes 10d6 force\ndamage from an internal magical explosion.\n91–99 A pyramid with a 60-‐foot-‐square base bursts\nupward. Inside is a sarcophagus containing a\nmummy lord. The pyramid is treated as the\nmummy lord’s lair, and its sarcophagus contains\ntreasure of the GM’s choice.\n00 A giant beanstalk sprouts, growing to a height of\nthe GM’s choice. The top leads where the GM\nchooses, such as to a great view, a cloud giant’s\ncastle, or a different plane of existence.",
    page: 209,
    endPage: 210,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:bag-of-devouring",
    edition: "2014",
    name: "Bag of Devouring",
    metadata: "Wondrous item, very rare",
    rules:
      "This bag superficially resembles a bag of holding but\nis a feeding orifice for a gigantic extradimensional\ncreature. Turning the bag inside out closes the\norifice.\nThe extradimensional creature attached to the bag\ncan sense whatever is placed inside the bag. Animal\nor vegetable matter placed wholly in the bag is\ndevoured and lost forever. When part of a living\ncreature is placed in the bag, as happens when\nsomeone reaches inside it, there is a 50 percent\nchance that the creature is pulled inside the bag. A\ncreature inside the bag can use its action to try to\nescape with a successful DC 15 Strength check.\nAnother creature can use its action to reach into the\nbag to pull a creature out, doing so with a successful\nDC 20 Strength check (provided it isn’t pulled inside\nthe bag first). Any creature that starts its turn inside\nthe bag is devoured, its body destroyed.\nInanimate objects can be stored in the bag, which\ncan hold a cubic foot of such material. However, once\neach day, the bag swallows any objects inside it and\nspits them out into another plane of existence. The\nGM determines the time and plane.\nIf the bag is pierced or torn, it is destroyed, and\nanything contained within it is transported to a\nrandom location on the Astral Plane.",
    page: 210,
    endPage: 210,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:bag-of-holding",
    edition: "2014",
    name: "Bag of Holding",
    metadata: "Wondrous item, uncommon",
    rules:
      "This bag has an interior space considerably larger\nthan its outside dimensions, roughly 2 feet in\ndiameter at the mouth and 4 feet deep. The bag can\nhold up to 500 pounds, not exceeding a volume of 64\ncubic feet. The bag weighs 15 pounds, regardless of\nits contents. Retrieving an item from the bag\nrequires an action.\nIf the bag is overloaded, pierced, or torn, it\nruptures and is destroyed, and its contents are\nscattered in the Astral Plane. If the bag is turned\ninside out, its contents spill forth, unharmed, but the\nbag must be put right before it can be used again.\nBreathing creatures inside the bag can survive up to\na number of minutes equal to 10 divided by the\nnumber of creatures (minimum 1 minute), after\nwhich time they begin to suffocate.\nPlacing a bag of holding inside an\nextradimensional space created by a handy\nhaversack, portable hole, or similar item instantly\ndestroys both items and opens a gate to the Astral\nPlane. The gate originates where the one item was\nplaced inside the other. Any creature within 10 feet\nof the gate is sucked through it to a random location\non the Astral Plane. The gate then closes. The gate is\none-‐‑way only and can’t be reopened.",
    page: 210,
    endPage: 210,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:bag-of-tricks",
    edition: "2014",
    name: "Bag of Tricks",
    metadata: "Wondrous item, uncommon",
    rules:
      "This ordinary bag, made from gray, rust, or tan cloth,\nappears empty. Reaching inside the bag, however,\nreveals the presence of a small, fuzzy object. The bag\nweighs 1/2 pound.\nYou can use an action to pull the fuzzy object from\nthe bag and throw it up to 20 feet. When the object\nlands, it transforms into a creature you determine by\nrolling a d8 and consulting the table that\ncorresponds to the bag’s color. The creature\nvanishes at the next dawn or when it is reduced to 0\nhit points.\nThe creature is friendly to you and your\ncompanions, and it acts on your turn. You can use a\nbonus action to command how the creature moves\nand what action it takes on its next turn, or to give it\ngeneral orders, such as to attack your enemies. In\nthe absence of such orders, the creature acts in a\nfashion appropriate to its nature.\nOnce three fuzzy objects have been pulled from\nthe bag, the bag can’t be used again until the next\ndawn.\nGray Bag of Tricks\nd8 Creature\n1 Weasel\n2 Giant rat\n3 Badger\n4 Boar\n5 Panther\n6 Giant badger\n7 Dire wolf\n8 Giant elk\nRust Bag of Tricks\nd8 Creature\n1 Rat\n2 Owl\n3 Mastiff\n4 Goat\n5 Giant goat\n6 Giant boar\n7 Lion\n8 Brown bear\nTan Bag of Tricks\nd8 Creature\n1 Jackal\n2 Ape\n3 Baboon\n4 Axe beak\n5 Black bear\n6 Giant weasel\n7 Giant hyena\n8 Tiger",
    page: 210,
    endPage: 211,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:bead-of-force",
    edition: "2014",
    name: "Bead of Force",
    metadata: "Wondrous item, rare",
    rules:
      "This small black sphere measures 3/4 of an inch in\ndiameter and weighs an ounce. Typically, 1d4 + 4\nbeads of force are found together.\nYou can use an action to throw the bead up to 60\nfeet. The bead explodes on impact and is destroyed.\nEach creature within a 10-‐‑foot radius of where the\nbead landed must succeed on a DC 15 Dexterity\nsaving throw or take 5d4 force damage. A sphere of\ntransparent force then encloses the area for 1\nminute. Any creature that failed the save and is\ncompletely within the area is trapped inside this\nsphere. Creatures that succeeded on the save, or are\npartially within the area, are pushed away from the\ncenter of the sphere until they are no longer inside it.\nOnly breathable air can pass through the sphere’s\nwall. No attack or other effect can.\nAn enclosed creature can use its action to push\nagainst the sphere’s wall, moving the sphere up to\nhalf the creature’s walking speed. The sphere can be\npicked up, and its magic causes it to weigh only 1\npound, regardless of the weight of creatures inside.",
    page: 211,
    endPage: 211,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:belt-of-dwarvenkind",
    edition: "2014",
    name: "Belt of Dwarvenkind",
    metadata: "Wondrous item, rare (requires attunement)",
    rules:
      "While wearing this belt, you gain the following\nbenefits:\n• Your Constitution score increases by 2, to a\nmaximum of 20.\n• You have advantage on Charisma (Persuasion)\nchecks made to interact with dwarves.\nIn addition, while attuned to the belt, you have a 50\npercent chance each day at dawn of growing a full\nbeard if you’re capable of growing one, or a visibly\nthicker beard if you already have one.\nIf you aren’t a dwarf, you gain the following\nadditional benefits while wearing the belt:\n• You have advantage on saving throws against\npoison, and you have resistance against poison\ndamage.\n• You have darkvision out to a range of 60 feet.\n• You can speak, read, and write Dwarvish.",
    page: 211,
    endPage: 211,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:belt-of-giant-strength",
    edition: "2014",
    name: "Belt of Giant Strength",
    metadata: "Wondrous item, rarity varies (requires attunement)",
    rules:
      "While wearing this belt, your Strength score changes\nto a score granted by the belt. If your Strength is\nalready equal to or greater than the belt’s score, the\nitem has no effect on you.\nSix varieties of this belt exist, corresponding with\nand having rarity according to the six kinds of true\ngiants. The belt of stone giant strength and the belt of\nfrost giant strength look different, but they have the\nsame effect.\nType Strength Rarity\nHill giant 21 Rare\nStone/frost giant 23 Very rare\nFire giant 25 Very rare\nCloud giant 27 Legendary\nStorm giant 29 Legendary",
    page: 211,
    endPage: 211,
    category: "wondrous",
    rarities: [],
    rarityVaries: true,
    attunement: true
  },
  {
    id: "srd51:berserker-axe",
    edition: "2014",
    name: "Berserker Axe",
    metadata: "Weapon (any axe), rare (requires attunement)",
    rules:
      "You gain a +1 bonus to attack and damage rolls\nmade with this magic weapon. In addition, while you\nare attuned to this weapon, your hit point maximum\nincreases by 1 for each level you have attained.\nCurse. This axe is cursed, and becoming attuned to\nit extends the curse to you. As long as you remain\ncursed, you are unwilling to part with the axe,\nkeeping it within reach at all times. You also have\ndisadvantage on attack rolls with weapons other\nthan this one, unless no foe is within 60 feet of you\nthat you can see or hear.\nWhenever a hostile creature damages you while\nthe axe is in your possession, you must succeed on a\nDC 15 Wisdom saving throw or go berserk. While\nberserk, you must use your action each round to\nattack the creature nearest to you with the axe. If\nyou can make extra attacks as part of the Attack\naction, you use those extra attacks, moving to attack\nthe next nearest creature after you fell your current\ntarget. If you have multiple possible targets, you\nattack one at random. You are berserk until you start\nyour turn with no creatures within 60 feet of you\nthat you can see or hear.",
    page: 211,
    endPage: 212,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:boots-of-elvenkind",
    edition: "2014",
    name: "Boots of Elvenkind",
    metadata: "Wondrous item, uncommon",
    rules:
      "While you wear these boots, your steps make no\nsound, regardless of the surface you are moving\nacross. You also have advantage on Dexterity\n(Stealth) checks that rely on moving silently.",
    page: 212,
    endPage: 212,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:boots-of-levitation",
    edition: "2014",
    name: "Boots of Levitation",
    metadata: "Wondrous item, rare (requires attunement)",
    rules: "While you wear these boots, you can use an action to\ncast the levitate spell on yourself at will.",
    page: 212,
    endPage: 212,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:boots-of-speed",
    edition: "2014",
    name: "Boots of Speed",
    metadata: "Wondrous item, rare (requires attunement)",
    rules:
      "While you wear these boots, you can use a bonus\naction and click the boots’ heels together. If you do,\nthe boots double your walking speed, and any\ncreature that makes an opportunity attack against\nyou has disadvantage on the attack roll. If you click\nyour heels together again, you end the effect.\nWhen the boots’ property has been used for a total\nof 10 minutes, the magic ceases to function until you\nfinish a long rest.",
    page: 212,
    endPage: 212,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:boots-of-striding-and-springing",
    edition: "2014",
    name: "Boots of Striding and Springing",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "While you wear these boots, your walking speed\nbecomes 30 feet, unless your walking speed is higher,\nand your speed isn’t reduced if you are encumbered\nor wearing heavy armor. In addition, you can jump\nthree times the normal distance, though you can’t\njump farther than your remaining movement would\nallow.",
    page: 212,
    endPage: 212,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:boots-of-the-winterlands",
    edition: "2014",
    name: "Boots of the Winterlands",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "These furred boots are snug and feel quite warm.\nWhile you wear them, you gain the following\nbenefits:\n• You have resistance to cold damage.\n• You ignore difficult terrain created by ice or snow.\n• You can tolerate temperatures as low as −50\ndegrees Fahrenheit without any additional\nprotection. If you wear heavy clothes, you can\ntolerate temperatures as low as −100 degrees\nFahrenheit.",
    page: 212,
    endPage: 212,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:bowl-of-commanding-water-elementals",
    edition: "2014",
    name: "Bowl of Commanding Water Elementals",
    metadata: "Wondrous item, rare",
    rules:
      "While this bowl is filled with water, you can use an\naction to speak the bowl’s command word and\nsummon a water elemental, as if you had cast the\nconjure elemental spell. The bowl can’t be used this\nway again until the next dawn.\nThe bowl is about 1 foot in diameter and half as\ndeep. It weighs 3 pounds and holds about 3 gallons.",
    page: 212,
    endPage: 212,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:bracers-of-archery",
    edition: "2014",
    name: "Bracers of Archery",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "While wearing these bracers, you have proficiency\nwith the longbow and shortbow, and you gain a +2\nbonus to damage rolls on ranged attacks made with\nsuch weapons.",
    page: 212,
    endPage: 212,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:bracers-of-defense",
    edition: "2014",
    name: "Bracers of Defense",
    metadata: "Wondrous item, rare (requires attunement)",
    rules: "While wearing these bracers, you gain a +2 bonus to\nAC if you are wearing no armor and using no shield.",
    page: 212,
    endPage: 212,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:brazier-of-commanding-fire-elementals",
    edition: "2014",
    name: "Brazier of Commanding Fire Elementals",
    metadata: "Wondrous item, rare",
    rules:
      "While a fire burns in this brass brazier, you can use\nan action to speak the brazier’s command word and\nsummon a fire elemental, as if you had cast the\nconjure elemental spell. The brazier can’t be used\nthis way again until the next dawn.\nThe brazier weighs 5 pounds.",
    page: 212,
    endPage: 212,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:brooch-of-shielding",
    edition: "2014",
    name: "Brooch of Shielding",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "While wearing this brooch, you have resistance to\nforce damage, and you have immunity to damage\nfrom the magic missile spell.",
    page: 212,
    endPage: 212,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:broom-of-flying",
    edition: "2014",
    name: "Broom of Flying",
    metadata: "Wondrous item, uncommon",
    rules:
      "This wooden broom, which weighs 3 pounds,\nfunctions like a mundane broom until you stand\nastride it and speak its command word. It then\nhovers beneath you and can be ridden in the air. It\nhas a flying speed of 50 feet. It can carry up to 400\npounds, but its flying speed becomes 30 feet while\ncarrying over 200 pounds. The broom stops\nhovering when you land.\nYou can send the broom to travel alone to a\ndestination within 1 mile of you if you speak the\ncommand word, name the location, and are familiar\nwith that place. The broom comes back to you when\nyou speak another command word, provided that\nthe broom is still within 1 mile of you.",
    page: 213,
    endPage: 213,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:candle-of-invocation",
    edition: "2014",
    name: "Candle of Invocation",
    metadata: "Wondrous item, very rare (requires attunement)",
    rules:
      "This slender taper is dedicated to a deity and shares\nthat deity’s alignment. The candle’s alignment can be\ndetected with the detect evil and good spell. The GM\nchooses the god and associated alignment or\ndetermines the alignment randomly.\nd20 Alignment\n1–2 Chaotic evil\n3–4 Chaotic neutral\n5–7 Chaotic good\n8–9 Neutral evil\n10–11 Neutral\n12–13 Neutral good\n14–15 Lawful evil\n16–17 Lawful neutral\n18–20 Lawful good\nThe candle’s magic is activated when the candle is\nlit, which requires an action. After burning for 4\nhours, the candle is destroyed. You can snuff it out\nearly for use at a later time. Deduct the time it\nburned in increments of 1 minute from the candle’s\ntotal burn time.\nWhile lit, the candle sheds dim light in a 30-‐‑foot\nradius. Any creature within that light whose\nalignment matches that of the candle makes attack\nrolls, saving throws, and ability checks with\nadvantage. In addition, a cleric or druid in the light\nwhose alignment matches the candle’s can cast 1st-‐‑\nlevel spells he or she has prepared without\nexpending spell slots, though the spell’s effect is as if\ncast with a 1st-‐‑level slot.\nAlternatively, when you light the candle for the\nfirst time, you can cast the gate spell with it. Doing so\ndestroys the candle.",
    page: 213,
    endPage: 213,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:cape-of-the-mountebank",
    edition: "2014",
    name: "Cape of the Mountebank",
    metadata: "Wondrous item, rare",
    rules:
      "This cape smells faintly of brimstone. While wearing\nit, you can use it to cast the dimension door spell as\nan action. This property of the cape can’t be used\nagain until the next dawn.\nWhen you disappear, you leave behind a cloud of\nsmoke, and you appear in a similar cloud of smoke at\nyour destination. The smoke lightly obscures the\nspace you left and the space you appear in, and it\ndissipates at the end of your next turn. A light or\nstronger wind disperses the smoke.",
    page: 213,
    endPage: 213,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:carpet-of-flying",
    edition: "2014",
    name: "Carpet of Flying",
    metadata: "Wondrous item, very rare",
    rules:
      "You can speak the carpet’s command word as an\naction to make the carpet hover and fly. It moves\naccording to your spoken directions, provided that\nyou are within 30 feet of it.\nFour sizes of carpet of flying exist. The GM chooses\nthe size of a given carpet or determines it randomly.\nd100 Size Capacity Flying Speed\n01–20 3 ft. × 5 ft. 200 lb. 80 feet\n21–55 4 ft. × 6 ft. 400 lb. 60 feet\n56–80 5 ft. × 7 ft. 600 lb. 40 feet\n81–100 6 ft. × 9 ft. 800 lb. 30 feet\nA carpet can carry up to twice the weight shown\non the table, but it flies at half speed if it carries\nmore than its normal capacity.",
    page: 213,
    endPage: 213,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:censer-of-controlling-air-elementals",
    edition: "2014",
    name: "Censer of Controlling Air Elementals",
    metadata: "Wondrous item, rare",
    rules:
      "While incense is burning in this censer, you can use\nan action to speak the censer’s command word and\nsummon an air elemental, as if you had cast the\nconjure elemental spell. The censer can’t be used this\nway again until the next dawn.\nThis 6-‐‑inch-‐‑wide, 1-‐‑foot-‐‑high vessel resembles a\nchalice with a decorated lid. It weighs 1 pound.",
    page: 213,
    endPage: 213,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:chime-of-opening",
    edition: "2014",
    name: "Chime of Opening",
    metadata: "Wondrous item, rare",
    rules:
      "This hollow metal tube measures about 1 foot long\nand weighs 1 pound. You can strike it as an action,\npointing it at an object within 120 feet of you that\ncan be opened, such as a door, lid, or lock. The chime\nissues a clear tone, and one lock or latch on the\nobject opens unless the sound can’t reach the object.\nIf no locks or latches remain, the object itself opens.\nThe chime can be used ten times. After the tenth\ntime, it cracks and becomes useless.",
    page: 213,
    endPage: 214,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:circlet-of-blasting",
    edition: "2014",
    name: "Circlet of Blasting",
    metadata: "Wondrous item, uncommon",
    rules:
      "While wearing this circlet, you can use an action to\ncast the scorching ray spell with it. When you make\nthe spell’s attacks, you do so with an attack bonus of\n+5. The circlet can’t be used this way again until the\nnext dawn.",
    page: 214,
    endPage: 214,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:cloak-of-arachnida",
    edition: "2014",
    name: "Cloak of Arachnida",
    metadata: "Wondrous item, very rare (requires attunement)",
    rules:
      "This fine garment is made of black silk interwoven\nwith faint silvery threads. While wearing it, you gain\nthe following benefits:\n• You have resistance to poison damage.\n• You have a climbing speed equal to your walking\nspeed.\n• You can move up, down, and across vertical\nsurfaces and upside down along ceilings, while\nleaving your hands free.\n• You can’t be caught in webs of any sort and can\nmove through webs as if they were difficult terrain.\n• You can use an action to cast the web spell (save\nDC 13). The web created by the spell fills twice its\nnormal area. Once used, this property of the cloak\ncan’t be used again until the next dawn.",
    page: 214,
    endPage: 214,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:cloak-of-displacement",
    edition: "2014",
    name: "Cloak of Displacement",
    metadata: "Wondrous item, rare (requires attunement)",
    rules:
      "While you wear this cloak, it projects an illusion that\nmakes you appear to be standing in a place near\nyour actual location, causing any creature to have\ndisadvantage on attack rolls against you. If you take\ndamage, the property ceases to function until the\nstart of your next turn. This property is suppressed\nwhile you are incapacitated, restrained, or otherwise\nunable to move.",
    page: 214,
    endPage: 214,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:cloak-of-elvenkind",
    edition: "2014",
    name: "Cloak of Elvenkind",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "While you wear this cloak with its hood up, Wisdom\n(Perception) checks made to see you have\ndisadvantage, and you have advantage on Dexterity\n(Stealth) checks made to hide, as the cloak’s color\nshifts to camouflage you. Pulling the hood up or\ndown requires an action.",
    page: 214,
    endPage: 214,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:cloak-of-protection",
    edition: "2014",
    name: "Cloak of Protection",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules: "You gain a +1 bonus to AC and saving throws while\nyou wear this cloak.",
    page: 214,
    endPage: 214,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:cloak-of-the-bat",
    edition: "2014",
    name: "Cloak of the Bat",
    metadata: "Wondrous item, rare (requires attunement)",
    rules:
      "While wearing this cloak, you have advantage on\nDexterity (Stealth) checks. In an area of dim light or\ndarkness, you can grip the edges of the cloak with\nboth hands and use it to fly at a speed of 40 feet. If\nyou ever fail to grip the cloak’s edges while flying in\nthis way, or if you are no longer in dim light or\ndarkness, you lose this flying speed.\nWhile wearing the cloak in an area of dim light or\ndarkness, you can use your action to cast polymorph\non yourself, transforming into a bat. While you are in\nthe form of the bat, you retain your Intelligence,\nWisdom, and Charisma scores. The cloak can’t be\nused this way again until the next dawn.",
    page: 214,
    endPage: 214,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:cloak-of-the-manta-ray",
    edition: "2014",
    name: "Cloak of the Manta Ray",
    metadata: "Wondrous item, uncommon",
    rules:
      "While wearing this cloak with its hood up, you can\nbreathe underwater, and you have a swimming\nspeed of 60 feet. Pulling the hood up or down\nrequires an action.",
    page: 214,
    endPage: 214,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:crystal-ball",
    edition: "2014",
    name: "Crystal Ball",
    metadata: "Wondrous item, very rare or legendary (requires attunement)",
    rules:
      "The typical crystal ball, a very rare item, is about 6\ninches in diameter. While touching it, you can cast\nthe scrying spell (save DC 17) with it.\nThe following crystal ball variants are legendary\nitems and have additional properties.\nCrystal Ball of Mind Reading. You can use an\naction to cast the detect thoughts spell (save DC 17)\nwhile you are scrying with the crystal ball, targeting\ncreatures you can see within 30 feet of the spell’s\nsensor. You don’t need to concentrate on this detect\nthoughts to maintain it during its duration, but it\nends if scrying ends.\nCrystal Ball of Telepathy. While scrying with the\ncrystal ball, you can communicate telepathically with\ncreatures you can see within 30 feet of the spell’s\nsensor. You can also use an action to cast the\nsuggestion spell (save DC 17) through the sensor on\none of those creatures. You don’t need to\nconcentrate on this suggestion to maintain it during\nits duration, but it ends if scrying ends. Once used,\nthe suggestion power of the crystal ball can’t be used\nagain until the next dawn.\nCrystal Ball of True Seeing. While scrying with\nthe crystal ball, you have truesight with a radius of\n120 feet centered on the spell’s sensor.",
    page: 214,
    endPage: 215,
    category: "wondrous",
    rarities: ["veryRare", "legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:cube-of-force",
    edition: "2014",
    name: "Cube of Force",
    metadata: "Wondrous item, rare (requires attunement)",
    rules:
      "This cube is about an inch across. Each face has a\ndistinct marking on it that can be pressed. The cube\nstarts with 36 charges, and it regains 1d20 expended\ncharges daily at dawn.\nYou can use an action to press one of the cube’s\nfaces, expending a number of charges based on the\nchosen face, as shown in the Cube of Force Faces\ntable. Each face has a different effect. If the cube has\ninsufficient charges remaining, nothing happens.\nOtherwise, a barrier of invisible force springs into\nexistence, forming a cube 15 feet on a side. The\nbarrier is centered on you, moves with you, and lasts\nfor 1 minute, until you use an action to press the\ncube’s sixth face, or the cube runs out of charges.\nYou can change the barrier’s effect by pressing a\ndifferent face of the cube and expending the\nrequisite number of charges, resetting the duration.\nIf your movement causes the barrier to come into\ncontact with a solid object that can’t pass through\nthe cube, you can’t move any closer to that object as\nlong as the barrier remains.\nCube of Force Faces\nFace Charges Effect\n1 1 Gases, wind, and fog can’t pass through\nthe barrier.\n2 2 Nonliving matter can’t pass through the\nbarrier. Walls, floors, and ceilings can pass\nthrough at your discretion.\n3 3 Living matter can’t pass through the\nbarrier.\n4 4 Spell effects can’t pass through the barrier.\n5 5 Nothing can pass through the barrier.\nWalls, floors, and ceilings can pass through\nat your discretion.\n6 0 The barrier deactivates.\nThe cube loses charges when the barrier is\ntargeted by certain spells or comes into contact with\ncertain spell or magic item effects, as shown in the\ntable below.\nSpell or Item Charges Lost\nDisintegrate 1d12\nHorn of blasting 1d10\nPasswall 1d6\nPrismatic spray 1d20\nWall of fire 1d4",
    page: 215,
    endPage: 215,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:cubic-gate",
    edition: "2014",
    name: "Cubic Gate",
    metadata: "Wondrous item, legendary",
    rules:
      "This cube is 3 inches across and radiates palpable\nmagical energy. The six sides of the cube are each\nkeyed to a different plane of existence, one of which\nis the Material Plane. The other sides are linked to\nplanes determined by the GM.\nYou can use an action to press one side of the cube\nto cast the gate spell with it, opening a portal to the\nplane keyed to that side. Alternatively, if you use an\naction to press one side twice, you can cast the plane\nshift spell (save DC 17) with the cube and transport\nthe targets to the plane keyed to that side.\nThe cube has 3 charges. Each use of the cube\nexpends 1 charge. The cube regains 1d3 expended\ncharges daily at dawn.",
    page: 215,
    endPage: 215,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:dagger-of-venom",
    edition: "2014",
    name: "Dagger of Venom",
    metadata: "Weapon (dagger), rare",
    rules:
      "You gain a +1 bonus to attack and damage rolls\nmade with this magic weapon.\nYou can use an action to cause thick, black poison\nto coat the blade. The poison remains for 1 minute\nor until an attack using this weapon hits a creature.\nThat creature must succeed on a DC 15 Constitution\nsaving throw or take 2d10 poison damage and\nbecome poisoned for 1 minute. The dagger can’t be\nused this way again until the next dawn.",
    page: 215,
    endPage: 215,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:dancing-sword",
    edition: "2014",
    name: "Dancing Sword",
    metadata: "Weapon (any sword), very rare (requires attunement)",
    rules:
      "You can use a bonus action to toss this magic sword\ninto the air and speak the command word. When you\ndo so, the sword begins to hover, flies up to 30 feet,\nand attacks one creature of your choice within 5 feet\nof it. The sword uses your attack roll and ability\nscore modifier to damage rolls.\nWhile the sword hovers, you can use a bonus\naction to cause it to fly up to 30 feet to another spot\nwithin 30 feet of you. As part of the same bonus\naction, you can cause the sword to attack one\ncreature within 5 feet of it.\nAfter the hovering sword attacks for the fourth\ntime, it flies up to 30 feet and tries to return to your\nhand. If you have no hand free, it falls to the ground\nat your feet. If the sword has no unobstructed path\nto you, it moves as close to you as it can and then\nfalls to the ground. It also ceases to hover if you\ngrasp it or move more than 30 feet away from it.",
    page: 215,
    endPage: 216,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:decanter-of-endless-water",
    edition: "2014",
    name: "Decanter of Endless Water",
    metadata: "Wondrous item, uncommon",
    rules:
      "This stoppered flask sloshes when shaken, as if it\ncontains water. The decanter weighs 2 pounds.\nYou can use an action to remove the stopper and\nspeak one of three command words, whereupon an\namount of fresh water or salt water (your choice)\npours out of the flask. The water stops pouring out at\nthe start of your next turn. Choose from the\nfollowing options:\n• “Stream” produces 1 gallon of water.\n• “Fountain” produces 5 gallons of water.\n• “Geyser” produces 30 gallons of water that gushes\nforth in a geyser 30 feet long and 1 foot wide. As a\nbonus action while holding the decanter, you can\naim the geyser at a creature you can see within 30\nfeet of you. The target must succeed on a DC 13\nStrength saving throw or take 1d4 bludgeoning\ndamage and fall prone. Instead of a creature, you\ncan target an object that isn’t being worn or\ncarried and that weighs no more than 200 pounds.\nThe object is either knocked over or pushed up to\n15 feet away from you.",
    page: 216,
    endPage: 216,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:deck-of-illusions",
    edition: "2014",
    name: "Deck of Illusions",
    metadata: "Wondrous item, uncommon",
    rules:
      "This box contains a set of parchment cards. A full\ndeck has 34 cards. A deck found as treasure is\nusually missing 1d20 − 1 cards.\nThe magic of the deck functions only if cards are\ndrawn at random (you can use an altered deck of\nplaying cards to simulate the deck). You can use an\naction to draw a card at random from the deck and\nthrow it to the ground at a point within 30 feet of\nyou.\nAn illusion of one or more creatures forms over\nthe thrown card and remains until dispelled. An\nillusory creature appears real, of the appropriate\nsize, and behaves as if it were a real creature except\nthat it can do no harm. While you are within 120 feet\nof the illusory creature and can see it, you can use an\naction to move it magically anywhere within 30 feet\nof its card. Any physical interaction with the illusory\ncreature reveals it to be an illusion, because objects\npass through it. Someone who uses an action to\nvisually inspect the creature identifies it as illusory\nwith a successful DC 15 Intelligence (Investigation)\ncheck. The creature then appears translucent.\nThe illusion lasts until its card is moved or the\nillusion is dispelled. When the illusion ends, the\nimage on its card disappears, and that card can’t be\nused again.\nPlaying Card Illusion\nAce of hearts Red dragon\nKing of hearts Knight and four guards\nQueen of hearts Succubus or incubus\nJack of hearts Druid\nTen of hearts Cloud giant\nNine of hearts Ettin\nEight of hearts Bugbear\nTwo of hearts Goblin\nAce of diamonds Beholder\nKing of diamonds Archmage and mage apprentice\nQueen of diamonds Night hag\nJack of diamonds Assassin\nTen of diamonds Fire giant\nNine of diamonds Ogre mage\nEight of diamonds Gnoll\nTwo of diamonds Kobold\nAce of spades Lich\nKing of spades Priest and two acolytes\nQueen of spades Medusa\nJack of spades Veteran\nTen of spades Frost giant\nNine of spades Troll\nEight of spades Hobgoblin\nTwo of spades Goblin\nAce of clubs Iron golem\nKing of clubs Bandit captain and three bandits\nQueen of clubs Erinyes\nJack of clubs Berserker\nTen of clubs Hill giant\nNine of clubs Ogre\nEight of clubs Orc\nTwo of clubs Kobold\nJokers (2) You (the deck’s owner)",
    page: 216,
    endPage: 216,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:deck-of-many-things",
    edition: "2014",
    name: "Deck of Many Things",
    metadata: "Wondrous item, legendary",
    rules:
      "Usually found in a box or pouch, this deck contains a\nnumber of cards made of ivory or vellum. Most (75\npercent) of these decks have only thirteen cards, but\nthe rest have twenty-‐‑two.\nBefore you draw a card, you must declare how\nmany cards you intend to draw and then draw them\nrandomly (you can use an altered deck of playing\ncards to simulate the deck). Any cards drawn in\nexcess of this number have no effect. Otherwise, as\nsoon as you draw a card from the deck, its magic\ntakes effect. You must draw each card no more than\n1 hour after the previous draw. If you fail to draw\nthe chosen number, the remaining number of cards\nfly from the deck on their own and take effect all at\nonce.\nOnce a card is drawn, it fades from existence.\nUnless the card is the Fool or the Jester, the card\nreappears in the deck, making it possible to draw the\nsame card twice.\nPlaying Card Card\nAce of diamonds Vizier*\nKing of diamonds Sun\nQueen of diamonds Moon\nJack of diamonds Star\nTwo of diamonds Comet*\nAce of hearts The Fates*\nKing of hearts Throne\nQueen of hearts Key\nJack of hearts Knight\nTwo of hearts Gem*\nAce of clubs Talons*\nKing of clubs The Void\nQueen of clubs Flames\nJack of clubs Skull\nTwo of clubs Idiot*\nAce of spades Donjon*\nKing of spades Ruin\nQueen of spades Euryale\nJack of spades Rogue\nTwo of spades Balance*\nJoker (with TM) Fool*\nJoker (without TM) Jester\n*Found only in a deck with twenty-‐two cards\nBalance. Your mind suffers a wrenching alteration,\ncausing your alignment to change. Lawful becomes\nchaotic, good becomes evil, and vice versa. If you are\ntrue neutral or unaligned, this card has no effect on\nyou.\nComet. If you single-‐‑handedly defeat the next\nhostile monster or group of monsters you encounter,\nyou gain experience points enough to gain one level.\nOtherwise, this card has no effect.\nDonjon. You disappear and become entombed in a\nstate of suspended animation in an extradimensional\nsphere. Everything you were wearing and carrying\nstays behind in the space you occupied when you\ndisappeared. You remain imprisoned until you are\nfound and removed from the sphere. You can’t be\nlocated by any divination magic, but a wish spell can\nreveal the location of your prison. You draw no more\ncards.\nEuryale. The card’s medusa-‐‑like visage curses you.\nYou take a −2 penalty on saving throws while cursed\nin this way. Only a god or the magic of The Fates\ncard can end this curse.\nThe Fates. Reality’s fabric unravels and spins\nanew, allowing you to avoid or erase one event as if\nit never happened. You can use the card’s magic as\nsoon as you draw the card or at any other time\nbefore you die.\nFlames. A powerful devil becomes your enemy.\nThe devil seeks your ruin and plagues your life,\nsavoring your suffering before attempting to slay\nyou. This enmity lasts until either you or the devil\ndies.\nFool. You lose 10,000 XP, discard this card, and\ndraw from the deck again, counting both draws as\none of your declared draws. If losing that much XP\nwould cause you to lose a level, you instead lose an\namount that leaves you with just enough XP to keep\nyour level.\nGem. Twenty-‐‑five pieces of jewelry worth 2,000\ngp each or fifty gems worth 1,000 gp each appear at\nyour feet.\nIdiot. Permanently reduce your Intelligence by\n1d4 + 1 (to a minimum score of 1). You can draw one\nadditional card beyond your declared draws.\nJester. You gain 10,000 XP, or you can draw two\nadditional cards beyond your declared draws.\nKey. A rare or rarer magic weapon with which you\nare proficient appears in your hands. The GM\nchooses the weapon.\nKnight. You gain the service of a 4th-‐‑level fighter\nwho appears in a space you choose within 30 feet of\nyou. The fighter is of the same race as you and serves\nyou loyally until death, believing the fates have\ndrawn him or her to you. You control this character.\nMoon. You are granted the ability to cast the wish\nspell 1d3 times.\nRogue. A nonplayer character of the GM’s choice\nbecomes hostile toward you. The identity of your\nnew enemy isn’t known until the NPC or someone\nelse reveals it. Nothing less than a wish spell or\ndivine intervention can end the NPC’s hostility\ntoward you.\nRuin. All forms of wealth that you carry or own,\nother than magic items, are lost to you. Portable\nproperty vanishes. Businesses, buildings, and land\nyou own are lost in a way that alters reality the least.\nAny documentation that proves you should own\nsomething lost to this card also disappears.\nSkull. You summon an avatar of death—a ghostly\nhumanoid skeleton clad in a tattered black robe and\ncarrying a spectral scythe. It appears in a space of\nthe GM’s choice within 10 feet of you and attacks you,\nwarning all others that you must win the battle alone.\nThe avatar fights until you die or it drops to 0 hit\npoints, whereupon it disappears. If anyone tries to\nhelp you, the helper summons its own avatar of\ndeath. A creature slain by an avatar of death can’t be\nrestored to life.\nAvatar of Death\nMedium undead, neutral evil\nArmor Class 20\nHit Points half the hit point maximum of its summoner\nSpeed 60 ft., fly 60 ft. (hover)\nSTR DEX CON INT WIS CHA\n16 (+3) 16 (+3) 16 (+3) 16 (+3) 16 (+3) 16 (+3)\nDamage Immunities necrotic, poison\nCondition Immunities charmed, frightened, paralyzed,\npetrified, poisoned, unconscious\nSenses darkvision 60 ft., truesight 60 ft., passive\nPerception 13\nLanguages all languages known to its summoner\nChallenge — (0 XP)\nIncorporeal Movement. The avatar can move through\nother creatures and objects as if they were difficult\nterrain. It takes 5 (1d10) force damage if it ends its turn\ninside an object.\nTurning Immunity. The avatar is immune to features\nthat turn undead.\nActions\nReaping Scythe. The avatar sweeps its spectral scythe\nthrough a creature within 5 feet of it, dealing 7 (1d8 +\n3) slashing damage plus 4 (1d8) necrotic damage.\nStar. Increase one of your ability scores by 2. The\nscore can exceed 20 but can’t exceed 24.\nSun. You gain 50,000 XP, and a wondrous item\n(which the GM determines randomly) appears in\nyour hands.\nTalons. Every magic item you wear or carry\ndisintegrates. Artifacts in your possession aren’t\ndestroyed but do vanish.\nThrone. You gain proficiency in the Persuasion\nskill, and you double your proficiency bonus on\nchecks made with that skill. In addition, you gain\nrightful ownership of a small keep somewhere in the\nworld. However, the keep is currently in the hands of\nmonsters, which you must clear out before you can\nclaim the keep as yours.\nVizier. At any time you choose within one year of\ndrawing this card, you can ask a question in\nmeditation and mentally receive a truthful answer to\nthat question. Besides information, the answer helps\nyou solve a puzzling problem or other dilemma. In\nother words, the knowledge comes with wisdom on\nhow to apply it.\nThe Void. This black card spells disaster. Your soul\nis drawn from your body and contained in an object\nin a place of the GM’s choice. One or more powerful\nbeings guard the place. While your soul is trapped in\nthis way, your body is incapacitated. A wish spell\ncan’t restore your soul, but the spell reveals the\nlocation of the object that holds it. You draw no more\ncards.",
    page: 216,
    endPage: 218,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:defender",
    edition: "2014",
    name: "Defender",
    metadata: "Weapon (any sword), legendary (requires attunement)",
    rules:
      "You gain a +3 bonus to attack and damage rolls\nmade with this magic weapon.\nThe first time you attack with the sword on each of\nyour turns, you can transfer some or all of the\nsword’s bonus to your Armor Class, instead of using\nthe bonus on any attacks that turn. For example, you\ncould reduce the bonus to your attack and damage\nrolls to +1 and gain a +2 bonus to AC. The adjusted\nbonuses remain in effect until the start of your next\nturn, although you must hold the sword to gain a\nbonus to AC from it.",
    page: 218,
    endPage: 218,
    category: "weapon",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:demon-armor",
    edition: "2014",
    name: "Demon Armor",
    metadata: "Armor (plate), very rare (requires attunement)",
    rules:
      "While wearing this armor, you gain a +1 bonus to AC,\nand you can understand and speak Abyssal. In\naddition, the armor’s clawed gauntlets turn unarmed\nstrikes with your hands into magic weapons that\ndeal slashing damage, with a +1 bonus to attack rolls\nand damage rolls and a damage die of 1d8.\nCurse. Once you don this cursed armor, you can’t\ndoff it unless you are targeted by the remove curse\nspell or similar magic. While wearing the armor, you\nhave disadvantage on attack rolls against demons\nand on saving throws against their spells and special\nabilities.",
    page: 218,
    endPage: 218,
    category: "armor",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:dimensional-shackles",
    edition: "2014",
    name: "Dimensional Shackles",
    metadata: "Wondrous item, rare",
    rules:
      "You can use an action to place these shackles on an\nincapacitated creature. The shackles adjust to fit a\ncreature of Small to Large size. In addition to serving\nas mundane manacles, the shackles prevent a\ncreature bound by them from using any method of\nextradimensional movement, including teleportation\nor travel to a different plane of existence. They don’t\nprevent the creature from passing through an\ninterdimensional portal.\nYou and any creature you designate when you use\nthe shackles can use an action to remove them. Once\nevery 30 days, the bound creature can make a DC 30\nStrength (Athletics) check. On a success, the creature\nbreaks free and destroys the shackles.",
    page: 219,
    endPage: 219,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:dragon-scale-mail",
    edition: "2014",
    name: "Dragon Scale Mail",
    metadata: "Armor (scale mail), very rare (requires attunement)",
    rules:
      "Dragon scale mail is made of the scales of one kind of\ndragon. Sometimes dragons collect their cast-‐‑off\nscales and gift them to humanoids. Other times,\nhunters carefully skin and preserve the hide of a\ndead dragon. In either case, dragon scale mail is\nhighly valued.\nWhile wearing this armor, you gain a +1 bonus to\nAC, you have advantage on saving throws against the\nFrightful Presence and breath weapons of dragons,\nand you have resistance to one damage type that is\ndetermined by the kind of dragon that provided the\nscales (see the table).\nAdditionally, you can focus your senses as an\naction to magically discern the distance and\ndirection to the closest dragon within 30 miles of\nyou that is of the same type as the armor. This\nspecial action can’t be used again until the next\ndawn.\nDragon Resistance Dragon Resistance\nBlack Acid Gold Fire\nBlue Lightning Green Poison\nBrass Fire Red Fire\nBronze Lightning Silver Cold\nCopper Acid White Cold",
    page: 219,
    endPage: 219,
    category: "armor",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:dragon-slayer",
    edition: "2014",
    name: "Dragon Slayer",
    metadata: "Weapon (any sword), rare",
    rules:
      "You gain a +1 bonus to attack and damage rolls\nmade with this magic weapon.\nWhen you hit a dragon with this weapon, the\ndragon takes an extra 3d6 damage of the weapon’s\ntype. For the purpose of this weapon, “dragon”\nrefers to any creature with the dragon type,\nincluding dragon turtles and wyverns.",
    page: 219,
    endPage: 219,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:dust-of-disappearance",
    edition: "2014",
    name: "Dust of Disappearance",
    metadata: "Wondrous item, uncommon",
    rules:
      "Found in a small packet, this powder resembles very\nfine sand. There is enough of it for one use. When\nyou use an action to throw the dust into the air, you\nand each creature and object within 10 feet of you\nbecome invisible for 2d4 minutes. The duration is\nthe same for all subjects, and the dust is consumed\nwhen its magic takes effect. If a creature affected by\nthe dust attacks or casts a spell, the invisibility ends\nfor that creature.",
    page: 219,
    endPage: 219,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:dust-of-dryness",
    edition: "2014",
    name: "Dust of Dryness",
    metadata: "Wondrous item, uncommon",
    rules:
      "This small packet contains 1d6 + 4 pinches of dust.\nYou can use an action to sprinkle a pinch of it over\nwater. The dust turns a cube of water 15 feet on a\nside into one marble-‐‑sized pellet, which floats or\nrests near where the dust was sprinkled. The pellet’s\nweight is negligible.\nSomeone can use an action to smash the pellet\nagainst a hard surface, causing the pellet to shatter\nand release the water the dust absorbed. Doing so\nends that pellet’s magic.\nAn elemental composed mostly of water that is\nexposed to a pinch of the dust must make a DC 13\nConstitution saving throw, taking 10d6 necrotic\ndamage on a failed save, or half as much damage on\na successful one.",
    page: 219,
    endPage: 219,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:dust-of-sneezing-and-choking",
    edition: "2014",
    name: "Dust of Sneezing and Choking",
    metadata: "Wondrous item, uncommon",
    rules:
      "Found in a small container, this powder resembles\nvery fine sand. It appears to be dust of disappearance,\nand an identify spell reveals it to be such. There is\nenough of it for one use.\nWhen you use an action to throw a handful of the\ndust into the air, you and each creature that needs to\nbreathe within 30 feet of you must succeed on a DC\n15 Constitution saving throw or become unable to\nbreathe, while sneezing uncontrollably. A creature\naffected in this way is incapacitated and suffocating.\nAs long as it is conscious, a creature can repeat the\nsaving throw at the end of each of its turns, ending\nthe effect on it on a success. The lesser restoration\nspell can also end the effect on a creature.",
    page: 219,
    endPage: 219,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:dwarven-plate",
    edition: "2014",
    name: "Dwarven Plate",
    metadata: "Armor (plate), very rare",
    rules:
      "While wearing this armor, you gain a +2 bonus to AC.\nIn addition, if an effect moves you against your will\nalong the ground, you can use your reaction to\nreduce the distance you are moved by up to 10 feet.",
    page: 220,
    endPage: 220,
    category: "armor",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:dwarven-thrower",
    edition: "2014",
    name: "Dwarven Thrower",
    metadata: "Weapon (warhammer), very rare (requires attunement by a dwarf)",
    rules:
      "You gain a +3 bonus to attack and damage rolls\nmade with this magic weapon. It has the thrown\nproperty with a normal range of 20 feet and a long\nrange of 60 feet. When you hit with a ranged attack\nusing this weapon, it deals an extra 1d8 damage or, if\nthe target is a giant, 2d8 damage. Immediately after\nthe attack, the weapon flies back to your hand.",
    page: 220,
    endPage: 220,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:efficient-quiver",
    edition: "2014",
    name: "Efficient Quiver",
    metadata: "Wondrous item, uncommon",
    rules:
      "Each of the quiver’s three compartments connects to\nan extradimensional space that allows the quiver to\nhold numerous items while never weighing more\nthan 2 pounds. The shortest compartment can hold\nup to sixty arrows, bolts, or similar objects. The\nmidsize compartment holds up to eighteen javelins\nor similar objects. The longest compartment holds\nup to six long objects, such as bows, quarterstaffs, or\nspears.\nYou can draw any item the quiver contains as if\ndoing so from a regular quiver or scabbard.",
    page: 220,
    endPage: 220,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:efreeti-bottle",
    edition: "2014",
    name: "Efreeti Bottle",
    metadata: "Wondrous item, very rare",
    rules:
      "This painted brass bottle weighs 1 pound. When you\nuse an action to remove the stopper, a cloud of thick\nsmoke flows out of the bottle. At the end of your turn,\nthe smoke disappears with a flash of harmless fire,\nand an efreeti appears in an unoccupied space\nwithin 30 feet of you.\nThe first time the bottle is opened, the GM rolls to\ndetermine what happens.\nd100 Effect\n01–10 The efreeti attacks you. After fighting for 5\nrounds, the efreeti disappears, and the bottle\nloses its magic.\n11–90 The efreeti serves you for 1 hour, doing as you\ncommand. Then the efreeti returns to the bottle,\nand a new stopper contains it. The stopper can’t\nbe removed for 24 hours. The next two times the\nbottle is opened, the same effect occurs. If the\nbottle is opened a fourth time, the efreeti\nescapes and disappears, and the bottle loses its\nmagic.\n91–00 The efreeti can cast the wish spell three times for\nyou. It disappears when it grants the final wish or\nafter 1 hour, and the bottle loses its magic.",
    page: 220,
    endPage: 220,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:elemental-gem",
    edition: "2014",
    name: "Elemental Gem",
    metadata: "Wondrous item, uncommon",
    rules:
      "This gem contains a mote of elemental energy. When\nyou use an action to break the gem, an elemental is\nsummoned as if you had cast the conjure elemental\nspell, and the gem’s magic is lost. The type of gem\ndetermines the elemental summoned by the spell.\nGem Summoned Elemental\nBlue sapphire Air elemental\nYellow diamond Earth elemental\nRed corundum Fire elemental\nEmerald Water elemental",
    page: 220,
    endPage: 220,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:elven-chain",
    edition: "2014",
    name: "Elven Chain",
    metadata: "Armor (chain shirt), rare",
    rules:
      "You gain a +1 bonus to AC while you wear this armor.\nYou are considered proficient with this armor even if\nyou lack proficiency with medium armor.",
    page: 220,
    endPage: 220,
    category: "armor",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:eversmoking-bottle",
    edition: "2014",
    name: "Eversmoking Bottle",
    metadata: "Wondrous item, uncommon",
    rules:
      "Smoke leaks from the lead-‐‑stoppered mouth of this\nbrass bottle, which weighs 1 pound. When you use\nan action to remove the stopper, a cloud of thick\nsmoke pours out in a 60-‐‑foot radius from the bottle.\nThe cloud’s area is heavily obscured. Each minute\nthe bottle remains open and within the cloud, the\nradius increases by 10 feet until it reaches its\nmaximum radius of 120 feet.\nThe cloud persists as long as the bottle is open.\nClosing the bottle requires you to speak its\ncommand word as an action. Once the bottle is\nclosed, the cloud disperses after 10 minutes. A\nmoderate wind (11 to 20 miles per hour) can also\ndisperse the smoke after 1 minute, and a strong\nwind (21 or more miles per hour) can do so after 1\nround.",
    page: 220,
    endPage: 220,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:eyes-of-charming",
    edition: "2014",
    name: "Eyes of Charming",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "These crystal lenses fit over the eyes. They have 3\ncharges. While wearing them, you can expend 1\ncharge as an action to cast the charm person spell\n(save DC 13) on a humanoid within 30 feet of you,\nprovided that you and the target can see each other.\nThe lenses regain all expended charges daily at dawn.",
    page: 220,
    endPage: 221,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:eyes-of-minute-seeing",
    edition: "2014",
    name: "Eyes of Minute Seeing",
    metadata: "Wondrous item, uncommon",
    rules:
      "These crystal lenses fit over the eyes. While wearing\nthem, you can see much better than normal out to a\nrange of 1 foot. You have advantage on Intelligence\n(Investigation) checks that rely on sight while\nsearching an area or studying an object within that\nrange.",
    page: 221,
    endPage: 221,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:eyes-of-the-eagle",
    edition: "2014",
    name: "Eyes of the Eagle",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "These crystal lenses fit over the eyes. While wearing\nthem, you have advantage on Wisdom (Perception)\nchecks that rely on sight. In conditions of clear\nvisibility, you can make out details of even extremely\ndistant creatures and objects as small as 2 feet\nacross.",
    page: 221,
    endPage: 221,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:feather-token",
    edition: "2014",
    name: "Feather Token",
    metadata: "Wondrous item, rare",
    rules:
      "This tiny object looks like a feather. Different types\nof feather tokens exist, each with a different single-‐‑\nuse effect. The GM chooses the kind of token or\ndetermines it randomly.\nd100 Feather Token d100 Feather Token\n01–20 Anchor 51–65 Swan boat\n21–35 Bird 66–90 Tree\n36–50 Fan 91–00 Whip\nAnchor. You can use an action to touch the token\nto a boat or ship. For the next 24 hours, the vessel\ncan’t be moved by any means. Touching the token to\nthe vessel again ends the effect. When the effect ends,\nthe token disappears.\nBird. You can use an action to toss the token 5 feet\ninto the air. The token disappears and an enormous,\nmulticolored bird takes its place. The bird has the\nstatistics of a roc, but it obeys your simple\ncommands and can’t attack. It can carry up to 500\npounds while flying at its maximum speed (16 miles\nan hour for a maximum of 144 miles per day, with a\none-‐‑hour rest for every 3 hours of flying), or 1,000\npounds at half that speed. The bird disappears after\nflying its maximum distance for a day or if it drops to\n0 hit points. You can dismiss the bird as an action.\nFan. If you are on a boat or ship, you can use an\naction to toss the token up to 10 feet in the air. The\ntoken disappears, and a giant flapping fan takes its\nplace. The fan floats and creates a wind strong\nenough to fill the sails of one ship, increasing its\nspeed by 5 miles per hour for 8 hours. You can\ndismiss the fan as an action.\nSwan Boat. You can use an action to touch the\ntoken to a body of water at least 60 feet in diameter.\nThe token disappears, and a 50-‐‑foot-‐‑long, 20-‐‑foot-‐‑\nwide boat shaped like a swan takes its place. The\nboat is self-‐‑propelled and moves across water at a\nspeed of 6 miles per hour. You can use an action\nwhile on the boat to command it to move or to turn\nup to 90 degrees. The boat can carry up to thirty-‐‑two\nMedium or smaller creatures. A Large creature\ncounts as four Medium creatures, while a Huge\ncreature counts as nine. The boat remains for 24\nhours and then disappears. You can dismiss the boat\nas an action.\nTree. You must be outdoors to use this token. You\ncan use an action to touch it to an unoccupied space\non the ground. The token disappears, and in its place\na nonmagical oak tree springs into existence. The\ntree is 60 feet tall and has a 5-‐‑foot-‐‑diameter trunk,\nand its branches at the top spread out in a 20-‐‑foot\nradius.\nWhip. You can use an action to throw the token to\na point within 10 feet of you. The token disappears,\nand a floating whip takes its place. You can then use\na bonus action to make a melee spell attack against a\ncreature within 10 feet of the whip, with an attack\nbonus of +9. On a hit, the target takes 1d6 + 5 force\ndamage.\nAs a bonus action on your turn, you can direct the\nwhip to fly up to 20 feet and repeat the attack\nagainst a creature within 10 feet of it. The whip\ndisappears after 1 hour, when you use an action to\ndismiss it, or when you are incapacitated or die.",
    page: 221,
    endPage: 221,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:figurine-of-wondrous-power",
    edition: "2014",
    name: "Figurine of Wondrous Power",
    metadata: "Wondrous item, rarity by figurine",
    rules:
      "A figurine of wondrous power is a statuette of a beast\nsmall enough to fit in a pocket. If you use an action to\nspeak the command word and throw the figurine to\na point on the ground within 60 feet of you, the\nfigurine becomes a living creature. If the space\nwhere the creature would appear is occupied by\nother creatures or objects, or if there isn’t enough\nspace for the creature, the figurine doesn’t become a\ncreature.\nThe creature is friendly to you and your\ncompanions. It understands your languages and\nobeys your spoken commands. If you issue no\ncommands, the creature defends itself but takes no\nother actions.\nThe creature exists for a duration specific to each\nfigurine. At the end of the duration, the creature\nreverts to its figurine form. It reverts to a figurine\nearly if it drops to 0 hit points or if you use an action\nto speak the command word again while touching it.\nWhen the creature becomes a figurine again, its\nproperty can’t be used again until a certain amount\nof time has passed, as specified in the figurine’s\ndescription.\nBronze Griffon (Rare). This bronze statuette is of\na griffon rampant. It can become a griffon for up to 6\nhours. Once it has been used, it can’t be used again\nuntil 5 days have passed.\nEbony Fly (Rare). This ebony statuette is carved\nin the likeness of a horsefly. It can become a giant fly\nfor up to 12 hours and can be ridden as a mount.\nOnce it has been used, it can’t be used again until 2\ndays have passed.\nGiant Fly\nLarge beast, unaligned\nArmor Class 11\nHit Points 19 (3d10 + 3)\nSpeed 30 ft., fly 60 ft.\nSTR DEX CON INT WIS CHA\n14 (+2) 13 (+1) 13 (+1) 2 (−4) 10 (+0) 3 (−4)\nSenses darkvision 60 ft., passive Perception 10\nLanguages —\nGolden Lions (Rare). These gold statuettes of\nlions are always created in pairs. You can use one\nfigurine or both simultaneously. Each can become a\nlion for up to 1 hour. Once a lion has been used, it\ncan’t be used again until 7 days have passed.\nIvory Goats (Rare). These ivory statuettes of\ngoats are always created in sets of three. Each goat\nlooks unique and functions differently from the\nothers. Their properties are as follows:\n• The goat of traveling can become a Large goat with\nthe same statistics as a riding horse. It has 24\ncharges, and each hour or portion thereof it\nspends in beast form costs 1 charge. While it has\ncharges, you can use it as often as you wish. When\nit runs out of charges, it reverts to a figurine and\ncan’t be used again until 7 days have passed, when\nit regains all its charges.\n• The goat of travail becomes a giant goat for up to 3\nhours. Once it has been used, it can’t be used again\nuntil 30 days have passed.\n• The goat of terror becomes a giant goat for up to 3\nhours. The goat can’t attack, but you can remove\nits horns and use them as weapons. One horn\nbecomes a +1 lance, and the other becomes a +2\nlongsword. Removing a horn requires an action,\nand the weapons disappear and the horns return\nwhen the goat reverts to figurine form. In addition,\nthe goat radiates a 30-‐‑foot-‐‑radius aura of terror\nwhile you are riding it. Any creature hostile to you\nthat starts its turn in the aura must succeed on a\nDC 15 Wisdom saving throw or be frightened of\nthe goat for 1 minute, or until the goat reverts to\nfigurine form. The frightened creature can repeat\nthe saving throw at the end of each of its turns,\nending the effect on itself on a success. Once it\nsuccessfully saves against the effect, a creature is\nimmune to the goat’s aura for the next 24 hours.\nOnce the figurine has been used, it can’t be used\nagain until 15 days have passed.\nMarble Elephant (Rare). This marble statuette is\nabout 4 inches high and long. It can become an\nelephant for up to 24 hours. Once it has been used, it\ncan’t be used again until 7 days have passed.\nObsidian Steed (Very Rare). This polished\nobsidian horse can become a nightmare for up to 24\nhours. The nightmare fights only to defend itself.\nOnce it has been used, it can’t be used again until 5\ndays have passed.\nIf you have a good alignment, the figurine has a 10\npercent chance each time you use it to ignore your\norders, including a command to revert to figurine\nform. If you mount the nightmare while it is ignoring\nyour orders, you and the nightmare are instantly\ntransported to a random location on the plane of\nHades, where the nightmare reverts to figurine form.\nOnyx Dog (Rare). This onyx statuette of a dog can\nbecome a mastiff for up to 6 hours. The mastiff has\nan Intelligence of 8 and can speak Common. It also\nhas darkvision out to a range of 60 feet and can see\ninvisible creatures and objects within that range.\nOnce it has been used, it can’t be used again until 7\ndays have passed.\nSerpentine Owl (Rare). This serpentine statuette\nof an owl can become a giant owl for up to 8 hours.\nOnce it has been used, it can’t be used again until 2\ndays have passed. The owl can telepathically\ncommunicate with you at any range if you and it are\non the same plane of existence.\nSilver Raven (Uncommon). This silver statuette of\na raven can become a raven for up to 12 hours. Once\nit has been used, it can’t be used again until 2 days\nhave passed. While in raven form, the figurine allows\nyou to cast the animal messenger spell on it at will.",
    page: 221,
    endPage: 223,
    category: "wondrous",
    rarities: [],
    rarityVaries: true,
    attunement: false
  },
  {
    id: "srd51:flame-tongue",
    edition: "2014",
    name: "Flame Tongue",
    metadata: "Weapon (any sword), rare (requires attunement)",
    rules:
      "You can use a bonus action to speak this magic\nsword’s command word, causing flames to erupt\nfrom the blade. These flames shed bright light in a\n40-‐‑foot radius and dim light for an additional 40 feet.\nWhile the sword is ablaze, it deals an extra 2d6 fire\ndamage to any target it hits. The flames last until you\nuse a bonus action to speak the command word\nagain or until you drop or sheathe the sword.",
    page: 223,
    endPage: 223,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:folding-boat",
    edition: "2014",
    name: "Folding Boat",
    metadata: "Wondrous item, rare",
    rules:
      "This object appears as a wooden box that measures\n12 inches long, 6 inches wide, and 6 inches deep. It\nweighs 4 pounds and floats. It can be opened to store\nitems inside. This item also has three command\nwords, each requiring you to use an action to speak\nit.\nOne command word causes the box to unfold into\na boat 10 feet long, 4 feet wide, and 2 feet deep. The\nboat has one pair of oars, an anchor, a mast, and a\nlateen sail. The boat can hold up to four Medium\ncreatures comfortably.\nThe second command word causes the box to\nunfold into a ship 24 feet long, 8 feet wide, and 6 feet\ndeep. The ship has a deck, rowing seats, five sets of\noars, a steering oar, an anchor, a deck cabin, and a\nmast with a square sail. The ship can hold fifteen\nMedium creatures comfortably.\nWhen the box becomes a vessel, its weight\nbecomes that of a normal vessel its size, and\nanything that was stored in the box remains in the\nboat.\nThe third command word causes the folding boat\nto fold back into a box, provided that no creatures\nare aboard. Any objects in the vessel that can’t fit\ninside the box remain outside the box as it folds. Any\nobjects in the vessel that can fit inside the box do so.",
    page: 223,
    endPage: 223,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:frost-brand",
    edition: "2014",
    name: "Frost Brand",
    metadata: "Weapon (any sword), very rare (requires attunement)",
    rules:
      "When you hit with an attack using this magic sword,\nthe target takes an extra 1d6 cold damage. In\naddition, while you hold the sword, you have\nresistance to fire damage.\nIn freezing temperatures, the blade sheds bright\nlight in a 10-‐‑foot radius and dim light for an\nadditional 10 feet.\nWhen you draw this weapon, you can extinguish\nall nonmagical flames within 30 feet of you. This\nproperty can be used no more than once per hour.",
    page: 223,
    endPage: 223,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:gauntlets-of-ogre-power",
    edition: "2014",
    name: "Gauntlets of Ogre Power",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "Your Strength score is 19 while you wear these\ngauntlets. They have no effect on you if your\nStrength is already 19 or higher.",
    page: 223,
    endPage: 223,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:gem-of-brightness",
    edition: "2014",
    name: "Gem of Brightness",
    metadata: "Wondrous item, uncommon",
    rules:
      "This prism has 50 charges. While you are holding it,\nyou can use an action to speak one of three\ncommand words to cause one of the following\neffects:\n• The first command word causes the gem to shed\nbright light in a 30-‐‑foot radius and dim light for an\nadditional 30 feet. This effect doesn’t expend a\ncharge. It lasts until you use a bonus action to\nrepeat the command word or until you use\nanother function of the gem.\n• The second command word expends 1 charge and\ncauses the gem to fire a brilliant beam of light at\none creature you can see within 60 feet of you. The\ncreature must succeed on a DC 15 Constitution\nsaving throw or become blinded for 1 minute. The\ncreature can repeat the saving throw at the end of\neach of its turns, ending the effect on itself on a\nsuccess.\n• The third command word expends 5 charges and\ncauses the gem to flare with blinding light in a 30-‐‑\nfoot cone originating from it. Each creature in the\ncone must make a saving throw as if struck by the\nbeam created with the second command word.\nWhen all of the gem’s charges are expended, the gem\nbecomes a nonmagical jewel worth 50 gp.",
    page: 223,
    endPage: 223,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:gem-of-seeing",
    edition: "2014",
    name: "Gem of Seeing",
    metadata: "Wondrous item, rare (requires attunement)",
    rules:
      "This gem has 3 charges. As an action, you can speak\nthe gem’s command word and expend 1 charge. For\nthe next 10 minutes, you have truesight out to 120\nfeet when you peer through the gem.\nThe gem regains 1d3 expended charges daily at\ndawn.",
    page: 223,
    endPage: 223,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:giant-slayer",
    edition: "2014",
    name: "Giant Slayer",
    metadata: "Weapon (any axe or sword), rare",
    rules:
      "You gain a +1 bonus to attack and damage rolls\nmade with this magic weapon.\nWhen you hit a giant with it, the giant takes an\nextra 2d6 damage of the weapon’s type and must\nsucceed on a DC 15 Strength saving throw or fall\nprone. For the purpose of this weapon, “giant” refers\nto any creature with the giant type, including ettins\nand trolls.",
    page: 224,
    endPage: 224,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:glamoured-studded-leather",
    edition: "2014",
    name: "Glamoured Studded Leather",
    metadata: "Armor (studded leather), rare",
    rules:
      "While wearing this armor, you gain a +1 bonus to AC.\nYou can also use a bonus action to speak the armor’s\ncommand word and cause the armor to assume the\nappearance of a normal set of clothing or some other\nkind of armor. You decide what it looks like,\nincluding color, style, and accessories, but the armor\nretains its normal bulk and weight. The illusory\nappearance lasts until you use this property again or\nremove the armor.",
    page: 224,
    endPage: 224,
    category: "armor",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:gloves-of-missile-snaring",
    edition: "2014",
    name: "Gloves of Missile Snaring",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "These gloves seem to almost meld into your hands\nwhen you don them. When a ranged weapon attack\nhits you while you’re wearing them, you can use\nyour reaction to reduce the damage by 1d10 + your\nDexterity modifier, provided that you have a free\nhand. If you reduce the damage to 0, you can catch\nthe missile if it is small enough for you to hold in that\nhand.",
    page: 224,
    endPage: 224,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:gloves-of-swimming-and-climbing",
    edition: "2014",
    name: "Gloves of Swimming and Climbing",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "While wearing these gloves, climbing and swimming\ndon’t cost you extra movement, and you gain a +5\nbonus to Strength (Athletics) checks made to climb\nor swim.",
    page: 224,
    endPage: 224,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:goggles-of-night",
    edition: "2014",
    name: "Goggles of Night",
    metadata: "Wondrous item, uncommon",
    rules:
      "While wearing these dark lenses, you have\ndarkvision out to a range of 60 feet. If you already\nhave darkvision, wearing the goggles increases its\nrange by 60 feet.",
    page: 224,
    endPage: 224,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:hammer-of-thunderbolts",
    edition: "2014",
    name: "Hammer of Thunderbolts",
    metadata: "Weapon (maul), legendary",
    rules:
      "You gain a +1 bonus to attack and damage rolls\nmade with this magic weapon.\nGiant’s Bane (Requires Attunement). You must\nbe wearing a belt of giant strength (any variety) and\ngauntlets of ogre power to attune to this weapon. The\nattunement ends if you take off either of those items.\nWhile you are attuned to this weapon and holding it,\nyour Strength score increases by 4 and can exceed\n20, but not 30. When you roll a 20 on an attack roll\nmade with this weapon against a giant, the giant\nmust succeed on a DC 17 Constitution saving throw\nor die.\nThe hammer also has 5 charges. While attuned to\nit, you can expend 1 charge and make a ranged\nweapon attack with the hammer, hurling it as if it\nhad the thrown property with a normal range of 20\nfeet and a long range of 60 feet. If the attack hits, the\nhammer unleashes a thunderclap audible out to 300\nfeet. The target and every creature within 30 feet of\nit must succeed on a DC 17 Constitution saving\nthrow or be stunned until the end of your next turn.\nThe hammer regains 1d4 + 1 expended charges daily\nat dawn.",
    page: 224,
    endPage: 224,
    category: "weapon",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:handy-haversack",
    edition: "2014",
    name: "Handy Haversack",
    metadata: "Wondrous item, rare",
    rules:
      "This backpack has a central pouch and two side\npouches, each of which is an extradimensional space.\nEach side pouch can hold up to 20 pounds of\nmaterial, not exceeding a volume of 2 cubic feet. The\nlarge central pouch can hold up to 8 cubic feet or 80\npounds of material. The backpack always weighs 5\npounds, regardless of its contents.\nPlacing an object in the haversack follows the\nnormal rules for interacting with objects. Retrieving\nan item from the haversack requires you to use an\naction. When you reach into the haversack for a\nspecific item, the item is always magically on top.\nThe haversack has a few limitations. If it is\noverloaded, or if a sharp object pierces it or tears it,\nthe haversack ruptures and is destroyed. If the\nhaversack is destroyed, its contents are lost forever,\nalthough an artifact always turns up again\nsomewhere. If the haversack is turned inside out, its\ncontents spill forth, unharmed, and the haversack\nmust be put right before it can be used again. If a\nbreathing creature is placed within the haversack,\nthe creature can survive for up to 10 minutes, after\nwhich time it begins to suffocate.\nPlacing the haversack inside an extradimensional\nspace created by a bag of holding, portable hole, or\nsimilar item instantly destroys both items and opens\na gate to the Astral Plane. The gate originates where\nthe one item was placed inside the other. Any\ncreature within 10 feet of the gate is sucked through\nit and deposited in a random location on the Astral\nPlane. The gate then closes. The gate is one-‐‑way only\nand can’t be reopened.",
    page: 224,
    endPage: 225,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:hat-of-disguise",
    edition: "2014",
    name: "Hat of Disguise",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "While wearing this hat, you can use an action to cast\nthe disguise self spell from it at will. The spell ends if\nthe hat is removed.",
    page: 225,
    endPage: 225,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:headband-of-intellect",
    edition: "2014",
    name: "Headband of Intellect",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "Your Intelligence score is 19 while you wear this\nheadband. It has no effect on you if your Intelligence\nis already 19 or higher.",
    page: 225,
    endPage: 225,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:helm-of-brilliance",
    edition: "2014",
    name: "Helm of Brilliance",
    metadata: "Wondrous item, very rare (requires attunement)",
    rules:
      "This dazzling helm is set with 1d10 diamonds, 2d10\nrubies, 3d10 fire opals, and 4d10 opals. Any gem\npried from the helm crumbles to dust. When all the\ngems are removed or destroyed, the helm loses its\nmagic.\nYou gain the following benefits while wearing it:\n• You can use an action to cast one of the following\nspells (save DC 18), using one of the helm’s gems\nof the specified type as a component: daylight\n(opal), fireball (fire opal), prismatic spray\n(diamond), or wall of fire (ruby). The gem is\ndestroyed when the spell is cast and disappears\nfrom the helm.\n• As long as it has at least one diamond, the helm\nemits dim light in a 30-‐‑foot radius when at least\none undead is within that area. Any undead that\nstarts its turn in that area takes 1d6 radiant\ndamage.\n• As long as the helm has at least one ruby, you have\nresistance to fire damage.\n• As long as the helm has at least one fire opal, you\ncan use an action and speak a command word to\ncause one weapon you are holding to burst into\nflames. The flames emit bright light in a 10-‐‑foot\nradius and dim light for an additional 10 feet. The\nflames are harmless to you and the weapon. When\nyou hit with an attack using the blazing weapon,\nthe target takes an extra 1d6 fire damage. The\nflames last until you use a bonus action to speak\nthe command word again or until you drop or\nstow the weapon.\nRoll a d20 if you are wearing the helm and take\nfire damage as a result of failing a saving throw\nagainst a spell. On a roll of 1, the helm emits beams\nof light from its remaining gems. Each creature\nwithin 60 feet of the helm other than you must\nsucceed on a DC 17 Dexterity saving throw or be\nstruck by a beam, taking radiant damage equal to the\nnumber of gems in the helm. The helm and its gems\nare then destroyed.",
    page: 225,
    endPage: 225,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:helm-of-comprehending-languages",
    edition: "2014",
    name: "Helm of Comprehending Languages",
    metadata: "Wondrous item, uncommon",
    rules: "While wearing this helm, you can use an action to\ncast the comprehend languages spell from it at will.",
    page: 225,
    endPage: 225,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:helm-of-telepathy",
    edition: "2014",
    name: "Helm of Telepathy",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "While wearing this helm, you can use an action to\ncast the detect thoughts spell (save DC 13) from it. As\nlong as you maintain concentration on the spell, you\ncan use a bonus action to send a telepathic message\nto a creature you are focused on. It can reply—using\na bonus action to do so—while your focus on it\ncontinues.\nWhile focusing on a creature with detect thoughts,\nyou can use an action to cast the suggestion spell\n(save DC 13) from the helm on that creature. Once\nused, the suggestion property can’t be used again\nuntil the next dawn.",
    page: 225,
    endPage: 225,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:helm-of-teleportation",
    edition: "2014",
    name: "Helm of Teleportation",
    metadata: "Wondrous item, rare (requires attunement)",
    rules:
      "This helm has 3 charges. While wearing it, you can\nuse an action and expend 1 charge to cast the\nteleport spell from it. The helm regains 1d3\nexpended charges daily at dawn.",
    page: 225,
    endPage: 225,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:holy-avenger",
    edition: "2014",
    name: "Holy Avenger",
    metadata: "Weapon (any sword), legendary (requires attunement by a paladin)",
    rules:
      "You gain a +3 bonus to attack and damage rolls\nmade with this magic weapon. When you hit a fiend\nor an undead with it, that creature takes an extra\n2d10 radiant damage.\nWhile you hold the drawn sword, it creates an\naura in a 10-‐‑foot radius around you. You and all\ncreatures friendly to you in the aura have advantage\non saving throws against spells and other magical\neffects. If you have 17 or more levels in the paladin\nclass, the radius of the aura increases to 30 feet.",
    page: 225,
    endPage: 226,
    category: "weapon",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:horn-of-blasting",
    edition: "2014",
    name: "Horn of Blasting",
    metadata: "Wondrous item, rare",
    rules:
      "You can use an action to speak the horn’s command\nword and then blow the horn, which emits a\nthunderous blast in a 30-‐‑foot cone that is audible\n600 feet away. Each creature in the cone must make\na DC 15 Constitution saving throw. On a failed save, a\ncreature takes 5d6 thunder damage and is deafened\nfor 1 minute. On a successful save, a creature takes\nhalf as much damage and isn’t deafened. Creatures\nand objects made of glass or crystal have\ndisadvantage on the saving throw and take 10d6\nthunder damage instead of 5d6.\nEach use of the horn’s magic has a 20 percent\nchance of causing the horn to explode. The explosion\ndeals 10d6 fire damage to the blower and destroys\nthe horn.",
    page: 226,
    endPage: 226,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:horn-of-valhalla",
    edition: "2014",
    name: "Horn of Valhalla",
    metadata: "Wondrous item, rare (silver or brass), very rare (bronze), or legendary (iron)",
    rules:
      "You can use an action to blow this horn. In response,\nwarrior spirits from the Valhalla appear within 60\nfeet of you. They use the statistics of a berserker.\nThey return to Valhalla after 1 hour or when they\ndrop to 0 hit points. Once you use the horn, it can’t\nbe used again until 7 days have passed.\nFour types of horn of Valhalla are known to exist,\neach made of a different metal. The horn’s type\ndetermines how many berserkers answer its\nsummons, as well as the requirement for its use. The\nGM chooses the horn’s type or determines it\nrandomly.\nd100 Horn Berserkers Requirement\nType Summoned\n01–40 Silver 2d4 + 2 None\n41–75 Brass 3d4 + 3 Proficiency with all\nsimple weapons\n76–90 Bronze 4d4 + 4 Proficiency with all\nmedium armor\n91–00 Iron 5d4 + 5 Proficiency with all\nmartial weapons\nIf you blow the horn without meeting its\nrequirement, the summoned berserkers attack you.\nIf you meet the requirement, they are friendly to you\nand your companions and follow your commands.",
    page: 226,
    endPage: 226,
    category: "wondrous",
    rarities: ["rare", "veryRare", "legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:horseshoes-of-a-zephyr",
    edition: "2014",
    name: "Horseshoes of a Zephyr",
    metadata: "Wondrous item, very rare",
    rules:
      "These iron horseshoes come in a set of four. While\nall four shoes are affixed to the hooves of a horse or\nsimilar creature, they allow the creature to move\nnormally while floating 4 inches above the ground.\nThis effect means the creature can cross or stand\nabove nonsolid or unstable surfaces, such as water\nor lava. The creature leaves no tracks and ignores\ndifficult terrain. In addition, the creature can move\nat normal speed for up to 12 hours a day without\nsuffering exhaustion from a forced march.",
    page: 226,
    endPage: 226,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:horseshoes-of-speed",
    edition: "2014",
    name: "Horseshoes of Speed",
    metadata: "Wondrous item, rare",
    rules:
      "These iron horseshoes come in a set of four. While\nall four shoes are affixed to the hooves of a horse or\nsimilar creature, they increase the creature’s\nwalking speed by 30 feet.",
    page: 226,
    endPage: 226,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:immovable-rod",
    edition: "2014",
    name: "Immovable Rod",
    metadata: "Rod, uncommon",
    rules:
      "This flat iron rod has a button on one end. You can\nuse an action to press the button, which causes the\nrod to become magically fixed in place. Until you or\nanother creature uses an action to push the button\nagain, the rod doesn’t move, even if it is defying\ngravity. The rod can hold up to 8,000 pounds of\nweight. More weight causes the rod to deactivate\nand fall. A creature can use an action to make a DC\n30 Strength check, moving the fixed rod up to 10 feet\non a success.",
    page: 226,
    endPage: 226,
    category: "rod",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:instant-fortress",
    edition: "2014",
    name: "Instant Fortress",
    metadata: "Wondrous item, rare",
    rules:
      "You can use an action to place this 1-‐‑inch metal cube\non the ground and speak its command word. The\ncube rapidly grows into a fortress that remains until\nyou use an action to speak the command word that\ndismisses it, which works only if the fortress is\nempty.\nThe fortress is a square tower, 20 feet on a side\nand 30 feet high, with arrow slits on all sides and a\nbattlement atop it. Its interior is divided into two\nfloors, with a ladder running along one wall to\nconnect them. The ladder ends at a trapdoor leading\nto the roof. When activated, the tower has a small\ndoor on the side facing you. The door opens only at\nyour command, which you can speak as a bonus\naction. It is immune to the knock spell and similar\nmagic, such as that of a chime of opening.\nEach creature in the area where the fortress\nappears must make a DC 15 Dexterity saving throw,\ntaking 10d10 bludgeoning damage on a failed save,\nor half as much damage on a successful one. In either\ncase, the creature is pushed to an unoccupied space\noutside but next to the fortress. Objects in the area\nthat aren’t being worn or carried take this damage\nand are pushed automatically.\nThe tower is made of adamantine, and its magic\nprevents it from being tipped over. The roof, the\ndoor, and the walls each have 100 hit points,\nimmunity to damage from nonmagical weapons\nexcluding siege weapons, and resistance to all other\ndamage. Only a wish spell can repair the fortress\n(this use of the spell counts as replicating a spell of\n8th level or lower). Each casting of wish causes the\nroof, the door, or one wall to regain 50 hit points.",
    page: 226,
    endPage: 227,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:ioun-stone",
    edition: "2014",
    name: "Ioun Stone",
    metadata: "Wondrous item, rarity varies (requires attunement)",
    rules:
      "An Ioun stone is named after Ioun, a god of\nknowledge and prophecy revered on some worlds.\nMany types of Ioun stone exist, each type a distinct\ncombination of shape and color.\nWhen you use an action to toss one of these stones\ninto the air, the stone orbits your head at a distance\nof 1d3 feet and confers a benefit to you. Thereafter,\nanother creature must use an action to grasp or net\nthe stone to separate it from you, either by making a\nsuccessful attack roll against AC 24 or a successful\nDC 24 Dexterity (Acrobatics) check. You can use an\naction to seize and stow the stone, ending its effect.\nA stone has AC 24, 10 hit points, and resistance to\nall damage. It is considered to be an object that is\nbeing worn while it orbits your head.\nAbsorption (Very Rare). While this pale lavender\nellipsoid orbits your head, you can use your reaction\nto cancel a spell of 4th level or lower cast by a\ncreature you can see and targeting only you.\nOnce the stone has canceled 20 levels of spells, it\nburns out and turns dull gray, losing its magic. If you\nare targeted by a spell whose level is higher than the\nnumber of spell levels the stone has left, the stone\ncan’t cancel it.\nAgility (Very Rare). Your Dexterity score\nincreases by 2, to a maximum of 20, while this deep\nred sphere orbits your head.\nAwareness (Rare). You can’t be surprised while\nthis dark blue rhomboid orbits your head.\nFortitude (Very Rare). Your Constitution score\nincreases by 2, to a maximum of 20, while this pink\nrhomboid orbits your head.\nGreater Absorption (Legendary). While this\nmarbled lavender and green ellipsoid orbits your\nhead, you can use your reaction to cancel a spell of\n8th level or lower cast by a creature you can see and\ntargeting only you.\nOnce the stone has canceled 50 levels of spells, it\nburns out and turns dull gray, losing its magic. If you\nare targeted by a spell whose level is higher than the\nnumber of spell levels the stone has left, the stone\ncan’t cancel it.\nInsight (Very Rare). Your Wisdom score\nincreases by 2, to a maximum of 20, while this\nincandescent blue sphere orbits your head.\nIntellect (Very Rare). Your Intelligence score\nincreases by 2, to a maximum of 20, while this\nmarbled scarlet and blue sphere orbits your head.\nLeadership (Very Rare). Your Charisma score\nincreases by 2, to a maximum of 20, while this\nmarbled pink and green sphere orbits your head.\nMastery (Legendary). Your proficiency bonus\nincreases by 1 while this pale green prism orbits\nyour head.\nProtection (Rare). You gain a +1 bonus to AC\nwhile this dusty rose prism orbits your head.\nRegeneration (Legendary). You regain 15 hit\npoints at the end of each hour this pearly white\nspindle orbits your head, provided that you have at\nleast 1 hit point.\nReserve (Rare). This vibrant purple prism stores\nspells cast into it, holding them until you use them.\nThe stone can store up to 3 levels worth of spells at a\ntime. When found, it contains 1d4 − 1 levels of\nstored spells chosen by the GM.\nAny creature can cast a spell of 1st through 3rd\nlevel into the stone by touching it as the spell is cast.\nThe spell has no effect, other than to be stored in the\nstone. If the stone can’t hold the spell, the spell is\nexpended without effect. The level of the slot used to\ncast the spell determines how much space it uses.\nWhile this stone orbits your head, you can cast any\nspell stored in it. The spell uses the slot level, spell\nsave DC, spell attack bonus, and spellcasting ability\nof the original caster, but is otherwise treated as if\nyou cast the spell. The spell cast from the stone is no\nlonger stored in it, freeing up space.\nStrength (Very Rare). Your Strength score\nincreases by 2, to a maximum of 20, while this pale\nblue rhomboid orbits your head.\nSustenance (Rare). You don’t need to eat or drink\nwhile this clear spindle orbits your head.",
    page: 227,
    endPage: 227,
    category: "wondrous",
    rarities: [],
    rarityVaries: true,
    attunement: true
  },
  {
    id: "srd51:iron-bands-of-binding",
    edition: "2014",
    name: "Iron Bands of Binding",
    metadata: "Wondrous item, rare",
    rules:
      "This rusty iron sphere measures 3 inches in\ndiameter and weighs 1 pound. You can use an action\nto speak the command word and throw the sphere at\na Huge or smaller creature you can see within 60\nfeet of you. As the sphere moves through the air, it\nopens into a tangle of metal bands.\nMake a ranged attack roll with an attack bonus\nequal to your Dexterity modifier plus your\nproficiency bonus. On a hit, the target is restrained\nuntil you take a bonus action to speak the command\nword again to release it. Doing so, or missing with\nthe attack, causes the bands to contract and become\na sphere once more.\nA creature, including the one restrained, can use\nan action to make a DC 20 Strength check to break\nthe iron bands. On a success, the item is destroyed,\nand the restrained creature is freed. If the check fails,\nany further attempts made by that creature\nautomatically fail until 24 hours have elapsed.\nOnce the bands are used, they can’t be used again\nuntil the next dawn.",
    page: 228,
    endPage: 228,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:iron-flask",
    edition: "2014",
    name: "Iron Flask",
    metadata: "Wondrous item, legendary",
    rules:
      "This iron bottle has a brass stopper. You can use an\naction to speak the flask’s command word, targeting\na creature that you can see within 60 feet of you. If\nthe target is native to a plane of existence other than\nthe one you’re on, the target must succeed on a DC\n17 Wisdom saving throw or be trapped in the flask.\nIf the target has been trapped by the flask before, it\nhas advantage on the saving throw. Once trapped, a\ncreature remains in the flask until released. The flask\ncan hold only one creature at a time. A creature\ntrapped in the flask doesn’t need to breathe, eat, or\ndrink and doesn’t age.\nYou can use an action to remove the flask’s\nstopper and release the creature the flask contains.\nThe creature is friendly to you and your companions\nfor 1 hour and obeys your commands for that\nduration. If you give no commands or give it a\ncommand that is likely to result in its death, it\ndefends itself but otherwise takes no actions. At the\nend of the duration, the creature acts in accordance\nwith its normal disposition and alignment.\nAn identify spell reveals that a creature is inside\nthe flask, but the only way to determine the type of\ncreature is to open the flask. A newly discovered\nbottle might already contain a creature chosen by\nthe GM or determined randomly.\nd100 Contents\n1‒50 Empty\n51‒54 Demon (type 1)\n55‒58 Demon (type 2)\n59‒62 Demon (type 3)\n63‒64 Demon (type 4)\n65 Demon (type 5)\n66 Demon (type 6)\n67 Deva\n68‒69 Devil (greater)\n70‒73 Devil (lesser)\n74‒75 Djinni\n76‒77 Efreeti\n78‒83 Elemental (any)\n84‒86 Invisible stalker\n87‒90 Night hag\n91 Planetar\n92‒95 Salamander\n96 Solar\n97‒99 Succubus/incubus\n100 Xorn",
    page: 228,
    endPage: 228,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:javelin-of-lightning",
    edition: "2014",
    name: "Javelin of Lightning",
    metadata: "Weapon (javelin), uncommon",
    rules:
      "This javelin is a magic weapon. When you hurl it and\nspeak its command word, it transforms into a bolt of\nlightning, forming a line 5 feet wide that extends out\nfrom you to a target within 120 feet. Each creature in\nthe line excluding you and the target must make a\nDC 13 Dexterity saving throw, taking 4d6 lightning\ndamage on a failed save, and half as much damage on\na successful one. The lightning bolt turns back into a\njavelin when it reaches the target. Make a ranged\nweapon attack against the target. On a hit, the target\ntakes damage from the javelin plus 4d6 lightning\ndamage.\nThe javelin’s property can’t be used again until the\nnext dawn. In the meantime, the javelin can still be\nused as a magic weapon.",
    page: 228,
    endPage: 228,
    category: "weapon",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:lantern-of-revealing",
    edition: "2014",
    name: "Lantern of Revealing",
    metadata: "Wondrous item, uncommon",
    rules:
      "While lit, this hooded lantern burns for 6 hours on 1\npint of oil, shedding bright light in a 30-‐‑foot radius\nand dim light for an additional 30 feet. Invisible\ncreatures and objects are visible as long as they are\nin the lantern’s bright light. You can use an action to\nlower the hood, reducing the light to dim light in a 5-‐‑\nfoot radius.",
    page: 228,
    endPage: 228,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:luck-blade",
    edition: "2014",
    name: "Luck Blade",
    metadata: "Weapon (any sword), legendary (requires attunement)",
    rules:
      "You gain a +1 bonus to attack and damage rolls\nmade with this magic weapon. While the sword is on\nyour person, you also gain a +1 bonus to saving\nthrows.\nLuck. If the sword is on your person, you can call\non its luck (no action required) to reroll one attack\nroll, ability check, or saving throw you dislike. You\nmust use the second roll. This property can’t be used\nagain until the next dawn.\nWish. The sword has 1d4 – 1 charges. While\nholding it, you can use an action to expend 1 charge\nand cast the wish spell from it. This property can’t be\nused again until the next dawn. The sword loses this\nproperty if it has no charges.",
    page: 229,
    endPage: 229,
    category: "weapon",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:mace-of-disruption",
    edition: "2014",
    name: "Mace of Disruption",
    metadata: "Weapon (mace), rare (requires attunement)",
    rules:
      "When you hit a fiend or an undead with this magic\nweapon, that creature takes an extra 2d6 radiant\ndamage. If the target has 25 hit points or fewer after\ntaking this damage, it must succeed on a DC 15\nWisdom saving throw or be destroyed. On a\nsuccessful save, the creature becomes frightened of\nyou until the end of your next turn.\nWhile you hold this weapon, it sheds bright light in\na 20-‐‑foot radius and dim light for an additional 20\nfeet.",
    page: 229,
    endPage: 229,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:mace-of-smiting",
    edition: "2014",
    name: "Mace of Smiting",
    metadata: "Weapon (mace), rare",
    rules:
      "You gain a +1 bonus to attack and damage rolls\nmade with this magic weapon. The bonus increases\nto +3 when you use the mace to attack a construct.\nWhen you roll a 20 on an attack roll made with\nthis weapon, the target takes an extra 2d6\nbludgeoning damage, or 4d6 bludgeoning damage if\nit’s a construct. If a construct has 25 hit points or\nfewer after taking this damage, it is destroyed.",
    page: 229,
    endPage: 229,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:mace-of-terror",
    edition: "2014",
    name: "Mace of Terror",
    metadata: "Weapon (mace), rare (requires attunement)",
    rules:
      "This magic weapon has 3 charges. While holding it,\nyou can use an action and expend 1 charge to release\na wave of terror. Each creature of your choice in a\n30-‐‑foot radius extending from you must succeed on\na DC 15 Wisdom saving throw or become frightened\nof you for 1 minute. While it is frightened in this way,\na creature must spend its turns trying to move as far\naway from you as it can, and it can’t willingly move\nto a space within 30 feet of you. It also can’t take\nreactions. For its action, it can use only the Dash\naction or try to escape from an effect that prevents it\nfrom moving. If it has nowhere it can move, the\ncreature can use the Dodge action. At the end of each\nof its turns, a creature can repeat the saving throw,\nending the effect on itself on a success.\nThe mace regains 1d3 expended charges daily at\ndawn.",
    page: 229,
    endPage: 229,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:mantle-of-spell-resistance",
    edition: "2014",
    name: "Mantle of Spell Resistance",
    metadata: "Wondrous item, rare (requires attunement)",
    rules: "You have advantage on saving throws against spells\nwhile you wear this cloak.",
    page: 229,
    endPage: 229,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:manual-of-bodily-health",
    edition: "2014",
    name: "Manual of Bodily Health",
    metadata: "Wondrous item, very rare",
    rules:
      "This book contains health and diet tips, and its\nwords are charged with magic. If you spend 48 hours\nover a period of 6 days or fewer studying the book’s\ncontents and practicing its guidelines, your\nConstitution score increases by 2, as does your\nmaximum for that score. The manual then loses its\nmagic, but regains it in a century.",
    page: 229,
    endPage: 229,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:manual-of-gainful-exercise",
    edition: "2014",
    name: "Manual of Gainful Exercise",
    metadata: "Wondrous item, very rare",
    rules:
      "This book describes fitness exercises, and its words\nare charged with magic. If you spend 48 hours over a\nperiod of 6 days or fewer studying the book’s\ncontents and practicing its guidelines, your Strength\nscore increases by 2, as does your maximum for that\nscore. The manual then loses its magic, but regains it\nin a century.",
    page: 229,
    endPage: 229,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:manual-of-golems",
    edition: "2014",
    name: "Manual of Golems",
    metadata: "Wondrous item, very rare",
    rules:
      "This tome contains information and incantations\nnecessary to make a particular type of golem. The\nGM chooses the type or determines it randomly. To\ndecipher and use the manual, you must be a\nspellcaster with at least two 5th-‐‑level spell slots. A\ncreature that can’t use a manual of golems and\nattempts to read it takes 6d6 psychic damage.\nd20 Golem Time Cost\n1–5 Clay 30 days 65,000 gp\n6–17 Flesh 60 days 50,000 gp\n18 Iron 120 days 100,000 gp\n19–20 Stone 90 days 80,000 gp\nTo create a golem, you must spend the time shown\non the table, working without interruption with the\nmanual at hand and resting no more than 8 hours\nper day. You must also pay the specified cost to\npurchase supplies.\nOnce you finish creating the golem, the book is\nconsumed in eldritch flames. The golem becomes\nanimate when the ashes of the manual are sprinkled\non it. It is under your control, and it understands and\nobeys your spoken commands.",
    page: 229,
    endPage: 230,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:manual-of-quickness-of-action",
    edition: "2014",
    name: "Manual of Quickness of Action",
    metadata: "Wondrous item, very rare",
    rules:
      "This book contains coordination and balance\nexercises, and its words are charged with magic. If\nyou spend 48 hours over a period of 6 days or fewer\nstudying the book’s contents and practicing its\nguidelines, your Dexterity score increases by 2, as\ndoes your maximum for that score. The manual then\nloses its magic, but regains it in a century.",
    page: 230,
    endPage: 230,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:marvelous-pigments",
    edition: "2014",
    name: "Marvelous Pigments",
    metadata: "Wondrous item, very rare",
    rules:
      "Typically found in 1d4 pots inside a fine wooden box\nwith a brush (weighing 1 pound in total), these\npigments allow you to create three-‐‑dimensional\nobjects by painting them in two dimensions. The\npaint flows from the brush to form the desired\nobject as you concentrate on its image.\nEach pot of paint is sufficient to cover 1,000\nsquare feet of a surface, which lets you create\ninanimate objects or terrain features—such as a\ndoor, a pit, flowers, trees, cells, rooms, or weapons—\nthat are up to 10,000 cubic feet. It takes 10 minutes\nto cover 100 square feet.\nWhen you complete the painting, the object or\nterrain feature depicted becomes a real, nonmagical\nobject. Thus, painting a door on a wall creates an\nactual door that can be opened to whatever is\nbeyond. Painting a pit on a floor creates a real pit,\nand its depth counts against the total area of objects\nyou create.\nNothing created by the pigments can have a value\ngreater than 25 gp. If you paint an object of greater\nvalue (such as a diamond or a pile of gold), the object\nlooks authentic, but close inspection reveals it is\nmade from paste, bone, or some other worthless\nmaterial.\nIf you paint a form of energy such as fire or\nlightning, the energy appears but dissipates as soon\nas you complete the painting, doing no harm to\nanything.",
    page: 230,
    endPage: 230,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:medallion-of-thoughts",
    edition: "2014",
    name: "Medallion of Thoughts",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "The medallion has 3 charges. While wearing it, you\ncan use an action and expend 1 charge to cast the\ndetect thoughts spell (save DC 13) from it. The\nmedallion regains 1d3 expended charges daily at\ndawn.",
    page: 230,
    endPage: 230,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:mirror-of-life-trapping",
    edition: "2014",
    name: "Mirror of Life Trapping",
    metadata: "Wondrous item, very rare",
    rules:
      "When this 4-‐‑foot-‐‑tall mirror is viewed indirectly, its\nsurface shows faint images of creatures. The mirror\nweighs 50 pounds, and it has AC 11, 10 hit points,\nand vulnerability to bludgeoning damage. It shatters\nand is destroyed when reduced to 0 hit points.\nIf the mirror is hanging on a vertical surface and\nyou are within 5 feet of it, you can use an action to\nspeak its command word and activate it. It remains\nactivated until you use an action to speak the\ncommand word again.\nAny creature other than you that sees its reflection\nin the activated mirror while within 30 feet of it\nmust succeed on a DC 15 Charisma saving throw or\nbe trapped, along with anything it is wearing or\ncarrying, in one of the mirror’s twelve\nextradimensional cells. This saving throw is made\nwith advantage if the creature knows the mirror’s\nnature, and constructs succeed on the saving throw\nautomatically.\nAn extradimensional cell is an infinite expanse\nfilled with thick fog that reduces visibility to 10 feet.\nCreatures trapped in the mirror’s cells don’t age, and\nthey don’t need to eat, drink, or sleep. A creature\ntrapped within a cell can escape using magic that\npermits planar travel. Otherwise, the creature is\nconfined to the cell until freed.\nIf the mirror traps a creature but its twelve\nextradimensional cells are already occupied, the\nmirror frees one trapped creature at random to\naccommodate the new prisoner. A freed creature\nappears in an unoccupied space within sight of the\nmirror but facing away from it. If the mirror is\nshattered, all creatures it contains are freed and\nappear in unoccupied spaces near it.\nWhile within 5 feet of the mirror, you can use an\naction to speak the name of one creature trapped in\nit or call out a particular cell by number. The\ncreature named or contained in the named cell\nappears as an image on the mirror’s surface. You and\nthe creature can then communicate normally.\nIn a similar way, you can use an action to speak a\nsecond command word and free one creature\ntrapped in the mirror. The freed creature appears,\nalong with its possessions, in the unoccupied space\nnearest to the mirror and facing away from it.",
    page: 230,
    endPage: 231,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:mithral-armor",
    edition: "2014",
    name: "Mithral Armor",
    metadata: "Armor (medium or heavy, but not hide), uncommon",
    rules:
      "Mithral is a light, flexible metal. A mithral chain shirt\nor breastplate can be worn under normal clothes. If\nthe armor normally imposes disadvantage on\nDexterity (Stealth) checks or has a Strength\nrequirement, the mithral version of the armor\ndoesn’t.",
    page: 231,
    endPage: 231,
    category: "armor",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:necklace-of-adaptation",
    edition: "2014",
    name: "Necklace of Adaptation",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "While wearing this necklace, you can breathe\nnormally in any environment, and you have\nadvantage on saving throws made against harmful\ngases and vapors (such as cloudkill and stinking\ncloud effects, inhaled poisons, and the breath\nweapons of some dragons).",
    page: 231,
    endPage: 231,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:necklace-of-fireballs",
    edition: "2014",
    name: "Necklace of Fireballs",
    metadata: "Wondrous item, rare",
    rules:
      "This necklace has 1d6 + 3 beads hanging from it. You\ncan use an action to detach a bead and throw it up to\n60 feet away. When it reaches the end of its\ntrajectory, the bead detonates as a 3rd-‐‑level fireball\nspell (save DC 15).\nYou can hurl multiple beads, or even the whole\nnecklace, as one action. When you do so, increase the\nlevel of the fireball by 1 for each bead beyond the\nfirst.",
    page: 231,
    endPage: 231,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:necklace-of-prayer-beads",
    edition: "2014",
    name: "Necklace of Prayer Beads",
    metadata: "Wondrous item, rare (requires attunement by a cleric, druid, or paladin)",
    rules:
      "This necklace has 1d4 + 2 magic beads made from\naquamarine, black pearl, or topaz. It also has many\nnonmagical beads made from stones such as amber,\nbloodstone, citrine, coral, jade, pearl, or quartz. If a\nmagic bead is removed from the necklace, that bead\nloses its magic.\nSix types of magic beads exist. The GM decides the\ntype of each bead on the necklace or determines it\nrandomly. A necklace can have more than one bead\nof the same type. To use one, you must be wearing\nthe necklace. Each bead contains a spell that you can\ncast from it as a bonus action (using your spell save\nDC if a save is necessary). Once a magic bead’s spell\nis cast, that bead can’t be used again until the next\ndawn.\nd20 Bead of … Spell\n1–6 Blessing Bless\n7–12 Curing Cure wounds (2nd level) or lesser\nrestoration\n13–16 Favor Greater restoration\n17–18 Smiting Branding smite\n19 Summons Planar ally\n20 Wind Wind walk\nwalking",
    page: 231,
    endPage: 231,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:nine-lives-stealer",
    edition: "2014",
    name: "Nine Lives Stealer",
    metadata: "Weapon (any sword), very rare (requires attunement)",
    rules:
      "You gain a +2 bonus to attack and damage rolls\nmade with this magic weapon.\nThe sword has 1d8 + 1 charges. If you score a\ncritical hit against a creature that has fewer than 100\nhit points, it must succeed on a DC 15 Constitution\nsaving throw or be slain instantly as the sword tears\nits life force from its body (a construct or an undead\nis immune). The sword loses 1 charge if the creature\nis slain. When the sword has no charges remaining,\nit loses this property.",
    page: 231,
    endPage: 231,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:oathbow",
    edition: "2014",
    name: "Oathbow",
    metadata: "Weapon (longbow), very rare (requires attunement)",
    rules:
      "When you nock an arrow on this bow, it whispers in\nElvish, “Swift defeat to my enemies.” When you use\nthis weapon to make a ranged attack, you can, as a\ncommand phrase, say, “Swift death to you who have\nwronged me.” The target of your attack becomes\nyour sworn enemy until it dies or until dawn seven\ndays later. You can have only one such sworn enemy\nat a time. When your sworn enemy dies, you can\nchoose a new one after the next dawn.\nWhen you make a ranged attack roll with this\nweapon against your sworn enemy, you have\nadvantage on the roll. In addition, your target gains\nno benefit from cover, other than total cover, and\nyou suffer no disadvantage due to long range. If the\nattack hits, your sworn enemy takes an extra 3d6\npiercing damage.\nWhile your sworn enemy lives, you have\ndisadvantage on attack rolls with all other weapons.",
    page: 231,
    endPage: 231,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:oil-of-etherealness",
    edition: "2014",
    name: "Oil of Etherealness",
    metadata: "Potion, rare",
    rules:
      "Beads of this cloudy gray oil form on the outside of\nits container and quickly evaporate. The oil can\ncover a Medium or smaller creature, along with the\nequipment it’s wearing and carrying (one additional\nvial is required for each size category above\nMedium). Applying the oil takes 10 minutes. The\naffected creature then gains the effect of the\netherealness spell for 1 hour.",
    page: 231,
    endPage: 232,
    category: "potion",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:oil-of-sharpness",
    edition: "2014",
    name: "Oil of Sharpness",
    metadata: "Potion, very rare",
    rules:
      "This clear, gelatinous oil sparkles with tiny, ultrathin\nsilver shards. The oil can coat one slashing or\npiercing weapon or up to 5 pieces of slashing or\npiercing ammunition. Applying the oil takes 1\nminute. For 1 hour, the coated item is magical and\nhas a +3 bonus to attack and damage rolls.",
    page: 232,
    endPage: 232,
    category: "potion",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:oil-of-slipperiness",
    edition: "2014",
    name: "Oil of Slipperiness",
    metadata: "Potion, uncommon",
    rules:
      "This sticky black unguent is thick and heavy in the\ncontainer, but it flows quickly when poured. The oil\ncan cover a Medium or smaller creature, along with\nthe equipment it’s wearing and carrying (one\nadditional vial is required for each size category\nabove Medium). Applying the oil takes 10 minutes.\nThe affected creature then gains the effect of a\nfreedom of movement spell for 8 hours.\nAlternatively, the oil can be poured on the ground\nas an action, where it covers a 10-‐‑foot square,\nduplicating the effect of the grease spell in that area\nfor 8 hours.",
    page: 232,
    endPage: 232,
    category: "potion",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:pearl-of-power",
    edition: "2014",
    name: "Pearl of Power",
    metadata: "Wondrous item, uncommon (requires attunement by a spellcaster)",
    rules:
      "While this pearl is on your person, you can use an\naction to speak its command word and regain one\nexpended spell slot. If the expended slot was of 4th\nlevel or higher, the new slot is 3rd level. Once you\nuse the pearl, it canʼt be used again until the next\ndawn.",
    page: 232,
    endPage: 232,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:periapt-of-health",
    edition: "2014",
    name: "Periapt of Health",
    metadata: "Wondrous item, uncommon",
    rules:
      "You are immune to contracting any disease while\nyou wear this pendant. If you are already infected\nwith a disease, the effects of the disease are\nsuppressed you while you wear the pendant.",
    page: 232,
    endPage: 232,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:periapt-of-proof-against-poison",
    edition: "2014",
    name: "Periapt of Proof against Poison",
    metadata: "Wondrous item, rare",
    rules:
      "This delicate silver chain has a brilliant-‐‑cut black\ngem pendant. While you wear it, poisons have no\neffect on you. You are immune to the poisoned\ncondition and have immunity to poison damage.",
    page: 232,
    endPage: 232,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:periapt-of-wound-closure",
    edition: "2014",
    name: "Periapt of Wound Closure",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "While you wear this pendant, you stabilize whenever\nyou are dying at the start of your turn. In addition,\nwhenever you roll a Hit Die to regain hit points,\ndouble the number of hit points it restores.",
    page: 232,
    endPage: 232,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:philter-of-love",
    edition: "2014",
    name: "Philter of Love",
    metadata: "Potion, uncommon",
    rules:
      "The next time you see a creature within 10 minutes\nafter drinking this philter, you become charmed by\nthat creature for 1 hour. If the creature is of a species\nand gender you are normally attracted to, you\nregard it as your true love while you are charmed.\nThis potion’s rose-‐‑hued, effervescent liquid contains\none easy-‐‑to-‐‑miss bubble shaped like a heart.",
    page: 232,
    endPage: 232,
    category: "potion",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:pipes-of-haunting",
    edition: "2014",
    name: "Pipes of Haunting",
    metadata: "Wondrous item, uncommon",
    rules:
      "You must be proficient with wind instruments to use\nthese pipes. They have 3 charges. You can use an\naction to play them and expend 1 charge to create an\neerie, spellbinding tune. Each creature within 30 feet\nof you that hears you play must succeed on a DC 15\nWisdom saving throw or become frightened of you\nfor 1 minute. If you wish, all creatures in the area\nthat aren’t hostile toward you automatically succeed\non the saving throw. A creature that fails the saving\nthrow can repeat it at the end of each of its turns,\nending the effect on itself on a success. A creature\nthat succeeds on its saving throw is immune to the\neffect of these pipes for 24 hours. The pipes regain\n1d3 expended charges daily at dawn.",
    page: 232,
    endPage: 232,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:pipes-of-the-sewers",
    edition: "2014",
    name: "Pipes of the Sewers",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "You must be proficient with wind instruments to use\nthese pipes. While you are attuned to the pipes,\nordinary rats and giant rats are indifferent toward\nyou and will not attack you unless you threaten or\nharm them.\nThe pipes have 3 charges. If you play the pipes as\nan action, you can use a bonus action to expend 1 to\n3 charges, calling forth one swarm of rats with each\nexpended charge, provided that enough rats are\nwithin half a mile of you to be called in this fashion\n(as determined by the GM). If there aren’t enough\nrats to form a swarm, the charge is wasted. Called\nswarms move toward the music by the shortest\navailable route but aren’t under your control\notherwise. The pipes regain 1d3 expended charges\ndaily at dawn.\nWhenever a swarm of rats that isn’t under another\ncreature’s control comes within 30 feet of you while\nyou are playing the pipes, you can make a Charisma\ncheck contested by the swarm’s Wisdom check. If\nyou lose the contest, the swarm behaves as it\nnormally would and can’t be swayed by the pipes’\nmusic for the next 24 hours. If you win the contest,\nthe swarm is swayed by the pipes’ music and\nbecomes friendly to you and your companions for as\nlong as you continue to play the pipes each round as\nan action. A friendly swarm obeys your commands. If\nyou issue no commands to a friendly swarm, it\ndefends itself but otherwise takes no actions. If a\nfriendly swarm starts its turn and can’t hear the\npipes’ music, your control over that swarm ends, and\nthe swarm behaves as it normally would and can’t be\nswayed by the pipes’ music for the next 24 hours.",
    page: 232,
    endPage: 233,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:plate-armor-of-etherealness",
    edition: "2014",
    name: "Plate Armor of Etherealness",
    metadata: "Armor (plate), legendary (requires attunement)",
    rules:
      "While you’re wearing this armor, you can speak its\ncommand word as an action to gain the effect of the\netherealness spell, which last for 10 minutes or until\nyou remove the armor or use an action to speak the\ncommand word again. This property of the armor\ncan’t be used again until the next dawn.",
    page: 233,
    endPage: 233,
    category: "armor",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:portable-hole",
    edition: "2014",
    name: "Portable Hole",
    metadata: "Wondrous item, rare",
    rules:
      "This fine black cloth, soft as silk, is folded up to the\ndimensions of a handkerchief. It unfolds into a\ncircular sheet 6 feet in diameter.\nYou can use an action to unfold a portable hole and\nplace it on or against a solid surface, whereupon the\nportable hole creates an extradimensional hole 10\nfeet deep. The cylindrical space within the hole\nexists on a different plane, so it can’t be used to\ncreate open passages. Any creature inside an open\nportable hole can exit the hole by climbing out of it.\nYou can use an action to close a portable hole by\ntaking hold of the edges of the cloth and folding it up.\nFolding the cloth closes the hole, and any creatures\nor objects within remain in the extradimensional\nspace. No matter what’s in it, the hole weighs next to\nnothing.\nIf the hole is folded up, a creature within the hole’s\nextradimensional space can use an action to make a\nDC 10 Strength check. On a successful check, the\ncreature forces its way out and appears within 5 feet\nof the portable hole or the creature carrying it. A\nbreathing creature within a closed portable hole can\nsurvive for up to 10 minutes, after which time it\nbegins to suffocate.\nPlacing a portable hole inside an extradimensional\nspace created by a bag of holding, handy haversack,\nor similar item instantly destroys both items and\nopens a gate to the Astral Plane. The gate originates\nwhere the one item was placed inside the other. Any\ncreature within 10 feet of the gate is sucked through\nit and deposited in a random location on the Astral\nPlane. The gate then closes. The gate is one-‐‑way only\nand can’t be reopened.",
    page: 233,
    endPage: 233,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:potion-of-animal-friendship",
    edition: "2014",
    name: "Potion of Animal Friendship",
    metadata: "Potion, uncommon",
    rules:
      "When you drink this potion, you can cast the animal\nfriendship spell (save DC 13) for 1 hour at will.\nAgitating this muddy liquid brings little bits into\nview: a fish scale, a hummingbird tongue, a cat claw,\nor a squirrel hair.",
    page: 233,
    endPage: 233,
    category: "potion",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:potion-of-clairvoyance",
    edition: "2014",
    name: "Potion of Clairvoyance",
    metadata: "Potion, rare",
    rules:
      "When you drink this potion, you gain the effect of the\nclairvoyance spell. An eyeball bobs in this yellowish\nliquid but vanishes when the potion is opened.",
    page: 233,
    endPage: 233,
    category: "potion",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:potion-of-climbing",
    edition: "2014",
    name: "Potion of Climbing",
    metadata: "Potion, common",
    rules:
      "When you drink this potion, you gain a climbing\nspeed equal to your walking speed for 1 hour.\nDuring this time, you have advantage on Strength\n(Athletics) checks you make to climb. The potion is\nseparated into brown, silver, and gray layers\nresembling bands of stone. Shaking the bottle fails to\nmix the colors.",
    page: 233,
    endPage: 233,
    category: "potion",
    rarities: ["common"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:potion-of-diminution",
    edition: "2014",
    name: "Potion of Diminution",
    metadata: "Potion, rare",
    rules:
      "When you drink this potion, you gain the “reduce”\neffect of the enlarge/reduce spell for 1d4 hours (no\nconcentration required). The red in the potion’s\nliquid continuously contracts to a tiny bead and then\nexpands to color the clear liquid around it. Shaking\nthe bottle fails to interrupt this process.",
    page: 233,
    endPage: 233,
    category: "potion",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:potion-of-flying",
    edition: "2014",
    name: "Potion of Flying",
    metadata: "Potion, very rare",
    rules:
      "When you drink this potion, you gain a flying speed\nequal to your walking speed for 1 hour and can\nhover. If you’re in the air when the potion wears off,\nyou fall unless you have some other means of staying\naloft. This potion’s clear liquid floats at the top of its\ncontainer and has cloudy white impurities drifting in\nit.",
    page: 234,
    endPage: 234,
    category: "potion",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:potion-of-gaseous-form",
    edition: "2014",
    name: "Potion of Gaseous Form",
    metadata: "Potion, rare",
    rules:
      "When you drink this potion, you gain the effect of the\ngaseous form spell for 1 hour (no concentration\nrequired) or until you end the effect as a bonus\naction. This potion’s container seems to hold fog that\nmoves and pours like water.",
    page: 234,
    endPage: 234,
    category: "potion",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:potion-of-giant-strength",
    edition: "2014",
    name: "Potion of Giant Strength",
    metadata: "Potion, rarity varies",
    rules:
      "When you drink this potion, your Strength score\nchanges for 1 hour. The type of giant determines the\nscore (see the table below). The potion has no effect\non you if your Strength is equal to or greater than\nthat score.\nThis potion’s transparent liquid has floating in it a\nsliver of fingernail from a giant of the appropriate\ntype. The potion of frost giant strength and the potion\nof stone giant strength have the same effect.\nType of Giant Strength Rarity\nHill giant 21 Uncommon\nFrost/stone giant 23 Rare\nFire giant 25 Rare\nCloud giant 27 Very rare\nStorm giant 29 Legendary",
    page: 234,
    endPage: 234,
    category: "potion",
    rarities: [],
    rarityVaries: true,
    attunement: false
  },
  {
    id: "srd51:potion-of-growth",
    edition: "2014",
    name: "Potion of Growth",
    metadata: "Potion, uncommon",
    rules:
      "When you drink this potion, you gain the “enlarge”\neffect of the enlarge/reduce spell for 1d4 hours (no\nconcentration required). The red in the potion’s\nliquid continuously expands from a tiny bead to\ncolor the clear liquid around it and then contracts.\nShaking the bottle fails to interrupt this process.",
    page: 234,
    endPage: 234,
    category: "potion",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:potion-of-healing",
    edition: "2014",
    name: "Potion of Healing",
    metadata: "Potion, rarity varies",
    rules:
      "You regain hit points when you drink this potion.\nThe number of hit points depends on the potion’s\nrarity, as shown in the Potions of Healing table.\nWhatever its potency, the potion’s red liquid\nglimmers when agitated.\nPotions of Healing\nPotion of … Rarity HP Regained\nHealing Common 2d4 + 2\nGreater healing Uncommon 4d4 + 4\nSuperior healing Rare 8d4 + 8\nSupreme healing Very rare 10d4 + 20",
    page: 234,
    endPage: 234,
    category: "potion",
    rarities: [],
    rarityVaries: true,
    attunement: false
  },
  {
    id: "srd51:potion-of-heroism",
    edition: "2014",
    name: "Potion of Heroism",
    metadata: "Potion, rare",
    rules:
      "For 1 hour after drinking it, you gain 10 temporary\nhit points that last for 1 hour. For the same duration,\nyou are under the effect of the bless spell (no\nconcentration required). This blue potion bubbles\nand steams as if boiling.",
    page: 234,
    endPage: 234,
    category: "potion",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:potion-of-invisibility",
    edition: "2014",
    name: "Potion of Invisibility",
    metadata: "Potion, very rare",
    rules:
      "This potion’s container looks empty but feels as\nthough it holds liquid. When you drink it, you\nbecome invisible for 1 hour. Anything you wear or\ncarry is invisible with you. The effect ends early if\nyou attack or cast a spell.",
    page: 234,
    endPage: 234,
    category: "potion",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:potion-of-mind-reading",
    edition: "2014",
    name: "Potion of Mind Reading",
    metadata: "Potion, rare",
    rules:
      "When you drink this potion, you gain the effect of the\ndetect thoughts spell (save DC 13). The potion’s\ndense, purple liquid has an ovoid cloud of pink\nfloating in it.",
    page: 234,
    endPage: 234,
    category: "potion",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:potion-of-poison",
    edition: "2014",
    name: "Potion of Poison",
    metadata: "Potion, uncommon",
    rules:
      "This concoction looks, smells, and tastes like a potion\nof healing or other beneficial potion. However, it is\nactually poison masked by illusion magic. An identify\nspell reveals its true nature.\nIf you drink it, you take 3d6 poison damage, and\nyou must succeed on a DC 13 Constitution saving\nthrow or be poisoned. At the start of each of your\nturns while you are poisoned in this way, you take\n3d6 poison damage. At the end of each of your turns,\nyou can repeat the saving throw. On a successful\nsave, the poison damage you take on your\nsubsequent turns decreases by 1d6. The poison ends\nwhen the damage decreases to 0.",
    page: 234,
    endPage: 234,
    category: "potion",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:potion-of-resistance",
    edition: "2014",
    name: "Potion of Resistance",
    metadata: "Potion, uncommon",
    rules:
      "When you drink this potion, you gain resistance to\none type of damage for 1 hour. The GM chooses the\ntype or determines it randomly from the options\nbelow.\nd10 Damage Type d10 Damage Type\n1 Acid 6 Necrotic\n2 Cold 7 Poison\n3 Fire 8 Psychic\n4 Force 9 Radiant\n5 Lightning 10 Thunder",
    page: 235,
    endPage: 235,
    category: "potion",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:potion-of-speed",
    edition: "2014",
    name: "Potion of Speed",
    metadata: "Potion, very rare",
    rules:
      "When you drink this potion, you gain the effect of the\nhaste spell for 1 minute (no concentration required).\nThe potion’s yellow fluid is streaked with black and\nswirls on its own.",
    page: 235,
    endPage: 235,
    category: "potion",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:potion-of-water-breathing",
    edition: "2014",
    name: "Potion of Water Breathing",
    metadata: "Potion, uncommon",
    rules:
      "You can breathe underwater for 1 hour after\ndrinking this potion. Its cloudy green fluid smells of\nthe sea and has a jellyfish-‐‑like bubble floating in it.",
    page: 235,
    endPage: 235,
    category: "potion",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:restorative-ointment",
    edition: "2014",
    name: "Restorative Ointment",
    metadata: "Wondrous item, uncommon",
    rules:
      "This glass jar, 3 inches in diameter, contains 1d4 + 1\ndoses of a thick mixture that smells faintly of aloe.\nThe jar and its contents weigh 1/2 pound.\nAs an action, one dose of the ointment can be\nswallowed or applied to the skin. The creature that\nreceives it regains 2d8 + 2 hit points, ceases to be\npoisoned, and is cured of any disease.",
    page: 235,
    endPage: 235,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:ring-of-animal-influence",
    edition: "2014",
    name: "Ring of Animal Influence",
    metadata: "Ring, rare",
    rules:
      "This ring has 3 charges, and it regains 1d3 expended\ncharges daily at dawn. While wearing the ring, you\ncan use an action to expend 1 of its charges to cast\none of the following spells:\n• Animal friendship (save DC 13)\n• Fear (save DC 13), targeting only beasts that have\nan Intelligence of 3 or lower\n• Speak with animals",
    page: 235,
    endPage: 235,
    category: "ring",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:ring-of-djinni-summoning",
    edition: "2014",
    name: "Ring of Djinni Summoning",
    metadata: "Ring, legendary (requires attunement)",
    rules:
      "While wearing this ring, you can speak its command\nword as an action to summon a particular djinni\nfrom the Elemental Plane of Air. The djinni appears\nin an unoccupied space you choose within 120 feet\nof you. It remains as long as you concentrate (as if\nconcentrating on a spell), to a maximum of 1 hour, or\nuntil it drops to 0 hit points. It then returns to its\nhome plane.\nWhile summoned, the djinni is friendly to you and\nyour companions. It obeys any commands you give it,\nno matter what language you use. If you fail to\ncommand it, the djinni defends itself against\nattackers but takes no other actions.\nAfter the djinni departs, it can’t be summoned\nagain for 24 hours, and the ring becomes nonmagical\nif the djinni dies.",
    page: 235,
    endPage: 235,
    category: "ring",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:ring-of-elemental-command",
    edition: "2014",
    name: "Ring of Elemental Command",
    metadata: "Ring, legendary (requires attunement)",
    rules:
      "This ring is linked to one of the four Elemental\nPlanes. The GM chooses or randomly determines the\nlinked plane.\nWhile wearing this ring, you have advantage on\nattack rolls against elementals from the linked plane,\nand they have disadvantage on attack rolls against\nyou. In addition, you have access to properties based\non the linked plane.\nThe ring has 5 charges. It regains 1d4 + 1\nexpended charges daily at dawn. Spells cast from the\nring have a save DC of 17.\nRing of Air Elemental Command. You can expend\n2 of the ring’s charges to cast dominate monster on\nan air elemental. In addition, when you fall, you\ndescend 60 feet per round and take no damage from\nfalling. You can also speak and understand Auran.\nIf you help slay an air elemental while attuned to\nthe ring, you gain access to the following additional\nproperties:\n• You have resistance to lightning damage.\n• You have a flying speed equal to your walking\nspeed and can hover.\n• You can cast the following spells from the ring,\nexpending the necessary number of charges: chain\nlightning (3 charges), gust of wind (2 charges), or\nwind wall (1 charge).\nRing of Earth Elemental Command. You can\nexpend 2 of the ring’s charges to cast dominate\nmonster on an earth elemental. In addition, you can\nmove in difficult terrain that is composed of rubble,\nrocks, or dirt as if it were normal terrain. You can\nalso speak and understand Terran.\nIf you help slay an earth elemental while attuned\nto the ring, you gain access to the following\nadditional properties:\n• You have resistance to acid damage.\n• You can move through solid earth or rock as if\nthose areas were difficult terrain. If you end your\nturn there, you are shunted out to the nearest\nunoccupied space you last occupied.\n• You can cast the following spells from the ring,\nexpending the necessary number of charges: stone\nshape (2 charges), stoneskin (3 charges), or wall of\nstone (3 charges).\nRing of Fire Elemental Command. You can\nexpend 2 of the ring’s charges to cast dominate\nmonster on a fire elemental. In addition, you have\nresistance to fire damage. You can also speak and\nunderstand Ignan.\nIf you help slay a fire elemental while attuned to\nthe ring, you gain access to the following additional\nproperties:\n• You are immune to fire damage.\n• You can cast the following spells from the ring,\nexpending the necessary number of charges:\nburning hands (1 charge), fireball (2 charges), and\nwall of fire (3 charges).\nRing of Water Elemental Command. You can\nexpend 2 of the ring’s charges to cast dominate\nmonster on a water elemental. In addition, you can\nstand on and walk across liquid surfaces as if they\nwere solid ground. You can also speak and\nunderstand Aquan.\nIf you help slay a water elemental while attuned to\nthe ring, you gain access to the following additional\nproperties:\n• You can breathe underwater and have a\nswimming speed equal to your walking speed.\n• You can cast the following spells from the ring,\nexpending the necessary number of charges:\ncreate or destroy water (1 charge), control water (3\ncharges), ice storm (2 charges), or wall of ice (3\ncharges).",
    page: 235,
    endPage: 236,
    category: "ring",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:ring-of-evasion",
    edition: "2014",
    name: "Ring of Evasion",
    metadata: "Ring, rare (requires attunement)",
    rules:
      "This ring has 3 charges, and it regains 1d3 expended\ncharges daily at dawn. When you fail a Dexterity\nsaving throw while wearing it, you can use your\nreaction to expend 1 of its charges to succeed on that\nsaving throw instead.",
    page: 236,
    endPage: 236,
    category: "ring",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:ring-of-feather-falling",
    edition: "2014",
    name: "Ring of Feather Falling",
    metadata: "Ring, rare (requires attunement)",
    rules: "When you fall while wearing this ring, you descend\n60 feet per round and take no damage from falling.",
    page: 236,
    endPage: 236,
    category: "ring",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:ring-of-free-action",
    edition: "2014",
    name: "Ring of Free Action",
    metadata: "Ring, rare (requires attunement)",
    rules:
      "While you wear this ring, difficult terrain doesn’t\ncost you extra movement. In addition, magic can\nneither reduce your speed nor cause you to be\nparalyzed or restrained.",
    page: 236,
    endPage: 236,
    category: "ring",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:ring-of-invisibility",
    edition: "2014",
    name: "Ring of Invisibility",
    metadata: "Ring, legendary (requires attunement)",
    rules:
      "While wearing this ring, you can turn invisible as an\naction. Anything you are wearing or carrying is\ninvisible with you. You remain invisible until the\nring is removed, until you attack or cast a spell, or\nuntil you use a bonus action to become visible again.",
    page: 236,
    endPage: 236,
    category: "ring",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:ring-of-jumping",
    edition: "2014",
    name: "Ring of Jumping",
    metadata: "Ring, uncommon (requires attunement)",
    rules:
      "While wearing this ring, you can cast the jump spell\nfrom it as a bonus action at will, but can target only\nyourself when you do so.",
    page: 236,
    endPage: 236,
    category: "ring",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:ring-of-mind-shielding",
    edition: "2014",
    name: "Ring of Mind Shielding",
    metadata: "Ring, uncommon (requires attunement)",
    rules:
      "While wearing this ring, you are immune to magic\nthat allows other creatures to read your thoughts,\ndetermine whether you are lying, know your\nalignment, or know your creature type. Creatures\ncan telepathically communicate with you only if you\nallow it.\nYou can use an action to cause the ring to become\ninvisible until you use another action to make it\nvisible, until you remove the ring, or until you die.\nIf you die while wearing the ring, your soul enters\nit, unless it already houses a soul. You can remain in\nthe ring or depart for the afterlife. As long as your\nsoul is in the ring, you can telepathically\ncommunicate with any creature wearing it. A wearer\ncan’t prevent this telepathic communication.",
    page: 236,
    endPage: 236,
    category: "ring",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:ring-of-protection",
    edition: "2014",
    name: "Ring of Protection",
    metadata: "Ring, rare (requires attunement)",
    rules: "You gain a +1 bonus to AC and saving throws while\nwearing this ring.",
    page: 237,
    endPage: 237,
    category: "ring",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:ring-of-regeneration",
    edition: "2014",
    name: "Ring of Regeneration",
    metadata: "Ring, very rare (requires attunement)",
    rules:
      "While wearing this ring, you regain 1d6 hit points\nevery 10 minutes, provided that you have at least 1\nhit point. If you lose a body part, the ring causes the\nmissing part to regrow and return to full\nfunctionality after 1d6 + 1 days if you have at least 1\nhit point the whole time.",
    page: 237,
    endPage: 237,
    category: "ring",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:ring-of-resistance",
    edition: "2014",
    name: "Ring of Resistance",
    metadata: "Ring, rare (requires attunement)",
    rules:
      "You have resistance to one damage type while\nwearing this ring. The gem in the ring indicates the\ntype, which the GM chooses or determines randomly.\nd10 Damage Type Gem\n1 Acid Pearl\n2 Cold Tourmaline\n3 Fire Garnet\n4 Force Sapphire\n5 Lightning Citrine\n6 Necrotic Jet\n7 Poison Amethyst\n8 Psychic Jade\n9 Radiant Topaz\n10 Thunder Spinel",
    page: 237,
    endPage: 237,
    category: "ring",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:ring-of-shooting-stars",
    edition: "2014",
    name: "Ring of Shooting Stars",
    metadata: "Ring, very rare (requires attunement outdoors at night)",
    rules:
      "While wearing this ring in dim light or darkness, you\ncan cast dancing lights and light from the ring at will.\nCasting either spell from the ring requires an action.\nThe ring has 6 charges for the following other\nproperties. The ring regains 1d6 expended charges\ndaily at dawn.\nFaerie Fire. You can expend 1 charge as an action\nto cast faerie fire from the ring.\nBall Lightning. You can expend 2 charges as an\naction to create one to four 3-‐‑foot-‐‑diameter spheres\nof lightning. The more spheres you create, the less\npowerful each sphere is individually.\nEach sphere appears in an unoccupied space you\ncan see within 120 feet of you. The spheres last as\nlong as you concentrate (as if concentrating on a\nspell), up to 1 minute. Each sphere sheds dim light in\na 30-‐‑foot radius.\nAs a bonus action, you can move each sphere up to\n30 feet, but no farther than 120 feet away from you.\nWhen a creature other than you comes within 5 feet\nof a sphere, the sphere discharges lightning at that\ncreature and disappears. That creature must make a\nDC 15 Dexterity saving throw. On a failed save, the\ncreature takes lightning damage based on the\nnumber of spheres you created.\nSpheres Lightning Damage\n4 2d4\n3 2d6\n2 5d4\n1 4d12\nShooting Stars. You can expend 1 to 3 charges as\nan action. For every charge you expend, you launch a\nglowing mote of light from the ring at a point you\ncan see within 60 feet of you. Each creature within a\n15-‐‑foot cube originating from that point is showered\nin sparks and must make a DC 15 Dexterity saving\nthrow, taking 5d4 fire damage on a failed save, or\nhalf as much damage on a successful one.",
    page: 237,
    endPage: 237,
    category: "ring",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:ring-of-spell-storing",
    edition: "2014",
    name: "Ring of Spell Storing",
    metadata: "Ring, rare (requires attunement)",
    rules:
      "This ring stores spells cast into it, holding them until\nthe attuned wearer uses them. The ring can store up\nto 5 levels worth of spells at a time. When found, it\ncontains 1d6 − 1 levels of stored spells chosen by the\nGM.\nAny creature can cast a spell of 1st through 5th\nlevel into the ring by touching the ring as the spell is\ncast. The spell has no effect, other than to be stored\nin the ring. If the ring can’t hold the spell, the spell is\nexpended without effect. The level of the slot used to\ncast the spell determines how much space it uses.\nWhile wearing this ring, you can cast any spell\nstored in it. The spell uses the slot level, spell save\nDC, spell attack bonus, and spellcasting ability of the\noriginal caster, but is otherwise treated as if you cast\nthe spell. The spell cast from the ring is no longer\nstored in it, freeing up space.",
    page: 237,
    endPage: 237,
    category: "ring",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:ring-of-spell-turning",
    edition: "2014",
    name: "Ring of Spell Turning",
    metadata: "Ring, legendary (requires attunement)",
    rules:
      "While wearing this ring, you have advantage on\nsaving throws against any spell that targets only you\n(not in an area of effect). In addition, if you roll a 20\nfor the save and the spell is 7th level or lower, the\nspell has no effect on you and instead targets the\ncaster, using the slot level, spell save DC, attack\nbonus, and spellcasting ability of the caster.",
    page: 237,
    endPage: 237,
    category: "ring",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:ring-of-swimming",
    edition: "2014",
    name: "Ring of Swimming",
    metadata: "Ring, uncommon",
    rules: "You have a swimming speed of 40 feet while wearing\nthis ring.",
    page: 238,
    endPage: 238,
    category: "ring",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:ring-of-telekinesis",
    edition: "2014",
    name: "Ring of Telekinesis",
    metadata: "Ring, very rare (requires attunement)",
    rules:
      "While wearing this ring, you can cast the telekinesis\nspell at will, but you can target only objects that\naren’t being worn or carried.",
    page: 238,
    endPage: 238,
    category: "ring",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:ring-of-the-ram",
    edition: "2014",
    name: "Ring of the Ram",
    metadata: "Ring, rare (requires attunement)",
    rules:
      "This ring has 3 charges, and it regains 1d3 expended\ncharges daily at dawn. While wearing the ring, you\ncan use an action to expend 1 to 3 of its charges to\nattack one creature you can see within 60 feet of you.\nThe ring produces a spectral ram’s head and makes\nits attack roll with a +7 bonus. On a hit, for each\ncharge you spend, the target takes 2d10 force\ndamage and is pushed 5 feet away from you.\nAlternatively, you can expend 1 to 3 of the ring’s\ncharges as an action to try to break an object you can\nsee within 60 feet of you that isn’t being worn or\ncarried. The ring makes a Strength check with a +5\nbonus for each charge you spend.",
    page: 238,
    endPage: 238,
    category: "ring",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:ring-of-three-wishes",
    edition: "2014",
    name: "Ring of Three Wishes",
    metadata: "Ring, legendary",
    rules:
      "While wearing this ring, you can use an action to\nexpend 1 of its 3 charges to cast the wish spell from\nit. The ring becomes nonmagical when you use the\nlast charge.",
    page: 238,
    endPage: 238,
    category: "ring",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:ring-of-warmth",
    edition: "2014",
    name: "Ring of Warmth",
    metadata: "Ring, uncommon (requires attunement)",
    rules:
      "While wearing this ring, you have resistance to cold\ndamage. In addition, you and everything you wear\nand carry are unharmed by temperatures as low as\n−50 degrees Fahrenheit.",
    page: 238,
    endPage: 238,
    category: "ring",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:ring-of-water-walking",
    edition: "2014",
    name: "Ring of Water Walking",
    metadata: "Ring, uncommon",
    rules: "While wearing this ring, you can stand on and move\nacross any liquid surface as if it were solid ground.",
    page: 238,
    endPage: 238,
    category: "ring",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:ring-of-x-ray-vision",
    edition: "2014",
    name: "Ring of X-ray Vision",
    metadata: "Ring, rare (requires attunement)",
    rules:
      "While wearing this ring, you can use an action to\nspeak its command word. When you do so, you can\nsee into and through solid matter for 1 minute. This\nvision has a radius of 30 feet. To you, solid objects\nwithin that radius appear transparent and don’t\nprevent light from passing through them. The vision\ncan penetrate 1 foot of stone, 1 inch of common\nmetal, or up to 3 feet of wood or dirt. Thicker\nsubstances block the vision, as does a thin sheet of\nlead.\nWhenever you use the ring again before taking a\nlong rest, you must succeed on a DC 15 Constitution\nsaving throw or gain one level of exhaustion.",
    page: 238,
    endPage: 238,
    category: "ring",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:robe-of-eyes",
    edition: "2014",
    name: "Robe of Eyes",
    metadata: "Wondrous item, rare (requires attunement)",
    rules:
      "This robe is adorned with eyelike patterns. While\nyou wear the robe, you gain the following benefits:\n• The robe lets you see in all directions, and you\nhave advantage on Wisdom (Perception) checks\nthat rely on sight.\n• You have darkvision out to a range of 120 feet.\n• You can see invisible creatures and objects, as well\nas see into the Ethereal Plane, out to a range of\n120 feet.\nThe eyes on the robe can’t be closed or averted.\nAlthough you can close or avert your own eyes, you\nare never considered to be doing so while wearing\nthis robe.\nA light spell cast on the robe or a daylight spell\ncast within 5 feet of the robe causes you to be\nblinded for 1 minute. At the end of each of your\nturns, you can make a Constitution saving throw (DC\n11 for light or DC 15 for daylight), ending the\nblindness on a success.",
    page: 238,
    endPage: 238,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:robe-of-scintillating-colors",
    edition: "2014",
    name: "Robe of Scintillating Colors",
    metadata: "Wondrous item, very rare (requires attunement)",
    rules:
      "This robe has 3 charges, and it regains 1d3 expended\ncharges daily at dawn. While you wear it, you can\nuse an action and expend 1 charge to cause the\ngarment to display a shifting pattern of dazzling\nhues until the end of your next turn. During this time,\nthe robe sheds bright light in a 30-‐‑foot radius and\ndim light for an additional 30 feet. Creatures that can\nsee you have disadvantage on attack rolls against\nyou. In addition, any creature in the bright light that\ncan see you when the robe’s power is activated must\nsucceed on a DC 15 Wisdom saving throw or become\nstunned until the effect ends.",
    page: 238,
    endPage: 238,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:robe-of-stars",
    edition: "2014",
    name: "Robe of Stars",
    metadata: "Wondrous item, very rare (requires attunement)",
    rules:
      "This black or dark blue robe is embroidered with\nsmall white or silver stars. You gain a +1 bonus to\nsaving throws while you wear it.\nSix stars, located on the robe’s upper front portion,\nare particularly large. While wearing this robe, you\ncan use an action to pull off one of the stars and use\nit to cast magic missile as a 5th-‐‑level spell. Daily at\ndusk, 1d6 removed stars reappear on the robe.\nWhile you wear the robe, you can use an action to\nenter the Astral Plane along with everything you are\nwearing and carrying. You remain there until you\nuse an action to return to the plane you were on. You\nreappear in the last space you occupied, or if that\nspace is occupied, the nearest unoccupied space.",
    page: 239,
    endPage: 239,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:robe-of-the-archmagi",
    edition: "2014",
    name: "Robe of the Archmagi",
    metadata: "Wondrous item, legendary (requires attunement by a sorcerer, warlock, or wizard)",
    rules:
      "This elegant garment is made from exquisite cloth of\nwhite, gray, or black and adorned with silvery runes.\nThe robe’s color corresponds to the alignment for\nwhich the item was created. A white robe was made\nfor good, gray for neutral, and black for evil. You\ncan’t attune to a robe of the archmagi that doesn’t\ncorrespond to your alignment.\nYou gain these benefits while wearing the robe:\n• If you aren’t wearing armor, your base Armor\nClass is 15 + your Dexterity modifier.\n• You have advantage on saving throws against\nspells and other magical effects.\n• Your spell save DC and spell attack bonus each\nincrease by 2.",
    page: 239,
    endPage: 239,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:robe-of-useful-items",
    edition: "2014",
    name: "Robe of Useful Items",
    metadata: "Wondrous item, uncommon",
    rules:
      "This robe has cloth patches of various shapes and\ncolors covering it. While wearing the robe, you can\nuse an action to detach one of the patches, causing it\nto become the object or creature it represents. Once\nthe last patch is removed, the robe becomes an\nordinary garment.\nThe robe has two of each of the following patches:\n• Dagger\n• Bullseye lantern (filled and lit)\n• Steel mirror\n• 10-‐‑foot pole\n• Hempen rope (50 feet, coiled)\n• Sack\nIn addition, the robe has 4d4 other patches. The\nGM chooses the patches or determines them\nrandomly.\nd100 Patch\n01–08 Bag of 100 gp\n09–15 Silver coffer (1 foot long, 6 inches wide and\ndeep) worth 500 gp\n16–22 Iron door (up to 10 feet wide and 10 feet high,\nbarred on one side of your choice), which you\ncan place in an opening you can reach; it\nconforms to fit the opening, attaching and\nhinging itself\n23–30 10 gems worth 100 gp each\n31–44 Wooden ladder (24 feet long)\n45–51 A riding horse with saddle bags\n52–59 Pit (a cube 10 feet on a side), which you can\nplace on the ground within 10 feet of you\n60–68 4 potions of healing\n69–75 Rowboat (12 feet long)\n76–83 Spell scroll containing one spell of 1st to 3rd\nlevel\n84–90 2 mastiffs\n91–96 Window (2 feet by 4 feet, up to 2 feet deep),\nwhich you can place on a vertical surface you\ncan reach\n97–00 Portable ram",
    page: 239,
    endPage: 239,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:rod-of-absorption",
    edition: "2014",
    name: "Rod of Absorption",
    metadata: "Rod, very rare (requires attunement)",
    rules:
      "While holding this rod, you can use your reaction to\nabsorb a spell that is targeting only you and not with\nan area of effect. The absorbed spell’s effect is\ncanceled, and the spell’s energy—not the spell\nitself—is stored in the rod. The energy has the same\nlevel as the spell when it was cast. The rod can\nabsorb and store up to 50 levels of energy over the\ncourse of its existence. Once the rod absorbs 50\nlevels of energy, it can’t absorb more. If you are\ntargeted by a spell that the rod can’t store, the rod\nhas no effect on that spell.\nWhen you become attuned to the rod, you know\nhow many levels of energy the rod has absorbed\nover the course of its existence, and how many levels\nof spell energy it currently has stored.\nIf you are a spellcaster holding the rod, you can\nconvert energy stored in it into spell slots to cast\nspells you have prepared or know. You can create\nspell slots only of a level equal to or lower than your\nown spell slots, up to a maximum of 5th level. You\nuse the stored levels in place of your slots, but\notherwise cast the spell as normal. For example, you\ncan use 3 levels stored in the rod as a 3rd-‐‑level spell\nslot.\nA newly found rod has 1d10 levels of spell energy\nstored in it already. A rod that can no longer absorb\nspell energy and has no energy remaining becomes\nnonmagical.",
    page: 239,
    endPage: 240,
    category: "rod",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:rod-of-alertness",
    edition: "2014",
    name: "Rod of Alertness",
    metadata: "Rod, very rare (requires attunement)",
    rules:
      "This rod has a flanged head and the following\nproperties.\nAlertness. While holding the rod, you have\nadvantage on Wisdom (Perception) checks and on\nrolls for initiative.\nSpells. While holding the rod, you can use an\naction to cast one of the following spells from it:\ndetect evil and good, detect magic, detect poison and\ndisease, or see invisibility.\nProtective Aura. As an action, you can plant the\nhaft end of the rod in the ground, whereupon the\nrod’s head sheds bright light in a 60-‐‑foot radius and\ndim light for an additional 60 feet. While in that\nbright light, you and any creature that is friendly to\nyou gain a +1 bonus to AC and saving throws and can\nsense the location of any invisible hostile creature\nthat is also in the bright light.\nThe rod’s head stops glowing and the effect ends\nafter 10 minutes, or when a creature uses an action\nto pull the rod from the ground. This property can’t\nbe used again until the next dawn.",
    page: 240,
    endPage: 240,
    category: "rod",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:rod-of-lordly-might",
    edition: "2014",
    name: "Rod of Lordly Might",
    metadata: "Rod, legendary (requires attunement)",
    rules:
      "This rod has a flanged head, and it functions as a\nmagic mace that grants a +3 bonus to attack and\ndamage rolls made with it. The rod has properties\nassociated with six different buttons that are set in a\nrow along the haft. It has three other properties as\nwell, detailed below.\nSix Buttons. You can press one of the rod’s six\nbuttons as a bonus action. A button’s effect lasts\nuntil you push a different button or until you push\nthe same button again, which causes the rod to\nrevert to its normal form.\nIf you press button 1, the rod becomes a flame\ntongue, as a fiery blade sprouts from the end\nopposite the rod’s flanged head.\nIf you press button 2, the rod’s flanged head folds\ndown and two crescent-‐‑shaped blades spring out,\ntransforming the rod into a magic battleaxe that\ngrants a +3 bonus to attack and damage rolls made\nwith it.\nIf you press button 3, the rod’s flanged head folds\ndown, a spear point springs from the rod’s tip, and\nthe rod’s handle lengthens into a 6-‐‑foot haft,\ntransforming the rod into a magic spear that grants a\n+3 bonus to attack and damage rolls made with it.\nIf you press button 4, the rod transforms into a\nclimbing pole up to 50 feet long, as you specify. In\nsurfaces as hard as granite, a spike at the bottom and\nthree hooks at the top anchor the pole. Horizontal\nbars 3 inches long fold out from the sides, 1 foot\napart, forming a ladder. The pole can bear up to\n4,000 pounds. More weight or lack of solid\nanchoring causes the rod to revert to its normal\nform.\nIf you press button 5, the rod transforms into a\nhandheld battering ram and grants its user a +10\nbonus to Strength checks made to break through\ndoors, barricades, and other barriers.\nIf you press button 6, the rod assumes or remains\nin its normal form and indicates magnetic north.\n(Nothing happens if this function of the rod is used\nin a location that has no magnetic north.) The rod\nalso gives you knowledge of your approximate depth\nbeneath the ground or your height above it.\nDrain Life. When you hit a creature with a melee\nattack using the rod, you can force the target to\nmake a DC 17 Constitution saving throw. On a failure,\nthe target takes an extra 4d6 necrotic damage, and\nyou regain a number of hit points equal to half that\nnecrotic damage. This property can’t be used again\nuntil the next dawn.\nParalyze. When you hit a creature with a melee\nattack using the rod, you can force the target to\nmake a DC 17 Strength saving throw. On a failure,\nthe target is paralyzed for 1 minute. The target can\nrepeat the saving throw at the end of each of its\nturns, ending the effect on a success. This property\ncan’t be used again until the next dawn.\nTerrify. While holding the rod, you can use an\naction to force each creature you can see within 30\nfeet of you to make a DC 17 Wisdom saving throw.\nOn a failure, a target is frightened of you for 1\nminute. A frightened target can repeat the saving\nthrow at the end of each of its turns, ending the\neffect on itself on a success. This property can’t be\nused again until the next dawn.",
    page: 240,
    endPage: 240,
    category: "rod",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:rod-of-rulership",
    edition: "2014",
    name: "Rod of Rulership",
    metadata: "Rod, rare (requires attunement)",
    rules:
      "You can use an action to present the rod and\ncommand obedience from each creature of your\nchoice that you can see within 120 feet of you. Each\ntarget must succeed on a DC 15 Wisdom saving\nthrow or be charmed by you for 8 hours. While\ncharmed in this way, the creature regards you as its\ntrusted leader. If harmed by you or your companions,\nor commanded to do something contrary to its\nnature, a target ceases to be charmed in this way.\nThe rod can’t be used again until the next dawn.",
    page: 240,
    endPage: 241,
    category: "rod",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:rod-of-security",
    edition: "2014",
    name: "Rod of Security",
    metadata: "Rod, very rare",
    rules:
      "While holding this rod, you can use an action to\nactivate it. The rod then instantly transports you and\nup to 199 other willing creatures you can see to a\nparadise that exists in an extraplanar space. You\nchoose the form that the paradise takes. It could be a\ntranquil garden, lovely glade, cheery tavern,\nimmense palace, tropical island, fantastic carnival, or\nwhatever else you can imagine. Regardless of its\nnature, the paradise contains enough water and food\nto sustain its visitors. Everything else that can be\ninteracted with inside the extraplanar space can\nexist only there. For example, a flower picked from a\ngarden in the paradise disappears if it is taken\noutside the extraplanar space.\nFor each hour spent in the paradise, a visitor\nregains hit points as if it had spent 1 Hit Die. Also,\ncreatures don’t age while in the paradise, although\ntime passes normally. Visitors can remain in the\nparadise for up to 200 days divided by the number\nof creatures present (round down).\nWhen the time runs out or you use an action to\nend it, all visitors reappear in the location they\noccupied when you activated the rod, or an\nunoccupied space nearest that location. The rod\ncan’t be used again until ten days have passed.",
    page: 241,
    endPage: 241,
    category: "rod",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:rope-of-climbing",
    edition: "2014",
    name: "Rope of Climbing",
    metadata: "Wondrous item, uncommon",
    rules:
      "This 60-‐‑foot length of silk rope weighs 3 pounds and\ncan hold up to 3,000 pounds. If you hold one end of\nthe rope and use an action to speak the command\nword, the rope animates. As a bonus action, you can\ncommand the other end to move toward a\ndestination you choose. That end moves 10 feet on\nyour turn when you first command it and 10 feet on\neach of your turns until reaching its destination, up\nto its maximum length away, or until you tell it to\nstop. You can also tell the rope to fasten itself\nsecurely to an object or to unfasten itself, to knot or\nunknot itself, or to coil itself for carrying.\nIf you tell the rope to knot, large knots appear at 1-‐‑\nfoot intervals along the rope. While knotted, the rope\nshortens to a 50-‐‑foot length and grants advantage on\nchecks made to climb it.\nThe rope has AC 20 and 20 hit points. It regains 1\nhit point every 5 minutes as long as it has at least 1\nhit point. If the rope drops to 0 hit points, it is\ndestroyed.",
    page: 241,
    endPage: 241,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:rope-of-entanglement",
    edition: "2014",
    name: "Rope of Entanglement",
    metadata: "Wondrous item, rare",
    rules:
      "This rope is 30 feet long and weighs 3 pounds. If you\nhold one end of the rope and use an action to speak\nits command word, the other end darts forward to\nentangle a creature you can see within 20 feet of you.\nThe target must succeed on a DC 15 Dexterity saving\nthrow or become restrained.\nYou can release the creature by using a bonus\naction to speak a second command word. A target\nrestrained by the rope can use an action to make a\nDC 15 Strength or Dexterity check (target’s choice).\nOn a success, the creature is no longer restrained by\nthe rope.\nThe rope has AC 20 and 20 hit points. It regains 1\nhit point every 5 minutes as long as it has at least 1\nhit point. If the rope drops to 0 hit points, it is\ndestroyed.",
    page: 241,
    endPage: 241,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:scarab-of-protection",
    edition: "2014",
    name: "Scarab of Protection",
    metadata: "Wondrous item, legendary (requires attunement)",
    rules:
      "If you hold this beetle-‐‑shaped medallion in your\nhand for 1 round, an inscription appears on its\nsurface revealing its magical nature. It provides two\nbenefits while it is on your person:\n• You have advantage on saving throws against\nspells.\n• The scarab has 12 charges. If you fail a saving\nthrow against a necromancy spell or a harmful\neffect originating from an undead creature, you\ncan use your reaction to expend 1 charge and turn\nthe failed save into a successful one. The scarab\ncrumbles into powder and is destroyed when its\nlast charge is expended.",
    page: 241,
    endPage: 241,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:scimitar-of-speed",
    edition: "2014",
    name: "Scimitar of Speed",
    metadata: "Weapon (scimitar), very rare (requires attunement)",
    rules:
      "You gain a +2 bonus to attack and damage rolls\nmade with this magic weapon. In addition, you can\nmake one attack with it as a bonus action on each of\nyour turns.",
    page: 241,
    endPage: 241,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:shield-1-2-or-3",
    edition: "2014",
    name: "Shield, +1, +2, or +3",
    metadata: "Armor (shield), uncommon (+1), rare (+2), or very rare (+3)",
    rules:
      "While holding this shield, you have a bonus to AC\ndetermined by the shield’s rarity. This bonus is in\naddition to the shield’s normal bonus to AC.",
    page: 242,
    endPage: 242,
    category: "armor",
    rarities: ["uncommon", "rare", "veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:shield-of-missile-attraction",
    edition: "2014",
    name: "Shield of Missile Attraction",
    metadata: "Armor (shield), rare (requires attunement)",
    rules:
      "While holding this shield, you have resistance to\ndamage from ranged weapon attacks.\nCurse. This shield is cursed. Attuning to it curses\nyou until you are targeted by the remove curse spell\nor similar magic. Removing the shield fails to end the\ncurse on you. Whenever a ranged weapon attack is\nmade against a target within 10 feet of you, the curse\ncauses you to become the target instead.",
    page: 242,
    endPage: 242,
    category: "armor",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:slippers-of-spider-climbing",
    edition: "2014",
    name: "Slippers of Spider Climbing",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "While you wear these light shoes, you can move up,\ndown, and across vertical surfaces and upside down\nalong ceilings, while leaving your hands free. You\nhave a climbing speed equal to your walking speed.\nHowever, the slippers don’t allow you to move this\nway on a slippery surface, such as one covered by ice\nor oil.",
    page: 242,
    endPage: 242,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:sovereign-glue",
    edition: "2014",
    name: "Sovereign Glue",
    metadata: "Wondrous item, legendary",
    rules:
      "This viscous, milky-‐‑white substance can form a\npermanent adhesive bond between any two objects.\nIt must be stored in a jar or flask that has been\ncoated inside with oil of slipperiness. When found, a\ncontainer contains 1d6 + 1 ounces.\nOne ounce of the glue can cover a 1-‐‑foot square\nsurface. The glue takes 1 minute to set. Once it has\ndone so, the bond it creates can be broken only by\nthe application of universal solvent or oil of\netherealness, or with a wish spell.",
    page: 242,
    endPage: 242,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:spell-scroll",
    edition: "2014",
    name: "Spell Scroll",
    metadata: "Scroll, varies",
    rules:
      "A spell scroll bears the words of a single spell,\nwritten in a mystical cipher. If the spell is on your\nclass’s spell list, you can read the scroll and cast its\nspell without providing any material components.\nOtherwise, the scroll is unintelligible. Casting the\nspell by reading the scroll requires the spell’s normal\ncasting time. Once the spell is cast, the words on the\nscroll fade, and it crumbles to dust. If the casting is\ninterrupted, the scroll is not lost.\nIf the spell is on your class’s spell list but of a\nhigher level than you can normally cast, you must\nmake an ability check using your spellcasting ability\nto determine whether you cast it successfully. The\nDC equals 10 + the spell’s level. On a failed check, the\nspell disappears from the scroll with no other effect.\nThe level of the spell on the scroll determines the\nspell’s saving throw DC and attack bonus, as well as\nthe scroll’s rarity, as shown in the Spell Scroll table.\nSpell Scroll\nSpell Level Rarity Save DC Attack Bonus\nCantrip Common 13 +5\n1st Common 13 +5\n2nd Uncommon 13 +5\n3rd Uncommon 15 +7\n4th Rare 15 +7\n5th Rare 17 +9\n6th Very rare 17 +9\n7th Very rare 18 +10\n8th Very rare 18 +10\n9th Legendary 19 +11\nA wizard spell on a spell scroll can be copied just as\nspells in spellbooks can be copied. When a spell is\ncopied from a spell scroll, the copier must succeed on\nan Intelligence (Arcana) check with a DC equal to 10\n+ the spell’s level. If the check succeeds, the spell is\nsuccessfully copied. Whether the check succeeds or\nfails, the spell scroll is destroyed.",
    page: 242,
    endPage: 242,
    category: "scroll",
    rarities: [],
    rarityVaries: true,
    attunement: false
  },
  {
    id: "srd51:spellguard-shield",
    edition: "2014",
    name: "Spellguard Shield",
    metadata: "Armor (shield), very rare (requires attunement)",
    rules:
      "While holding this shield, you have advantage on\nsaving throws against spells and other magical\neffects, and spell attacks have disadvantage against\nyou.",
    page: 242,
    endPage: 242,
    category: "armor",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:sphere-of-annihilation",
    edition: "2014",
    name: "Sphere of Annihilation",
    metadata: "Wondrous item, legendary",
    rules:
      "This 2-‐‑foot-‐‑diameter black sphere is a hole in the\nmultiverse, hovering in space and stabilized by a\nmagical field surrounding it.\nThe sphere obliterates all matter it passes through\nand all matter that passes through it. Artifacts are\nthe exception. Unless an artifact is susceptible to\ndamage from a sphere of annihilation, it passes\nthrough the sphere unscathed. Anything else that\ntouches the sphere but isn’t wholly engulfed and\nobliterated by it takes 4d10 force damage.\nThe sphere is stationary until someone controls it.\nIf you are within 60 feet of an uncontrolled sphere,\nyou can use an action to make a DC 25 Intelligence\n(Arcana) check. On a success, the sphere levitates in\none direction of your choice, up to a number of feet\nequal to 5 × your Intelligence modifier (minimum 5\nfeet). On a failure, the sphere moves 10 feet toward\nyou. A creature whose space the sphere enters must\nsucceed on a DC 13 Dexterity saving throw or be\ntouched by it, taking 4d10 force damage.\nIf you attempt to control a sphere that is under\nanother creature’s control, you make an Intelligence\n(Arcana) check contested by the other creature’s\nIntelligence (Arcana) check. The winner of the\ncontest gains control of the sphere and can levitate it\nas normal.\nIf the sphere comes into contact with a planar\nportal, such as that created by the gate spell, or an\nextradimensional space, such as that within a\nportable hole, the GM determines randomly what\nhappens, using the following table.\nd100 Result\n01–50 The sphere is destroyed.\n51–85 The sphere moves through the portal or into\nthe extradimensional space.\n86–00 A spatial rift sends each creature and object\nwithin 180 feet of the sphere, including the\nsphere, to a random plane of existence.",
    page: 242,
    endPage: 243,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:staff-of-charming",
    edition: "2014",
    name: "Staff of Charming",
    metadata: "Staff, rare (requires attunement by a bard, cleric, druid, sorcerer, warlock, or wizard)",
    rules:
      "While holding this staff, you can use an action to\nexpend 1 of its 10 charges to cast charm person,\ncommand, or comprehend languages from it using\nyour spell save DC. The staff can also be used as a\nmagic quarterstaff.\nIf you are holding the staff and fail a saving throw\nagainst an enchantment spell that targets only you,\nyou can turn your failed save into a successful one.\nYou can’t use this property of the staff again until the\nnext dawn. If you succeed on a save against an\nenchantment spell that targets only you, with or\nwithout the staff’s intervention, you can use your\nreaction to expend 1 charge from the staff and turn\nthe spell back on its caster as if you had cast the spell.\nThe staff regains 1d8 + 2 expended charges daily\nat dawn. If you expend the last charge, roll a d20. On\na 1, the staff becomes a nonmagical quarterstaff.",
    page: 243,
    endPage: 243,
    category: "staff",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:staff-of-fire",
    edition: "2014",
    name: "Staff of Fire",
    metadata: "Staff, very rare (requires attunement by a druid, sorcerer, warlock, or wizard)",
    rules:
      "You have resistance to fire damage while you hold\nthis staff.\nThe staff has 10 charges. While holding it, you can\nuse an action to expend 1 or more of its charges to\ncast one of the following spells from it, using your\nspell save DC: burning hands (1 charge), fireball (3\ncharges), or wall of fire (4 charges).\nThe staff regains 1d6 + 4 expended charges daily\nat dawn. If you expend the last charge, roll a d20. On\na 1, the staff blackens, crumbles into cinders, and is\ndestroyed.",
    page: 243,
    endPage: 243,
    category: "staff",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:staff-of-frost",
    edition: "2014",
    name: "Staff of Frost",
    metadata: "Staff, very rare (requires attunement by a druid, sorcerer, warlock, or wizard)",
    rules:
      "You have resistance to cold damage while you hold\nthis staff.\nThe staff has 10 charges. While holding it, you can\nuse an action to expend 1 or more of its charges to\ncast one of the following spells from it, using your\nspell save DC: cone of cold (5 charges), fog cloud (1\ncharge), ice storm (4 charges), or wall of ice (4\ncharges).\nThe staff regains 1d6 + 4 expended charges daily\nat dawn. If you expend the last charge, roll a d20. On\na 1, the staff turns to water and is destroyed.",
    page: 243,
    endPage: 243,
    category: "staff",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:staff-of-healing",
    edition: "2014",
    name: "Staff of Healing",
    metadata: "Staff, rare (requires attunement by a bard, cleric, or druid)",
    rules:
      "This staff has 10 charges. While holding it, you can\nuse an action to expend 1 or more of its charges to\ncast one of the following spells from it, using your\nspell save DC and spellcasting ability modifier: cure\nwounds (1 charge per spell level, up to 4th), lesser\nrestoration (2 charges), or mass cure wounds (5\ncharges).\nThe staff regains 1d6 + 4 expended charges daily\nat dawn. If you expend the last charge, roll a d20. On\na 1, the staff vanishes in a flash of light, lost forever.",
    page: 243,
    endPage: 243,
    category: "staff",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:staff-of-power",
    edition: "2014",
    name: "Staff of Power",
    metadata: "Staff, very rare (requires attunement by a sorcerer, warlock, or wizard)",
    rules:
      "This staff can be wielded as a magic quarterstaff that\ngrants a +2 bonus to attack and damage rolls made\nwith it. While holding it, you gain a +2 bonus to\nArmor Class, saving throws, and spell attack rolls.\nThe staff has 20 charges for the following\nproperties. The staff regains 2d8 + 4 expended\ncharges daily at dawn. If you expend the last charge,\nroll a d20. On a 1, the staff retains its +2 bonus to\nattack and damage rolls but loses all other\nproperties. On a 20, the staff regains 1d8 + 2 charges.\nPower Strike. When you hit with a melee attack\nusing the staff, you can expend 1 charge to deal an\nextra 1d6 force damage to the target.\nSpells. While holding this staff, you can use an\naction to expend 1 or more of its charges to cast one\nof the following spells from it, using your spell save\nDC and spell attack bonus: cone of cold (5 charges),\nfireball (5th-‐‑level version, 5 charges), globe of\ninvulnerability (6 charges), hold monster (5 charges),\nlevitate (2 charges), lightning bolt (5th-‐‑level version,\n5 charges), magic missile (1 charge), ray of\nenfeeblement (1 charge), or wall of force (5 charges).\nRetributive Strike. You can use an action to break\nthe staff over your knee or against a solid surface,\nperforming a retributive strike. The staff is\ndestroyed and releases its remaining magic in an\nexplosion that expands to fill a 30-‐‑foot-‐‑radius sphere\ncentered on it.\nYou have a 50 percent chance to instantly travel to\na random plane of existence, avoiding the explosion.\nIf you fail to avoid the effect, you take force damage\nequal to 16 × the number of charges in the staff.\nEvery other creature in the area must make a DC 17\nDexterity saving throw. On a failed save, a creature\ntakes an amount of damage based on how far away it\nis from the point of origin, as shown in the following\ntable. On a successful save, a creature takes half as\nmuch damage.\nDistance from Origin Damage\n10 ft. away or closer 8 × the number of charges in the staff\n11 to 20 ft. away 6 × the number of charges in the staff\n21 to 30 ft. away 4 × the number of charges in the staff",
    page: 243,
    endPage: 244,
    category: "staff",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:staff-of-striking",
    edition: "2014",
    name: "Staff of Striking",
    metadata: "Staff, very rare (requires attunement)",
    rules:
      "This staff can be wielded as a magic quarterstaff that\ngrants a +3 bonus to attack and damage rolls made\nwith it.\nThe staff has 10 charges. When you hit with a\nmelee attack using it, you can expend up to 3 of its\ncharges. For each charge you expend, the target\ntakes an extra 1d6 force damage. The staff regains\n1d6 + 4 expended charges daily at dawn. If you\nexpend the last charge, roll a d20. On a 1, the staff\nbecomes a nonmagical quarterstaff.",
    page: 244,
    endPage: 244,
    category: "staff",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:staff-of-swarming-insects",
    edition: "2014",
    name: "Staff of Swarming Insects",
    metadata: "Staff, rare (requires attunement by a bard, cleric, druid, sorcerer, warlock, or wizard)",
    rules:
      "This staff has 10 charges and regains 1d6 + 4\nexpended charges daily at dawn. If you expend the\nlast charge, roll a d20. On a 1, a swarm of insects\nconsumes and destroys the staff, then disperses.\nSpells. While holding the staff, you can use an\naction to expend some of its charges to cast one of\nthe following spells from it, using your spell save DC:\ngiant insect (4 charges) or insect plague (5 charges).\nInsect Cloud. While holding the staff, you can use\nan action and expend 1 charge to cause a swarm of\nharmless flying insects to spread out in a 30-‐‑foot\nradius from you. The insects remain for 10 minutes,\nmaking the area heavily obscured for creatures\nother than you. The swarm moves with you,\nremaining centered on you. A wind of at least 10\nmiles per hour disperses the swarm and ends the\neffect.",
    page: 244,
    endPage: 244,
    category: "staff",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:staff-of-the-magi",
    edition: "2014",
    name: "Staff of the Magi",
    metadata: "Staff, legendary (requires attunement by a sorcerer, warlock, or wizard)",
    rules:
      "This staff can be wielded as a magic quarterstaff that\ngrants a +2 bonus to attack and damage rolls made\nwith it. While you hold it, you gain a +2 bonus to\nspell attack rolls.\nThe staff has 50 charges for the following\nproperties. It regains 4d6 + 2 expended charges\ndaily at dawn. If you expend the last charge, roll a\nd20. On a 20, the staff regains 1d12 + 1 charges.\nSpell Absorption. While holding the staff, you\nhave advantage on saving throws against spells. In\naddition, you can use your reaction when another\ncreature casts a spell that targets only you. If you do,\nthe staff absorbs the magic of the spell, canceling its\neffect and gaining a number of charges equal to the\nabsorbed spell’s level. However, if doing so brings\nthe staff’s total number of charges above 50, the staff\nexplodes as if you activated its retributive strike (see\nbelow).\nSpells. While holding the staff, you can use an\naction to expend some of its charges to cast one of\nthe following spells from it, using your spell save DC\nand spellcasting ability: conjure elemental (7\ncharges), dispel magic (3 charges), fireball (7th-‐‑level\nversion, 7 charges), flaming sphere (2 charges), ice\nstorm (4 charges), invisibility (2 charges), knock (2\ncharges), lightning bolt (7th-‐‑level version, 7 charges),\npasswall (5 charges), plane shift (7 charges),\ntelekinesis (5 charges), wall of fire (4 charges), or\nweb (2 charges).\nYou can also use an action to cast one of the\nfollowing spells from the staff without using any\ncharges: arcane lock, detect magic, enlarge/reduce,\nlight, mage hand, or protection from evil and good.\nRetributive Strike. You can use an action to break\nthe staff over your knee or against a solid surface,\nperforming a retributive strike. The staff is\ndestroyed and releases its remaining magic in an\nexplosion that expands to fill a 30-‐‑foot-‐‑radius sphere\ncentered on it.\nYou have a 50 percent chance to instantly travel to\na random plane of existence, avoiding the explosion.\nIf you fail to avoid the effect, you take force damage\nequal to 16 × the number of charges in the staff.\nEvery other creature in the area must make a DC 17\nDexterity saving throw. On a failed save, a creature\ntakes an amount of damage based on how far away it\nis from the point of origin, as shown in the following\ntable. On a successful save, a creature takes half as\nmuch damage.\nDistance from Origin Damage\n10 ft. away or closer 8 × the number of charges in the staff\n11 to 20 ft. away 6 × the number of charges in the staff\n21 to 30 ft. away 4 × the number of charges in the staff",
    page: 244,
    endPage: 245,
    category: "staff",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:staff-of-the-python",
    edition: "2014",
    name: "Staff of the Python",
    metadata: "Staff, uncommon (requires attunement by a cleric, druid, or warlock)",
    rules:
      "You can use an action to speak this staff’s command\nword and throw the staff on the ground within 10\nfeet of you. The staff becomes a giant constrictor\nsnake under your control and acts on its own\ninitiative count. By using a bonus action to speak the\ncommand word again, you return the staff to its\nnormal form in a space formerly occupied by the\nsnake.\nOn your turn, you can mentally command the\nsnake if it is within 60 feet of you and you aren’t\nincapacitated. You decide what action the snake\ntakes and where it moves during its next turn, or you\ncan issue it a general command, such as to attack\nyour enemies or guard a location.\nIf the snake is reduced to 0 hit points, it dies and\nreverts to its staff form. The staff then shatters and is\ndestroyed. If the snake reverts to staff form before\nlosing all its hit points, it regains all of them.",
    page: 245,
    endPage: 245,
    category: "staff",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:staff-of-the-woodlands",
    edition: "2014",
    name: "Staff of the Woodlands",
    metadata: "Staff, rare (requires attunement by a druid)",
    rules:
      "This staff can be wielded as a magic quarterstaff that\ngrants a +2 bonus to attack and damage rolls made\nwith it. While holding it, you have a +2 bonus to spell\nattack rolls.\nThe staff has 10 charges for the following\nproperties. It regains 1d6 + 4 expended charges\ndaily at dawn. If you expend the last charge, roll a\nd20. On a 1, the staff loses its properties and\nbecomes a nonmagical quarterstaff.\nSpells. You can use an action to expend 1 or more\nof the staff’s charges to cast one of the following\nspells from it, using your spell save DC: animal\nfriendship (1 charge), awaken (5 charges), barkskin\n(2 charges), locate animals or plants (2 charges),\nspeak with animals (1 charge), speak with plants (3\ncharges), or wall of thorns (6 charges).\nYou can also use an action to cast the pass without\ntrace spell from the staff without using any charges.\nTree Form. You can use an action to plant one end\nof the staff in fertile earth and expend 1 charge to\ntransform the staff into a healthy tree. The tree is 60\nfeet tall and has a 5-‐‑foot-‐‑diameter trunk, and its\nbranches at the top spread out in a 20-‐‑foot radius.\nThe tree appears ordinary but radiates a faint aura\nof transmutation magic if targeted by detect magic.\nWhile touching the tree and using another action to\nspeak its command word, you return the staff to its\nnormal form. Any creature in the tree falls when it\nreverts to a staff.",
    page: 245,
    endPage: 245,
    category: "staff",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:staff-of-thunder-and-lightning",
    edition: "2014",
    name: "Staff of Thunder and Lightning",
    metadata: "Staff, very rare (requires attunement)",
    rules:
      "This staff can be wielded as a magic quarterstaff that\ngrants a +2 bonus to attack and damage rolls made\nwith it. It also has the following additional\nproperties. When one of these properties is used, it\ncan’t be used again until the next dawn.\nLightning. When you hit with a melee attack using\nthe staff, you can cause the target to take an extra\n2d6 lightning damage.\nThunder. When you hit with a melee attack using\nthe staff, you can cause the staff to emit a crack of\nthunder, audible out to 300 feet. The target you hit\nmust succeed on a DC 17 Constitution saving throw\nor become stunned until the end of your next turn.\nLightning Strike. You can use an action to cause a\nbolt of lightning to leap from the staff’s tip in a line\nthat is 5 feet wide and 120 feet long. Each creature in\nthat line must make a DC 17 Dexterity saving throw,\ntaking 9d6 lightning damage on a failed save, or half\nas much damage on a successful one.\nThunderclap. You can use an action to cause the\nstaff to issue a deafening thunderclap, audible out to\n600 feet. Each creature within 60 feet of you (not\nincluding you) must make a DC 17 Constitution\nsaving throw. On a failed save, a creature takes 2d6\nthunder damage and becomes deafened for 1 minute.\nOn a successful save, a creature takes half damage\nand isn’t deafened.\nThunder and Lightning. You can use an action to\nuse the Lightning Strike and Thunderclap properties\nat the same time. Doing so doesn’t expend the daily\nuse of those properties, only the use of this one.",
    page: 245,
    endPage: 246,
    category: "staff",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:staff-of-withering",
    edition: "2014",
    name: "Staff of Withering",
    metadata: "Staff, rare (requires attunement by a cleric, druid, or warlock)",
    rules:
      "This staff has 3 charges and regains 1d3 expended\ncharges daily at dawn.\nThe staff can be wielded as a magic quarterstaff.\nOn a hit, it deals damage as a normal quarterstaff,\nand you can expend 1 charge to deal an extra 2d10\nnecrotic damage to the target. In addition, the target\nmust succeed on a DC 15 Constitution saving throw\nor have disadvantage for 1 hour on any ability check\nor saving throw that uses Strength or Constitution.",
    page: 246,
    endPage: 246,
    category: "staff",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:stone-of-controlling-earth-elementals",
    edition: "2014",
    name: "Stone of Controlling Earth Elementals",
    metadata: "Wondrous item, rare",
    rules:
      "If the stone is touching the ground, you can use an\naction to speak its command word and summon an\nearth elemental, as if you had cast the conjure\nelemental spell. The stone can’t be used this way\nagain until the next dawn. The stone weighs 5\npounds.",
    page: 246,
    endPage: 246,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:stone-of-good-luck-luckstone",
    edition: "2014",
    name: "Stone of Good Luck (Luckstone)",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules: "While this polished agate is on your person, you gain\na +1 bonus to ability checks and saving throws.",
    page: 246,
    endPage: 246,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:sun-blade",
    edition: "2014",
    name: "Sun Blade",
    metadata: "Weapon (longsword), rare (requires attunement)",
    rules:
      "This item appears to be a longsword hilt. While\ngrasping the hilt, you can use a bonus action to cause\na blade of pure radiance to spring into existence, or\nmake the blade disappear. While the blade exists,\nthis magic longsword has the finesse property. If you\nare proficient with shortswords or longswords, you\nare proficient with the sun blade.\nYou gain a +2 bonus to attack and damage rolls\nmade with this weapon, which deals radiant damage\ninstead of slashing damage. When you hit an undead\nwith it, that target takes an extra 1d8 radiant\ndamage.\nThe sword’s luminous blade emits bright light in a\n15-‐‑foot radius and dim light for an additional 15 feet.\nThe light is sunlight. While the blade persists, you\ncan use an action to expand or reduce its radius of\nbright and dim light by 5 feet each, to a maximum of\n30 feet each or a minimum of 10 feet each.",
    page: 246,
    endPage: 246,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:sword-of-life-stealing",
    edition: "2014",
    name: "Sword of Life Stealing",
    metadata: "Weapon (any sword), rare (requires attunement)",
    rules:
      "When you attack a creature with this magic weapon\nand roll a 20 on the attack roll, that target takes an\nextra 3d6 necrotic damage, provided that the target\nisn’t a construct or an undead. You gain temporary\nhit points equal to the extra damage dealt.",
    page: 246,
    endPage: 246,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:sword-of-sharpness",
    edition: "2014",
    name: "Sword of Sharpness",
    metadata: "Weapon (any sword that deals slashing damage), very rare (requires attunement)",
    rules:
      "When you attack an object with this magic sword\nand hit, maximize your weapon damage dice against\nthe target.\nWhen you attack a creature with this weapon and\nroll a 20 on the attack roll, that target takes an extra\n4d6 slashing damage. Then roll another d20. If you\nroll a 20, you lop off one of the target’s limbs, with\nthe effect of such loss determined by the GM. If the\ncreature has no limb to sever, you lop off a portion of\nits body instead.\nIn addition, you can speak the sword’s command\nword to cause the blade to shed bright light in a 10-‐‑\nfoot radius and dim light for an additional 10 feet.\nSpeaking the command word again or sheathing the\nsword puts out the light.",
    page: 246,
    endPage: 246,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:sword-of-wounding",
    edition: "2014",
    name: "Sword of Wounding",
    metadata: "Weapon (any sword), rare (requires attunement)",
    rules:
      "Hit points lost to this weapon’s damage can be\nregained only through a short or long rest, rather\nthan by regeneration, magic, or any other means.\nOnce per turn, when you hit a creature with an\nattack using this magic weapon, you can wound the\ntarget. At the start of each of the wounded creature’s\nturns, it takes 1d4 necrotic damage for each time\nyou’ve wounded it, and it can then make a DC 15\nConstitution saving throw, ending the effect of all\nsuch wounds on itself on a success. Alternatively, the\nwounded creature, or a creature within 5 feet of it,\ncan use an action to make a DC 15 Wisdom\n(Medicine) check, ending the effect of such wounds\non it on a success.",
    page: 246,
    endPage: 247,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:talisman-of-pure-good",
    edition: "2014",
    name: "Talisman of Pure Good",
    metadata: "Wondrous item, legendary (requires attunement by a creature of good alignment)",
    rules:
      "This talisman is a mighty symbol of goodness. A\ncreature that is neither good nor evil in alignment\ntakes 6d6 radiant damage upon touching the\ntalisman. An evil creature takes 8d6 radiant damage\nupon touching the talisman. Either sort of creature\ntakes the damage again each time it ends its turn\nholding or carrying the talisman.\nIf you are a good cleric or paladin, you can use the\ntalisman as a holy symbol, and you gain a +2 bonus\nto spell attack rolls while you wear or hold it.\nThe talisman has 7 charges. If you are wearing or\nholding it, you can use an action to expend 1 charge\nfrom it and choose one creature you can see on the\nground within 120 feet of you. If the target is of evil\nalignment, a flaming fissure opens under it. The\ntarget must succeed on a DC 20 Dexterity saving\nthrow or fall into the fissure and be destroyed,\nleaving no remains. The fissure then closes, leaving\nno trace of its existence. When you expend the last\ncharge, the talisman disperses into motes of golden\nlight and is destroyed.",
    page: 247,
    endPage: 247,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:talisman-of-the-sphere",
    edition: "2014",
    name: "Talisman of the Sphere",
    metadata: "Wondrous item, legendary (requires attunement)",
    rules:
      "When you make an Intelligence (Arcana) check to\ncontrol a sphere of annihilation while you are\nholding this talisman, you double your proficiency\nbonus on the check. In addition, when you start your\nturn with control over a sphere of annihilation, you\ncan use an action to levitate it 10 feet plus a number\nof additional feet equal to 10 × your Intelligence\nmodifier.",
    page: 247,
    endPage: 247,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:talisman-of-ultimate-evil",
    edition: "2014",
    name: "Talisman of Ultimate Evil",
    metadata: "Wondrous item, legendary (requires attunement by a creature of evil alignment)",
    rules:
      "This item symbolizes unrepentant evil. A creature\nthat is neither good nor evil in alignment takes 6d6\nnecrotic damage upon touching the talisman. A good\ncreature takes 8d6 necrotic damage upon touching\nthe talisman. Either sort of creature takes the\ndamage again each time it ends its turn holding or\ncarrying the talisman.\nIf you are an evil cleric or paladin, you can use the\ntalisman as a holy symbol, and you gain a +2 bonus\nto spell attack rolls while you wear or hold it.\nThe talisman has 6 charges. If you are wearing or\nholding it, you can use an action to expend 1 charge\nfrom the talisman and choose one creature you can\nsee on the ground within 120 feet of you. If the\ntarget is of good alignment, a flaming fissure opens\nunder it. The target must succeed on a DC 20\nDexterity saving throw or fall into the fissure and be\ndestroyed, leaving no remains. The fissure then\ncloses, leaving no trace of its existence. When you\nexpend the last charge, the talisman dissolves into\nfoul-‐‑smelling slime and is destroyed.",
    page: 247,
    endPage: 247,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:tome-of-clear-thought",
    edition: "2014",
    name: "Tome of Clear Thought",
    metadata: "Wondrous item, very rare",
    rules:
      "This book contains memory and logic exercises, and\nits words are charged with magic. If you spend 48\nhours over a period of 6 days or fewer studying the\nbook’s contents and practicing its guidelines, your\nIntelligence score increases by 2, as does your\nmaximum for that score. The manual then loses its\nmagic, but regains it in a century.",
    page: 247,
    endPage: 247,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:tome-of-leadership-and-influence",
    edition: "2014",
    name: "Tome of Leadership and Influence",
    metadata: "Wondrous item, very rare",
    rules:
      "This book contains guidelines for influencing and\ncharming others, and its words are charged with\nmagic. If you spend 48 hours over a period of 6 days\nor fewer studying the book’s contents and practicing\nits guidelines, your Charisma score increases by 2, as\ndoes your maximum for that score. The manual then\nloses its magic, but regains it in a century.",
    page: 247,
    endPage: 247,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:tome-of-understanding",
    edition: "2014",
    name: "Tome of Understanding",
    metadata: "Wondrous item, very rare",
    rules:
      "This book contains intuition and insight exercises,\nand its words are charged with magic. If you spend\n48 hours over a period of 6 days or fewer studying\nthe book’s contents and practicing its guidelines,\nyour Wisdom score increases by 2, as does your\nmaximum for that score. The manual then loses its\nmagic, but regains it in a century.",
    page: 247,
    endPage: 247,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:trident-of-fish-command",
    edition: "2014",
    name: "Trident of Fish Command",
    metadata: "Weapon (trident), uncommon (requires attunement)",
    rules:
      "This trident is a magic weapon. It has 3 charges.\nWhile you carry it, you can use an action and expend\n1 charge to cast dominate beast (save DC 15) from it\non a beast that has an innate swimming speed. The\ntrident regains 1d3 expended charges daily at dawn.",
    page: 247,
    endPage: 248,
    category: "weapon",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:universal-solvent",
    edition: "2014",
    name: "Universal Solvent",
    metadata: "Wondrous item, legendary",
    rules:
      "This tube holds milky liquid with a strong alcohol\nsmell. You can use an action to pour the contents of\nthe tube onto a surface within reach. The liquid\ninstantly dissolves up to 1 square foot of adhesive it\ntouches, including sovereign glue.",
    page: 248,
    endPage: 248,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:vicious-weapon",
    edition: "2014",
    name: "Vicious Weapon",
    metadata: "Weapon (any), rare",
    rules:
      "When you roll a 20 on your attack roll with this\nmagic weapon, your critical hit deals an extra 2d6\ndamage of the weapon’s type.",
    page: 248,
    endPage: 248,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:vorpal-sword",
    edition: "2014",
    name: "Vorpal Sword",
    metadata: "Weapon (any sword that deals slashing damage), legendary (requires attunement)",
    rules:
      "You gain a +3 bonus to attack and damage rolls\nmade with this magic weapon. In addition, the\nweapon ignores resistance to slashing damage.\nWhen you attack a creature that has at least one\nhead with this weapon and roll a 20 on the attack\nroll, you cut off one of the creature’s heads. The\ncreature dies if it can’t survive without the lost head.\nA creature is immune to this effect if it is immune to\nslashing damage, doesn’t have or need a head, has\nlegendary actions, or the GM decides that the\ncreature is too big for its head to be cut off with this\nweapon. Such a creature instead takes an extra 6d8\nslashing damage from the hit.",
    page: 248,
    endPage: 248,
    category: "weapon",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:wand-of-binding",
    edition: "2014",
    name: "Wand of Binding",
    metadata: "Wand, rare (requires attunement by a spellcaster)",
    rules:
      "This wand has 7 charges for the following properties.\nIt regains 1d6 + 1 expended charges daily at dawn. If\nyou expend the wand’s last charge, roll a d20. On a 1,\nthe wand crumbles into ashes and is destroyed.\nSpells. While holding the wand, you can use an\naction to expend some of its charges to cast one of\nthe following spells (save DC 17): hold monster (5\ncharges) or hold person (2 charges).\nAssisted Escape. While holding the wand, you can\nuse your reaction to expend 1 charge and gain\nadvantage on a saving throw you make to avoid\nbeing paralyzed or restrained, or you can expend 1\ncharge and gain advantage on any check you make to\nescape a grapple.",
    page: 248,
    endPage: 248,
    category: "wand",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:wand-of-enemy-detection",
    edition: "2014",
    name: "Wand of Enemy Detection",
    metadata: "Wand, rare (requires attunement)",
    rules:
      "This wand has 7 charges. While holding it, you can\nuse an action and expend 1 charge to speak its\ncommand word. For the next minute, you know the\ndirection of the nearest creature hostile to you\nwithin 60 feet, but not its distance from you. The\nwand can sense the presence of hostile creatures\nthat are ethereal, invisible, disguised, or hidden, as\nwell as those in plain sight. The effect ends if you\nstop holding the wand.\nThe wand regains 1d6 + 1 expended charges daily\nat dawn. If you expend the wand’s last charge, roll a\nd20. On a 1, the wand crumbles into ashes and is\ndestroyed.",
    page: 248,
    endPage: 248,
    category: "wand",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:wand-of-fear",
    edition: "2014",
    name: "Wand of Fear",
    metadata: "Wand, rare (requires attunement)",
    rules:
      "This wand has 7 charges for the following properties.\nIt regains 1d6 + 1 expended charges daily at dawn. If\nyou expend the wand’s last charge, roll a d20. On a 1,\nthe wand crumbles into ashes and is destroyed.\nCommand. While holding the wand, you can use\nan action to expend 1 charge and command another\ncreature to flee or grovel, as with the command spell\n(save DC 15).\nCone of Fear. While holding the wand, you can use\nan action to expend 2 charges, causing the wand’s tip\nto emit a 60-‐‑foot cone of amber light. Each creature\nin the cone must succeed on a DC 15 Wisdom saving\nthrow or become frightened of you for 1 minute.\nWhile it is frightened in this way, a creature must\nspend its turns trying to move as far away from you\nas it can, and it can’t willingly move to a space within\n30 feet of you. It also can’t take reactions. For its\naction, it can use only the Dash action or try to\nescape from an effect that prevents it from moving. If\nit has nowhere it can move, the creature can use the\nDodge action. At the end of each of its turns, a\ncreature can repeat the saving throw, ending the\neffect on itself on a success.",
    page: 248,
    endPage: 248,
    category: "wand",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:wand-of-fireballs",
    edition: "2014",
    name: "Wand of Fireballs",
    metadata: "Wand, rare (requires attunement by a spellcaster)",
    rules:
      "This wand has 7 charges. While holding it, you can\nuse an action to expend 1 or more of its charges to\ncast the fireball spell (save DC 15) from it. For 1\ncharge, you cast the 3rd-‐‑level version of the spell.\nYou can increase the spell slot level by one for each\nadditional charge you expend.\nThe wand regains 1d6 + 1 expended charges daily\nat dawn. If you expend the wand’s last charge, roll a\nd20. On a 1, the wand crumbles into ashes and is\ndestroyed.",
    page: 248,
    endPage: 249,
    category: "wand",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:wand-of-lightning-bolts",
    edition: "2014",
    name: "Wand of Lightning Bolts",
    metadata: "Wand, rare (requires attunement by a spellcaster)",
    rules:
      "This wand has 7 charges. While holding it, you can\nuse an action to expend 1 or more of its charges to\ncast the lightning bolt spell (save DC 15) from it. For\n1 charge, you cast the 3rd-‐‑level version of the spell.\nYou can increase the spell slot level by one for each\nadditional charge you expend.\nThe wand regains 1d6 + 1 expended charges daily\nat dawn. If you expend the wand’s last charge, roll a\nd20. On a 1, the wand crumbles into ashes and is\ndestroyed.",
    page: 249,
    endPage: 249,
    category: "wand",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:wand-of-magic-detection",
    edition: "2014",
    name: "Wand of Magic Detection",
    metadata: "Wand, uncommon",
    rules:
      "This wand has 3 charges. While holding it, you can\nexpend 1 charge as an action to cast the detect magic\nspell from it. The wand regains 1d3 expended\ncharges daily at dawn.",
    page: 249,
    endPage: 249,
    category: "wand",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:wand-of-magic-missiles",
    edition: "2014",
    name: "Wand of Magic Missiles",
    metadata: "Wand, uncommon",
    rules:
      "This wand has 7 charges. While holding it, you can\nuse an action to expend 1 or more of its charges to\ncast the magic missile spell from it. For 1 charge, you\ncast the 1st-‐‑level version of the spell. You can\nincrease the spell slot level by one for each\nadditional charge you expend.\nThe wand regains 1d6 + 1 expended charges daily\nat dawn. If you expend the wand’s last charge, roll a\nd20. On a 1, the wand crumbles into ashes and is\ndestroyed.",
    page: 249,
    endPage: 249,
    category: "wand",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:wand-of-paralysis",
    edition: "2014",
    name: "Wand of Paralysis",
    metadata: "Wand, rare (requires attunement by a spellcaster)",
    rules:
      "This wand has 7 charges. While holding it, you can\nuse an action to expend 1 of its charges to cause a\nthin blue ray to streak from the tip toward a creature\nyou can see within 60 feet of you. The target must\nsucceed on a DC 15 Constitution saving throw or be\nparalyzed for 1 minute. At the end of each of the\ntarget’s turns, it can repeat the saving throw, ending\nthe effect on itself on a success.\nThe wand regains 1d6 + 1 expended charges daily\nat dawn. If you expend the wand’s last charge, roll a\nd20. On a 1, the wand crumbles into ashes and is\ndestroyed.",
    page: 249,
    endPage: 249,
    category: "wand",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:wand-of-polymorph",
    edition: "2014",
    name: "Wand of Polymorph",
    metadata: "Wand, very rare (requires attunement by a spellcaster)",
    rules:
      "This wand has 7 charges. While holding it, you can\nuse an action to expend 1 of its charges to cast the\npolymorph spell (save DC 15) from it.\nThe wand regains 1d6 + 1 expended charges daily\nat dawn. If you expend the wand’s last charge, roll a\nd20. On a 1, the wand crumbles into ashes and is\ndestroyed.",
    page: 249,
    endPage: 249,
    category: "wand",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:wand-of-secrets",
    edition: "2014",
    name: "Wand of Secrets",
    metadata: "Wand, uncommon",
    rules:
      "The wand has 3 charges. While holding it, you can\nuse an action to expend 1 of its charges, and if a\nsecret door or trap is within 30 feet of you, the wand\npulses and points at the one nearest to you. The\nwand regains 1d3 expended charges daily at dawn.",
    page: 249,
    endPage: 249,
    category: "wand",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:wand-of-the-war-mage-1-2-or-3",
    edition: "2014",
    name: "Wand of the War Mage, +1, +2, or +3",
    metadata: "Wand, uncommon (+1), rare (+2), or very rare (+3) (requires attunement by a spellcaster)",
    rules:
      "While holding this wand, you gain a bonus to spell\nattack rolls determined by the wand’s rarity. In\naddition, you ignore half cover when making a spell\nattack.",
    page: 249,
    endPage: 249,
    category: "wand",
    rarities: ["uncommon", "rare", "veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:wand-of-web",
    edition: "2014",
    name: "Wand of Web",
    metadata: "Wand, uncommon (requires attunement by a spellcaster)",
    rules:
      "This wand has 7 charges. While holding it, you can\nuse an action to expend 1 of its charges to cast the\nweb spell (save DC 15) from it.\nThe wand regains 1d6 + 1 expended charges daily\nat dawn. If you expend the wand’s last charge, roll a\nd20. On a 1, the wand crumbles into ashes and is\ndestroyed.",
    page: 249,
    endPage: 249,
    category: "wand",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:wand-of-wonder",
    edition: "2014",
    name: "Wand of Wonder",
    metadata: "Wand, rare (requires attunement by a spellcaster)",
    rules:
      "This wand has 7 charges. While holding it, you can\nuse an action to expend 1 of its charges and choose a\ntarget within 120 feet of you. The target can be a\ncreature, an object, or a point in space. Roll d100 and\nconsult the following table to discover what happens.\nIf the effect causes you to cast a spell from the\nwand, the spell’s save DC is 15. If the spell normally\nhas a range expressed in feet, its range becomes 120\nfeet if it isn’t already.\nIf an effect covers an area, you must center the\nspell on and include the target. If an effect has\nmultiple possible subjects, the GM randomly\ndetermines which ones are affected.\nThe wand regains 1d6 + 1 expended charges daily\nat dawn. If you expend the wand’s last charge, roll a\nd20. On a 1, the wand crumbles into dust and is\ndestroyed.\nd100 Effect\n01–05 You cast slow.\n06–10 You cast faerie fire.\n11–15 You are stunned until the start of your next turn,\nbelieving something awesome just happened.\n16–20 You cast gust of wind.\n21–25 You cast detect thoughts on the target you\nchose. If you didn’t target a creature, you\ninstead take 1d6 psychic damage.\n26–30 You cast stinking cloud.\n31–33 Heavy rain falls in a 60-‐foot radius centered on\nthe target. The area becomes lightly obscured.\nThe rain falls until the start of your next turn.\n34–36 An animal appears in the unoccupied space\nnearest the target. The animal isn’t under your\ncontrol and acts as it normally would. Roll a d100\nto determine which animal appears. On a 01–25,\na rhinoceros appears; on a 26–50, an elephant\nappears; and on a 51–100, a rat appears.\n37–46 You cast lightning bolt.\n47–49 A cloud of 600 oversized butterflies fills a 30-‐foot\nradius centered on the target. The area becomes\nheavily obscured. The butterflies remain for 10\nminutes.\n50–53 You enlarge the target as if you had cast\nenlarge/reduce. If the target can’t be affected by\nthat spell, or if you didn’t target a creature, you\nbecome the target.\n54–58 You cast darkness.\n59–62 Grass grows on the ground in a 60-‐foot radius\ncentered on the target. If grass is already there,\nit grows to ten times its normal size and remains\novergrown for 1 minute.\n63–65 An object of the GM’s choice disappears into the\nEthereal Plane. The object must be neither worn\nnor carried, within 120 feet of the target, and no\nlarger than 10 feet in any dimension.\n66–69 You shrink yourself as if you had cast\nenlarge/reduce on yourself.\n70–79 You cast fireball.\n80–84 You cast invisibility on yourself.\n85–87 Leaves grow from the target. If you chose a point\nin space as the target, leaves sprout from the\ncreature nearest to that point. Unless they are\npicked off, the leaves turn brown and fall off\nafter 24 hours.\n88–90 A stream of 1d4 × 10 gems, each worth 1 gp,\nshoots from the wand’s tip in a line 30 feet long\nand 5 feet wide. Each gem deals 1 bludgeoning\ndamage, and the total damage of the gems is\ndivided equally among all creatures in the line.\n91–95 A burst of colorful shimmering light extends\nfrom you in a 30-‐foot radius. You and each\ncreature in the area that can see must succeed\non a DC 15 Constitution saving throw or become\nblinded for 1 minute. A creature can repeat the\nsaving throw at the end of each of its turns,\nending the effect on itself on a success.\n96–97 The target’s skin turns bright blue for 1d10 days.\nIf you chose a point in space, the creature\nnearest to that point is affected.\n98–00 If you targeted a creature, it must make a DC 15\nConstitution saving throw. If you didn’t target a\ncreature, you become the target and must make\nthe saving throw. If the saving throw fails by 5 or\nmore, the target is instantly petrified. On any\nother failed save, the target is restrained and\nbegins to turn to stone. While restrained in this\nway, the target must repeat the saving throw at\nthe end of its next turn, becoming petrified on a\nfailure or ending the effect on a success. The\npetrification lasts until the target is freed by the\ngreater restoration spell or similar magic.",
    page: 249,
    endPage: 250,
    category: "wand",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:weapon-1-2-or-3",
    edition: "2014",
    name: "Weapon, +1, +2, or +3",
    metadata: "Weapon (any), uncommon (+1), rare (+2), or very rare (+3)",
    rules:
      "You have a bonus to attack and damage rolls made\nwith this magic weapon. The bonus is determined by\nthe weapon’s rarity.",
    page: 250,
    endPage: 250,
    category: "weapon",
    rarities: ["uncommon", "rare", "veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:well-of-many-worlds",
    edition: "2014",
    name: "Well of Many Worlds",
    metadata: "Wondrous item, legendary",
    rules:
      "This fine black cloth, soft as silk, is folded up to the\ndimensions of a handkerchief. It unfolds into a\ncircular sheet 6 feet in diameter.\nYou can use an action to unfold and place the well\nof many worlds on a solid surface, whereupon it\ncreates a two-‐‑way portal to another world or plane\nof existence. Each time the item opens a portal, the\nGM decides where it leads. You can use an action to\nclose an open portal by taking hold of the edges of\nthe cloth and folding it up. Once well of many worlds\nhas opened a portal, it can’t do so again for 1d8\nhours.",
    page: 250,
    endPage: 250,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:wind-fan",
    edition: "2014",
    name: "Wind Fan",
    metadata: "Wondrous item, uncommon",
    rules:
      "While holding this fan, you can use an action to cast\nthe gust of wind spell (save DC 13) from it. Once used,\nthe fan shouldn’t be used again until the next dawn.\nEach time it is used again before then, it has a\ncumulative 20 percent chance of not working and\ntearing into useless, nonmagical tatters.",
    page: 250,
    endPage: 251,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd51:winged-boots",
    edition: "2014",
    name: "Winged Boots",
    metadata: "Wondrous item, uncommon (requires attunement)",
    rules:
      "While you wear these boots, you have a flying speed\nequal to your walking speed. You can use the boots\nto fly for up to 4 hours, all at once or in several\nshorter flights, each one using a minimum of 1\nminute from the duration. If you are flying when the\nduration expires, you descend at a rate of 30 feet per\nround until you land.\nThe boots regain 2 hours of flying capability for\nevery 12 hours they aren’t in use.",
    page: 251,
    endPage: 251,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:wings-of-flying",
    edition: "2014",
    name: "Wings of Flying",
    metadata: "Wondrous item, rare (requires attunement)",
    rules:
      "While wearing this cloak, you can use an action to\nspeak its command word. This turns the cloak into a\npair of bat wings or bird wings on your back for 1\nhour or until you repeat the command word as an\naction. The wings give you a flying speed of 60 feet.\nWhen they disappear, you can’t use them again for\n1d12 hours.",
    page: 251,
    endPage: 251,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd51:orb-of-dragonkind",
    edition: "2014",
    name: "Orb of Dragonkind",
    metadata: "Wondrous item, artifact (requires attunement)",
    rules:
      "Ages past, elves and humans waged a terrible war\nagainst evil dragons. When the world seemed\ndoomed, powerful wizards came together and\nworked their greatest magic, forging five Orbs of\nDragonkind (or Dragon Orbs) to help them defeat the\ndragons. One orb was taken to each of the five\nwizard towers, and there they were used to speed\nthe war toward a victorious end. The wizards used\nthe orbs to lure dragons to them, then destroyed the\ndragons with powerful magic.\nAs the wizard towers fell in later ages, the orbs\nwere destroyed or faded into legend, and only three\nare thought to survive. Their magic has been warped\nand twisted over the centuries, so although their\nprimary purpose of calling dragons still functions,\nthey also allow some measure of control over\ndragons.\nEach orb contains the essence of an evil dragon, a\npresence that resents any attempt to coax magic\nfrom it. Those lacking in force of personality might\nfind themselves enslaved to an orb.\nAn orb is an etched crystal globe about 10 inches\nin diameter. When used, it grows to about 20 inches\nin diameter, and mist swirls inside it.\nWhile attuned to an orb, you can use an action to\npeer into the orb’s depths and speak its command\nword. You must then make a DC 15 Charisma check.\nOn a successful check, you control the orb for as long\nas you remain attuned to it. On a failed check, you\nbecome charmed by the orb for as long as you\nremain attuned to it.\nWhile you are charmed by the orb, you can’t\nvoluntarily end your attunement to it, and the orb\ncasts suggestion on you at will (save DC 18), urging\nyou to work toward the evil ends it desires. The\ndragon essence within the orb might want many\nthings: the annihilation of a particular people,\nfreedom from the orb, to spread suffering in the\nworld, to advance the worship of Tiamat, or\nsomething else the GM decides.\nRandom Properties. An Orb of Dragonkind has the\nfollowing random properties:\n• 2 minor beneficial properties\n• 1 minor detrimental property\n• 1 major detrimental property\nSpells. The orb has 7 charges and regains 1d4 + 3\nexpended charges daily at dawn. If you control the\norb, you can use an action and expend 1 or more\ncharges to cast one of the following spells (save DC\n18) from it: cure wounds (5th-‐‑level version, 3\ncharges), daylight (1 charge), death ward (2 charges),\nor scrying (3 charges).\nYou can also use an action to cast the detect magic\nspell from the orb without using any charges.\nCall Dragons. While you control the orb, you can\nuse an action to cause the artifact to issue a\ntelepathic call that extends in all directions for 40\nmiles. Evil dragons in range feel compelled to come\nto the orb as soon as possible by the most direct\nroute. Dragon deities such as Tiamat are unaffected\nby this call. Dragons drawn to the orb might be\nhostile toward you for compelling them against their\nwill. Once you have used this property, it can’t be\nused again for 1 hour.\nDestroying an Orb. An Orb of Dragonkind appears\nfragile but is impervious to most damage, including\nthe attacks and breath weapons of dragons. A\ndisintegrate spell or one good hit from a +3 magic\nweapon is sufficient to destroy an orb, however.",
    page: 252,
    endPage: 253,
    category: "wondrous",
    rarities: ["artifact"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:adamantine-armor",
    edition: "2024",
    name: "Adamantine Armor",
    metadata: "Armor (Any Medium or Heavy, Except Hide Armor), Uncommon",
    rules:
      "This suit of armor is reinforced with adamantine,\none of the hardest substances in existence. While\nyou’re wearing it, any Critical Hit against you becomes a normal hit.",
    page: 209,
    endPage: 209,
    category: "armor",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:ammunition-1-2-or-3",
    edition: "2024",
    name: "Ammunition, +1, +2, or +3",
    metadata: "Weapon (Any Ammunition), Uncommon (+1), Rare (+2), or Very Rare (+3)",
    rules:
      "You have a bonus to attack rolls and damage rolls\nmade with this piece of magic ammunition. The bonus is determined by the rarity of the ammunition.\nOnce it hits a target, the ammunition is no longer\nmagical.\nThis ammunition is typically found or sold in\nquantities of ten or twenty pieces. Ten pieces of this\nammunition are equivalent in value to a potion of\nthe same rarity.",
    page: 209,
    endPage: 209,
    category: "weapon",
    rarities: ["uncommon", "rare", "veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:ammunition-of-slaying",
    edition: "2024",
    name: "Ammunition of Slaying",
    metadata: "Weapon (Any Ammunition), Very Rare",
    rules:
      "This magic ammunition is meant to slay creatures\nof a particular type, which the GM chooses or determines randomly by rolling on the table below. If\na creature of that type takes damage from the ammunition, the creature makes a DC 17 Constitution\nsaving throw, taking an extra 6d10 Force damage\non a failed save or half as much extra damage on a\nsuccessful one.\nAfter dealing its extra damage to a creature, the\nammunition becomes nonmagical.\n1d100 Creature Type 1d100 Creature Type\n01–10 Aberrations 51–60 Fey\n11–15 Beasts 61–70 Fiends\n16–20 Celestials 71–75 Giants\n21–25 Constructs 76–80 Monstrosities\n26–35 Dragons 81–85 Oozes\n36–45 Elementals 86–90 Plants\n46–50 Humanoids 91–00 Undead",
    page: 209,
    endPage: 209,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:amulet-of-health",
    edition: "2024",
    name: "Amulet of Health",
    metadata: "Wondrous Item, Rare (Requires Attunement)",
    rules:
      "Your Constitution is 19 while you wear this amulet.\nIt has no effect on you if your Constitution is 19 or\nhigher without it.",
    page: 209,
    endPage: 209,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:amulet-of-proof-against-detection-and-location",
    edition: "2024",
    name: "Amulet of Proof against Detection and Location",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "While wearing this amulet, you can’t be targeted\nby Divination spells or perceived through magical\nscrying sensors unless you allow it.",
    page: 209,
    endPage: 209,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:amulet-of-the-planes",
    edition: "2024",
    name: "Amulet of the Planes",
    metadata: "Wondrous Item, Very Rare (Requires Attunement)",
    rules:
      "While wearing this amulet, you can take a Magic\naction to name a location that you are familiar with\non another plane of existence. Then make a DC 15\nIntelligence (Arcana) check. On a successful check,\nyou cast Plane Shift. On a failed check, you and each\ncreature and object within 15 feet of you travel to\na random destination determined by rolling 1d100\nand consulting the following table.\n1d100 Destination\n01–60 Random location on the plane you named\n61–70 Random location on an Inner Plane determined by rolling 1d6: on a 1, the Plane of Air;\non a 2, the Plane of Earth; on a 3, the Plane of\nFire; on a 4, the Plane of Water; on a 5, the\nFeywild; on a 6, the Shadowfell\n71–80 Random location on an Outer Plane determined by rolling 1d8: on a 1, Arborea; on a 2,\nArcadia; on a 3, the Beastlands; on a 4, Bytopia; on a 5, Elysium; on a 6, Mechanus; on a 7,\nMount Celestia; on an 8, Ysgard\n81–90 Random location on an Outer Plane determined by rolling 1d8: on a 1, the Abyss; on a\n2, Acheron; on a 3, Carceri; on a 4, Gehenna;\non a 5, Hades; on a 6, Limbo; on a 7, the Nine\nHells; on an 8, Pandemonium\n91–00 Random location on the Astral Plane",
    page: 209,
    endPage: 209,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:animated-shield",
    edition: "2024",
    name: "Animated Shield",
    metadata: "Armor (Shield), Very Rare (Requires Attunement)",
    rules:
      "While holding this Shield, you can take a Bonus\nAction to cause it to animate. The Shield leaps into\nthe air and hovers in your space to protect you as if\nyou were wielding it, leaving your hands free. The\nShield remains animate for 1 minute, until you take\na Bonus Action to end this effect, or until you die or\nhave the Incapacitated condition, at which point the\nShield falls to the ground or into your hand if you\nhave one free.",
    page: 209,
    endPage: 209,
    category: "armor",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:apparatus-of-the-crab",
    edition: "2024",
    name: "Apparatus of the Crab",
    metadata: "Wondrous Item, Legendary",
    rules:
      "This item first appears to be a sealed iron barrel\nweighing 500 pounds. The barrel has a hidden\ncatch, which can be found with a successful DC 20\nIntelligence (Investigation) check. Releasing the\ncatch unlocks a hatch at one end of the barrel, allowing two Medium or smaller creatures to crawl\ninside. Ten levers are set in a row at the far end,\neach in a neutral position, able to move up or down.\nWhen certain levers are used, the apparatus transforms to resemble a giant lobster.\nThe Apparatus of the Crab is a Large object with\nthe following statistics: AC 20; HP 200; Speed 30\nft., Swim 30 ft. (or 0 ft. for both if the legs aren’t extended); Immunity to Poison and Psychic damage.\nTo be used as a vehicle, the apparatus requires\none pilot. While the apparatus’s hatch is closed, the\ncompartment is airtight and watertight. The compartment holds enough air for 10 hours of breathing, divided by the number of breathing creatures\ninside.\nThe apparatus floats on water. It can also go\nunderwater to a depth of 900 feet. Below that, the\nvehicle takes 2d6 Bludgeoning damage each minute\nfrom pressure.\nA creature in the compartment can take a Utilize\naction to move as many as two of the apparatus’s\nlevers up or down. After each use, a lever goes back\nto its neutral position. Each lever, from left to right,\nfunctions as shown in the Apparatus of the Crab\nLevers table.\nApparatus of the Crab Levers\nLever Up\n1 Legs extend, allowing the apparatus to walk and sw\n2 Forward window shutter opens.\n3 Side window shutters open (two per side).\n4 Two claws extend from the front side of the\napparatus.\n5 Each extended claw makes the following melee atta\n+8 to hit, reach 5 ft. Hit: 7 (2d6) Bludgeoning dama\n6 The apparatus walks or swims forward provided its\nlegs are extended.\n7 The apparatus turns 90 degrees counterclockwise\nprovided its legs are extended.\n8 Eyelike fixtures emit Bright Light in a 30-foot radiu\nand Dim Light for an additional 30 feet.\n9 The apparatus sinks up to 20 feet if it’s in liquid.\n10 The rear hatch unseals and opens.",
    page: 210,
    endPage: 210,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:armor-1-2-or-3",
    edition: "2024",
    name: "Armor, +1, +2, or +3",
    metadata: "Armor (Any Light, Medium, or Heavy), Rare (+1), Very Rare (+2), or Legendary (+3)",
    rules: "You have a bonus to Armor Class while wearing this\narmor. The bonus is determined by its rarity.",
    page: 210,
    endPage: 210,
    category: "armor",
    rarities: ["rare", "veryRare", "legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:armor-of-invulnerability",
    edition: "2024",
    name: "Armor of Invulnerability",
    metadata: "Armor (Plate Armor), Legendary (Requires Attunement)",
    rules:
      "You have Resistance to Bludgeoning, Piercing, and\nSlashing damage while you wear this armor.\nMetal Shell. You can take a Magic action to give\nyourself Immunity to Bludgeoning, Piercing, and\nSlashing damage for 10 minutes or until you are\nno longer wearing the armor. Once this property is\nused, it can’t be used again until the next dawn.",
    page: 210,
    endPage: 210,
    category: "armor",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:armor-of-resistance",
    edition: "2024",
    name: "Armor of Resistance",
    metadata: "Armor (Any Light, Medium, or Heavy), Rare (Requires Attunement)",
    rules:
      "You have Resistance to one type of damage while\nyou wear this armor. The GM chooses the type or\ndetermines it randomly by rolling on the following\ntable.\n1d10 Damage Type 1d10 Damage Type\n1 Acid 6 Necrotic\n2 Cold 7 Poison\n3 Fire 8 Psychic\n4 Force 9 Radiant\n5 Lightning 10 Thunder\nDown\nim. Legs retract, reducing the apparatus’s Speed and Swim\nSpeed to 0 and making it unable to benefit from bonuses to speed.\nForward window shutter closes.\nSide window shutters close (two per side).\nThe claws retract.\nck: Each extended claw makes the following melee attack:\nge. +8 to hit, reach 5 ft. Hit: The target has the Grappled\ncondition (escape DC 15).\nThe apparatus walks or swims backward provided its\nlegs are extended.\nThe apparatus turns 90 degrees clockwise provided its\nlegs are extended.\ns The light turns off.\nThe apparatus rises up to 20 feet if it’s in liquid.\nThe rear hatch closes and seals.",
    page: 210,
    endPage: 210,
    category: "armor",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:armor-of-vulnerability",
    edition: "2024",
    name: "Armor of Vulnerability",
    metadata: "Armor (Any Light, Medium, or Heavy), Rare (Requires Attunement)",
    rules:
      "While wearing this armor, you have Resistance to\none of the following damage types: Bludgeoning,\nPiercing, or Slashing. The GM chooses the type or\ndetermines it randomly.\nCurse. This armor is cursed, a fact that is revealed\nonly when the Identify spell is cast on the armor or\nyou attune to it. Attuning to the armor curses you\nuntil you are targeted by a Remove Curse spell or\nsimilar magic; removing the armor fails to end the\ncurse. While cursed, you have Vulnerability to two\nof the three damage types associated with the armor (not the one to which it grants Resistance).",
    page: 211,
    endPage: 211,
    category: "armor",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:arrow-catching-shield",
    edition: "2024",
    name: "Arrow-Catching Shield",
    metadata: "Armor (Shield), Rare (Requires Attunement)",
    rules:
      "You gain a +2 bonus to Armor Class against ranged\nattack rolls while you wield this Shield. This bonus\nis in addition to the Shield’s normal bonus to AC.\nWhenever an attacker makes a ranged attack roll\nagainst a target within 5 feet of you, you can take a\nReaction to become the target of the attack instead.",
    page: 211,
    endPage: 211,
    category: "armor",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:bag-of-beans",
    edition: "2024",
    name: "Bag of Beans",
    metadata: "Wondrous Item, Rare",
    rules:
      "This heavy cloth bag contains 3d4 dry beans when\nfound. The bag weighs half a pound regardless of\nhow many beans it contains and becomes a nonmagical item when it no longer contains any beans.\nIf you dump one or more beans out of the bag,\nthey explode in a 10-foot-radius Sphere centered on\nthem. All the dumped beans are destroyed in the explosion, and each creature in the Sphere, including\nyou, makes a DC 15 Dexterity saving throw, taking\n5d4 Force damage on a failed save or half as much\ndamage on a successful one.\nIf you remove a bean from the bag, plant it in dirt\nor sand, and then water it, the bean disappears as it\nproduces an effect 1 minute later from the ground\nwhere it was planted. The GM can choose an effect\nfrom the following table or determine it randomly.\n1d100 Effect\n01 5d4 toadstools sprout. If a creature eats a\ntoadstool, roll any die. On an odd roll, the\neater must succeed on a DC 15 Constitution\nsaving throw or take 5d6 Poison damage and\nhave the Poisoned condition for 1 hour. On\nan even roll, the eater gains 5d6 Temporary\nHit Points for 1 hour.\n02–10 A geyser erupts and spouts water, beer,\nmayonnaise, tea, vinegar, wine, or oil (GM’s\nchoice) 30 feet into the air for 1d4 minutes.\n1d100 Effect\n11–20 A Treant sprouts. Roll any die. On an odd\nroll, the treant is Chaotic Evil. On an even\nroll, the treant is Chaotic Good.\n21–30 An animate but immobile stone statue in\nyour likeness rises and makes verbal threats\nagainst you. If you leave it and others come\nnear, it describes you as the most heinous\nof villains and directs the newcomers to find\nand attack you. If you are on the same plane\nof existence as the statue, it knows where\nyou are. The statue becomes inanimate after\n24 hours.\n31–40 A campfire with green flames springs\nforth and burns for 24 hours or until it is\nextinguished.\n41–50 Three Shrieker Fungi sprout.\n51–60 1d4 + 4 bright-pink toads crawl forth. Whenever a toad is touched, it transforms into a\nLarge or smaller monster of the GM’s choice\nthat acts in accordance with its alignment\nand nature. The monster remains for 1 minute, then disappears in a puff of bright-pink\nsmoke.\n61–70 A hungry Bulette burrows up and attacks.\n71–80 A fruit tree grows. It has 1d10 + 20 fruit, 1d8\nof which act as randomly determined potions. The tree vanishes after 1 hour. Picked\nfruit remains, retaining any magic for 30 days.\n81–90 A nest of 1d4 + 3 rainbow-colored eggs\nsprings up. Any creature that eats an egg\nmakes a DC 20 Constitution saving throw.\nOn a successful save, a creature permanently\nincreases its lowest ability score by 1, randomly choosing among equally low scores.\nOn a failed save, the creature takes 10d6\nForce damage from an internal explosion.\n91–95 A pyramid with a 60-foot-square base bursts\nupward. Inside is a burial chamber containing\na Mummy, a Mummy Lord, or some other\nUndead of the GM’s choice. Its sarcophagus\ncontains treasure of the GM’s choice.\n96–00 A giant beanstalk sprouts, growing to a\nheight of the GM’s choice. The top leads\nwhere the GM chooses, such as to a great\nview, a cloud giant’s castle, or another plane\nof existence.",
    page: 211,
    endPage: 211,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:bag-of-devouring",
    edition: "2024",
    name: "Bag of Devouring",
    metadata: "Wondrous Item, Very Rare",
    rules:
      "This bag resembles a Bag of Holding but is a feeding\norifice for a gigantic extradimensional creature.\nTurning the bag inside out closes the orifice.\nThe extradimensional creature attached to the\nbag can sense whatever is placed inside the bag.\nAnimal or vegetable matter placed wholly in the\nbag is devoured and lost forever. When part of a living creature is placed in the bag, as happens when\nsomeone reaches inside it, there is a 50 percent\nchance that the creature is pulled inside the bag. A\ncreature inside the bag can take an action to try to\nescape, doing so with a successful DC 15 Strength\n(Athletics) check. Another creature can take an action to reach into the bag to pull a creature out, doing so with a successful DC 20 Strength (Athletics)\ncheck, provided the puller isn’t pulled inside the bag\nfirst. Any creature that starts its turn inside the bag\nis devoured, its body destroyed.\nInanimate objects can be stored in the bag, which\ncan hold a cubic foot of such material. However,\nonce each day, the bag swallows any objects inside\nit and spits them out into another plane of existence.\nThe GM determines the time and plane.\nIf the bag is pierced or torn, it is destroyed, and\nanything contained within it is transported to a\nrandom location on the Astral Plane.",
    page: 212,
    endPage: 212,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:bag-of-holding",
    edition: "2024",
    name: "Bag of Holding",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "This bag has an interior space considerably larger\nthan its outside dimensions—roughly 2 feet square\nand 4 feet deep on the inside. The bag can hold up\nto 500 pounds, not exceeding a volume of 64 cubic\nfeet. The bag weighs 5 pounds, regardless of its\ncontents. Retrieving an item from the bag requires\na Utilize action.\nIf the bag is overloaded, pierced, or torn, it is destroyed, and its contents are scattered in the Astral\nPlane. If the bag is turned inside out, its contents\nspill forth unharmed, but the bag must be put right\nbefore it can be used again. The bag holds enough\nair for 10 minutes of breathing, divided by the number of breathing creatures inside.\nPlacing a Bag of Holding inside an extradimensional space created by a Handy Haversack, Portable\nHole, or similar item instantly destroys both items\nand opens a gate to the Astral Plane. The gate originates where the one item was placed inside the\nother. Any creature within a 10-foot-radius Sphere\ncentered on the gate is sucked through it to a random location on the Astral Plane. The gate then\ncloses. The gate is one-way and can’t be reopened.",
    page: 212,
    endPage: 212,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:bag-of-tricks",
    edition: "2024",
    name: "Bag of Tricks",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "This bag made from gray, rust, or tan cloth appears\nempty. Reaching inside the bag, however, reveals\nthe presence of a small, fuzzy object.\nYou can take a Magic action to pull the fuzzy object from the bag and throw it up to 20 feet. When\nthe object lands, it transforms into a creature you\ndetermine by rolling on the table that corresponds\nto the bag’s color. See “Monsters” for the creature’s\nstat block. The creature vanishes at the next dawn\nor when it is reduced to 0 Hit Points.\nThe creature is Friendly to you and your allies,\nand it acts immediately after you on your Initiative\ncount. You can take a Bonus Action to command\nhow the creature moves and what action it takes on\nits next turn, such as attacking an enemy. In the absence of such orders, the creature acts in a fashion\nappropriate to its nature.\nOnce three fuzzy objects have been pulled from\nthe bag, the bag can’t be used again until the next\ndawn.\nGray Bag of Tricks\n1d8 Creature 1d8 Creature\n1 Weasel 5 Panther\n2 Giant Rat 6 Giant Badger\n3 Badger 7 Dire Wolf\n4 Boar 8 Giant Elk\nRust Bag of Tricks\n1d8 Creature 1d8 Creature\n1 Rat 5 Giant Goat\n2 Owl 6 Giant Boar\n3 Mastiff 7 Lion\n4 Goat 8 Brown Bear\nTan Bag of Tricks\n1d8 Creature 1d8 Creature\n1 Jackal 5 Black Bear\n2 Ape 6 Giant Weasel\n3 Baboon 7 Giant Hyena\n4 Axe Beak 8 Tiger",
    page: 212,
    endPage: 212,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:bead-of-force",
    edition: "2024",
    name: "Bead of Force",
    metadata: "Wondrous Item, Rare",
    rules:
      "This small black sphere measures 3/4 of an inch in\ndiameter and weighs an ounce. Typically, 1d4 + 4\nBeads of Force are found together.\nYou can take a Magic action to throw the bead up\nto 60 feet. The bead explodes in a 10-foot-radius\nSphere on impact and is destroyed. Each creature\nin the Sphere must succeed on a DC 15 Dexterity\nsaving throw or take 5d4 Force damage. A sphere\nof transparent force then encloses the area for 1\nminute. Any creature that failed the save and is\ncompletely within the area is trapped inside this\nsphere. Creatures that succeeded on the save or are\npartially within the area are pushed away from the\ncenter of the sphere until they are no longer inside\nit. Only breathable air can pass through the sphere’s\nwall. No attack or other effect can pass through.\nAn enclosed creature can take a Utilize action to\npush against the sphere’s wall, moving the sphere\nup to half the creature’s Speed. The sphere can be\npicked up, and its magic causes it to weigh only 1\npound, regardless of the weight of creatures inside.",
    page: 212,
    endPage: 213,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:bead-of-nourishment",
    edition: "2024",
    name: "Bead of Nourishment",
    metadata: "Wondrous Item, Common",
    rules:
      "This flavorless, gelatinous bead dissolves on your\ntongue and provides as much nourishment as 1 day\nof Rations.",
    page: 213,
    endPage: 213,
    category: "wondrous",
    rarities: ["common"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:belt-of-dwarvenkind",
    edition: "2024",
    name: "Belt of Dwarvenkind",
    metadata: "Wondrous Item, Rare (Requires Attunement)",
    rules:
      "While wearing this belt, you gain the following\nbenefits:\nDwarvish. You know Dwarvish.\nFriend of Dwarvenkind. You have Advantage on\nCharisma (Persuasion) checks made to interact\nwith dwarves and duergar.\nToughness. Your Constitution increases by 2, to a\nmaximum of 20.\nIn addition, while attuned to the belt, you have a 50\npercent chance each day at dawn of growing a full\nbeard if you can grow one, or a thicker beard if you\nalready have one.\nIf you aren’t a dwarf or duergar, you gain the following additional benefits while wearing the belt:\nDarkvision. You have Darkvision with a range of 60\nfeet.\nResilience. You have Resistance to Poison damage.\nYou also have Advantage on saving throws you\nmake to avoid or end the Poisoned condition.",
    page: 213,
    endPage: 213,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:belt-of-giant-strength",
    edition: "2024",
    name: "Belt of Giant Strength",
    metadata: "Wondrous Item, Rarity Varies (Requires Attunement)",
    rules:
      "While wearing this belt, your Strength changes to\na score granted by the belt. The type of giant determines the score (see the table below). The item has\nno effect on you if your Strength without the belt is\nequal to or greater than the belt’s score.\nBelt Str. Rarity\nBelt of Giant Strength (hill) 21 Rare\nBelt of Giant Strength (frost or 23 Very Rare\nstone)\nBelt of Giant Strength (fire) 25 Very Rare\nBelt of Giant Strength (cloud) 27 Legendary\nBelt of Giant Strength (storm) 29 Legendary",
    page: 213,
    endPage: 213,
    category: "wondrous",
    rarities: [],
    rarityVaries: true,
    attunement: true
  },
  {
    id: "srd521:berserker-axe",
    edition: "2024",
    name: "Berserker Axe",
    metadata: "Weapon (Battleaxe, Greataxe, or Halberd), Rare (Requires Attunement)",
    rules:
      "You gain a +1 bonus to attack rolls and damage rolls\nmade with this magic weapon. In addition, while\nyou are attuned to this weapon, your Hit Point\nmaximum increases by 1 for each level you have\nattained.\nCurse. This weapon is cursed, and becoming attuned to it extends the curse to you. As long as you\nremain cursed, you are unwilling to part with the\nweapon, keeping it within reach at all times. You\nalso have Disadvantage on attack rolls with weapons other than this one.\nWhenever another creature damages you while\nthe weapon is in your possession, you must succeed\non a DC 15 Wisdom saving throw or go berserk. This\nberserk state ends when you start your turn and\nthere are no creatures within 60 feet of you that you\ncan see or hear.\nWhile berserk, you regard the creature nearest\nto you that you can see or hear as your enemy. If\nthere are multiple possible creatures, choose one at\nrandom. On each of your turns, you must move as\nclose to the creature as possible and take the Attack\naction, targeting the creature. If you’re unable to\nget close enough to the creature to attack it with\nthe weapon, your turn ends after you’ve used up all\nyour available movement. If the creature dies or can\nno longer be seen or heard by you, the next nearest\ncreature that you can see or hear becomes your\nnew target.",
    page: 213,
    endPage: 213,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:boots-of-elvenkind",
    edition: "2024",
    name: "Boots of Elvenkind",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "While you wear these boots, your steps make no\nsound, regardless of the surface you are moving\nacross. You also have Advantage on Dexterity\n(Stealth) checks.",
    page: 213,
    endPage: 213,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:boots-of-levitation",
    edition: "2024",
    name: "Boots of Levitation",
    metadata: "Wondrous Item, Rare (Requires Attunement)",
    rules: "While you wear these boots, you can cast Levitate\non yourself.",
    page: 213,
    endPage: 213,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:boots-of-speed",
    edition: "2024",
    name: "Boots of Speed",
    metadata: "Wondrous Item, Rare (Requires Attunement)",
    rules:
      "While you wear these boots, you can take a Bonus\nAction to click the boots’ heels together. If you do,\nthe boots double your Speed, and any creature that\nmakes an Opportunity Attack against you has Disadvantage on the attack roll. If you click your heels\ntogether again, you end the effect.\nWhen you’ve used the boots’ property for a total\nof 10 minutes, the magic ceases to function for you\nuntil you finish a Long Rest.",
    page: 214,
    endPage: 214,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:boots-of-striding-and-springing",
    edition: "2024",
    name: "Boots of Striding and Springing",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "While you wear these boots, your Speed becomes\n30 feet unless your Speed is higher, and your Speed\nisn’t reduced by you carrying weight in excess of\nyour carrying capacity or wearing Heavy Armor.\nOnce on each of your turns, you can jump up to 30\nfeet by spending only 10 feet of movement.",
    page: 214,
    endPage: 214,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:boots-of-the-winterlands",
    edition: "2024",
    name: "Boots of the Winterlands",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "These furred boots are snug and feel warm. While\nwearing them, you gain the following benefits.\nCold Resistance. You have Resistance to Cold\ndamage and can tolerate temperatures of 0 degrees\nFahrenheit or lower without any additional\nprotection.\nWinter Strider. You ignore Difficult Terrain created by ice or snow.",
    page: 214,
    endPage: 214,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:bowl-of-commanding-water-elementals",
    edition: "2024",
    name: "Bowl of Commanding Water Elementals",
    metadata: "Wondrous Item, Rare",
    rules:
      "While this bowl is filled with water and you are\nwithin 5 feet of it, you can take a Magic action to\nsummon a Water Elemental. The elemental appears in an unoccupied space as close to the bowl\nas possible, understands your languages, obeys\nyour commands, and takes its turn immediately\nafter you on your Initiative count. The elemental\ndisappears after 1 hour, when it dies, or when you\ndismiss it as a Bonus Action. The bowl can’t be used\nthis way again until the next dawn.\nThe bowl is about 1 foot in diameter and half as\ndeep. It holds about 3 gallons.",
    page: 214,
    endPage: 214,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:bracers-of-archery",
    edition: "2024",
    name: "Bracers of Archery",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "While wearing these bracers, you have proficiency\nwith the Longbow and Shortbow, and you gain a +2\nbonus to damage rolls made with such weapons.",
    page: 214,
    endPage: 214,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:bracers-of-defense",
    edition: "2024",
    name: "Bracers of Defense",
    metadata: "Wondrous Item, Rare (Requires Attunement)",
    rules:
      "While wearing these bracers, you gain a +2 bonus to\nArmor Class if you are wearing no armor and using\nno Shield.",
    page: 214,
    endPage: 214,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:brazier-of-commanding-fire-elementals",
    edition: "2024",
    name: "Brazier of Commanding Fire Elementals",
    metadata: "Wondrous Item, Rare",
    rules:
      "While you are within 5 feet of this brazier, you can\ntake a Magic action to summon a Fire Elemental.\nThe elemental appears in an unoccupied space as\nclose to the brazier as possible, understands your\nlanguages, obeys your commands, and takes its turn\nimmediately after you on your Initiative count. The\nelemental disappears after 1 hour, when it dies, or\nwhen you dismiss it as a Bonus Action. The brazier\ncan’t be used this way again until the next dawn.",
    page: 214,
    endPage: 214,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:brooch-of-shielding",
    edition: "2024",
    name: "Brooch of Shielding",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "While wearing this brooch, you have Resistance to\nForce damage, and you have Immunity to damage\nfrom the Magic Missile spell.",
    page: 214,
    endPage: 214,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:broom-of-flying",
    edition: "2024",
    name: "Broom of Flying",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "This wooden broom functions like a mundane\nbroom until you stand astride it and take a Magic\naction to make it hover beneath you, at which time\nit can be ridden in the air. It has a Fly Speed of 50\nfeet. It can carry up to 400 pounds, but its Fly Speed\nbecomes 30 feet while carrying over 200 pounds.\nThe broom stops hovering when you land or when\nyou’re no longer riding it.\nAs a Magic action, you can send the broom to\ntravel alone to a destination within 1 mile of you if\nyou name the location and are familiar with it. The\nbroom comes back to you when you take a Magic\naction and use a command word if the broom is still\nwithin 1 mile of you.",
    page: 214,
    endPage: 214,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:candle-of-invocation",
    edition: "2024",
    name: "Candle of Invocation",
    metadata: "Wondrous Item, Very Rare (Requires Attunement)",
    rules:
      "This candle’s magic is activated when the candle\nis lit, which requires a Magic action. After burning\nfor 4 hours, the candle is destroyed. You can snuff\nit out early for use at a later time. Deduct the time\nit burned in increments of 1 minute from its total\nburn time.\nWhile lit, the candle sheds Dim Light in a 30-foot\nradius. While you are within that light, you have\nAdvantage on D20 Tests. In addition, a Cleric or\nDruid in the light can cast level 1 spells they have\nprepared without expending spell slots.\nAlternatively, when you light the candle for the\nfirst time, you can cast Gate with it. Doing so destroys the candle. The portal created by the spell\nlinks to a particular Outer Plane chosen by the GM\nor determined by rolling on the following table.\n1d100 Outer Plane 1d100 Outer Plane\n01–05 Abyss 55–59 Gehenna\n06–10 Acheron 60–64 Hades\n11–17 Arborea 65–69 Limbo\n18–25 Arcadia 70–77 Mechanus\n26–33 Beastlands 78–85 Mount Celestia\n34–41 Bytopia 86–90 Nine Hells\n42–46 Carceri 91–95 Pandemonium\n47–54 Elysium 96–00 Ysgard",
    page: 214,
    endPage: 215,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:cape-of-the-mountebank",
    edition: "2024",
    name: "Cape of the Mountebank",
    metadata: "Wondrous Item, Rare",
    rules:
      "This cape smells faintly of brimstone. While wearing it, you can use it to cast Dimension Door as a\nMagic action. This property can’t be used again\nuntil the next dawn.\nWhen you teleport with that spell, you leave behind a cloud of smoke. The space you left is Lightly\nObscured by that smoke until the end of your\nnext turn.",
    page: 215,
    endPage: 215,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:carpet-of-flying",
    edition: "2024",
    name: "Carpet of Flying",
    metadata: "Wondrous Item, Very Rare",
    rules:
      "You can make this carpet hover and fly by taking a\nMagic action and using the carpet’s command word.\nIt moves according to your directions if you are\nwithin 30 feet of it.\nFour sizes of Carpet of Flying exist. The GM\nchooses the size of a given carpet or determines it\nrandomly by rolling on the following table. A carpet\ncan carry up to twice the weight shown on the table,\nbut its Fly Speed is halved if it carries more than its\nnormal capacity.\n1d100 Size Capacity Fly Speed\n01–20 3 ft. × 5 ft. 200 lb. 80 feet\n21–55 4 ft. × 6 ft. 400 lb. 60 feet\n56–80 5 ft. × 7 ft. 600 lb. 40 feet\n81–00 6 ft. × 9 ft. 800 lb. 30 feet",
    page: 215,
    endPage: 215,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:censer-of-controlling-air-elementals",
    edition: "2024",
    name: "Censer of Controlling Air Elementals",
    metadata: "Wondrous Item, Rare",
    rules:
      "While gently swinging this censer, you can take a\nMagic action to summon an Air Elemental. The\nelemental appears in an unoccupied space as close\nto the censer as possible, understands your languages, obeys your commands, and takes its turn\nimmediately after you on your Initiative count. The\nelemental disappears after 1 hour, when it dies, or\nwhen you dismiss it as a Bonus Action. The censer\ncan’t be used this way again until the next dawn.",
    page: 215,
    endPage: 215,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:chime-of-opening",
    edition: "2024",
    name: "Chime of Opening",
    metadata: "Wondrous Item, Rare",
    rules:
      "This hollow metal tube measures about 1 foot long\nand weighs 1 pound. As a Magic action, you can\nstrike the chime to cast Knock. The spell’s customary knocking sound is replaced by the clear, ringing\ntone of the chime, which is audible out to 300 feet.\nThe chime can be used 10 times. After the tenth\ntime, it cracks and becomes useless.",
    page: 215,
    endPage: 215,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:circlet-of-blasting",
    edition: "2024",
    name: "Circlet of Blasting",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "While wearing this circlet, you can cast Scorching\nRay with it (+5 to hit). The circlet can’t cast this spell\nagain until the next dawn.",
    page: 215,
    endPage: 215,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:cloak-of-arachnida",
    edition: "2024",
    name: "Cloak of Arachnida",
    metadata: "Wondrous Item, Very Rare (Requires Attunement)",
    rules:
      "This fine garment is made of black silk interwoven\nwith faint, silvery threads. While wearing it, you\ngain the following benefits.\nPoison Resistance. You have Resistance to Poison\ndamage.\nSpider Climb. You have a Climb Speed equal to\nyour Speed and can move up, down, and across vertical surfaces and along ceilings, while leaving your\nhands free.\nSpider Walk. You can’t be caught in webs of any\nsort and can move through webs as if they were Difficult Terrain.\nWeb. You can cast Web (save DC 13). The web\ncreated by the spell fills twice its normal area. Once\nused, this property can’t be used again until the\nnext dawn.",
    page: 215,
    endPage: 215,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:cloak-of-displacement",
    edition: "2024",
    name: "Cloak of Displacement",
    metadata: "Wondrous Item, Rare (Requires Attunement)",
    rules:
      "While you wear this cloak, it magically projects an\nillusion that makes you appear to be standing in a\nplace near your actual location, causing any creature to have Disadvantage on attack rolls against\nyou. If you take damage, the property ceases to\nfunction until the start of your next turn. This property is suppressed while your Speed is 0.",
    page: 215,
    endPage: 215,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:cloak-of-elvenkind",
    edition: "2024",
    name: "Cloak of Elvenkind",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "While you wear this cloak, Wisdom (Perception)\nchecks made to perceive you have Disadvantage,\nand you have Advantage on Dexterity (Stealth)\nchecks.",
    page: 215,
    endPage: 215,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:cloak-of-invisibility",
    edition: "2024",
    name: "Cloak of Invisibility",
    metadata: "Wondrous Item, Legendary (Requires Attunement)",
    rules:
      "This cloak has 3 charges and regains 1d3 expended\ncharges daily at dawn. While wearing the cloak, you\ncan take a Magic action to pull its hood over your\nhead and expend 1 charge to give yourself the Invisible condition for 1 hour. The effect ends early if you\npull the hood down (no action required) or cease\nwearing the cloak.",
    page: 215,
    endPage: 216,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:cloak-of-protection",
    edition: "2024",
    name: "Cloak of Protection",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules: "You gain a +1 bonus to Armor Class and saving\nthrows while you wear this cloak.",
    page: 216,
    endPage: 216,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:cloak-of-the-bat",
    edition: "2024",
    name: "Cloak of the Bat",
    metadata: "Wondrous Item, Rare (Requires Attunement)",
    rules:
      "While wearing this cloak, you have Advantage on\nDexterity (Stealth) checks. In an area of Dim Light\nor Darkness, you can grip the edges of the cloak and\nuse it to gain a Fly Speed of 40 feet. If you ever fail\nto grip the cloak’s edges while flying in this way, or\nif you are no longer in Dim Light or Darkness, you\nlose this Fly Speed.\nWhile wearing the cloak in an area of Dim Light\nor Darkness, you can cast Polymorph on yourself,\nshape-shifting into a Bat. While in that form, you\nretain your Intelligence, Wisdom, and Charisma\nscores. The cloak can’t be used this way again until\nthe next dawn.",
    page: 216,
    endPage: 216,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:cloak-of-the-manta-ray",
    edition: "2024",
    name: "Cloak of the Manta Ray",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules: "While wearing this cloak, you can breathe underwater, and you have a Swim Speed of 60 feet.",
    page: 216,
    endPage: 216,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:crystal-ball",
    edition: "2024",
    name: "Crystal Ball",
    metadata: "Wondrous Item, Very Rare (Requires Attunement)",
    rules: "While touching this crystal orb, you can cast Scrying\n(save DC 17) with it.",
    page: 216,
    endPage: 216,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:crystal-ball-of-mind-reading",
    edition: "2024",
    name: "Crystal Ball of Mind Reading",
    metadata: "Wondrous Item, Legendary (Requires Attunement)",
    rules:
      "While touching this crystal orb, you can cast Scrying\n(save DC 17) with it. In addition, you can cast Detect\nThoughts (save DC 17) targeting creatures you can\nsee within 30 feet of the spell’s sensor. You don’t\nneed to concentrate on this Detect Thoughts spell\nto maintain it during its duration, but it ends if the\nScrying spell ends.",
    page: 216,
    endPage: 216,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:crystal-ball-of-telepathy",
    edition: "2024",
    name: "Crystal Ball of Telepathy",
    metadata: "Wondrous Item, Legendary (Requires Attunement)",
    rules:
      "While touching this crystal orb, you can cast Scrying (save DC 17) with it. In addition, you can communicate telepathically with creatures you can see\nwithin 30 feet of the spell’s sensor. You can also cast\nSuggestion (save DC 17) through the sensor on one\nof those creatures. You don’t need to concentrate on\nthis Suggestion to maintain it during its duration,\nbut it ends if Scrying ends. You can’t cast Suggestion\nin this way again until the next dawn.",
    page: 216,
    endPage: 216,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:crystal-ball-of-true-seeing",
    edition: "2024",
    name: "Crystal Ball of True Seeing",
    metadata: "Wondrous Item, Legendary (Requires Attunement)",
    rules:
      "While touching this crystal orb, you can cast Scrying\n(save DC 17) with it. In addition, you have Truesight\nwith a range of 120 feet centered on the spell’s\nsensor.",
    page: 216,
    endPage: 216,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:cube-of-force",
    edition: "2024",
    name: "Cube of Force",
    metadata: "Wondrous Item, Rare (Requires Attunement)",
    rules:
      "This cube is about an inch across. Each face has a\ndistinct marking on it. You can press one of those\nfaces, expend the number of charges required for it,\nand thereby cast the spell associated with it (save\nDC 17), as shown in the Cube of Force Faces table.\nThe cube starts with 10 charges, and it regains\n1d6 expended charges daily at dawn.\nCube of Force Faces\nSpell Charge Cost\nMage Armor 1\nShield 1\nTiny Hut 3\nPrivate Sanctum 4\nResilient Sphere 4\nWall of Force 5",
    page: 216,
    endPage: 216,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:cubic-gate",
    edition: "2024",
    name: "Cubic Gate",
    metadata: "Wondrous Item, Legendary",
    rules:
      "This cube is 3 inches across and radiates palpable\nmagical energy. The six sides of the cube are each\nkeyed to a different plane of existence, one of which\nis the Material Plane. The other sides are linked to\nplanes determined by the GM.\nThe cube has 3 charges and regains 1d3 expended\ncharges daily at dawn. As a Magic action, you can\nexpend 1 of the cube’s charges to cast one of the following spells using the cube.\nGate. Pressing one side of the cube, you cast Gate,\nopening a portal to the plane of existence keyed to\nthat side.\nPlane Shift. Pressing one side of the cube twice,\nyou cast Plane Shift, transporting the targets to the\nplane of existence keyed to that side.",
    page: 216,
    endPage: 216,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:dagger-of-venom",
    edition: "2024",
    name: "Dagger of Venom",
    metadata: "Weapon (Dagger), Rare",
    rules:
      "You gain a +1 bonus to attack rolls and damage rolls\nmade with this magic weapon.\nYou can take a Bonus Action to magically coat the\nblade with poison. The poison remains for 1 minute\nor until an attack using this weapon hits a creature.\nThat creature must succeed on a DC 15 Constitution\nsaving throw or take 2d10 Poison damage and have\nthe Poisoned condition for 1 minute. The weapon\ncan’t be used this way again until the next dawn.",
    page: 216,
    endPage: 216,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:dancing-sword",
    edition: "2024",
    name: "Dancing Sword",
    metadata: "Weapon (Greatsword, Longsword, Rapier, Scimitar, or Shortsword), Very Rare (Requires Attunement)",
    rules:
      "You can take a Bonus Action to toss this magic\nweapon into the air. When you do so, the weapon\nbegins to hover, flies up to 30 feet, and attacks one\ncreature of your choice within 5 feet of itself. The\nweapon uses your attack roll and adds your ability\nmodifier to damage rolls.\nWhile the weapon hovers, you can take a Bonus\nAction to cause it to fly up to 30 feet to another spot\nwithin 30 feet of you. As part of the same Bonus Action, you can cause the weapon to attack one creature within 5 feet of the weapon.\nAfter the hovering weapon attacks for the fourth\ntime, it flies back to you and tries to return to your\nhand. If you have no hand free, the weapon falls to\nthe ground in your space. If the weapon has no unobstructed path to you, it moves as close to you as\nit can and then falls to the ground. It also ceases to\nhover if you grasp it or are more than 30 feet away\nfrom it.",
    page: 217,
    endPage: 217,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:decanter-of-endless-water",
    edition: "2024",
    name: "Decanter of Endless Water",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "This stoppered flask sloshes when shaken, as if it\ncontains water. The decanter weighs 2 pounds.\nYou can take a Magic action to remove the stopper\nand issue one of three command words, whereupon\nan amount of fresh water or salt water (your choice)\npours out of the flask. The water stops pouring out\nat the start of your next turn. Choose from the following command words:\nSplash. The decanter produces 1 gallon of water.\nFountain. The decanter produces 5 gallons of water.\nGeyser. The decanter produces 30 gallons of water\nthat gushes forth in a Line 30 feet long and 1 foot\nwide. If you’re holding the decanter, you can aim\nthe geyser in one direction (no action required).\nOne creature of your choice in the Line must succeed on a DC 13 Strength saving throw or take\n1d4 Bludgeoning damage and have the Prone condition. Instead of a creature, you can target one\nobject in the Line that isn’t being worn or carried\nand that weighs no more than 200 pounds. The\nobject is knocked over by the geyser.",
    page: 217,
    endPage: 217,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:deck-of-illusions",
    edition: "2024",
    name: "Deck of Illusions",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "This box contains a set of cards. A full deck has 34\ncards: 32 depicting specific creatures and two with\na mirrored surface. A deck found as treasure is usually missing 1d20 − 1 cards.\nThe magic of the deck functions only if its cards\nare drawn at random. You can take a Magic action\nto draw a card at random from the deck and throw\nit to the ground at a point within 30 feet of yourself.\nAn illusion of a creature, determined by rolling on\nthe Deck of Illusions table, forms over the thrown\ncard and remains until dispelled. The illusory creature created by the card looks and behaves like a\nreal creature of its kind, except that it can do no\nharm. While you are within 120 feet of the illusory\ncreature and can see it, you can take a Magic action\nto move it anywhere within 30 feet of its card.\nAny physical interaction with the illusory creature reveals it to be false, because objects pass\nthrough it. A creature that takes a Study action to\nvisually inspect the illusory creature identifies it as\nan illusion with a successful DC 15 Intelligence (Investigation) check. The illusion lasts until its card\nis moved or the illusion is dispelled (using a Dispel\nMagic spell or a similar effect). When the illusion\nends, the image on its card disappears, and that\ncard can’t be used again.\nDeck of Illusions\n1d100 Illusion*\n01–03 Adult Red Dragon\n04–06 Archmage\n07–09 Assassin\n10–12 Bandit Captain\n13–15 Basilisk\n16–18 Berserker\n19–21 Bugbear Warrior\n22–24 Cloud Giant\n25–27 Druid\n28–30 Erinyes\n31–33 Ettin\n34–36 Fire Giant\n37–39 Frost Giant\n40–42 Gnoll Warrior\n43–45 Goblin Warrior\n46–48 Guardian Naga\n49–51 Hill Giant\n52–54 Hobgoblin Warrior\n55–57 Incubus\n58–60 Iron Golem\n61–63 Knight\n64–66 Kobold Warrior\n67–69 Lich\n70–72 Medusa\n73–75 Night Hag\n76–78 Ogre\n79–81 Oni\n1d100 Illusion*\n82–84 Priest\n85–87 Succubus\n88–90 Troll\n91–93 Veteran Warrior\n94–96 Wyvern\n97–00 The card drawer\n*Stat blocks for these creatures (except the card drawer) appear in\n“Monsters.”",
    page: 217,
    endPage: 218,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:defender",
    edition: "2024",
    name: "Defender",
    metadata: "Weapon (Any Melee Weapon), Legendary (Requires Attunement)",
    rules:
      "You gain a +3 bonus to attack rolls and damage rolls\nmade with this magic weapon.\nThe first time you attack with the weapon on each\nof your turns, you can transfer some or all of the\nweapon’s bonus to your Armor Class. For example,\nyou could reduce the bonus to your attack rolls and\ndamage rolls to +1 and gain a +2 bonus to Armor\nClass. The adjusted bonuses remain in effect until\nthe start of your next turn, although you must hold\nthe weapon to gain a bonus to AC from it.",
    page: 218,
    endPage: 218,
    category: "weapon",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:demon-armor",
    edition: "2024",
    name: "Demon Armor",
    metadata: "Armor (Any Light, Medium, or Heavy), Very Rare (Requires Attunement)",
    rules:
      "While wearing this armor, you gain a +1 bonus to\nArmor Class, and you know Abyssal. In addition,\nthe armor’s clawed gauntlets allow your Unarmed\nStrikes to deal 1d8 Slashing damage instead of the\nusual Bludgeoning damage, and you gain a +1 bonus\nto the attack and damage rolls of your Unarmed\nStrikes.\nCurse. Once you don this cursed armor, you can’t\ndoff it unless you are targeted by a Remove Curse\nspell or similar magic. While wearing the armor,\nyou have Disadvantage on attack rolls against demons and on saving throws against their spells and\nspecial abilities.",
    page: 218,
    endPage: 218,
    category: "armor",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:dimensional-shackles",
    edition: "2024",
    name: "Dimensional Shackles",
    metadata: "Wondrous Item, Rare",
    rules:
      "You can take a Utilize action to place these shackles\non a creature that has the Incapacitated condition.\nThe shackles adjust to fit a creature of Small to\nLarge size. The shackles prevent a creature bound\nby them from using any method of extradimensional movement, including teleportation or travel\nto a different plane of existence. They don’t prevent\nthe creature from passing through an interdimensional portal.\nYou and any creature you designate when you\nuse the shackles can take a Utilize action to remove\nthem. Once every 30 days, the bound creature can\nmake a DC 30 Strength (Athletics) check. On a successful check, the creature breaks free and destroys\nthe shackles.",
    page: 218,
    endPage: 218,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:dragon-orb",
    edition: "2024",
    name: "Dragon Orb",
    metadata: "Wondrous Item, Artifact (Requires Attunement)",
    rules:
      "An orb is an etched crystal globe about 10 inches in\ndiameter. When used, it grows to about 20 inches in\ndiameter, and mist swirls inside it.\nWhile attuned to an orb, you can take a Magic\naction to peer into the orb’s depths. You must then\nmake a DC 15 Charisma saving throw. On a successful save, you control the orb for as long as you remain attuned to it. On a failed save, the orb imposes\nthe Charmed condition on you for as long as you\nremain attuned to it.\nWhile you are Charmed by the orb, you can’t\nvoluntarily end your Attunement to it, and the orb\ncasts Suggestion on you at will (save DC 18), urging\nyou to work toward the evil ends it desires. The\ndragon essence within the orb might want many\nthings: the annihilation of a particular society or organization, freedom from the orb, to spread suffering in the world, to advance the worship of Tiamat,\nor something else the GM decides.\nSpells. The orb has 7 charges and regains 1d4 + 3\nexpended charges daily at dawn. If you control the\norb, you can cast one of the spells on the following\ntable from it. The table indicates how many charges\nyou must expend to cast the spell.\nSpell Charge\nCost\nCure Wounds (level 9 version) 4\nDaylight 1\nDeath Ward 2\nDetect Magic 0\nScrying (save DC 18) 3\nCall Dragons. While you control the orb, you\ncan take a Magic action to cause the orb to issue a\ntelepathic call that extends in all directions for 40\nmiles. Chromatic dragons in range feel compelled\nto come to the orb as soon as possible by the most\ndirect route. Dragon deities such as Tiamat are unaffected by this call. Chromatic dragons drawn to\nthe orb might be Hostile toward you for compelling\nthem against their will. Once you have used this\nproperty, it can’t be used again for 1 hour.\nDestroying an Orb. A Dragon Orb has AC 20 and is\ndestroyed if it takes damage from a +3 Weapon or a\nDisintegrate spell. Nothing else can harm it.",
    page: 218,
    endPage: 218,
    category: "wondrous",
    rarities: ["artifact"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:dragon-scale-mail",
    edition: "2024",
    name: "Dragon Scale Mail",
    metadata: "Armor (Scale Mail), Very Rare (Requires Attunement)",
    rules:
      "Dragon Scale Mail is made of the scales of one kind\nof dragon. Sometimes dragons collect their cast-off\nscales and gift them. Other times, hunters carefully\npreserve the hide of a dead dragon. In either case,\nDragon Scale Mail is highly valued.\nWhile wearing this armor, you gain a +1 bonus to\nArmor Class, you have Advantage on saving throws\nagainst the breath weapons of Dragons, and you\nhave Resistance to one damage type determined by\nthe kind of dragon that provided the scales (see the\naccompanying table).\nAdditionally, you can focus your senses as a Magic\naction to discern the distance and direction to the\nclosest dragon within 30 miles of yourself that is\nof the same type as the armor. This action can’t be\nused again until the next dawn.\nDragon Resistance Dragon Resistance\nBlack Acid Gold Fire\nBlue Lightning Green Poison\nBrass Fire Red Fire\nBronze Lightning Silver Cold\nCopper Acid White Cold",
    page: 218,
    endPage: 219,
    category: "armor",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:dragon-slayer",
    edition: "2024",
    name: "Dragon Slayer",
    metadata: "Weapon (Any Simple or Martial), Rare",
    rules:
      "You gain a +1 bonus to attack rolls and damage rolls\nmade with this magic weapon.\nThe weapon deals an extra 3d6 damage of the\nweapon’s type if the target is a Dragon.",
    page: 219,
    endPage: 219,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:dust-of-disappearance",
    edition: "2024",
    name: "Dust of Disappearance",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "This powder resembles fine sand. There is enough\nof it for one use. When you take a Utilize action to\nthrow the dust into the air, you and each creature\nand object within a 10-foot Emanation originating\nfrom you have the Invisible condition for 2d4 minutes. The duration is the same for all subjects, and\nthe dust is consumed when its magic takes effect.\nImmediately after an affected creature makes an attack roll, deals damage, or casts a spell, the Invisible\ncondition ends for that creature.",
    page: 219,
    endPage: 219,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:dust-of-dryness",
    edition: "2024",
    name: "Dust of Dryness",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "This small packet contains 1d6 + 4 pinches of dust.\nAs a Utilize action, you can sprinkle a pinch of the\ndust over water, turning up to a 15-foot Cube of\nwater into one marble-sized pellet, which floats\nor rests near where the dust was sprinkled. The\npellet’s weight is negligible. A creature can take\na Utilize action to smash the pellet against a hard\nsurface, causing the pellet to shatter and release the\nwater the dust absorbed. Doing so destroys the pellet and ends its magic.\nAs a Utilize action, you can sprinkle a pinch of the\ndust on an Elemental within 5 feet of yourself that\nis composed mostly of water (such as a Water Elemental). Such a creature exposed to a pinch of the\ndust makes a DC 13 Constitution saving throw, taking 10d6 Necrotic damage on a failed save or half as\nmuch damage on a successful one.",
    page: 219,
    endPage: 219,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:dust-of-sneezing-and-choking",
    edition: "2024",
    name: "Dust of Sneezing and Choking",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "Found in a small container, this powder resembles\nDust of Disappearance, and Identify reveals it to be\nsuch. There is enough of it for one use.\nAs a Utilize action, you can throw the dust into the\nair, forcing yourself and every creature in a 30-foot\nEmanation originating from you to make a DC 15\nConstitution saving throw. Constructs, Elementals,\nOozes, Plants, and Undead succeed on the save\nautomatically.\nOn a failed save, a creature begins sneezing uncontrollably; it has the Incapacitated condition and\nis suffocating. The creature repeats the save at the\nend of each of its turns, ending the effect on itself on\na success. The effect also ends on any creature targeted by a Lesser Restoration spell.",
    page: 219,
    endPage: 219,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:dwarven-plate",
    edition: "2024",
    name: "Dwarven Plate",
    metadata: "Armor (Half Plate Armor or Plate Armor), Very Rare",
    rules:
      "While wearing this armor, you gain a +2 bonus to\nArmor Class. In addition, if an effect moves you\nagainst your will along the ground, you can take a\nReaction to reduce the distance you are moved by\nup to 10 feet.",
    page: 219,
    endPage: 219,
    category: "armor",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:dwarven-thrower",
    edition: "2024",
    name: "Dwarven Thrower",
    metadata:
      "Weapon (Warhammer), Very Rare (Requires Attunement by a Dwarf or a Creature Attuned to a Belt of Dwarvenkind)",
    rules:
      "You gain a +3 bonus to attack rolls and damage rolls\nmade with this magic weapon. It has the Thrown\nproperty with a normal range of 20 feet and a long\nrange of 60 feet. When you hit with a ranged attack\nusing this weapon, it deals an extra 1d8 Force damage, or an extra 2d8 Force damage if the target is\na Giant. Immediately after hitting or missing, the\nweapon flies back to your hand.",
    page: 219,
    endPage: 219,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:efficient-quiver",
    edition: "2024",
    name: "Efficient Quiver",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "Each of the quiver’s three compartments connects\nto an extradimensional space that allows the quiver\nto hold numerous items while never weighing more\nthan 2 pounds. The shortest compartment can hold\nup to 60 Arrows, Bolts, or similar objects. The midsize compartment holds up to 18 Javelins or similar\nobjects. The longest compartment holds up to 6 long\nobjects, such as bows, Quarterstaffs, or Spears.\nYou can draw any item the quiver contains as if\ndoing so from a regular quiver or scabbard.",
    page: 219,
    endPage: 219,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:efreeti-bottle",
    edition: "2024",
    name: "Efreeti Bottle",
    metadata: "Wondrous Item, Very Rare",
    rules:
      "When you take a Magic action to remove the stopper\nof this painted brass bottle, a cloud of thick smoke\nflows out of it. At the end of your turn, the smoke disappears with a flash of harmless fire, and an Efreeti\nappears in an unoccupied space within 30 feet of you.\nThe first time the bottle is opened, the GM rolls on\nthe following table to determine what happens.\n1d10 Effect\n1 The efreeti attacks you. After fighting for 5\nrounds, the efreeti disappears, and the bottle\nloses its magic.\n2–9 The efreeti understands your languages and\nobeys your commands for 1 hour, after which\nit returns to the bottle, and a new stopper\ncontains it. The stopper can’t be removed for\n24 hours. The next two times the bottle is\nopened, the same effect occurs. If the bottle is\nopened a fourth time, the efreeti escapes and\ndisappears, and the bottle loses its magic.\n10 The efreeti understands your languages and can\ncast Wish once for you. It disappears when it\ngrants the wish or after 1 hour, and the bottle\nloses its magic.",
    page: 220,
    endPage: 220,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:elemental-gem",
    edition: "2024",
    name: "Elemental Gem",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "This gem contains a mote of elemental energy.\nWhen you take a Utilize action to break the gem,\nan elemental is summoned (see “Monsters” for its\nstat block), and the gem ceases to be magical. The\nelemental appears in an unoccupied space as close\nto the broken gem as possible, understands your\nlanguages, obeys your commands, and takes its\nturn immediately after you on your Initiative count.\nThe elemental disappears after 1 hour, when it dies,\nor when you dismiss it as a Bonus Action. The type\nof gem determines the elemental, as shown in the\nfollowing table.\nGem Summoned Elemental\nBlue sapphire Air Elemental\nEmerald Water Elemental\nRed corundum Fire Elemental\nYellow diamond Earth Elemental",
    page: 220,
    endPage: 220,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:elixir-of-health",
    edition: "2024",
    name: "Elixir of Health",
    metadata: "Potion, Rare",
    rules:
      "When you drink this potion, you are cured of all\nmagical contagions. In addition, the following conditions end on you: Blinded, Deafened, Paralyzed,\nand Poisoned.\nThe clear, red liquid has tiny bubbles of light in it.",
    page: 220,
    endPage: 220,
    category: "potion",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:elven-chain",
    edition: "2024",
    name: "Elven Chain",
    metadata: "Armor (Chain Mail or Chain Shirt), Rare",
    rules:
      "You gain a +1 bonus to Armor Class while you wear\nthis armor. You are considered trained with this armor even if you lack training with Medium or Heavy\narmor.",
    page: 220,
    endPage: 220,
    category: "armor",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:energy-bow",
    edition: "2024",
    name: "Energy Bow",
    metadata: "Weapon (Longbow or Shortbow), Very Rare (Requires Attunement)",
    rules:
      "You gain a +1 bonus to attack rolls and damage rolls\nmade with this magic weapon, which has no string.\nEach time you pull your arm back in a firing motion,\na magical arrow made of golden energy appears\nnocked and ready to fire. An arrow produced by\nthis weapon deals Force damage instead of Piercing damage on a hit, and it disappears after it hits\nor misses its target. Until it disappears, the arrow\nemits Bright Light in a 20-foot radius and Dim Light\nfor an additional 20 feet.\nThis weapon has the following additional\nproperties.\nArrow of Restraint. Whenever you use this\nweapon to make a ranged attack against a creature,\nyou can try to restrain the target instead of dealing damage to it. If the arrow hits, the target must\nsucceed on a DC 15 Strength saving throw or have\nthe Restrained condition for 1 minute. As an action,\na creature Restrained by an arrow can make a DC\n20 Strength (Athletics) check to try to break the\nrestraint, ending the effect on itself on a successful\ncheck.\nArrow of Transport. As a Magic action, you can\nfire one energy arrow from this weapon at a target\nyou can see within 60 feet of yourself. The target\ncan be either a willing Medium or smaller creature\nor an object that isn’t being worn or carried, provided the object is small enough to fit inside a 5-foot\nCube. The arrow teleports the target to an unoccupied space you can see within 10 feet of you.\nEnergy Ladder. As a Magic action, you can loose a\nflurry of energy arrows from this weapon at a wall\nup to 60 feet away from yourself. The arrows become glowing rungs that stick out of the wall, forming a magical ladder up to 60 feet long on the wall.\nThis ladder lasts for 1 minute before disappearing.",
    page: 220,
    endPage: 220,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:eversmoking-bottle",
    edition: "2024",
    name: "Eversmoking Bottle",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "As a Magic action, you can open or close this bottle.\nOpening the bottle causes thick smoke to billow\nout, forming a cloud that fills a 60-foot Emanation\noriginating from the bottle. The area within the\nsmoke is Heavily Obscured.\nEach minute the bottle remains open, the size of\nthe Emanation increases by 10 feet until it reaches\nits maximum size of 120 feet.\nClosing the bottle causes the cloud to become\nfixed in place until it disperses after 10 minutes.\nA strong wind (such as that created by the Gust of\nWind spell) disperses the cloud after 1 minute.",
    page: 220,
    endPage: 221,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:eyes-of-charming",
    edition: "2024",
    name: "Eyes of Charming",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "These crystal lenses fit over the eyes. They have\n3 charges. While wearing them, you can expend\n1 or more charges to cast Charm Person (save DC\n13). For 1 charge, you cast the level 1 version of the\nspell. You increase the spell’s level by one for each\nadditional charge you expend. The lenses regain all\nexpended charges daily at dawn.",
    page: 221,
    endPage: 221,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:eyes-of-minute-seeing",
    edition: "2024",
    name: "Eyes of Minute Seeing",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "These crystal lenses fit over the eyes. While wearing them, your vision improves significantly out to a\nrange of 1 foot, granting you Darkvision within that\nrange and Advantage on Intelligence (Investigation)\nchecks made to examine something within that\nrange.",
    page: 221,
    endPage: 221,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:eyes-of-the-eagle",
    edition: "2024",
    name: "Eyes of the Eagle",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "These crystal lenses fit over the eyes. While wearing them, you have Advantage on Wisdom (Perception) checks that rely on sight. In conditions of\nclear visibility, you can make out details of even\nextremely distant creatures and objects as small as\n2 feet across.",
    page: 221,
    endPage: 221,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:feather-token",
    edition: "2024",
    name: "Feather Token",
    metadata: "Wondrous Item, Rarity Varies",
    rules:
      "This object looks like a feather. Different types of\nfeather tokens exist, each with a different single-use\neffect. The GM chooses the kind of token or determines it randomly by rolling on the Feather Tokens\ntable. The type of token determines its rarity.\nAnchor (Uncommon). You can take a Magic action\nto touch the token to a boat or ship. For the next\n24 hours, the vessel can’t be moved by any means.\nTouching the token to the vessel again ends the effect. When the effect ends, the token disappears.\nBird (Rare). You can take a Magic action to toss\nthe token 5 feet into the air. The token disappears\nand an enormous, multicolored bird takes its place.\nThe bird has the statistics of a Roc, but it can’t attack. It obeys your simple commands and can carry\nup to 500 pounds while flying at its maximum\nspeed (16 miles per hour for a maximum of 144\nmiles per day, with a 1-hour rest for every 3 hours of\nflying) or 1,000 pounds at half that speed. The bird\ndisappears after flying its maximum distance for a\nday or if it drops to 0 Hit Points. You can dismiss the\nbird as a Magic action.\nFan (Uncommon). If you are on a boat or ship,\nyou can take a Magic action to toss the token up to\n10 feet in the air. The token disappears, and a giant\nflapping fan takes its place. The fan floats and creates a strong wind. This wind can fill the sails of one\nship, increasing its speed by 5 miles per hour for 8\nhours. You can dismiss the fan as a Magic action.\nSwan Boat (Rare). You can take a Magic action to\ntouch the token to a body of water at least 60 feet\nin diameter. The token disappears, and a 50-footlong, 20-foot-wide boat shaped like a swan takes its\nplace. The boat is self-propelled and moves across\nwater at a speed of 6 miles per hour. You can take\na Magic action while on the boat to command it to\nmove or to turn up to 90 degrees. The boat remains\nfor 24 hours and then disappears. You can dismiss\nthe boat as a Magic action.\nTree (Uncommon). You must be outdoors to use\nthis token. You can take a Magic action to touch it\nto an unoccupied space on the ground. The token\ndisappears, and in its place a nonmagical oak tree\nsprings into existence. The tree is 60 feet tall and\nhas a 5-foot-diameter trunk, and its branches at the\ntop spread out in a 20-foot radius.\nWhip (Rare). You can take a Magic action to\nthrow the token to a point within 10 feet of yourself.\nThe token disappears, and a floating whip takes its\nplace. You can then take a Bonus Action to make a\nmelee spell attack against a creature within 10 feet\nof the whip, with an attack bonus of +9. On a hit, the\ntarget takes 1d6 + 5 Force damage.\nAs a Bonus Action, you can direct the whip to fly\nup to 20 feet and repeat the attack against a creature\nwithin 10 feet of the whip. The whip disappears after\n1 hour, when you take a Magic action to dismiss it, or\nwhen you die or have the Incapacitated condition.\nFeather Tokens\n1d100 Token Rarity\n01–20 Anchor Uncommon\n21–35 Bird Rare\n36–50 Fan Uncommon\n51–65 Swan boat Rare\n66–90 Tree Uncommon\n91–00 Whip Rare",
    page: 221,
    endPage: 221,
    category: "wondrous",
    rarities: [],
    rarityVaries: true,
    attunement: false
  },
  {
    id: "srd521:figurine-of-wondrous-power",
    edition: "2024",
    name: "Figurine of Wondrous Power",
    metadata: "Wondrous Item, Rarity Varies",
    rules:
      "A Figurine of Wondrous Power is a statuette small\nenough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground\nwithin 60 feet of yourself, the figurine becomes a\nliving creature specified in the figurine’s description below. If the space where the creature would\nappear is occupied by other creatures or objects, or\nif there isn’t enough space for the creature, the figurine doesn’t become a creature.\nThe creature is Friendly to you and your allies.\nIt understands your languages, obeys your commands, and takes its turn immediately after you on\nyour Initiative count. If you issue no commands, the\ncreature defends itself but takes no other actions.\nThe creature exists for a duration specific to each\nfigurine. At the end of the duration, the creature\nreverts to its figurine form. It reverts to a figurine\nearly if its creature form drops to 0 Hit Points or if\nyou take a Magic action while touching the creature\nto make it revert to figurine form. When the creature becomes a figurine again, its property can’t\nbe used again until a certain amount of time has\npassed, as specified in the figurine’s description.\nBronze Griffon (Rare). This bronze statuette is of\na griffon rampant. It can become a Griffon for up to\n6 hours. Once it has been used, it can’t be used again\nuntil 5 days have passed.\nEbony Fly (Rare). This ebony statuette, carved in\nthe likeness of a horsefly, can become a Giant Fly\n(see the accompanying stat block) for up to 12 hours\nand can be ridden as a mount. Once it has been used,\nit can’t be used again until 2 days have passed.\nGiant Fly\nLarge Beast, Unaligned\nAC 11 Initiative +1 (11)\nHP 19 (3d10 + 3)\nSpeed 30 ft., Fly 60 ft.\nMOD SAVE MOD SAVE MOD SAVE\nStr 14 +2 +2 Dex 13 +1 +1 Con 13 +1 +1\nInt 2 −4 −4 WIS 10 +0 +0 Cha 3 −4 −4\nSenses Darkvision 60 ft., Passive Perception 10\nLanguages None\nCR 0 (XP 0; PB +2)\nGolden Lions (Rare). These gold statuettes of\nlions are always created in pairs. You can use one\nfigurine or both simultaneously. Each can become\na Lion for up to 1 hour. Once a lion has been used, it\ncan’t be used again until 7 days have passed.\nIvory Goats (Rare). These ivory statuettes of\ngoats are always created in sets of three. Each goat\nlooks unique and functions differently from the others. Their properties are as follows:\nGoat of Terror. This figurine can become a Giant\nGoat for up to 3 hours. The goat can’t attack, but\nyou can (harmlessly) remove its horns and use\nthem as weapons. One horn becomes a +1 Lance,\nand the other becomes a +2 Longsword. Removing\na horn requires a Magic action, and the weapons\ndisappear and the horns return when the goat\nreverts to figurine form. While you ride the goat,\nany Hostile creature that starts its turn within\na 30-foot Emanation originating from the goat\nmust succeed on a DC 15 Wisdom saving throw or\nhave the Frightened condition for 1 minute, until\nyou are no longer riding the goat, or until the goat\nreverts to figurine form. The Frightened creature\nrepeats the save at the end of each of its turns,\nending the effect on itself on a success. Once it\nsucceeds on the save, a creature is immune to\nthis effect for the next 24 hours. Once the figurine\nhas been used, it can’t be used again until 15 days\nhave passed.\nGoat of Traveling. This figurine can become a\nLarge goat with the same statistics as a Riding\nHorse. It has 24 charges, and each hour or portion thereof it spends in goat form costs 1 charge.\nWhile it has charges, you can use it as often as you\nwish. When it runs out of charges, it reverts to a\nfigurine and can’t be used again until 7 days have\npassed, when it regains all expended charges.\nGoat of Travail. This figurine can become a Giant\nGoat for up to 3 hours. Once it has been used, it\ncan’t be used again until 30 days have passed.\nMarble Elephant (Rare). This marble statuette\nresembles a trumpeting elephant. It can become an\nElephant for up to 24 hours. Once it has been used,\nit can’t be used again until 7 days have passed.\nObsidian Steed (Very Rare). This polished obsidian horse can become a Nightmare for up to 24\nhours. The nightmare fights only to defend itself.\nOnce it has been used, it can’t be used again until 5\ndays have passed.\nThe figurine has a 10 percent chance each time\nyou use it to ignore your orders, including a command to revert to figurine form. If you mount the\nnightmare while it is ignoring your orders, you\nand the nightmare are instantly transported to a\nrandom location on the plane of Hades, where the\nnightmare reverts to figurine form.\nOnyx Dog (Rare). This onyx statuette of a dog can\nbecome a Mastiff for up to 6 hours. The mastiff has\nan Intelligence of 8 and can speak Common. It also\nhas Blindsight with a range of 60 feet. Once it has\nbeen used, it can’t be used again until 7 days have\npassed.\nSerpentine Owl (Rare). This serpentine statuette\nof an owl can become a Giant Owl for up to 8 hours.\nThe owl can communicate telepathically with you at\nany range if you and it are on the same plane of existence. Once it has been used, it can’t be used again\nuntil 2 days have passed.\nSilver Raven (Uncommon). This silver statuette\nof a raven can become a Raven for up to 12 hours.\nOnce it has been used, it can’t be used again until 2\ndays have passed. While in raven form, the figurine\ngrants you the ability to cast Animal Messenger on it.",
    page: 221,
    endPage: 222,
    category: "wondrous",
    rarities: [],
    rarityVaries: true,
    attunement: false
  },
  {
    id: "srd521:flame-tongue",
    edition: "2024",
    name: "Flame Tongue",
    metadata: "Weapon (Any Melee Weapon), Rare (Requires Attunement)",
    rules:
      "While holding this magic weapon, you can take a\nBonus Action and use a command word to cause\nflames to engulf the damage-dealing part of the\nweapon. These flames shed Bright Light in a 40foot radius and Dim Light for an additional 40 feet.\nWhile the weapon is ablaze, it deals an extra 2d6\nFire damage on a hit. The flames last until you take\na Bonus Action to issue the command again or until\nyou drop, stow, or sheathe the weapon.",
    page: 223,
    endPage: 223,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:folding-boat",
    edition: "2024",
    name: "Folding Boat",
    metadata: "Wondrous Item, Rare",
    rules:
      "This object appears as a wooden box that measures\n12 inches long, 6 inches wide, and 6 inches deep.\nIt weighs 4 pounds and floats. It can be opened to\nstore items inside. This item also has three command words, each requiring a Magic action to use:\nFirst Command Word. The box unfolds into a\nRowboat.\nSecond Command Word. The box unfolds into a\nKeelboat.\nThird Command Word. The Folding Boat folds back\ninto a box if no creatures are aboard. Any objects\nin the vessel that can’t fit inside the box remain\noutside the box as it folds. Any objects in the vessel that can fit inside the box do so.\nWhen the box becomes a vessel, its weight becomes\nthat of a normal vessel its size, and anything that\nwas stored in the box remains in the boat.\nStatistics for the Rowboat and Keelboat appear\nin “Equipment.” If either vessel is reduced to 0 Hit\nPoints, the Folding Boat is destroyed.",
    page: 223,
    endPage: 223,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:frost-brand",
    edition: "2024",
    name: "Frost Brand",
    metadata:
      "Weapon (Glaive, Greatsword, Longsword, Rapier, Scimitar, or Shortsword), Very Rare (Requires Attunement)",
    rules:
      "When you hit with an attack roll using this magic\nweapon, the target takes an extra 1d6 Cold damage.\nIn addition, while you hold the weapon, you have\nResistance to Fire damage.\nIn freezing temperatures, the weapon sheds\nBright Light in a 10-foot radius and Dim Light for an\nadditional 10 feet.\nWhen you draw this weapon, you can extinguish\nall nonmagical flames within 30 feet of yourself.\nOnce used, this property can’t be used again for\n1 hour.",
    page: 223,
    endPage: 223,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:gauntlets-of-ogre-power",
    edition: "2024",
    name: "Gauntlets of Ogre Power",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "Your Strength is 19 while you wear these gauntlets.\nThey have no effect on you if your Strength is 19 or\nhigher without them.",
    page: 223,
    endPage: 223,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:gem-of-brightness",
    edition: "2024",
    name: "Gem of Brightness",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "This prism has 50 charges. While you are holding\nit, you can take a Magic action and use one of three\ncommand words to cause one of the following\neffects:\nFirst Command Word. The gem sheds Bright Light\nin a 30-foot radius and Dim Light for an additional\n30 feet. This effect doesn’t expend a charge. It\nlasts until you take a Bonus Action to repeat the\ncommand word or until you use another function\nof the gem.\nSecond Command Word. You expend 1 charge and\ncause the gem to fire a brilliant beam of light at\none creature you can see within 60 feet of yourself. The creature must succeed on a DC 15 Constitution saving throw or have the Blinded condition\nfor 1 minute. The creature repeats the save at the\nend of each of its turns, ending the effect on itself\non a success.\nThird Command Word. You expend 5 charges and\ncause the gem to flare with intense light in a 30foot Cone. Each creature in the Cone makes a saving throw as if struck by the beam created with\nthe second command word.\nWhen all of the gem’s charges are expended, the\ngem becomes a nonmagical jewel worth 50 GP.",
    page: 223,
    endPage: 223,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:gem-of-seeing",
    edition: "2024",
    name: "Gem of Seeing",
    metadata: "Wondrous Item, Rare (Requires Attunement)",
    rules:
      "This gem has 3 charges. As a Magic action, you can\nexpend 1 charge. For the next 10 minutes, you have\nTruesight out to 120 feet when you peer through the\ngem.\nThe gem regains 1d3 expended charges daily at\ndawn.",
    page: 223,
    endPage: 223,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:giant-slayer",
    edition: "2024",
    name: "Giant Slayer",
    metadata: "Weapon (Any Simple or Martial), Rare",
    rules:
      "You gain a +1 bonus to attack rolls and damage rolls\nmade with this magic weapon.\nWhen you hit a Giant with this weapon, the Giant\ntakes an extra 2d6 damage of the weapon’s type and\nmust succeed on a DC 15 Strength saving throw or\nhave the Prone condition.",
    page: 223,
    endPage: 223,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:glamoured-studded-leather",
    edition: "2024",
    name: "Glamoured Studded Leather",
    metadata: "Armor (Studded Leather Armor), Rare",
    rules:
      "While wearing this armor, you gain a +1 bonus to\nArmor Class. You can also take a Bonus Action to\ncause the armor to assume the appearance of a normal set of clothing or some other kind of armor. You\ndecide what it looks like—including color, style, and\naccessories—but the armor retains its normal bulk\nand weight. The illusory appearance lasts until you\nuse this property again or doff the armor.",
    page: 223,
    endPage: 224,
    category: "armor",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:gloves-of-missile-snaring",
    edition: "2024",
    name: "Gloves of Missile Snaring",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "If you’re hit by an attack roll made with a Ranged\nor Thrown weapon while wearing these gloves, you\ncan take a Reaction to reduce the damage by 1d10\nplus your Dexterity modifier if you have a free hand.\nIf you reduce the damage to 0, you can catch the ammunition or weapon if it is small enough for you to\nhold in that hand.",
    page: 224,
    endPage: 224,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:gloves-of-swimming-and-climbing",
    edition: "2024",
    name: "Gloves of Swimming and Climbing",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "While wearing these gloves, you have a Climb Speed\nand a Swim Speed equal to your Speed, and you gain\na +5 bonus to Strength (Athletics) checks made to\nclimb or swim.",
    page: 224,
    endPage: 224,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:gloves-of-thievery",
    edition: "2024",
    name: "Gloves of Thievery",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "These gloves are imperceptible while worn. While\nwearing them, you gain a +5 bonus to Dexterity\n(Sleight of Hand) checks.",
    page: 224,
    endPage: 224,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:goggles-of-night",
    edition: "2024",
    name: "Goggles of Night",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "While wearing these dark lenses, you have Darkvision out to 60 feet. If you already have Darkvision,\nwearing the goggles increases its range by 60 feet.",
    page: 224,
    endPage: 224,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:hammer-of-thunderbolts",
    edition: "2024",
    name: "Hammer of Thunderbolts",
    metadata: "Weapon (Maul or Warhammer), Legendary (Requires Attunement)",
    rules:
      "You gain a +1 bonus to attack rolls and damage rolls\nmade with this magic weapon.\nThe weapon has 5 charges. You can expend 1\ncharge and make a ranged attack with the weapon,\nhurling it as if it had the Thrown property with a\nnormal range of 20 feet and a long range of 60 feet.\nIf the attack hits, the weapon unleashes a thunderclap audible out to 300 feet. The target and every\ncreature within 30 feet of it other than you must\nsucceed on a DC 17 Constitution saving throw or\nhave the Stunned condition until the end of your\nnext turn. Immediately after hitting or missing, the\nweapon flies back to your hand. The weapon regains 1d4 + 1 expended charges daily at dawn.\nGiant’s Bane. While you are attuned to the\nweapon and wearing either a Belt of Giant Strength\nor Gauntlets of Ogre Power to which you are also attuned, you gain the following benefits:\nGiants’ Bane. When you roll a 20 on the d20 for an\nattack roll made with this weapon against a Giant,\nthe creature must succeed on a DC 17 Constitution saving throw or die.\nMight of Giants. The Strength score bestowed by\nyour Belt of Giant Strength or Gauntlets of Ogre\nPower increases by 4, to a maximum of 30.",
    page: 224,
    endPage: 224,
    category: "weapon",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:handy-haversack",
    edition: "2024",
    name: "Handy Haversack",
    metadata: "Wondrous Item, Rare",
    rules:
      "This backpack has a central pouch and two side\npouches, each of which is an extradimensional\nspace. Each side pouch can hold up to 200 pounds\nof material, not exceeding a volume of 25 cubic feet.\nThe central pouch can hold up to 500 pounds of material, not exceeding a volume of 64 cubic feet. The\nhaversack always weighs 5 pounds, regardless of its\ncontents.\nRetrieving an item from the haversack requires a\nUtilize action or a Bonus Action (your choice). When\nyou reach into the haversack for a specific item, the\nitem is always magically on top.\nIf any of its pouches is overloaded, pierced, or\ntorn, the haversack ruptures and is destroyed. If the\nhaversack is destroyed, its contents are lost forever,\nalthough an Artifact always turns up again somewhere. If the haversack is turned inside out, its contents spill forth unharmed, and the haversack must\nbe put right before it can be used again.\nEach pouch of the haversack holds enough air for\n10 minutes of breathing, divided by the number of\nbreathing creatures inside.\nPlacing the haversack inside an extradimensional\nspace created by a Bag of Holding, Portable Hole,\nor similar item instantly destroys both items and\nopens a gate to the Astral Plane. The gate originates\nwhere the one item was placed inside the other. Any\ncreature within 10 feet of the gate and not behind\nTotal Cover is sucked through it and deposited in\na random location on the Astral Plane. The gate\nthen closes. The gate is one-way only and can’t be\nreopened.",
    page: 224,
    endPage: 224,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:hat-of-disguise",
    edition: "2024",
    name: "Hat of Disguise",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules: "While wearing this hat, you can cast the Disguise\nSelf spell. The spell ends if the hat is removed.",
    page: 224,
    endPage: 224,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:hat-of-many-spells",
    edition: "2024",
    name: "Hat of Many Spells",
    metadata: "Wondrous Item, Very Rare (Requires Attunement by a Wizard)",
    rules:
      "This pointed hat has the following properties.\nSpellcasting Focus. While holding the hat, you\ncan use it as a Spellcasting Focus for your Wizard\nspells. Any spell you cast using the hat gains a special Somatic component: you must reach into the hat\nand “pull” the spell out of it.\nUnknown Spell. While holding the hat, you can\ntry to cast a level 1+ spell you don’t know. The spell\nmust be on the Wizard spell list, it must be of a level\nyou can cast, and it can’t have Material components\ncosting more than 1,000 GP. Once you decide on\nthe spell, you must expend a spell slot of the spell’s\nlevel. Then, to determine whether you cast the spell,\nmake an Intelligence (Arcana) check (DC 10 plus\nthe spell’s level). On a successful check, you cast the\nspell using its normal casting time, and you can’t\nuse this property again until you finish a Short or\nLong Rest. On a failed check, you fail to cast the\nspell and a random effect occurs instead, determined by rolling on the following table.\nAny spell you cast from the hat uses your spell\nsave DC and spell attack bonus.\n1d100 Effect\n01–50 You cast a random spell determined by rolling\n1d10: on a 1, Enlarge/Reduce (enlarge effect);\non a 2, Enlarge/Reduce (reduce effect); on a\n3, Faerie Fire; on a 4, Fireball; on a 5, Gust of\nWind; on a 6, Invisibility (cast on yourself); on a\n7, Lightning Bolt; on an 8, Phantasmal Force; on\na 9, Polymorph; on a 10, Stinking Cloud.\n51–55 You have the Stunned condition until the end\nof your next turn, believing something awesome just happened.\n56–60 A harmless swarm of butterflies fills a 10-foot\nCube within 30 feet of yourself. The swarm\ndisperses after 1 minute.\n61–65 You pull a nonmagical object out of the hat.\nRoll 1d4 to determine the object: on a 1, a vial\nof Acid; on a 2, a flask of Alchemist’s Fire; on a\n3, a Crowbar; on a 4, a lit Torch.\n66–70 You suffer a bout of “magic sickness” and have\nthe Poisoned condition for 1 hour.\n71–75 You have the Petrified condition until the end\nof your next turn.\n76–80 You pull a nonmagical object out of the hat.\nRoll 1d4 to determine the object: on a 1, a\nDagger; on a 2, a Rope with a Grappling Hook\ntied to one end; on a 3, a bag of Caltrops; on a\n4, a gem worth 50 GP.\n81–85 A creature appears in an unoccupied space\nas close to you as possible. The creature isn’t\nunder your control and acts as it normally\nwould, and it disappears after 1 hour or when\nit drops to 0 Hit Points. Roll 1d4 to determine the creature: on a 1, a Camel; on a 2, a\nConstrictor Snake; on a 3, an Elephant;\non a 4, a Mule.\n1d100 Effect\n86–90 A Hostile Swarm of Bats flies out of the\nhat, occupies your space, and attacks you.\n91–95 A vertical, 10-foot-diameter, two-way portal\nto another plane of existence opens in an\nunoccupied space within 30 feet of you and\nremains open until the end of your next turn.\nThe GM determines where it leads.\n96–00 You pull a magic item out of the hat. Roll\n1d6 to determine the item’s rarity: on a 1–3,\nCommon; on a 4–5, Uncommon; on a 6,\nRare. The GM chooses the item, which disappears after 1 hour if it’s not consumed or\ndestroyed before then.",
    page: 224,
    endPage: 225,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:headband-of-intellect",
    edition: "2024",
    name: "Headband of Intellect",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "Your Intelligence is 19 while you wear this headband. It has no effect on you if your Intelligence is\n19 or higher without it.",
    page: 225,
    endPage: 225,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:helm-of-brilliance",
    edition: "2024",
    name: "Helm of Brilliance",
    metadata: "Wondrous Item, Very Rare (Requires Attunement)",
    rules:
      "This helm is set with 1d10 diamonds, 2d10 rubies,\n3d10 fire opals, and 4d10 opals. Any gem pried from\nthe helm crumbles to dust. When all the gems are\nremoved or destroyed, the helm loses its magic.\nYou gain the following benefits while wearing the\nhelm.\nDiamond Light. As long as it has at least one\ndiamond, the helm emits a 30-foot Emanation.\nWhen at least one Undead is within that area, the\nEmanation is filled with Dim Light. Any Undead\nthat starts its turn in that area takes 1d6 Radiant\ndamage.\nFire Opal Flames. As long as the helm has at least\none fire opal, you can take a Magic action to cause\none weapon you are holding to burst into flames.\nThe flames emit Bright Light in a 10-foot radius and\nDim Light for an additional 10 feet. The flames are\nharmless to you and the weapon. When you hit with\nan attack using the blazing weapon, the target takes\nan extra 1d6 Fire damage. The flames last until you\ntake a Bonus Action to extinguish them or until you\ndrop or stow the weapon.\nRuby Resistance. As long as the helm has at least\none ruby, you have Resistance to Fire damage.\nSpells. You can cast one of the following spells\n(save DC 18), using one of the helm’s gems of the\nspecified type as a component: Daylight (opal), Fireball (fire opal), Prismatic Spray (diamond), or Wall of\nFire (ruby). The gem is destroyed when the spell is\ncast and disappears from the helm.\nTaking Fire Damage. Roll 1d20 if you are wearing\nthe helm and take Fire damage as a result of failing\na saving throw against a spell. On a roll of 1, the\nhelm emits beams of light from its remaining gems\nand is then destroyed. Each creature within a 60foot Emanation originating from you must succeed\non a DC 17 Dexterity saving throw or be struck by a\nbeam, taking Radiant damage equal to the number\nof gems in the helm.",
    page: 225,
    endPage: 226,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:helm-of-comprehending-languages",
    edition: "2024",
    name: "Helm of Comprehending Languages",
    metadata: "Wondrous Item, Uncommon",
    rules: "While wearing this helm, you can cast Comprehend\nLanguages from it.",
    page: 226,
    endPage: 226,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:helm-of-telepathy",
    edition: "2024",
    name: "Helm of Telepathy",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "While wearing this helm, you have telepathy with a\nrange of 30 feet, and you can cast Detect Thoughts\nor Suggestion (save DC 13) from the helm. Once either spell is cast from the helm, that spell can’t be\ncast from it again until the next dawn.",
    page: 226,
    endPage: 226,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:helm-of-teleportation",
    edition: "2024",
    name: "Helm of Teleportation",
    metadata: "Wondrous Item, Rare (Requires Attunement)",
    rules:
      "This helm has 3 charges. While wearing it, you can\nexpend 1 charge to cast Teleport from it. The helm\nregains 1d3 expended charges daily at dawn.",
    page: 226,
    endPage: 226,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:holy-avenger",
    edition: "2024",
    name: "Holy Avenger",
    metadata: "Weapon (Any Simple or Martial), Legendary (Requires Attunement by a Paladin)",
    rules:
      "You gain a +3 bonus to attack rolls and damage rolls\nmade with this magic weapon. When you hit a Fiend\nor an Undead with it, that creature takes an extra\n2d10 Radiant damage.\nWhile you hold the drawn weapon, it creates a\n10-foot Emanation originating from you. You and all\ncreatures Friendly to you in the Emanation have Advantage on saving throws against spells and other\nmagical effects. If you have 17 or more levels in the\nPaladin class, the size of the Emanation increases to\n30 feet.",
    page: 226,
    endPage: 226,
    category: "weapon",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:horn-of-blasting",
    edition: "2024",
    name: "Horn of Blasting",
    metadata: "Wondrous Item, Rare",
    rules:
      "You can take a Magic action to blow the horn, which\nemits a thunderous blast in a 30-foot Cone that is\naudible out to 600 feet. Each creature in the Cone\nmakes a DC 15 Constitution saving throw. On a\nfailed save, a creature takes 5d8 Thunder damage\nand has the Deafened condition for 1 minute. On a\nsuccessful save, a creature takes half as much damage only. Glass or crystal objects in the Cone that\naren’t being worn or carried take 10d8 Thunder\ndamage.\nEach use of the horn’s magic has a 20 percent\nchance of causing the horn to explode. The explosion deals 10d6 Force damage to the user and\ndestroys the horn.",
    page: 226,
    endPage: 226,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:horn-of-valhalla",
    edition: "2024",
    name: "Horn of Valhalla",
    metadata: "Wondrous Item, Rare (Silver or Brass), Very Rare (Bronze), or Legendary (Iron)",
    rules:
      "You can take a Magic action to blow this horn. In\nresponse, warrior spirits from the plane of Ysgard\nappear in unoccupied spaces within 60 feet of you.\nEach spirit uses the Berserker stat block and returns to Ysgard after 1 hour or when it drops to 0\nHit Points. The spirits look like living, breathing\nwarriors, and they have Immunity to the Charmed\nand Frightened conditions. Once you use the horn, it\ncan’t be used again until 7 days have passed.\nFour types of Horn of Valhalla are known to exist, each made of a different metal. The horn’s type\ndetermines how many spirits it summons, as well\nas the requirement for its use. The GM chooses the\nhorn’s type or determines it randomly by rolling on\nthe following table.\nIf you blow the horn without meeting its requirement, the summoned spirits attack you. If you meet\nthe requirement, they are Friendly to you and your\nallies and follow your commands.\n1d100 Horn Type Spirits Requirement\n01–40 Silver 2 None\n41–75 Brass 3 Proficiency with all\nSimple weapons\n76–90 Bronze 4 Training with all\nMedium armor\n91–00 Iron 5 Proficiency with all\nMartial weapons",
    page: 226,
    endPage: 226,
    category: "wondrous",
    rarities: ["rare", "veryRare", "legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:horseshoes-of-a-zephyr",
    edition: "2024",
    name: "Horseshoes of a Zephyr",
    metadata: "Wondrous Item, Very Rare",
    rules:
      "These horseshoes come in a set of four. As a Magic\naction, you can touch one of the horseshoes to the\nhoof of a horse or similar creature, whereupon the\nhorseshoe affixes itself to the hoof. Removing a\nhorseshoe also takes a Magic action.\nWhile all four shoes are affixed to the hooves of a\nhorse or similar creature, they allow the creature\nto move normally while floating 4 inches above a\nsurface. This effect means the creature can cross\nor stand above nonsolid or unstable surfaces, such\nas water or lava. The creature leaves no tracks and\nignores Difficult Terrain. In addition, the creature\ncan travel for up to 12 hours a day without gaining\nExhaustion levels from extended travel.",
    page: 226,
    endPage: 226,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:horseshoes-of-speed",
    edition: "2024",
    name: "Horseshoes of Speed",
    metadata: "Wondrous Item, Rare",
    rules:
      "These horseshoes come in a set of four. As a Magic\naction, you can touch one of the horseshoes to the\nhoof of a horse or similar creature, whereupon the\nhorseshoe affixes itself to the hoof. Removing a\nhorseshoe also takes a Magic action.\nWhile all four horseshoes are attached to the\nsame creature, its Speed is increased by 30 feet.",
    page: 227,
    endPage: 227,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:immovable-rod",
    edition: "2024",
    name: "Immovable Rod",
    metadata: "Rod, Uncommon",
    rules:
      "This iron rod has a button on one end. You can take\na Utilize action to press the button, which causes\nthe rod to become magically fixed in place. Until you\nor another creature takes a Utilize action to push\nthe button again, the rod doesn’t move, even if it\ndefies gravity. The rod can hold up to 8,000 pounds\nof weight. More weight causes the rod to deactivate\nand fall. A creature can take a Utilize action to make\na DC 30 Strength (Athletics) check, moving the fixed\nrod up to 10 feet on a successful check.",
    page: 227,
    endPage: 227,
    category: "rod",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:instant-fortress",
    edition: "2024",
    name: "Instant Fortress",
    metadata: "Wondrous Item, Rare (Requires Attunement)",
    rules:
      "As a Magic action, you can place this 1-inch\nadamantine statuette on the ground and, using\na command word, cause it to grow rapidly into a\nsquare adamantine tower. Repeating the command\nword causes the tower to revert to statuette form,\nwhich works only if the tower is empty. Each creature in the area where the tower appears is pushed\nto an unoccupied space outside but next to the\ntower. Objects in the area that aren’t being worn or\ncarried are also pushed clear of the tower.\nThe tower is 20 feet on a side and 30 feet high,\nwith arrow slits on all sides and a battlement atop\nit. Its interior is divided into two floors, with a ladder, staircase, or ramp (your choice) connecting\nthem. This ladder, staircase, or ramp ends at a trapdoor leading to the roof. When created, the tower\nhas a single door at ground level on the side facing\nyou. The door opens only at your command, which\nyou can issue as a Bonus Action. It is immune to the\nKnock spell and similar magic.\nMagic prevents the tower from being tipped over.\nThe roof, the door, and the walls each have AC 20;\nHP 100; Immunity to Bludgeoning, Piercing, and\nSlashing damage except that which is dealt by siege\nequipment; and Resistance to all other damage.\nShrinking the tower back down to statuette form\ndoesn’t repair damage to the tower. Only a Wish\nspell can repair the tower (this use of the spell\ncounts as replicating a spell of level 8 or lower).\nEach casting of Wish causes the tower to regain all\nits Hit Points.",
    page: 227,
    endPage: 227,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:ioun-stone",
    edition: "2024",
    name: "Ioun Stone",
    metadata: "Wondrous Item, Rarity Varies (Requires Attunement)",
    rules:
      "Roughly marble sized, Ioun Stones are named after\nIoun, a god of knowledge and prophecy revered on\nsome worlds. Many types of Ioun Stones exist, each\ntype a distinct combination of shape and color.\nWhen you take a Magic action to toss an Ioun\nStone into the air, the stone orbits your head at a\ndistance of 1d3 feet, conferring its benefit to you\nwhile doing so. You can have up to three Ioun Stones\norbiting your head at the same time.\nEach Ioun Stone orbiting your head is considered\nto be an object you are wearing. The orbiting stone\navoids contact with other creatures and objects, adjusting its orbit to avoid collisions and thwarting all\nattempts by other creatures to attack or snatch it.\nAs a Utilize action, you can seize and stow any\nnumber of Ioun Stones orbiting your head. If your\nAttunement to an Ioun Stone ends while it’s orbiting your head, the stone falls as though you had\ndropped it.\nThe type of stone determines its rarity and\neffects.\nAbsorption (Very Rare). While this pale lavender\nellipsoid orbits your head, you can take a Reaction\nto cancel a spell of level 4 or lower cast by a creature you can see. A canceled spell has no effect, and\nany resources used to cast it are wasted. Once the\nstone has canceled 20 levels of spells, it burns out,\nturns dull gray, and loses its magic.\nAgility (Very Rare). Your Dexterity increases by\n2, to a maximum of 20, while this deep-red sphere\norbits your head.\nAwareness (Rare). While this dark-blue rhomboid\norbits your head, you have Advantage on Initiative\nrolls and Wisdom (Perception) checks.\nFortitude (Very Rare). Your Constitution increases by 2, to a maximum of 20, while this pink\nrhomboid orbits your head.\nGreater Absorption (Legendary). While this marbled lavender and green ellipsoid orbits your head,\nyou can take a Reaction to cancel a spell of level 8\nor lower cast by a creature you can see. A canceled\nspell has no effect, and any resources used to cast\nit are wasted. Once the stone has canceled 20 levels of spells, it burns out, turns dull gray, and loses\nits magic.\nInsight (Very Rare). Your Wisdom increases by\n2, to a maximum of 20, while this incandescent blue\nsphere orbits your head.\nIntellect (Very Rare). Your Intelligence increases\nby 2, to a maximum of 20, while this marbled scarlet\nand blue sphere orbits your head.\nLeadership (Very Rare). Your Charisma increases\nby 2, to a maximum of 20, while this marbled pink\nand green sphere orbits your head.\nMastery (Legendary). Your Proficiency Bonus increases by 1 while this pale green prism orbits your\nhead.\nProtection (Rare). You gain a +1 bonus to Armor\nClass while this dusty-rose prism orbits your head.\nRegeneration (Legendary). You regain 15 Hit\nPoints at the end of each hour this pearly white\nspindle orbits your head if you have at least 1 Hit\nPoint.\nReserve (Rare). This vibrant purple prism stores\nspells cast into it, holding them until you use them.\nThe stone can store up to 4 levels of spells at a time.\nWhen found, it contains 1d4 levels of stored spells\nchosen by the GM.\nAny creature can cast a spell of level 1 through 4\ninto the stone by touching it as the spell is cast. The\nspell has no effect, other than to be stored in the\nstone. If the stone can’t hold the spell, the spell is\nexpended without effect. The level of the slot used\nto cast the spell determines how much space it uses.\nWhile this stone orbits your head, you can cast\nany spell stored in it. The spell uses the slot level,\nspell save DC, spell attack bonus, and spellcasting ability of the original caster but is otherwise\ntreated as if you cast the spell. The spell cast from\nthe stone is no longer stored in it, freeing up space.\nStrength (Very Rare). Your Strength increases by\n2, to a maximum of 20, while this pale blue rhomboid orbits your head.\nSustenance (Rare). You don’t need to eat or drink\nwhile this clear spindle orbits your head.",
    page: 227,
    endPage: 228,
    category: "wondrous",
    rarities: [],
    rarityVaries: true,
    attunement: true
  },
  {
    id: "srd521:iron-bands",
    edition: "2024",
    name: "Iron Bands",
    metadata: "Wondrous Item, Rare",
    rules:
      "This rusty iron sphere measures 3 inches in diameter and weighs 1 pound. You can take a Magic action\nto throw the sphere at a Huge or smaller creature\nyou can see within 60 feet of yourself. As the sphere\nmoves through the air, it opens into a tangle of\nmetal bands.\nMake a ranged attack roll with an attack bonus\nequal to your Dexterity modifier plus your Proficiency Bonus. On a hit, the target has the Restrained\ncondition until you take a Bonus Action to issue a\ncommand that releases it. Doing so or missing with\nthe attack causes the bands to contract and become\na sphere once more.\nA creature that can touch the bands, including the\none Restrained, can take an action to make a DC 20\nStrength (Athletics) check to break the iron bands.\nOn a successful check, the item is destroyed, and the\nRestrained creature is freed. On a failed check, any\nfurther attempts made by that creature automatically fail until 24 hours have elapsed.\nOnce the bands are used, they can’t be used again\nuntil the next dawn.",
    page: 228,
    endPage: 228,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:iron-flask",
    edition: "2024",
    name: "Iron Flask",
    metadata: "Wondrous Item, Legendary",
    rules:
      "While holding this brass-stoppered iron flask, you\ncan take a Magic action to target a creature that\nyou can see within 60 feet of yourself. If the flask\nis empty and the target is native to a plane of existence other than the one you’re on, the target must\nsucceed on a DC 17 Wisdom saving throw or be\ntrapped in the flask. If the target has been trapped\nby the flask before, it has Advantage on the save.\nOnce trapped, a creature remains in the flask until\nreleased. The flask can hold only one creature at a\ntime. A creature trapped in the flask doesn’t age and\ndoesn’t need to breathe, eat, or drink.\nYou can take a Magic action to remove the flask’s\nstopper and release the creature in the flask. The\ncreature then obeys your commands for 1 hour,\nunderstanding those commands even if it doesn’t\nknow the language in which the commands are\ngiven. If you issue no commands or give the creature a command that is likely to result in its death\nor imprisonment, it defends itself but otherwise\ntakes no actions. At the end of the duration, the\ncreature acts in accordance with its normal disposition and alignment.\nAn Identify spell reveals if the flask contains a\ncreature, but the only way to determine the type\nof creature is to open the flask. A newly discovered\nIron Flask might already contain a creature chosen\nby the GM.",
    page: 228,
    endPage: 228,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:javelin-of-lightning",
    edition: "2024",
    name: "Javelin of Lightning",
    metadata: "Weapon (Javelin), Uncommon",
    rules:
      "Each time you make an attack roll with this magic\nweapon and hit, you can have it deal Lightning damage instead of Piercing damage.\nLightning Bolt. When you throw this weapon at\na target no farther than 120 feet from you, you can\nforgo making a ranged attack roll and instead turn\nthe weapon into a bolt of lightning. This bolt forms\na 5-foot-wide Line between you and the target. The\ntarget and each other creature in the Line (excluding you) makes a DC 13 Dexterity saving throw, taking 4d6 Lightning damage on a failed save or half\nas much damage on a successful one. Immediately\nafter dealing this damage, the weapon reappears in\nyour hand. This property can’t be used again until\nthe next dawn.",
    page: 228,
    endPage: 228,
    category: "weapon",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:lantern-of-revealing",
    edition: "2024",
    name: "Lantern of Revealing",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "While lit, this hooded lantern burns for 6 hours on 1\npint of oil, shedding Bright Light in a 30-foot radius\nand Dim Light for an additional 30 feet. Invisible\ncreatures and objects are visible as long as they are\nin the lantern’s Bright Light. You can take a Utilize\naction to lower the hood, reducing the lantern’s light\nto Dim Light in a 5-foot radius.",
    page: 228,
    endPage: 229,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:luck-blade",
    edition: "2024",
    name: "Luck Blade",
    metadata:
      "Weapon (Glaive, Greatsword, Longsword, Rapier, Scimitar, Sickle, or Shortsword), Legendary (Requires Attunement)",
    rules:
      "You gain a +1 bonus to attack rolls and damage rolls\nmade with this magic weapon. While the weapon is\non your person, you also gain a +1 bonus to saving\nthrows.\nLuck. If the weapon is on your person, you can call\non its luck (no action required) to reroll one failed\nD20 Test if you don’t have the Incapacitated condition. You must use the second roll. Once used, this\nproperty can’t be used again until the next dawn.\nWish. The weapon has 1d3 charges. While holding\nit, you can expend 1 charge and cast Wish from it.\nOnce used, this property can’t be used again until\nthe next dawn. The weapon loses this property if it\nhas no charges.",
    page: 229,
    endPage: 229,
    category: "weapon",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:mace-of-disruption",
    edition: "2024",
    name: "Mace of Disruption",
    metadata: "Weapon (Mace), Rare (Requires Attunement)",
    rules:
      "When you hit a Fiend or an Undead with this magic\nweapon, that creature takes an extra 2d6 Radiant\ndamage. If the target has 25 Hit Points or fewer\nafter taking this damage, it must succeed on a DC\n15 Wisdom saving throw or be destroyed. On a successful save, the creature has the Frightened condition until the end of your next turn.\nLight. While you hold this weapon, it sheds Bright\nLight in a 20-foot radius and Dim Light for an additional 20 feet.",
    page: 229,
    endPage: 229,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:mace-of-smiting",
    edition: "2024",
    name: "Mace of Smiting",
    metadata: "Weapon (Mace), Rare",
    rules:
      "You gain a +1 bonus to attack rolls and damage\nrolls made with this magic weapon. The bonus increases to +3 when you use the weapon to attack a\nConstruct.\nWhen you roll a 20 on an attack roll made with\nthis weapon, the target takes an extra 7 Bludgeoning damage, or 14 Bludgeoning damage if it’s a\nConstruct. If a Construct has 25 Hit Points or fewer\nafter taking this damage, it is destroyed.",
    page: 229,
    endPage: 229,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:mace-of-terror",
    edition: "2024",
    name: "Mace of Terror",
    metadata: "Weapon (Mace), Rare (Requires Attunement)",
    rules:
      "This magic weapon has 3 charges and regains 1d3\nexpended charges daily at dawn. While holding\nthe weapon, you can take a Magic action and expend 1 charge to release a wave of terror from it.\nEach creature of your choice within 30 feet of you\nmust succeed on a DC 15 Wisdom saving throw or\nhave the Frightened condition for 1 minute. While\nFrightened in this way, a creature must spend its\nturns trying to move as far away from you as it can,\nand it can’t make Opportunity Attacks. For its action, it can use only the Dash action or try to escape\nfrom an effect that prevents it from moving. If it\nhas nowhere it can move, the creature can take the\nDodge action. At the end of each of its turns, a creature repeats the save, ending the effect on itself on\na success.",
    page: 229,
    endPage: 229,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:mantle-of-spell-resistance",
    edition: "2024",
    name: "Mantle of Spell Resistance",
    metadata: "Wondrous Item, Rare (Requires Attunement)",
    rules: "You have Advantage on saving throws against spells\nwhile you wear this cloak.",
    page: 229,
    endPage: 229,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:manual-of-bodily-health",
    edition: "2024",
    name: "Manual of Bodily Health",
    metadata: "Wondrous Item, Very Rare",
    rules:
      "This book contains health and nutrition tips, and\nits words are charged with magic. If you spend 48\nhours over a period of 6 days or fewer studying the\nbook’s contents and practicing its guidelines, your\nConstitution increases by 2, to a maximum of 30.\nThe manual then loses its magic but regains it in a\ncentury.",
    page: 229,
    endPage: 229,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:manual-of-gainful-exercise",
    edition: "2024",
    name: "Manual of Gainful Exercise",
    metadata: "Wondrous Item, Very Rare",
    rules:
      "This book describes fitness exercises, and its words\nare charged with magic. If you spend 48 hours over\na period of 6 days or fewer studying the book’s contents and practicing its guidelines, your Strength increases by 2, to a maximum of 30. The manual then\nloses its magic but regains it in a century.",
    page: 229,
    endPage: 229,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:manual-of-golems",
    edition: "2024",
    name: "Manual of Golems",
    metadata: "Wondrous Item, Very Rare",
    rules:
      "This tome contains information and incantations\nnecessary to make a particular type of golem. The\nGM chooses the type or determines it randomly by\nrolling on the accompanying table. To decipher and\nuse the manual, you must be a spellcaster with at\nleast two level 5 spell slots. A creature that can’t\nuse a Manual of Golems and attempts to read it takes\n6d6 Psychic damage.\nTo create a golem, you must spend the time shown\non the table, working without interruption with the\nmanual at hand and resting no more than 8 hours\nper day. You must also pay the specified cost to purchase supplies.\nOnce you finish creating the golem, the book is\nconsumed in eldritch flames. The golem becomes\nanimate when the ashes of the manual are sprinkled\non it. See “Monsters” for the golem’s stat block. The\ngolem is under your control, and it understands and\nobeys your commands.\n1d20 Golem Time Cost\n1–5 Clay Golem 30 days 65,000 GP\n6–17 Flesh Golem 60 days 50,000 GP\n18 Iron Golem 120 days 100,000 GP\n19–20 Stone Golem 90 days 80,000 GP",
    page: 229,
    endPage: 230,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:manual-of-quickness-of-action",
    edition: "2024",
    name: "Manual of Quickness of Action",
    metadata: "Wondrous Item, Very Rare",
    rules:
      "This book contains coordination and balance exercises, and its words are charged with magic.\nIf you spend 48 hours over a period of 6 days or\nfewer studying the book’s contents and practicing\nits guidelines, your Dexterity increases by 2, to a\nmaximum of 30. The manual then loses its magic\nbut regains it in a century.",
    page: 230,
    endPage: 230,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:marvelous-pigments",
    edition: "2024",
    name: "Marvelous Pigments",
    metadata: "Wondrous Item, Very Rare",
    rules:
      "This fine wooden box contains 1d4 pots of pigment\nand a brush (weighing 1 pound in total).\nUsing the brush and expending 1 pot of pigment,\nyou can paint any number of three-dimensional\nobjects and terrain features (such as walls, doors,\ntrees, flowers, weapons, webs, and pits), provided\nthese elements are all confined to a 20-foot Cube.\nThe effort takes 10 minutes (regardless of the number of elements you create), during which time you\nmust remain in the Cube, and requires Concentration. If your Concentration is broken or you leave\nthe Cube before the work is done, all the painted\nelements vanish, and the pot of pigment is wasted.\nWhen the work is done, all the painted objects\nand terrain features become real. Thus, painting a\ndoor on a wall creates an actual door, which can be\nopened to whatever is beyond. Painting a pit creates\na real pit, the entire depth of which must lie within\nthe 20-foot Cube.\nNo object created by a pot of pigment can have a\nvalue greater than 25 GP, and the total value of all\nobjects created by a pot of pigment can’t exceed 500\nGP. If you paint objects of greater value (such as a\nlarge pile of gold), they look authentic, but close inspection reveals they’re made from paste, cookies,\nor some other worthless material.\nIf you paint a form of energy such as fire or lightning, the energy dissipates as soon as you complete\nthe painting, doing no harm.",
    page: 230,
    endPage: 230,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:medallion-of-thoughts",
    edition: "2024",
    name: "Medallion of Thoughts",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "The medallion has 5 charges. While wearing it, you\ncan expend 1 charge to cast Detect Thoughts (save\nDC 13) from it. The medallion regains 1d4 expended\ncharges daily at dawn.",
    page: 230,
    endPage: 230,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:mirror-of-life-trapping",
    edition: "2024",
    name: "Mirror of Life Trapping",
    metadata: "Wondrous Item, Very Rare",
    rules:
      "When this 4-foot-tall, 2-foot-wide mirror is viewed\nindirectly, its surface shows faint images of creatures. The mirror weighs 50 pounds, and it has AC\n11, HP 10, Immunity to Poison and Psychic damage,\nand Vulnerability to Bludgeoning damage. It shatters and is destroyed when reduced to 0 Hit Points.\nIf the mirror is hanging on a vertical surface and\nyou are within 5 feet of it, you can take a Magic\naction and use a command word to activate it. It\nremains activated until you take a Magic action and\nrepeat the command word to deactivate it.\nAny creature other than you that sees its reflection in the activated mirror while within 30 feet\nof the mirror must succeed on a DC 15 Charisma\nsaving throw or be trapped, along with anything it\nis wearing or carrying, in one of the mirror’s twelve\nextradimensional cells. A creature that knows the\nmirror’s nature makes the save with Advantage,\nand Constructs succeed on the save automatically.\nAn extradimensional cell is an infinite expanse\nfilled with thick fog that reduces visibility to 10\nfeet. Creatures trapped in the mirror’s cells don’t\nage, and they don’t need to eat, drink, or sleep. A\ncreature trapped within a cell can escape using\nmagic that permits planar travel. Otherwise, the\ncreature is confined to the cell until freed.\nIf the mirror traps a creature but its twelve extradimensional cells are already occupied, the mirror frees one trapped creature at random to accommodate the new prisoner. A freed creature appears\nin an unoccupied space within sight of the mirror\nbut facing away from it. If the mirror is shattered,\nall creatures it contains are freed and appear in unoccupied spaces near it.\nWhile within 5 feet of the mirror, you can take a\nMagic action to name one creature trapped in it or\ncall out a particular cell by number. The creature\nnamed or contained in the named cell appears as an\nimage on the mirror’s surface. You and the creature\ncan then communicate.\nIn a similar way, you can take a Magic action and\nuse a second command word to free one creature\ntrapped in the mirror. The freed creature appears,\nalong with its possessions, in the unoccupied space\nnearest to the mirror and facing away from it.\nPlacing the mirror inside an extradimensional\nspace created by a Bag of Holding, Portable Hole,\nor similar item instantly destroys both items and\nopens a gate to the Astral Plane. The gate originates\nwhere the one item was placed inside the other. Any\ncreature within 10 feet of the gate and not behind\nTotal Cover is sucked through it to a random location on the Astral Plane. The gate then closes. The\ngate is one-way only and can’t be reopened.",
    page: 230,
    endPage: 230,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:mithral-armor",
    edition: "2024",
    name: "Mithral Armor",
    metadata: "Armor (Any Medium or Heavy, Except Hide Armor), Uncommon",
    rules:
      "Mithral is a light, flexible metal. Armor made of this\nsubstance can be worn under normal clothes. If the\narmor normally imposes Disadvantage on Dexterity\n(Stealth) checks or has a Strength requirement, the\nmithral version of the armor doesn’t.",
    page: 231,
    endPage: 231,
    category: "armor",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:mysterious-deck",
    edition: "2024",
    name: "Mysterious Deck",
    metadata: "Wondrous Item, Legendary",
    rules:
      "Usually found in a box or pouch, this deck contains\na number of cards made of ivory or vellum. Most\n(75 percent) of these decks have thirteen cards, but\nsome have twenty-two. Use the appropriate column\nof the Mysterious Deck table when randomly determining cards drawn from the deck.\nBefore you draw a card, you must declare how\nmany cards you intend to draw and then draw them\nrandomly. Any cards drawn in excess of this number have no effect. Otherwise, as soon as you draw a\ncard from the deck, its magic takes effect. You must\ndraw each card no more than 1 hour after the previous draw. If you fail to draw the chosen number,\nthe remaining number of cards fly from the deck on\ntheir own and take effect all at once.\nOnce a card is drawn, it disappears. Unless the\ncard is the Fool or Jester, the card reappears in the\ndeck, making it possible to draw the same card\ntwice. (Once the Fool or Jester has left the deck, reroll on the table if that card comes up again.)\nMysterious Deck\n1d100 1d100\n(13-Card (22-Card Card\nDeck) Deck)\n— 01–05 Balance\n— 06–10 Comet\n— 11–14 Donjon\n01–08 15–18 Euryale\n— 19–23 Fates\n09–16 24–27 Flames\n— 28–31 Fool\n— 32–36 Gem\n17–24 37–41 Jester\n25–32 42–46 Key\n33–40 47–51 Knight\n41–48 52–56 Moon\n— 57–60 Puzzle\n49–56 61–64 Rogue\n57–64 65–68 Ruin\n— 69–73 Sage\n1d100 1d100\n(13-Card (22-Card Card\nDeck) Deck)\n65–72 74–77 Skull\n73–80 78–82 Star\n81–88 83–87 Sun\n— 88–91 Talons\n89–96 92–96 Throne\n97–00 97–00 Void\nEach card’s effect is described below.\nBalance. You can increase one of your ability\nscores by 2, to a maximum of 22, provided you also\ndecrease another one of your ability scores by 2.\nYou can’t decrease an ability that has a score of 5\nor lower. Alternatively, you can choose not to adjust your ability scores, in which case this card has\nno effect.\nComet. The next time you enter combat against\none or more Hostile creatures, you can select one\nof them as your foe when you roll Initiative. If you\nreduce your foe to 0 Hit Points during that combat,\nyou have Advantage on Death Saving Throws for 1\nyear. If someone else reduces your chosen foe to 0\nHit Points or you don’t choose a foe, this card has no\neffect.\nDonjon. You disappear and become entombed\nin a state of suspended animation in an extradimensional sphere. Everything you’re wearing and\ncarrying disappears with you except for Artifacts,\nwhich stay behind in the space you occupied when\nyou disappeared. You remain imprisoned until you\nare found and removed from the sphere. You can’t\nbe located by any Divination magic, but a Wish spell\ncan reveal the location of your prison. You draw no\nmore cards.\nEuryale. The card’s medusa-like visage curses\nyou. You take a −2 penalty to saving throws while\ncursed in this way. Only a god or the magic of the\nFates card can end this curse.\nFates. Reality’s fabric unravels and spins anew, allowing you to avoid or erase one event as if it never\nhappened. You can use the card’s magic as soon\nas you draw the card or at any other time before\nyou die.\nFlames. A powerful devil becomes your enemy.\nThe devil seeks your ruin and torments you, savoring your suffering before attempting to slay you.\nThis enmity lasts until either you or the devil dies.\nFool. You have Disadvantage on D20 Tests for the\nnext 72 hours. Draw another card; this draw doesn’t\ncount as one of your declared draws.\nGem. Twenty-five pieces of jewelry worth 2,000\nGP each or fifty gems worth 1,000 GP each appear at\nyour feet.\nJester. You have Advantage on D20 Tests for the\nnext 72 hours, or you can draw two additional cards\nbeyond your declared draws.\nKey. A Rare or rarer magic weapon with which\nyou are proficient appears on your person. The GM\nchooses the weapon.\nKnight. You gain the service of a Knight, who\nmagically appears in an unoccupied space you\nchoose within 30 feet of yourself. The knight has the\nsame alignment as you and serves you loyally until\ndeath, believing the two of you have been drawn together by fate. Work with your GM to create a name\nand backstory for this NPC. The GM can use a different stat block to represent the knight, as desired.\nMoon. You gain the ability to cast Wish 1d3 times.\nPuzzle. Permanently reduce your Intelligence or\nWisdom by 1d4 + 1 (to a minimum score of 1). You\ncan draw one additional card beyond your declared\ndraws.\nRogue. An NPC of the GM’s choice becomes Hostile\ntoward you. You don’t know the identity of this NPC\nuntil they or someone else reveals it. Nothing less\nthan a Wish spell or divine intervention can end the\nNPC’s hostility toward you.\nRuin. All forms of wealth that you carry or own,\nother than magic items, are lost to you. Portable\nproperty vanishes. Businesses, buildings, and land\nyou own are lost in a way that alters reality the\nleast. Any documentation that proves you should\nown something lost to this card also disappears.\nSage. At any time you choose within one year of\ndrawing this card, you can ask a question in meditation and mentally receive a truthful answer to that\nquestion.\nSkull. An Avatar of Death (see the accompanying\nstat block) appears in an unoccupied space as close\nto you as possible. The avatar targets only you with\nits attacks, appearing as a ghostly skeleton clad in a\ntattered black robe and carrying a spectral scythe.\nThe avatar disappears when it drops to 0 Hit Points\nor you die. If an ally of yours deals damage to the\navatar, that ally summons another Avatar of Death.\nThe new avatar appears in an unoccupied space as\nclose to that ally as possible and targets only that\nally with its attacks. You and your allies can each\nsummon only one avatar as a consequence of this\ndraw. A creature slain by an avatar can’t be restored\nto life.\nStar. Increase one of your ability scores by 2, to a\nmaximum of 24.\nSun. A magic item (chosen by the GM) appears on\nyour person. In addition, you gain 10 Temporary Hit\nPoints daily at dawn until you die.\nTalons. Every magic item you wear or carry\ndisintegrates. Artifacts in your possession vanish\ninstead.\nThrone. You gain proficiency and Expertise in\nyour choice of History, Insight, Intimidation, or Persuasion. In addition, you gain rightful ownership of\na small keep somewhere in the world. However, the\nkeep is currently home to one or more monsters,\nwhich must be cleared out before you can claim the\nkeep as yours.\nVoid. Your soul is drawn from your body and\ncontained in an object in a place of the GM’s choice.\nOne or more powerful beings guard the place. While\nyour soul is trapped in this way, your body is inert,\nceases aging, and requires no food, air, or water. A\nWish spell can’t return your soul to your body, but\nthe spell reveals the location of the object that holds\nyour soul. You draw no more cards.\nAvatar of Death\nMedium Undead, Neutral evil\nAC 20 Initiative +3 (13)\nHP Half the HP maximum of its summoner\nSpeed 60 ft., Fly 60 ft. (hover)\nMOD SAVE MOD SAVE MOD SAVE\nStr 16 +3 +3 Dex 16 +3 +3 Con 16 +3 +3\nInt 16 +3 +3 WIS 16 +3 +3 Cha 16 +3 +3\nImmunities Necrotic, Poison; Charmed, Exhaustion,\nFrightened, Paralyzed, Petrified, Poisoned, Unconscious\nSenses Truesight 60 ft., Passive Perception 13\nLanguages All languages known to its summoner\nCR None (XP 0; PB equals its summoner’s)\nTraits\nIncorporeal Movement. The avatar can move through\nother creatures and objects as if they were Difficult\nTerrain. It takes 5 (1d10) Force damage if it ends its turn\ninside an object.\nActions\nMultiattack. The avatar makes a number of Reaping\nScythe attacks equal to half the summoner’s Proficiency\nBonus (rounded up).\nReaping Scythe. Melee Attack Roll: Automatic hit,\nreach 5 ft. Hit: 7 (1d8 + 3) Slashing damage plus 4 (1d8)\nNecrotic damage.",
    page: 231,
    endPage: 232,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:necklace-of-adaptation",
    edition: "2024",
    name: "Necklace of Adaptation",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "While wearing this necklace, you can breathe normally in any environment, and you have Advantage\non saving throws made to avoid or end the Poisoned\ncondition.",
    page: 232,
    endPage: 232,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:necklace-of-fireballs",
    edition: "2024",
    name: "Necklace of Fireballs",
    metadata: "Wondrous Item, Rare",
    rules:
      "This necklace has 1d6 + 3 beads hanging from it.\nYou can take a Magic action to detach a bead and\nthrow it up to 60 feet away. When it reaches the end\nof its trajectory, the bead detonates as a level 3 Fireball (save DC 15).\nYou can hurl multiple beads, or even the whole\nnecklace, at one time. When you do so, increase the\ndamage of the Fireball by 1d6 for each bead after\nthe first (maximum 12d6).",
    page: 233,
    endPage: 233,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:necklace-of-prayer-beads",
    edition: "2024",
    name: "Necklace of Prayer Beads",
    metadata: "Wondrous Item, Rare (Requires Attunement by a Cleric, Druid, or Paladin)",
    rules:
      "This necklace has 1d4 + 2 magic beads made from\naquamarine, black pearl, or topaz. It also has many\nnonmagical beads made from stones such as amber,\nbloodstone, citrine, coral, jade, pearl, or quartz. If a\nmagic bead is removed from the necklace, that bead\nloses its magic.\nSix types of magic beads exist. The GM decides the\ntype of each bead on the necklace or determines it\nrandomly by rolling on the table below. A necklace\ncan have more than one bead of the same type. To\nuse one, you must be wearing the necklace. Each\nbead contains a spell that you can cast from it as a\nBonus Action (using your spell save DC if a save is\nnecessary). Once a magic bead’s spell is cast, that\nbead can’t be used again until the next dawn.\n1d20 Bead Spell\n1–6 Bead of Blessing Bless\n7–12 Bead of Curing Cure Wounds (level 2\nversion)\n13–16 Bead of Favor Greater Restoration\n17–18 Bead of Smiting Shining Smite\n19 Bead of Summons Guardian of Faith\n20 Bead of Wind Wind Walk\nWalking",
    page: 233,
    endPage: 233,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:nine-lives-stealer",
    edition: "2024",
    name: "Nine Lives Stealer",
    metadata: "Weapon (Any Simple or Martial), Very Rare (Requires Attunement)",
    rules:
      "You gain a +2 bonus to attack rolls and damage rolls\nmade with this magic weapon.\nLife Stealing. The weapon has 1d8 + 1 charges.\nWhen you attack a creature that has fewer than\n100 Hit Points with this weapon and roll a 20 on the\nd20 for the attack roll, the creature must succeed\non a DC 15 Constitution saving throw or be slain\ninstantly as the sword tears its life force from its\nbody. Constructs and Undead succeed on the save\nautomatically. The weapon loses 1 charge if the\ncreature is slain. When the weapon has no charges\nremaining, it loses this property.",
    page: 233,
    endPage: 233,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:oathbow",
    edition: "2024",
    name: "Oathbow",
    metadata: "Weapon (Longbow or Shortbow), Very Rare (Requires Attunement)",
    rules:
      "When you nock an arrow on this bow, it whispers in\nElvish, “Swift defeat to my enemies.” When you use\nthis weapon to make a ranged attack, you can utter\nor sign the following command words: “Swift death\nto you who have wronged me.” The target of your\nattack becomes your sworn enemy until it dies or\nuntil dawn 7 days later. You can have only one such\nsworn enemy at a time. When your sworn enemy\ndies, you can choose a new one after the next dawn.\nWhen you make a ranged attack roll with this\nweapon against your sworn enemy, you have Advantage on the roll. In addition, your target gains no\nbenefit from Half Cover or Three-Quarters Cover,\nand you suffer no Disadvantage due to long range.\nIf the attack hits, your sworn enemy takes an extra\n3d6 Piercing damage.\nWhile your sworn enemy lives, you have Disadvantage on attack rolls with all other weapons.",
    page: 233,
    endPage: 233,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:oil-of-etherealness",
    edition: "2024",
    name: "Oil of Etherealness",
    metadata: "Potion, Rare",
    rules:
      "One vial of this oil can cover one Medium or smaller\ncreature, along with the equipment it’s wearing and\ncarrying (one additional vial is required for each\nsize category above Medium). Applying the oil takes\n10 minutes. The affected creature then gains the\neffect of the Etherealness spell for 1 hour.\nBeads of this cloudy, gray oil form on the outside\nof its container and quickly evaporate.",
    page: 233,
    endPage: 233,
    category: "potion",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:oil-of-sharpness",
    edition: "2024",
    name: "Oil of Sharpness",
    metadata: "Potion, Very Rare",
    rules:
      "One vial of this oil can coat one Melee weapon or\ntwenty pieces of ammunition, but only ammunition\nand Melee weapons that are nonmagical and deal\nSlashing or Piercing damage are affected. Applying\nthe oil takes 1 minute, after which the oil magically\nseeps into whatever it coats, turning the coated\nweapon into a +3 Weapon or the coated ammunition\ninto +3 Ammunition.\nThis clear, gelatinous oil sparkles with tiny,\nultrathin silver shards.",
    page: 233,
    endPage: 233,
    category: "potion",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:oil-of-slipperiness",
    edition: "2024",
    name: "Oil of Slipperiness",
    metadata: "Potion, Uncommon",
    rules:
      "One vial of this oil can cover one Medium or smaller\ncreature, along with the equipment it’s wearing and\ncarrying (one additional vial is required for each\nsize category above Medium). Applying the oil takes\n10 minutes. The affected creature then gains the effect of the Freedom of Movement spell for 8 hours.\nAlternatively, the oil can be poured on the ground\nas a Magic action, where it covers a 10-foot square,\nduplicating the effect of the Grease spell in that area\nfor 8 hours.\nThis sticky, black unguent is thick and heavy, but\nit flows quickly when poured.",
    page: 233,
    endPage: 234,
    category: "potion",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:pearl-of-power",
    edition: "2024",
    name: "Pearl of Power",
    metadata: "Wondrous Item, Uncommon (Requires Attunement by a Spellcaster)",
    rules:
      "While this pearl is on your person, you can take a\nMagic action to regain one expended spell slot of\nlevel 3 or lower. Once you use the pearl, it can’t be\nused again until the next dawn.",
    page: 234,
    endPage: 234,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:periapt-of-health",
    edition: "2024",
    name: "Periapt of Health",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "While wearing this pendant, you can take a Magic\naction to regain 2d4 + 2 Hit Points. Once used, this\nproperty can’t be used again until the next dawn.\nIn addition, you have Advantage on saving throws\nto avoid or end the Poisoned condition while you\nwear this pendant.",
    page: 234,
    endPage: 234,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:periapt-of-proof-against-poison",
    edition: "2024",
    name: "Periapt of Proof against Poison",
    metadata: "Wondrous Item, Rare (Requires Attunement)",
    rules:
      "This delicate silver chain has a brilliant-cut black\ngem pendant. While you wear it, you have Immunity\nto the Poisoned condition and Poison damage.",
    page: 234,
    endPage: 234,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:periapt-of-wound-closure",
    edition: "2024",
    name: "Periapt of Wound Closure",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "While wearing this pendant, you gain the following\nbenefits.\nLife Preservation. Whenever you make a Death\nSaving Throw, you can change a roll of 9 or lower to\na 10, turning a failed save into a successful one.\nNatural Healing Boost. Whenever you roll a Hit\nPoint Die to regain Hit Points, double the number of\nHit Points it restores.",
    page: 234,
    endPage: 234,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:philter-of-love",
    edition: "2024",
    name: "Philter of Love",
    metadata: "Potion, Uncommon",
    rules:
      "The next time you see a creature within 10 minutes\nafter drinking this philter, you are charmed by that\ncreature and have the Charmed condition for 1\nhour.\nThis rose-hued, effervescent liquid contains one\neasy-to-miss bubble shaped like a heart.",
    page: 234,
    endPage: 234,
    category: "potion",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:pipes-of-haunting",
    edition: "2024",
    name: "Pipes of Haunting",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "These pipes have 3 charges and regain 1d3 expended charges daily at dawn. You can take a Magic\naction to play them and expend 1 charge to create\nan eerie, spellbinding tune. Each creature of your\nchoice within 30 feet of you must succeed on a DC\n15 Wisdom saving throw or have the Frightened\ncondition for 1 minute. A creature that fails the save\nrepeats it at the end of each of its turns, ending the\neffect on itself on a success. A creature that succeeds on its save is immune to the effect of these\npipes for 24 hours.",
    page: 234,
    endPage: 234,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:pipes-of-the-sewers",
    edition: "2024",
    name: "Pipes of the Sewers",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "While these pipes are on your person, ordinary rats\nand giant rats are Indifferent toward you and won’t\nattack you unless you threaten or harm them.\nThe pipes have 3 charges and regain 1d3 expended charges daily at dawn. If you play the pipes\nas a Magic action, you can take a Bonus Action to\nexpend 1 to 3 charges, calling forth one Swarm\nof Rats with each expended charge if enough rats\nare within half a mile of you to be called in this\nfashion (as determined by the GM). If there aren’t\nenough rats to form a swarm, the charge is wasted.\nCalled swarms move toward the music by the shortest available route but aren’t under your control\notherwise.\nWhenever a Swarm of Rats that isn’t under another creature’s control comes within 30 feet of you\nwhile you are playing the pipes, the swarm makes\na DC 15 Wisdom saving throw. On a successful\nsave, the swarm behaves as it normally would and\ncan’t be swayed by the pipes’ music for the next 24\nhours. On a failed save, the swarm is swayed by the\npipes’ music and becomes Friendly to you and your\nallies for as long as you continue to play the pipes\neach round as a Magic action. A Friendly swarm\nobeys your commands. If you issue no commands\nto a Friendly swarm, it defends itself but otherwise\ntakes no actions. If a Friendly swarm starts its turn\nmore than 30 feet away from you, your control over\nthat swarm ends, and the swarm behaves as it normally would and can’t be swayed by the pipes’ music for the next 24 hours.",
    page: 234,
    endPage: 234,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:plate-armor-of-etherealness",
    edition: "2024",
    name: "Plate Armor of Etherealness",
    metadata: "Armor (Half Plate Armor or Plate Armor), Legendary (Requires Attunement)",
    rules:
      "While you’re wearing this armor, you can take a\nMagic action and use a command word to gain the\neffect of the Etherealness spell. The spell ends immediately if you remove the armor or take a Magic action to repeat the command word. This property of\nthe armor can’t be used again until the next dawn.",
    page: 234,
    endPage: 234,
    category: "armor",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:portable-hole",
    edition: "2024",
    name: "Portable Hole",
    metadata: "Wondrous Item, Rare",
    rules:
      "This fine black cloth, soft as silk, is folded up to the\ndimensions of a handkerchief. It unfolds into a circular sheet 6 feet in diameter.\nYou can take a Magic action to unfold a Portable Hole and place it on or against a solid surface, whereupon the Portable Hole creates an\nextradimensional hole 10 feet deep. The cylindrical\nspace within the hole exists on a different plane\nof existence, so it can’t be used to create open passages. Any creature inside an open Portable Hole\ncan exit the hole by climbing out of it.\nYou can take a Magic action to close a Portable\nHole by taking hold of the edges of the cloth and\nfolding it up. Folding the cloth closes the hole, and\nany creatures or objects within remain in the extradimensional space. No matter what’s in it, the\nhole weighs next to nothing.\nIf the hole is folded up, a creature within the hole’s\nextradimensional space can take an action to make\na DC 10 Strength (Athletics) check. On a successful\ncheck, the creature forces its way out and appears\nwithin 5 feet of the Portable Hole. A closed Portable\nHole holds enough air for 1 hour of breathing, divided by the number of breathing creatures inside.\nPlacing a Portable Hole inside an extradimensional\nspace created by a Bag of Holding, Handy Haversack,\nor similar item instantly destroys both items and\nopens a gate to the Astral Plane. The gate originates\nwhere the one item was placed inside the other. Any\ncreature within 10 feet of the gate and not behind\nTotal Cover is sucked through it and deposited in\na random location on the Astral Plane. The gate\nthen closes. The gate is one-way only and can’t be\nreopened.",
    page: 234,
    endPage: 235,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:potion-of-animal-friendship",
    edition: "2024",
    name: "Potion of Animal Friendship",
    metadata: "Potion, Uncommon",
    rules:
      "When you drink this potion, you can cast the level\n3 version of the Animal Friendship spell (save DC 13).\nAgitating this potion’s muddy liquid brings little\nbits into view: a fish scale, a hummingbird feather, a\ncat claw, or a squirrel hair.",
    page: 235,
    endPage: 235,
    category: "potion",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:potion-of-clairvoyance",
    edition: "2024",
    name: "Potion of Clairvoyance",
    metadata: "Potion, Rare",
    rules:
      "When you drink this potion, you gain the effect of\nthe Clairvoyance spell (no Concentration required).\nAn eyeball bobs in this potion’s yellowish liquid\nbut vanishes when the potion is opened.",
    page: 235,
    endPage: 235,
    category: "potion",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:potion-of-climbing",
    edition: "2024",
    name: "Potion of Climbing",
    metadata: "Potion, Common",
    rules:
      "When you drink this potion, you gain a Climb Speed\nequal to your Speed for 1 hour. During this time, you\nhave Advantage on Strength (Athletics) checks to\nclimb.\nThis potion is separated into brown, silver, and\ngray layers resembling bands of stone. Shaking the\nbottle fails to mix the colors.",
    page: 235,
    endPage: 235,
    category: "potion",
    rarities: ["common"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:potion-of-diminution",
    edition: "2024",
    name: "Potion of Diminution",
    metadata: "Potion, Rare",
    rules:
      "When you drink this potion, you gain the “reduce”\neffect of the Enlarge/Reduce spell for 1d4 hours (no\nConcentration required).\nThe red in the potion’s liquid continuously contracts to a tiny bead and then expands to color the\nclear liquid around it. Shaking the bottle fails to interrupt this process.",
    page: 235,
    endPage: 235,
    category: "potion",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:potion-of-flying",
    edition: "2024",
    name: "Potion of Flying",
    metadata: "Potion, Very Rare",
    rules:
      "When you drink this potion, you gain a Fly Speed\nequal to your Speed for 1 hour and can hover. If\nyou’re in the air when the potion wears off, you fall\nunless you have some other means of staying aloft.\nThis potion’s clear liquid floats at the top of its\ncontainer and has cloudy white impurities drifting\nin it.",
    page: 235,
    endPage: 235,
    category: "potion",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:potion-of-gaseous-form",
    edition: "2024",
    name: "Potion of Gaseous Form",
    metadata: "Potion, Rare",
    rules:
      "When you drink this potion, you gain the effect of\nthe Gaseous Form spell for 1 hour (no Concentration\nrequired) or until you end the effect as a Bonus\nAction.\nThis potion’s container seems to hold fog that\nmoves and pours like water.",
    page: 235,
    endPage: 235,
    category: "potion",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:potion-of-giant-strength",
    edition: "2024",
    name: "Potion of Giant Strength",
    metadata: "Potion, Rarity Varies",
    rules:
      "When you drink this potion, your Strength score\nchanges for 1 hour. The type of giant determines the\nscore (see the table below). The potion has no effect\non you if your Strength is equal to or greater than\nthat score.\nThis potion’s transparent liquid has floating in it a\nsliver of light resembling a giant’s fingernail.\nPotion Str. Rarity\nPotion of Giant Strength (hill) 21 Uncommon\nPotion of Giant Strength (frost or 23 Rare\nstone)\nPotion of Giant Strength (fire) 25 Rare\nPotion of Giant Strength (cloud) 27 Very Rare\nPotion of Giant Strength (storm) 29 Legendary",
    page: 235,
    endPage: 235,
    category: "potion",
    rarities: [],
    rarityVaries: true,
    attunement: false
  },
  {
    id: "srd521:potion-of-growth",
    edition: "2024",
    name: "Potion of Growth",
    metadata: "Potion, Uncommon",
    rules:
      "When you drink this potion, you gain the “enlarge”\neffect of the Enlarge/Reduce spell for 10 minutes (no\nConcentration required).\nThe red in the potion’s liquid continuously expands from a tiny bead to color the clear liquid\naround it and then contracts. Shaking the bottle\nfails to interrupt this process.",
    page: 235,
    endPage: 235,
    category: "potion",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:potions-of-healing",
    edition: "2024",
    name: "Potions of Healing",
    metadata: "Potion, Rarity Varies",
    rules:
      "You regain Hit Points when you drink this potion.\nThe number of Hit Points depends on the potion’s\nrarity, as shown in the table below.\nWhatever its potency, the potion’s red liquid glimmers when agitated.\nPotion HP Regained Rarity\nPotion of Healing 2d4 + 2 Common\nPotion of Healing 4d4 + 4 Uncommon\n(greater)\nPotion of Healing 8d4 + 8 Rare\n(superior)\nPotion of Healing 10d4 + 20 Very Rare\n(supreme)",
    page: 236,
    endPage: 236,
    category: "potion",
    rarities: [],
    rarityVaries: true,
    attunement: false
  },
  {
    id: "srd521:potion-of-heroism",
    edition: "2024",
    name: "Potion of Heroism",
    metadata: "Potion, Rare",
    rules:
      "When you drink this potion, you gain 10 Temporary\nHit Points that last for 1 hour. For the same duration, you are under the effect of the Bless spell (no\nConcentration required).\nThis potion’s blue liquid bubbles and steams as if\nboiling.",
    page: 236,
    endPage: 236,
    category: "potion",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:potion-of-invisibility",
    edition: "2024",
    name: "Potion of Invisibility",
    metadata: "Potion, Rare",
    rules:
      "This potion’s container looks empty but feels as\nthough it holds liquid. When you drink the potion,\nyou have the Invisible condition for 1 hour. The\neffect ends early if you make an attack roll, deal\ndamage, or cast a spell.",
    page: 236,
    endPage: 236,
    category: "potion",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:potion-of-invulnerability",
    edition: "2024",
    name: "Potion of Invulnerability",
    metadata: "Potion, Rare",
    rules:
      "For 1 minute after you drink this potion, you have\nResistance to all damage.\nThis potion’s syrupy liquid looks like liquefied\niron.",
    page: 236,
    endPage: 236,
    category: "potion",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:potion-of-longevity",
    edition: "2024",
    name: "Potion of Longevity",
    metadata: "Potion, Very Rare",
    rules:
      "When you drink this potion, your physical age is\nreduced by 1d6 + 6 years, to a minimum of 13 years.\nEach time you subsequently drink a Potion of Longevity, there is 10 percent cumulative chance that\nyou instead age by 1d6 + 6 years.\nSuspended in this amber liquid is a tiny heart that,\nagainst all reason, is still beating. These ingredients\nvanish when the potion is opened.",
    page: 236,
    endPage: 236,
    category: "potion",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:potion-of-mind-reading",
    edition: "2024",
    name: "Potion of Mind Reading",
    metadata: "Potion, Rare",
    rules:
      "When you drink this potion, you gain the effect of\nthe Detect Thoughts spell (save DC 13) for 10 minutes (no Concentration required).\nThis potion’s dense, purple liquid has an ovoid\ncloud of pink floating in it.",
    page: 236,
    endPage: 236,
    category: "potion",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:potion-of-poison",
    edition: "2024",
    name: "Potion of Poison",
    metadata: "Potion, Uncommon",
    rules:
      "This concoction looks, smells, and tastes like a\nPotion of Healing or another beneficial potion. However, it is actually poison masked by illusion magic.\nIdentify reveals its true nature.\nIf you drink this potion, you take 4d6 Poison damage and must succeed on a DC 13 Constitution saving throw or have the Poisoned condition for 1 hour.",
    page: 236,
    endPage: 236,
    category: "potion",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:potion-of-resistance",
    edition: "2024",
    name: "Potion of Resistance",
    metadata: "Potion, Uncommon",
    rules:
      "When you drink this potion, you have Resistance to\none type of damage for 1 hour. The GM chooses the\ntype or determines it randomly by rolling on the\nfollowing table.\n1d10 Damage Type 1d10 Damage Type\n1 Acid 6 Necrotic\n2 Cold 7 Poison\n3 Fire 8 Psychic\n4 Force 9 Radiant\n5 Lightning 10 Thunder",
    page: 236,
    endPage: 236,
    category: "potion",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:potion-of-speed",
    edition: "2024",
    name: "Potion of Speed",
    metadata: "Potion, Very Rare",
    rules:
      "When you drink this potion, you gain the effect of\nthe Haste spell for 1 minute (no Concentration required) without suffering the wave of lethargy that\ntypically occurs when the effect ends.\nThis potion’s yellow fluid is streaked with black\nand swirls on its own.",
    page: 236,
    endPage: 236,
    category: "potion",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:potion-of-vitality",
    edition: "2024",
    name: "Potion of Vitality",
    metadata: "Potion, Very Rare",
    rules:
      "When you drink this potion, it removes any\nExhaustion levels you have and ends the Poisoned\ncondition on you. For the next 24 hours, you regain\nthe maximum number of Hit Points for any Hit Point\nDie you spend.\nThis potion’s crimson liquid regularly pulses with\ndull light, calling to mind a heartbeat.",
    page: 236,
    endPage: 236,
    category: "potion",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:potion-of-water-breathing",
    edition: "2024",
    name: "Potion of Water Breathing",
    metadata: "Potion, Uncommon",
    rules:
      "You can breathe underwater for 24 hours after\ndrinking this potion.\nThis potion’s cloudy green fluid smells of the sea\nand has a jellyfish-like bubble floating in it.",
    page: 236,
    endPage: 237,
    category: "potion",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:quarterstaff-of-the-acrobat",
    edition: "2024",
    name: "Quarterstaff of the Acrobat",
    metadata: "Weapon (Quarterstaff), Very Rare (Requires Attunement)",
    rules:
      "You have a +2 bonus to attack rolls and damage rolls\nmade with this magic weapon.\nWhile holding this weapon, you can cause it to\nemit green Dim Light out to 10 feet, either as a Bonus Action or after you roll Initiative, or you can\nextinguish the light as a Bonus Action.\nWhile holding this weapon, you can take a Bonus\nAction to alter its form, turning it into a 6-inch rod\n(for ease of storage) or a 10-foot pole, or reverting it\na Quarterstaff; the weapon will elongate only as far\nas the surrounding space allows.\nIn certain forms, the weapon has the following additional properties.\nAcrobatic Assist (Quarterstaff and 10-Foot Pole\nForms Only). While holding this weapon, you have\nAdvantage on Dexterity (Acrobatics) checks.\nAttack Deflection (Quarterstaff Form Only).\nWhen you are hit by an attack while holding the\nweapon, you can take a Reaction to twirl the\nweapon around you, gaining a +5 bonus to your Armor Class against the triggering attack, potentially\ncausing the attack to miss you. You can’t use this\nproperty again until you finish a Short or Long Rest.\nRanged Weapon (Quarterstaff Form Only). This\nweapon has the Thrown property with a normal\nrange of 30 feet and a long range of 120 feet. Immediately after you make a ranged attack with the\nweapon, it flies back to your hand.",
    page: 237,
    endPage: 237,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:ring-of-animal-influence",
    edition: "2024",
    name: "Ring of Animal Influence",
    metadata: "Ring, Rare",
    rules:
      "This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. While wearing the\nring, you can expend 1 charge to cast one of the following spells (save DC 13) from it:\n• Animal Friendship\n• Fear (affects Beasts only)\n• Speak with Animals",
    page: 237,
    endPage: 237,
    category: "ring",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:ring-of-djinni-summoning",
    edition: "2024",
    name: "Ring of Djinni Summoning",
    metadata: "Ring, Legendary (Requires Attunement)",
    rules:
      "While wearing this ring, you can take a Magic action\nto summon a particular Djinni from the Elemental\nPlane of Air. The djinni appears in an unoccupied\nspace you choose within 120 feet of yourself. It\nremains as long as you maintain Concentration, to a\nmaximum of 1 hour, or until it drops to 0 Hit Points.\nWhile summoned, the djinni is Friendly to you and\nyour allies, and it obeys your commands. If you fail\nto command it, the djinni defends itself against attackers but takes no other actions.\nAfter the djinni departs, it can’t be summoned\nagain for 24 hours, and the ring becomes nonmagical if the djinni dies.\nRings of Djinni Summoning are often created by the\ndjinn they summon and given to mortals as gifts of\nfriendship or tokens of esteem.",
    page: 237,
    endPage: 237,
    category: "ring",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:ring-of-elemental-command",
    edition: "2024",
    name: "Ring of Elemental Command",
    metadata: "Ring, Legendary (Requires Attunement)",
    rules:
      "Each Ring of Elemental Command is linked to one of\nthe four Elemental Planes. The GM chooses or randomly determines the linked plane. For example, a\nRing of Elemental Command (air) is linked to the Elemental Plane of Air.\nEvery Ring of Elemental Command has the following two properties:\nElemental Bane. While wearing the ring, you have\nAdvantage on attack rolls against Elementals and\nthey have Disadvantage on attack rolls against\nyou.\nElemental Compulsion. While wearing the ring,\nyou can take a Magic action to try to compel an\nElemental you see within 60 feet of yourself. The\nElemental makes a DC 18 Wisdom saving throw.\nOn a failed save, the Elemental has the Charmed\ncondition until the start your next turn, and you\ndetermine what it does with its move and action\non its next turn.\nElemental Focus. While wearing the ring, you\nbenefit from additional properties corresponding to\nthe ring’s linked Elemental Plane:\nAir. You know Auran, you have Resistance to Lightning damage, and you have a Fly Speed equal to\nyour Speed and can hover.\nEarth. You know Terran, and you have Resistance\nto Acid damage. Terrain composed of rubble,\nrocks, or dirt isn’t Difficult Terrain for you. In addition, you can move through solid earth or rock\nas if those areas were Difficult Terrain without\ndisturbing the matter through which you pass. If\nyou end your turn in solid earth or rock, you are\nshunted out to the nearest unoccupied space you\nlast occupied.\nFire. You know Ignan, and you have Immunity to\nFire damage.\nWater. You know Aquan, you gain a Swim Speed of\n60 feet, and you can breathe underwater.\nSpellcasting. The ring has 5 charges and regains 1d4 + 1 expended charges daily at dawn.\nWhile wearing the ring, you can cast a spell from\nit. Choose the spell from the list of available spells\nbased on the Elemental Plane the ring is linked to,\nas shown in the following table. The table indicates\nhow many charges you must expend to cast the\nspell, which has a save DC of 18.\nPlane Spells (Charges)\nAir Chain Lightning (3 charges), Feather Fall (0\ncharges), Gust of Wind (2 charges), Wind\nWall (1 charge)\nEarth Earthquake (5 charges), Stone Shape (2\ncharges), Stoneskin (3 charges), Wall of Stone\n(3 charges)\nFire Burning Hands (1 charge), Fireball (2 charges),\nFire Storm (4 charges), Wall of Fire (3 charges)\nWater Create or Destroy Water (1 charge), Ice Storm\n(2 charges), Tsunami (5 charges), Wall of Ice\n(3 charges), Water Walk (2 charges)",
    page: 237,
    endPage: 238,
    category: "ring",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:ring-of-evasion",
    edition: "2024",
    name: "Ring of Evasion",
    metadata: "Ring, Rare (Requires Attunement)",
    rules:
      "This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. When you fail a Dexterity saving throw while wearing the ring, you can\ntake a Reaction to expend 1 charge to succeed on\nthat save instead.",
    page: 238,
    endPage: 238,
    category: "ring",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:ring-of-feather-falling",
    edition: "2024",
    name: "Ring of Feather Falling",
    metadata: "Ring, Rare (Requires Attunement)",
    rules: "When you fall while wearing this ring, you descend\n60 feet per round and take no damage from falling.",
    page: 238,
    endPage: 238,
    category: "ring",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:ring-of-free-action",
    edition: "2024",
    name: "Ring of Free Action",
    metadata: "Ring, Rare (Requires Attunement)",
    rules:
      "While you wear this ring, Difficult Terrain doesn’t\ncost you extra movement. In addition, magic can\nneither reduce any of your Speeds nor cause you to\nhave the Paralyzed or Restrained condition.",
    page: 238,
    endPage: 238,
    category: "ring",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:ring-of-invisibility",
    edition: "2024",
    name: "Ring of Invisibility",
    metadata: "Ring, Legendary (Requires Attunement)",
    rules:
      "While wearing this ring, you can take a Magic action\nto give yourself the Invisible condition. You remain\nInvisible until the ring is removed or until you take\na Bonus Action to become visible again.",
    page: 238,
    endPage: 238,
    category: "ring",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:ring-of-jumping",
    edition: "2024",
    name: "Ring of Jumping",
    metadata: "Ring, Uncommon (Requires Attunement)",
    rules: "While wearing this ring, you can cast Jump from it,\nbut can target only yourself when you do so.",
    page: 238,
    endPage: 238,
    category: "ring",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:ring-of-mind-shielding",
    edition: "2024",
    name: "Ring of Mind Shielding",
    metadata: "Ring, Uncommon (Requires Attunement)",
    rules:
      "While wearing this ring, you are immune to magic\nthat allows other creatures to read your thoughts,\ndetermine whether you are lying, know your alignment, or know your creature type. Creatures can\ntelepathically communicate with you only if you\nallow it.\nYou can take a Magic action to cause the ring to\nbecome imperceptible until you take another Magic\naction to make it perceptible, until you remove the\nring, or until you die.\nIf you die while wearing the ring, your soul enters\nit, unless it already houses a soul. You can remain in\nthe ring or depart for the afterlife. As long as your\nsoul is in the ring, you can telepathically communicate with any creature wearing it. A wearer can’t\nprevent this telepathic communication.",
    page: 238,
    endPage: 238,
    category: "ring",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:ring-of-protection",
    edition: "2024",
    name: "Ring of Protection",
    metadata: "Ring, Rare (Requires Attunement)",
    rules: "You gain a +1 bonus to Armor Class and saving\nthrows while wearing this ring.",
    page: 238,
    endPage: 238,
    category: "ring",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:ring-of-regeneration",
    edition: "2024",
    name: "Ring of Regeneration",
    metadata: "Ring, Very Rare (Requires Attunement)",
    rules:
      "While wearing this ring, you regain 1d6 Hit Points\nevery 10 minutes if you have at least 1 Hit Point. If\nyou lose a body part, the ring causes the missing\npart to regrow and return to full functionality after\n1d6 + 1 days if you have at least 1 Hit Point the\nwhole time.",
    page: 238,
    endPage: 238,
    category: "ring",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:ring-of-resistance",
    edition: "2024",
    name: "Ring of Resistance",
    metadata: "Ring, Rare",
    rules:
      "You have Resistance to one damage type while\nwearing this ring. The gemstone in the ring indicates the type, which the GM chooses or determines\nrandomly by rolling on the following table.\n1d10 Damage Type Gemstone\n1 Acid Pearl\n2 Cold Tourmaline\n3 Fire Garnet\n4 Force Sapphire\n5 Lightning Citrine\n6 Necrotic Jet\n7 Poison Amethyst\n8 Psychic Jade\n9 Radiant Topaz\n10 Thunder Spinel",
    page: 238,
    endPage: 238,
    category: "ring",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:ring-of-shooting-stars",
    edition: "2024",
    name: "Ring of Shooting Stars",
    metadata: "Ring, Very Rare (Requires Attunement)",
    rules:
      "You can cast Dancing Lights or Light from the ring.\nThe ring has 6 charges and regains 1d6 expended\ncharges daily at dawn. You can expend its charges\nto use the properties below.\nFaerie Fire. You can expend 1 charge to cast Faerie Fire from the ring.\nLightning Spheres. You can expend 2 charges as\na Magic action to create up to four 3-foot-diameter\nspheres of lightning.\nEach sphere appears in an unoccupied space you\ncan see within 120 feet of yourself. The spheres\nlast as long as you maintain Concentration, up to 1\nminute. Each sphere sheds Dim Light in a 30-foot\nradius.\nAs a Bonus Action, you can move each sphere up\nto 30 feet, but no farther than 120 feet away from\nyourself. The first time the sphere comes within 5\nfeet of a creature other than you that isn’t behind\nTotal Cover, the sphere discharges lightning at that\ncreature and disappears. That creature makes a\nDC 15 Dexterity saving throw. On a failed save, the\ncreature takes Lightning damage based on the number of spheres you created, as shown in the following table. On a successful save, the creature takes\nhalf as much damage.\nNumber of Lightning Number of Lightning\nSpheres Damage Spheres Damage\n1 4d12 3 2d6\n2 5d4 4 2d4\nShooting Stars. You can expend 1 to 3 charges as\na Magic action. For every charge you expend, you\nlaunch a glowing mote of light from the ring at a\npoint you can see within 60 feet of yourself. Each\ncreature in a 15-foot Cube originating from that\npoint is showered in sparks and makes a DC 15\nDexterity saving throw, taking 5d4 Radiant damage\non a failed save or half as much damage on a successful one.",
    page: 238,
    endPage: 239,
    category: "ring",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:ring-of-spell-storing",
    edition: "2024",
    name: "Ring of Spell Storing",
    metadata: "Ring, Rare (Requires Attunement)",
    rules:
      "This ring stores spells cast into it, holding them until the attuned wearer uses them. The ring can store\nup to 5 levels worth of spells at a time. When found,\nit contains 1d6 − 1 levels of stored spells chosen by\nthe GM.\nAny creature can cast a spell of level 1 through 5\ninto the ring by touching the ring as the spell is cast.\nThe spell has no effect other than to be stored in the\nring. If the ring can’t hold the spell, the spell is expended without effect. The level of the slot used to\ncast the spell determines how much space it uses.\nWhile wearing this ring, you can cast any spell\nstored in it. The spell uses the slot level, spell save\nDC, spell attack bonus, and spellcasting ability of\nthe original caster but is otherwise treated as if you\ncast the spell. The spell cast from the ring is no longer stored in it, freeing up space.",
    page: 239,
    endPage: 239,
    category: "ring",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:ring-of-spell-turning",
    edition: "2024",
    name: "Ring of Spell Turning",
    metadata: "Ring, Legendary (Requires Attunement)",
    rules:
      "While wearing this ring, you have Advantage on\nsaving throws against spells. If you succeed on the\nsave for a spell of level 7 or lower, the spell has no\neffect on you. If that spell targeted only you and\ndidn’t create an area of effect, you can take a Reaction to deflect the spell back at the spell’s caster; the\ncaster must make a saving throw against the spell\nusing their own spell save DC.",
    page: 239,
    endPage: 239,
    category: "ring",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:ring-of-swimming",
    edition: "2024",
    name: "Ring of Swimming",
    metadata: "Ring, Uncommon",
    rules: "You have a Swim Speed of 40 feet while wearing this\nring.",
    page: 239,
    endPage: 239,
    category: "ring",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:ring-of-telekinesis",
    edition: "2024",
    name: "Ring of Telekinesis",
    metadata: "Ring, Very Rare (Requires Attunement)",
    rules: "While wearing this ring, you can cast Telekinesis\nfrom it.",
    page: 239,
    endPage: 239,
    category: "ring",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:ring-of-the-ram",
    edition: "2024",
    name: "Ring of the Ram",
    metadata: "Ring, Rare (Requires Attunement)",
    rules:
      "This ring has 3 charges and regains 1d3 expended\ncharges daily at dawn. While wearing the ring, you\ncan take a Magic action to expend 1 to 3 charges to\nmake a ranged spell attack against one creature you\ncan see within 60 feet of yourself. The ring produces\na spectral ram’s head and makes its attack roll with\na +7 bonus. On a hit, for each charge you spend, the\ntarget takes 2d10 Force damage and is pushed 5\nfeet away from you.\nAlternatively, you can expend 1 to 3 of the ring’s\ncharges as a Magic action to try to break a nonmagical object you can see within 60 feet of yourself\nthat isn’t being worn or carried. The ring makes\na Strength check with a +5 bonus for each charge\nyou spend.",
    page: 239,
    endPage: 239,
    category: "ring",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:ring-of-three-wishes",
    edition: "2024",
    name: "Ring of Three Wishes",
    metadata: "Ring, Legendary",
    rules:
      "While wearing this ring, you can expend 1 of its 3\ncharges to cast Wish from it. The ring becomes nonmagical when you use the last charge.",
    page: 239,
    endPage: 239,
    category: "ring",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:ring-of-warmth",
    edition: "2024",
    name: "Ring of Warmth",
    metadata: "Ring, Uncommon (Requires Attunement)",
    rules:
      "If you take Cold damage while wearing this ring, the\nring reduces the damage you take by 2d8.\nIn addition, while wearing this ring, you and\neverything you wear and carry are unharmed by\ntemperatures of 0 degrees Fahrenheit or lower.",
    page: 239,
    endPage: 239,
    category: "ring",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:ring-of-water-walking",
    edition: "2024",
    name: "Ring of Water Walking",
    metadata: "Ring, Uncommon",
    rules: "While wearing this ring, you cast Water Walk from\nit, targeting only yourself.",
    page: 239,
    endPage: 239,
    category: "ring",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:ring-of-x-ray-vision",
    edition: "2024",
    name: "Ring of X-ray Vision",
    metadata: "Ring, Rare (Requires Attunement)",
    rules:
      "While wearing this ring, you can take a Magic action to gain X-ray vision with a range of 30 feet for\n1 minute. To you, solid objects within that radius\nappear transparent and don’t prevent light from\npassing through them. The vision can penetrate 1\nfoot of stone, 1 inch of common metal, or up to 3 feet\nof wood or dirt. Thicker substances or a thin sheet\nof lead block the vision.\nWhenever you use the ring again before taking a\nLong Rest, you must succeed on a DC 15 Constitution saving throw or gain 1 Exhaustion level.",
    page: 239,
    endPage: 240,
    category: "ring",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:robe-of-eyes",
    edition: "2024",
    name: "Robe of Eyes",
    metadata: "Wondrous Item, Rare (Requires Attunement)",
    rules:
      "This robe is adorned with eyelike patterns. While\nyou wear the robe, you gain the following benefits:\nAll-Around Vision. The robe gives you Advantage\non Wisdom (Perception) checks that rely on sight.\nSpecial Senses. You have Darkvision and Truesight,\nboth with a range of 120 feet.\nDrawbacks. A Light spell cast on the robe or a\nDaylight spell cast within 5 feet of the robe gives\nyou the Blinded condition for 1 minute. At the end of\neach of your turns, you make a Constitution saving\nthrow (DC 11 for Light or DC 15 for Daylight), ending\nthe condition on yourself on a success.",
    page: 240,
    endPage: 240,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:robe-of-scintillating-colors",
    edition: "2024",
    name: "Robe of Scintillating Colors",
    metadata: "Wondrous Item, Very Rare (Requires Attunement)",
    rules:
      "This robe has 3 charges, and it regains 1d3 expended charges daily at dawn. While you wear it,\nyou can take a Magic action and expend 1 charge\nto cause the garment to display a shifting pattern\nof dazzling hues until the end of your next turn.\nDuring this time, the robe sheds Bright Light in a\n30-foot radius and Dim Light for an additional 30\nfeet, and creatures that can see you have Disadvantage on attack rolls against you. Any creature in the\nBright Light that can see you when the robe’s power\nis activated must succeed on a DC 15 Wisdom saving throw or have the Stunned condition until the\neffect ends.",
    page: 240,
    endPage: 240,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:robe-of-stars",
    edition: "2024",
    name: "Robe of Stars",
    metadata: "Wondrous Item, Very Rare (Requires Attunement)",
    rules:
      "This black or dark-blue robe is embroidered with\nsmall white or silver stars. You gain a +1 bonus to\nsaving throws while you wear it.\nSix stars, located on the robe’s upper-front portion, are particularly large. While wearing this\nrobe, you can take a Magic action to remove one of\nthe stars and expend it to cast the level 5 version of\nMagic Missile. Daily at dusk, 1d6 removed stars reappear on the robe.\nWhile you wear the robe, you can take a Magic action to enter the Astral Plane along with everything\nyou are wearing and carrying. You remain there\nuntil you take a Magic action to return to the plane\nyou were on. You reappear in the last space you\noccupied or, if that space is occupied, the nearest\nunoccupied space.",
    page: 240,
    endPage: 240,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:robe-of-the-archmagi",
    edition: "2024",
    name: "Robe of the Archmagi",
    metadata: "Wondrous Item, Legendary (Requires Attunement by a Sorcerer, Warlock, or Wizard)",
    rules:
      "This elegant garment is made from exquisite cloth\nand adorned with runes.\nYou gain these benefits while wearing the robe.\nArmor. If you aren’t wearing armor, your base\nArmor Class is 15 plus your Dexterity modifier.\nMagic Resistance. You have Advantage on saving\nthrows against spells and other magical effects.\nWar Mage. Your spell save DC and spell attack bonus each increase by 2.",
    page: 240,
    endPage: 240,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:robe-of-useful-items",
    edition: "2024",
    name: "Robe of Useful Items",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "This robe has cloth patches of various shapes and\ncolors covering it. While wearing the robe, you can\ntake a Magic action to detach one of the patches,\ncausing it to become the object or creature it represents. Once the last patch is removed, the robe\nbecomes an ordinary garment.\nThe robe has two of each of the following patches:\n• Bullseye Lantern (filled and lit)\n• Dagger\n• Mirror\n• Pole\n• Rope (coiled)\n• Sack\nIn addition, the robe has 4d4 other patches. The GM\nchooses the patches or determines them randomly\nby rolling on the following table.\n1d100 Patch\n01–08 Bag of 100 GP\n09–15 Silver coffer (1 foot long, 6 inches wide and\ndeep) worth 500 GP\n16–22 Iron door (up to 10 feet wide and 10 feet high,\nbarred on one side of your choice), which you\ncan place in an opening you can reach; it conforms to fit the opening, attaching and hinging\nitself\n23–30 10 gems worth 100 GP each\n31–44 Wooden ladder (24 feet long)\n45–51 Riding Horse with a Riding Saddle\n52–59 Open pit (a 10-foot Cube), which you can\nplace on the ground within 10 feet of yourself\n60–68 4 Potions of Healing\n69–75 Rowboat (12 feet long)\n76–83 Spell Scroll containing one spell of level 1, 2, or\n3 (your choice)\n1d100 Patch\n84–90 2 Mastiffs\n91–96 Window (2 feet by 4 feet, up to 2 feet deep),\nwhich you can place on a vertical surface you\ncan reach\n97–00 Portable Ram",
    page: 240,
    endPage: 241,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:rod-of-absorption",
    edition: "2024",
    name: "Rod of Absorption",
    metadata: "Rod, Very Rare (Requires Attunement)",
    rules:
      "While holding this rod, you can take a Reaction to\nabsorb a spell that is targeting only you and doesn’t\ncreate an area of effect. The absorbed spell’s effect\nis canceled, and the spell’s energy—not the spell itself—is stored in the rod. The energy has the same\nlevel as the spell when it was cast. A canceled spell\ndissipates with no effect, and any resources used to\ncast it are wasted. The rod can absorb and store up\nto 50 levels of energy over the course of its existence.\nOnce the rod absorbs 50 levels of energy, it can’t absorb more. If you are targeted by a spell that the rod\ncan’t store, the rod has no effect on that spell.\nWhen you become attuned to the rod, you know\nhow many levels of energy the rod has absorbed\nover the course of its existence and how many levels\nof spell energy it currently has stored.\nIf you are a spellcaster holding the rod, you can\nconvert energy stored in it into spell slots to cast\nspells you have prepared or know. You can create\nspell slots only of a level equal to or lower than your\nown spell slots, up to a maximum of level 5. You use\nthe stored levels in place of your slots but otherwise\ncast the spell as normal. For example, you can use 3\nlevels stored in the rod as a level 3 spell slot.\nA newly found rod typically has 1d10 levels of\nspell energy stored in it. A rod that can no longer\nabsorb spell energy and has no energy remaining\nbecomes nonmagical.",
    page: 241,
    endPage: 241,
    category: "rod",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:rod-of-alertness",
    edition: "2024",
    name: "Rod of Alertness",
    metadata: "Rod, Very Rare (Requires Attunement)",
    rules:
      "This rod has the following properties.\nAlertness. While holding the rod, you have\nAdvantage on Wisdom (Perception) checks and on\nInitiative rolls.\nSpells. While holding the rod, you can cast the following spells from it:\n• Detect Evil and Good\n• Detect Magic\n• Detect Poison and Disease\n• See Invisibility\nProtective Aura. As a Magic action, you can plant\nthe haft end of the rod in the ground, whereupon\nthe rod’s head sheds Bright Light in a 60-foot radius\nand Dim Light for an additional 60 feet. While in\nthat Bright Light, you and your allies gain a +1\nbonus to Armor Class and saving throws and can\nsense the location of any Invisible creature that is\nalso in the Bright Light.\nThe rod’s head stops glowing and the effect ends\nafter 10 minutes or when a creature takes a Magic\naction to pull the rod from the ground. Once used,\nthis property can’t be used again until the next\ndawn.",
    page: 241,
    endPage: 241,
    category: "rod",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:rod-of-lordly-might",
    edition: "2024",
    name: "Rod of Lordly Might",
    metadata: "Rod, Legendary (Requires Attunement)",
    rules:
      "This rod has a flanged head, and it functions as a\nmagic Mace that grants a +3 bonus to attack rolls\nand damage rolls made with it. The rod has properties associated with six different buttons that are\nset in a row along the haft. It has three other properties as well, detailed below.\nButtons. You can press one of the following buttons as a Bonus Action; a button’s effect lasts until\nyou push a different button or until you push the\nsame button again, which causes the rod to revert\nto its normal form:\nButton 1. A fiery blade sprouts from the end opposite the rod’s flanged head. The flames shed\nBright Light in a 40-foot radius and Dim Light for\nan additional 40 feet, and the blade functions as\na magic Longsword or Shortsword (your choice)\nthat deals an extra 2d6 Fire damage on a hit.\nButton 2. The rod’s flanged head folds down and\ntwo crescent-shaped blades spring out, transforming the rod into a magic Battleaxe that grants\na +3 bonus to attack rolls and damage rolls made\nwith it.\nButton 3. The rod’s flanged head folds down, a\nspear point springs from the rod’s tip, and the\nrod’s handle lengthens into a 6-foot haft, transforming the rod into a magic Spear that grants a\n+3 bonus to attack rolls and damage rolls made\nwith it.\nButton 4. The rod transforms into a climbing pole\nup to 50 feet long (you specify the length), though\nthe rod’s buttons remain within your reach. In\nsurfaces as hard as granite, a spike at the bottom and three hooks at the top anchor the pole.\nHorizontal bars 3 inches long fold out from the\nsides, 1 foot apart, forming a ladder. The pole can\nbear up to 4,000 pounds. More weight or lack of\nsolid anchoring causes the rod to revert to its\nnormal form.\nButton 5. The rod transforms into a handheld\nbattering ram and grants its user a +10 bonus\nto Strength (Athletics) checks made to break\nthrough doors, barricades, and other barriers.\nButton 6. The rod assumes or remains in its normal form and indicates magnetic north. (Nothing\nhappens if this function of the rod is used in a\nlocation that has no magnetic north.) The rod also\ngives you knowledge of your approximate depth\nbeneath the ground or your height above it.\nDrain Life. When you hit a creature with a melee\nattack using the rod, you can force the target to\nmake a DC 17 Constitution saving throw. On a failed\nsave, the target takes an extra 4d6 Necrotic damage, and you regain a number of Hit Points equal to\nhalf that Necrotic damage. Once used, this property\ncan’t be used again until the next dawn.\nParalyze. When you hit a creature with a melee\nattack using the rod, you can force the target to\nmake a DC 17 Constitution saving throw. On a failed\nsave, the target has the Paralyzed condition for 1\nminute. The target repeats the save at the end of\neach of its turns, ending the effect on a success.\nOnce used, this property can’t be used again until\nthe next dawn.\nTerrify. While holding the rod, you can take a\nMagic action to force each creature you can see\nwithin 30 feet of yourself to make a DC 17 Wisdom\nsaving throw. On a failed save, a target has the\nFrightened condition for 1 minute. A Frightened\ntarget repeats the save at the end of each of its\nturns, ending the effect on itself on a success. Once\nused, this property can’t be used again until the\nnext dawn.",
    page: 241,
    endPage: 242,
    category: "rod",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:rod-of-resurrection",
    edition: "2024",
    name: "Rod of Resurrection",
    metadata: "Rod, Legendary (Requires Attunement)",
    rules:
      "The rod has 5 charges. While you hold it, you can\ncast one of the following spells from it: Heal (expends 1 charge) or Resurrection (expends 5 charges).\nThe rod regains 1 expended charge daily at dawn.\nIf you expend the last charge, roll 1d20. On a 1, the\nrod disappears in a harmless burst of radiance.",
    page: 242,
    endPage: 242,
    category: "rod",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:rod-of-rulership",
    edition: "2024",
    name: "Rod of Rulership",
    metadata: "Rod, Rare (Requires Attunement)",
    rules:
      "You can take a Magic action to present the rod and\ncommand obedience from each creature of your\nchoice that you can see within 120 feet of yourself. Each target must succeed on a DC 15 Wisdom\nsaving throw or have the Charmed condition for 8\nhours. While Charmed in this way, the creature regards you as its trusted leader. If harmed by you or\nyour allies or commanded to do something contrary\nto its nature, a target ceases to be Charmed in this\nway. Once used, this property can’t be used again\nuntil the next dawn.",
    page: 242,
    endPage: 242,
    category: "rod",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:rod-of-security",
    edition: "2024",
    name: "Rod of Security",
    metadata: "Rod, Very Rare",
    rules:
      "While holding this rod, you can take a Magic action\nto activate it. The rod then instantly transports you\nand up to 199 other willing creatures you can see\nto a demiplane. You choose the form the demiplane\ntakes. It could be a tranquil garden, a cheery tavern,\nan immense palace, a tropical island, a fantastic carnival, or whatever else you can imagine. Regardless\nof its nature, the demiplane contains enough water\nand food to sustain its visitors, and the demiplane’s\nenvironment can’t harm its occupants. Everything\nelse that can be interacted with there can exist\nonly there. For example, a flower picked from a\ngarden there disappears if it is taken outside the\ndemiplane.\nFor each hour spent in the demiplane, a visitor\nregains Hit Points as if it had spent 1 Hit Point Die.\nAlso, creatures don’t age while there, although time\npasses normally. Visitors can remain there for up to\n200 days divided by the number of creatures present (round down).\nWhen the time runs out or you take a Magic action\nto end the effect, all visitors reappear in the location they occupied when you activated the rod or an\nunoccupied space nearest that location. Once used,\nthis property can’t be used again until 10 days have\npassed.",
    page: 242,
    endPage: 242,
    category: "rod",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:rope-of-climbing",
    edition: "2024",
    name: "Rope of Climbing",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "This 60-foot length of rope can hold up to 3,000\npounds. While holding one end of the rope, you can\ntake a Magic action to command the other end of the\nrope to animate and move toward a destination you\nchoose, up to the rope’s length away from you. That\nend moves 10 feet on your turn when you first command it and 10 feet at the start of each of your subsequent turns until reaching its destination or until\nyou tell it to stop. You can also tell the rope to fasten\nitself securely to an object or to unfasten itself, to\nknot or unknot itself, or to coil itself for carrying.\nIf you tell the rope to knot, large knots appear at\n1-foot intervals along the rope. While knotted, the\nrope shortens to a 50-foot length and grants Advantage on ability checks made to climb using the rope.\nThe rope has AC 20, HP 20, and Immunity to Poison and Psychic damage. It regains 1 Hit Point every\n5 minutes as long as it has at least 1 Hit Point. If the\nrope drops to 0 Hit Points, it is destroyed.",
    page: 242,
    endPage: 242,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:rope-of-entanglement",
    edition: "2024",
    name: "Rope of Entanglement",
    metadata: "Wondrous Item, Rare",
    rules:
      "This rope is 30 feet long. While holding one end of\nthe rope, you can take a Magic action to command\nthe other end to dart forward and entangle one\ncreature you can see within 20 feet of yourself. The\ntarget must succeed on a DC 15 Dexterity saving\nthrow or have the Restrained condition. You can release the target by letting go of your end of the rope\n(causing the rope to coil up in the target’s space)\nor by using a Bonus Action to repeat the command\n(causing the rope to coil up in your hand).\nA target Restrained by the rope can take an action\nto make its choice of a DC 15 Strength (Athletics) or\nDexterity (Acrobatics) check. On a successful check,\nthe target is no longer Restrained by the rope. If\nyou’re still holding onto the rope when a target escapes from it, you can take a Reaction to command\nthe rope to coil up in your hand; otherwise, the rope\ncoils up in the target’s space.\nThe rope has AC 20, HP 20, and Immunity to Poison and Psychic damage. It regains 1 Hit Point every\n5 minutes as long as it has at least 1 Hit Point. If the\nrope drops to 0 Hit Points, it is destroyed.",
    page: 242,
    endPage: 243,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:scarab-of-protection",
    edition: "2024",
    name: "Scarab of Protection",
    metadata: "Wondrous Item, Legendary (Requires Attunement)",
    rules:
      "This beetle-shaped medallion provides three benefits while it is on your person.\nDefense. You gain a +1 bonus to Armor Class.\nPreservation. The scarab has 12 charges. If you\nfail a saving throw against a Necromancy spell or\na harmful effect originating from an Undead, you\ncan take a Reaction to expend 1 charge and turn the\nfailed save into a successful one. The scarab crumbles into powder and is destroyed when its last\ncharge is expended.\nSpell Resistance. You have Advantage on saving\nthrows against spells.",
    page: 243,
    endPage: 243,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:scimitar-of-speed",
    edition: "2024",
    name: "Scimitar of Speed",
    metadata: "Weapon (Scimitar), Very Rare (Requires Attunement)",
    rules:
      "You gain a +2 bonus to attack rolls and damage rolls\nmade with this magic weapon. In addition, you can\nmake one attack with it as a Bonus Action on each of\nyour turns.",
    page: 243,
    endPage: 243,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:sending-stones",
    edition: "2024",
    name: "Sending Stones",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "Sending Stones come in pairs, with each stone\ncarved to match the other so the pairing is easily\nrecognized. While you touch one stone, you can cast\nSending from it. The target is the bearer of the other\nstone. If no creature bears the other stone, you\nknow that fact as soon as you use the stone, and you\ndon’t cast the spell.\nOnce Sending is cast using either stone, the stones\ncan’t be used again until the next dawn. If one of the\nstones in a pair is destroyed, the other one becomes\nnonmagical.",
    page: 243,
    endPage: 243,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:sentinel-shield",
    edition: "2024",
    name: "Sentinel Shield",
    metadata: "Armor (Shield), Uncommon",
    rules:
      "While holding this Shield, you have Advantage on\nInitiative rolls and Wisdom (Perception) checks.\nThe Shield is emblazoned with a symbol of an eye.",
    page: 243,
    endPage: 243,
    category: "armor",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:shield-1-2-or-3",
    edition: "2024",
    name: "Shield, +1, +2, or +3",
    metadata: "Armor (Shield), Uncommon (+1), Rare (+2), or Very Rare (+3)",
    rules:
      "While holding this Shield, you have a bonus to Armor Class determined by the Shield’s rarity, in addition to the Shield’s normal bonus to AC.",
    page: 243,
    endPage: 243,
    category: "armor",
    rarities: ["uncommon", "rare", "veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:shield-of-missile-attraction",
    edition: "2024",
    name: "Shield of Missile Attraction",
    metadata: "Armor (Shield), Rare (Requires Attunement)",
    rules:
      "While holding this Shield, you have Resistance to\ndamage from attacks made with Ranged weapons.\nCurse. This Shield is cursed. Attuning to it curses\nyou until you are targeted by a Remove Curse spell\nor similar magic. Removing the Shield fails to\nend the curse on you. Whenever an attack with a\nRanged weapon targets a creature within 10 feet\nof you, the curse causes you to become the target\ninstead.",
    page: 243,
    endPage: 243,
    category: "armor",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:shield-of-the-cavalier",
    edition: "2024",
    name: "Shield of the Cavalier",
    metadata: "Armor (Shield), Very Rare (Requires Attunement)",
    rules:
      "While holding this Shield, you have a +2 bonus to\nArmor Class. This bonus is in addition to the Shield’s\nnormal bonus to AC.\nThe Shield has the following additional properties\nthat you can use while holding it.\nForceful Bash. When you take the Attack action,\nyou can make one of the attack rolls using the Shield\nagainst a target within 5 feet of yourself. Apply your\nProficiency Bonus and Strength modifier to the attack roll. On a hit, the Shield deals Force damage to\nthe target equal to 2d6 + 2 plus your Strength modifier, and if the target is a creature, you can push\nit up to 10 feet directly away from yourself. If the\ncreature is your size or smaller, you can also knock\nit down, giving it the Prone condition.\nProtective Field. As a Reaction, when you or an\nally you can see within 5 feet of you is targeted by\nan attack or makes a saving throw against an area\nof effect, you can use the Shield to create an immobile 5-foot Emanation originating from you. When\nthe Emanation appears, any creatures or objects not\nfully contained within it are pushed into the nearest\nunoccupied spaces outside it. The attack or area of\neffect that triggered the Reaction has no effect on\ncreatures and objects inside the Emanation, which\nlasts as long as you maintain Concentration, up to 1\nminute. Nothing can pass into or out of the Emanation. A creature or object inside the Emanation can’t\nbe damaged by attacks or effects originating from\noutside, nor can a creature inside the Emanation\ndamage anything outside it. Once this property is\nused, it can’t be used again until the next dawn.",
    page: 243,
    endPage: 243,
    category: "armor",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:slippers-of-spider-climbing",
    edition: "2024",
    name: "Slippers of Spider Climbing",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "While you wear these light shoes, you can move\nup, down, and across vertical surfaces and along\nceilings, while leaving your hands free. You have a\nClimb Speed equal to your Speed. However, the slippers don’t allow you to move this way on a slippery\nsurface, such as one covered by ice or oil.",
    page: 244,
    endPage: 244,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:sovereign-glue",
    edition: "2024",
    name: "Sovereign Glue",
    metadata: "Wondrous Item, Legendary",
    rules:
      "This viscous, milky-white substance can form a permanent adhesive bond between any two objects. It\nmust be stored in a jar or flask that has been coated\ninside with Oil of Slipperiness. When found, a container contains 1d6 + 1 ounces.\nOne ounce of the glue can cover a 1-foot square\nsurface. Applying an ounce of Sovereign Glue takes\na Utilize action, and the applied glue takes 1 minute\nto set. Once it has done so, the bond it creates can be\nbroken only by the application of Universal Solvent\nor Oil of Etherealness, or with a Wish spell.",
    page: 244,
    endPage: 244,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:spellguard-shield",
    edition: "2024",
    name: "Spellguard Shield",
    metadata: "Armor (Shield), Very Rare (Requires Attunement)",
    rules:
      "While holding this Shield, you have Advantage on\nsaving throws against spells and other magical\neffects, and spell attack rolls have Disadvantage\nagainst you.",
    page: 244,
    endPage: 244,
    category: "armor",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:spell-scroll",
    edition: "2024",
    name: "Spell Scroll",
    metadata: "Scroll, Rarity Varies",
    rules:
      "A Spell Scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your spell\nlist, you can read the scroll and cast its spell without Material components. Otherwise, the scroll is\nunintelligible. Casting the spell by reading the scroll\nrequires the spell’s normal casting time. Once the\nspell is cast, the scroll crumbles to dust. If the casting is interrupted, the scroll isn’t lost.\nIf the spell is on your spell list but of a higher level\nthan you can normally cast, you make an ability\ncheck using your spellcasting ability to determine\nwhether you cast the spell. The DC equals 10 plus\nthe spell’s level. On a failed check, the spell disappears from the scroll with no other effect.\nThe level of the spell on the scroll determines the\nspell’s saving throw DC and attack bonus, as well as\nthe scroll’s rarity, as shown in the following table.\nSpell Level Rarity Save DC Attack Bonus\nCantrip Common 13 +5\n1 Common 13 +5\n2 Uncommon 13 +5\n3 Uncommon 15 +7\nSpell Level Rarity Save DC Attack Bonus\n4 Rare 15 +7\n5 Rare 17 +9\n6 Very Rare 17 +9\n7 Very Rare 18 +10\n8 Very Rare 18 +10\n9 Legendary 19 +11\nCopying a Scroll into a Spellbook. A Wizard spell\non a Spell Scroll can be copied into a spellbook.\nWhen a spell is copied in this way, the copier must\nsucceed on an Intelligence (Arcana) check with a\nDC equal to 10 plus the spell’s level. On a successful\ncheck, the spell is copied. Whether the check succeeds or fails, the Spell Scroll is destroyed.",
    page: 244,
    endPage: 244,
    category: "scroll",
    rarities: [],
    rarityVaries: true,
    attunement: false
  },
  {
    id: "srd521:sphere-of-annihilation",
    edition: "2024",
    name: "Sphere of Annihilation",
    metadata: "Wondrous Item, Legendary",
    rules:
      "This 2-foot-diameter black sphere is a hole in the\nmultiverse, hovering in space and stabilized by a\nmagical field surrounding it.\nThe sphere obliterates all matter it passes\nthrough and all matter that passes through it. Artifacts are the exception. Unless an Artifact is susceptible to damage from a Sphere of Annihilation, it\npasses through the sphere unscathed. Anything else\nthat touches the sphere but isn’t wholly engulfed\nand obliterated by it takes 8d10 Force damage.\nControlling the Sphere. A Sphere of Annihilation is\nstationary until someone takes control of it. If you\nare within 60 feet of a sphere, you can take a Magic\naction to make a DC 25 Intelligence (Arcana) check.\nOn a successful check, you control the sphere until\nthe start of your next turn, and if it was under another creature’s control, that creature loses control\nof the sphere. On a failed check, the sphere moves\n10 feet toward you in a straight line.\nWhile in control of the sphere, you can take a\nBonus Action to cause it to move in one direction\nof your choice, up to a number of feet equal to\n5 times your Intelligence modifier (minimum 5\nfeet). Any creature whose space the sphere enters\nmust succeed on a DC 19 Dexterity saving throw\nor be touched by it, taking 8d10 Force damage. A\ncreature reduced to 0 Hit Points by this damage is\nobliterated, leaving its possessions behind but no\nother physical remains.\nSphere Interactions. If the sphere comes into\ncontact with a planar portal (such as that created by\nthe Gate spell) or an extradimensional space (such\nas that within a Portable Hole), the GM determines\nrandomly what happens using the following table.\n1d100 Result\n01–50 The sphere is destroyed.\n51–85 The sphere moves through the portal or into\nthe extradimensional space.\n86–00 A spatial rift sends the sphere and each creature and object within 180 feet of the sphere\nto a random plane of existence.",
    page: 244,
    endPage: 245,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:staff-of-charming",
    edition: "2024",
    name: "Staff of Charming",
    metadata: "Staff, Rare (Requires Attunement by a Bard, Cleric, Druid, Sorcerer, Warlock, or Wizard)",
    rules:
      "This staff has 10 charges. While holding the staff,\nyou can use any of its properties:\nCast Spell. You can expend 1 of the staff’s charges\nto cast Charm Person, Command, or Comprehend\nLanguages from it using your spell save DC.\nReflect Enchantment. If you succeed on a saving\nthrow against an Enchantment spell that targets\nonly you, you can take a Reaction to expend 1\ncharge from the staff and turn the spell back on\nits caster as if you had cast the spell.\nResist Enchantment. If you fail a saving throw\nagainst an Enchantment spell that targets only\nyou, you can turn your failed save into a successful one. You can’t use this property of the staff\nagain until the next dawn.\nRegaining Charges. The staff regains 1d8 + 2 expended charges daily at dawn. If you expend the last\ncharge, roll 1d20. On a 1, the staff crumbles to dust\nand is destroyed.",
    page: 245,
    endPage: 245,
    category: "staff",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:staff-of-fire",
    edition: "2024",
    name: "Staff of Fire",
    metadata: "Staff, Very Rare (Requires Attunement by a Druid, Sorcerer, Warlock, or Wizard)",
    rules:
      "You have Resistance to Fire damage while you hold\nthis staff.\nSpells. The staff has 10 charges. While holding the\nstaff, you can cast one of the spells on the following\ntable from it, using your spell save DC. The table indicates how many charges you must expend to cast\nthe spell.\nCharge Charge\nSpell Cost Spell Cost\nBurning Hands 1 Wall of Fire 4\nFireball 3\nRegaining Charges. The staff regains 1d6 + 4\nexpended charges daily at dawn. If you expend the\nlast charge, roll 1d20. On a 1, the staff crumbles into\ncinders and is destroyed.",
    page: 245,
    endPage: 245,
    category: "staff",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:staff-of-frost",
    edition: "2024",
    name: "Staff of Frost",
    metadata: "Staff, Very Rare (Requires Attunement by a Druid, Sorcerer, Warlock, or Wizard)",
    rules:
      "You have Resistance to Cold damage while you hold\nthis staff.\nSpells. The staff has 10 charges. While holding the\nstaff, you can cast one of the spells on the following\ntable from it, using your spell save DC. The table indicates how many charges you must expend to cast\nthe spell.\nCharge Charge\nSpell Cost Spell Cost\nCone of Cold 5 Ice Storm 4\nFog Cloud 1 Wall of Ice 4\nRegaining Charges. The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last\ncharge, roll 1d20. On a 1, the staff turns to water\nand is destroyed.",
    page: 245,
    endPage: 245,
    category: "staff",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:staff-of-healing",
    edition: "2024",
    name: "Staff of Healing",
    metadata: "Staff, Rare (Requires Attunement by a Bard, Cleric, or Druid)",
    rules:
      "This staff has 10 charges. While holding the staff,\nyou can cast one of the spells on the following table\nfrom it, using your spellcasting ability modifier. The\ntable indicates how many charges you must expend\nto cast the spell.\nSpell Charge Cost\nCure Wounds 1 charge per spell level\n(maximum 4 for a level 4\nspell)\nLesser Restoration 2\nMass Cure Wounds 5\nRegaining Charges. The staff regains 1d6 + 4\nexpended charges daily at dawn. If you expend the\nlast charge, roll 1d20. On a 1, the staff vanishes in a\nflash of light, lost forever.",
    page: 245,
    endPage: 245,
    category: "staff",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:staff-of-power",
    edition: "2024",
    name: "Staff of Power",
    metadata: "Staff, Very Rare (Requires Attunement by a Sorcerer, Warlock, or Wizard)",
    rules:
      "This staff has 20 charges and can be wielded as a\nmagic Quarterstaff that grants a +2 bonus to attack\nrolls and damage rolls made with it. While holding it, you gain a +2 bonus to Armor Class, saving\nthrows, and spell attack rolls.\nSpells. While holding the staff, you can cast one of\nthe spells on the following table from it, using your\nspell save DC. The table indicates how many charges\nyou must expend to cast the spell.\nCharge\nSpell Cost\nCone of Cold 5\nFireball (level 5 version) 5\nGlobe of Invulnerability 6\nHold Monster 5\nLevitate 2\nLightning Bolt (level 5 version) 5\nMagic Missile 1\nRay of Enfeeblement 1\nWall of Force 5\nRegaining Charges. The staff regains 2d8 + 4\nexpended charges daily at dawn. If you expend the\nlast charge, roll 1d20. On a 1, the staff retains its +2\nbonus to attack rolls and damage rolls but loses all\nother properties. On a 20, the staff regains 1d8 + 2\ncharges.\nRetributive Strike. You can take a Magic action to\nbreak the staff over your knee or against a solid surface. The staff is destroyed and releases its magic in\nan explosion that fills a 30-foot Emanation originating from itself. You have a 50 percent chance to instantly travel to a random plane of existence, avoiding the explosion. If you fail to avoid the effect, you\ntake Force damage equal to 16 times the number\nof charges in the staff. Each other creature in the\narea makes a DC 17 Dexterity saving throw. On a\nfailed save, a creature takes Force damage equal to\n4 times the number of charges in the staff. On a successful save, a creature takes half as much damage.",
    page: 245,
    endPage: 246,
    category: "staff",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:staff-of-striking",
    edition: "2024",
    name: "Staff of Striking",
    metadata: "Staff, Very Rare (Requires Attunement)",
    rules:
      "This staff can be wielded as a magic Quarterstaff\nthat grants a +3 bonus to attack rolls and damage\nrolls made with it.\nThe staff has 10 charges. When you hit with\na melee attack using it, you can expend up to 3\ncharges. For each charge you expend, the target\ntakes an extra 1d6 Force damage.\nRegaining Charges. The staff regains 1d6 + 4\nexpended charges daily at dawn. If you expend the\nlast charge, roll 1d20. On a 1, the staff becomes a\nnonmagical Quarterstaff.",
    page: 246,
    endPage: 246,
    category: "staff",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:staff-of-swarming-insects",
    edition: "2024",
    name: "Staff of Swarming Insects",
    metadata: "Staff, Rare (Requires Attunement by a Bard, Cleric, Druid, Sorcerer, Warlock, or Wizard)",
    rules:
      "This staff has 10 charges.\nInsect Cloud. While holding the staff, you can\ntake a Magic action and expend 1 charge to cause\na swarm of harmless flying insects to fill a 30foot Emanation originating from you. The insects\nremain for 10 minutes, making the area Heavily\nObscured for creatures other than you. A strong\nwind (like that created by Gust of Wind) disperses\nthe swarm and ends the effect.\nSpells. While holding the staff, you can cast one of\nthe spells on the following table from it, using your\nspell save DC and spell attack modifier. The table indicates how many charges you must expend to cast\nthe spell.\nSpell Charge\nCost\nGiant Insect 4\nInsect Plague 5\nRegaining Charges. The staff regains 1d6 + 4\nexpended charges daily at dawn. If you expend the\nlast charge, roll 1d20. On a 1, a swarm of insects\nconsumes and destroys the staff, then disperses.",
    page: 246,
    endPage: 246,
    category: "staff",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:staff-of-the-magi",
    edition: "2024",
    name: "Staff of the Magi",
    metadata: "Staff, Legendary (Requires Attunement by a Sorcerer, Warlock, or Wizard)",
    rules:
      "This staff has 50 charges and can be wielded as a\nmagic Quarterstaff that grants a +2 bonus to attack\nrolls and damage rolls made with it. While you hold\nit, you gain a +2 bonus to spell attack rolls.\nSpell Absorption. While holding the staff, you\nhave Advantage on saving throws against spells.\nIn addition, you can take a Reaction when another\ncreature casts a spell that targets only you. If you\ndo, the staff absorbs the magic of the spell, canceling its effect and gaining a number of charges equal\nto the absorbed spell’s level. However, if doing so\nbrings the staff’s total number of charges above 50,\nthe staff explodes as if you activated its Retributive\nStrike (see below).\nSpells. While holding the staff, you can cast one of\nthe spells on the following table from it, using your\nspell save DC. The table indicates how many charges\nyou must expend to cast the spell.\nCharge\nSpell Cost\nArcane Lock 0\nConjure Elemental 7\nDetect Magic 0\nDispel Magic 3\nEnlarge/Reduce 0\nFireball (level 7 version) 7\nFlaming Sphere 2\nIce Storm 4\nInvisibility 2\nKnock 2\nLight 0\nLightning Bolt (level 7 version) 7\nCharge\nSpell Cost\nMage Hand 0\nPasswall 5\nPlane Shift 7\nProtection from Evil and Good 0\nTelekinesis 5\nWall of Fire 4\nWeb 2\nRegaining Charges. The staff regains 4d6 + 2 expended charges daily at dawn. If you expend the last\ncharge, roll 1d20. On a 20, the staff regains 1d12 + 1\ncharges.\nRetributive Strike. You can take a Magic action to\nbreak the staff over your knee or against a solid surface. The staff is destroyed and releases its magic in\nan explosion that fills a 30-foot Emanation originating from itself. You have a 50 percent chance to instantly travel to a random plane of existence, avoiding the explosion. If you fail to avoid the effect, you\ntake Force damage equal to 16 times the number\nof charges in the staff. Each other creature in the\narea makes a DC 17 Dexterity saving throw. On a\nfailed save, a creature takes Force damage equal to\n6 times the number of charges in the staff. On a successful save, a creature takes half as much damage.",
    page: 246,
    endPage: 247,
    category: "staff",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:staff-of-the-python",
    edition: "2024",
    name: "Staff of the Python",
    metadata: "Staff, Uncommon (Requires Attunement)",
    rules:
      "As a Magic action, you can throw this staff so that it\nlands in an unoccupied space within 10 feet of you,\ncausing the staff to become a Giant Constrictor\nSnake in that space. The snake is under your control and shares your Initiative count, taking its turn\nimmediately after yours.\nOn your turn, you can mentally command the\nsnake (no action required) if it is within 60 feet of\nyou and you don’t have the Incapacitated condition.\nYou decide what action the snake takes and where it\nmoves during its turn, or you can issue it a general\ncommand, such as to attack your enemies or guard\na location. Absent commands from you, the snake\ndefends itself.\nAs a Bonus Action, you can command the snake\nto revert to staff form in its current space, and you\ncan’t use the staff’s property again for 1 hour. If the\nsnake is reduced to 0 Hit Points, it dies and reverts\nto its staff form; the staff then shatters and is destroyed. If the snake reverts to staff form before\nlosing all its Hit Points, it regains all of them.",
    page: 247,
    endPage: 247,
    category: "staff",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:staff-of-the-woodlands",
    edition: "2024",
    name: "Staff of the Woodlands",
    metadata: "Staff, Rare (Requires Attunement by a Druid)",
    rules:
      "This staff has 6 charges and can be wielded as a\nmagic Quarterstaff that grants a +2 bonus to attack\nrolls and damage rolls made with it. While holding\nit, you have a +2 bonus to spell attack rolls.\nSpells. While holding the staff, you can cast one of\nthe spells on the following table from it, using your\nspell save DC. The table indicates how many charges\nyou must expend to cast the spell.\nSpell Charge\nCost\nAnimal Friendship 1\nAwaken 5\nBarkskin 2\nLocate Animals or Plants 2\nPass without Trace 2\nSpeak with Animals 1\nSpeak with Plants 3\nWall of Thorns 6\nTree Form. You can take a Magic action to plant\none end of the staff in earth in an unoccupied space\nand expend 1 charge to transform the staff into\na healthy tree. The tree is 60 feet tall and has a\n5-foot-diameter trunk, and its branches at the top\nspread out in a 20-foot radius. The tree appears\nordinary but radiates a faint aura of Transmutation\nmagic that can be discerned with the Detect Magic\nspell. While touching the tree and using a Magic\naction, you return the staff to its normal form. Any\ncreature in the tree falls when the tree reverts to\na staff.\nRegaining Charges. The staff regains 1d6 expended charges daily at dawn. If you expend the last\ncharge, roll 1d20. On a 1, the staff loses its properties and becomes a nonmagical Quarterstaff.",
    page: 247,
    endPage: 247,
    category: "staff",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:staff-of-thunder-and-lightning",
    edition: "2024",
    name: "Staff of Thunder and Lightning",
    metadata: "Staff, Very Rare (Requires Attunement)",
    rules:
      "This staff can be wielded as a magic Quarterstaff\nthat grants a +2 bonus to attack rolls and damage\nrolls made with it. It also has the following additional properties. Once one of these properties is\nused, it can’t be used again until the next dawn.\nLightning. When you hit with a melee attack\nusing the staff, you can cause the target to take an\nextra 2d6 Lightning damage (no action required).\nThunder. When you hit with a melee attack using\nthe staff, you can cause the staff to emit a crack of\nthunder audible out to 300 feet (no action required).\nThe target you hit must succeed on a DC 17 Constitution saving throw or have the Stunned condition\nuntil the end of your next turn.\nThunder and Lightning. Immediately after you\nhit with a melee attack using the staff, you can take\na Bonus Action to use the Lightning and Thunder\nproperties (see above) at the same time. Doing so\ndoesn’t expend the daily use of those properties,\nonly the use of this one.\nLightning Strike. You can take a Magic action to\ncause a bolt of lightning to leap from the staff’s tip\nin a Line that is 5 feet wide and 120 feet long. Each\ncreature in that Line makes a DC 17 Dexterity saving throw, taking 9d6 Lightning damage on a failed\nsave or half as much damage on a successful one.\nThunderclap. You can take a Magic action to\ncause the staff to produce a thunderclap audible out\nto 600 feet. Every creature within a 60-foot Emanation originating from you makes a DC 17 Constitution saving throw. On a failed save, a creature takes\n2d6 Thunder damage and has the Deafened condition for 1 minute. On a successful save, a creature\ntakes half as much damage only.",
    page: 247,
    endPage: 248,
    category: "staff",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:staff-of-withering",
    edition: "2024",
    name: "Staff of Withering",
    metadata: "Staff, Rare (Requires Attunement)",
    rules:
      "This staff has 3 charges and regains 1d3 expended\ncharges daily at dawn.\nThe staff can be wielded as a magic Quarterstaff.\nOn a hit, it deals damage as a normal Quarterstaff,\nand you can expend 1 charge to deal an extra 2d10\nNecrotic damage to the target and force it to make\na DC 15 Constitution saving throw. On a failed\nsave, the target has Disadvantage for 1 hour on any\nability check or saving throw that uses Strength or\nConstitution.",
    page: 248,
    endPage: 248,
    category: "staff",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:stone-of-controlling-earth-elementals",
    edition: "2024",
    name: "Stone of Controlling Earth Elementals",
    metadata: "Wondrous Item, Rare",
    rules:
      "While touching this 5-pound stone to the ground,\nyou can take a Magic action to summon an Earth\nElemental. The elemental appears in an unoccupied\nspace you choose within 30 feet of yourself, obeys\nyour commands, and takes its turn immediately\nafter you on your Initiative count. The elemental\ndisappears after 1 hour, when it dies, or when you\ndismiss it as a Bonus Action. The stone can’t be used\nthis way again until the next dawn.",
    page: 248,
    endPage: 248,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:stone-of-good-luck-luckstone",
    edition: "2024",
    name: "Stone of Good Luck (Luckstone)",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules: "While this polished agate is on your person, you\ngain a +1 bonus to ability checks and saving throws.",
    page: 248,
    endPage: 248,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:sun-blade",
    edition: "2024",
    name: "Sun Blade",
    metadata: "Weapon (Longsword), Rare (Requires Attunement)",
    rules:
      "This item appears to be a sword hilt.\nBlade of Radiance. While grasping the hilt, you\ncan take a Bonus Action to cause a blade of pure\nradiance to spring into existence or make the\nblade disappear. While the blade exists, this magic\nweapon functions as a Longsword with the Finesse\nproperty. If you are proficient with Longswords or\nShortswords, you are proficient with the Sun Blade.\nYou gain a +2 bonus to attack rolls and damage\nrolls made with this weapon, which deals Radiant\ndamage instead of Slashing damage. When you hit\nan Undead with it, that target takes an extra 1d8\nRadiant damage.\nSunlight. The sword’s luminous blade emits\nBright Light in a 15-foot radius and Dim Light for\nan additional 15 feet. The light is sunlight. While\nthe blade persists, you can take a Magic action to\nexpand or reduce its radius of Bright Light and Dim\nLight by 5 feet each, to a maximum of 30 feet each\nor a minimum of 10 feet each.",
    page: 248,
    endPage: 248,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:sword-of-life-stealing",
    edition: "2024",
    name: "Sword of Life Stealing",
    metadata: "Weapon (Glaive, Greatsword, Longsword, Rapier, Scimitar, or Shortsword), Rare (Requires Attunement)",
    rules:
      "When you attack a creature with this magic weapon\nand roll a 20 on the d20 for the attack roll, that\ntarget takes an extra 15 Necrotic damage if it isn’t\na Construct or an Undead, and you gain Temporary\nHit Points equal to the amount of Necrotic damage\ntaken.",
    page: 248,
    endPage: 248,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:sword-of-sharpness",
    edition: "2024",
    name: "Sword of Sharpness",
    metadata: "Weapon (Glaive, Greatsword, Longsword, or Scimitar), Very Rare (Requires Attunement)",
    rules:
      "When you attack an object with this magic weapon\nand hit, maximize your weapon damage dice\nagainst the target.\nWhen you attack a creature with this weapon\nand roll a 20 on the d20 for the attack roll, that target takes an extra 14 Slashing damage and gains\n1 Exhaustion level.",
    page: 248,
    endPage: 248,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:sword-of-wounding",
    edition: "2024",
    name: "Sword of Wounding",
    metadata: "Weapon (Glaive, Greatsword, Longsword, Rapier, Scimitar, or Shortsword), Rare (Requires Attunement)",
    rules:
      "When you hit a creature with an attack using\nthis magic weapon, the target takes an extra 2d6\nNecrotic damage and must succeed on a DC 15\nConstitution saving throw or be unable to regain Hit\nPoints for 1 hour. The target repeats the save at the\nend of each of its turns, ending the effect on itself on\na success.",
    page: 248,
    endPage: 248,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:talisman-of-pure-good",
    edition: "2024",
    name: "Talisman of Pure Good",
    metadata: "Wondrous Item, Legendary (Requires Attunement by a Cleric or Paladin)",
    rules:
      "This talisman is a mighty symbol of goodness. A\nFiend or an Undead that touches the talisman takes\n8d6 Radiant damage and takes the damage again\neach time it ends its turn holding or carrying the\ntalisman.\nHoly Symbol. You can use the talisman as a Holy\nSymbol. You gain a +2 bonus to spell attack rolls\nwhile you wear or hold it.\nPure Rebuke. The talisman has 7 charges. While\nwearing or holding the talisman, you can take a\nMagic action to expend 1 charge and target one\ncreature you can see on the ground within 120 feet\nof yourself. A flaming fissure opens under the target, and the target makes a DC 20 Dexterity saving\nthrow. If the target is a Fiend or an Undead, it has\nDisadvantage on the save. On a failed save, the target falls into the fissure and is destroyed, leaving no\nremains. On a successful save, the target isn’t cast\ninto the fissure but takes 4d6 Psychic damage from\nthe ordeal. In either case, the fissure then closes,\nleaving no trace of its existence. When you expend\nthe last charge, the talisman disperses into motes of\ngolden light and is destroyed.",
    page: 248,
    endPage: 249,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:talisman-of-the-sphere",
    edition: "2024",
    name: "Talisman of the Sphere",
    metadata: "Wondrous Item, Legendary (Requires Attunement)",
    rules:
      "While holding or wearing this talisman, you have\nAdvantage on any Intelligence (Arcana) check you\nmake to control a Sphere of Annihilation. In addition,\nwhen you start your turn in control of a Sphere of\nAnnihilation, you can take a Magic action to move it\n10 feet plus a number of additional feet equal to 10\ntimes your Intelligence modifier. This movement\ndoesn’t have to be in a straight line.",
    page: 249,
    endPage: 249,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:talisman-of-ultimate-evil",
    edition: "2024",
    name: "Talisman of Ultimate Evil",
    metadata: "Wondrous Item, Legendary (Requires Attunement)",
    rules:
      "This item symbolizes unrepentant evil. A creature\nthat isn’t a Fiend or an Undead that touches the\ntalisman takes 8d6 Necrotic damage and takes the\ndamage again each time it ends its turn holding or\ncarrying the talisman.\nHoly Symbol. You can use the talisman as a Holy\nSymbol. You gain a +2 bonus to spell attack rolls\nwhile you wear or hold it.\nUltimate End. The talisman has 6 charges. While\nwearing or holding the talisman, you can take a\nMagic action to expend 1 charge and target one\ncreature you can see on the ground within 120\nfeet of yourself. A flaming fissure opens under the\ntarget, and the target makes a DC 20 Dexterity\nsaving throw. If the target is a Celestial, it has Disadvantage on the save. On a failed save, the target\nfalls into the fissure and is destroyed, leaving no remains. On a successful save, the target isn’t cast into\nthe fissure but takes 4d6 Psychic damage from the\nordeal. In either case, the fissure then closes, leaving no trace of its existence. When you expend the\nlast charge, the talisman dissolves into foul-smelling slime and is destroyed.",
    page: 249,
    endPage: 249,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:thunderous-greatclub",
    edition: "2024",
    name: "Thunderous Greatclub",
    metadata: "Weapon (Greatclub), Very Rare (Requires Attunement)",
    rules:
      "While you are attuned to this magic weapon, your\nStrength is 20 unless your Strength is already equal\nto or greater than that score. The weapon deals an\nextra 1d8 Thunder damage to any creature it hits\nand an extra 3d8 Thunder damage to objects it hits\nthat aren’t being worn or carried.\nThe weapon has the following additional\nproperties.\nClap of Thunder. As a Magic action, you can strike\nthe weapon against a hard surface to create a loud\nclap of thunder audible out to 300 feet. You also create a 30-foot Cone of thunderous energy. Each creature in the Cone must succeed on a DC 15 Strength\nsaving throw or have the Prone condition. Nonmagical objects in the Cone that aren’t being worn or\ncarried take 3d8 Thunder damage.\nEarthquake. As a Magic action, you can strike\nthe weapon against the ground to create an intense\nseismic disturbance in a 50-foot-radius circle centered on the point of impact. Structures in contact\nwith the ground in that area take 50 Bludgeoning\ndamage, and each creature on the ground in that\narea must succeed on a DC 20 Dexterity saving\nthrow or have the Prone condition. If that creature\nis also concentrating, it must succeed on a DC 20\nConstitution saving throw, or its Concentration is\nbroken. In addition, you can cause a 30-foot-deep,\n10-foot-wide fissure to open up on the ground anywhere in the area. Any creature on a spot where the\nfissure opens must make a DC 20 Dexterity saving\nthrow, falling into the fissure on a failed save or\nmoving with the fissure’s edge on a successful one.\nAny structure on a spot where the fissure opens collapses into the fissure. Once you use this property, it\ncan’t be used again until the next dawn.",
    page: 249,
    endPage: 249,
    category: "weapon",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:tome-of-clear-thought",
    edition: "2024",
    name: "Tome of Clear Thought",
    metadata: "Wondrous Item, Very Rare",
    rules:
      "This book contains memory and logic exercises,\nand its words are charged with magic. If you spend\n48 hours over a period of 6 days or fewer studying\nthe book’s contents and practicing its guidelines,\nyour Intelligence increases by 2, to a maximum of\n30. The manual then loses its magic but regains it in\na century.",
    page: 249,
    endPage: 249,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:tome-of-leadership-and-influence",
    edition: "2024",
    name: "Tome of Leadership and Influence",
    metadata: "Wondrous Item, Very Rare",
    rules:
      "This book contains guidelines for influencing and\ncharming others, and its words are charged with\nmagic. If you spend 48 hours over a period of 6 days\nor fewer studying the book’s contents and practicing its guidelines, your Charisma increases by 2, to\na maximum of 30. The manual then loses its magic\nbut regains it in a century.",
    page: 249,
    endPage: 250,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:tome-of-understanding",
    edition: "2024",
    name: "Tome of Understanding",
    metadata: "Wondrous Item, Very Rare",
    rules:
      "This book contains intuition and insight exercises,\nand its words are charged with magic. If you spend\n48 hours over a period of 6 days or fewer studying\nthe book’s contents and practicing its guidelines,\nyour Wisdom increases by 2, to a maximum of 30.\nThe manual then loses its magic, but regains it in\na century.",
    page: 250,
    endPage: 250,
    category: "wondrous",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:trident-of-fish-command",
    edition: "2024",
    name: "Trident of Fish Command",
    metadata: "Weapon (Trident), Uncommon (Requires Attunement)",
    rules:
      "This magic weapon has 3 charges, and it regains\n1d3 expended charges daily at dawn. While you\ncarry it, you can expend 1 charge to cast Dominate\nBeast (save DC 15) from it on a Beast that has a\nSwim Speed.",
    page: 250,
    endPage: 250,
    category: "weapon",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:universal-solvent",
    edition: "2024",
    name: "Universal Solvent",
    metadata: "Wondrous Item, Legendary",
    rules:
      "This tube holds milky liquid with a strong alcohol\nsmell. When found, a tube contains 1d6 + 1 ounces.\nYou can take a Utilize action to pour 1 or more\nounces of solvent from the tube onto a surface\nwithin reach. Each ounce instantly dissolves up to 1\nsquare foot of adhesive it touches, including Sovereign Glue.",
    page: 250,
    endPage: 250,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:vicious-weapon",
    edition: "2024",
    name: "Vicious Weapon",
    metadata: "Weapon (Any Simple or Martial), Rare",
    rules:
      "This magic weapon deals an extra 2d6 damage to\nany creature it hits. This extra damage is of the\nsame type as the weapon’s normal damage.",
    page: 250,
    endPage: 250,
    category: "weapon",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:vorpal-sword",
    edition: "2024",
    name: "Vorpal Sword",
    metadata: "Weapon (Glaive, Greatsword, Longsword, or Scimitar), Legendary (Requires Attunement)",
    rules:
      "You gain a +3 bonus to attack rolls and damage\nrolls made with this magic weapon. In addition, the\nweapon ignores Resistance to Slashing damage.\nWhen you use this weapon to attack a creature\nthat has at least one head and roll a 20 on the d20\nfor the attack roll, you cut off one of the creature’s\nheads. The creature dies if it can’t survive without\nthe lost head. A creature is immune to this effect\nif it has Immunity to Slashing damage, if it doesn’t\nhave or need a head, or if the GM decides that the\ncreature is too big for its head to be cut off with this\nweapon. Such a creature instead takes an extra 30\nSlashing damage from the hit. If the creature has\nLegendary Resistance, it can expend one daily use\nof that trait to avoid losing its head, taking the extra\ndamage instead.",
    page: 250,
    endPage: 250,
    category: "weapon",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:wand-of-binding",
    edition: "2024",
    name: "Wand of Binding",
    metadata: "Wand, Rare (Requires Attunement)",
    rules:
      "This wand has 7 charges.\nSpells. While holding the wand, you can cast one\nof the spells (save DC 17) on the following table\nfrom it. The table indicates how many charges you\nmust expend to cast the spell.\nSpell Charge\nCost\nHold Monster 5\nHold Person 2\nRegaining Charges. The wand regains 1d6 +\n1 expended charges daily at dawn. If you expend\nthe wand’s last charge, roll 1d20. On a 1, the wand\ncrumbles into ashes and is destroyed.",
    page: 250,
    endPage: 250,
    category: "wand",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:wand-of-enemy-detection",
    edition: "2024",
    name: "Wand of Enemy Detection",
    metadata: "Wand, Rare (Requires Attunement)",
    rules:
      "This wand has 7 charges. While holding it, you can\ntake a Magic action to expend 1 charge. For 1 minute, you know the direction of the nearest creature\nHostile to you within 60 feet, but not its distance\nfrom you. The wand can sense the presence of Hostile creatures that are Invisible, ethereal, disguised,\nor hidden, as well as those in plain sight. The effect\nends if you stop holding the wand.\nRegaining Charges. The wand regains 1d6 +\n1 expended charges daily at dawn. If you expend\nthe wand’s last charge, roll 1d20. On a 1, the wand\ncrumbles into ashes and is destroyed.",
    page: 250,
    endPage: 250,
    category: "wand",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:wand-of-fear",
    edition: "2024",
    name: "Wand of Fear",
    metadata: "Wand, Rare (Requires Attunement)",
    rules:
      "This wand has 7 charges.\nSpells. While holding the wand, you can cast one\nof the spells (save DC 15) on the following table\nfrom it. The table indicates how many charges you\nmust expend to cast the spell.\nCharge\nSpell Cost\nCommand (“flee” or “grovel” only) 1\nFear (60-foot Cone) 3\nRegaining Charges. The wand regains 1d6 +\n1 expended charges daily at dawn. If you expend\nthe wand’s last charge, roll 1d20. On a 1, the wand\ncrumbles into ashes and is destroyed.",
    page: 250,
    endPage: 250,
    category: "wand",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:wand-of-fireballs",
    edition: "2024",
    name: "Wand of Fireballs",
    metadata: "Wand, Rare (Requires Attunement by a Spellcaster)",
    rules:
      "This wand has 7 charges. While holding it, you can\nexpend no more than 3 charges to cast Fireball (save\nDC 15) from it. For 1 charge, you cast the level 3 version of the spell. You can increase the spell’s level by\n1 for each additional charge you expend.\nRegaining Charges. The wand regains 1d6 +\n1 expended charges daily at dawn. If you expend\nthe wand’s last charge, roll 1d20. On a 1, the wand\ncrumbles into ashes and is destroyed.",
    page: 250,
    endPage: 251,
    category: "wand",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:wand-of-lightning-bolts",
    edition: "2024",
    name: "Wand of Lightning Bolts",
    metadata: "Wand, Rare (Requires Attunement by a Spellcaster)",
    rules:
      "This wand has 7 charges. While holding it, you can\nexpend no more than 3 charges to cast Lightning\nBolt (save DC 15) from it. For 1 charge, you cast\nthe level 3 version of the spell. You can increase\nthe spell’s level by 1 for each additional charge you\nexpend.\nRegaining Charges. The wand regains 1d6 +\n1 expended charges daily at dawn. If you expend\nthe wand’s last charge, roll 1d20. On a 1, the wand\ncrumbles into ashes and is destroyed.",
    page: 251,
    endPage: 251,
    category: "wand",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:wand-of-magic-detection",
    edition: "2024",
    name: "Wand of Magic Detection",
    metadata: "Wand, Uncommon",
    rules:
      "This wand has 3 charges. While holding it, you can\nexpend 1 charge to cast Detect Magic from it. The\nwand regains 1d3 expended charges daily at dawn.",
    page: 251,
    endPage: 251,
    category: "wand",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:wand-of-magic-missiles",
    edition: "2024",
    name: "Wand of Magic Missiles",
    metadata: "Wand, Uncommon",
    rules:
      "This wand has 7 charges. While holding it, you can\nexpend no more than 3 charges to cast Magic Missile\nfrom it. For 1 charge, you cast the level 1 version of\nthe spell. You can increase the spell’s level by 1 for\neach additional charge you expend.\nRegaining Charges. The wand regains 1d6 +\n1 expended charges daily at dawn. If you expend\nthe wand’s last charge, roll 1d20. On a 1, the wand\ncrumbles into ashes and is destroyed.",
    page: 251,
    endPage: 251,
    category: "wand",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:wand-of-paralysis",
    edition: "2024",
    name: "Wand of Paralysis",
    metadata: "Wand, Rare (Requires Attunement by a Spellcaster)",
    rules:
      "This wand has 7 charges. While holding it, you can\ntake a Magic action to expend 1 charge to cause a\nthin blue ray to streak from the tip toward a creature you can see within 60 feet of yourself. The\ntarget must succeed on a DC 15 Constitution saving\nthrow or have the Paralyzed condition for 1 minute.\nAt the end of each of the target’s turns, it repeats\nthe save, ending the effect on itself on a success.\nRegaining Charges. The wand regains 1d6 +\n1 expended charges daily at dawn. If you expend\nthe wand’s last charge, roll 1d20. On a 1, the wand\ncrumbles into ashes and is destroyed.",
    page: 251,
    endPage: 251,
    category: "wand",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:wand-of-polymorph",
    edition: "2024",
    name: "Wand of Polymorph",
    metadata: "Wand, Very Rare (Requires Attunement by a Spellcaster)",
    rules:
      "This wand has 7 charges. While holding it, you can\nexpend 1 charge to cast Polymorph (save DC 15)\nfrom it.\nRegaining Charges. The wand regains 1d6 +\n1 expended charges daily at dawn. If you expend\nthe wand’s last charge, roll 1d20. On a 1, the wand\ncrumbles into ashes and is destroyed.",
    page: 251,
    endPage: 251,
    category: "wand",
    rarities: ["veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:wand-of-secrets",
    edition: "2024",
    name: "Wand of Secrets",
    metadata: "Wand, Uncommon",
    rules:
      "This wand has 3 charges and regains 1d3 expended\ncharges daily at dawn. While holding it, you can\ntake a Magic action to expend 1 charge, and if a secret door or trap is within 60 feet of you, the wand\npulses and points at the one nearest to you.",
    page: 251,
    endPage: 251,
    category: "wand",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:wand-of-the-war-mage-1-2-or-3",
    edition: "2024",
    name: "Wand of the War Mage, +1, +2, or +3",
    metadata: "Wand, Uncommon (+1), Rare (+2), or Very Rare (+3) (Requires Attunement by a Spellcaster)",
    rules:
      "While holding this wand, you gain a bonus to spell\nattack rolls determined by the wand’s rarity. In addition, you ignore Half Cover when making a spell\nattack roll.",
    page: 251,
    endPage: 251,
    category: "wand",
    rarities: ["uncommon", "rare", "veryRare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:wand-of-web",
    edition: "2024",
    name: "Wand of Web",
    metadata: "Wand, Uncommon (Requires Attunement by a Spellcaster)",
    rules:
      "This wand has 7 charges. While holding it, you can\nexpend 1 charge to cast Web (save DC 13) from it.\nRegaining Charges. The wand regains 1d6 +\n1 expended charges daily at dawn. If you expend\nthe wand’s last charge, roll 1d20. On a 1, the wand\ncrumbles into ashes and is destroyed.",
    page: 251,
    endPage: 251,
    category: "wand",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:wand-of-wonder",
    edition: "2024",
    name: "Wand of Wonder",
    metadata: "Wand, Rare (Requires Attunement)",
    rules:
      "This wand has 7 charges. While holding it, you can\ntake a Magic action to expend 1 charge while choosing a point within 120 feet of yourself. That location becomes the point of origin of a spell or other\nmagical effect determined by rolling on the Wand\nof Wonder Effects table. Spells cast from the wand\nhave a save DC of 15. If a spell’s maximum range\nis normally less than 120 feet, it becomes 120 feet\nwhen cast from the wand. If an effect has multiple\npossible subjects, the GM determines randomly\nwhich among them are affected.\nRegaining Charges. The wand regains 1d6 +\n1 expended charges daily at dawn. If you expend\nthe wand’s last charge, roll 1d20. On a 1, the wand\ncrumbles into dust and is destroyed.\nWand of Wonder Effects\n1d100 Effect\n01–20 You cast a spell originating from the chosen\npoint. Roll 1d10 to determine the spell: on a\n1–2, Darkness; on a 3–4, Faerie Fire; on a 5–6,\nFireball; on a 7–8, Slow; on a 9–10, Stinking\nCloud.\n21–25 Nothing happens at the chosen point of origin.\nInstead, you have the Stunned condition until\nthe start of your next turn, believing something awesome just happened.\n26–30 You cast Gust of Wind. The Line created by the\nspell extends from you to the chosen point of\norigin.\n31–35 Nothing happens at the chosen point of origin.\nInstead, you take 1d6 Psychic damage.\n36–40 Heavy rain falls for 1 minute in a 120-foothigh, 60-foot-radius Cylinder centered on the\nchosen point of origin. During that time, the\narea of effect is Lightly Obscured.\n41–45 A cloud of 600 oversized butterflies fills a\n60-foot-high, 30-foot-radius Cylinder centered\non the chosen point of origin. The butterflies\nremain for 10 minutes, during which time the\narea of effect is Heavily Obscured.\n46–50 You cast Lightning Bolt. The Line created by the\nspell extends from you to the chosen point of\norigin.\n51–55 The creature closest to the chosen point of\norigin is enlarged as if you had cast Enlarge/\nReduce on it. If the target isn’t you and can’t be\naffected by that spell, you become the target\ninstead.\n56–60 A magically formed creature appears in an\nunoccupied space as close to the chosen point\nof origin as possible. The creature isn’t under\nyour control, acts as it normally would, and\ndisappears after 1 hour or when it drops to 0\nHit Points. Roll 1d4 to determine which creature appears. On a 1, a Rhinoceros appears;\non a 2, an Elephant appears; and on a 3–4, a\nRat appears.\n61–64 Grass covers a 60-foot-radius circle of ground,\nwith the center of that circle as close to the\nchosen point of origin as possible. Grass that’s\nalready there grows to ten times its normal\nsize and remains overgrown for 1 minute.\n1d100 Effect\n65–68 An object of the GM’s choice disappears into\nthe Ethereal Plane. The object must be neither\nworn nor carried, within 120 feet of the chosen point of origin, and no larger than 10 feet\nin any dimension. If there are no such objects\nin range, nothing happens.\n69–72 Nothing happens at the chosen point of origin.\nInstead, you shrink as if you had cast Enlarge/\nReduce on yourself and remain in that state for\n1 minute.\n73–77 Leaves grow from the creature nearest to the\nchosen point of origin. Unless they are picked\noff, the leaves turn brown and fall off after 24\nhours.\n78–82 Nothing happens at the chosen point of origin.\nInstead, a burst of colorful, shimmering light\nextends from you in a 30-foot Emanation.\nEach creature in the area must succeed on a\nDC 15 Constitution saving throw or have the\nBlinded condition for 1 minute. A creature repeats the save at the end of each of its turns,\nending the effect on itself on a success.\n83–87 Nothing happens at the chosen point of origin.\nInstead, you cast Invisibility on yourself.\n88–92 Nothing happens at the chosen point of origin. Instead, a stream of 1d4 × 10 gems, each\nworth 1 GP, shoots from the wand’s tip in a\nLine 30 feet long and 5 feet wide toward the\nchosen point of origin. Each gem deals 1 Bludgeoning damage, and the total damage of the\ngems is divided equally among all creatures in\nthe Line.\n93–97 You cast Polymorph, targeting the creature\nclosest to the chosen point of origin. Roll 1d4\nto determine the target’s new form. On a 1,\nthe new form is a Black Bear; on a 2, the\nnew form is a Giant Wasp; on a 3–4, the new\nform is a Frog.\n98–00 The creature closest to the chosen point of\norigin makes a DC 15 Constitution saving\nthrow. On a failed save, the creature has the\nRestrained condition and begins to turn to\nstone. While Restrained in this way, the creature repeats the save at the end of its next\nturn. On a successful save, the effect ends.\nOn a failed save, the creature has the Petrified\ncondition instead of the Restrained condition.\nThe petrification lasts until the creature is\nfreed by the Greater Restoration spell or similar\nmagic.",
    page: 251,
    endPage: 252,
    category: "wand",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:weapon-1-2-or-3",
    edition: "2024",
    name: "Weapon, +1, +2, or +3",
    metadata: "Weapon (Any Simple or Martial), Uncommon (+1), Rare (+2), or Very Rare (+3)",
    rules:
      "You have a bonus to attack rolls and damage rolls\nmade with this magic weapon. The bonus is determined by the weapon’s rarity.",
    page: 253,
    endPage: 253,
    category: "weapon",
    rarities: ["uncommon", "rare", "veryRare"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:weapon-of-warning",
    edition: "2024",
    name: "Weapon of Warning",
    metadata: "Weapon (Any Simple or Martial), Uncommon (Requires Attunement)",
    rules:
      "As long as this weapon is within your reach and you\nare attuned to it, you and allies within 30 feet of you\ngain the following benefits.\nAlarm. The weapon magically awakens each subject who is sleeping naturally when combat begins.\nThis benefit doesn’t wake a subject from magically\ninduced sleep.\nSupernatural Readiness. Each subject has Advantage on its Initiative rolls.",
    page: 253,
    endPage: 253,
    category: "weapon",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:well-of-many-worlds",
    edition: "2024",
    name: "Well of Many Worlds",
    metadata: "Wondrous Item, Legendary",
    rules:
      "This fine black cloth, soft as silk, is folded up to the\ndimensions of a handkerchief. It unfolds into a circular sheet 6 feet in diameter.\nYou can take a Magic action to unfold the Well of\nMany Worlds and place it on a solid surface, whereupon it forms a two-way, 6-foot-diameter, circular\nportal to another world or plane of existence. Each\ntime the item opens a portal, the GM decides where\nit leads. The portal remains open until a creature\nwithin 5 feet of it takes a Magic action to close it\nby taking hold of the edges of the cloth and folding\nit up.\nOnce the Well of Many Worlds has opened a portal,\nit can’t do so again for 1d8 hours.",
    page: 253,
    endPage: 253,
    category: "wondrous",
    rarities: ["legendary"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:wind-fan",
    edition: "2024",
    name: "Wind Fan",
    metadata: "Wondrous Item, Uncommon",
    rules:
      "While holding this fan, you can cast Gust of Wind\n(save DC 13) from it. Each subsequent time the fan\nis used before the next dawn, it has a cumulative\n20 percent chance of not working; if the fan fails to\nwork, it tears into useless, nonmagical tatters.",
    page: 253,
    endPage: 253,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: false
  },
  {
    id: "srd521:winged-boots",
    edition: "2024",
    name: "Winged Boots",
    metadata: "Wondrous Item, Uncommon (Requires Attunement)",
    rules:
      "These boots have 4 charges and regain 1d4 expended charges daily at dawn. While wearing the\nboots, you can take a Magic action to expend 1\ncharge, gaining a Fly Speed of 30 feet for 1 hour. If\nyou are flying when the duration expires, you descend at a rate of 30 feet per round until you land.",
    page: 253,
    endPage: 253,
    category: "wondrous",
    rarities: ["uncommon"],
    rarityVaries: false,
    attunement: true
  },
  {
    id: "srd521:wings-of-flying",
    edition: "2024",
    name: "Wings of Flying",
    metadata: "Wondrous Item, Rare (Requires Attunement)",
    rules:
      "While wearing this cloak, you can take a Magic action to turn the cloak into a pair of wings on your\nback. The wings lasts for 1 hour or until you end the\neffect early as a Magic action. The wings give you a\nFly Speed of 60 feet. If you are aloft when the wings\ndisappear, you fall. When the wings disappear, you\ncan’t use them again for 1d12 hours.",
    page: 253,
    endPage: 253,
    category: "wondrous",
    rarities: ["rare"],
    rarityVaries: false,
    attunement: true
  }
];

// Static crop data file
export const getDefaultIcon = (cropName) => {
  const defaultIcons = {
    wheat: '🌾',
    maize: '🌽',
    corn: '🌽',
    potato: '🥔',
    onion: '🧅',
    rice: '🍚',
    tomato: '🍅',
    carrot: '🥕',
    cabbage: '🥬',
  };
  return defaultIcons[cropName?.toLowerCase()] || '🌱';
};

export const CROP_LIFECYCLE = {
  wheat: [
    { stage: 'Seeding', duration: '0-7 days', description: 'Plant seeds in prepared soil' },
    { stage: 'Germination', duration: '7-14 days', description: 'Seeds sprout and emerge' },
    { stage: 'Tillering', duration: '14-45 days', description: 'Plant develops multiple shoots' },
    { stage: 'Stem Extension', duration: '45-75 days', description: 'Stems grow taller rapidly' },
    { stage: 'Flowering', duration: '75-90 days', description: 'Flowers appear and pollinate' },
    { stage: 'Grain Filling', duration: '90-120 days', description: 'Grains develop and mature' },
    { stage: 'Harvest', duration: '120-150 days', description: 'Ready for harvesting' },
  ],
  maize: [
    { stage: 'Planting', duration: '0-5 days', description: 'Plant seeds in rows' },
    { stage: 'Emergence', duration: '5-10 days', description: 'Seedlings emerge from soil' },
    { stage: 'V6 Stage', duration: '10-35 days', description: '6 leaves fully developed' },
    { stage: 'Tasseling', duration: '35-60 days', description: 'Tassels appear at top' },
    { stage: 'Silking', duration: '60-70 days', description: 'Silk strands emerge from ears' },
    { stage: 'Grain Filling', duration: '70-100 days', description: 'Kernels develop and fill' },
    { stage: 'Maturity', duration: '100-120 days', description: 'Ready for harvest' },
  ],
  potato: [
    { stage: 'Planting', duration: '0-7 days', description: 'Plant seed potatoes' },
    { stage: 'Sprouting', duration: '7-21 days', description: 'Shoots emerge from soil' },
    { stage: 'Vegetative Growth', duration: '21-45 days', description: 'Leaves and stems develop' },
    { stage: 'Tuber Initiation', duration: '45-60 days', description: 'Small tubers begin forming' },
    { stage: 'Tuber Bulking', duration: '60-90 days', description: 'Tubers grow larger' },
    { stage: 'Maturation', duration: '90-120 days', description: 'Tubers reach full size' },
  ],
  onion: [
    { stage: 'Seeding', duration: '0-7 days', description: 'Plant seeds or sets' },
    { stage: 'Germination', duration: '7-14 days', description: 'Green shoots appear' },
    { stage: 'Leaf Development', duration: '14-60 days', description: 'Leaves grow and multiply' },
    { stage: 'Bulbing', duration: '60-90 days', description: 'Bulbs begin to form' },
    { stage: 'Bulb Maturation', duration: '90-120 days', description: 'Bulbs reach full size' },
  ],
  rice: [
    { stage: 'Seeding', duration: '0-7 days', description: 'Seeds planted in nursery' },
    { stage: 'Germination', duration: '7-21 days', description: 'Seedlings emerge' },
    { stage: 'Transplanting', duration: '21-28 days', description: 'Move to main field' },
    { stage: 'Tillering', duration: '28-65 days', description: 'Multiple shoots develop' },
    { stage: 'Panicle Initiation', duration: '65-85 days', description: 'Flower heads form' },
    { stage: 'Flowering', duration: '85-105 days', description: 'Pollination occurs' },
    { stage: 'Grain Filling', duration: '105-135 days', description: 'Grains develop' },
    { stage: 'Maturity', duration: '135-150 days', description: 'Ready for harvest' },
  ],
  tomato: [
    { stage: 'Seeding', duration: '0-7 days', description: 'Start seeds indoors' },
    { stage: 'Germination', duration: '7-14 days', description: 'Seedlings emerge' },
    { stage: 'Transplanting', duration: '14-21 days', description: 'Move to garden' },
    { stage: 'Vegetative Growth', duration: '21-45 days', description: 'Leaves and stems grow' },
    { stage: 'Flowering', duration: '45-60 days', description: 'First flowers appear' },
    { stage: 'Fruit Set', duration: '60-75 days', description: 'Small fruits form' },
    { stage: 'Fruit Development', duration: '75-100 days', description: 'Fruits grow and ripen' },
  ],
  carrot: [
    { stage: 'Seeding', duration: '0-7 days', description: 'Direct sow seeds' },
    { stage: 'Germination', duration: '7-21 days', description: 'Seedlings emerge slowly' },
    { stage: 'Leaf Development', duration: '21-35 days', description: 'Feathery leaves grow' },
    { stage: 'Root Development', duration: '35-60 days', description: 'Roots begin to thicken' },
    { stage: 'Root Maturation', duration: '60-80 days', description: 'Carrots reach full size' },
  ],
  cabbage: [
    { stage: 'Seeding', duration: '0-7 days', description: 'Start seeds indoors' },
    { stage: 'Germination', duration: '7-14 days', description: 'Seedlings emerge' },
    { stage: 'Transplanting', duration: '14-21 days', description: 'Move to garden' },
    { stage: 'Leaf Growth', duration: '21-60 days', description: 'Outer leaves develop' },
    { stage: 'Head Formation', duration: '60-80 days', description: 'Tight head forms' },
    { stage: 'Head Maturation', duration: '80-100 days', description: 'Head reaches full size' },
  ],
};

export const CROP_CARE_STEPS = {
  wheat: [
    { id: 1, task: 'Initial watering after seeding', stage: 'Seeding', priority: 'high' },
    { id: 2, task: 'Monitor for germination', stage: 'Germination', priority: 'medium' },
    { id: 3, task: 'Apply nitrogen fertilizer', stage: 'Tillering', priority: 'high' },
    { id: 4, task: 'Control weeds', stage: 'Tillering', priority: 'high' },
    { id: 5, task: 'Irrigate every 7-10 days', stage: 'Stem Extension', priority: 'high' },
    { id: 6, task: 'Monitor for rust and aphids', stage: 'Flowering', priority: 'medium' },
    { id: 7, task: 'Reduce watering before harvest', stage: 'Grain Filling', priority: 'medium' },
  ],
  maize: [
    { id: 1, task: 'Ensure proper seed spacing', stage: 'Planting', priority: 'high' },
    { id: 2, task: 'Water gently to avoid seed displacement', stage: 'Emergence', priority: 'medium' },
    { id: 3, task: 'Apply fertilizer at V6 stage', stage: 'V6 Stage', priority: 'high' },
    { id: 4, task: 'Monitor for corn borer', stage: 'V6 Stage', priority: 'medium' },
    { id: 5, task: 'Irrigate twice weekly', stage: 'Tasseling', priority: 'high' },
    { id: 6, task: 'Check for leaf blight', stage: 'Silking', priority: 'medium' },
    { id: 7, task: 'Reduce watering as ears mature', stage: 'Grain Filling', priority: 'medium' },
  ],
  potato: [
    { id: 1, task: 'Plant in well-drained soil', stage: 'Planting', priority: 'high' },
    { id: 2, task: 'Water lightly until sprouting', stage: 'Sprouting', priority: 'medium' },
    { id: 3, task: 'Begin hilling process', stage: 'Vegetative Growth', priority: 'high' },
    { id: 4, task: 'Monitor for late blight', stage: 'Tuber Initiation', priority: 'medium' },
    { id: 5, task: 'Continue regular hilling', stage: 'Tuber Bulking', priority: 'high' },
    { id: 6, task: 'Check for Colorado beetle', stage: 'Tuber Bulking', priority: 'medium' },
    { id: 7, task: 'Stop watering 2 weeks before harvest', stage: 'Maturation', priority: 'high' },
  ],
  onion: [
    { id: 1, task: 'Keep soil consistently moist', stage: 'Seeding', priority: 'high' },
    { id: 2, task: 'Thin overcrowded seedlings', stage: 'Germination', priority: 'medium' },
    { id: 3, task: 'Control weeds regularly', stage: 'Leaf Development', priority: 'high' },
    { id: 4, task: 'Apply light fertilizer', stage: 'Leaf Development', priority: 'medium' },
    { id: 5, task: 'Reduce watering frequency', stage: 'Bulbing', priority: 'high' },
    { id: 6, task: 'Stop watering 2-3 weeks before harvest', stage: 'Bulb Maturation', priority: 'high' },
  ],
  rice: [
    { id: 1, task: 'Maintain proper water level in nursery', stage: 'Seeding', priority: 'high' },
    { id: 2, task: 'Monitor seedling growth', stage: 'Germination', priority: 'medium' },
    { id: 3, task: 'Prepare main field with standing water', stage: 'Transplanting', priority: 'high' },
    { id: 4, task: 'Maintain 2-3cm water depth', stage: 'Tillering', priority: 'high' },
    { id: 5, task: 'Apply fertilizer at PI stage', stage: 'Panicle Initiation', priority: 'high' },
    { id: 6, task: 'Watch for blast disease', stage: 'Flowering', priority: 'medium' },
    { id: 7, task: 'Drain field before harvest', stage: 'Maturity', priority: 'high' },
  ],
  tomato: [
    { id: 1, task: 'Keep seeds warm and moist', stage: 'Seeding', priority: 'high' },
    { id: 2, task: 'Provide adequate light', stage: 'Germination', priority: 'medium' },
    { id: 3, task: 'Harden off before transplanting', stage: 'Transplanting', priority: 'high' },
    { id: 4, task: 'Install support stakes', stage: 'Vegetative Growth', priority: 'high' },
    { id: 5, task: 'Water consistently', stage: 'Flowering', priority: 'high' },
    { id: 6, task: 'Prune suckers regularly', stage: 'Fruit Set', priority: 'medium' },
    { id: 7, task: 'Monitor for hornworms', stage: 'Fruit Development', priority: 'medium' },
  ],
  carrot: [
    { id: 1, task: 'Keep soil consistently moist', stage: 'Seeding', priority: 'high' },
    { id: 2, task: 'Be patient - slow germination', stage: 'Germination', priority: 'low' },
    { id: 3, task: 'Thin seedlings to prevent crowding', stage: 'Leaf Development', priority: 'high' },
    { id: 4, task: 'Ensure loose, well-draining soil', stage: 'Root Development', priority: 'high' },
    { id: 5, task: 'Check root diameter regularly', stage: 'Root Maturation', priority: 'medium' },
  ],
  cabbage: [
    { id: 1, task: 'Maintain consistent moisture', stage: 'Seeding', priority: 'high' },
    { id: 2, task: 'Provide adequate light', stage: 'Germination', priority: 'medium' },
    { id: 3, task: 'Transplant when 4-6 inches tall', stage: 'Transplanting', priority: 'high' },
    { id: 4, task: 'Apply mulch around plants', stage: 'Leaf Growth', priority: 'medium' },
    { id: 5, task: 'Monitor for cabbage worms', stage: 'Head Formation', priority: 'high' },
    { id: 6, task: 'Check head firmness', stage: 'Head Maturation', priority: 'medium' },
  ],
};

export const CROP_WEATHER = {
  wheat: 'Cool, dry climate (15-25°C)',
  maize: 'Warm, moist climate (16-27°C)',
  potato: 'Cool, frost-free (15-21°C)',
  onion: 'Mild, dry climate (12-24°C)',
  rice: 'Warm, humid (20-35°C)',
  tomato: 'Warm, sunny climate (18-27°C)',
  carrot: 'Cool, temperate (16-21°C)',
  cabbage: 'Cool, moist climate (15-20°C)',
};

export const GROWTH_DURATION = {
  wheat: '120-150 days',
  maize: '90-120 days',
  potato: '70-120 days',
  onion: '90-120 days',
  rice: '120-150 days',
  tomato: '80-100 days',
  carrot: '70-80 days',
  cabbage: '80-100 days',
};

export const CROP_TIPS = {
  wheat: [
    'Irrigate every 7-10 days during growing season.',
    'Control weeds in early stages for better yield.',
    'Apply nitrogen fertilizer at tillering stage.',
    'Monitor for rust and aphids regularly.',
  ],
  maize: [
    'Monitor for leaf blight and corn borer.',
    'Apply fertilizer at V6 stage for optimal growth.',
    'Irrigate twice a week during dry periods.',
    'Ensure adequate spacing between plants.',
  ],
  potato: [
    'Hill the plants regularly for better tuber yield.',
    'Avoid waterlogging to prevent root rot.',
    'Check for late blight and Colorado beetle regularly.',
    'Harvest when leaves start yellowing.',
  ],
  onion: [
    'Keep fields weed-free throughout growing season.',
    'Avoid overwatering to prevent bulb rot.',
    'Apply light irrigation during bulb development.',
    'Stop watering 2-3 weeks before harvest.',
  ],
  rice: [
    'Maintain 2-3cm standing water in fields.',
    'Watch for blast and brown spot diseases.',
    'Apply fertilizer at panicle initiation stage.',
    'Drain fields before harvest for easier cutting.',
  ],
  tomato: [
    'Provide support stakes for climbing varieties.',
    'Water consistently to prevent blossom end rot.',
    'Prune suckers for better fruit development.',
    'Monitor for hornworms and aphids.',
  ],
  carrot: [
    'Ensure loose, well-draining soil for straight roots.',
    'Thin seedlings to prevent overcrowding.',
    'Keep soil consistently moist but not waterlogged.',
    'Harvest when shoulders are 3/4 inch diameter.',
  ],
  cabbage: [
    'Provide consistent moisture for head formation.',
    'Apply mulch to retain soil moisture.',
    'Monitor for cabbage worms and aphids.',
    'Harvest when heads feel firm and solid.',
  ],
};
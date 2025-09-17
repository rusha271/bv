export interface ChakraPoint {
  id: string;
  name: string;
  direction: string;
  description: string;
  remedies: string;
  isAuspicious: boolean;
  shouldAvoid: boolean;
  imageUrl?: string;
}

export interface ChakraPointData {
  [key: string]: ChakraPoint;
}

// Default chakra points data based on the provided information
export const defaultChakraPoints: ChakraPointData = {
  // East Zone Entrances
  'E1': {
    id: 'E1',
    name: 'Shikhi',
    direction: 'East Zone Entrance',
    description: 'The Shikhi (E1) entrance is positioned as the first pada (zone) in the eastern direction, and it is generally considered unfavorable according to Vastu principles. A main entrance located in this zone is believed to attract negative energy that can manifest in the form of fire-related incidents, accidents, and substantial financial losses.',
    remedies: 'To neutralize the adverse effects of this entrance, it is advised to treat the area with an aluminum strip or apply blue tape. This remedy helps to stabilize the negative energies and reduce the likelihood of accidents and financial setbacks.',
    isAuspicious: false,
    shouldAvoid: false
  },
  'E2': {
    id: 'E2',
    name: 'Parjanya',
    direction: 'East Zone Entrance',
    description: 'The entrance located in the Parjanya (E2) zone tends to bring about challenges that lead to excessive and unnecessary expenditures. Households with this entrance are also believed to have a higher likelihood of welcoming more female children.',
    remedies: 'To neutralize these effects, it is advised to use an SS (stainless steel) strip or apply green tape at the entrance.',
    isAuspicious: false,
    shouldAvoid: false
  },
  'E3': {
    id: 'E3',
    name: 'Jayanta',
    direction: 'East Zone Entrance',
    description: 'Jayanta (E3) is considered one of the most favorable entrances in the eastern direction. Houses with an entrance here are said to attract significant wealth, prosperity, and overall success in various aspects of life.',
    remedies: 'No treatment is needed for this entrance as it is already beneficial.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'E4': {
    id: 'E4',
    name: 'Indra',
    direction: 'East Zone Entrance',
    description: 'The Indra (E4) entrance is another positive location in the east. It promotes fruitful social connections and strengthens relationships with influential people, particularly those in government or authoritative positions.',
    remedies: 'No treatment is required for this entrance.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'E5': {
    id: 'E5',
    name: 'Surya',
    direction: 'East Zone Entrance',
    description: 'The Surya (E5) entrance is known to influence the temperament of the residents, making them prone to aggression and impatience. This volatile nature may lead to poor decision-making, often resulting in undesirable consequences.',
    remedies: 'To counter these negative traits, it is advised to treat the entrance with an SS strip or green tape.',
    isAuspicious: false,
    shouldAvoid: false
  },
  'E6': {
    id: 'E6',
    name: 'Satya',
    direction: 'East Zone Entrance',
    description: 'Residents living in homes with the Satya (E6) entrance might find it difficult to remain truthful and committed to their promises. This entrance is said to foster deceitful behavior and may cause distress, especially to the daughters of the family.',
    remedies: 'An SS strip or green tape should be used at this entrance to mitigate its adverse effects.',
    isAuspicious: false,
    shouldAvoid: false
  },
  'E7': {
    id: 'E7',
    name: 'Bhrisha',
    direction: 'East Zone Entrance',
    description: 'It is generally advised to avoid placing the main entrance in the Bhrisha (E7) zone. This entrance tends to make the occupants less empathetic toward others\' problems and increases the likelihood of facing hostility from adversaries.',
    remedies: 'To reduce these negative influences, use an SS strip or green tape.',
    isAuspicious: false,
    shouldAvoid: true
  },
  'E8': {
    id: 'E8',
    name: 'Akash',
    direction: 'East Zone Entrance',
    description: 'Vastu principles strongly discourage locating the main entrance in the Akash (E8) zone. Such a placement is believed to invite severe financial losses, health issues, accidents, and even theft.',
    remedies: 'Treat the entrance with a copper strip or red tape to counteract these effects.',
    isAuspicious: false,
    shouldAvoid: true
  },
  
  // South Zone Entrances
  'S1': {
    id: 'S1',
    name: 'Anil',
    direction: 'South Zone Entrance',
    description: 'The Anil (S1) entrance is detrimental to the male children of the house. It may lead to conflicts between parents and sons, affecting family harmony.',
    remedies: 'A copper strip or red tape should be used to lessen these negative impacts.',
    isAuspicious: false,
    shouldAvoid: false
  },
  'S2': {
    id: 'S2',
    name: 'Poosha',
    direction: 'South Zone Entrance',
    description: 'The Poosha (S2) entrance, while attracting issues with relatives, is beneficial for individuals working in multinational companies. It supports career advancements, promotions, and salary increments.',
    remedies: 'To balance its effects, use a copper strip or red tape.',
    isAuspicious: false,
    shouldAvoid: false
  },
  'S3': {
    id: 'S3',
    name: 'Vitatha',
    direction: 'South Zone Entrance',
    description: 'Homes with the Vitatha (S3) entrance enjoy prosperity and success. However, while it enables residents to achieve their goals, it may also encourage them to adopt unethical practices.',
    remedies: 'No treatment is needed for this entrance.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'S4': {
    id: 'S4',
    name: 'Grihrakshita',
    direction: 'South Zone Entrance',
    description: 'The Grihrakshita (S4) entrance is regarded as the most auspicious in the south direction. It bestows fame, prosperity, and significant success, making it especially suitable for individuals in creative fields like acting or media.',
    remedies: 'No treatment is required for this highly beneficial entrance.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'S5': {
    id: 'S5',
    name: 'Yama',
    direction: 'South Zone Entrance',
    description: 'Yama (S5) is considered one of the most ominous entrances. It often results in mounting debts, financial difficulties, and economic hardships, making it unsuitable for the main gate.',
    remedies: 'It is strongly advised to avoid this entrance altogether.',
    isAuspicious: false,
    shouldAvoid: true
  },
  'S6': {
    id: 'S6',
    name: 'Gandharva',
    direction: 'South Zone Entrance',
    description: 'The Gandharva (S6) entrance brings humiliation, financial losses, and a state of poverty to the residents. Its influence can also lead to a decline in social standing and reputation.',
    remedies: 'This entrance should be avoided to prevent these negative effects.',
    isAuspicious: false,
    shouldAvoid: true
  },
  'S7': {
    id: 'S7',
    name: 'Bhringraj',
    direction: 'South Zone Entrance',
    description: 'Choosing Bhringraj (S7) as the entrance leads to wasted efforts in every aspect of life. Residents often lose interest in hard work, which results in frustration and a lack of achievement.',
    remedies: 'Avoid constructing the main entrance in this zone.',
    isAuspicious: false,
    shouldAvoid: true
  },
  'S8': {
    id: 'S8',
    name: 'Mriga',
    direction: 'South Zone Entrance',
    description: 'The Mriga (S8) entrance is deemed the most inauspicious according to Vastu Shastra. It makes the occupants rude and emotionally detached, leading to social isolation, loss of wealth, and unhappiness within the family.',
    remedies: 'It is highly recommended to avoid this entrance.',
    isAuspicious: false,
    shouldAvoid: true
  },
  
  // West Zone Entrances
  'W1': {
    id: 'W1',
    name: 'Pitra',
    direction: 'West Zone Entrance',
    description: 'The Pitra (W1) entrance is unfavorable, as it tends to bring poverty, financial struggles, and a reduction in the lifespan of its residents.',
    remedies: 'This entrance should be strictly avoided.',
    isAuspicious: false,
    shouldAvoid: true
  },
  'W2': {
    id: 'W2',
    name: 'Dwarika',
    direction: 'West Zone Entrance',
    description: 'A Dwarika (W2) entrance can create career instability and insecurity within family relationships. It often leads to difficulties in maintaining professional and personal stability.',
    remedies: 'Use an iron strip or white tape to stabilize the effects of this entrance.',
    isAuspicious: false,
    shouldAvoid: false
  },
  'W3': {
    id: 'W3',
    name: 'Sugriva',
    direction: 'West Zone Entrance',
    description: 'The Sugriva (W3) entrance is one of the most advantageous in the west, known for bringing incredible growth, prosperity, and significant financial gains to the household.',
    remedies: 'No treatment is needed as this entrance is highly beneficial.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'W4': {
    id: 'W4',
    name: 'Pushpdanta',
    direction: 'West Zone Entrance',
    description: 'Homes with the Pushpdanta (W4) entrance experience increased wealth, happiness, and prosperity, especially benefiting male children. This entrance ensures a smooth and comfortable life for the occupants.',
    remedies: 'No treatment is required for this auspicious entrance.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'W5': {
    id: 'W5',
    name: 'Varuna',
    direction: 'West Zone Entrance',
    description: 'The Varuna (W5) entrance has a dual impact. While it promotes perfectionism in professional work, it also makes individuals over-ambitious, which can sometimes lead to difficulties.',
    remedies: 'An iron strip or white tape is suggested to balance these mixed effects.',
    isAuspicious: false,
    shouldAvoid: false
  },
  'W6': {
    id: 'W6',
    name: 'Nakaratma',
    direction: 'West Zone Entrance',
    description: 'Nakaratma (W6) is a negative entrance that affects the mental well-being of its residents, often leading to depression and problems for government employees living in the house.',
    remedies: 'To mitigate these adverse effects, use an iron strip or white tape.',
    isAuspicious: false,
    shouldAvoid: false
  },
  'W7': {
    id: 'W7',
    name: 'Shauka',
    direction: 'West Zone Entrance',
    description: 'Shauka (W7) creates an environment of unhappiness and stress. Health issues and financial troubles are common, often leading to addiction problems as a means of escape.',
    remedies: 'Use an iron strip or white tape to address these negative influences.',
    isAuspicious: false,
    shouldAvoid: false
  },
  'W8': {
    id: 'W8',
    name: 'Papyakshama',
    direction: 'West Zone Entrance',
    description: 'Residents with a Papyakshama (W8) entrance may resort to unethical practices for personal gain. This entrance also encourages opportunities for foreign travel while keeping the male members frequently away from home.',
    remedies: 'Use an iron strip or white tape to neutralize these effects.',
    isAuspicious: false,
    shouldAvoid: false
  },
  
  // North Zone Entrances
  'N1': {
    id: 'N1',
    name: 'Roga',
    direction: 'North Zone Entrance',
    description: 'The Roga (N1) entrance is associated with negative energy from external sources, which creates fear and insecurity among the residents. It tends to keep women of the house away and often leads to frequent travels abroad.',
    remedies: 'Treat this entrance with an iron strip or white tape.',
    isAuspicious: false,
    shouldAvoid: false
  },
  'N2': {
    id: 'N2',
    name: 'Naga',
    direction: 'North Zone Entrance',
    description: 'The Naga (N2) entrance increases enmity and fosters a sense of paranoia. Residents may develop a belief that they are being targeted or envied by others, which can affect their peace of mind.',
    remedies: 'Use an aluminum strip or blue tape to counteract these effects.',
    isAuspicious: false,
    shouldAvoid: false
  },
  'N3': {
    id: 'N3',
    name: 'Mukhya',
    direction: 'North Zone Entrance',
    description: 'Mukhya (N3) is one of the most prosperous entrances, bringing wealth, growth, and abundance, particularly favoring the birth of male children in the household.',
    remedies: 'No treatment is necessary for this highly favorable entrance.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'N4': {
    id: 'N4',
    name: 'Bhallat',
    direction: 'North Zone Entrance',
    description: 'Bhallat (N4) is considered an auspicious entrance that ensures an increase in inherited wealth and property. It provides opportunities for prosperity and opens new avenues for financial growth.',
    remedies: 'No treatment is needed for this positive entrance.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'N5': {
    id: 'N5',
    name: 'Soma',
    direction: 'North Zone Entrance',
    description: 'The Soma (N5) entrance promotes a calm and religious atmosphere within the house. Residents tend to have a peaceful demeanor and a spiritual inclination, making it an ideal location for the main gate.',
    remedies: 'No treatment is required for this entrance.',
    isAuspicious: true,
    shouldAvoid: false
  },
  'N6': {
    id: 'N6',
    name: 'Bhujang',
    direction: 'North Zone Entrance',
    description: 'Homes with the Bhujang (N6) entrance may experience social disapproval and conflicts, particularly with sons. This entrance tends to create opposition to the viewpoints of the residents.',
    remedies: 'Use an aluminum strip or blue tape to reduce these effects.',
    isAuspicious: false,
    shouldAvoid: false
  },
  'N7': {
    id: 'N7',
    name: 'Aditi',
    direction: 'North Zone Entrance',
    description: 'The Aditi (N7) entrance is said to challenge the traditional roles of women in the household, leading them to question and possibly defy family norms and values.',
    remedies: 'An aluminum strip or blue tape is advised to stabilize its effects.',
    isAuspicious: false,
    shouldAvoid: false
  },
  'N8': {
    id: 'N8',
    name: 'Diti',
    direction: 'North Zone Entrance',
    description: 'The Diti (N8) entrance supports a broad vision and success in various ventures but might push the residents to adopt unethical methods to achieve their goals. It can create a challenging environment for maintaining ethical standards.',
    remedies: 'Use an aluminum strip or blue tape to counterbalance these tendencies.',
    isAuspicious: false,
    shouldAvoid: false
  }
};

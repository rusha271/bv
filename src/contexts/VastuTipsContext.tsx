import React, { createContext, useContext, ReactNode } from 'react';

export interface VastuTip {
  id: number;
  title: string;
  description: string;
  details: string;
  category: string;
  image: string;
}

const vastuTips: VastuTip[] = [
  {
    id: 1,
    title: 'Vastu Tips for a Peaceful Home',
    description: 'Create harmony in your living space by aligning it with Vastu principles.',
    details: 'Balance energy and promote well-being with mindful placements in every room.',
    category: 'Home',
    image: '/images/bv.png',
  },
  {
    id: 2,
    title: 'Bedroom Vastu for Better Sleep',
    description: 'Your bedroom\'s direction and setup influence your rest.',
    details: 'Simple changes can enhance peace, improve relationships, and boost vitality.',
    category: 'Bedroom',
    image: '/images/bv.png',
  },
  {
    id: 3,
    title: 'Vastu for Wealth and Prosperity',
    description: 'Invite abundance into your life with Vastu techniques focused on the placement of lockers, kitchens, and the North-East zone.',
    details: 'Unlock financial flow by activating the right zones in your home.',
    category: 'Wealth',
    image: '/images/bv.png',
  },
  {
    id: 4,
    title: 'Vastu for Health and Wellbeing',
    description: 'Know how kitchen placement, bedroom direction, and home energy flow can impact your family\'s health.',
    details: 'Create a healing environment that supports physical and mental balance.',
    category: 'Health',
    image: '/images/bv.png',
  },
  {
    id: 5,
    title: 'Vastu for Office and Business Spaces',
    description: 'Enhance productivity, focus, and growth in your workplace by aligning your office with powerful Vastu principles.',
    details: 'Correct desk positions and energy flow can attract success and clarity.',
    category: 'Office',
    image: '/images/bv.png',
  },
  {
    id: 6,
    title: "Children's Room Vastu Tips",
    description: 'Support your child\'s focus and development with a perfectly aligned study room according to Vastu.',
    details: 'Vastu helps improve concentration, creativity, and emotional balance.',
    category: 'Children',
    image: '/images/bv.png',
  },
  {
    id: 7,
    title: 'Vastu for the Main Entrance',
    description: 'The main door is the energy gateway to your home.',
    details: 'Right direction and decor can welcome health, wealth, and positivity.',
    category: 'Entrance',
    image: '/images/bv.png',
  },
  {
    id: 8,
    title: 'Vastu for Apartments and Flats',
    description: 'Living in a flat? Here\'s how to still apply powerful Vastu tips even in modern high-rises.',
    details: 'Smart Vastu tweaks can bring big results even in compact spaces.',
    category: 'Apartment',
    image: '/images/bv.png',
  },
  {
    id: 9,
    title: 'Vastu Remedies Without Renovation',
    description: 'No construction? No problem! Try these easy Vastu remedies using mirrors, colors, and symbolic placements.',
    details: 'Transform energy flow without breaking walls or budgets.',
    category: 'Remedies',
    image: '/images/bv.png',
  },
  {
    id: 10,
    title: 'Common Vastu Mistakes and How to Fix Them',
    description: 'Are you unknowingly blocking positivity? Learn the top Vastu mistakes people make and simple ways to fix them.',
    details: 'Identify and correct energy leaks to restore balance in your space.',
    category: 'Mistakes',
    image: '/images/bv.png',
  },
];

const VastuTipsContext = createContext<VastuTip[]>([]);

export const useVastuTips = () => useContext(VastuTipsContext);

export const VastuTipsProvider = ({ children }: { children: ReactNode }) => (
  <VastuTipsContext.Provider value={vastuTips}>
    {children}
  </VastuTipsContext.Provider>
);
import type { Recipe } from '@/types/Recipe'
import gateauAuChocolatImage from '@/assets/images/gateau_au_chocolat.jpg'

const demoDate = new Date().toISOString()

export const demoRecipe: Recipe = {
  id: 'demo-moelleux-chocolat',
  coverImage: gateauAuChocolatImage,
  title: 'Moelleux au chocolat',
  description: 'Une recette simple, rapide et bien aérée.',
  servings: 6,
  preparationTime: '15 min',
  cookingTime: '20 min',
  tags: ['Dessert', 'Rapide'],
  ingredients: [
    {
      id: '1',
      name: 'Chocolat noir',
      quantity: '200 g',
      icon: 'twemoji:chocolate-bar',
    },
    {
      id: '2',
      name: 'Beurre',
      quantity: '100 g',
      icon: 'twemoji:butter',
    },
    {
      id: '3',
      name: 'Œufs',
      quantity: '4',
      icon: 'twemoji:egg',
    },
    {
      id: '4',
      name: 'Sucre',
      quantity: '120 g',
      icon: 'twemoji:sugar',
    },
    {
      id: '5',
      name: 'Farine',
      quantity: '60 g',
    },
  ],
  steps: [
    {
      id: '1',
      title: 'Préparer le chocolat',
      description: 'Faire fondre le chocolat avec le beurre.',
    },
    {
      id: '2',
      title: 'Préparer l’appareil',
      description: 'Mélanger les œufs avec le sucre, puis ajouter la farine.',
    },
    {
      id: '3',
      title: 'Assembler',
      description: 'Ajouter le chocolat fondu au mélange et remuer doucement.',
    },
    {
      id: '4',
      title: 'Cuire',
      description: 'Verser dans un moule et cuire environ 20 minutes à 180°C.',
    },
  ],
  createdAt: demoDate,
  updatedAt: demoDate,
}

export type Category = 'news' | 'listen' | 'visual' | 'culture';
export type Subcategory =
  | 'music-news'
  | 'weekly-news'
  | 'reviews'
  | 'playlists'
  | 'music-videos'
  | 'live'
  | 'fashion'
  | 'product'
  | 'trend-report'
  | 'artist-focus';

export interface SubcategoryConfig {
  id: Subcategory;
  label: string;
  color: string;
  textColor: string;
}

export interface CategoryConfig {
  id: Category;
  label: string;
  color: string;
  textColor: string;
  subcategories: SubcategoryConfig[];
}

export const SUBCATEGORY_CONFIGS: Record<Subcategory, SubcategoryConfig> = {
  'music-news': { id: 'music-news', label: 'Music News', color: '#c00707', textColor: '#ffffff' },
  'weekly-news': { id: 'weekly-news', label: 'Weekly News', color: '#00bf63', textColor: '#000000' },
  'reviews': { id: 'reviews', label: 'Reviews', color: '#ffda13', textColor: '#000000' },
  'playlists': { id: 'playlists', label: 'Playlists', color: '#ffda13', textColor: '#000000' },
  'music-videos': { id: 'music-videos', label: 'Music Videos', color: '#ffda13', textColor: '#000000' },
  'live': { id: 'live', label: 'Live', color: '#b0fffa', textColor: '#000000' },
  'fashion': { id: 'fashion', label: 'Fashion', color: '#ff66c4', textColor: '#000000' },
  'product': { id: 'product', label: 'Product', color: '#004aad', textColor: '#ffffff' },
  'trend-report': { id: 'trend-report', label: 'Trend Report', color: '#cb6ce6', textColor: '#000000' },
  'artist-focus': { id: 'artist-focus', label: 'Artist Focus', color: '#ff751f', textColor: '#000000' },
};

export const CATEGORY_CONFIGS: Record<Category, CategoryConfig> = {
  news: {
    id: 'news',
    label: 'News',
    color: '#c00707',
    textColor: '#ffffff',
    subcategories: [SUBCATEGORY_CONFIGS['music-news'], SUBCATEGORY_CONFIGS['weekly-news']],
  },
  listen: {
    id: 'listen',
    label: 'Listen',
    color: '#ffda13',
    textColor: '#000000',
    subcategories: [SUBCATEGORY_CONFIGS['reviews'], SUBCATEGORY_CONFIGS['playlists']],
  },
  visual: {
    id: 'visual',
    label: 'Visual',
    color: '#b0fffa',
    textColor: '#000000',
    subcategories: [SUBCATEGORY_CONFIGS['music-videos'], SUBCATEGORY_CONFIGS['live']],
  },
  culture: {
    id: 'culture',
    label: 'Culture',
    color: '#cb6ce6',
    textColor: '#000000',
    subcategories: [
      SUBCATEGORY_CONFIGS['fashion'],
      SUBCATEGORY_CONFIGS['product'],
      SUBCATEGORY_CONFIGS['trend-report'],
      SUBCATEGORY_CONFIGS['artist-focus'],
    ],
  },
};

export const ALL_CATEGORIES: CategoryConfig[] = Object.values(CATEGORY_CONFIGS);
export const ALL_SUBCATEGORIES: SubcategoryConfig[] = Object.values(SUBCATEGORY_CONFIGS);

export function getCategoryConfig(cat: Category): CategoryConfig {
  return CATEGORY_CONFIGS[cat];
}

export function getSubcategoryConfig(sub: Subcategory): SubcategoryConfig {
  return SUBCATEGORY_CONFIGS[sub];
}

export function getCategoryBySubcategory(sub: Subcategory): Category {
  for (const [catId, catConfig] of Object.entries(CATEGORY_CONFIGS)) {
    if (catConfig.subcategories.some((s) => s.id === sub)) {
      return catId as Category;
    }
  }
  return 'news';
}

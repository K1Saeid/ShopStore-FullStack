export interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  gender: string;
  sizes: string;
  colors: string;
  price: number;
  discountPrice: number;
  inStock: boolean;
  itemsLeft: number;
  imageUrl: string;
  slug: string;
  categoryId: number;
  categoryName?: string; // برای نمایش در Angular
}

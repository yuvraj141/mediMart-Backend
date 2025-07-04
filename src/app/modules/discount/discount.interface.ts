export type TDiscount = {
  title: string;
  description?: string;
  discountPercentage: number; 
  startDate: Date;
  endDate: Date;
  applicableTo: 'all' | 'category' | 'brand' ;
  categories?: string[]; // Category IDs
  brands?: string[];     // Brand IDs
  products?: string[];   // Product IDs
  isActive?: boolean;
};

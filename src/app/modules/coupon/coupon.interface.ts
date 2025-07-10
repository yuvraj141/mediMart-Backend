
export type TCoupon  ={
   code: string;
   discountType: 'Flat' | 'Percentage';
   discountValue: number;
   maxDiscountAmount?: number;
   startDate: Date;
   endDate: Date;
   minOrderAmount: number;
   isActive: boolean;
   isDeleted: boolean;
}

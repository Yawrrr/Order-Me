export interface ListingType {
  id: number;
  name: string;
  imageUrl: string;
  category: string;
  location: string;
  rating: number;
  cuisine?: string;        // Optional field
  priceRange: string;     
  isOpen?: boolean;        // Optional field
  description: string;    
}
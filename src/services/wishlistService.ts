import apiClient from '../utils/apiClient';

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  salePrice?: number;
  rating: number;
  stock: number;
  addedAt: string | Date;
  category: string;
}

export interface WishlistResponse {
  items: WishlistItem[];
  total: number;
}

export const wishlistService = {
  // Lấy danh sách yêu thích của người dùng
  getWishlist: async (): Promise<WishlistResponse> => {
    try {
      const response = await apiClient.get('/users/wishlist');
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },

  // Thêm sản phẩm vào danh sách yêu thích
  addToWishlist: async (productId: string): Promise<void> => {
    try {
      await apiClient.post('/users/wishlist', { productId });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  // Xóa sản phẩm khỏi danh sách yêu thích
  removeFromWishlist: async (productId: string): Promise<void> => {
    try {
      await apiClient.delete(`/users/wishlist/${productId}`);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  },

  // Kiểm tra xem sản phẩm có trong danh sách yêu thích không
  isInWishlist: async (productId: string): Promise<boolean> => {
    try {
      const response = await apiClient.get(`/users/wishlist/check/${productId}`);
      return response.data.inWishlist;
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  }
};
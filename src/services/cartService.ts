export interface CartItem {
  id: string;
  variant_id: string;
  qty: number;
}

const CART_KEY = "cart_items";

/** 🔹 Lấy toàn bộ danh sách giỏ hàng từ localStorage */
export const getCart = (): CartItem[] => {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error parsing cart:", error);
    return [];
  }
};

/** 🔹 Lưu danh sách giỏ hàng vào localStorage */
const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

/** 🔹 Thêm sản phẩm vào giỏ (nếu đã có thì cộng số lượng) */
export const addToCart = (item: CartItem): void => {
  const cart = getCart();
  const index = cart.findIndex(
    (i) => i.id === item.id && i.variant_id === item.variant_id
  );

  if (index >= 0) {
    cart[index].qty += item.qty;
  } else {
    cart.push(item);
  }

  saveCart(cart);
};

/** 🔹 Cập nhật số lượng sản phẩm (nếu số lượng <= 0 thì xóa luôn) */
export const updateCartItem = (
  id: string | number,
  variant_id: string | number | undefined,
  qty: number
): void => {
  const cart = getCart();
  const index = cart.findIndex(
    (i) => i.id === id && i.variant_id === variant_id
  );

  if (index >= 0) {
    if (qty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].qty = qty;
    }
    saveCart(cart);
  }
};

/** 🔹 Xóa 1 sản phẩm khỏi giỏ */
export const removeFromCart = (
  id: string | number,
  variant_id?: string | number
): void => {
  const cart = getCart().filter(
    (i) => !(i.id === id && i.variant_id === variant_id)
  );
  saveCart(cart);
};

/** 🔹 Xóa toàn bộ giỏ hàng */
export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};

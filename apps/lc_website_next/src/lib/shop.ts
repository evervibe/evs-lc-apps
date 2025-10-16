/**
 * Shop Logic Library
 * 
 * Handles shopping cart operations and order calculations
 */

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

/**
 * Add item to cart
 */
export function addToCart(cart: Cart, item: CartItem): Cart {
  const existingItem = cart.items.find(i => i.productId === item.productId);
  
  if (existingItem) {
    return {
      ...cart,
      items: cart.items.map(i => 
        i.productId === item.productId 
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      ),
    };
  }
  
  return {
    ...cart,
    items: [...cart.items, item],
  };
}

/**
 * Remove item from cart
 */
export function removeFromCart(cart: Cart, productId: string): Cart {
  return {
    ...cart,
    items: cart.items.filter(i => i.productId !== productId),
  };
}

/**
 * Update item quantity in cart
 */
export function updateCartItemQuantity(
  cart: Cart, 
  productId: string, 
  quantity: number
): Cart {
  if (quantity <= 0) {
    return removeFromCart(cart, productId);
  }
  
  return {
    ...cart,
    items: cart.items.map(i => 
      i.productId === productId 
        ? { ...i, quantity }
        : i
    ),
  };
}

/**
 * Calculate total amount
 */
export function calculateTotal(cart: Cart): number {
  return cart.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

/**
 * Recalculate cart totals
 */
export function recalculateCart(cart: Cart): Cart {
  return {
    ...cart,
    totalAmount: calculateTotal(cart),
  };
}

/**
 * Clear cart
 */
export function clearCart(): Cart {
  return {
    items: [],
    totalAmount: 0,
  };
}

/**
 * Validate cart
 */
export function validateCart(cart: Cart): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (cart.items.length === 0) {
    errors.push('Cart is empty');
  }
  
  cart.items.forEach(item => {
    if (item.quantity <= 0) {
      errors.push(`Invalid quantity for ${item.name}`);
    }
    if (item.price < 0) {
      errors.push(`Invalid price for ${item.name}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

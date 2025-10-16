'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

export default function ShopPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'all' 
        ? '/api/shop/products'
        : `/api/shop/products?category=${selectedCategory}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (!session) {
      alert('Please login to checkout');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.mock) {
          alert(data.message + '\n\nIn production, you would be redirected to PayPal.');
          setCart([]);
        } else {
          window.location.href = data.approvalUrl;
        }
      } else {
        alert('Checkout failed: ' + data.error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process checkout');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Items', icon: '🛍️' },
    { id: 'premium', name: 'Premium', icon: '💎' },
    { id: 'cosmetics', name: 'Cosmetics', icon: '👗' },
    { id: 'boosts', name: 'Boosts', icon: '⚡' },
    { id: 'bundles', name: 'Bundles', icon: '🎁' },
  ];

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-accent">
            Item Shop
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Enhance your gaming experience with premium items and exclusive content!
          </p>
        </div>

        {/* Categories */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-accent text-background'
                  : 'bg-foreground/5 hover:bg-foreground/10'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-12">Loading products...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map(product => (
                  <div
                    key={product.id}
                    className="border border-foreground/10 rounded-lg p-6 bg-foreground/5 hover:bg-foreground/10 transition-all"
                  >
                    <div className="text-4xl mb-4">
                      {product.category === 'premium' && '💎'}
                      {product.category === 'cosmetics' && '👗'}
                      {product.category === 'boosts' && '⚡'}
                      {product.category === 'bundles' && '🎁'}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-sm text-foreground/60 mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-accent">
                        €{product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="px-4 py-2 bg-accent text-background rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 border border-foreground/10 rounded-lg p-6 bg-foreground/5">
              <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
              
              {cart.length === 0 ? (
                <p className="text-foreground/60 text-center py-8">
                  Your cart is empty
                </p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-foreground/60">
                            €{item.price.toFixed(2)} each
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 bg-foreground/10 rounded hover:bg-foreground/20"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 bg-foreground/10 rounded hover:bg-foreground/20"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-foreground/10 pt-4 mb-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-accent">€{getTotalAmount().toFixed(2)}</span>
                    </div>
                  </div>

                  {session ? (
                    <button
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                      className="w-full py-3 bg-accent text-background font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {checkoutLoading ? 'Processing...' : 'Checkout with PayPal'}
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="block w-full py-3 bg-accent text-background font-semibold rounded-lg hover:opacity-90 transition-opacity text-center"
                    >
                      Login to Checkout
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border border-foreground/10 bg-gradient-to-br from-primary/10 to-transparent">
            <h3 className="text-lg font-semibold mb-3 text-accent">Secure Payments</h3>
            <p className="text-foreground/60 text-sm">
              All transactions are processed securely through PayPal.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-foreground/10 bg-gradient-to-br from-primary/10 to-transparent">
            <h3 className="text-lg font-semibold mb-3 text-accent">Instant Delivery</h3>
            <p className="text-foreground/60 text-sm">
              Items are delivered automatically to your account immediately after purchase.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-foreground/10 bg-gradient-to-br from-primary/10 to-transparent">
            <h3 className="text-lg font-semibold mb-3 text-accent">24/7 Support</h3>
            <p className="text-foreground/60 text-sm">
              Our support team is always ready to help with any purchase-related issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

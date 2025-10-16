/**
 * Shop Products API
 * GET /api/shop/products - List all products
 */

import { NextResponse } from 'next/server';

// Mock products for Phase 4 implementation
const MOCK_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Premium Pack',
    description: 'Ultimate value package with exclusive items and bonuses',
    price: 29.99,
    category: 'premium',
    imageUrl: '/images/shop/premium-pack.png',
    stock: 999,
    active: true,
  },
  {
    id: 'prod_2',
    name: 'Starter Bundle',
    description: 'Perfect for new players - includes essential items',
    price: 9.99,
    category: 'bundles',
    imageUrl: '/images/shop/starter-bundle.png',
    stock: 999,
    active: true,
  },
  {
    id: 'prod_3',
    name: 'XP Boost (7 Days)',
    description: 'Double experience points for 7 days',
    price: 4.99,
    category: 'boosts',
    imageUrl: '/images/shop/xp-boost.png',
    stock: 999,
    active: true,
  },
  {
    id: 'prod_4',
    name: 'Drop Rate Boost (7 Days)',
    description: 'Increased item drop rate for 7 days',
    price: 4.99,
    category: 'boosts',
    imageUrl: '/images/shop/drop-boost.png',
    stock: 999,
    active: true,
  },
  {
    id: 'prod_5',
    name: 'Rare Mount',
    description: 'Exclusive rideable mount with speed bonus',
    price: 19.99,
    category: 'cosmetics',
    imageUrl: '/images/shop/rare-mount.png',
    stock: 50,
    active: true,
  },
  {
    id: 'prod_6',
    name: 'Costume Set',
    description: 'Unique costume with special effects',
    price: 14.99,
    category: 'cosmetics',
    imageUrl: '/images/shop/costume-set.png',
    stock: 100,
    active: true,
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let products = MOCK_PRODUCTS;
    
    // Filter by category if provided
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }
    
    // Filter only active products
    products = products.filter(p => p.active);
    
    return NextResponse.json({
      success: true,
      products,
      total: products.length,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

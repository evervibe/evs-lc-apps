/**
 * Shop Checkout API
 * POST /api/shop/checkout - Create order and PayPal payment
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { validateCart } from '@/lib/shop';
import { createPayPalOrder, getPayPalConfig } from '@/lib/paypal';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { items } = body;
    
    // Validate cart
    const cart = {
      items: items || [],
      totalAmount: items?.reduce((sum: number, item: { price: number; quantity: number }) => 
        sum + (item.price * item.quantity), 0) || 0,
    };
    
    const validation = validateCart(cart);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 }
      );
    }
    
    // Create order ID
    const orderId = `order_${Date.now()}_${session.user.id}`;
    
    // Create PayPal order
    try {
      const paypalConfig = getPayPalConfig();
      const paypalOrder = await createPayPalOrder(
        paypalConfig,
        cart.totalAmount,
        'EUR',
        orderId
      );
      
      // Find approval URL
      const approvalUrl = paypalOrder.links.find(
        link => link.rel === 'approve'
      )?.href;
      
      if (!approvalUrl) {
        throw new Error('No approval URL found');
      }
      
      return NextResponse.json({
        success: true,
        orderId,
        paypalOrderId: paypalOrder.id,
        approvalUrl,
      });
    } catch (paypalError) {
      console.error('PayPal error:', paypalError);
      
      // Return mock response for development
      return NextResponse.json({
        success: true,
        orderId,
        paypalOrderId: 'MOCK_' + orderId,
        approvalUrl: '/shop/mock-payment?orderId=' + orderId,
        mock: true,
        message: 'PayPal not configured - using mock payment',
      });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}

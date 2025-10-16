/**
 * PayPal Webhook Handler
 * POST /api/shop/webhook - Handle PayPal payment notifications
 */

import { NextResponse } from 'next/server';
import { verifyPayPalWebhook, getPayPalConfig } from '@/lib/paypal';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headers = Object.fromEntries(request.headers);
    
    // Verify webhook signature
    const config = getPayPalConfig();
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    
    if (!webhookId) {
      console.error('PayPal webhook ID not configured');
      return NextResponse.json({ received: true });
    }
    
    const isValid = await verifyPayPalWebhook(config, webhookId, headers, body);
    
    if (!isValid) {
      console.error('Invalid PayPal webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Parse webhook event
    const event = JSON.parse(body);
    
    // Handle different event types
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCompleted(event);
        break;
      
      case 'PAYMENT.CAPTURE.DENIED':
        await handlePaymentDenied(event);
        break;
      
      case 'PAYMENT.CAPTURE.REFUNDED':
        await handlePaymentRefunded(event);
        break;
      
      default:
        console.log('Unhandled webhook event:', event.event_type);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

interface PayPalWebhookEvent {
  resource: {
    id: string;
  };
}

async function handlePaymentCompleted(event: PayPalWebhookEvent) {
  console.log('Payment completed:', event.resource.id);
  
  // TODO: Update order status in database
  // TODO: Deliver items to player account
  // TODO: Send confirmation email
}

async function handlePaymentDenied(event: PayPalWebhookEvent) {
  console.log('Payment denied:', event.resource.id);
  
  // TODO: Update order status to failed
  // TODO: Send notification to user
}

async function handlePaymentRefunded(event: PayPalWebhookEvent) {
  console.log('Payment refunded:', event.resource.id);
  
  // TODO: Update order status to refunded
  // TODO: Revoke items from player account
  // TODO: Send refund confirmation
}

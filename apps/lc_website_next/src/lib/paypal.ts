/**
 * PayPal REST API Integration
 * 
 * Handles PayPal payment processing
 */

export interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  mode: 'sandbox' | 'live';
}

export interface PayPalOrder {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export interface PayPalCapture {
  id: string;
  status: string;
  purchase_units: Array<{
    reference_id: string;
    payments: {
      captures: Array<{
        id: string;
        status: string;
      }>;
    };
  }>;
}

/**
 * Get PayPal access token
 */
export async function getPayPalAccessToken(config: PayPalConfig): Promise<string> {
  const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
  const baseUrl = config.mode === 'sandbox' 
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';
  
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  
  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }
  
  const data = await response.json();
  return data.access_token;
}

/**
 * Create PayPal order
 */
export async function createPayPalOrder(
  config: PayPalConfig,
  amount: number,
  currency: string = 'EUR',
  orderId: string
): Promise<PayPalOrder> {
  const accessToken = await getPayPalAccessToken(config);
  const baseUrl = config.mode === 'sandbox' 
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';
  
  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: orderId,
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
      }],
      application_context: {
        brand_name: 'LastChaos Portal',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/cancel`,
      },
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create PayPal order: ${error}`);
  }
  
  return response.json();
}

/**
 * Capture PayPal payment
 */
export async function capturePayPalPayment(
  config: PayPalConfig,
  orderId: string
): Promise<PayPalCapture> {
  const accessToken = await getPayPalAccessToken(config);
  const baseUrl = config.mode === 'sandbox' 
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';
  
  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to capture PayPal payment: ${error}`);
  }
  
  return response.json();
}

/**
 * Verify PayPal webhook signature
 */
export async function verifyPayPalWebhook(
  config: PayPalConfig,
  webhookId: string,
  headers: Record<string, string>,
  body: string
): Promise<boolean> {
  const accessToken = await getPayPalAccessToken(config);
  const baseUrl = config.mode === 'sandbox' 
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';
  
  const response = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transmission_id: headers['paypal-transmission-id'],
      transmission_time: headers['paypal-transmission-time'],
      cert_url: headers['paypal-cert-url'],
      auth_algo: headers['paypal-auth-algo'],
      transmission_sig: headers['paypal-transmission-sig'],
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    }),
  });
  
  if (!response.ok) {
    return false;
  }
  
  const data = await response.json();
  return data.verification_status === 'SUCCESS';
}

/**
 * Get PayPal config from environment
 */
export function getPayPalConfig(): PayPalConfig {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE === 'live' ? 'live' : 'sandbox';
  
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }
  
  return {
    clientId,
    clientSecret,
    mode,
  };
}

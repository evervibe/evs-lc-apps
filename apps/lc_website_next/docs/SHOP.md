# Shop System Documentation

## Overview

The shop system provides a complete e-commerce solution for selling in-game items, boosts, and packages. It integrates with PayPal for secure payment processing and includes a shopping cart, checkout flow, and webhook handling for payment verification.

## Architecture

### Components

#### 1. Frontend (`/src/app/shop/page.tsx`)
- Product catalog with category filtering
- Shopping cart management
- Real-time price calculation
- PayPal checkout integration
- Responsive UI with mobile support

#### 2. API Routes
- `GET /api/shop/products` - Fetch product catalog
- `POST /api/shop/checkout` - Create order and PayPal payment
- `POST /api/shop/webhook` - Handle PayPal payment notifications

#### 3. Business Logic (`/src/lib/shop.ts`)
- Cart operations (add, remove, update)
- Price calculations
- Cart validation
- Type definitions

#### 4. PayPal Integration (`/src/lib/paypal.ts`)
- Access token management
- Order creation
- Payment capture
- Webhook signature verification

### Database Schema

```prisma
model Product {
  id          String      @id @default(cuid())
  name        String
  description String      @db.Text
  price       Decimal     @db.Decimal(10, 2)
  category    String      // premium, cosmetics, boosts, bundles
  imageUrl    String?
  stock       Int         @default(0)
  active      Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  orderItems  OrderItem[]
}

model Order {
  id              String      @id @default(cuid())
  userId          String
  totalAmount     Decimal     @db.Decimal(10, 2)
  status          String      @default("pending") 
  paypalOrderId   String?     @unique
  paypalPaymentId String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  user            User        @relation(fields: [userId], references: [id])
  items           OrderItem[]
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Decimal  @db.Decimal(10, 2)
  order     Order    @relation(fields: [orderId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])
}
```

## PayPal Integration

### Setup

1. **Create PayPal App**
   - Visit https://developer.paypal.com/dashboard/
   - Create a new app in sandbox mode
   - Copy Client ID and Secret

2. **Environment Variables**
   ```env
   PAYPAL_CLIENT_ID=your_client_id
   PAYPAL_CLIENT_SECRET=your_client_secret
   PAYPAL_MODE=sandbox  # or 'live' for production
   PAYPAL_WEBHOOK_ID=your_webhook_id
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **Webhook Configuration**
   - Configure webhook URL: `https://yourdomain.com/api/shop/webhook`
   - Subscribe to events:
     - `PAYMENT.CAPTURE.COMPLETED`
     - `PAYMENT.CAPTURE.DENIED`
     - `PAYMENT.CAPTURE.REFUNDED`

### Payment Flow

1. **Checkout Initiation**
   - User adds items to cart
   - Clicks "Checkout with PayPal"
   - Frontend calls `/api/shop/checkout`

2. **Order Creation**
   - API creates PayPal order
   - Returns approval URL
   - User redirected to PayPal

3. **Payment Authorization**
   - User logs into PayPal
   - Authorizes payment
   - Redirected back to site

4. **Payment Capture**
   - PayPal captures payment
   - Sends webhook notification
   - Order status updated to "paid"

5. **Item Delivery**
   - Items delivered to game account
   - Confirmation email sent
   - Order marked as "delivered"

### Webhook Handling

Webhooks are verified using PayPal's signature verification:

```typescript
const isValid = await verifyPayPalWebhook(
  config, 
  webhookId, 
  headers, 
  body
);
```

Events handled:
- `PAYMENT.CAPTURE.COMPLETED` - Payment successful
- `PAYMENT.CAPTURE.DENIED` - Payment failed
- `PAYMENT.CAPTURE.REFUNDED` - Payment refunded

## Product Categories

### Premium
- High-value items
- Exclusive weapons/armor
- Rare mounts

### Cosmetics
- Character appearances
- Unique costumes
- Special effects

### Boosts
- XP boosts (1d, 7d, 30d)
- Drop rate boosts
- Gold/currency boosts

### Bundles
- Starter packs
- Value packages
- Limited-time offers

## Security

### Payment Security
- All payments processed through PayPal (PCI compliant)
- No card data stored on our servers
- HTTPS required for all transactions
- Webhook signature verification

### Data Protection
- User authentication required for checkout
- Order history linked to user account
- Audit logging for all transactions
- Rate limiting on API endpoints

### Input Validation
- Cart validation before checkout
- Price verification server-side
- Stock checking
- Quantity limits

## Testing

### Unit Tests
Run unit tests for shop logic:
```bash
pnpm test src/lib/__tests__/shop.test.ts
```

Tests cover:
- Cart operations
- Price calculations
- Validation logic

### Integration Tests
Test PayPal integration in sandbox:
1. Set `PAYPAL_MODE=sandbox`
2. Use sandbox credentials
3. Test with PayPal test accounts
4. Verify webhook delivery

### Manual Testing Checklist
- [ ] Add items to cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Calculate totals correctly
- [ ] Checkout flow completes
- [ ] PayPal redirects work
- [ ] Payment confirmation received
- [ ] Webhooks processed
- [ ] Order status updated

## Admin Features

### Product Management
Admin interface for managing products:
- Create/edit/delete products
- Set prices and stock levels
- Enable/disable products
- Upload product images

### Order Management
View and manage orders:
- Order list with filters
- Order details
- Status updates (pending → paid → delivered)
- Manual processing
- Refund handling

### Sales Analytics
Dashboard showing:
- Total revenue
- Orders per day/week/month
- Popular products
- Conversion rates

## Deployment

### Environment Setup
1. Configure PayPal credentials
2. Set up webhook URL
3. Configure email service
4. Set up database

### Production Checklist
- [ ] Change `PAYPAL_MODE` to `live`
- [ ] Update PayPal credentials to live
- [ ] Configure production webhook URL
- [ ] Test with small amounts first
- [ ] Monitor webhook delivery
- [ ] Set up error alerting
- [ ] Configure backup system

### Monitoring
- Track order creation success rate
- Monitor webhook delivery
- Alert on payment failures
- Log suspicious activity

## Troubleshooting

### PayPal Connection Issues
```
Error: Failed to get PayPal access token
```
- Verify credentials are correct
- Check `PAYPAL_MODE` setting
- Ensure API endpoint is accessible

### Webhook Not Received
- Verify webhook URL is publicly accessible
- Check webhook ID matches PayPal dashboard
- Verify SSL certificate is valid
- Check PayPal webhook logs

### Payment Capture Failed
- Verify order ID is correct
- Check payment wasn't already captured
- Ensure buyer has sufficient funds
- Review PayPal error messages

## Future Enhancements

### Planned Features
- [ ] Multiple currency support
- [ ] Discount codes and promotions
- [ ] Gift cards
- [ ] Subscription products
- [ ] Referral rewards
- [ ] Loyalty points
- [ ] Advanced analytics
- [ ] A/B testing for pricing

### Database Optimization
- Add indexes for common queries
- Implement Redis caching for products
- Optimize order history queries
- Add database backups

## Support

For shop-related issues:
- Technical: See [CONTRIBUTING.md](../../CONTRIBUTING.md)
- Security: See [SECURITY.md](../../SECURITY.md)
- PayPal issues: Contact PayPal support

## References

- [PayPal REST API Documentation](https://developer.paypal.com/docs/api/orders/v2/)
- [PayPal Webhooks Guide](https://developer.paypal.com/docs/api-basics/notifications/webhooks/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma Documentation](https://www.prisma.io/docs)

---

**Last Updated:** 2025-01-04  
**Version:** v0.7.0

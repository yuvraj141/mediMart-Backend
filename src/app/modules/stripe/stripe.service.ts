import { NextResponse } from 'next/server';
import { stripe } from './stripe.utils';
import Stripe from 'stripe';


 

export  const  createCheckoutSession =async (order: any) => {
 try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', 
      line_items: order.orderedProducts.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description:item.description
          },
          unit_amount: item.unitPrice * 100,
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.CLIENT_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/order/cancel`,
      metadata: {
        orderId: order._id.toString(),
        userId: order.user.toString(),
      },
    });
    return new NextResponse(JSON.stringify({url:session.url}))
 } catch (error) {
  console.log(error);
 }   
 
    
  
  

  // async handleStripeEvent(event: Stripe.Event) {
  //   switch (event.type) {
  //     case 'checkout.session.completed':
  //       const session = event.data.object as Stripe.Checkout.Session;

  //       const orderId = session.metadata?.orderId;

  //       if (orderId) {
  //         await OrderModel.findByIdAndUpdate(orderId, {
  //           paymentStatus: 'paid',
  //           status: 'processing',
  //         });
  //       }

  //       break;

  //     default:
  //       console.log(`Unhandled event type: ${event.type}`);
  //   }
  // },
};

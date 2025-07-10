import { Request } from 'express';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import config from '../../config';
import { NextResponse } from 'next/server';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-06-30.basil',
typescript:true});

export async function POST(req:Request){
  const body=await req.text()
  const signature= headers().get('Stripe-Signature') as string
  let event:Stripe.Event

  try {
    event=stripe.webhooks.constructEvent(body,signature,config.stripe_webhook_secret!)
    console.log("from event :",event);
  } catch (error) {

    return new NextResponse("Invalid Signature",{status:400})
  }
 const session=event.data.object as Stripe.Checkout.Session
console.log("session :",session);
 if(event.type=='checkout.session.completed'){
  console.log(`payment was successful for user`);
 }
 return new NextResponse('Ok payment done',{status:200})
}
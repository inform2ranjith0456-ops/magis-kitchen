import { NextResponse } from 'next/server';
import { getPayments, addPayment } from '@/lib/db';

export async function GET() {
  try {
    const payments = await getPayments();
    return NextResponse.json({ success: true, data: payments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_number, payment_date, payment_method, payment_status, amount, notes } = body;
    if (!order_number || !payment_method || amount === undefined) {
      return NextResponse.json({ success: false, error: 'order_number, payment_method, and amount are required' }, { status: 400 });
    }
    const newPayment = await addPayment({
      order_number,
      payment_date: payment_date || new Date().toLocaleString(),
      payment_method,
      payment_status: payment_status || 'Successful',
      amount: Number(amount),
      notes: notes || '',
    });
    return NextResponse.json({ success: true, data: newPayment });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import { getDeliveries, updateDeliveryStatus, addDelivery } from '@/lib/db';

export async function GET() {
  try {
    const deliveries = await getDeliveries();
    return NextResponse.json({ success: true, data: deliveries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_number, customer_name, delivery_address, driver_name, city, estimated_minutes } = body;
    if (!order_number || !customer_name || !delivery_address) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
    }
    const delivery_code = `DEL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDel = await addDelivery({
      delivery_code,
      order_number,
      customer_name,
      delivery_address,
      delivery_status: 'Dispatched',
      delivery_date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      estimated_minutes: estimated_minutes || 25,
      driver_name: driver_name || 'Assigned Express Rider',
      city: city || 'Chennai',
    });
    return NextResponse.json({ success: true, data: newDel });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { delivery_code, status } = body;
    if (!delivery_code || !status) {
      return NextResponse.json({ success: false, error: 'delivery_code and status are required' }, { status: 400 });
    }
    const updated = await updateDeliveryStatus(delivery_code, status);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

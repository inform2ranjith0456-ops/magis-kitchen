import { NextResponse } from 'next/server';
import { getOrders, getOrderById, updateOrderStatus } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      const order = await getOrderById(id);
      if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: order });
    }
    const orders = await getOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, order_number, status } = body;
    const target = id || order_number;
    if (!target || !status) {
      return NextResponse.json({ success: false, error: 'Order ID and status are required' }, { status: 400 });
    }
    const updated = await updateOrderStatus(target, status);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/db';

export async function GET() {
  try {
    const items = await getMenuItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, price, description, image_url, is_available } = body;
    if (!name || !category || price === undefined) {
      return NextResponse.json({ success: false, error: 'Name, category, and price are required' }, { status: 400 });
    }
    const newItem = await addMenuItem({
      name,
      category,
      price: Number(price),
      description: description || 'Freshly made signature recipe prepared with authentic quality ingredients.',
      image_url: image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAU6O3_jIxne8jyc3Yqm9Z5FbBBsv9TqhQPPHzocFskpztfk8HodKTvx78UeL-VlhBk14X5dQc9jlH8u3GhPPkaz1l9-5ORYsFNO4fv-RAmlbHJvwenjEb6jXkrcIw9mHsBMpTNo_u2ORjjSEjhE6_yfPRzlOxn6_gTiuYJlgNUD4GOHUQA5ChYoPWauwM9r_dxF7F5xKjZceLYlkpN_ktEmKMKGK9DESbvP5kn9GU',
      is_available: is_available ?? true,
    });
    return NextResponse.json({ success: true, data: newItem });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, category, price, description, image_url, is_available } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }
    const updated = await updateMenuItem(Number(id), {
      ...(name && { name }),
      ...(category && { category }),
      ...(price !== undefined && { price: Number(price) }),
      ...(description !== undefined && { description }),
      ...(image_url !== undefined && { image_url }),
      ...(is_available !== undefined && { is_available: Boolean(is_available) }),
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }
    const success = await deleteMenuItem(Number(id));
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


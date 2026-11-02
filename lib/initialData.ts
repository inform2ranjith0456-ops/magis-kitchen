export interface Customer {
  id: number;
  customer_code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  created_at?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: 'Starters' | 'Main Course' | 'Desserts';
  price: number;
  description: string;
  image_url: string;
  is_available: boolean;
  created_at?: string;
}

export interface OrderItem {
  id?: number;
  order_id?: number;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  image_url?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  order_date: string;
  created_at?: string;
  total_amount: number;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled' | 'preparing' | 'ready';
  fulfillment_type: string;
  payment_method: string;
  delivery_address: string;
  table_or_notes?: string;
  items: OrderItem[];
}

export interface Payment {
  id: number;
  payment_code: string;
  order_number: string;
  payment_date: string;
  payment_method: 'UPI' | 'Card' | 'Cash';
  payment_status: 'Successful' | 'Pending' | 'Failed';
  amount: number;
  notes?: string;
}

export interface Delivery {
  id: number;
  delivery_code: string;
  order_number: string;
  customer_name: string;
  delivery_address: string;
  delivery_status: 'Dispatched' | 'In Transit' | 'Delivered';
  delivery_date: string;
  estimated_minutes: number;
  driver_name: string;
  city: string;
}

export interface AdminSettings {
  id: number;
  full_name: string;
  email: string;
  role_description: string;
  theme: 'light' | 'dark';
  branch: string;
  default_view: string;
  audio_alert: boolean;
  low_stock_warning: boolean;
  daily_digest: boolean;
  currency?: string;
  tax_rate?: number;
  delivery_fee?: number;
  audio_alerts?: boolean;
  stock_warnings?: boolean;
  email_digest?: boolean;
}

export const initialCustomers: Customer[] = [
  {
    id: 1,
    customer_code: "#CUST-1001",
    name: "Aarav Sharma",
    phone: "+1 (555) 234-5678",
    email: "aarav.sharma@example.com",
    address: "742 Evergreen Terrace, Springfield",
    created_at: "2023-10-24 10:42:00"
  },
  {
    id: 2,
    customer_code: "#CUST-1002",
    name: "Priya Kumar",
    phone: "+1 (555) 876-5432",
    email: "priya.kumar@example.com",
    address: "128 Park Avenue, New York",
    created_at: "2023-10-24 11:15:00"
  },
  {
    id: 3,
    customer_code: "#CUST-1003",
    name: "Rahul Verma",
    phone: "+1 (555) 345-6789",
    email: "rahul.verma@example.com",
    address: "456 Oak Road, Austin",
    created_at: "2023-10-24 12:05:00"
  },
  {
    id: 4,
    customer_code: "#CUST-1004",
    name: "Ananya Patel",
    phone: "+1 (555) 987-6543",
    email: "ananya.patel@example.com",
    address: "789 Mission St, San Francisco",
    created_at: "2023-10-24 13:20:00"
  },
  {
    id: 5,
    customer_code: "#CUST-1005",
    name: "Vikram Singh",
    phone: "+1 (555) 456-7890",
    email: "vikram.singh@example.com",
    address: "321 Pine Blvd, Seattle",
    created_at: "2023-10-24 14:10:00"
  }
];

export const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Chicken 65",
    category: "Starters",
    price: 120,
    description: "Spicy, deep-fried chicken dish originating from South India, garnished with curry leaves and lemon.",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAU6O3_jIxne8jyc3Yqm9Z5FbBBsv9TqhQPPHzocFskpztfk8HodKTvx78UeL-VlhBk14X5dQc9jlH8u3GhPPkaz1l9-5ORYsFNO4fv-RAmlbHJvwenjEb6jXkrcIw9mHsBMpTNo_u2ORjjSEjhE6_yfPRzlOxn6_gTiuYJlgNUD4GOHUQA5ChYoPWauwM9r_dxF7F5xKjZceLYlkpN_ktEmKMKGK9DESbvP5kn9GU",
    is_available: true
  },
  {
    id: 2,
    name: "Paneer Tikka",
    category: "Starters",
    price: 150,
    description: "Marinated cottage cheese cubes grilled with bell peppers and onions in a traditional tandoor.",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRiQ7L5L0OfT-lOLU47Z4BUQzKdU8fN-0kcktYmH4iZngdhrkzTVkeEZxLEeuEzbYvrWodcaEOPj392_sedXpgXRiEhwDmeWcZmi8dZ5TqV1HDqFAFIF6rAiREvQmZuUE4nqhs6PxoZgjizRMQ54X0E4r04XPgYW9X-CTgiQLHBUaFT03MzmadNJynTebfX1x09FlmeKlaF1ar6dwmHUCd17ZNthJjvYEkhtBElPg",
    is_available: true
  },
  {
    id: 3,
    name: "Chicken Biriyani",
    category: "Main Course",
    price: 180,
    description: "Fragrant basmati rice layered with spiced tender chicken, saffron strands, mint, and fried onions.",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3v8V18vhWMqrLHR4kQmIBRAg0Kp0Y_-6CuS2CHBLGx7hGuJx4nU6LWefKBkApMmtYlgYTE5Gnb57Bn7_NjhuiC2Fdg_fvgYHe7zaKUkiAMUguRH8c0o_vIpeJG_auJA_ZDcyJAyMOPxMLoUrge5wuU9a6JkwP2zA4fnxcPmeCuY8WPqUav9R0B5q8Sj5OTBBEbRQ3yCMU7tCK7VlXurNcOlBxhBm1YmMywae9aCQ",
    is_available: true
  },
  {
    id: 4,
    name: "Veg Fried Rice",
    category: "Main Course",
    price: 130,
    description: "Wok-tossed aromatic rice with crisp seasonal vegetables, spring onions, and gentle soy seasoning.",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBokVcQl-KwbLOe5nXGjCYNk91CUQ1OGVDNHn3oSRDB5osmYahRsk9F3nSOq-xXVoPXjqq6vaJMmQIQ508snI1NjeodwlNqCxfN40FX188Z6OWu6IA2AV-LBuuJMOQxLJ42Ff6lvjzQppz6TYFViC-Pc7pG7dIcMx9v6SYR1ZPX_Fk8zrHc3ZzdDzb9FuFF04A-OhqMwUPk5i_zQKgYNl6rehTO5KSINSf_1Y3xM5k",
    is_available: true
  },
  {
    id: 5,
    name: "Gulab Jamun",
    category: "Desserts",
    price: 60,
    description: "Deep-fried milk-solid dumplings soaked in warm sweet rose and cardamom sugar syrup.",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBl7rXlU2oOwG4Gf-2WdLT_r2hXCknimxfI8QpBARrjuYmqWE43loRdEx_7UVdpxn1v1vRZehto75WxVaSvA0s2B2JAZ0V0fvKil_m1sax8oUF8dkwczkGnTWdMB5hhTX0VLEy-57V6P9JAYkt_S94I759v-ywDKtsxQNN0OWRi3OYcJYGL2UFDaXIAzU0OiJ8Ft-MMWZKTPx_XbhrTQChP8f1LyzwNgpjfFPV5K5c",
    is_available: true
  },
  {
    id: 6,
    name: "Ice Cream",
    category: "Desserts",
    price: 80,
    description: "Choice of classic artisan vanilla and chocolate ice cream scoops served with chocolate drizzle.",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPAbMUEA82bCq6xmt26GdlxLi1-ZhhXK70vz38RuYHG0D-jctcISh9PEfz1flmT1CwDEVATwWVGrTd6m1FY3yoIIf9pHCpE1_v_jMAuOzxwSv6cVAUmMXK-vkYkTMdyigd43XsZEbs_3mzOFDgpNCfb0odxAUVVZTAEz462mqfUChx4wAslqY-VJrOctU97nc0EkxJWTggVCGAcjrWQDYBMG7AaXf81gCk8nlHb9o",
    is_available: true
  }
];

export const initialOrders: Order[] = [
  {
    id: 1,
    order_number: "#1001",
    customer_name: "Aarav Sharma",
    customer_email: "aarav.sharma@example.com",
    customer_phone: "+1 (555) 234-5678",
    order_date: "Oct 24, 2023, 10:42 AM",
    total_amount: 1250,
    subtotal: 1100,
    tax: 100,
    delivery_fee: 50,
    status: "Pending",
    fulfillment_type: "Home Delivery",
    payment_method: "UPI",
    delivery_address: "742 Evergreen Terrace, Springfield, OR 97477",
    table_or_notes: "Table 4 • 2 items",
    items: [
      {
        item_name: "Chicken 65",
        quantity: 2,
        unit_price: 120,
        subtotal: 240,
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAU6O3_jIxne8jyc3Yqm9Z5FbBBsv9TqhQPPHzocFskpztfk8HodKTvx78UeL-VlhBk14X5dQc9jlH8u3GhPPkaz1l9-5ORYsFNO4fv-RAmlbHJvwenjEb6jXkrcIw9mHsBMpTNo_u2ORjjSEjhE6_yfPRzlOxn6_gTiuYJlgNUD4GOHUQA5ChYoPWauwM9r_dxF7F5xKjZceLYlkpN_ktEmKMKGK9DESbvP5kn9GU"
      },
      {
        item_name: "Chicken Biriyani",
        quantity: 5,
        unit_price: 180,
        subtotal: 900,
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3v8V18vhWMqrLHR4kQmIBRAg0Kp0Y_-6CuS2CHBLGx7hGuJx4nU6LWefKBkApMmtYlgYTE5Gnb57Bn7_NjhuiC2Fdg_fvgYHe7zaKUkiAMUguRH8c0o_vIpeJG_auJA_ZDcyJAyMOPxMLoUrge5wuU9a6JkwP2zA4fnxcPmeCuY8WPqUav9R0B5q8Sj5OTBBEbRQ3yCMU7tCK7VlXurNcOlBxhBm1YmMywae9aCQ"
      },
      {
        item_name: "Gulab Jamun",
        quantity: 2,
        unit_price: 60,
        subtotal: 120,
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBl7rXlU2oOwG4Gf-2WdLT_r2hXCknimxfI8QpBARrjuYmqWE43loRdEx_7UVdpxn1v1vRZehto75WxVaSvA0s2B2JAZ0V0fvKil_m1sax8oUF8dkwczkGnTWdMB5hhTX0VLEy-57V6P9JAYkt_S94I759v-ywDKtsxQNN0OWRi3OYcJYGL2UFDaXIAzU0OiJ8Ft-MMWZKTPx_XbhrTQChP8f1LyzwNgpjfFPV5K5c"
      }
    ]
  },
  {
    id: 2,
    order_number: "#1002",
    customer_name: "Priya Kumar",
    customer_email: "priya.kumar@example.com",
    customer_phone: "+1 (555) 876-5432",
    order_date: "Oct 24, 2023, 11:15 AM",
    total_amount: 2400,
    subtotal: 2150,
    tax: 180,
    delivery_fee: 70,
    status: "Processing",
    fulfillment_type: "Takeout",
    payment_method: "Card",
    delivery_address: "128 Park Avenue, New York, NY 10028",
    table_or_notes: "Takeout • 4 items",
    items: [
      {
        item_name: "Paneer Tikka",
        quantity: 4,
        unit_price: 150,
        subtotal: 600,
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRiQ7L5L0OfT-lOLU47Z4BUQzKdU8fN-0kcktYmH4iZngdhrkzTVkeEZxLEeuEzbYvrWodcaEOPj392_sedXpgXRiEhwDmeWcZmi8dZ5TqV1HDqFAFIF6rAiREvQmZuUE4nqhs6PxoZgjizRMQ54X0E4r04XPgYW9X-CTgiQLHBUaFT03MzmadNJynTebfX1x09FlmeKlaF1ar6dwmHUCd17ZNthJjvYEkhtBElPg"
      },
      {
        item_name: "Veg Fried Rice",
        quantity: 8,
        unit_price: 130,
        subtotal: 1040,
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBokVcQl-KwbLOe5nXGjCYNk91CUQ1OGVDNHn3oSRDB5osmYahRsk9F3nSOq-xXVoPXjqq6vaJMmQIQ508snI1NjeodwlNqCxfN40FX188Z6OWu6IA2AV-LBuuJMOQxLJ42Ff6lvjzQppz6TYFViC-Pc7pG7dIcMx9v6SYR1ZPX_Fk8zrHc3ZzdDzb9FuFF04A-OhqMwUPk5i_zQKgYNl6rehTO5KSINSf_1Y3xM5k"
      }
    ]
  },
  {
    id: 3,
    order_number: "#1003",
    customer_name: "Rahul Verma",
    customer_email: "rahul.verma@example.com",
    customer_phone: "+1 (555) 345-6789",
    order_date: "Oct 24, 2023, 12:05 PM",
    total_amount: 850,
    subtotal: 750,
    tax: 60,
    delivery_fee: 40,
    status: "Completed",
    fulfillment_type: "Dine-in",
    payment_method: "Cash",
    delivery_address: "456 Oak Road, Austin, TX 78701",
    table_or_notes: "Table 2 • 3 items",
    items: [
      {
        item_name: "Chicken Biriyani",
        quantity: 3,
        unit_price: 180,
        subtotal: 540,
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3v8V18vhWMqrLHR4kQmIBRAg0Kp0Y_-6CuS2CHBLGx7hGuJx4nU6LWefKBkApMmtYlgYTE5Gnb57Bn7_NjhuiC2Fdg_fvgYHe7zaKUkiAMUguRH8c0o_vIpeJG_auJA_ZDcyJAyMOPxMLoUrge5wuU9a6JkwP2zA4fnxcPmeCuY8WPqUav9R0B5q8Sj5OTBBEbRQ3yCMU7tCK7VlXurNcOlBxhBm1YmMywae9aCQ"
      },
      {
        item_name: "Ice Cream",
        quantity: 3,
        unit_price: 80,
        subtotal: 240,
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPAbMUEA82bCq6xmt26GdlxLi1-ZhhXK70vz38RuYHG0D-jctcISh9PEfz1flmT1CwDEVATwWVGrTd6m1FY3yoIIf9pHCpE1_v_jMAuOzxwSv6cVAUmMXK-vkYkTMdyigd43XsZEbs_3mzOFDgpNCfb0odxAUVVZTAEz462mqfUChx4wAslqY-VJrOctU97nc0EkxJWTggVCGAcjrWQDYBMG7AaXf81gCk8nlHb9o"
      }
    ]
  },
  {
    id: 4,
    order_number: "#1004",
    customer_name: "Ananya Patel",
    customer_email: "ananya.patel@example.com",
    customer_phone: "+1 (555) 987-6543",
    order_date: "Oct 24, 2023, 01:20 PM",
    total_amount: 3100,
    subtotal: 2800,
    tax: 220,
    delivery_fee: 80,
    status: "Processing",
    fulfillment_type: "Home Delivery",
    payment_method: "UPI",
    delivery_address: "789 Mission St, San Francisco, CA 94103",
    table_or_notes: "Delivery • 4 items",
    items: [
      {
        item_name: "Chicken Biriyani",
        quantity: 10,
        unit_price: 180,
        subtotal: 1800,
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3v8V18vhWMqrLHR4kQmIBRAg0Kp0Y_-6CuS2CHBLGx7hGuJx4nU6LWefKBkApMmtYlgYTE5Gnb57Bn7_NjhuiC2Fdg_fvgYHe7zaKUkiAMUguRH8c0o_vIpeJG_auJA_ZDcyJAyMOPxMLoUrge5wuU9a6JkwP2zA4fnxcPmeCuY8WPqUav9R0B5q8Sj5OTBBEbRQ3yCMU7tCK7VlXurNcOlBxhBm1YmMywae9aCQ"
      },
      {
        item_name: "Chicken 65",
        quantity: 5,
        unit_price: 120,
        subtotal: 600,
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAU6O3_jIxne8jyc3Yqm9Z5FbBBsv9TqhQPPHzocFskpztfk8HodKTvx78UeL-VlhBk14X5dQc9jlH8u3GhPPkaz1l9-5ORYsFNO4fv-RAmlbHJvwenjEb6jXkrcIw9mHsBMpTNo_u2ORjjSEjhE6_yfPRzlOxn6_gTiuYJlgNUD4GOHUQA5ChYoPWauwM9r_dxF7F5xKjZceLYlkpN_ktEmKMKGK9DESbvP5kn9GU"
      }
    ]
  },
  {
    id: 5,
    order_number: "#1005",
    customer_name: "Vikram Singh",
    customer_email: "vikram.singh@example.com",
    customer_phone: "+1 (555) 456-7890",
    order_date: "Oct 24, 2023, 02:10 PM",
    total_amount: 1950,
    subtotal: 1750,
    tax: 140,
    delivery_fee: 60,
    status: "Pending",
    fulfillment_type: "Takeout",
    payment_method: "UPI",
    delivery_address: "321 Pine Blvd, Seattle, WA 98101",
    table_or_notes: "Table 7 • 5 items",
    items: [
      {
        item_name: "Veg Fried Rice",
        quantity: 5,
        unit_price: 130,
        subtotal: 650,
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBokVcQl-KwbLOe5nXGjCYNk91CUQ1OGVDNHn3oSRDB5osmYahRsk9F3nSOq-xXVoPXjqq6vaJMmQIQ508snI1NjeodwlNqCxfN40FX188Z6OWu6IA2AV-LBuuJMOQxLJ42Ff6lvjzQppz6TYFViC-Pc7pG7dIcMx9v6SYR1ZPX_Fk8zrHc3ZzdDzb9FuFF04A-OhqMwUPk5i_zQKgYNl6rehTO5KSINSf_1Y3xM5k"
      },
      {
        item_name: "Paneer Tikka",
        quantity: 5,
        unit_price: 150,
        subtotal: 750,
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRiQ7L5L0OfT-lOLU47Z4BUQzKdU8fN-0kcktYmH4iZngdhrkzTVkeEZxLEeuEzbYvrWodcaEOPj392_sedXpgXRiEhwDmeWcZmi8dZ5TqV1HDqFAFIF6rAiREvQmZuUE4nqhs6PxoZgjizRMQ54X0E4r04XPgYW9X-CTgiQLHBUaFT03MzmadNJynTebfX1x09FlmeKlaF1ar6dwmHUCd17ZNthJjvYEkhtBElPg"
      }
    ]
  }
];

export const initialPayments: Payment[] = [
  {
    id: 1,
    payment_code: "#PAY-9021",
    order_number: "#1001",
    payment_date: "Oct 24, 2023, 14:25",
    payment_method: "UPI",
    payment_status: "Successful",
    amount: 1250.00,
    notes: "Verified via UPI gateway"
  },
  {
    id: 2,
    payment_code: "#PAY-9020",
    order_number: "#1002",
    payment_date: "Oct 24, 2023, 13:50",
    payment_method: "Card",
    payment_status: "Successful",
    amount: 2400.00,
    notes: "Mastercard ending in 4242"
  },
  {
    id: 3,
    payment_code: "#PAY-9019",
    order_number: "#1003",
    payment_date: "Oct 24, 2023, 13:15",
    payment_method: "Cash",
    payment_status: "Pending",
    amount: 850.00,
    notes: "Cash on delivery due upon receipt"
  },
  {
    id: 4,
    payment_code: "#PAY-9018",
    order_number: "#1004",
    payment_date: "Oct 24, 2023, 12:40",
    payment_method: "UPI",
    payment_status: "Successful",
    amount: 3100.00,
    notes: "Google Pay instant transfer"
  },
  {
    id: 5,
    payment_code: "#PAY-9017",
    order_number: "#1005",
    payment_date: "Oct 24, 2023, 12:05",
    payment_method: "Card",
    payment_status: "Failed",
    amount: 1950.00,
    notes: "Bank timeout - awaiting customer retry"
  },
  {
    id: 6,
    payment_code: "#PAY-9016",
    order_number: "#1000",
    payment_date: "Oct 24, 2023, 11:30",
    payment_method: "Cash",
    payment_status: "Successful",
    amount: 650.00,
    notes: "Counter cash collected"
  }
];

export const initialDeliveries: Delivery[] = [
  {
    id: 1,
    delivery_code: "DEL-9021",
    order_number: "#1001",
    customer_name: "Aarav Sharma",
    delivery_address: "T-Nagar, Chennai",
    delivery_status: "In Transit",
    delivery_date: "Oct 24, 2023 • 14:30",
    estimated_minutes: 14,
    driver_name: "Senthil Kumar (+91 98401 XXXXX)",
    city: "Chennai"
  },
  {
    id: 2,
    delivery_code: "DEL-9022",
    order_number: "#1002",
    customer_name: "Rahul Verma",
    delivery_address: "Koramangala, Bengaluru",
    delivery_status: "Dispatched",
    delivery_date: "Oct 24, 2023 • 15:00",
    estimated_minutes: 25,
    driver_name: "Manoj Gowda (+91 98802 XXXXX)",
    city: "Bengaluru"
  },
  {
    id: 3,
    delivery_code: "DEL-9023",
    order_number: "#1003",
    customer_name: "Priya Reddy",
    delivery_address: "Banjara Hills, Hyderabad",
    delivery_status: "Delivered",
    delivery_date: "Oct 24, 2023 • 13:15",
    estimated_minutes: 0,
    driver_name: "Kiran Rao (+91 98490 XXXXX)",
    city: "Hyderabad"
  },
  {
    id: 4,
    delivery_code: "DEL-9024",
    order_number: "#1004",
    customer_name: "Karthik Kumar",
    delivery_address: "Adyar, Chennai",
    delivery_status: "In Transit",
    delivery_date: "Oct 24, 2023 • 15:45",
    estimated_minutes: 18,
    driver_name: "Senthil Kumar (+91 98401 XXXXX)",
    city: "Chennai"
  }
];

export const initialAdminSettings: AdminSettings = {
  id: 1,
  full_name: "Gokul Raj",
  email: "admin@magiskitchen.com",
  role_description: "Master Kitchen Supervisor & Operations Manager",
  theme: "light",
  branch: "Downtown Flagship Kitchen (Main)",
  default_view: "Live Order Grid & Kitchen Queue",
  audio_alert: true,
  low_stock_warning: true,
  daily_digest: false
};


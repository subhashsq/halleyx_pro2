// Widget types
export interface WidgetConfig {
  // KPI
  metric?: string;
  aggregation?: string;
  dataFormat?: string;
  decimalPrecision?: number;
  // Charts
  xAxis?: string;
  yAxis?: string;
  chartColor?: string;
  showDataLabel?: boolean;
  // Pie
  dataField?: string;
  showLegend?: boolean;
  // Table
  columns?: string[];
  sortBy?: string;
  pagination?: number;
  applyFilter?: boolean;
  filters?: TableFilter[];
  fontSize?: number;
  headerBackground?: string;
}

export interface TableFilter {
  column: string;
  operator: string;
  value: string;
}

export interface Widget {
  id?: number;
  i: string; // react-grid-layout key
  dashboardId?: number;
  type: string;
  title: string;
  description: string;
  x: number;
  y: number;
  w: number;
  h: number;
  config: WidgetConfig;
}

export interface DashboardConfig {
  id?: number;
  name: string;
  dateFilter: string;
  widgets: Widget[];
}

export interface CustomerOrder {
  id?: number;
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  orderId: string;
  orderDate: string;
  product: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

// Widget category definitions
export const WIDGET_CATEGORIES = [
  {
    name: 'Charts',
    widgets: [
      { type: 'bar', label: 'Bar Chart', icon: '📊' },
      { type: 'line', label: 'Line Chart', icon: '📈' },
      { type: 'pie', label: 'Pie Chart', icon: '🥧' },
      { type: 'area', label: 'Area Chart', icon: '📉' },
      { type: 'scatter', label: 'Scatter Plot', icon: '⚬' },
    ],
  },
  {
    name: 'Tables',
    widgets: [
      { type: 'table', label: 'Table', icon: '📋' },
    ],
  },
  {
    name: 'KPIs',
    widgets: [
      { type: 'kpi', label: 'KPI Value', icon: '🎯' },
    ],
  },
];

export const DATE_FILTER_OPTIONS = [
  { value: 'all', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
];

export const METRIC_FIELDS = [
  'Customer ID', 'Customer name', 'Email id', 'Address',
  'Order date', 'Product', 'Created by', 'Status',
  'Total amount', 'Unit price', 'Quantity',
];

export const NUMERIC_FIELDS = ['Total amount', 'Unit price', 'Quantity'];

export const AGGREGATION_OPTIONS = ['Sum', 'Average', 'Count'];

export const CHART_AXIS_FIELDS = [
  'Product', 'Quantity', 'Unit price', 'Total amount',
  'Status', 'Created by',
];

export const PIE_DATA_FIELDS = [
  'Product', 'Quantity', 'Unit price', 'Total amount',
  'Status', 'Created by',
];

export const TABLE_COLUMN_OPTIONS = [
  'Customer ID', 'Customer name', 'Email id', 'Phone number',
  'Address', 'Order ID', 'Order date', 'Product', 'Quantity',
  'Unit price', 'Total amount', 'Status', 'Created by',
];

export const DEFAULT_WIDGET_SIZES: Record<string, { w: number; h: number }> = {
  kpi: { w: 2, h: 2 },
  bar: { w: 5, h: 5 },
  line: { w: 5, h: 5 },
  area: { w: 5, h: 5 },
  scatter: { w: 5, h: 5 },
  pie: { w: 4, h: 4 },
  table: { w: 4, h: 4 },
};

export const FIELD_DB_MAP: Record<string, string> = {
  'Customer ID': 'customerId',
  'Customer name': 'customerName',
  'Email id': 'email',
  'Phone number': 'phone',
  'Address': 'address',
  'Order ID': 'orderId',
  'Order date': 'orderDate',
  'Product': 'product',
  'Quantity': 'quantity',
  'Unit price': 'unitPrice',
  'Total amount': 'totalAmount',
  'Status': 'status',
  'Created by': 'createdBy',
};

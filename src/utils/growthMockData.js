// Mock data for Beauty Salon Dashboard

export const salesByDaysData = [
    { day: 'Sun', value: 40 },
    { day: 'Mon', value: 25 },
    { day: 'Tue', value: 30 },
    { day: 'Wed', value: 17 },
    { day: 'Thu', value: 25 },
    { day: 'Fri', value: 24 },
    { day: 'Sat', value: 40 },
  ];
  
  export const expenseBreakdownData = [
    { name: 'Rent', value: 20000, color: '#F472B6' },
    { name: 'Products Cost', value: 10000, color: '#C084FC' },
    { name: 'Maintenance', value: 500, color: '#F9A8D4' },
    { name: 'Billing', value: 1000, color: '#A855F7' },
    { name: 'Others', value: 1250, color: '#FBCFE8' },
  ];
  
  export const servicesCategoryData = [
    { name: 'Hair Cut', male: 45, female: 36 },
    { name: 'Hair wash', male: 50, female: 30 },
    { name: 'Facial', male: 30, female: 25 },
    { name: 'Waxing', male: 25, female: 40 },
    { name: 'Manicure', male: 30, female: 40 },
    { name: 'Pedicure', male: 28, female: 41 },
  ];
  
  export const customersData = [
    { type: 'New', male: 45, female: 25 },
    { type: 'Returning', male: 10, female: 22 },
  ];
  
  export const revenueVsExpensesData = [
    { month: 'Jan', revenue: 40, expenses: 25 },
    { month: 'Feb', revenue: 35, expenses: 20 },
    { month: 'Mar', revenue: 32, expenses: 15 },
    { month: 'Apr', revenue: 40, expenses: 18 },
    { month: 'May', revenue: 48, expenses: 20 },
    { month: 'June', revenue: 56, expenses: 22 },
    { month: 'July', revenue: 35, expenses: 30 },
    { month: 'Aug', revenue: 25, expenses: 20 },
    { month: 'Sept', revenue: 35, expenses: 15 },
    { month: 'Oct', revenue: 50, expenses: 30 },
    { month: 'Nov', revenue: 32, expenses: 20 },
    { month: 'Dec', revenue: 30, expenses: 15 },
  ];
  
  export const salesHistoryData = [
    {
      id: '#ABC-4629',
      date: '2 mins ago',
      dateTime: '04-04-25, 2:30',
      customer: 'James',
      mobile: '9218347585',
      serviceCategory: 'Hair care',
      services: 'Hair cut, Beard, Facial',
      staff: 'John',
      total: '$650',
      discount: '$0',
      finalPrice: '$650',
      paymentMode: '-'
    },
    {
      id: '#ABC-4630',
      date: '5 mins ago',
      dateTime: '04-04-25, 2:25',
      customer: 'Andy',
      mobile: '3456786789',
      serviceCategory: 'Skin Care',
      services: 'Facial, Massage',
      staff: 'Andy',
      total: '$720',
      discount: '$0',
      finalPrice: '$720',
      paymentMode: '-'
    },
    {
      id: '#ABC-4631',
      date: '10 mins ago',
      dateTime: '04-04-25, 2:20',
      customer: 'Mark',
      mobile: '1234567054',
      serviceCategory: 'Hair care',
      services: 'Hair wash, hair conditioning, Waxing',
      staff: 'Mark',
      total: '$1050',
      discount: '$0',
      finalPrice: '$1050',
      paymentMode: 'Cash'
    },
    {
      id: '#ABC-4632',
      date: '20 mins ago',
      dateTime: '04-04-25, 2:10',
      customer: 'Steve',
      mobile: '2345676543',
      serviceCategory: 'Hair care',
      services: 'Hair cut, Hair wash, Hair conditioning',
      staff: 'Steve',
      total: '$750',
      discount: '$0',
      finalPrice: '$750',
      paymentMode: 'UPI'
    },
  ];

  // Mock data for Funnel Chart
export const salesFunnelData = [
    {
      stage: 'Sessions',
      value: 9300,
      percent: 100,
    },
    {
      stage: 'Product View',
      value: 4700,
      percent: 50.5,
    },
    {
      stage: 'Add to Cart',
      value: 914,
      percent: 9.8,
    },
    {
      stage: 'Initiate Checkout',
      value: 872,
      percent: 9.3,
    },
    {
      stage: 'Purchase',
      value: 463,
      percent: 5.0,
    }
  ];
  
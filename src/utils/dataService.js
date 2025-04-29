// Mock data with Indian names for RFM Segments
export const fetchCustomerData = {
    1: [ // Champions
        {
            "id": "CUST-1001",
            "name": "Rohit Sharma",
            "email": "rohit.sharma@example.in",
            "orders": 24,
            "revenue": 12560,
            "lastOrderDays": 15,
            "last5Orders": [
              { "orderId": "ORD-98765", "date": "2025-04-24", "amount": 1450, "service": "Haircut & Beard Trim" },
              { "orderId": "ORD-98766", "date": "2025-04-15", "amount": 1820, "service": "Facial & Cleanup" },
              { "orderId": "ORD-98767", "date": "2025-04-02", "amount": 920, "service": "Pedicure" },
              { "orderId": "ORD-98768", "date": "2025-03-20", "amount": 1320, "service": "Hair Spa" },
              { "orderId": "ORD-98769", "date": "2025-03-05", "amount": 1150, "service": "Body Massage" }
            ]
          },
        {
            "id": "CUST-1021",
            "name": "Rahul Sharma",
            "email": "rohit.sharma@example.in",
            "orders": 24,
            "revenue": 12560,
            "lastOrderDays": 15,
            "last5Orders": [
              { "orderId": "ORD-98765", "date": "2025-04-24", "amount": 1450, "service": "Haircut & Beard Trim" },
              { "orderId": "ORD-98766", "date": "2025-04-15", "amount": 1820, "service": "Facial & Cleanup" },
              { "orderId": "ORD-98767", "date": "2025-04-02", "amount": 920, "service": "Pedicure" },
              { "orderId": "ORD-98768", "date": "2025-03-20", "amount": 1320, "service": "Hair Spa" },
              { "orderId": "ORD-98769", "date": "2025-03-05", "amount": 1150, "service": "Body Massage" }
            ]
          },
    ],
    2: [ // Loyal Customers
        {
            "id": "CUST-1002",
            "name": "Priya Verma",
            "email": "priya.verma@example.in",
            "orders": 18,
            "revenue": 8230,
            "lastOrderDays": 10,
            "last5Orders": [
              { "orderId": "ORD-98770", "date": "2025-04-25", "amount": 1090, "service": "Haircut" },
              { "orderId": "ORD-98771", "date": "2025-04-12", "amount": 1050, "service": "Facial" },
              { "orderId": "ORD-98772", "date": "2025-03-28", "amount": 780, "service": "Shave" },
              { "orderId": "ORD-98773", "date": "2025-03-15", "amount": 1200, "service": "Hair Color" },
              { "orderId": "ORD-98774", "date": "2025-03-01", "amount": 720, "service": "Manicure" }
            ]
          },
    ],
    3: [ // Potential Loyalist
        {
            "id": "CUST-1003",
            "name": "Amit Patel",
            "email": "amit.patel@example.in",
            "orders": 12,
            "revenue": 5200,
            "lastOrderDays": 7,
            "last5Orders": [
              { "orderId": "ORD-98775", "date": "2025-04-26", "amount": 950, "service": "Beard Trim" },
              { "orderId": "ORD-98776", "date": "2025-04-05", "amount": 1120, "service": "Pedicure" },
              { "orderId": "ORD-98777", "date": "2025-03-18", "amount": 800, "service": "Haircut" },
              { "orderId": "ORD-98778", "date": "2025-03-02", "amount": 550, "service": "Shave" },
              { "orderId": "ORD-98779", "date": "2025-02-20", "amount": 730, "service": "Hair Spa" }
            ]
          },

    ],
    4: [ // New Customers
        {
            "id": "CUST-1004",
            "name": "Neha Gupta",
            "email": "neha.gupta@example.in",
            "orders": 20,
            "revenue": 3500,
            "lastOrderDays": 30,
            "last5Orders": [
              { "orderId": "ORD-98780", "date": "2025-03-28", "amount": 450, "service": "Shave" },
              { "orderId": "ORD-98781", "date": "2025-03-10", "amount": 500, "service": "Haircut" },
              { "orderId": "ORD-98782", "date": "2025-02-25", "amount": 350, "service": "Facial" },
              { "orderId": "ORD-98783", "date": "2025-02-10", "amount": 400, "service": "Pedicure" },
              { "orderId": "ORD-98784", "date": "2025-01-25", "amount": 300, "service": "Manicure" }
            ]
          },

    ],
    5: [
        {
            "id": "CUST-1005",
            "name": "Suresh Kumar",
            "email": "suresh.kumar@example.in",
            "orders": 8,
            "revenue": 1500,
            "lastOrderDays": 60,
            "last5Orders": [
              { "orderId": "ORD-98785", "date": "2025-02-15", "amount": 350, "service": "Haircut" },
              { "orderId": "ORD-98786", "date": "2025-01-10", "amount": 280, "service": "Shave" },
              { "orderId": "ORD-98787", "date": "2025-01-01", "amount": 250, "service": "Facial" },
              { "orderId": "ORD-98788", "date": "2024-12-20", "amount": 300, "service": "Manicure" },
              { "orderId": "ORD-98789", "date": "2024-12-10", "amount": 320, "service": "Pedicure" }
            ]
          },
      ],
      6: [
        {
            "id": "CUST-1006",
            "name": "Maya Singh",
            "email": "maya.singh@example.in",
            "orders": 30,
            "revenue": 14200,
            "lastOrderDays": 45,
            "last5Orders": [
              { "orderId": "ORD-98790", "date": "2025-03-10", "amount": 1900, "service": "Body Massage" },
              { "orderId": "ORD-98791", "date": "2025-02-05", "amount": 2200, "service": "Hair Color" },
              { "orderId": "ORD-98792", "date": "2025-01-15", "amount": 1800, "service": "Facial & Cleanup" },
              { "orderId": "ORD-98793", "date": "2025-01-02", "amount": 1500, "service": "Haircut & Beard Trim" },
              { "orderId": "ORD-98794", "date": "2024-12-15", "amount": 1700, "service": "Pedicure & Manicure" }
            ]
          },
      ],
      7: [
        {
            "id": "CUST-1007",
            "name": "Deepak Reddy",
            "email": "deepak.reddy@example.in",
            "orders": 15,
            "revenue": 2700,
            "lastOrderDays": 75,
            "last5Orders": [
              { "orderId": "ORD-98795", "date": "2025-01-10", "amount": 550, "service": "Shave" },
              { "orderId": "ORD-98796", "date": "2024-12-15", "amount": 300, "service": "Pedicure" },
              { "orderId": "ORD-98797", "date": "2024-12-05", "amount": 500, "service": "Haircut" },
              { "orderId": "ORD-98798", "date": "2024-11-25", "amount": 600, "service": "Manicure" },
              { "orderId": "ORD-98799", "date": "2024-11-10", "amount": 750, "service": "Hair Spa" }
            ]
          },
          
      ],
      8: [
        {
            "id": "CUST-1008",
            "name": "Kavita Mehta",
            "email": "kavita.mehta@example.in",
            "orders": 14,
            "revenue": 2900,
            "lastOrderDays": 5,
            "last5Orders": [
              { "orderId": "ORD-98800", "date": "2025-04-25", "amount": 400, "service": "Haircut" },
              { "orderId": "ORD-98801", "date": "2025-04-10", "amount": 550, "service": "Facial" },
              { "orderId": "ORD-98802", "date": "2025-03-30", "amount": 500, "service": "Manicure" },
              { "orderId": "ORD-98803", "date": "2025-03-15", "amount": 600, "service": "Shave" },
              { "orderId": "ORD-98804", "date": "2025-03-01", "amount": 850, "service": "Pedicure" }
            ]
          },

      ],
      9: [
        {
            "id": "CUST-1009",
            "name": "Sandeep Kumar",
            "email": "sandeep.kumar@example.in",
            "orders": 22,
            "revenue": 5400,
            "lastOrderDays": 50,
            "last5Orders": [
              { "orderId": "ORD-98805", "date": "2025-02-10", "amount": 800, "service": "Haircut" },
              { "orderId": "ORD-98806", "date": "2025-01-15", "amount": 720, "service": "Pedicure" },
              { "orderId": "ORD-98807", "date": "2025-01-05", "amount": 680, "service": "Shave" },
              { "orderId": "ORD-98808", "date": "2024-12-15", "amount": 950, "service": "Facial" },
              { "orderId": "ORD-98809", "date": "2024-12-01", "amount": 650, "service": "Hair Spa" }
            ]
          },
      ],
      10: [
        {
            "id": "CUST-1010",
            "name": "Simi Yadav",
            "email": "simi.yadav@example.in",
            "orders": 16,
            "revenue": 7200,
            "lastOrderDays": 30,
            "last5Orders": [
              { "orderId": "ORD-98810", "date": "2025-03-30", "amount": 1600, "service": "Hair Color" },
              { "orderId": "ORD-98811", "date": "2025-03-05", "amount": 1200, "service": "Facial & Cleanup" },
              { "orderId": "ORD-98812", "date": "2025-02-20", "amount": 1100, "service": "Haircut & Beard Trim" },
              { "orderId": "ORD-98813", "date": "2025-02-10", "amount": 1000, "service": "Pedicure & Manicure" },
              { "orderId": "ORD-98814", "date": "2025-01-25", "amount": 1300, "service": "Body Massage" }
            ]
          },          
       
      ]
                              
      
  };
  
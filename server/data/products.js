const products = [
  {
    name: "Premium Tower Fan",
    brand: "Zuvee",
    category: "fan",
    description: "A sleek tower fan with 3-speed settings and oscillation for maximum air circulation. Perfect for bedrooms and living rooms.",
    basePrice: 89.99,
    features: [
      "3-speed settings",
      "Wide oscillation",
      "Remote control included",
      "Timer function",
      "Energy efficient"
    ],
    specifications: {
      Power: "45W",
      Height: "120cm",
      Weight: "3.5kg",
      "Noise Level": "Low"
    },
    images: [
      "https://images.unsplash.com/photo-1587212695667-3700b1be0e6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1587212695753-9f8c3f4b9f66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    variants: [
      {
        size: "Standard",
        color: { name: "White", code: "#FFFFFF" },
        price: 89.99,
        stock: 15,
        sku: "TF-WHT-STD"
      },
      {
        size: "Standard",
        color: { name: "Black", code: "#000000" },
        price: 89.99,
        stock: 10,
        sku: "TF-BLK-STD"
      }
    ],
    ratings: {
      average: 4.5,
      count: 28
    }
  },
  {
    name: "Ceiling Fan with LED Light",
    brand: "Zuvee",
    category: "fan",
    description: "Modern ceiling fan with integrated LED light and remote control. Features 5 blades for optimal air flow.",
    basePrice: 149.99,
    features: [
      "Integrated LED light",
      "Remote control operation",
      "5 reversible blades",
      "3 speed settings",
      "Winter/summer mode"
    ],
    specifications: {
      Power: "65W",
      "Blade Span": "52 inches",
      Light: "18W LED",
      Mounting: "Downrod or flush mount"
    },
    images: [
      "https://images.unsplash.com/photo-1565014292424-4eec2afe6613?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1565014292-8c5e8dce3a1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    variants: [
      {
        size: "52 inch",
        color: { name: "Brushed Nickel", code: "#C0C0C0" },
        price: 149.99,
        stock: 8,
        sku: "CF-BN-52"
      },
      {
        size: "52 inch",
        color: { name: "Oil-Rubbed Bronze", code: "#614E3D" },
        price: 159.99,
        stock: 12,
        sku: "CF-ORB-52"
      },
      {
        size: "42 inch",
        color: { name: "Brushed Nickel", code: "#C0C0C0" },
        price: 129.99,
        stock: 7,
        sku: "CF-BN-42"
      }
    ],
    ratings: {
      average: 4.7,
      count: 42
    }
  },
  {
    name: "Portable Air Conditioner",
    brand: "Zuvee",
    category: "ac",
    description: "Powerful portable air conditioner suitable for rooms up to 400 sq ft. Easy to move between rooms with included casters.",
    basePrice: 349.99,
    features: [
      "10,000 BTU cooling power",
      "Dehumidifier function",
      "Digital control panel",
      "24-hour timer",
      "Remote control included",
      "Easy-roll casters"
    ],
    specifications: {
      "Cooling Capacity": "10,000 BTU",
      "Room Size": "Up to 400 sq ft",
      "Noise Level": "52 dB",
      "Weight": "29 kg"
    },
    images: [
      "https://images.unsplash.com/photo-1585513553738-a3223fd2baec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1585513553711-8c2d9c9f4c0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    variants: [
      {
        size: "10,000 BTU",
        color: { name: "White", code: "#FFFFFF" },
        price: 349.99,
        stock: 5,
        sku: "PAC-WHT-10K"
      },
      {
        size: "12,000 BTU",
        color: { name: "White", code: "#FFFFFF" },
        price: 429.99,
        stock: 3,
        sku: "PAC-WHT-12K"
      }
    ],
    ratings: {
      average: 4.2,
      count: 18
    }
  },
  {
    name: "Split Air Conditioner",
    brand: "Zuvee",
    category: "ac",
    description: "Energy-efficient split air conditioner with inverter technology. Cools quickly and maintains consistent temperature.",
    basePrice: 799.99,
    features: [
      "Inverter technology",
      "Energy Star certified",
      "Sleep mode",
      "Auto restart after power outage",
      "Self-cleaning function",
      "WiFi connectivity"
    ],
    specifications: {
      "Cooling Capacity": "12,000 BTU",
      "SEER Rating": "21",
      "Room Size": "Up to 550 sq ft",
      "Refrigerant": "R410A"
    },
    images: [
      "https://images.unsplash.com/photo-1581275233124-e1e5c9e0f7b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1581275233114-b09b0c49f561?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    variants: [
      {
        size: "12,000 BTU",
        color: { name: "White", code: "#FFFFFF" },
        price: 799.99,
        stock: 4,
        sku: "SAC-WHT-12K"
      },
      {
        size: "18,000 BTU",
        color: { name: "White", code: "#FFFFFF" },
        price: 999.99,
        stock: 2,
        sku: "SAC-WHT-18K"
      },
      {
        size: "24,000 BTU",
        color: { name: "White", code: "#FFFFFF" },
        price: 1299.99,
        stock: 1,
        sku: "SAC-WHT-24K"
      }
    ],
    ratings: {
      average: 4.8,
      count: 32
    }
  },
  {
    name: "Smart Desk Fan",
    brand: "Zuvee",
    category: "fan",
    description: "Compact desk fan with smart features including app control and voice assistant compatibility.",
    basePrice: 49.99,
    features: [
      "App control via smartphone",
      "Compatible with Alexa and Google Home",
      "10 speed settings",
      "Ultra-quiet operation",
      "USB powered",
      "Adjustable height and tilt"
    ],
    specifications: {
      Power: "5W",
      Diameter: "8 inches",
      Height: "12-16 inches (adjustable)",
      Connectivity: "Bluetooth, WiFi"
    },
    images: [
      "https://images.unsplash.com/photo-1587212658352-bd705f8d0f7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1587212658382-d2e07a4d0b4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    variants: [
      {
        size: "8 inch",
        color: { name: "White", code: "#FFFFFF" },
        price: 49.99,
        stock: 20,
        sku: "SDF-WHT-8"
      },
      {
        size: "8 inch",
        color: { name: "Black", code: "#000000" },
        price: 49.99,
        stock: 15,
        sku: "SDF-BLK-8"
      },
      {
        size: "8 inch",
        color: { name: "Blue", code: "#1E90FF" },
        price: 54.99,
        stock: 8,
        sku: "SDF-BLU-8"
      }
    ],
    ratings: {
      average: 4.4,
      count: 56
    }
  },
  {
    name: "Window Air Conditioner",
    brand: "Zuvee",
    category: "ac",
    description: "Efficient window-mounted air conditioner with easy installation and multiple cooling modes.",
    basePrice: 279.99,
    features: [
      "3-in-1: Cooling, Fan, Dehumidifier",
      "Energy saving mode",
      "Washable filter",
      "Remote control included",
      "Sleep mode",
      "24-hour timer"
    ],
    specifications: {
      "Cooling Capacity": "8,000 BTU",
      "Room Size": "Up to 350 sq ft",
      "EER Rating": "12.1",
      "Window Width": "23-36 inches"
    },
    images: [
      "https://images.unsplash.com/photo-1580595999172-187725a0a7fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1580595999157-e7c0100b9a81?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    variants: [
      {
        size: "8,000 BTU",
        color: { name: "White", code: "#FFFFFF" },
        price: 279.99,
        stock: 10,
        sku: "WAC-WHT-8K"
      },
      {
        size: "10,000 BTU",
        color: { name: "White", code: "#FFFFFF" },
        price: 329.99,
        stock: 7,
        sku: "WAC-WHT-10K"
      },
      {
        size: "12,000 BTU",
        color: { name: "White", code: "#FFFFFF" },
        price: 379.99,
        stock: 5,
        sku: "WAC-WHT-12K"
      }
    ],
    ratings: {
      average: 4.3,
      count: 27
    }
  }
];

module.exports = products;

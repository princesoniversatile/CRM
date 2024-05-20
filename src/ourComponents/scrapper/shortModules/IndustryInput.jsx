import React, { useState } from "react";

const IndustryInput = ({ onIndustryChange, onIndustryKeyPress }) => {
  const [industry, setIndustry] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Array of industry suggestions
  const industrySuggestions = [
    "Restaurants",
    "Retail",
    "Technology",
    "Healthcare",
    "Automotive",
    "Finance",
    "Education",
    "Travel",
    "Entertainment",
    "Fashion",
    "Construction",
    "Real Estate",
    "Hospitality",
    "Food & Beverage",
    "Sports",
    "Art & Culture",
    "Beauty & Wellness",
    "Media",
    "Transportation",
    "Fitness",
    "Insurance",
    "Gaming",
    "Home Services",
    "Nonprofit",
    "Legal",
    "Agriculture",
    "It Services",
    "Smartphones",
    "Laptops",
    "Tablets",
    "Smartwatches",
    "Gaming Consoles",
    "Gaming Laptops",
    "Gaming Accessories",
    "Wireless Earbuds/Headphones",
    "Home Audio Systems",
    "Digital Cameras",
    "Drones",
    "Fitness Trackers",
    "Kitchen Appliances",
    "Smart TVs",
    "Streaming Devices",
    "Robot Vacuums",
    "Home Appliances",
    "Computer Peripherals",
    "External Storage Devices",
    "Networking Equipment",
    "Smart Home Devices",
    "Home Security Devices",
    "Kitchen Cookware",
    "Furniture",
    "Fashion Apparel",
    "Footwear",
    "Bags and Backpacks",
    "Sunglasses",
    "Beauty and Makeup",
    "Hair Styling Tools",
    "Sporting Equipment",
    "Outdoor Gear",
    "Children's Toys",
    "Educational Games",
    "Books",
    "E-Readers",
    "Office Supplies",
    "Stationery",
    "Health and Wellness Products",
    "Supplements",
    "Car Accessories",
    "Motorcycle Gear",
    "Pet Supplies",
    "Pet Food",
    "Gardening Tools",
    "Outdoor Furniture",
    "DIY/Home Improvement Tools",
    "Musical Instruments",
    "Audio Recording Equipment",
    "Travel Accessories",
    "Luggage",
    "Art and Craft Supplies",
    "Camping Gear",
    "Hiking Equipment",
    "Board Games",
    "Puzzles",
    "Cooking Utensils",
    "Bakeware",
    "Jewelry",
    "Watches",
    "Home Decor",
    "Wall Art",
    "Baby Gear",
    "Nursery Furniture",
    "Fitness Equipment",
    "Exercise Gear",
    "Electronic Gadgets",
    "Tech Accessories",
    "Party Supplies",
    "Event Decor",
    "Hobby Materials",
    "Collectibles",
    "Sustainable Products",
    "Environmentally Friendly Items",
    "Subscription Services",
    "Memberships",
    "Antiques",
    "Vintage Items",
    "Food and Beverages",
    "Snacks",
    "Safety Equipment",
    "Emergency Kits",
    "Boarding and Training Services",
    "Pet Grooming",
    "Financial Services",
    "Investment Opportunities",
    "Luxury Goods",
    "High-End Products",
    "Virtual Reality Gear",
    "Augmented Reality Devices",
    "Fitness Classes",
    "Wellness Programs",
    "Personalized Gifts",
    "Customized Items",
    "Educational Courses",
    "Online Learning Platforms",
    "Handmade Crafts",
    "Artisanal Products",
    "Automotive Parts",
    "DIY Electronics",
    "Office Furniture",
    "Computer Software",
    "Home Security Cameras",
    "Scientific Equipment",
    "Industrial Tools",
    "Medical Devices",
    "Cosmetics",
    "Skincare Products",
    "Educational Toys",
    "Online Games",
    "Fitness Apparel",
    "Yoga Gear",
    "Cycling Accessories",
    "Boarding Equipment",
    "Snow Sports Gear",
    "Water Sports Equipment",
    "Running Shoes",
    "Athletic Accessories",
    "Team Sports Gear",
    "Concert Tickets",
    "Theater Tickets",
    "Event Tickets",
    "Home Renovation Materials",
    "Interior Design Services",
    "Landscaping Tools",
    "Photography Equipment",
    "Film and Darkroom Supplies",
    "Graphic Design Tools",
    "Music Production Equipment",
    "DJ Gear",
    "Stage Lighting Equipment",
    "Fashion Accessories",
    "Vintage Clothing",
    "Thrifted Items",
    "Designer Clothing",
    "Luxury Accessories",
    "Streetwear",
    "Gourmet Food Items",
    "Ethnic Foods",
    "Specialty Beverages",
    "Kitchen Gadgets",
    "Gourmet Cookware",
    "Baking Supplies",
    "Novels",
    "Poetry Books",
    "Self-Help Books",
    "Travel Books",
    "Biographies",
    "Graphic Novels",
    "Educational Software",
    "Productivity Tools",
    "Video Editing Software",
    "Web Development Tools",
    "Data Analysis Software",
    "Gaming Software",
    "Security Software",
    "Mobile Applications",
    "Cloud Services",
    "Smart Home Automation",
    "Energy-Saving Devices",
    "Renewable Energy Solutions",
    "Green Cleaning Products",
    "Organic Skincare",
    "Natural Remedies",
    "Fitness Subscriptions",
    "Wellness Retreats",
    "Mental Health Services",
    "Educational Workshops",
    "Skill Development Courses",
    "Language Learning Platforms",
    "DIY Crafts Kits",
    "Quilting Supplies",
    "Pottery Tools",
    "Home Brewing Kits",
    "Wine and Spirits",
    "Cocktail Mixers",
    "Sustainable Fashion",
    "Eco-Friendly Accessories",
    "Fair Trade Products",
    "Artisan Crafts",
    "Handcrafted Jewelry",
    "Upcycled Items",
    "Smart Appliances",
    "Home Monitoring Systems",
    "Energy-Efficient Solutions"
  ];

  const fetchIndustrySuggestions = (value) => {
    // Filter industries based on the entered value (case-insensitive)
    const filteredSuggestions = industrySuggestions.filter((ind) =>
      ind.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const handleIndustryChange = (e) => {
    const value = e.target.value;
    setIndustry(value);
    onIndustryChange(value);
    fetchIndustrySuggestions(value);
    setShowSuggestions(true);
  };

  return (
    <div className="my-4">
      <label htmlFor="industryInput" className="block font-semibold mb-2">
        Industry/Product:
      </label>
      <input
        id="industryInput"
        type="text"
        value={industry}
        onChange={handleIndustryChange}
        className="border p-2 rounded-md w-full"
        placeholder="Enter industry/product..."
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            onIndustryKeyPress();
          }
        }}
        onBlur={() => setShowSuggestions(false)}
        list="industrySuggestions"
      />
      {showSuggestions && (
        <datalist id="industrySuggestions">
          {suggestions.map((suggest, index) => (
            <option key={index} value={suggest} />
          ))}
        </datalist>
      )}
    </div>
  );
};

export default IndustryInput;

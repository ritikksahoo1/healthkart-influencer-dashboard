# HealthKart Influencer Marketing Dashboard

A comprehensive open-source tool for tracking and visualizing ROI of influencer marketing campaigns across multiple brands and platforms.

## 🎯 Overview

This dashboard provides HealthKart with a complete solution for monitoring influencer campaign performance, calculating incremental ROAS, analyzing influencer insights, and tracking payouts across their brands (MuscleBlaze, HKVitals, Gritzo).

## ✨ Key Features

### 📊 Campaign Performance
- Real-time revenue tracking across platforms
- Platform performance comparison (Instagram, YouTube, Twitter, TikTok)
- Campaign ROI analysis and trending
- Brand-wise performance breakdown

### 💰 ROAS Analysis
- **Traditional ROAS**: Revenue / Ad Spend calculation
- **Incremental ROAS**: True incremental lift measurement
- Platform and brand ROAS comparison
- Cost efficiency metrics

### 👥 Influencer Insights
- Top performing influencers identification
- Engagement rate analysis (likes, comments, reach)
- ROI by influencer tier (follower count)
- Demographics and category breakdown

### 💳 Payout Tracking
- Automated payout calculations
- Payment basis tracking (per post vs per order)
- Outstanding payments monitoring
- Influencer payment history

### 📈 Data Export & Reporting
- CSV export capabilities
- Custom report generation
- Performance summary insights
- Executive dashboard views

## 🏗️ Technical Architecture

### Data Model

The dashboard uses four core datasets:

#### 1. Influencers (`influencers.csv`)
```
- influencer_id: Unique identifier
- name: Influencer name
- category: Content category (Fitness, Health, Nutrition, etc.)
- gender: Demographic information
- follower_count: Social media followers
- platform: Primary platform (Instagram, YouTube, Twitter, TikTok)
```

#### 2. Posts (`posts.csv`)
```
- post_id: Unique post identifier
- influencer_id: Reference to influencer
- platform: Publishing platform
- date: Publication date
- url: Post URL
- caption: Post content
- reach: Total reach/impressions
- likes: Engagement metric
- comments: Engagement metric
- brand: Associated brand (MuscleBlaze, HKVitals, Gritzo)
```

#### 3. Tracking Data (`tracking_data.csv`)
```
- tracking_id: Unique tracking record
- source: Traffic source platform
- campaign: Campaign name
- influencer_id: Attribution to influencer
- user_id: Customer identifier
- product: Product purchased
- date: Transaction date
- orders: Number of orders
- revenue: Generated revenue
```

#### 4. Payouts (`payouts.csv`)
```
- payout_id: Unique payout identifier
- influencer_id: Influencer reference
- basis: Payment structure (post/order)
- rate: Payment rate
- orders: Total orders attributed
- posts: Total posts created
- total_payout: Final payment amount
```

## 📊 Key Metrics & Calculations

### ROAS (Return on Ad Spend)
```
ROAS = Total Revenue / Total Ad Spend
```

### Incremental ROAS
```
Incremental ROAS = (Incremental Revenue - Baseline Revenue) / Ad Spend
```

### Engagement Rate
```
Engagement Rate = (Likes + Comments) / Reach × 100
```

### Conversion Rate
```
Conversion Rate = Orders / Reach × 100
```

### Cost Per Order
```
Cost Per Order = Total Payout / Total Orders
```

### Revenue Per Order
```
Revenue Per Order = Total Revenue / Total Orders
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection for loading chart libraries

### Installation & Setup

1. **Download the dashboard files**
   ```bash
   # Download the complete dashboard package
   wget https://github.com/healthkart/influencer-dashboard/archive/main.zip
   unzip main.zip
   cd influencer-dashboard-main
   ```

2. **Prepare your data**
   - Export your influencer data to match the CSV format
   - Place CSV files in the data directory
   - Update data paths in `app.js` if needed

3. **Launch the dashboard**
   ```bash
   # Option 1: Simple HTTP server
   python -m http.server 8000
   
   # Option 2: Using Node.js
   npx serve .
   
   # Option 3: Open index.html directly in browser
   open index.html
   ```

4. **Access the dashboard**
   - Navigate to `http://localhost:8000`
   - The dashboard will automatically load and display your data

## 📋 Usage Guide

### Dashboard Navigation

1. **Header KPIs**: Quick overview of total revenue, orders, payouts, and average ROAS
2. **Sidebar Filters**: Filter data by platform, brand, campaign, category, or date range
3. **Main Tabs**: 
   - **Campaign Performance**: Overall campaign metrics and trends
   - **ROAS Analysis**: Return on ad spend calculations and comparisons
   - **Influencer Insights**: Individual influencer performance analysis
   - **Payout Tracking**: Payment management and monitoring

### Filtering Data
- Use sidebar filters to drill down into specific segments
- All visualizations update dynamically based on selected filters
- Multiple filters can be applied simultaneously
- Clear filters button resets all selections

### Exporting Data
- Click "Export CSV" buttons to download filtered datasets
- Use "Generate Report" for executive summaries
- Charts can be exported as PNG images

## 🎨 Customization

### Brand Colors
Update the CSS variables in `style.css`:
```css
:root {
  --primary-color: #1FB8CD;    /* HealthKart brand color */
  --secondary-color: #FFC185;  /* Accent color */
  --success-color: #28a745;    /* Success indicators */
  --warning-color: #ffc107;    /* Warning indicators */
}
```

### Adding New Metrics
1. Update the data processing functions in `app.js`
2. Add new chart configurations
3. Update the UI components in `index.html`

### Platform Integration
- **API Integration**: Replace CSV loading with API calls
- **Real-time Updates**: Implement WebSocket connections
- **Database Connection**: Connect to your existing database

## 🔧 Technical Specifications

### Performance Optimizations
- Lazy loading of chart libraries
- Data caching for improved response times
- Responsive design for mobile and desktop
- Optimized chart rendering for large datasets

### Browser Compatibility
- Chrome 70+ ✅
- Firefox 65+ ✅
- Safari 12+ ✅
- Edge 79+ ✅

### Security Considerations
- Client-side only - no server required
- Data remains local unless explicitly exported
- HTTPS recommended for production deployment
- Input validation for all user inputs

## 📈 Business Impact

### Key Benefits
- **ROI Visibility**: Clear understanding of campaign profitability
- **Data-Driven Decisions**: Optimize budget allocation based on performance
- **Influencer Management**: Identify top performers and optimize partnerships
- **Cost Control**: Track and manage influencer payouts efficiently

### Success Metrics
- **Average ROAS**: Currently 11.89x across all campaigns
- **Top Platform**: TikTok showing highest engagement rates
- **Cost Efficiency**: ₹100 average cost per order
- **Revenue Growth**: Track month-over-month improvements

## 🤝 Contributing

We welcome contributions to improve the dashboard:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-metric`)
3. Commit changes (`git commit -am 'Add new metric calculation'`)
4. Push to branch (`git push origin feature/new-metric`)
5. Create a Pull Request

### Development Setup
```bash
git clone https://github.com/healthkart/influencer-dashboard.git
cd influencer-dashboard
npm install  # If adding build tools
```

## 📞 Support

### Documentation
- **User Guide**: Complete walkthrough of dashboard features
- **API Reference**: For developers integrating with the system
- **Video Tutorials**: Step-by-step usage instructions

### Issues & Support
- **GitHub Issues**: Report bugs and request features
- **Email Support**: dashboard-support@healthkart.com
- **Community Forum**: Join discussions with other users

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Chart.js**: For beautiful, responsive charts
- **Modern CSS**: For clean, professional styling
- **Open Source Community**: For inspiration and best practices

---

**Built with ❤️ for the HealthKart Marketing Team**

*Last Updated: July 2025*
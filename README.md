# HealthKart Influencer Marketing ROI Dashboard

A comprehensive web-based dashboard for tracking and analyzing influencer marketing campaigns across multiple platforms and brands.

## 🚀 Features

### ✅ Complete Requirements Implementation

**1. Data Modeling**
- ✅ Influencers: ID, name, category, gender, follower count, platform
- ✅ Posts: influencer_id, platform, date, URL, caption, reach, likes, comments
- ✅ Tracking Data: source, campaign, influencer_id, user_id, product, date, orders, revenue
- ✅ Payouts: influencer_id, basis (post/order), rate, orders, total_payout

**2. Core Features**
- ✅ Upload/ingest influencer campaign data
- ✅ Track performance of posts and influencers
- ✅ ROI and incremental ROAS calculation
- ✅ Filtering by brand, product, influencer type, platform
- ✅ Insights: top influencers, best personas, poor ROIs
- ✅ Export to CSV functionality

**3. Advanced Analytics**
- ✅ **ROAS Heatmap**: Platform x Category performance matrix
- ✅ **Incremental ROAS**: Advanced measurement beyond baseline performance
- ✅ **Follower-Revenue Scatter**: Correlation analysis with trend lines
- ✅ **Tier Analysis**: Micro/Mid/Macro influencer comparison
- ✅ **Payout Tracking**: Automated calculations and payment history

## 📊 Dashboard Sections

### 1. Overview
- Key performance indicators (Revenue: ₹1.4M, Orders: 1,046, ROAS: 9.41x)
- Platform performance comparison
- Top 5 influencers ranking

### 2. ROAS Analysis
- **Traditional ROAS**: Revenue ÷ Ad Spend
- **Incremental ROAS**: (Revenue - Baseline Revenue) ÷ Ad Spend
- Interactive heatmap showing platform-category performance
- Cost efficiency metrics

### 3. Influencer Insights
- Follower count vs revenue scatter plot analysis
- Tier-based performance (Micro: <100K, Mid: 100K-300K, Macro: >300K)
- Demographic segmentation by gender and category
- Top and poor performer identification

### 4. Payout Tracking
- Payment basis tracking (per post vs per order)
- Real-time payout calculations
- Outstanding balance monitoring
- Cost per order analysis

## 🛠 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Visualization**: Chart.js for interactive charts
- **Architecture**: Single-page application (SPA)
- **Responsive**: Mobile-first design approach

## 💻 Setup Instructions

### Prerequisites
- Modern web browser (Chrome 70+, Firefox 65+, Safari 12+, Edge 79+)
- No server required - runs entirely client-side

### Installation
1. Download all project files
2. Open `index.html` in your web browser
3. Dashboard loads automatically with simulated data

### Local Development
```bash
# Option 1: Python HTTP Server
python -m http.server 8000

# Option 2: Node.js HTTP Server
npx http-server

# Then open: http://localhost:8000
```

## 📈 Key Metrics & Insights

### Performance Summary
- **Total Revenue**: ₹1,405,046
- **Total Orders**: 1,046
- **Average ROAS**: 9.41x (Traditional) | 6.59x (Incremental)
- **Top Platform**: TikTok (11.63x ROAS)
- **Best Tier**: Mid-tier influencers (11.16x ROAS)

### Platform Performance
1. **TikTok**: 11.63x ROAS, ₹382K revenue
2. **Twitter**: 9.46x ROAS, ₹259K revenue  
3. **Instagram**: 8.97x ROAS, ₹475K revenue
4. **YouTube**: 7.05x ROAS, ₹289K revenue

### Influencer Tiers
- **Micro** (1K-100K): 6.00x ROAS, 14.91% engagement
- **Mid** (100K-300K): 11.16x ROAS, 14.40% engagement
- **Macro** (300K+): 7.93x ROAS, 11.27% engagement

## 🔧 Usage Guide

### Navigation
- **Tab Navigation**: Switch between Overview, ROAS Analysis, Influencer Insights, Payout Tracking
- **Filters**: Use sidebar to filter by platform, category, tier
- **Search**: Find specific influencers using search bar
- **Export**: Download filtered data as CSV

### Interactive Features
- **Charts**: Hover for tooltips, click for drill-down
- **Tables**: Sort by clicking column headers
- **Filters**: Real-time data updates
- **Theme**: Toggle light/dark mode

### Data Export
- Click "Export CSV" button in header
- Exports currently filtered/viewed data
- Includes all relevant metrics and calculations

## 🎯 Business Value

### Strategic Insights
1. **Platform Optimization**: TikTok delivers highest ROAS for health content
2. **Influencer Selection**: Mid-tier creators offer best ROI balance
3. **Cost Efficiency**: Average ₹100 cost per order achieved
4. **Revenue Attribution**: Clear tracking from content to conversion

### Decision Support
- **Budget Allocation**: Data-driven platform and tier investment
- **Creator Selection**: Performance-based influencer partnerships
- **Campaign Optimization**: Real-time ROAS monitoring
- **Financial Management**: Automated payout calculations

## 📋 Data Assumptions

### Simulated Data Structure
- **50 Influencers** across 6 categories (Fitness, Health, Lifestyle, Nutrition, Sports, Wellness)
- **200 Posts** with engagement metrics (reach, likes, comments)
- **500 Tracking Records** linking content to conversions
- **Payment Models**: Mix of per-post and per-order compensation

### Calculation Methods
- **Traditional ROAS**: Total attributed revenue ÷ Total ad spend
- **Incremental ROAS**: (Revenue - 30% baseline) ÷ Ad spend
- **Engagement Rate**: (Likes + Comments) ÷ Reach × 100
- **Tiers**: Based on follower count thresholds

## 🐛 Troubleshooting

### Common Issues
- **Blank Dashboard**: Ensure JavaScript is enabled
- **Charts Not Loading**: Check internet connection (Chart.js CDN)
- **Export Not Working**: Modern browser required for download functionality
- **Mobile Display**: Rotate device or use desktop for full experience

### Browser Compatibility
- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+
- ❌ Internet Explorer (not supported)

## 📞 Support

For technical issues or feature requests:
1. Check browser console for errors
2. Ensure all files are in same directory
3. Verify internet connection for Chart.js
4. Use developer tools for debugging

## 🚀 Future Enhancements

### Phase 2 Features
- **Real-time Data**: API integration for live updates
- **Advanced Filtering**: Date ranges, custom segments
- **Predictive Analytics**: ML-powered performance forecasting
- **Multi-Brand**: Expanded brand portfolio support

### Integration Opportunities
- **CRM Systems**: Direct influencer database sync
- **Payment Gateways**: Automated payout processing
- **Analytics Platforms**: Enhanced attribution modeling
- **Reporting Tools**: Automated executive reporting

## 📄 License

This project is developed for HealthKart's internal use and evaluation purposes.
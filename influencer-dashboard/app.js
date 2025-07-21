// Global variables to store data
let influencersData = [];
let postsData = [];
let trackingData = [];
let payoutsData = [];
let filteredData = {};
let charts = {};

// Chart color palette
const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async function() {
    showLoadingOverlay();
    await loadAllData();
    initializeEventListeners();
    initializeCharts();
    populateTables();
    updateKPIs();
    hideLoadingOverlay();
});

// CSV data URLs
const dataUrls = {
    influencers: 'https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/fba05c3f16ff233b2aca8f5a1852331f/7cdd77bb-41ea-4ad9-a808-600c44362085/1c278305.csv',
    posts: 'https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/fba05c3f16ff233b2aca8f5a1852331f/7cdd77bb-41ea-4ad9-a808-600c44362085/45224b74.csv',
    tracking: 'https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/fba05c3f16ff233b2aca8f5a1852331f/7cdd77bb-41ea-4ad9-a808-600c44362085/9a460dff.csv',
    payouts: 'https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/fba05c3f16ff233b2aca8f5a1852331f/7cdd77bb-41ea-4ad9-a808-600c44362085/df3b87b4.csv'
};

// Utility functions
function showLoadingOverlay() {
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function hideLoadingOverlay() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

function formatCurrency(value) {
    if (value >= 10000000) {
        return `₹${(value / 10000000).toFixed(2)}Cr`;
    } else if (value >= 100000) {
        return `₹${(value / 100000).toFixed(2)}L`;
    } else if (value >= 1000) {
        return `₹${(value / 1000).toFixed(1)}K`;
    }
    return `₹${value.toFixed(2)}`;
}

function formatNumber(value) {
    if (value >= 10000000) {
        return `${(value / 10000000).toFixed(2)}Cr`;
    } else if (value >= 100000) {
        return `${(value / 100000).toFixed(2)}L`;
    } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
}

// CSV Parser
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
            let value = values[index]?.trim() || '';
            // Try to parse as number
            if (!isNaN(value) && value !== '') {
                value = parseFloat(value);
            }
            row[header] = value;
        });
        data.push(row);
    }
    return data;
}

// Data loading
async function loadAllData() {
    try {
        const responses = await Promise.all([
            fetch(dataUrls.influencers),
            fetch(dataUrls.posts),
            fetch(dataUrls.tracking),
            fetch(dataUrls.payouts)
        ]);

        const texts = await Promise.all(responses.map(r => r.text()));
        
        influencersData = parseCSV(texts[0]);
        postsData = parseCSV(texts[1]);
        trackingData = parseCSV(texts[2]);
        payoutsData = parseCSV(texts[3]);

        // Initialize filtered data
        applyFilters();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading dashboard data. Please refresh the page.');
    }
}

// Event listeners
function initializeEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Filter events
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);

    // Export events
    document.getElementById('exportCsv').addEventListener('click', exportToCsv);
    document.getElementById('exportReport').addEventListener('click', generateReport);
}

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    // Refresh charts after tab switch
    setTimeout(() => {
        Object.values(charts).forEach(chart => chart.resize?.());
    }, 100);
}

// Filter functions
function applyFilters() {
    const platform = document.getElementById('platformFilter').value;
    const brand = document.getElementById('brandFilter').value;
    const campaign = document.getElementById('campaignFilter').value;
    const category = document.getElementById('categoryFilter').value;

    // Apply filters to data
    filteredData.influencers = influencersData.filter(inf => {
        return (!platform || inf.platform === platform) &&
               (!category || inf.category === category);
    });

    filteredData.posts = postsData.filter(post => {
        const influencer = influencersData.find(inf => inf.influencer_id === post.influencer_id);
        return (!platform || post.platform === platform) &&
               (!brand || post.brand === brand) &&
               (!category || (influencer && influencer.category === category));
    });

    filteredData.tracking = trackingData.filter(track => {
        const influencer = influencersData.find(inf => inf.influencer_id === track.influencer_id);
        return (!platform || (influencer && influencer.platform === platform)) &&
               (!campaign || track.campaign === campaign) &&
               (!category || (influencer && influencer.category === category));
    });

    filteredData.payouts = payoutsData.filter(payout => {
        const influencer = influencersData.find(inf => inf.influencer_id === payout.influencer_id);
        return (!platform || (influencer && influencer.platform === platform)) &&
               (!category || (influencer && influencer.category === category));
    });

    // Update dashboard
    updateCharts();
    populateTables();
    updateKPIs();
}

function resetFilters() {
    document.getElementById('platformFilter').value = '';
    document.getElementById('brandFilter').value = '';
    document.getElementById('campaignFilter').value = '';
    document.getElementById('categoryFilter').value = '';
    applyFilters();
}

// KPI Updates
function updateKPIs() {
    const totalRevenue = filteredData.tracking.reduce((sum, item) => sum + (item.revenue || 0), 0);
    const totalOrders = filteredData.tracking.reduce((sum, item) => sum + (item.orders || 0), 0);
    const totalPayouts = filteredData.payouts.reduce((sum, item) => sum + (item.total_payout || 0), 0);
    const avgRoas = totalPayouts > 0 ? totalRevenue / totalPayouts : 0;

    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('totalOrders').textContent = formatNumber(totalOrders);
    document.getElementById('totalPayouts').textContent = formatCurrency(totalPayouts);
    document.getElementById('avgRoas').textContent = avgRoas.toFixed(2);
}

// Chart initialization
function initializeCharts() {
    createRevenueChart();
    createPlatformChart();
    createRoasChart();
    createCostRevenueChart();
    createTopInfluencersChart();
    createFollowersChart();
    createPayoutChart();
    createPaymentBasisChart();
}

function updateCharts() {
    Object.values(charts).forEach(chart => {
        if (chart.update) {
            chart.update();
        }
    });
}

function createRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    // Group revenue by month
    const monthlyRevenue = {};
    filteredData.tracking.forEach(item => {
        const date = new Date(item.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + (item.revenue || 0);
    });

    const labels = Object.keys(monthlyRevenue).sort();
    const data = labels.map(label => monthlyRevenue[label]);

    charts.revenue = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(l => new Date(l + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })),
            datasets: [{
                label: 'Revenue',
                data: data,
                borderColor: chartColors[0],
                backgroundColor: chartColors[0] + '20',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function createPlatformChart() {
    const ctx = document.getElementById('platformChart').getContext('2d');
    
    const platformRevenue = {};
    filteredData.tracking.forEach(item => {
        const influencer = influencersData.find(inf => inf.influencer_id === item.influencer_id);
        if (influencer) {
            const platform = influencer.platform;
            platformRevenue[platform] = (platformRevenue[platform] || 0) + (item.revenue || 0);
        }
    });

    charts.platform = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(platformRevenue),
            datasets: [{
                label: 'Revenue by Platform',
                data: Object.values(platformRevenue),
                backgroundColor: chartColors.slice(0, Object.keys(platformRevenue).length)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function createRoasChart() {
    const ctx = document.getElementById('roasChart').getContext('2d');
    
    const platformRoas = {};
    
    // Calculate ROAS by platform
    filteredData.tracking.forEach(item => {
        const influencer = influencersData.find(inf => inf.influencer_id === item.influencer_id);
        const payout = filteredData.payouts.find(p => p.influencer_id === item.influencer_id);
        
        if (influencer && payout) {
            const platform = influencer.platform;
            if (!platformRoas[platform]) {
                platformRoas[platform] = { revenue: 0, spend: 0 };
            }
            platformRoas[platform].revenue += (item.revenue || 0);
            platformRoas[platform].spend += (payout.total_payout || 0);
        }
    });

    const labels = Object.keys(platformRoas);
    const roasValues = labels.map(platform => {
        const data = platformRoas[platform];
        return data.spend > 0 ? data.revenue / data.spend : 0;
    });

    charts.roas = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'ROAS by Platform',
                data: roasValues,
                backgroundColor: chartColors.slice(0, labels.length)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(2) + 'x';
                        }
                    }
                }
            }
        }
    });
}

function createCostRevenueChart() {
    const ctx = document.getElementById('costRevenueChart').getContext('2d');
    
    const scatterData = [];
    filteredData.payouts.forEach(payout => {
        const revenue = filteredData.tracking
            .filter(t => t.influencer_id === payout.influencer_id)
            .reduce((sum, t) => sum + (t.revenue || 0), 0);
        
        scatterData.push({
            x: payout.total_payout || 0,
            y: revenue
        });
    });

    charts.costRevenue = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Cost vs Revenue',
                data: scatterData,
                backgroundColor: chartColors[2] + '80',
                borderColor: chartColors[2],
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Cost (Payouts)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Revenue'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function createTopInfluencersChart() {
    const ctx = document.getElementById('topInfluencersChart').getContext('2d');
    
    const influencerRevenue = {};
    filteredData.tracking.forEach(item => {
        const influencer = influencersData.find(inf => inf.influencer_id === item.influencer_id);
        if (influencer) {
            const name = influencer.name;
            influencerRevenue[name] = (influencerRevenue[name] || 0) + (item.revenue || 0);
        }
    });

    // Get top 10 influencers
    const sortedInfluencers = Object.entries(influencerRevenue)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);

    charts.topInfluencers = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedInfluencers.map(([name]) => name.length > 15 ? name.substring(0, 15) + '...' : name),
            datasets: [{
                label: 'Revenue by Influencer',
                data: sortedInfluencers.map(([,revenue]) => revenue),
                backgroundColor: chartColors[4]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function createFollowersChart() {
    const ctx = document.getElementById('followersChart').getContext('2d');
    
    const followerRanges = {
        '0-10K': 0,
        '10K-100K': 0,
        '100K-1M': 0,
        '1M+': 0
    };

    filteredData.influencers.forEach(inf => {
        const followers = inf.follower_count || 0;
        if (followers < 10000) {
            followerRanges['0-10K']++;
        } else if (followers < 100000) {
            followerRanges['10K-100K']++;
        } else if (followers < 1000000) {
            followerRanges['100K-1M']++;
        } else {
            followerRanges['1M+']++;
        }
    });

    charts.followers = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(followerRanges),
            datasets: [{
                data: Object.values(followerRanges),
                backgroundColor: chartColors.slice(0, 4)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function createPayoutChart() {
    const ctx = document.getElementById('payoutChart').getContext('2d');
    
    const monthlyPayouts = {};
    filteredData.payouts.forEach(payout => {
        // Simulate dates - use current month for demo
        const monthKey = '2024-07';
        monthlyPayouts[monthKey] = (monthlyPayouts[monthKey] || 0) + (payout.total_payout || 0);
    });

    charts.payouts = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['July 2024'],
            datasets: [{
                label: 'Total Payouts',
                data: Object.values(monthlyPayouts),
                backgroundColor: chartColors[5]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function createPaymentBasisChart() {
    const ctx = document.getElementById('paymentBasisChart').getContext('2d');
    
    const basisCounts = {};
    filteredData.payouts.forEach(payout => {
        const basis = payout.basis || 'Unknown';
        basisCounts[basis] = (basisCounts[basis] || 0) + 1;
    });

    charts.paymentBasis = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(basisCounts),
            datasets: [{
                data: Object.values(basisCounts),
                backgroundColor: chartColors.slice(0, Object.keys(basisCounts).length)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Table population
function populateTables() {
    populateCampaignTable();
    populateInfluencerTable();
    populatePayoutTable();
}

function populateCampaignTable() {
    const tbody = document.querySelector('#campaignTable tbody');
    tbody.innerHTML = '';

    const campaigns = {};
    filteredData.tracking.forEach(item => {
        const campaign = item.campaign;
        if (!campaigns[campaign]) {
            campaigns[campaign] = {
                revenue: 0,
                orders: 0,
                spend: 0,
                engagement: 0,
                posts: 0
            };
        }
        campaigns[campaign].revenue += (item.revenue || 0);
        campaigns[campaign].orders += (item.orders || 0);
        
        // Calculate spend from payouts
        const payout = filteredData.payouts.find(p => p.influencer_id === item.influencer_id);
        if (payout) {
            campaigns[campaign].spend += (payout.total_payout || 0);
        }
    });

    // Add engagement data from posts
    filteredData.posts.forEach(post => {
        const trackingItem = filteredData.tracking.find(t => t.influencer_id === post.influencer_id);
        if (trackingItem && campaigns[trackingItem.campaign]) {
            campaigns[trackingItem.campaign].engagement += ((post.likes || 0) + (post.comments || 0));
            campaigns[trackingItem.campaign].posts++;
        }
    });

    Object.entries(campaigns).forEach(([campaign, data]) => {
        const roas = data.spend > 0 ? (data.revenue / data.spend).toFixed(2) : '0.00';
        const avgEngagement = data.posts > 0 ? (data.engagement / data.posts).toFixed(0) : '0';
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${campaign}</td>
            <td>${formatCurrency(data.revenue)}</td>
            <td>${formatNumber(data.orders)}</td>
            <td>${roas}</td>
            <td>${formatNumber(avgEngagement)}</td>
        `;
    });
}

function populateInfluencerTable() {
    const tbody = document.querySelector('#influencerTable tbody');
    tbody.innerHTML = '';

    const influencerStats = filteredData.influencers.map(influencer => {
        const revenue = filteredData.tracking
            .filter(t => t.influencer_id === influencer.influencer_id)
            .reduce((sum, t) => sum + (t.revenue || 0), 0);
        
        const payout = filteredData.payouts.find(p => p.influencer_id === influencer.influencer_id);
        const spend = payout ? (payout.total_payout || 0) : 0;
        const roas = spend > 0 ? revenue / spend : 0;
        
        return {
            ...influencer,
            revenue,
            roas,
            spend
        };
    });

    // Sort by revenue
    influencerStats.sort((a, b) => b.revenue - a.revenue);

    influencerStats.slice(0, 20).forEach(influencer => {
        const status = influencer.roas > 10 ? 'high' : influencer.roas > 5 ? 'medium' : 'low';
        const statusText = influencer.roas > 10 ? 'High' : influencer.roas > 5 ? 'Medium' : 'Low';
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${influencer.name}</td>
            <td>${influencer.platform}</td>
            <td>${formatNumber(influencer.follower_count || 0)}</td>
            <td>${formatCurrency(influencer.revenue)}</td>
            <td>${influencer.roas.toFixed(2)}</td>
            <td><span class="status-indicator ${status}">${statusText}</span></td>
        `;
    });
}

function populatePayoutTable() {
    const tbody = document.querySelector('#payoutTable tbody');
    tbody.innerHTML = '';

    filteredData.payouts.forEach(payout => {
        const influencer = influencersData.find(inf => inf.influencer_id === payout.influencer_id);
        const influencerName = influencer ? influencer.name : 'Unknown';
        
        const status = Math.random() > 0.3 ? 'paid' : 'pending';
        const statusText = status === 'paid' ? 'Paid' : 'Pending';
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${influencerName}</td>
            <td>${payout.basis || 'N/A'}</td>
            <td>${formatCurrency(payout.rate || 0)}</td>
            <td>${payout.orders || payout.posts || 0}</td>
            <td>${formatCurrency(payout.total_payout || 0)}</td>
            <td><span class="status-indicator ${status}">${statusText}</span></td>
        `;
    });
}

// Export functions
function exportToCsv() {
    const csvContent = generateCsvContent();
    downloadCsv(csvContent, 'influencer_dashboard_export.csv');
}

function generateCsvContent() {
    let csv = 'Influencer,Platform,Followers,Revenue,Orders,ROAS,Payout\n';
    
    filteredData.influencers.forEach(influencer => {
        const revenue = filteredData.tracking
            .filter(t => t.influencer_id === influencer.influencer_id)
            .reduce((sum, t) => sum + (t.revenue || 0), 0);
        
        const orders = filteredData.tracking
            .filter(t => t.influencer_id === influencer.influencer_id)
            .reduce((sum, t) => sum + (t.orders || 0), 0);
            
        const payout = filteredData.payouts.find(p => p.influencer_id === influencer.influencer_id);
        const spend = payout ? (payout.total_payout || 0) : 0;
        const roas = spend > 0 ? (revenue / spend).toFixed(2) : '0.00';
        
        csv += `"${influencer.name}","${influencer.platform}",${influencer.follower_count || 0},${revenue},${orders},${roas},${spend}\n`;
    });
    
    return csv;
}

function downloadCsv(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function generateReport() {
    const totalRevenue = filteredData.tracking.reduce((sum, item) => sum + (item.revenue || 0), 0);
    const totalOrders = filteredData.tracking.reduce((sum, item) => sum + (item.orders || 0), 0);
    const totalPayouts = filteredData.payouts.reduce((sum, item) => sum + (item.total_payout || 0), 0);
    const avgRoas = totalPayouts > 0 ? totalRevenue / totalPayouts : 0;

    const report = `
HealthKart Influencer Marketing Dashboard Report
Generated on: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
================
Total Revenue: ${formatCurrency(totalRevenue)}
Total Orders: ${formatNumber(totalOrders)}
Total Payouts: ${formatCurrency(totalPayouts)}
Average ROAS: ${avgRoas.toFixed(2)}x

KEY INSIGHTS
============
- ${filteredData.influencers.length} active influencers
- ${filteredData.posts.length} posts analyzed
- ${filteredData.tracking.length} conversion events tracked

TOP PERFORMING PLATFORMS
========================
${Object.entries(getPlatformPerformance())
  .sort(([,a], [,b]) => b.revenue - a.revenue)
  .map(([platform, data]) => `${platform}: ${formatCurrency(data.revenue)} revenue, ${data.roas.toFixed(2)}x ROAS`)
  .join('\n')}
`;

    downloadTextFile(report, 'healthkart_influencer_report.txt');
}

function getPlatformPerformance() {
    const platforms = {};
    
    filteredData.tracking.forEach(item => {
        const influencer = influencersData.find(inf => inf.influencer_id === item.influencer_id);
        const payout = filteredData.payouts.find(p => p.influencer_id === item.influencer_id);
        
        if (influencer) {
            const platform = influencer.platform;
            if (!platforms[platform]) {
                platforms[platform] = { revenue: 0, spend: 0, roas: 0 };
            }
            platforms[platform].revenue += (item.revenue || 0);
            if (payout) {
                platforms[platform].spend += (payout.total_payout || 0);
            }
        }
    });

    // Calculate ROAS for each platform
    Object.keys(platforms).forEach(platform => {
        const data = platforms[platform];
        data.roas = data.spend > 0 ? data.revenue / data.spend : 0;
    });

    return platforms;
}

function downloadTextFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
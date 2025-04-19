import React, { useEffect, useState } from 'react';
import ModernGlassCard from '../../components/ModernGlassCard';
import { FaChartLine, FaDollarSign, FaUserPlus, FaCrown } from 'react-icons/fa';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Spinner from '../../components/Spinner';
import api from '../../utils/api';

const AdminAnalytics = () => {
  const [ordersPerDay, setOrdersPerDay] = useState([]);
  const [signupsPerDay, setSignupsPerDay] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [ordersRes, signupsRes, productsRes] = await Promise.all([
        api.get('/analytics/orders-per-day'),
        api.get('/analytics/user-signups-per-day'),
        api.get('/analytics/top-products'),
      ]);
      setOrdersPerDay(ordersRes.data.data);
      setSignupsPerDay(signupsRes.data.data);
      setTopProducts(productsRes.data.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white px-4 py-10 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-300 drop-shadow mb-2">Analytics Dashboard</h1>
          <p className="text-blue-100/80 text-lg">Key metrics and insights for your store</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          <ModernGlassCard header="Orders Per Day" icon={<FaChartLine />} accentColor="#3b82f6">
            <Line data={{
              labels: ordersPerDay.map(d => d._id),
              datasets: [
                {
                  label: 'Orders',
                  data: ordersPerDay.map(d => d.count),
                  borderColor: '#3b82f6',
                  backgroundColor: 'rgba(59,130,246,0.15)',
                  tension: 0.4,
                  pointBackgroundColor: '#fff',
                  pointBorderColor: '#3b82f6',
                  pointRadius: 4,
                  pointHoverRadius: 6,
                }
              ]
            }} options={{
              plugins: { legend: { labels: { color: '#fff' } } },
              scales: {
                x: {
                  ticks: { color: '#fff' },
                  grid: { color: 'rgba(255,255,255,0.08)' }
                },
                y: {
                  ticks: { color: '#fff' },
                  grid: { color: 'rgba(255,255,255,0.10)' }
                }
              },
              elements: {
                line: { borderWidth: 3 },
                point: { borderWidth: 2 }
              }
            }} />
          </ModernGlassCard>
          <ModernGlassCard header="Revenue Per Day" icon={<FaDollarSign />} accentColor="#10b981">
            <Bar data={{
              labels: ordersPerDay.map(d => d._id),
              datasets: [
                {
                  label: 'Revenue',
                  data: ordersPerDay.map(d => d.revenue),
                  backgroundColor: '#10b981',
                  borderRadius: 6,
                  borderSkipped: false,
                }
              ]
            }} options={{
              plugins: { legend: { labels: { color: '#fff' } } },
              scales: {
                x: {
                  ticks: { color: '#fff' },
                  grid: { color: 'rgba(255,255,255,0.08)' }
                },
                y: {
                  ticks: { color: '#fff' },
                  grid: { color: 'rgba(255,255,255,0.10)' }
                }
              }
            }} />
          </ModernGlassCard>
          <ModernGlassCard header="User Signups Per Day" icon={<FaUserPlus />} accentColor="#f59e42">
            <Line data={{
              labels: signupsPerDay.map(d => d._id),
              datasets: [
                {
                  label: 'Signups',
                  data: signupsPerDay.map(d => d.count),
                  borderColor: '#f59e42',
                  backgroundColor: 'rgba(245,158,66,0.18)',
                  tension: 0.4,
                  pointBackgroundColor: '#fff',
                  pointBorderColor: '#f59e42',
                  pointRadius: 4,
                  pointHoverRadius: 6,
                }
              ]
            }} options={{
              plugins: { legend: { labels: { color: '#fff' } } },
              scales: {
                x: {
                  ticks: { color: '#fff' },
                  grid: { color: 'rgba(255,255,255,0.08)' }
                },
                y: {
                  ticks: { color: '#fff' },
                  grid: { color: 'rgba(255,255,255,0.10)' }
                }
              },
              elements: {
                line: { borderWidth: 3 },
                point: { borderWidth: 2 }
              }
            }} />
          </ModernGlassCard>
          <ModernGlassCard header="Top Products By Sales" icon={<FaCrown />} accentColor="#ec4899" style={{ gridColumn: 'span 2 / span 2' }}>
            <Bar data={{
              labels: topProducts.map(p => p.product.name),
              datasets: [
                {
                  label: 'Units Sold',
                  data: topProducts.map(p => p.totalSold),
                  backgroundColor: '#ec4899',
                  borderRadius: 6,
                  borderSkipped: false,
                }
              ]
            }} options={{
              plugins: { legend: { labels: { color: '#fff' } } },
              scales: {
                x: {
                  ticks: { color: '#fff' },
                  grid: { color: 'rgba(255,255,255,0.08)' }
                },
                y: {
                  ticks: { color: '#fff' },
                  grid: { color: 'rgba(255,255,255,0.10)' }
                }
              }
            }} />
          </ModernGlassCard>
          <ModernGlassCard header="Top Products By Revenue" icon={<FaDollarSign />} accentColor="#a78bfa">
            <Bar data={{
              labels: topProducts.map(p => p.product.name),
              datasets: [
                {
                  label: 'Revenue',
                  data: topProducts.map(p => p.totalRevenue),
                  backgroundColor: '#a78bfa',
                  borderRadius: 6,
                  borderSkipped: false,
                }
              ]
            }} options={{
              plugins: { legend: { labels: { color: '#fff' } } },
              scales: {
                x: {
                  ticks: { color: '#fff' },
                  grid: { color: 'rgba(255,255,255,0.08)' }
                },
                y: {
                  ticks: { color: '#fff' },
                  grid: { color: 'rgba(255,255,255,0.10)' }
                }
              }
            }} />
          </ModernGlassCard>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

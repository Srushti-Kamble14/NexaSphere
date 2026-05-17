// src/pages/dashboard/DashboardPage.jsx
import { useDashboardData } from '../../hooks/useDashboardData';
import Footer from '../../shared/Footer';
import { BannerOrbs } from '../../shared/MotionLayer';

export default function DashboardPage({ onBack }) {
  const { data, loading, error, refetch } = useDashboardData();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid #CC1111', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#9CA3AF' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const activities = data?.activities || [];
  const achievements = data?.achievements || [];
  const weeklyData = data?.weeklyActivity || [];
  const profileCompletion = data?.profileCompletion || 0;
  const maxCount = Math.max(...weeklyData.map(d => d.count), 1);

  return (
    <div id="dashboard-page" style={{ minHeight: '100vh', paddingBottom: '100px', background: '#0A0A0A' }}>
      {/* Banner */}
      <div className="page-banner" style={{
        background: 'linear-gradient(135deg, rgba(204,17,17,0.04), rgba(0,0,0,0))',
        borderBottom: '1px solid #1F1F1F',
        padding: '60px 0 50px',
        textAlign: 'center',
        marginBottom: '60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="page-banner-line" style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg, #CC1111, #3B82F6, #8B5CF6)' }}/>
        <BannerOrbs color="rgba(204,17,17,0.04)"/>
        
        <button onClick={onBack} style={{
          position: 'absolute', top: '20px', left: '28px',
          background: '#1A1A1A', border: '1px solid #2A2A2A',
          borderRadius: '100px', padding: '6px 16px',
          color: '#9CA3AF', fontSize: '.75rem', cursor: 'pointer',
          fontFamily: "'Rajdhani', sans-serif", fontWeight: 500,
        }}>← Back</button>

        <span style={{ color: '#CC1111', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '16px' }}>NexaSphere · GL Bajaj</span>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '16px' }}>User Dashboard</h1>
        <p style={{ color: '#9CA3AF', maxWidth: '520px', margin: '0 auto' }}>Track your engagement, achievements, and activity across NexaSphere</p>
      </div>

      <div className="container">
        {error && (
          <div style={{ background: 'rgba(204,17,17,0.1)', border: '1px solid #CC1111', borderRadius: '8px', padding: '12px 20px', marginBottom: '32px', textAlign: 'center' }}>
            <p style={{ color: '#CC1111', fontSize: '13px' }}>{error}</p>
            <button onClick={refetch} style={{ background: 'transparent', border: 'none', color: '#CC1111', marginTop: '8px', cursor: 'pointer' }}>Retry</button>
          </div>
        )}

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }}>
          <StatCard title="Total Points" value={metrics.totalPoints?.toLocaleString()} />
          <StatCard title="Events Attended" value={metrics.eventsAttended} />
          <StatCard title="Current Streak" value={`${metrics.currentStreak} days`} subtitle={`Best: ${metrics.longestStreak} days`} />
          <StatCard title="Contributions" value={metrics.contributions} />
        </div>

        {/* Weekly Activity Chart */}
        <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '16px', padding: '32px', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '24px' }}>Weekly Activity</h2>
          {weeklyData.every(d => d.count === 0) ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ color: '#6B7280', marginBottom: '8px' }}>No activity data available yet.</p>
              <p style={{ color: '#4B5563', fontSize: '13px' }}>Participate in events to see your engagement here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px' }}>
              {weeklyData.map((item) => (
                <div key={item.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '100%', background: '#CC1111', borderRadius: '4px 4px 0 0', height: `${(item.count / maxCount) * 180}px`, minHeight: '4px' }} />
                  <span style={{ color: '#9CA3AF', fontSize: '12px' }}>{item.day}</span>
                  <span style={{ color: '#6B7280', fontSize: '11px' }}>{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
          <ActivityTimeline activities={activities} />
          <AchievementsList achievements={achievements} />
        </div>

        {/* Profile Completion */}
        <ProfileCompletionCard percentage={profileCompletion} />

        {/* Export Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => alert('Export feature coming soon')} style={{ background: '#CC1111', border: 'none', color: '#FFFFFF', padding: '10px 24px', borderRadius: '100px', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>
            Export Report
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Sub-components for cleaner code
function StatCard({ title, value, subtitle }) {
  return (
    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '12px', padding: '24px' }}>
      <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '8px' }}>{title}</p>
      <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#FFFFFF' }}>{value}</p>
      {subtitle && <p style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px' }}>{subtitle}</p>}
    </div>
  );
}

function ActivityTimeline({ activities }) {
  return (
    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #2A2A2A' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF' }}>Activity Timeline</h3>
        <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '4px' }}>Your recent actions</p>
      </div>
      <div style={{ padding: activities.length === 0 ? '48px 24px' : '0' }}>
        {activities.length === 0 ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#6B7280', marginBottom: '8px' }}>No recent activity</p>
            <p style={{ color: '#4B5563', fontSize: '12px' }}>Your actions will appear here</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} style={{ padding: '16px 24px', borderBottom: '1px solid #2A2A2A' }}>
              <p style={{ fontWeight: 500, color: '#FFFFFF', marginBottom: '4px' }}>{activity.title}</p>
              <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '4px' }}>{activity.description}</p>
              <p style={{ color: '#6B7280', fontSize: '11px' }}>{activity.date}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AchievementsList({ achievements }) {
  return (
    <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #2A2A2A' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF' }}>Achievements</h3>
        <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '4px' }}>Badges earned</p>
      </div>
      <div style={{ padding: achievements.length === 0 ? '48px 24px' : '24px' }}>
        {achievements.length === 0 ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#6B7280', marginBottom: '8px' }}>No achievements yet</p>
            <p style={{ color: '#4B5563', fontSize: '12px' }}>Participate in events to earn badges</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {achievements.map((ach) => (
              <div key={ach.id} style={{ textAlign: 'center', padding: '16px', background: '#222222', borderRadius: '12px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{ach.icon}</div>
                <p style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '14px' }}>{ach.title}</p>
                <p style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px' }}>{ach.description}</p>
                <p style={{ color: '#CC1111', fontSize: '11px', marginTop: '8px' }}>{ach.points} pts</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileCompletionCard({ percentage }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(204,17,17,0.05), transparent)', border: '1px solid #2A2A2A', borderRadius: '16px', padding: '28px 32px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF' }}>Profile Completion</h3>
          <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '4px' }}>Complete your profile to unlock more features</p>
        </div>
        <div style={{ flex: 1, maxWidth: '320px' }}>
          <div style={{ background: '#2A2A2A', borderRadius: '100px', height: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${percentage}%`, background: '#CC1111', height: '100%' }}></div>
          </div>
          <p style={{ textAlign: 'right', fontSize: '11px', color: '#4B5563', marginTop: '6px' }}>{percentage}% Complete</p>
        </div>
        <button style={{ background: 'transparent', border: '1px solid #CC1111', color: '#CC1111', padding: '8px 20px', borderRadius: '100px', fontSize: '12px', cursor: 'pointer' }}>Complete Profile</button>
      </div>
    </div>
  );
}
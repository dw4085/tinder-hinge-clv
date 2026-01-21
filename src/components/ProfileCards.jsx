import { User, MessageCircle, Heart } from 'lucide-react'

function ProfileCards() {
  return (
    <div className="profile-comparison">
      <h3 className="profile-comparison__title">Product Philosophy: Swipe vs. Prompt</h3>
      
      <div className="profile-cards">
        {/* Tinder Style Card */}
        <div className="profile-card profile-card--tinder">
          <div className="profile-card__image">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="30" r="18" fill="#4A4A4A"/>
              <ellipse cx="40" cy="65" rx="25" ry="18" fill="#4A4A4A"/>
            </svg>
          </div>
          <div className="profile-card__content">
            <div className="profile-card__name">Alex, 28</div>
            <div className="profile-card__bio">Coffee enthusiast ☕ | Dog dad 🐕</div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '2rem',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              <button style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: '2px solid #FF4458',
                background: 'transparent',
                color: '#FF4458',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }} aria-label="Pass">
                ✕
              </button>
              <button style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: '2px solid #4CD964',
                background: 'transparent',
                color: '#4CD964',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }} aria-label="Like">
                ♥
              </button>
            </div>
            
            <p style={{ 
              fontSize: '0.75rem', 
              color: 'rgba(255,255,255,0.5)', 
              textAlign: 'center',
              marginTop: '1rem'
            }}>
              Binary yes/no decision • Volume-based matching
            </p>
          </div>
        </div>

        {/* Hinge Style Card */}
        <div className="profile-card profile-card--hinge">
          <div className="profile-card__image" style={{ background: 'linear-gradient(135deg, #E8E0D8 0%, #D4C9BD 100%)' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="30" r="18" fill="#A89888"/>
              <ellipse cx="40" cy="65" rx="25" ry="18" fill="#A89888"/>
            </svg>
          </div>
          <div className="profile-card__content">
            <div className="profile-card__name" style={{ color: 'var(--warm-gray-700)' }}>Jordan, 29</div>
            
            <div className="profile-card__prompt">
              <div className="profile-card__prompt-label">The way to win me over is</div>
              <div className="profile-card__prompt-text">Making me laugh and being genuinely curious about the world</div>
            </div>
            
            <div style={{ marginTop: '0.75rem' }}>
              <button style={{
                width: '100%',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: 'none',
                background: 'linear-gradient(135deg, #7D2E4D 0%, #B85C75 100%)',
                color: 'white',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <MessageCircle size={14} />
                Like & Comment
              </button>
            </div>
            
            <p style={{ 
              fontSize: '0.75rem', 
              color: 'var(--warm-gray-500)', 
              textAlign: 'center',
              marginTop: '1rem'
            }}>
              Intentional engagement • Quality-focused matching
            </p>
          </div>
        </div>
      </div>
      
      {/* Comparison Table */}
      <div style={{ 
        marginTop: 'var(--space-xl)', 
        background: 'var(--warm-gray-100)', 
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-lg)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid var(--warm-gray-200)', color: 'var(--warm-gray-500)' }}>Design Element</th>
              <th style={{ textAlign: 'center', padding: '0.5rem', borderBottom: '2px solid var(--warm-gray-200)', color: 'var(--tinder-coral)' }}>Tinder</th>
              <th style={{ textAlign: 'center', padding: '0.5rem', borderBottom: '2px solid var(--warm-gray-200)', color: 'var(--hinge-burgundy)' }}>Hinge</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--warm-gray-200)' }}>Profile Depth</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--warm-gray-200)', textAlign: 'center' }}>Photos + brief bio</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--warm-gray-200)', textAlign: 'center' }}>Photos + prompts + preferences</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--warm-gray-200)' }}>Matching Mechanism</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--warm-gray-200)', textAlign: 'center' }}>Swipe yes/no</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--warm-gray-200)', textAlign: 'center' }}>Like specific content + comment</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--warm-gray-200)' }}>Daily Limit (Free)</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--warm-gray-200)', textAlign: 'center' }}>100 right swipes</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--warm-gray-200)', textAlign: 'center' }}>8-10 likes</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem' }}>Match Signal Quality</td>
              <td style={{ padding: '0.5rem', textAlign: 'center' }}>Low (mass swiping)</td>
              <td style={{ padding: '0.5rem', textAlign: 'center' }}>High (intentional likes)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProfileCards

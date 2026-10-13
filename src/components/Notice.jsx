// Full-page message shown while checking the class hub sign-in (or when it fails).
function Notice({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      padding: '24px',
      textAlign: 'center',
      background: '#FFF8F2',
      color: '#5A4A42',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {children}
    </div>
  )
}

export default Notice

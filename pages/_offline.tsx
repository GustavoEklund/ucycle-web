import React from 'react'

const OfflinePage: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginTop: '40vh' }}>Você está offline</h1>
      <p style={{ textAlign: 'center' }}>Por favor, verifique sua conexão com a internet.</p>
    </div>
  )
}

export default OfflinePage

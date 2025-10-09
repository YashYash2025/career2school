'use client';

export default function FinancialTab() {
  return (
    <div style={{
      background: 'var(--card-bg)',
      borderRadius: '20px',
      padding: '40px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>💰</div>
      <h2 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: 'var(--text-primary)',
        marginBottom: '15px',
        fontFamily: 'Cairo, Arial, sans-serif',
        direction: 'rtl'
      }}>
        البيانات المالية
      </h2>
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '16px',
        marginBottom: '30px',
        fontFamily: 'Cairo, Arial, sans-serif',
        direction: 'rtl'
      }}>
        هذا القسم قيد التطوير
      </p>
      <div style={{
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '15px',
        padding: '20px',
        marginTop: '20px'
      }}>
        <p style={{
          color: 'var(--text-primary)',
          fontSize: '14px',
          fontFamily: 'Cairo, Arial, sans-serif',
          direction: 'rtl'
        }}>
          قريباً: سجل المعاملات، الاشتراكات، والفواتير
        </p>
      </div>
    </div>
  );
}

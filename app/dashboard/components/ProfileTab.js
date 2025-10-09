'use client';

import { useState } from 'react';

export default function ProfileTab({ user, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.profile?.first_name || '',
    last_name: user?.profile?.last_name || '',
    phone: user?.profile?.phone || '',
    birth_date: user?.profile?.birth_date || '',
    city: user?.profile?.city || '',
    school_name: user?.profile?.school_name || '',
  });

  const handleSave = async () => {
    // TODO: Call API to update profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
    if (onUpdate) onUpdate(formData);
  };

  return (
    <div style={{
      background: 'var(--card-bg)',
      borderRadius: '20px',
      padding: '40px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          fontFamily: 'Cairo, Arial, sans-serif',
          direction: 'rtl'
        }}>
          👤 البيانات الشخصية
        </h2>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          style={{
            padding: '10px 20px',
            background: isEditing ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: 'Cairo, Arial, sans-serif',
            direction: 'rtl'
          }}
        >
          {isEditing ? '💾 حفظ التغييرات' : '✏️ تعديل البيانات'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {/* First Name */}
        <div>
          <label style={{
            display: 'block',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            marginBottom: '8px',
            fontFamily: 'Cairo, Arial, sans-serif',
            direction: 'rtl'
          }}>
            الاسم الأول
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                fontFamily: 'Cairo, Arial, sans-serif',
                direction: 'rtl'
              }}
            />
          ) : (
            <div style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              color: 'var(--text-primary)',
              fontSize: '16px',
              fontFamily: 'Cairo, Arial, sans-serif',
              direction: 'rtl'
            }}>
              {formData.first_name || 'غير محدد'}
            </div>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label style={{
            display: 'block',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            marginBottom: '8px',
            fontFamily: 'Cairo, Arial, sans-serif',
            direction: 'rtl'
          }}>
            الاسم الأخير
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                fontFamily: 'Cairo, Arial, sans-serif',
                direction: 'rtl'
              }}
            />
          ) : (
            <div style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              color: 'var(--text-primary)',
              fontSize: '16px',
              fontFamily: 'Cairo, Arial, sans-serif',
              direction: 'rtl'
            }}>
              {formData.last_name || 'غير محدد'}
            </div>
          )}
        </div>

        {/* Email (Read-only) */}
        <div>
          <label style={{
            display: 'block',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            marginBottom: '8px',
            fontFamily: 'Cairo, Arial, sans-serif',
            direction: 'rtl'
          }}>
            البريد الإلكتروني
          </label>
          <div style={{
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '10px',
            color: 'var(--text-secondary)',
            fontSize: '16px',
            fontFamily: 'Cairo, Arial, sans-serif',
            direction: 'rtl'
          }}>
            {user?.email || 'غير محدد'} 🔒
          </div>
        </div>

        {/* Phone */}
        <div>
          <label style={{
            display: 'block',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            marginBottom: '8px',
            fontFamily: 'Cairo, Arial, sans-serif',
            direction: 'rtl'
          }}>
            رقم الهاتف
          </label>
          {isEditing ? (
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                fontFamily: 'Cairo, Arial, sans-serif',
                direction: 'rtl'
              }}
            />
          ) : (
            <div style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              color: 'var(--text-primary)',
              fontSize: '16px',
              fontFamily: 'Cairo, Arial, sans-serif',
              direction: 'rtl'
            }}>
              {formData.phone || 'غير محدد'}
            </div>
          )}
        </div>

        {/* Birth Date */}
        <div>
          <label style={{
            display: 'block',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            marginBottom: '8px',
            fontFamily: 'Cairo, Arial, sans-serif',
            direction: 'rtl'
          }}>
            تاريخ الميلاد
          </label>
          {isEditing ? (
            <input
              type="date"
              value={formData.birth_date}
              onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                fontFamily: 'Cairo, Arial, sans-serif',
                direction: 'rtl'
              }}
            />
          ) : (
            <div style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              color: 'var(--text-primary)',
              fontSize: '16px',
              fontFamily: 'Cairo, Arial, sans-serif',
              direction: 'rtl'
            }}>
              {formData.birth_date ? new Date(formData.birth_date).toLocaleDateString('ar-EG') : 'غير محدد'}
            </div>
          )}
        </div>

        {/* City */}
        <div>
          <label style={{
            display: 'block',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            marginBottom: '8px',
            fontFamily: 'Cairo, Arial, sans-serif',
            direction: 'rtl'
          }}>
            المدينة
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                fontFamily: 'Cairo, Arial, sans-serif',
                direction: 'rtl'
              }}
            />
          ) : (
            <div style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              color: 'var(--text-primary)',
              fontSize: '16px',
              fontFamily: 'Cairo, Arial, sans-serif',
              direction: 'rtl'
            }}>
              {formData.city || 'غير محدد'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

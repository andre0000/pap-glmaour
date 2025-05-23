import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', pfp: '' });
  const [preview, setPreview] = useState(null);
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) return navigate('/');

      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          setFormData({
            name: data.user.name,
            email: data.user.email,
            pfp: data.user.pfp || '',
          });
          sessionStorage.setItem('user', JSON.stringify(data.user));
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Erro ao buscar perfil:', err);
        navigate('/');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(
        'http://localhost:5000/api/auth/update-profile',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        setIsEditing(false);
        setPreview(null);
      } else {
        alert(data.message || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar perfil.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, pfp: reader.result });
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (!user) return null;

  return (
    <>
      <div className='profile-background'>
        <img
          src='https://www.apparelentrepreneurship.com/wp-content/uploads/2019/04/apparel_entrepreneurship_what_your_clothing_brand_needs_to_stay_relevant_2019.jpg'
          alt='Background Men'
          className='bg-img'
        />
        <img
          src='https://cdn.prod.website-files.com/61083e5f5398b157c850d20a/6808fd7f84e7f1bab2bba0e8_660c252e41e2cc4e1aee8a9b_Main%2520Blog%2520Image%2520(1080%2520x%25201080%2520px).png'
          alt='Background Women'
          className='bg-img'
        />
      </div>

      <div className='profile-wrapper'>
        <h2 className='title'>{t('title.profile')}</h2>

        <div className='profile-pfp'>
          <img
            src={
              preview ||
              user.pfp ||
              'https://yt3.googleusercontent.com/g_ehk5ILwK_UcZpC3obW4-uL7PSeY8aOhXfqh4oIMBv0YlgimDGFoWPaZYrCmROu3_pXchDlwQ=s900-c-k-c0x00ffffff-no-rj'
            }
            alt='Foto de perfil'
            className='pfp-img'
          />
          {isEditing && (
            <>
              <input
                type='file'
                accept='image/*'
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <button
                className='change-photo-link'
                onClick={() => fileInputRef.current.click()}
                type='button'
              >
                {t('buttons.pfp')}
              </button>
            </>
          )}
        </div>

        <div className='profile-group-row'>
          <label>{t('fields.name')}:</label>
          {isEditing ? (
            <input name='name' value={formData.name} onChange={handleChange} />
          ) : (
            <span>{user.name}</span>
          )}
        </div>

        <div className='profile-group-row'>
          <label>{t('fields.password')}:</label>
          {isEditing ? (
            <input
              name='email'
              value={formData.email}
              onChange={handleChange}
            />
          ) : (
            <span>{user.email}</span>
          )}
        </div>

        <div className='profile-buttons'>
          {isEditing ? (
            <button className='btn save' onClick={handleSave}>
              {t('buttons.save')}
            </button>
          ) : (
            <button className='btn edit-icon' onClick={handleEdit}>
              🖉
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

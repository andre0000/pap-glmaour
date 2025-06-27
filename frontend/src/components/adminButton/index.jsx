import { Link } from 'react-router-dom';
import { GrUserAdmin } from 'react-icons/gr';
import './styles.css';

const AdminButton = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const isAdmin = user?.is_admin === true;

  if (!isAdmin) return null;

  return (
    <Link to='/' className='floating-admin-btn' title='Home'>
      <GrUserAdmin size={18} />
    </Link>
  );
};

export default AdminButton;

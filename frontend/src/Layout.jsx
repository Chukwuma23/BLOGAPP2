// Layout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

const Layout = () => {
   // console.log('Layout children:', children); // Debug: Check if children exist
  return (
    <div className='px-4 md:px-8 lg:px-32 2xl:px-64 border-2'>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
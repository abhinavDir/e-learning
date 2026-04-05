import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, BarChart2, User, LogOut, Search, BrainCircuit, X } from 'lucide-react'
import './Sidebar.css'

const Sidebar = ({ logout, isOpen, close }) => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Search size={20} />, label: 'Explore Academy', path: '/explore' },
    { icon: <BarChart2 size={20} />, label: 'Analytics', path: '/analytics' },
    { icon: <User size={20} />, label: 'Profile', path: '/profile' },
  ];

  return (
    <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
      <button className="sidebar-close mobile-only" onClick={close}>
        <X size={24} />
      </button>
      <div className="sidebar-brand flex-center">
        <BrainCircuit size={32} className="brand-icon" />
        <span className="brand-text">AI Learning</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, idx) => (
          <NavLink 
            key={idx} 
            to={item.path} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={close}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="nav-link logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

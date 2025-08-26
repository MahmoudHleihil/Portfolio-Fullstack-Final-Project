import { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthCtx } from '../context/AuthContext';

export default function Header() {
  const { token, logout } = useContext(AuthCtx);
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/resume', label: 'Resume' },
    { to: '/projects', label: 'Projects' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Portfolio</Link>
      <button
        className="navbar-toggler"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {links.map(link => (
            <li className="nav-item" key={link.to}>
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'fw-bold text-primary' : ''}`
                }
                to={link.to}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          {token ? (
            <>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/admin"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm ms-2"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/admin/login"
                onClick={() => setOpen(false)}
              >
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

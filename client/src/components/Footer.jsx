import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-4">
      <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
      <p>
        <Link to="/about">About</Link> | 
        <Link to="/contact">Contact</Link>
      </p>
    </footer>
  );
}

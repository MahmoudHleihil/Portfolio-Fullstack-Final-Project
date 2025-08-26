import { useEffect, useState } from 'react';
import { API } from '../api/http';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function BlogList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    async function load() {
      const r = await fetch(API('/api/blogs'));
      const d = await r.json();
      setPosts(d);
    }
    load();
  }, []);

  return (
    <div className="container py-5 text-light">
      <h1 className="text-center mb-4" data-aos="fade-up">My Blog</h1>
      <p className="text-secondary text-center mb-5" data-aos="fade-up" data-aos-delay="200">
        Thoughts, tutorials, and updates from my learning journey 
      </p>

      <div className="row g-4">
        {posts.length === 0 && (
          <p className="text-center text-secondary">No posts yet. Check back soon!</p>
        )}

        {posts.map((p, i) => (
          <div className="col-md-6 col-lg-4" key={p.id} data-aos="fade-up" data-aos-delay={i * 100}>
            <div className="card bg-dark shadow-sm h-100 border-0">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-primary">{p.title}</h5>
                <small className="text-secondary mb-2">
                  {new Date(p.createdAt || Date.now()).toLocaleDateString()}
                </small>
                <p className="card-text flex-grow-1 text-light small">
                  {p.excerpt || (p.content?.substring(0, 100) + '...')}
                </p>
                <Link to={`/blog/${p.slug}`} className="btn btn-outline-info mt-auto">
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

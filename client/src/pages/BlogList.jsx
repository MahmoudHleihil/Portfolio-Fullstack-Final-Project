import { useEffect, useState } from 'react';
import { API } from '../api/http';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function BlogList() {
  const [posts, setPosts] = useState([]);

  // Initialize AOS animations and load blog posts on mount
  useEffect(() => {
    AOS.init({ duration: 1000 });

    async function load() {
      const r = await fetch(API('/api/blogs')); // Fetch blog posts from API
      const d = await r.json();
      setPosts(d); // Store posts in state
    }

    load();
  }, []);

  return (
    <div className="container py-5 text-light">
      {/* Section title */}
      <h1 className="text-center mb-4" data-aos="fade-up">My Blog</h1>

      {/* Section subtitle */}
      <p className="text-secondary text-center mb-5" data-aos="fade-up" data-aos-delay="200">
        Thoughts, tutorials, and updates from my learning journey 
      </p>

      <div className="row g-4">
        {/* Show message if no posts */}
        {posts.length === 0 && (
          <p className="text-center text-secondary">No posts yet. Check back soon!</p>
        )}

        {/* Render posts */}
        {posts.map((p, i) => (
          <div className="col-md-6 col-lg-4" key={p.id} data-aos="fade-up" data-aos-delay={i * 100}>
            <div className="card bg-dark shadow-sm h-100 border-0">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-primary">{p.title}</h5>
                <small className="text-secondary mb-2">
                  {new Date(p.createdAt || Date.now()).toLocaleDateString()}
                </small>
                <p className="card-text flex-grow-1 text-light small">
                  {(p.slug) + '...'}
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

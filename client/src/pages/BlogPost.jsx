import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API } from '../api/http';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    async function load() {
      try {
        const res = await fetch(API(`/api/blogs/${slug}`));
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error("Failed to load blog:", err);
      }
    }
    load();
  }, [slug]);

  if (!post) return <div className="container text-light py-5">Loading…</div>;

  return (
    <div className="container py-5">
      {/* Title */}
      <h1 className="fw-bold mb-3 text-primary" data-aos="fade-up">
        {post.title}
      </h1>

      {/* Cover image */}
      {post.coverUrl && (
        <div className="mb-4 text-center" data-aos="zoom-in">
          <img
            src={post.coverUrl}
            alt={post.title}
            className="img-fluid rounded shadow"
            style={{ maxHeight: '450px', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Blog content */}
      <div
        className="card bg-dark text-light p-4 shadow"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </div>

      {/* Back to Blog button */}
      <div className="mt-4 text-center">
        <Link to="/blog" className="btn btn-outline-primary">
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
}

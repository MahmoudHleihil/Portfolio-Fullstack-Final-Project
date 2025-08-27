import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../api/http';

export default function ProjectDetails() {
  const { slug } = useParams();
  const [p, setP] = useState(null);

  // Load project data on mount or when slug changes
  useEffect(() => {
    async function load() {
      const res = await fetch(API(`/api/projects/${slug}`));
      const data = await res.json();
      setP(data);
    }
    load();
  }, [slug]);

  if (!p) return <div className="container text-center py-5">Loading…</div>;

  return (
    <div className="container my-5">
      <div className="card shadow p-4">
        {/* Project title */}
        <h1 className="mb-3 text-primary">{p.title}</h1>

        {/* Image carousel */}
        {p.images?.length > 0 && (
          <div id="projectCarousel" className="carousel slide mb-4">
            <div className="carousel-inner">
              {p.images.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className={`carousel-item ${idx === 0 ? 'active' : ''}`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="d-block w-100 rounded"
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>

            {/* Carousel controls if multiple images */}
            {p.images.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target="#projectCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#projectCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Project description */}
        <p className="lead">{p.description}</p>

        {/* YouTube embed if provided */}
        {p.youtubeEmbed && (
          <div
            className="ratio ratio-16x9 mb-4"
            dangerouslySetInnerHTML={{ __html: p.youtubeEmbed }}
          />
        )}

        {/* External links */}
        <div className="mb-3">
          {p.githubUrl && (
            <a href={p.githubUrl} target="_blank" rel="noreferrer" className="btn btn-dark me-2">
               GitHub
            </a>
          )}
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn-success">
               Live Demo
            </a>
          )}
        </div>

        {/* Skills used in project */}
        {p.skills?.length > 0 && (
          <div>
            <h4 className="mt-4">Skills Used</h4>
            <div className="d-flex flex-wrap gap-2">
              {p.skills.map(ps => (
                <span key={ps.skill.id} className="badge bg-info text-dark">
                  {ps.skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

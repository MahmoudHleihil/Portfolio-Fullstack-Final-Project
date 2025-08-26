import React from 'react';

export default function ProjectCard({ p }) {
  const cover = p.images?.[0]?.url;

  return (
    <a
      href={`/projects/${p.slug}`}
      className="project-card"
      style={{
        display: 'block',
        border: '1px solid #eee',
        borderRadius: 8,
        padding: 12,
        textDecoration: 'none',
        color: 'inherit',
        backgroundColor: '#fff',
        transition: 'transform 0.2s, box-shadow 0.2s',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        height: '100%',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
      }}
    >
      {cover && (
        <img
          src={cover}
          alt={p.title}
          style={{
            width: '100%',
            height: 160,
            objectFit: 'cover',
            borderRadius: 6,
            marginBottom: 10,
          }}
        />
      )}

      <h3 style={{ fontSize: '1.25rem', marginBottom: 6, color: '#007bff' }}>{p.title}</h3>
      <p style={{ fontSize: '.9rem', color: '#555', marginBottom: 10 }}>
        {p.summary}
      </p>

      {/* Skills badges */}
      <div>
        {p.skills?.length > 0 ? (
          p.skills.map((s, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                backgroundColor: '#f0f0f0',
                color: '#333',
                fontSize: '.75rem',
                padding: '2px 6px',
                borderRadius: 4,
                marginRight: 4,
                marginBottom: 4,
              }}
            >
              {s.skill?.name || s.name || s}
            </span>
          ))
        ) : (
          <span style={{ fontSize: '.75rem', color: '#aaa' }}>No skills</span>
        )}
      </div>
    </a>
  );
}

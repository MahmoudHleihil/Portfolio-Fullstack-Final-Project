import { useEffect, useState } from 'react';
import { API } from '../api/http';
import ProjectCard from '../components/ProjectCard.jsx';

export default function Projects() {
  const [items, setItems] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState('');
  const [search, setSearch] = useState('');

  const load = async () => {
    const qs = new URLSearchParams({ skill, search }).toString();
    const res = await fetch(API(`/api/projects?${qs}`));
    setItems(await res.json());
  };

  useEffect(() => { load(); }, [skill, search]);
  useEffect(() => { fetch(API('/api/skills')).then(r => r.json()).then(setSkills); }, []);

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-primary text-center">Projects</h1>

      {/* Filters */}
      <div className="card p-3 mb-4 shadow-sm d-flex flex-wrap gap-3 align-items-center">
        <select
          value={skill}
          onChange={e => setSkill(e.target.value)}
          className="form-select w-auto"
        >
          <option value="">All Skills</option>
          {skills.map(s => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>
        <input
          placeholder="Search projects…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-control flex-grow-1"
          style={{ minWidth: 200 }}
        />
      </div>

      {/* Project Grid */}
      {items.length === 0 ? (
        <p className="text-muted text-center mt-5 fs-5">No projects found.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {items.map(p => (
            <div className="col" key={p.id}>
              <ProjectCard p={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { API } from '../api/http';

export default function Contact() {
  // Form state
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [status, setStatus] = useState(null); // Success/error message
  const [loading, setLoading] = useState(false); // Loading indicator

  // Send contact message
  const send = async () => {
    // Basic validation
    if (!form.name || !form.email || !form.message) {
      setStatus("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        setForm({ name:'', email:'', subject:'', message:'' }); // Clear form
      } else {
        setStatus("❌ Failed to send. Try again later.");
      }
    } catch (err) {
      setStatus("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container card p-4 shadow-sm">
      <h1 className="mb-4 text-primary">Contact Me</h1>

      {/* Name input */}
      <div className="mb-3">
        <label className="form-label">Name*</label>
        <input 
          className="form-control"
          placeholder="Your name"
          value={form.name}
          onChange={e=>setForm({...form,name:e.target.value})}
        />
      </div>

      {/* Email input */}
      <div className="mb-3">
        <label className="form-label">Email*</label>
        <input 
          type="email"
          className="form-control"
          placeholder="Your email"
          value={form.email}
          onChange={e=>setForm({...form,email:e.target.value})}
        />
      </div>

      {/* Subject input */}
      <div className="mb-3">
        <label className="form-label">Subject</label>
        <input 
          className="form-control"
          placeholder="Subject"
          value={form.subject}
          onChange={e=>setForm({...form,subject:e.target.value})}
        />
      </div>

      {/* Message textarea */}
      <div className="mb-3">
        <label className="form-label">Message*</label>
        <textarea 
          className="form-control"
          rows="4"
          placeholder="Your message..."
          value={form.message}
          onChange={e=>setForm({...form,message:e.target.value})}
        />
      </div>

      {/* Submit button */}
      <button 
        className="btn btn-primary w-100" 
        onClick={send} 
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>

      {/* Status message */}
      {status && (
        <div className="mt-3 alert alert-info">{status}</div>
      )}
    </div>
  );
}

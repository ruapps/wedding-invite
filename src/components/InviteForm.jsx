import React, { useState } from "react";

export default function InviteForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", relation: "", older: false });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} style={{ flex: 1, maxWidth: 420 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Your name</label>
        <input name="name" value={form.name} onChange={handleChange} required style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Relation with groom</label>
        <select name="relation" value={form.relation} onChange={handleChange} required style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}>
          <option value="">-- choose relation --</option>
          <option value="friend">Friend</option>
          <option value="nephew">Nephew</option>
          <option value="niece">Niece</option>
          <option value="uncle">Uncle (Chacha)</option>
          <option value="aunt">Aunt (Chachi / Mausi)</option>
          <option value="cousin">Cousin</option>
          <option value="father">Father</option>
          <option value="mother">Mother</option>
          <option value="sibling">Sibling</option>
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13 }}>
          <input type="checkbox" name="older" checked={form.older} onChange={handleChange} /> &nbsp; Is the guest older than the groom?
        </label>
      </div>

      <div>
        <button type="submit" style={{ background: "#d97706", color: "white", padding: "10px 14px", borderRadius: 8, border: "none", cursor: "pointer" }}>
          Get Invitation
        </button>
      </div>
    </form>
  );
}

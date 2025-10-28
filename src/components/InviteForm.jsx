import React, { useState } from "react";

export default function InviteForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", relation: "", older: false });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} style={{ flex: 1, width: "100%" }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
          Your name ( कृपया अपना पहला नाम डालें)
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ddd",
          }}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
          Relation with groom ( आप जसवंत के क्या लगते या लगती हैं जैसे- बहन,
          चाचा या बड़े भैया )
        </label>
        <select
          name="relation"
          value={form.relation}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ddd",
          }}
        >
          <option value="">-- choose relation --</option>
          <option value="friend">Friend ( दोस्त )</option>
          <option value="nephew">Nephew ( भतीजा )</option>
          <option value="niece">Niece ( भतीजी )</option>
          <option value="uncle">Uncle ( चाचा )</option>
          <option value="chachi">Chachi ( चाची )</option>
          <option value="mausa">Mausa ( मौसा )</option>
          <option value="mausi"> Mausi ( मौसी )</option>
          <option value="brother">Brother ( भाई )</option>
          <option value="sister">Sister ( बहन )</option>
          <option value="fufa">Fufa ( फूफा )</option>
          <option value="bua">Bua ( बुआ )</option>
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13 }}>
          <input
            type="checkbox"
            name="older"
            checked={form.older}
            onChange={handleChange}
          />{" "}
          &nbsp; Is the guest older than the groom? ( क्या आप जसवंत से बड़े हैं
          और उनके भाई या बहन लगते हैं? अगर हां तो बॉक्स टिक करें अन्यथा नहीं )
        </label>
      </div>

      <div>
        <button
          type="submit"
          style={{
            background: "#d97706",
            color: "white",
            padding: "10px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          Get Invitation
        </button>
      </div>
    </form>
  );
}

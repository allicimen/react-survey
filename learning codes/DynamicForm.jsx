import React, { useState } from "react";

// Örnek soru dizisi — sorular burada dizi (array) olarak tutuluyor
const questions = [
  { id: 1, question: "Adınız nedir?", type: "text" },
  { id: 2, question: "Yaşınız kaç?", type: "number" },
  {
    id: 3,
    question: "Cinsiyetiniz?",
    type: "select",
    options: ["Erkek", "Kadın", "Diğer"],
  },
];

// DynamicForm bileşeni
export default function DynamicForm() {
  // Form verilerini saklamak için state
  const [formData, setFormData] = useState({});
  // Basit bir gönderim sonucu göstergesi
  const [submitted, setSubmitted] = useState(false);

  // Input değiştiğinde çağrılan yardımcı fonksiyon
  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Form gönderildiğinde olacaklar
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Burada gerçek uygulamada API çağrısı veya daha ileri işlem yapılır
    console.log("Form gönderildi:", formData);
    // Kullanıcıya hızlıca gösterelim
    alert("Form gönderildi — konsola bakınız.");
  };

  // Basit stiller (Tailwind yok)
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
    padding: "24px",
    boxSizing: "border-box",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "720px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    padding: "20px",
  };

  const labelStyle = { display: "block", fontWeight: 600, marginBottom: "6px" };
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  };

  const fieldWrap = { marginBottom: "14px" };
  const submitStyle = {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#0069d9",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Başlık */}
        <h2 style={{ textAlign: "center", marginBottom: "16px" }}>Dinamik Form</h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {questions.map((q) => (
            <div key={q.id} style={fieldWrap}>
              {/* Soru metni */}
              <label style={labelStyle}>{q.question}</label>

              {/* Tip'e göre uygun input render ediliyor */}
              {q.type === "text" && (
                <input
                  type="text"
                  style={inputStyle}
                  value={formData[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}

              {q.type === "number" && (
                <input
                  type="number"
                  style={inputStyle}
                  value={formData[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}

              {q.type === "select" && (
                <select
                  style={inputStyle}
                  value={formData[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                >
                  <option value="">Seçiniz...</option>
                  {q.options.map((op, i) => (
                    <option key={i} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}

          {/* Gönder butonu */}
          <div style={{ textAlign: "right" }}>
            <button type="submit" style={submitStyle}>
              Gönder
            </button>
          </div>
        </form>

        {/* Gönderim sonrası kısa özet */}
        {submitted && (
          <div style={{ marginTop: "16px", fontSize: "14px" }}>
            <strong>Sonuç (konsola yazıldı):</strong>
            <pre style={{ background: "#f0f0f0", padding: "8px", borderRadius: "6px" }}>
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

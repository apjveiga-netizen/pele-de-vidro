import { useState } from "react";
import { colors } from "../theme";

export default function ExerciseForm({ exercise, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: exercise?.name || "",
    duration: exercise?.duration || "",
    reps: exercise?.reps || "",
    zone: exercise?.zone || "",
    instructions: exercise?.instructions || "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.zone.trim()) return;
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Nome do Exercício *</label>
        <input
          className="form-input"
          type="text"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Ex: Levantamento de maçãs"
          required
        />
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Duração</label>
          <input
            className="form-input"
            type="text"
            value={form.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            placeholder="Ex: 3 min"
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Repetições</label>
          <input
            className="form-input"
            type="text"
            value={form.reps}
            onChange={(e) => handleChange("reps", e.target.value)}
            placeholder="Ex: 3×15"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Zona Facial *</label>
        <input
          className="form-input"
          type="text"
          value={form.zone}
          onChange={(e) => handleChange("zone", e.target.value)}
          placeholder="Ex: Maçãs, Mandíbula, Testa..."
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Instruções</label>
        <textarea
          className="form-input"
          value={form.instructions}
          onChange={(e) => handleChange("instructions", e.target.value)}
          placeholder="Descreva como realizar o exercício..."
          rows={3}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button type="button" className="btn-ghost btn-small" onClick={onCancel} style={{ flex: 1 }}>
          CANCELAR
        </button>
        <button type="submit" className="btn-gold btn-small" style={{ flex: 1 }}>
          {exercise ? "SALVAR" : "CRIAR EXERCÍCIO"}
        </button>
      </div>
    </form>
  );
}

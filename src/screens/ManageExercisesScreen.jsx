import { useState, useEffect } from "react";
import { colors } from "../theme";
import { getExercises, deleteExercise, addExercise, updateExercise } from "../data/store";
import ExerciseForm from "../components/ExerciseForm";

export default function ManageExercisesScreen({ onBack }) {
  const [exercises, setExercises] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setExercises(getExercises());
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleCreate = (data) => {
    addExercise(data);
    setExercises(getExercises());
    setShowForm(false);
  };

  const handleUpdate = (data) => {
    updateExercise(editing.id, data);
    setExercises(getExercises());
    setEditing(null);
  };

  const handleDelete = (id) => {
    deleteExercise(id);
    setExercises(getExercises());
    setConfirmDelete(null);
  };

  return (
    <div className="screen-wrapper">
      <div className="container-main">
        <div className="content-area">
          {/* Cabeçalho */}
          <div style={{
            marginBottom: "24px", opacity: visible ? 1 : 0, transition: "opacity 0.5s",
          }}>
            <div style={{ color: colors.gold, fontSize: "10px", letterSpacing: "0.25em", marginBottom: "8px" }}>
              GERENCIAR
            </div>
            <div className="cormorant" style={{ fontSize: "28px", color: colors.cream, fontWeight: 300, lineHeight: 1.2, marginBottom: "8px" }}>
              Seus Exercícios
            </div>
            <p style={{ color: colors.muted, fontSize: "13px", lineHeight: 1.5 }}>
              Crie, edite ou remova exercícios do seu protocolo.
            </p>
          </div>

          {/* Lista */}
          <div style={{
            display: "flex", flexDirection: "column", gap: "10px",
            opacity: visible ? 1 : 0, transition: "opacity 0.5s 0.2s",
          }}>
            <div style={{ color: colors.muted, fontSize: "11px", letterSpacing: "0.2em", marginBottom: "4px" }}>
              {exercises.length} EXERCÍCIO{exercises.length !== 1 ? "S" : ""} CADASTRADO{exercises.length !== 1 ? "S" : ""}
            </div>

            {exercises.map((ex) => (
              <div key={ex.id} style={{
                background: colors.card, border: `1px solid ${colors.border}`,
                borderRadius: "16px", padding: "14px 16px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: colors.cream, fontSize: "14px", fontWeight: 400, marginBottom: "4px" }}>
                      {ex.name}
                    </div>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <span style={{ color: colors.muted, fontSize: "11px" }}>⏱ {ex.duration}</span>
                      <span style={{ color: colors.muted, fontSize: "11px" }}>↺ {ex.reps}</span>
                      <span style={{ color: colors.gold, fontSize: "11px", opacity: 0.7 }}>#{ex.zone}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="btn-ghost btn-small"
                    onClick={() => setEditing(ex)}
                    style={{ flex: 1 }}
                  >
                    ✏️ EDITAR
                  </button>
                  <button
                    className="btn-danger btn-small"
                    onClick={() => setConfirmDelete(ex.id)}
                    style={{ flex: 1 }}
                  >
                    🗑 APAGAR
                  </button>
                </div>
              </div>
            ))}

            {exercises.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: colors.muted }}>
                <p style={{ fontSize: "14px" }}>Nenhum exercício cadastrado ainda.</p>
              </div>
            )}
          </div>
        </div>

        <div className="button-group">
          <button
            className="btn-gold"
            onClick={() => { setShowForm(true); setEditing(null); }}
          >
            + NOVO EXERCÍCIO
          </button>
          <button className="btn-ghost" onClick={onBack}>
            VOLTAR
          </button>
        </div>
      </div>

      {/* Modais */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="cormorant" style={{ fontSize: "22px", color: colors.cream, fontWeight: 300, marginBottom: "20px" }}>
              Criar exercício
            </div>
            <ExerciseForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="cormorant" style={{ fontSize: "22px", color: colors.cream, fontWeight: 300, marginBottom: "20px" }}>
              Editar exercício
            </div>
            <ExerciseForm exercise={editing} onSave={handleUpdate} onCancel={() => setEditing(null)} />
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
            <div className="cormorant" style={{ fontSize: "22px", color: colors.cream, fontWeight: 300, marginBottom: "8px" }}>
              Apagar exercício?
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-ghost btn-small" onClick={() => setConfirmDelete(null)} style={{ flex: 1 }}>
                CANCELAR
              </button>
              <button className="btn-danger btn-small" onClick={() => handleDelete(confirmDelete)} style={{ flex: 1 }}>
                SIM, APAGAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

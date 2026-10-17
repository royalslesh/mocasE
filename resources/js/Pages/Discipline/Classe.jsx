import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";

const TYPE_OPTIONS = [
    { value: "absence",                label: "Absence (heures)",      unit: "h" },
    { value: "retard",                  label: "Retard",                unit: "x" },
    { value: "avertissement_conduite",  label: "Avertissement Conduite",unit: "x" },
    { value: "avertissement_travail",   label: "Avertissement Travail", unit: "x" },
    { value: "blame",                   label: "Blame",                 unit: "x" },
    { value: "exclusion",               label: "Exclusion (jours)",     unit: "j" },
];

const TYPE_COLORS = {
    absence:                "bg-orange-100 text-orange-700",
    retard:                 "bg-yellow-100 text-yellow-700",
    avertissement_conduite: "bg-red-100 text-red-700",
    avertissement_travail:  "bg-purple-100 text-purple-700",
    blame:                  "bg-red-200 text-red-900 font-black",
    exclusion:              "bg-gray-800 text-white",
};

/* --- SVG Icons ---------------------------------------------------------- */
const IconArrowLeft = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);
const IconPlus = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
    </svg>
);
const IconCheck = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
    </svg>
);
const IconX = () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const IconClock = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const IconAlert = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
);
const IconBan = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
);
/* ----------------------------------------------------------------------- */

export default function Classe({ auth, classe, eleves, seq }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [showForm, setShowForm]       = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        eleve_ids:      [],
        type:           "absence",
        valeur:         2,
        motif:          "",
        date_incident:  new Date().toISOString().split("T")[0],
        sequence:       seq,
    });

    const toggleEleve = (id) =>
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

    const toggleAll = () =>
        setSelectedIds(selectedIds.length === eleves.length ? [] : eleves.map((e) => e.id));

    const openForm = () => {
        if (selectedIds.length === 0) return alert("Selectionnez au moins un eleve.");
        setData("eleve_ids", selectedIds);
        setShowForm(true);
    };

    const submitForm = (e) => {
        e.preventDefault();
        post(route("discipline.store"), {
            onSuccess: () => { setShowForm(false); setSelectedIds([]); reset(); },
        });
    };

    const deleteRecord = (id) => {
        if (!confirm("Supprimer cet enregistrement ?")) return;
        router.delete(route("discipline.destroy", id), { preserveScroll: true });
    };

    const selectedType = TYPE_OPTIONS.find((t) => t.value === data.type);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link href={route("discipline.index")} className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-[var(--primary-color)] transition-colors">
                        <IconArrowLeft />
                    </Link>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: "var(--primary-color)" }}>
                            Discipline — Sequence {seq}
                        </p>
                        <h2 className="font-extrabold text-3xl text-gray-900 dark:text-white leading-tight tracking-tight">
                            {classe.nom}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={`Discipline — ${classe.nom}`} />
            <div className="space-y-6">

                {/* Toolbar */}
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        onClick={toggleAll}
                        className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-xl text-xs font-black text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-all uppercase tracking-widest"
                    >
                        {selectedIds.length === eleves.length ? "Tout decocher" : "Tout cocher"}
                    </button>
                    {selectedIds.length > 0 && (
                        <button
                            onClick={openForm}
                            className="flex items-center gap-2 px-5 py-2 text-white text-xs font-black rounded-xl shadow-lg transition-all hover:translate-y-[-1px] uppercase tracking-widest"
                            style={{ backgroundColor: "var(--primary-color)" }}
                        >
                            <IconPlus />
                            Enregistrer pour {selectedIds.length} eleve(s)
                        </button>
                    )}
                </div>

                {/* Modal formulaire */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white dark:bg-[var(--dark-bg)] w-full max-w-lg rounded-[2rem] shadow-2xl p-8">
                            <h3 className="font-black text-xl text-gray-900 dark:text-white mb-6 uppercase tracking-tight">
                                Saisie — {selectedIds.length} eleve(s) selectionne(s)
                            </h3>
                            <form onSubmit={submitForm} className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Type d'incident</label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-gray-900 dark:text-white font-bold focus:ring-2"
                                        style={{ "--tw-ring-color": "var(--primary-color)" }}
                                        value={data.type}
                                        onChange={(e) => setData("type", e.target.value)}
                                    >
                                        {TYPE_OPTIONS.map((t) => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                            Valeur ({selectedType?.unit})
                                        </label>
                                        <input
                                            type="number" min="1" max="30"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-gray-900 dark:text-white font-black text-lg focus:ring-2"
                                            style={{ "--tw-ring-color": "var(--primary-color)" }}
                                            value={data.valeur}
                                            onChange={(e) => setData("valeur", parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-gray-900 dark:text-white font-bold focus:ring-2"
                                            style={{ "--tw-ring-color": "var(--primary-color)" }}
                                            value={data.date_incident}
                                            onChange={(e) => setData("date_incident", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Motif (optionnel)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-gray-900 dark:text-white font-bold focus:ring-2 placeholder:text-gray-300"
                                        style={{ "--tw-ring-color": "var(--primary-color)" }}
                                        placeholder="Ex: Bagarre, Absence non justifiee..."
                                        value={data.motif}
                                        onChange={(e) => setData("motif", e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-black rounded-2xl hover:bg-gray-200 transition-all">
                                        Annuler
                                    </button>
                                    <button type="submit" disabled={processing} className="flex-1 flex items-center justify-center gap-2 py-3 text-white font-black rounded-2xl shadow-xl transition-all disabled:opacity-50" style={{ backgroundColor: "var(--primary-color)" }}>
                                        <IconCheck /> {processing ? "Enregistrement..." : "Valider"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Liste des eleves */}
                <div className="bg-white dark:bg-[var(--dark-bg)] rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                    <div className="px-8 py-5 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                        <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight">
                            {eleves.length} eleve(s) — Sequence {seq}
                        </h3>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {selectedIds.length} selectionne(s)
                        </span>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-white/5">
                        {eleves.map((eleve) => {
                            const isSelected = selectedIds.includes(eleve.id);
                            const absH       = eleve.discipline_records?.filter((r) => r.type === "absence").reduce((a, r) => a + r.valeur, 0) || 0;
                            const retards    = eleve.discipline_records?.filter((r) => r.type === "retard").length || 0;
                            const sanctions  = eleve.discipline_records?.filter((r) => ["avertissement_conduite","avertissement_travail","blame","exclusion"].includes(r.type)).length || 0;

                            return (
                                <div key={eleve.id} className={`transition-colors ${isSelected ? "bg-[color-mix(in_srgb,var(--primary-color),transparent_90%)]" : "hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"}`}>
                                    <div className="px-6 py-4 flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleEleve(eleve.id)}
                                            className="w-5 h-5 rounded-md border-gray-300 dark:border-white/20 cursor-pointer"
                                            style={{ accentColor: "var(--primary-color)" }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-tight truncate">
                                                {eleve.nom} {eleve.prenom}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{eleve.MATRICULE || "—"}</p>
                                        </div>
                                        <div className="flex gap-2 items-center shrink-0">
                                            {absH > 0 && (
                                                <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black bg-orange-100 text-orange-700">
                                                    <IconClock />{absH}h
                                                </span>
                                            )}
                                            {retards > 0 && (
                                                <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black bg-yellow-100 text-yellow-700">
                                                    <IconAlert />x{retards}
                                                </span>
                                            )}
                                            {sanctions > 0 && (
                                                <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black bg-red-100 text-red-700">
                                                    <IconBan />x{sanctions}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {eleve.discipline_records && eleve.discipline_records.length > 0 && (
                                        <div className="px-16 pb-4 flex flex-wrap gap-2">
                                            {eleve.discipline_records.map((rec) => (
                                                <div key={rec.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold ${TYPE_COLORS[rec.type] || "bg-gray-100 text-gray-600"}`}>
                                                    <span>{rec.motif || rec.type} — {rec.valeur}{rec.type === "absence" ? "h" : rec.type === "exclusion" ? "j" : "x"}</span>
                                                    <button onClick={() => deleteRecord(rec.id)} className="ml-1 opacity-50 hover:opacity-100 transition-opacity">
                                                        <IconX />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {eleves.length === 0 && (
                            <div className="px-8 py-12 text-center text-gray-400 text-xs font-black uppercase tracking-widest">Aucun eleve dans cette classe.</div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

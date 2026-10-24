import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

const TYPE_LABELS = {
    absence:                { label: "Absence",               color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" },
    retard:                 { label: "Retard",                color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400" },
    avertissement_conduite: { label: "Avert. Conduite",       color: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400" },
    avertissement_travail:  { label: "Avert. Travail",        color: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400" },
    blame:                  { label: "Blâme",                 color: "bg-red-200 text-red-900 dark:bg-red-900/40 dark:text-red-300" },
    exclusion:              { label: "Exclusion temporaire",  color: "bg-black text-white dark:bg-white dark:text-black" },
    felicitation:           { label: "Félicitation",          color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
    encouragement:          { label: "Encouragement",         color: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
};

const IconClock = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const IconAlert = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
);
const IconBan = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
);
const IconSchool = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

export default function Index({ auth, levels = [], records = [], currentSeq, userRole }) {
    const [seq, setSeq] = useState(currentSeq);
    const [callDate, setCallDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSeqChange = (s) => {
        setSeq(s);
        router.get(route("discipline.index"), { seq: s }, { preserveState: true, replace: true });
    };

    const handlePrintDailySheet = (classeId, e) => {
        if (e) e.stopPropagation();
        const url = `${route('attendance.daily_sheet')}?classe_id=${classeId}&date=${callDate}`;
        window.open(url, '_blank');
    };

    const totalAbsences  = records.filter((r) => r.type === "absence").reduce((a, r) => a + r.valeur, 0);
    const totalRetards   = records.filter((r) => r.type === "retard").length;
    const totalSanctions = records.filter((r) => ["avertissement_conduite","avertissement_travail","blame","exclusion"].includes(r.type)).length;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: "var(--primary-color)" }}>Vie Scolaire &amp; Présences</p>
                        <h2 className="font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white leading-tight tracking-tight">Discipline &amp; Contrôle d'Appel</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white dark:bg-white/10 px-3 py-2 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                            <span className="text-[10px] font-black uppercase text-gray-400">Date d'appel :</span>
                            <input
                                type="date"
                                value={callDate}
                                onChange={(e) => setCallDate(e.target.value)}
                                className="bg-transparent border-none p-0 text-xs font-bold text-gray-900 dark:text-white focus:ring-0"
                            />
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Discipline & Présences" />
            <div className="space-y-8 pb-16">

                {/* Selecteur de sequence */}
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Séquence Active :</span>
                    {[1, 2, 3, 4, 5, 6].map((s) => (
                        <button
                            key={s}
                            onClick={() => handleSeqChange(s)}
                            className={`w-10 h-10 rounded-xl text-sm font-black transition-all border ${
                                seq === s
                                    ? "text-white border-transparent shadow-lg"
                                    : "bg-white dark:bg-white/5 text-gray-400 border-gray-100 dark:border-white/10 hover:border-[var(--primary-color)]"
                            }`}
                            style={seq === s ? { backgroundColor: "var(--primary-color)" } : {}}
                        >
                            S{s}
                        </button>
                    ))}
                </div>

                {/* Stats rapides */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        { label: "Heures d'absence",  value: totalAbsences + "h",  Icon: IconClock,  iconColor: "text-orange-500" },
                        { label: "Retards",           value: totalRetards,           Icon: IconAlert,  iconColor: "text-yellow-500" },
                        { label: "Sanctions",         value: totalSanctions,         Icon: IconBan,    iconColor: "text-red-500" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white dark:bg-[var(--dark-bg)] rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-5">
                            <div className={`p-3 rounded-2xl bg-gray-50 dark:bg-white/5 ${stat.iconColor}`}>
                                <stat.Icon />
                            </div>
                            <div>
                                <div className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Classes par niveau avec bouton d'impression d'appel */}
                <div className="space-y-6">
                    {levels.map((level) => (
                        <div key={level.id} className="bg-white dark:bg-[var(--dark-bg)] rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 dark:border-white/5">
                            <div className="px-8 py-5 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight">{level.name}</h3>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{level.classes?.length || 0} classe(s)</p>
                                </div>
                                <span className="px-3 py-1 rounded-lg text-[10px] font-black text-white uppercase tracking-widest" style={{ backgroundColor: "var(--primary-color)" }}>
                                    Niveau {level.order}
                                </span>
                            </div>

                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {level.classes?.map((classe) => (
                                    <div
                                        key={classe.id}
                                        className="group relative flex flex-col justify-between p-5 rounded-2xl bg-gray-50 dark:bg-white/5 hover:shadow-lg border border-gray-100 dark:border-white/5 transition-all"
                                    >
                                        <Link
                                            href={route("discipline.classe", { classe: classe.id, seq })}
                                            className="flex flex-col items-center justify-center gap-2 mb-4"
                                        >
                                            <div className="p-3 rounded-2xl text-[var(--primary-color)]" style={{ backgroundColor: "color-mix(in srgb, var(--primary-color), transparent 88%)" }}>
                                                <IconSchool />
                                            </div>
                                            <span className="text-sm font-black text-center uppercase tracking-tight group-hover:text-[var(--primary-color)] transition-colors">
                                                {classe.nom}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                {classe.eleves_count || 0} élève(s)
                                            </span>
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={(e) => handlePrintDailySheet(classe.id, e)}
                                            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
                                            title="Imprimer la feuille d'appel journalière pour cette classe"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                                            Feuille d'Appel ({callDate})
                                        </button>
                                    </div>
                                ))}

                                {(!level.classes || level.classes.length === 0) && (
                                    <p className="col-span-full text-xs text-gray-400 italic p-4">Aucune classe dans ce niveau.</p>
                                )}
                            </div>
                        </div>
                    ))}

                    {levels.length === 0 && (
                        <div className="py-20 text-center bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-white/10">
                            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Aucun niveau assigné à votre profil.</p>
                        </div>
                    )}
                </div>

                {/* Derniers incidents */}
                {records.length > 0 && (
                    <div className="bg-white dark:bg-[var(--dark-bg)] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                        <div className="px-8 py-5 border-b border-gray-50 dark:border-white/5">
                            <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight">Derniers enregistrements — Séquence {seq}</h3>
                        </div>
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50 dark:border-white/5">
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Élève</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Valeur</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Motif</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                    {records.map((rec) => {
                                        const t = TYPE_LABELS[rec.type] || {};
                                        return (
                                            <tr key={rec.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white text-sm">{rec.eleve?.nom} {rec.eleve?.prenom}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${t.color}`}>{t.label}</span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 text-sm">
                                                    {rec.type === "absence" ? `${rec.valeur}h` : rec.type === "exclusion" ? `${rec.valeur}j` : rec.valeur}
                                                </td>
                                                <td className="px-6 py-4 text-xs text-gray-500 italic">{rec.motif || "—"}</td>
                                                <td className="px-6 py-4 text-xs text-gray-400">{rec.date_incident}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

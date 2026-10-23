<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>Bulletins de Notes — Classe {{ $classe->nom }} — Séquence {{ $sequence }}</title>
@php
    $colors = [
        'emerald'  => ['main' => '#059669', 'light' => '#d1fae5', 'text' => '#065f46'],
        'blue'     => ['main' => '#2563eb', 'light' => '#dbeafe', 'text' => '#1e3a8a'],
        'violet'   => ['main' => '#7c3aed', 'light' => '#ede9fe', 'text' => '#4c1d95'],
        'red'      => ['main' => '#dc2626', 'light' => '#fee2e2', 'text' => '#7f1d1d'],
        'orange'   => ['main' => '#ea580c', 'light' => '#ffedd5', 'text' => '#7c2d12'],
        'teal'     => ['main' => '#0d9488', 'light' => '#ccfbf1', 'text' => '#134e4a'],
        'indigo'   => ['main' => '#4f46e5', 'light' => '#e0e7ff', 'text' => '#312e81'],
        'pink'     => ['main' => '#db2777', 'light' => '#fce7f3', 'text' => '#831843'],
    ];
    $theme = $colors[$school->theme_color ?? 'emerald'] ?? $colors['emerald'];
    $mainColor  = $theme['main'];
    $lightColor = $theme['light'];
    $textColor  = $theme['text'];
@endphp
<style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'DejaVu Sans', Arial, sans-serif; }
    body { font-size: 8.5pt; color: #1a1a2e; line-height: 1.25; }

    /* ── BARRE D'IMPRESSION FLOTTANTE ────────────────────────────────── */
    .no-print-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: #0f172a;
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    .print-btn {
        background: {{ $mainColor }};
        color: white;
        border: none;
        padding: 9px 22px;
        border-radius: 8px;
        font-weight: 800;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    .print-btn:hover { opacity: 0.9; }
    .close-btn {
        background: rgba(255,255,255,0.1);
        color: white;
        border: none;
        padding: 9px 18px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 11px;
        cursor: pointer;
    }

    /* ── IDENTITÉ ÉLÈVE ──────────────────────────────────────────────── */
    .identity-grid {
        display: table;
        width: 100%;
        border: 1px solid {{ $mainColor }};
        border-radius: 4px;
        margin-bottom: 3mm;
    }
    .identity-col { display: table-cell; padding: 1.8mm 3mm; vertical-align: middle; }
    .identity-col-info { width: 43%; border-right: 1px solid {{ $mainColor }}; }
    .identity-col-academic { width: 41%; border-right: 1px solid {{ $mainColor }}; }
    .identity-col-photo { width: 16%; text-align: center; vertical-align: middle; padding: 1.5mm; background: #fafafa; }
    .student-photo-img { width: 22mm; height: 26mm; object-fit: cover; border-radius: 3px; border: 1px solid {{ $mainColor }}; display: inline-block; }
    .student-photo-placeholder { width: 22mm; height: 26mm; border-radius: 3px; border: 1px dashed #cbd5e1; display: inline-block; line-height: 26mm; font-size: 6.5pt; font-weight: bold; color: #94a3b8; background: #f8fafc; text-align: center; text-transform: uppercase; letter-spacing: 0.5px; }
    .identity-label { font-size: 6.5pt; color: #777; text-transform: uppercase; letter-spacing: 0.5px; }
    .identity-value { font-size: 8pt; font-weight: bold; color: #1a1a2e; margin-top: 0.2mm; }

    /* ── STATS BAR ───────────────────────────────────────────────────── */
    .stats-bar {
        display: table;
        width: 100%;
        margin-bottom: 3mm;
        border-collapse: collapse;
    }
    .stat-box {
        display: table-cell;
        text-align: center;
        border: 1.5px solid {{ $mainColor }};
        padding: 1.5mm;
        width: 20%;
    }
    .stat-box:not(:last-child) { border-right: none; }
    .stat-label { font-size: 6pt; color: {{ $textColor }}; text-transform: uppercase; letter-spacing: 0.4px; font-weight: bold; }
    .stat-value { font-size: 10.5pt; font-weight: bold; color: {{ $mainColor }}; margin-top: 0.3mm; }
    .stat-sub { font-size: 6pt; color: #999; }

    /* ── TABLEAU NOTES ───────────────────────────────────────────────── */
    table.notes-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 2.5mm;
        font-size: 7.5pt;
    }
    table.notes-table thead tr {
        background-color: {{ $mainColor }};
        color: white;
    }
    table.notes-table thead th {
        padding: 1.2mm 2mm;
        text-align: center;
        font-size: 6.5pt;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        border: 1px solid {{ $mainColor }};
    }
    table.notes-table thead th:first-child { text-align: left; width: 38%; }
    table.notes-table tbody tr:nth-child(even) { background-color: #f9f9f9; }
    table.notes-table tbody tr.critique-row { background-color: #fff5f5; }
    table.notes-table tbody td {
        padding: 1.1mm 2mm;
        border: 1px solid #e5e7eb;
        text-align: center;
        vertical-align: middle;
    }
    table.notes-table tbody td:first-child { text-align: left; font-weight: 600; }
    table.notes-table tbody td.note-cell { font-weight: bold; font-size: 8pt; }
    table.notes-table tbody td.note-ok { color: #059669; }
    table.notes-table tbody td.note-fail { color: #dc2626; }
    table.notes-table tfoot tr { background: {{ $lightColor }}; }
    table.notes-table tfoot td {
        padding: 1.2mm 2mm;
        border: 1px solid {{ $mainColor }};
        font-weight: bold;
        color: {{ $textColor }};
        font-size: 7.5pt;
    }

    /* ── MATIERES CRITIQUES ──────────────────────────────────────────── */
    .critiques-section {
        border: 1px solid #fca5a5;
        border-radius: 3px;
        background: #fff5f5;
        padding: 1.5mm 3mm;
        margin-bottom: 2.5mm;
    }
    .critiques-title {
        font-size: 6.5pt;
        font-weight: bold;
        color: #b91c1c;
        text-transform: uppercase;
        margin-bottom: 0.5mm;
    }
    .critique-item {
        font-size: 6.5pt;
        color: #7f1d1d;
        margin-bottom: 0.3mm;
    }

    /* ── MENTIONS & SIGNATURES ───────────────────────────────────────── */
    .bottom-grid {
        display: table;
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 2.5mm;
    }
    .bottom-col {
        display: table-cell;
        vertical-align: top;
        border: 1px solid #ddd;
        padding: 1.5mm 3mm;
    }
    .bottom-label { font-size: 6pt; color: #777; text-transform: uppercase; font-weight: bold; margin-bottom: 0.5mm; }
    .bottom-value { font-size: 7pt; font-style: italic; color: #333; }

    .mention-badge {
        display: inline-block;
        padding: 0.5mm 2.5mm;
        border-radius: 2px;
        font-size: 6.5pt;
        font-weight: bold;
        border: 1px solid;
    }
    .mention-active-honor { background: #fef3c7; color: #92400e; border-color: #fbbf24; }
    .mention-active-felicitations { background: {{ $lightColor }}; color: {{ $textColor }}; border-color: {{ $mainColor }}; }
    .mention-active-encouragements { background: #e0f2fe; color: #075985; border-color: #38bdf8; }
    .mention-active-avertissement { background: #fff7ed; color: #9a3412; border-color: #fb923c; }
    .mention-active-blame { background: #fee2e2; color: #7f1d1d; border-color: #f87171; }
    .mention-inactive { background: #f3f4f6; color: #9ca3af; border-color: #e5e7eb; }

    .signatures-row {
        display: table;
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 3px;
        margin-top: 1.5mm;
    }
    .sig-col { display: table-cell; text-align: center; padding: 2mm; width: 33.33%; vertical-align: top; }
    .sig-col:not(:last-child) { border-right: 1px solid #ddd; }
    .sig-label { font-size: 6pt; color: #777; text-transform: uppercase; font-weight: bold; margin-bottom: 2mm; }
    .sig-line { border-top: 1px solid #bbb; margin-top: 5mm; margin-bottom: 0.8mm; }
    .sig-name { font-size: 6pt; color: #555; }

    .footer {
        text-align: center;
        font-size: 5.5pt;
        color: #9ca3af;
        border-top: 1px solid #e5e7eb;
        padding-top: 1.5mm;
        margin-top: 2.5mm;
    }

    /* ── MISE EN PAGE : 1 BULLETIN PAR PAGE A4 ───────────────────────── */
    @media print {
        .no-print { display: none !important; }
        html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
        }
        .bulletin-page {
            width: 100% !important;
            box-sizing: border-box !important;
            padding: 8mm 10mm 6mm 10mm !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            break-after: page !important;
            break-inside: avoid !important;
        }
        .bulletin-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
        }
        @page {
            size: A4 portrait;
            margin: 0;
        }
    }

    @media screen {
        body {
            background: #f1f5f9;
            padding-top: 75px;
            padding-bottom: 40px;
        }
        .bulletin-page {
            max-width: 210mm;
            min-height: 297mm;
            margin: 0 auto 30px auto;
            background: white;
            padding: 10mm 12mm;
            box-shadow: 0 4px 25px rgba(0,0,0,0.08);
            border-radius: 8px;
        }
    }
</style>
</head>
<body>

<!-- BARRE DE COMMANDE SUPÉRIEURE (NON IMPRIMÉE) -->
<div class="no-print no-print-bar">
    <div style="display:flex;align-items:center;gap:14px;">
        <span style="font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:1px;">
            Impression des Bulletins — Classe : {{ $classe->nom }} (Séquence {{ $sequence }})
        </span>
        <span style="background:rgba(255,255,255,0.15);padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800;">
            {{ count($reports) }} élève(s) — 1 bulletin par page A4
        </span>
    </div>
    <div style="display:flex;gap:10px;">
        <button onclick="window.print()" class="print-btn">
            🖨️ Imprimer Toute la Classe (Multi-pages)
        </button>
        <button onclick="window.close()" class="close-btn">
            Fermer
        </button>
    </div>
</div>

{{-- ═════════════════════════════════════════════════════════════════════════ --}}
{{-- BOUCLE SUR CHAQUE ÉLÈVE : CHAQUE ITÉRATION = 1 PAGE A4 EXACTE             --}}
{{-- ═════════════════════════════════════════════════════════════════════════ --}}
@forelse($reports as $rep)
@php
    $student            = $rep['student'];
    $notes              = $rep['notes'];
    $matieres_critiques = $rep['matieres_critiques'];
    $discipline         = $rep['discipline'];
    $moyenne_eleve      = $rep['moyenne_eleve'];
    $rang               = $rep['rang'];
    $effectif_total     = $rep['effectif_total'];
    $moyenne_classe     = $rep['moyenne_classe'];
    $moyenne_premier    = $rep['moyenne_premier'];
    $moyenne_dernier    = $rep['moyenne_dernier'];
    $taux_reussite      = $rep['taux_reussite'];
    $prof_principal     = $rep['prof_principal'];
    $classe_info        = $rep['classe_info'];
@endphp

<div class="bulletin-page">

    {{-- EN-TÊTE OFFICIEL MINESEC (3 colonnes bilingue conforme) --}}
    @include('partials.official-header', [
        'school'           => $school,
        'documentTitle'    => 'BULLETIN DE NOTES — SÉQUENCE ' . $sequence,
        'documentSubtitle' => 'ANNÉE ACADÉMIQUE ' . ($classe_info['annee_academique'] ?? ($school->academic_year ?? '2025/2026')) . ' — CLASSE : ' . ($classe->nom ?? ''),
        'themeColor'       => $mainColor,
    ])

    @php
        $studentPhotoSrc = null;
        $rawPhoto = $student->photo_path ?? null;
        if ($rawPhoto) {
            if (str_starts_with($rawPhoto, 'http://') || str_starts_with($rawPhoto, 'https://')) {
                $studentPhotoSrc = $rawPhoto;
            } else {
                $cleanPath = ltrim(preg_replace('#^storage/#', '', $rawPhoto), '/');
                $candidates = [
                    storage_path('app/public/' . $cleanPath),
                    public_path('storage/' . $cleanPath),
                    public_path($cleanPath),
                ];
                foreach ($candidates as $filePath) {
                    if (file_exists($filePath) && is_file($filePath)) {
                        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
                        $mime = in_array($ext, ['jpg', 'jpeg']) ? 'image/jpeg' : 'image/' . $ext;
                        $studentPhotoSrc = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($filePath));
                        break;
                    }
                }
                if (!$studentPhotoSrc) {
                    $studentPhotoSrc = asset('storage/' . $cleanPath);
                }
            }
        }
    @endphp
    {{-- IDENTITÉ DE L'ÉLÈVE --}}
    <div class="identity-grid">
        <div class="identity-col identity-col-info">
            <div class="identity-label">Nom et Prénom(s)</div>
            <div class="identity-value">{{ strtoupper($student->nom) }} {{ $student->prenom }}</div>

            <div style="margin-top: 1.5mm;">
                <div class="identity-label">Matricule</div>
                <div class="identity-value" style="font-family: monospace;">{{ $student->MATRICULE ?? '—' }}</div>
            </div>

            <div style="margin-top: 1.5mm;">
                <div class="identity-label">Sexe</div>
                <div class="identity-value">{{ $student->sexe === 'F' ? 'Féminin (F)' : ($student->sexe === 'M' ? 'Masculin (M)' : '—') }}</div>
            </div>
        </div>

        <div class="identity-col identity-col-academic">
            <div class="identity-label">Classe &amp; Statut</div>
            <div class="identity-value">
                {{ $classe_info['nom'] }}
                @if(!empty($classe_info['section'])) ({{ strtoupper($classe_info['section']) }}) @endif
                — <span style="font-size:7pt; color:#555;">{{ $student->redoublant ? 'Redoublant' : 'Nouveau' }}</span>
            </div>

            <div style="margin-top: 1.5mm;">
                <div class="identity-label">Date de Naissance</div>
                <div class="identity-value">
                    {{ $student->date_naissance ? \Carbon\Carbon::parse($student->date_naissance)->format('d/m/Y') : '—' }}
                    @if($student->lieu_naissance) à {{ $student->lieu_naissance }} @endif
                </div>
            </div>

            <div style="margin-top: 1.5mm;">
                <div class="identity-label">Professeur Principal</div>
                <div class="identity-value">{{ $prof_principal['name'] ?? 'Non assigné' }}</div>
            </div>
        </div>

        <div class="identity-col identity-col-photo">
            @if($studentPhotoSrc)
                <img src="{{ $studentPhotoSrc }}" alt="Photo élève" class="student-photo-img" />
            @else
                <div class="student-photo-placeholder">PHOTO</div>
            @endif
        </div>
    </div>

    {{-- STATISTIQUES RAPIDES DE CLASSE --}}
    <div class="stats-bar">
        <div class="stat-box">
            <div class="stat-label">Moyenne</div>
            <div class="stat-value" style="{{ $moyenne_eleve !== null && $moyenne_eleve >= 10 ? 'color:#059669' : 'color:#dc2626' }}">
                {{ $moyenne_eleve !== null ? number_format($moyenne_eleve, 2) : '—' }}/20
            </div>
            <div class="stat-sub">de l'élève</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">Rang</div>
            <div class="stat-value">{{ $rang ?? '—' }}<span style="font-size:7.5pt;">@if($rang) /{{ $effectif_total }}@endif</span></div>
            <div class="stat-sub">sur {{ $effectif_total }} élèves</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">1er de classe</div>
            <div class="stat-value" style="font-size:9.5pt;">{{ $moyenne_premier !== null ? number_format($moyenne_premier, 2) : '—' }}</div>
            <div class="stat-sub">/20</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">Dernier de salle</div>
            <div class="stat-value" style="font-size:9.5pt;">{{ $moyenne_dernier !== null ? number_format($moyenne_dernier, 2) : '—' }}</div>
            <div class="stat-sub">/20</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">Moy. Classe</div>
            <div class="stat-value" style="font-size:9.5pt;">{{ $moyenne_classe !== null ? number_format($moyenne_classe, 2) : '—' }}</div>
            <div class="stat-sub">Réussite: {{ $taux_reussite }}%</div>
        </div>
    </div>

    {{-- TABLEAU DES NOTES --}}
    <table class="notes-table">
        <thead>
            <tr>
                <th style="text-align:left;">Matière / Discipline</th>
                <th>Coef.</th>
                <th>Note /20</th>
                <th>Note×Coef</th>
                <th>Appréciation</th>
            </tr>
        </thead>
        <tbody>
            @php $totalCoef = 0; $totalNoteCoef = 0; @endphp
            @foreach($notes as $note)
            @php
                if ($note['note'] !== null) {
                    $totalCoef += $note['coef'];
                    $totalNoteCoef += $note['note_coef'];
                }
            @endphp
            <tr class="{{ $note['critique'] ? 'critique-row' : '' }}">
                <td>
                    {{ $note['nom'] }}
                    @if($note['critique']) <span style="color:#dc2626; font-size:6.5pt;">⚠</span> @endif
                </td>
                <td>{{ $note['coef'] }}</td>
                <td class="note-cell {{ $note['note'] !== null ? ($note['critique'] ? 'note-fail' : 'note-ok') : '' }}">
                    {{ $note['note'] !== null ? number_format($note['note'], 2) : '—' }}
                </td>
                <td>{{ $note['note_coef'] !== null ? number_format($note['note_coef'], 2) : '—' }}</td>
                <td style="font-size: 7pt;">{{ $note['appreciation'] ?? '—' }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td><strong>TOTAL / MOYENNES</strong></td>
                <td>{{ $totalCoef }}</td>
                <td>
                    @if($moyenne_eleve !== null)
                        <strong>{{ number_format($moyenne_eleve, 2) }}/20</strong>
                    @else —
                    @endif
                </td>
                <td>{{ number_format($totalNoteCoef, 2) }}</td>
                <td>
                    @if($moyenne_eleve !== null)
                        @if($moyenne_eleve >= 16) <strong>Très Bien</strong>
                        @elseif($moyenne_eleve >= 14) <strong>Bien</strong>
                        @elseif($moyenne_eleve >= 12) <strong>Assez Bien</strong>
                        @elseif($moyenne_eleve >= 10) <strong>Passable</strong>
                        @else <strong style="color:#dc2626;">Insuffisant</strong>
                        @endif
                    @else —
                    @endif
                </td>
            </tr>
        </tfoot>
    </table>

    {{-- MATIÈRES CRITIQUES --}}
    @if(count($matieres_critiques) > 0)
    <div class="critiques-section">
        <div class="critiques-title">⚠ Matières nécessitant des efforts particuliers</div>
        @foreach($matieres_critiques as $mat)
        <div class="critique-item">
            → <strong>{{ $mat['nom'] }}</strong> : {{ $mat['note'] !== null ? number_format($mat['note'], 2) : '—' }}/20 — Effort insuffisant.
        </div>
        @endforeach
    </div>
    @endif

    {{-- DISCIPLINE & ASSIDUITÉ --}}
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 2.5mm; font-size: 7pt; border: 1.5px solid {{ $mainColor }};">
        <thead>
            <tr style="background-color: {{ $lightColor }};">
                <th colspan="6" style="padding: 1.2mm 2.5mm; text-align: left; font-size: 6.5pt; text-transform: uppercase; color: {{ $textColor }}; border-bottom: 1px solid {{ $mainColor }};">
                    Discipline &amp; Assiduité — Séquence {{ $sequence }}
                </th>
            </tr>
            <tr style="background-color: #f8fafc; font-size: 6pt; text-transform: uppercase; color: #555;">
                <th style="padding: 1mm; border-right: 1px solid #e2e8f0; text-align: center; width: 18%;">Absences</th>
                <th style="padding: 1mm; border-right: 1px solid #e2e8f0; text-align: center; width: 16%;">Retards</th>
                <th style="padding: 1mm; border-right: 1px solid #e2e8f0; text-align: center; width: 16%;">Avertissements</th>
                <th style="padding: 1mm; border-right: 1px solid #e2e8f0; text-align: center; width: 16%;">Blâmes</th>
                <th style="padding: 1mm; border-right: 1px solid #e2e8f0; text-align: center; width: 16%;">Exclusions</th>
                <th style="padding: 1mm; text-align: center; width: 18%;">Conduite</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding: 1.2mm; border-right: 1px solid #e2e8f0; text-align: center; font-weight: bold; {{ ($discipline['absences'] ?? 0) > 0 ? 'color:#dc2626;' : 'color:#059669;' }}">
                    {{ $discipline['absences'] ?? 0 }} h
                </td>
                <td style="padding: 1.2mm; border-right: 1px solid #e2e8f0; text-align: center; font-weight: bold;">
                    {{ $discipline['retards'] ?? 0 }}
                </td>
                <td style="padding: 1.2mm; border-right: 1px solid #e2e8f0; text-align: center; font-weight: bold; {{ ($discipline['avertissements'] ?? 0) > 0 ? 'color:#dc2626;' : '' }}">
                    {{ $discipline['avertissements'] ?? 0 }}
                </td>
                <td style="padding: 1.2mm; border-right: 1px solid #e2e8f0; text-align: center; font-weight: bold; {{ ($discipline['blames'] ?? 0) > 0 ? 'color:#dc2626;' : '' }}">
                    {{ $discipline['blames'] ?? 0 }}
                </td>
                <td style="padding: 1.2mm; border-right: 1px solid #e2e8f0; text-align: center; font-weight: bold; {{ ($discipline['exclusions'] ?? 0) > 0 ? 'color:#dc2626;' : '' }}">
                    {{ $discipline['exclusions'] ?? 0 }} j
                </td>
                <td style="padding: 1.2mm; text-align: center; font-weight: bold; {{ in_array($discipline['conduite'] ?? '', ['Mauvaise', 'Passable']) ? 'color:#dc2626;' : 'color:#059669;' }}">
                    {{ $discipline['conduite'] ?? 'Bonne' }}
                </td>
            </tr>
        </tbody>
    </table>

    {{-- MENTIONS ET OBSERVATIONS --}}
    <div class="bottom-grid">
        <div class="bottom-col" style="width:60%;">
            <div class="bottom-label">Observations du Professeur Principal</div>
            <div class="bottom-value">
                @if($moyenne_eleve !== null)
                    @if($moyenne_eleve >= 16) Excellent travail, continuez ainsi !
                    @elseif($moyenne_eleve >= 14) Bon travail, résultats très satisfaisants.
                    @elseif($moyenne_eleve >= 12) Travail convenable, peut encore progresser.
                    @elseif($moyenne_eleve >= 10) Résultats moyens, redoubler d'efforts.
                    @else Résultats insuffisants. Travail soutenu indispensable.
                    @endif
                @else Notes non complètes.
                @endif
            </div>
        </div>
        <div class="bottom-col" style="width:40%; border-left: 1px solid #ddd;">
            <div class="bottom-label">Mention / Distinction</div>
            <div style="margin-top: 1mm;">
                @if($moyenne_eleve !== null)
                    @if($moyenne_eleve >= 16)
                        <span class="mention-badge mention-active-felicitations">🏅 Félicitations</span>
                    @elseif($moyenne_eleve >= 14)
                        <span class="mention-badge mention-active-honor">🌟 Tableau d'Honneur</span>
                    @elseif($moyenne_eleve >= 12)
                        <span class="mention-badge mention-active-encouragements">👍 Encouragements</span>
                    @elseif($moyenne_eleve >= 10)
                        <span class="mention-badge mention-inactive">— Aucune</span>
                    @elseif($moyenne_eleve >= 8)
                        <span class="mention-badge mention-active-avertissement">⚠ Avertissement</span>
                    @else
                        <span class="mention-badge mention-active-blame">🚫 Blâme</span>
                    @endif
                @else
                    <span class="mention-badge mention-inactive">— En attente</span>
                @endif
            </div>
        </div>
    </div>

    {{-- SIGNATURES --}}
    <div class="signatures-row">
        <div class="sig-col">
            <div class="sig-label">Le Professeur Principal</div>
            <div class="sig-line"></div>
            <div class="sig-name">{{ $prof_principal['name'] ?? '________________________' }}</div>
        </div>
        <div class="sig-col">
            <div class="sig-label">Le Proviseur / Principal</div>
            <div class="sig-line"></div>
            <div class="sig-name">Signature &amp; Cachet</div>
        </div>
        <div class="sig-col">
            <div class="sig-label">Signature du Parent / Tuteur</div>
            <div class="sig-line"></div>
            <div class="sig-name">Lu et approuvé</div>
        </div>
    </div>

    {{-- FOOTER --}}
    <div class="footer">
        {{ $school->name }} &nbsp;|&nbsp;
        Bulletin séquentiel généré le {{ now()->format('d/m/Y à H:i') }} &nbsp;|&nbsp;
        Document officiel – 1 élève par page
    </div>

</div>
@empty
<div style="text-align:center;padding:100px 20px;font-family:sans-serif;">
    <h2 style="font-size:20px;color:#64748b;">Aucun élève trouvé dans cette classe.</h2>
</div>
@endforelse

</body>
</html>

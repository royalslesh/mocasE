<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>Bulletin - {{ $student->nom }} {{ $student->prenom }} - Séquence {{ $sequence }}</title>
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
    $theme = $colors[$school['theme_color'] ?? 'emerald'] ?? $colors['emerald'];
    $mainColor  = $theme['main'];
    $lightColor = $theme['light'];
    $textColor  = $theme['text'];

    // Résolution robuste de la photo de l'élève
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
<style>
    @page { margin: 10mm 12mm 10mm 12mm; size: A4 portrait; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'DejaVu Sans', Arial, sans-serif; }
    body { font-size: 9pt; color: #1a1a2e; line-height: 1.3; }

    /* ── EN-TÊTE ──────────────────────────────────────────────── */
    .header-wrapper {
        border: 2.5px solid {{ $mainColor }};
        border-radius: 4px;
        margin-bottom: 5mm;
        overflow: hidden;
    }
    .header-top {
        background-color: {{ $mainColor }};
        color: white;
        padding: 2mm 4mm;
        display: table;
        width: 100%;
    }
    .header-top-left, .header-top-right { display: table-cell; vertical-align: middle; width: 33%; }
    .header-top-center { display: table-cell; vertical-align: middle; width: 34%; text-align: center; }
    .republic-title { font-size: 7.5pt; font-weight: bold; text-align: center; line-height: 1.4; }
    .republic-sub { font-size: 6.5pt; text-align: center; font-style: italic; }
    .school-logo { max-height: 22mm; max-width: 28mm; display: block; margin: 0 auto; }
    .logo-placeholder {
        width: 22mm; height: 22mm; border-radius: 50%;
        background: rgba(255,255,255,0.2);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto; font-size: 7pt; color: white; text-align: center; line-height: 1.2;
    }

    .header-school {
        background: {{ $lightColor }};
        padding: 2mm 4mm;
        text-align: center;
    }
    .school-name { font-size: 11pt; font-weight: bold; color: {{ $textColor }}; text-transform: uppercase; letter-spacing: 1px; }
    .school-sub { font-size: 7.5pt; color: #555; margin-top: 0.5mm; }

    .bulletin-title-bar {
        background: {{ $mainColor }};
        color: white;
        padding: 1.5mm 4mm;
        text-align: center;
        font-size: 10pt;
        font-weight: bold;
        letter-spacing: 2px;
        text-transform: uppercase;
    }

    /* ── IDENTITÉ ÉLÈVE ──────────────────────────────────────── */
    .identity-grid {
        display: table;
        width: 100%;
        border: 1px solid {{ $mainColor }};
        border-radius: 4px;
        margin-bottom: 4mm;
    }
    .identity-col { display: table-cell; padding: 2mm 3mm; vertical-align: middle; }
    .identity-col-info { width: 43%; border-right: 1px solid {{ $mainColor }}; }
    .identity-col-academic { width: 41%; border-right: 1px solid {{ $mainColor }}; }
    .identity-col-photo { width: 16%; text-align: center; vertical-align: middle; padding: 1.5mm; background: #fafafa; }
    .student-photo-img {
        width: 22mm;
        height: 26mm;
        object-fit: cover;
        border-radius: 3px;
        border: 1px solid {{ $mainColor }};
        display: inline-block;
    }
    .student-photo-placeholder {
        width: 22mm;
        height: 26mm;
        border-radius: 3px;
        border: 1px dashed #cbd5e1;
        display: inline-block;
        line-height: 26mm;
        font-size: 6.5pt;
        font-weight: bold;
        color: #94a3b8;
        background: #f8fafc;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .identity-label { font-size: 7pt; color: #777; text-transform: uppercase; letter-spacing: 0.5px; }
    .identity-value { font-size: 8.5pt; font-weight: bold; color: #1a1a2e; margin-top: 0.3mm; }

    /* ── SECTION STATS RAPIDES ───────────────────────────────── */
    .stats-bar {
        display: table;
        width: 100%;
        margin-bottom: 4mm;
        border-collapse: collapse;
    }
    .stat-box {
        display: table-cell;
        text-align: center;
        border: 1.5px solid {{ $mainColor }};
        padding: 2mm;
        width: 20%;
    }
    .stat-box:not(:last-child) { border-right: none; }
    .stat-label { font-size: 6.5pt; color: {{ $textColor }}; text-transform: uppercase; letter-spacing: 0.4px; font-weight: bold; }
    .stat-value { font-size: 12pt; font-weight: bold; color: {{ $mainColor }}; margin-top: 0.5mm; }
    .stat-sub { font-size: 6.5pt; color: #999; }

    /* ── TABLEAU DES NOTES ───────────────────────────────────── */
    table.notes-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 3mm;
        font-size: 8pt;
    }
    table.notes-table thead tr {
        background-color: {{ $mainColor }};
        color: white;
    }
    table.notes-table thead th {
        padding: 1.5mm 2mm;
        text-align: center;
        font-size: 7pt;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        border: 1px solid {{ $mainColor }};
    }
    table.notes-table thead th:first-child { text-align: left; width: 38%; }
    table.notes-table tbody tr:nth-child(even) { background-color: #f9f9f9; }
    table.notes-table tbody tr.critique-row { background-color: #fff5f5; }
    table.notes-table tbody td {
        padding: 1.5mm 2mm;
        border: 1px solid #e5e7eb;
        text-align: center;
        vertical-align: middle;
    }
    table.notes-table tbody td:first-child { text-align: left; font-weight: 600; }
    table.notes-table tbody td.note-cell { font-weight: bold; font-size: 9pt; }
    table.notes-table tbody td.note-ok { color: #059669; }
    table.notes-table tbody td.note-fail { color: #dc2626; }
    table.notes-table tfoot tr { background: {{ $lightColor }}; }
    table.notes-table tfoot td {
        padding: 1.5mm 2mm;
        border: 1px solid {{ $mainColor }};
        font-weight: bold;
        font-size: 8pt;
        color: {{ $textColor }};
        text-align: center;
    }
    table.notes-table tfoot td:first-child { text-align: left; }

    /* ── MATIÈRES CRITIQUES ──────────────────────────────────── */
    .critiques-section {
        border: 1.5px solid #fca5a5;
        border-radius: 3px;
        background: #fff5f5;
        padding: 2mm 3mm;
        margin-bottom: 3mm;
    }
    .critiques-title { font-size: 7.5pt; font-weight: bold; color: #b91c1c; text-transform: uppercase; margin-bottom: 1mm; }
    .critique-item { font-size: 7.5pt; color: #7f1d1d; margin-bottom: 0.5mm; }

    /* ── MENTIONS ET OBSERVATIONS ────────────────────────────── */
    .bottom-grid {
        display: table;
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 3mm;
    }
    .bottom-col { display: table-cell; vertical-align: top; border: 1px solid #ddd; padding: 2mm 3mm; }
    .bottom-col:not(:last-child) { border-right: none; }
    .bottom-label { font-size: 6.5pt; color: #777; text-transform: uppercase; font-weight: bold; margin-bottom: 1mm; }
    .bottom-value { font-size: 8pt; font-style: italic; color: #333; min-height: 8mm; }

    /* ── MENTIONS ────────────────────────────────────────────── */
    .mentions-row { display: table; width: 100%; margin-bottom: 3mm; }
    .mention-badge {
        display: inline-block;
        padding: 1mm 3mm;
        border-radius: 3px;
        font-size: 7.5pt;
        font-weight: bold;
        margin-right: 1mm;
        border: 1px solid;
    }
    .mention-active-honor { background: #fef3c7; color: #92400e; border-color: #fbbf24; }
    .mention-active-felicitations { background: {{ $lightColor }}; color: {{ $textColor }}; border-color: {{ $mainColor }}; }
    .mention-active-encouragements { background: #e0f2fe; color: #075985; border-color: #38bdf8; }
    .mention-active-avertissement { background: #fff7ed; color: #9a3412; border-color: #fb923c; }
    .mention-active-blame { background: #fee2e2; color: #7f1d1d; border-color: #f87171; }
    .mention-inactive { background: #f3f4f6; color: #9ca3af; border-color: #e5e7eb; }

    /* ── SIGNATURES ──────────────────────────────────────────── */
    .signatures-row {
        display: table;
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 3px;
        margin-top: 3mm;
    }
    .sig-col { display: table-cell; text-align: center; padding: 3mm; width: 33.33%; vertical-align: top; }
    .sig-col:not(:last-child) { border-right: 1px solid #ddd; }
    .sig-label { font-size: 6.5pt; color: #777; text-transform: uppercase; font-weight: bold; margin-bottom: 4mm; }
    .sig-line { border-top: 1px solid #bbb; margin-top: 8mm; margin-bottom: 1mm; }
    .sig-name { font-size: 6.5pt; color: #555; }

    /* ── FOOTER ──────────────────────────────────────────────── */
    .footer {
        text-align: center;
        font-size: 6.5pt;
        color: #9ca3af;
        border-top: 1px solid #e5e7eb;
        padding-top: 2mm;
        margin-top: 4mm;
    }
    .badge-sequence {
        display: inline-block;
        background: {{ $mainColor }};
        color: white;
        padding: 0.5mm 3mm;
        border-radius: 2px;
        font-size: 7pt;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    @media print {
        .no-print { display: none !important; }
        body { margin: 0; padding: 0; background: white; }
    }
    @media screen {
        body { background: #f3f4f6; padding: 20px 0; }
        .page-container { max-width: 210mm; margin: 0 auto; background: white; padding: 10mm 12mm; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 8px; }
        .print-bar { max-width: 210mm; margin: 0 auto 15px auto; display: flex; justify-content: space-between; align-items: center; background: white; padding: 12px 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .print-btn { background: {{ $mainColor }}; color: white; border: none; padding: 8px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px; display: inline-flex; align-items: center; gap: 8px; }
        .print-btn:hover { opacity: 0.9; }
    }
</style>
</head>
<body>

<div class="no-print print-bar">
    <div>
        <strong>Aperçu Impression / Export PDF</strong>
        <span style="color:#666; font-size:12px; margin-left:10px;">(Pour sauvegarder en PDF, choisissez "Enregistrer au format PDF" dans la boîte de dialogue d'impression)</span>
    </div>
    <button onclick="window.print()" class="print-btn">
        🖨️ Imprimer / Enregistrer en PDF
    </button>
</div>

<div class="page-container">
@include('partials.official-header', [
    'school'           => $school,
    'documentTitle'    => 'BULLETIN DE NOTES — SÉQUENCE ' . $sequence,
    'documentSubtitle' => 'ANNÉE ACADÉMIQUE ' . ($classe_info['annee_academique'] ?? ($school['academic_year'] ?? '2025/2026')) . ' — CLASSE : ' . ($classe_info['nom'] ?? ''),
    'themeColor'       => $mainColor,
])

{{-- ═══════════════════════════════════════════════════════════════════════ --}}
{{-- IDENTITÉ DE L'ÉLÈVE --}}
{{-- ═══════════════════════════════════════════════════════════════════════ --}}
<div class="identity-grid">
    <div class="identity-col identity-col-info">
        <div class="identity-label">Nom et Prénom(s)</div>
        <div class="identity-value">{{ strtoupper($student->nom) }} {{ $student->prenom }}</div>

        <div style="margin-top: 2mm;">
            <div class="identity-label">Matricule</div>
            <div class="identity-value" style="font-family: monospace;">{{ $student->MATRICULE ?? '—' }}</div>
        </div>

        <div style="margin-top: 2mm;">
            <div class="identity-label">Sexe</div>
            <div class="identity-value">{{ $student->sexe === 'M' ? 'Masculin' : ($student->sexe === 'F' ? 'Féminin' : '—') }}</div>
        </div>
    </div>

    <div class="identity-col identity-col-academic">
        <div class="identity-label">Classe / Salle</div>
        <div class="identity-value">{{ $classe_info['nom'] ?? '—' }}
            @if(!empty($classe_info['section'])) &nbsp;<small style="font-weight:normal;color:#555;">({{ $classe_info['section'] }})</small> @endif
        </div>

        <div style="margin-top: 2mm;">
            <div class="identity-label">Date de Naissance</div>
            <div class="identity-value">
                {{ $student->date_naissance ? \Carbon\Carbon::parse($student->date_naissance)->format('d/m/Y') : '—' }}
                @if($student->lieu_naissance) à {{ $student->lieu_naissance }} @endif
            </div>
        </div>

        <div style="margin-top: 2mm;">
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

{{-- ═══════════════════════════════════════════════════════════════════════ --}}
{{-- STATISTIQUES RAPIDES DE CLASSE --}}
{{-- ═══════════════════════════════════════════════════════════════════════ --}}
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
        <div class="stat-value">{{ $rang ?? '—' }}<span style="font-size:8pt;">@if($rang) /{{ $effectif_total }}@endif</span></div>
        <div class="stat-sub">sur {{ $effectif_total }} élèves</div>
    </div>
    <div class="stat-box">
        <div class="stat-label">1er de classe</div>
        <div class="stat-value" style="font-size:10pt;">{{ $moyenne_premier !== null ? number_format($moyenne_premier, 2) : '—' }}</div>
        <div class="stat-sub">/20</div>
    </div>
    <div class="stat-box">
        <div class="stat-label">Dernier de salle</div>
        <div class="stat-value" style="font-size:10pt;">{{ $moyenne_dernier !== null ? number_format($moyenne_dernier, 2) : '—' }}</div>
        <div class="stat-sub">/20</div>
    </div>
    <div class="stat-box">
        <div class="stat-label">Moy. Classe</div>
        <div class="stat-value" style="font-size:10pt;">{{ $moyenne_classe !== null ? number_format($moyenne_classe, 2) : '—' }}</div>
        <div class="stat-sub">Réussite: {{ $taux_reussite }}%</div>
    </div>
</div>

{{-- ═══════════════════════════════════════════════════════════════════════ --}}
{{-- TABLEAU DES NOTES --}}
{{-- ═══════════════════════════════════════════════════════════════════════ --}}
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
        @php
            $totalCoef = 0;
            $totalNoteCoef = 0;
            $groupedNotes = collect($notes)->groupBy(function($n) {
                return !empty($n['groupe']) ? $n['groupe'] : 'Matières Générales';
            });
        @endphp
        @foreach($groupedNotes as $groupeNom => $groupeList)
            <tr style="background: {{ $lightColor }}; font-weight: bold;">
                <td colspan="5" style="padding: 2mm 3mm; font-size: 7.5pt; color: {{ $textColor }}; text-transform: uppercase; letter-spacing: 0.5px;">
                    ❖ {{ $groupeNom }}
                </td>
            </tr>
            @foreach($groupeList as $note)
            @php
                if ($note['note'] !== null) {
                    $totalCoef += $note['coef'];
                    $totalNoteCoef += $note['note_coef'];
                }
            @endphp
            <tr class="{{ $note['critique'] ? 'critique-row' : '' }}">
                <td style="padding-left: 4mm;">
                    {{ $note['nom'] }}
                    @if($note['critique']) <span style="color:#dc2626; font-size:7pt;">⚠</span> @endif
                </td>
                <td>{{ $note['coef'] }}</td>
                <td class="note-cell {{ $note['note'] !== null ? ($note['critique'] ? 'note-fail' : 'note-ok') : '' }}">
                    {{ $note['note'] !== null ? number_format($note['note'], 2) : '—' }}
                </td>
                <td>{{ $note['note_coef'] !== null ? number_format($note['note_coef'], 2) : '—' }}</td>
                <td style="font-size: 7.5pt;">{{ $note['appreciation'] ?? '—' }}</td>
            </tr>
            @endforeach
        @endforeach
    </tbody>
    <tfoot>
        <tr>
            <td><strong>TOTAL / MOYENNES</strong></td>
            <td>{{ $totalCoef }}</td>
            <td colspan="1">
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

{{-- ═══════════════════════════════════════════════════════════════════════ --}}
{{-- MATIÈRES CRITIQUES --}}
{{-- ═══════════════════════════════════════════════════════════════════════ --}}
@if(count($matieres_critiques) > 0)
<div class="critiques-section">
    <div class="critiques-title">⚠ Matières nécessitant des efforts particuliers</div>
    @foreach($matieres_critiques as $mat)
    <div class="critique-item">
        → <strong>{{ $mat['nom'] }}</strong> : {{ $mat['note'] !== null ? number_format($mat['note'], 2) : '—' }}/20
        — Effort insuffisant, note en dessous de la moyenne.
    </div>
    @endforeach
</div>
@endif

{{-- ═══════════════════════════════════════════════════════════════════════ --}}
{{-- DISCIPLINE & ASSIDUITÉ --}}
{{-- ═══════════════════════════════════════════════════════════════════════ --}}
<table style="width: 100%; border-collapse: collapse; margin-bottom: 3.5mm; font-size: 7.5pt; border: 1.5px solid {{ $mainColor }};">
    <thead>
        <tr style="background-color: {{ $lightColor }};">
            <th colspan="6" style="padding: 1.5mm 3mm; text-align: left; font-size: 7pt; text-transform: uppercase; color: {{ $textColor }}; border-bottom: 1px solid {{ $mainColor }};">
                Discipline &amp; Assiduité — Séquence {{ $sequence }}
            </th>
        </tr>
        <tr style="background-color: #f8fafc; font-size: 6.5pt; text-transform: uppercase; color: #555;">
            <th style="padding: 1.2mm; border-right: 1px solid #e2e8f0; text-align: center; width: 18%;">Absences</th>
            <th style="padding: 1.2mm; border-right: 1px solid #e2e8f0; text-align: center; width: 16%;">Retards</th>
            <th style="padding: 1.2mm; border-right: 1px solid #e2e8f0; text-align: center; width: 16%;">Avertissements</th>
            <th style="padding: 1.2mm; border-right: 1px solid #e2e8f0; text-align: center; width: 16%;">Blâmes</th>
            <th style="padding: 1.2mm; border-right: 1px solid #e2e8f0; text-align: center; width: 16%;">Exclusions</th>
            <th style="padding: 1.2mm; text-align: center; width: 18%;">Conduite</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="padding: 1.8mm; border-right: 1px solid #e2e8f0; text-align: center; font-weight: bold; {{ ($discipline['absences'] ?? 0) > 0 ? 'color:#dc2626;' : 'color:#059669;' }}">
                {{ $discipline['absences'] ?? 0 }} h
            </td>
            <td style="padding: 1.8mm; border-right: 1px solid #e2e8f0; text-align: center; font-weight: bold;">
                {{ $discipline['retards'] ?? 0 }}
            </td>
            <td style="padding: 1.8mm; border-right: 1px solid #e2e8f0; text-align: center; font-weight: bold; {{ ($discipline['avertissements'] ?? 0) > 0 ? 'color:#dc2626;' : '' }}">
                {{ $discipline['avertissements'] ?? 0 }}
            </td>
            <td style="padding: 1.8mm; border-right: 1px solid #e2e8f0; text-align: center; font-weight: bold; {{ ($discipline['blames'] ?? 0) > 0 ? 'color:#dc2626;' : '' }}">
                {{ $discipline['blames'] ?? 0 }}
            </td>
            <td style="padding: 1.8mm; border-right: 1px solid #e2e8f0; text-align: center; font-weight: bold; {{ ($discipline['exclusions'] ?? 0) > 0 ? 'color:#dc2626;' : '' }}">
                {{ $discipline['exclusions'] ?? 0 }} j
            </td>
            <td style="padding: 1.8mm; text-align: center; font-weight: bold; {{ in_array($discipline['conduite'] ?? '', ['Mauvaise', 'Passable']) ? 'color:#dc2626;' : 'color:#059669;' }}">
                {{ $discipline['conduite'] ?? 'Bonne' }}
            </td>
        </tr>
    </tbody>
</table>

{{-- ═══════════════════════════════════════════════════════════════════════ --}}
{{-- MENTIONS ET OBSERVATIONS --}}
{{-- ═══════════════════════════════════════════════════════════════════════ --}}
<div class="bottom-grid">
    <div class="bottom-col" style="width:60%;">
        <div class="bottom-label">Observations du Professeur Principal</div>
        <div class="bottom-value">
            @if($moyenne_eleve !== null)
                @if($moyenne_eleve >= 16) Excellent travail, continuez ainsi !
                @elseif($moyenne_eleve >= 14) Bon trimestre, de bons résultats.
                @elseif($moyenne_eleve >= 12) Travail satisfaisant, peut encore progresser.
                @elseif($moyenne_eleve >= 10) Résultats acceptables, des efforts sont nécessaires.
                @else Résultats insuffisants. Un effort soutenu est indispensable.
                @endif
            @else
                Notes non encore saisies.
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

{{-- ═══════════════════════════════════════════════════════════════════════ --}}
{{-- SIGNATURES --}}
{{-- ═══════════════════════════════════════════════════════════════════════ --}}
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

{{-- ═══════════════════════════════════════════════════════════════════════ --}}
{{-- FOOTER --}}
{{-- ═══════════════════════════════════════════════════════════════════════ --}}
<div class="footer">
    MocasE – Système de Gestion Scolaire &nbsp;|&nbsp;
    Bulletin généré le {{ now()->format('d/m/Y à H:i') }} &nbsp;|&nbsp;
    Document officiel de l'établissement – Ne pas falsifier
</div>

</div>
</body>
</html>

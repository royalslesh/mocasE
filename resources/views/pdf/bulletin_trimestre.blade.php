<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>Bulletin Trimestriel - {{ $student->nom }} {{ $student->prenom }} - Trimestre {{ $trimestre }}</title>
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
    $seq1 = ($trimestre * 2) - 1;
    $seq2 = $trimestre * 2;
    $trimNom = ['1' => 'PREMIER', '2' => 'DEUXIÈME', '3' => 'TROISIÈME'];
    $trimLabel = $trimNom[(string)$trimestre] ?? $trimestre;

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

    .header-wrapper { border: 2.5px solid {{ $mainColor }}; border-radius: 4px; margin-bottom: 4mm; overflow: hidden; }
    .header-top { background-color: {{ $mainColor }}; color: white; padding: 2mm 4mm; display: table; width: 100%; }
    .header-top-left, .header-top-right { display: table-cell; vertical-align: middle; width: 33%; }
    .header-top-center { display: table-cell; vertical-align: middle; width: 34%; text-align: center; }
    .republic-title { font-size: 7.5pt; font-weight: bold; text-align: center; line-height: 1.4; }
    .republic-sub { font-size: 6.5pt; text-align: center; font-style: italic; }
    .school-logo { max-height: 20mm; max-width: 26mm; display: block; margin: 0 auto; }
    .logo-placeholder { width: 20mm; height: 20mm; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; margin: 0 auto; font-size: 7pt; color: white; text-align: center; }
    .header-school { background: {{ $lightColor }}; padding: 1.5mm 4mm; text-align: center; }
    .school-name { font-size: 10.5pt; font-weight: bold; color: {{ $textColor }}; text-transform: uppercase; letter-spacing: 1px; }
    .school-sub { font-size: 7pt; color: #555; margin-top: 0.3mm; }
    .bulletin-title-bar { background: {{ $mainColor }}; color: white; padding: 1.5mm 4mm; text-align: center; font-size: 9.5pt; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; }
    .badge-trim { display: inline-block; background: rgba(255,255,255,0.3); padding: 0.5mm 3mm; border-radius: 2px; font-size: 8pt; font-weight: bold; }
    .identity-grid { display: table; width: 100%; border: 1px solid {{ $mainColor }}; border-radius: 4px; margin-bottom: 3mm; }
    .identity-col { display: table-cell; padding: 2mm 3mm; vertical-align: middle; }
    .identity-col-info { width: 43%; border-right: 1px solid {{ $mainColor }}; }
    .identity-col-academic { width: 41%; border-right: 1px solid {{ $mainColor }}; }
    .identity-col-photo { width: 16%; text-align: center; vertical-align: middle; padding: 1.5mm; background: #fafafa; }
    .student-photo-img { width: 22mm; height: 26mm; object-fit: cover; border-radius: 3px; border: 1px solid {{ $mainColor }}; display: inline-block; }
    .student-photo-placeholder { width: 22mm; height: 26mm; border-radius: 3px; border: 1px dashed #cbd5e1; display: inline-block; line-height: 26mm; font-size: 6.5pt; font-weight: bold; color: #94a3b8; background: #f8fafc; text-align: center; text-transform: uppercase; letter-spacing: 0.5px; }
    .identity-label { font-size: 7pt; color: #777; text-transform: uppercase; letter-spacing: 0.5px; }
    .identity-value { font-size: 8.5pt; font-weight: bold; margin-top: 0.3mm; }
    .stats-bar { display: table; width: 100%; margin-bottom: 3mm; border-collapse: collapse; }
    .stat-box { display: table-cell; text-align: center; border: 1.5px solid {{ $mainColor }}; padding: 1.5mm; width: 20%; }
    .stat-box:not(:last-child) { border-right: none; }
    .stat-label { font-size: 6pt; color: {{ $textColor }}; text-transform: uppercase; letter-spacing: 0.3px; font-weight: bold; }
    .stat-value { font-size: 11pt; font-weight: bold; color: {{ $mainColor }}; margin-top: 0.3mm; }
    .stat-sub { font-size: 6pt; color: #999; }

    table.notes-table { width: 100%; border-collapse: collapse; margin-bottom: 3mm; font-size: 7.5pt; }
    table.notes-table thead tr { background-color: {{ $mainColor }}; color: white; }
    table.notes-table thead th { padding: 1.5mm 1.5mm; text-align: center; font-size: 6.5pt; text-transform: uppercase; border: 1px solid {{ $mainColor }}; }
    table.notes-table thead th:first-child { text-align: left; width: 32%; }
    table.notes-table tbody tr:nth-child(even) { background-color: #f9f9f9; }
    table.notes-table tbody tr.critique-row { background-color: #fff5f5; }
    table.notes-table tbody td { padding: 1.2mm 1.5mm; border: 1px solid #e5e7eb; text-align: center; vertical-align: middle; }
    table.notes-table tbody td:first-child { text-align: left; font-weight: 600; }
    table.notes-table tbody td.note-ok { color: #059669; font-weight: bold; }
    table.notes-table tbody td.note-fail { color: #dc2626; font-weight: bold; }
    table.notes-table tfoot tr { background: {{ $lightColor }}; }
    table.notes-table tfoot td { padding: 1.5mm; border: 1px solid {{ $mainColor }}; font-weight: bold; font-size: 8pt; color: {{ $textColor }}; text-align: center; }
    table.notes-table tfoot td:first-child { text-align: left; }

    .critiques-section { border: 1.5px solid #fca5a5; border-radius: 3px; background: #fff5f5; padding: 2mm 3mm; margin-bottom: 3mm; }
    .critiques-title { font-size: 7pt; font-weight: bold; color: #b91c1c; text-transform: uppercase; margin-bottom: 1mm; }
    .critique-item { font-size: 7pt; color: #7f1d1d; margin-bottom: 0.5mm; }

    .bottom-grid { display: table; width: 100%; border-collapse: collapse; margin-bottom: 3mm; }
    .bottom-col { display: table-cell; vertical-align: top; border: 1px solid #ddd; padding: 2mm 3mm; }
    .bottom-label { font-size: 6.5pt; color: #777; text-transform: uppercase; font-weight: bold; margin-bottom: 1mm; }
    .bottom-value { font-size: 7.5pt; font-style: italic; color: #333; min-height: 7mm; }

    .signatures-row { display: table; width: 100%; border: 1px solid #ddd; border-radius: 3px; margin-top: 2mm; }
    .sig-col { display: table-cell; text-align: center; padding: 2mm; width: 33.33%; vertical-align: top; }
    .sig-col:not(:last-child) { border-right: 1px solid #ddd; }
    .sig-label { font-size: 6pt; color: #777; text-transform: uppercase; font-weight: bold; margin-bottom: 3mm; }
    .sig-line { border-top: 1px solid #bbb; margin-top: 7mm; margin-bottom: 1mm; }
    .sig-name { font-size: 6pt; color: #555; }
    .mention-badge { display: inline-block; padding: 0.8mm 2mm; border-radius: 3px; font-size: 7pt; font-weight: bold; border: 1px solid; }
    .footer { text-align: center; font-size: 6pt; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 1.5mm; margin-top: 3mm; }

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
        <strong>Aperçu Impression / Export PDF (Trimestriel)</strong>
        <span style="color:#666; font-size:12px; margin-left:10px;">(Pour sauvegarder en PDF, choisissez "Enregistrer au format PDF" dans la boîte d'impression)</span>
    </div>
    <button onclick="window.print()" class="print-btn">
        🖨️ Imprimer / Enregistrer en PDF
    </button>
</div>

<div class="page-container">
@include('partials.official-header', [
    'school'           => $school,
    'documentTitle'    => 'BULLETIN TRIMESTRIEL — ' . $trimLabel . ' TRIMESTRE',
    'documentSubtitle' => 'SÉQUENCES ' . $seq1 . ' & ' . $seq2 . ' — ANNÉE ACADÉMIQUE ' . ($classe_info['annee_academique'] ?? ($school['academic_year'] ?? '2025/2026')) . ' — CLASSE : ' . ($classe_info['nom'] ?? ''),
    'themeColor'       => $mainColor,
])

{{-- IDENTITÉ --}}
<div class="identity-grid">
    <div class="identity-col identity-col-info">
        <div class="identity-label">Nom et Prénom(s)</div>
        <div class="identity-value">{{ strtoupper($student->nom) }} {{ $student->prenom }}</div>
        <div style="margin-top:1.5mm;"><div class="identity-label">Matricule</div>
        <div class="identity-value" style="font-family:monospace;">{{ $student->MATRICULE ?? '—' }}</div></div>
        <div style="margin-top:1.5mm;"><div class="identity-label">Sexe</div>
        <div class="identity-value">{{ $student->sexe === 'M' ? 'Masculin' : ($student->sexe === 'F' ? 'Féminin' : '—') }}</div></div>
    </div>
    <div class="identity-col identity-col-academic">
        <div class="identity-label">Classe / Salle</div>
        <div class="identity-value">{{ $classe_info['nom'] ?? '—' }} @if(!empty($classe_info['section'])) <small style="font-weight:normal;">({{ $classe_info['section'] }})</small> @endif</div>
        <div style="margin-top:1.5mm;"><div class="identity-label">Date de Naissance</div>
        <div class="identity-value">{{ $student->date_naissance ? \Carbon\Carbon::parse($student->date_naissance)->format('d/m/Y') : '—' }}@if($student->lieu_naissance) à {{ $student->lieu_naissance }}@endif</div></div>
        <div style="margin-top:1.5mm;"><div class="identity-label">Professeur Principal</div>
        <div class="identity-value">{{ $prof_principal['name'] ?? 'Non assigné' }}</div></div>
    </div>
    <div class="identity-col identity-col-photo">
        @if($studentPhotoSrc)
            <img src="{{ $studentPhotoSrc }}" alt="Photo élève" class="student-photo-img" />
        @else
            <div class="student-photo-placeholder">PHOTO</div>
        @endif
    </div>
</div>

{{-- STATS --}}
<div class="stats-bar">
    <div class="stat-box">
        <div class="stat-label">Moy. Trimestrielle</div>
        <div class="stat-value" style="{{ $moyenne_eleve !== null && $moyenne_eleve >= 10 ? 'color:#059669' : 'color:#dc2626' }}">
            {{ $moyenne_eleve !== null ? number_format($moyenne_eleve, 2) : '—' }}/20
        </div>
        <div class="stat-sub">de l'élève</div>
    </div>
    <div class="stat-box">
        <div class="stat-label">Rang</div>
        <div class="stat-value">{{ $rang ?? '—' }}<span style="font-size:7pt;">@if($rang)/{{ $effectif_total }}@endif</span></div>
        <div class="stat-sub">{{ $effectif_total }} élèves</div>
    </div>
    <div class="stat-box">
        <div class="stat-label">1er de classe</div>
        <div class="stat-value" style="font-size:10pt;">{{ $moyenne_premier !== null ? number_format($moyenne_premier, 2) : '—' }}</div>
        <div class="stat-sub">/20</div>
    </div>
    <div class="stat-box">
        <div class="stat-label">Dernier</div>
        <div class="stat-value" style="font-size:10pt;">{{ $moyenne_dernier !== null ? number_format($moyenne_dernier, 2) : '—' }}</div>
        <div class="stat-sub">/20</div>
    </div>
    <div class="stat-box">
        <div class="stat-label">Moy. Classe</div>
        <div class="stat-value" style="font-size:10pt;">{{ $moyenne_classe !== null ? number_format($moyenne_classe, 2) : '—' }}</div>
        <div class="stat-sub">Réussite: {{ $taux_reussite }}%</div>
    </div>
</div>

{{-- TABLEAU NOTES --}}
<table class="notes-table">
    <thead>
        <tr>
            <th style="text-align:left;">Matière</th>
            <th>Coef</th>
            <th>Séq {{ $seq1 }}/20</th>
            <th>Séq {{ $seq2 }}/20</th>
            <th>Moy. /20</th>
            <th>×Coef</th>
            <th>Appréciation</th>
        </tr>
    </thead>
    <tbody>
        @php $totalCoef = 0; $totalNoteCoef = 0; @endphp
        @foreach($notes as $note)
        @php
            if ($note['note'] !== null) {
                $totalCoef += $note['coef'];
                $coefVal = $note['coef'];
                $moyNote = $note['note'];
                $nc = round($moyNote * $coefVal, 2);
                $totalNoteCoef += $nc;
            }
            $app = null;
            if (isset($note['note']) && $note['note'] !== null) {
                $v = $note['note'];
                if ($v >= 18) $app = 'Très Bien';
                elseif ($v >= 16) $app = 'Bien';
                elseif ($v >= 14) $app = 'Assez Bien';
                elseif ($v >= 12) $app = 'Passable';
                elseif ($v >= 10) $app = 'Insuffisant';
                else $app = 'Très Insuf.';
            }
        @endphp
        <tr class="{{ isset($note['critique']) && $note['critique'] ? 'critique-row' : '' }}">
            <td>
                {{ $note['nom'] }}
                @if(isset($note['critique']) && $note['critique']) <span style="color:#dc2626;font-size:6.5pt;">⚠</span> @endif
            </td>
            <td>{{ $note['coef'] }}</td>
            <td class="{{ isset($note['note_seq1']) && $note['note_seq1'] !== null ? ($note['note_seq1'] < 10 ? 'note-fail' : 'note-ok') : '' }}">
                {{ isset($note['note_seq1']) && $note['note_seq1'] !== null ? number_format($note['note_seq1'], 2) : '—' }}
            </td>
            <td class="{{ isset($note['note_seq2']) && $note['note_seq2'] !== null ? ($note['note_seq2'] < 10 ? 'note-fail' : 'note-ok') : '' }}">
                {{ isset($note['note_seq2']) && $note['note_seq2'] !== null ? number_format($note['note_seq2'], 2) : '—' }}
            </td>
            <td class="{{ isset($note['note']) && $note['note'] !== null ? ($note['note'] < 10 ? 'note-fail' : 'note-ok') : '' }}">
                {{ isset($note['note']) && $note['note'] !== null ? number_format($note['note'], 2) : '—' }}
            </td>
            <td>{{ isset($note['note'], $note['coef']) && $note['note'] !== null ? number_format($note['note'] * $note['coef'], 2) : '—' }}</td>
            <td style="font-size:6.5pt;">{{ $app ?? '—' }}</td>
        </tr>
        @endforeach
    </tbody>
    <tfoot>
        <tr>
            <td><strong>TOTAL / MOYENNES</strong></td>
            <td>{{ $totalCoef }}</td>
            <td colspan="2" style="font-size:7pt;font-style:italic;">Moyenne des 2 séquences</td>
            <td><strong>{{ $moyenne_eleve !== null ? number_format($moyenne_eleve, 2) : '—' }}/20</strong></td>
            <td>{{ number_format($totalNoteCoef, 2) }}</td>
            <td>
                @if($moyenne_eleve !== null)
                    @if($moyenne_eleve >= 16) <strong>Bien</strong>
                    @elseif($moyenne_eleve >= 12) <strong>Assez Bien</strong>
                    @elseif($moyenne_eleve >= 10) <strong>Passable</strong>
                    @else <strong style="color:#dc2626;">Insuf.</strong>
                    @endif
                @else — @endif
            </td>
        </tr>
    </tfoot>
</table>

{{-- MATIÈRES CRITIQUES --}}
@if(count($matieres_critiques) > 0)
<div class="critiques-section">
    <div class="critiques-title">⚠ Matières nécessitant des efforts particuliers (Moy. &lt; 10/20)</div>
    @foreach($matieres_critiques as $mat)
    <div class="critique-item">→ <strong>{{ $mat['nom'] }}</strong> : {{ isset($mat['note']) ? number_format($mat['note'], 2) : '—' }}/20</div>
    @endforeach
</div>
{{-- DISCIPLINE & ASSIDUITÉ TRIMESTRIELLE --}}
<table style="width: 100%; border-collapse: collapse; margin-bottom: 3.5mm; font-size: 7.5pt; border: 1.5px solid {{ $mainColor }};">
    <thead>
        <tr style="background-color: {{ $lightColor }};">
            <th colspan="6" style="padding: 1.5mm 3mm; text-align: left; font-size: 7pt; text-transform: uppercase; color: {{ $textColor }}; border-bottom: 1px solid {{ $mainColor }};">
                Discipline &amp; Assiduité Cumulée — Trimestre {{ $trimestre }} (Séq. {{ $seq1 }} &amp; {{ $seq2 }})
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

{{-- OBSERVATIONS + MENTION --}}
<div class="bottom-grid">
    <div class="bottom-col" style="width:60%;">
        <div class="bottom-label">Observations du Professeur Principal</div>
        <div class="bottom-value">
            @if($moyenne_eleve !== null)
                @if($moyenne_eleve >= 16) Excellent trimestre, continuez ainsi !
                @elseif($moyenne_eleve >= 14) Bon trimestre, de bons résultats.
                @elseif($moyenne_eleve >= 12) Trimestre satisfaisant, peut encore progresser.
                @elseif($moyenne_eleve >= 10) Résultats acceptables, des efforts nécessaires.
                @else Résultats insuffisants. Un effort soutenu s'impose.
                @endif
            @else Notes non encore complètes.
            @endif
        </div>
    </div>
    <div class="bottom-col" style="width:40%; border-left:1px solid #ddd;">
        <div class="bottom-label">Mention Trimestrielle</div>
        <div style="margin-top:1mm;">
            @if($moyenne_eleve !== null)
                @if($moyenne_eleve >= 16)
                    <span class="mention-badge" style="background:#d1fae5;color:#065f46;border-color:#059669;">🏅 Félicitations</span>
                @elseif($moyenne_eleve >= 14)
                    <span class="mention-badge" style="background:#fef3c7;color:#92400e;border-color:#fbbf24;">🌟 Tableau d'Honneur</span>
                @elseif($moyenne_eleve >= 12)
                    <span class="mention-badge" style="background:#e0f2fe;color:#075985;border-color:#38bdf8;">👍 Encouragements</span>
                @elseif($moyenne_eleve >= 8)
                    <span class="mention-badge" style="background:#fff7ed;color:#9a3412;border-color:#fb923c;">⚠ Avertissement</span>
                @else
                    <span class="mention-badge" style="background:#fee2e2;color:#7f1d1d;border-color:#f87171;">🚫 Blâme</span>
                @endif
            @else
                <span class="mention-badge" style="background:#f3f4f6;color:#9ca3af;border-color:#e5e7eb;">— En attente</span>
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

<div class="footer">
    MocasE – Système de Gestion Scolaire &nbsp;|&nbsp;
    Bulletin trimestriel généré le {{ now()->format('d/m/Y à H:i') }} &nbsp;|&nbsp;
    Document officiel – Ne pas falsifier
</div>

</div>
</body>
</html>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Liste des Élèves — {{ $school->name }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; font-size: 11px; color: #111; }
        
        .header { text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 3px solid #111; }
        .header h1 { font-size: 18px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; }
        .header h2 { font-size: 13px; font-weight: 700; text-transform: uppercase; margin-top: 4px; color: #444; }
        .header .meta { font-size: 10px; color: #888; margin-top: 6px; }
        
        .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; background: #f0f0f0; }

        .classe-block { margin-bottom: 32px; page-break-inside: avoid; }
        .classe-title { font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; padding: 8px 12px; background: #111; color: #fff; margin-bottom: 0; border-radius: 4px 4px 0 0; display: flex; justify-content: space-between; align-items: center; }
        
        table { width: 100%; border-collapse: collapse; }
        thead tr { background: #f5f5f5; }
        th { padding: 7px 10px; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #555; border-bottom: 1px solid #ddd; text-align: left; }
        td { padding: 7px 10px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:nth-child(even) td { background: #fafafa; }
        
        .num { color: #bbb; font-weight: 900; font-size: 10px; }
        .name { font-weight: 700; text-transform: uppercase; }
        .matricule { font-size: 9px; color: #888; font-weight: 700; letter-spacing: 1px; }
        .tag-red { background: #fee2e2; color: #991b1b; padding: 1px 6px; border-radius: 10px; font-size: 8px; font-weight: 900; text-transform: uppercase; }
        .tag-green { background: #dcfce7; color: #166534; padding: 1px 6px; border-radius: 10px; font-size: 8px; font-weight: 900; text-transform: uppercase; }

        .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 10px; color: #888; border-top: 1px solid #eee; padding-top: 12px; }
        .signature-zone { margin-top: 60px; display: flex; justify-content: space-between; }
        .signature-box { text-align: center; }
        .signature-box p { font-size: 9px; font-weight: 900; text-transform: uppercase; color: #555; }
        .signature-line { border-top: 1px solid #aaa; width: 160px; margin: 40px auto 6px; }

        @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
        }
    </style>
</head>
<body>

<!-- Bouton impression (caché à l'impression) -->
<div class="no-print" style="position:fixed;top:16px;right:16px;z-index:999;display:flex;gap:8px;">
    <button onclick="window.print()" style="padding:10px 20px;background:#111;color:#fff;border:none;border-radius:8px;font-weight:900;font-size:11px;cursor:pointer;text-transform:uppercase;letter-spacing:1px;">
        Imprimer / Enregistrer PDF
    </button>
    <button onclick="window.close()" style="padding:10px 20px;background:#f5f5f5;color:#111;border:none;border-radius:8px;font-weight:900;font-size:11px;cursor:pointer;text-transform:uppercase;letter-spacing:1px;">
        Fermer
    </button>
</div>

@php
    $filterLabel = match($filtre) {
        'redoublants' => 'ÉLÈVES REDOUBLANTS UNIQUEMENT',
        'nouveaux'    => 'NOUVEAUX INSCRITS UNIQUEMENT',
        default       => 'TOUS LES ÉLÈVES INSCRITS',
    };
    $docSubtitle = "REGISTRE D'APPEL & D'ÉMARGEMENT — " . $filterLabel . " — GÉNÉRÉ LE " . now()->format('d/m/Y à H:i');
@endphp

@include('partials.official-header', [
    'school'           => $school,
    'documentTitle'    => "LISTE NOMINATIVE DES ÉLÈVES",
    'documentSubtitle' => $docSubtitle,
    'themeColor'       => '#0f172a',
])

@foreach($classes as $classe)
@if($classe->eleves->count() > 0)
<div class="classe-block">
    <div class="classe-title">
        <span>{{ $classe->nom }} @if($classe->section)({{ strtoupper($classe->section) }})@endif</span>
        <span style="font-size:10px;opacity:0.8;">{{ $classe->eleves->count() }} élève(s)</span>
    </div>
    <table>
        <thead>
            <tr>
                <th style="width:32px;">N°</th>
                <th>Matricule</th>
                <th>Nom & Prénom</th>
                <th>Sexe</th>
                <th>Statut</th>
                <th>Émargement</th>
            </tr>
        </thead>
        <tbody>
            @foreach($classe->eleves->sortBy('nom') as $i => $eleve)
            <tr>
                <td class="num">{{ $i + 1 }}</td>
                <td class="matricule">{{ $eleve->MATRICULE ?? '—' }}</td>
                <td class="name">{{ $eleve->nom }} {{ $eleve->prenom }}</td>
                <td>{{ $eleve->sexe ?? '—' }}</td>
                <td>
                    @if($eleve->redoublant)
                        <span class="tag-red">Redoublant</span>
                    @else
                        <span class="tag-green">Nouveau</span>
                    @endif
                </td>
                <td style="width:120px;border-bottom:1px dotted #ccc;">&nbsp;</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endif
@endforeach

<div class="signature-zone">
    <div class="signature-box">
        <div class="signature-line"></div>
        <p>Le Censeur</p>
    </div>
    <div class="signature-box">
        <div class="signature-line"></div>
        <p>Le Proviseur</p>
    </div>
</div>

<div class="footer">
    <span>{{ $school->name }} — Document officiel</span>
    <span>{{ now()->format('d/m/Y') }}</span>
</div>

</body>
</html>

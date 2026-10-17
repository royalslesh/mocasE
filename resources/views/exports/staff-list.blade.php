<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Liste du Personnel — {{ $school->name }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; font-size: 11px; color: #111; }

        .header { text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 3px solid #111; }
        .header h1 { font-size: 18px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; }
        .header h2 { font-size: 13px; font-weight: 700; text-transform: uppercase; margin-top: 4px; color: #444; }
        .header .meta { font-size: 10px; color: #888; margin-top: 6px; }

        .section-title { font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; padding: 8px 12px; background: #111; color: #fff; margin: 24px 0 0; border-radius: 4px 4px 0 0; }

        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        thead tr { background: #f5f5f5; }
        th { padding: 7px 10px; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #555; border-bottom: 1px solid #ddd; text-align: left; }
        td { padding: 8px 10px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
        tr:last-child td { border-bottom: none; }
        tr:nth-child(even) td { background: #fafafa; }

        .name { font-weight: 700; text-transform: uppercase; }
        .email { font-size: 9px; color: #888; }
        .role-badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 8px; font-weight: 900; text-transform: uppercase; }
        .role-enseignant { background: #dbeafe; color: #1e40af; }
        .role-censeur { background: #fef3c7; color: #92400e; }
        .role-surveillant { background: #f3e8ff; color: #6b21a8; }
        .role-comptable { background: #dcfce7; color: #166534; }

        .assignments { font-size: 9px; color: #555; }
        .assignments span { display: inline-block; margin: 1px 3px 1px 0; padding: 1px 5px; background: #f0f0f0; border-radius: 4px; }

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

<div class="no-print" style="position:fixed;top:16px;right:16px;z-index:999;display:flex;gap:8px;">
    <button onclick="window.print()" style="padding:10px 20px;background:#111;color:#fff;border:none;border-radius:8px;font-weight:900;font-size:11px;cursor:pointer;text-transform:uppercase;letter-spacing:1px;">
        Imprimer / Enregistrer PDF
    </button>
    <button onclick="window.close()" style="padding:10px 20px;background:#f5f5f5;color:#111;border:none;border-radius:8px;font-weight:900;font-size:11px;cursor:pointer;text-transform:uppercase;letter-spacing:1px;">
        Fermer
    </button>
</div>

@php
    $docSubtitle = "ANNUAIRE ET RÉPERTOIRE DU CORPS ENSEIGNANT ET ADMINISTRATIF — GÉNÉRÉ LE " . now()->format('d/m/Y à H:i');
@endphp

@include('partials.official-header', [
    'school'           => $school,
    'documentTitle'    => "RÉPERTOIRE OFFICIEL DU PERSONNEL",
    'documentSubtitle' => $docSubtitle,
    'themeColor'       => '#0f172a',
])

@php
    $grouped = $staff->groupBy('role');
    $roleLabels = [
        'censeur'      => 'Censeurs',
        'enseignant'   => 'Enseignants',
        'surveillant'  => 'Surveillants Généraux',
        'comptable'    => 'Comptables / Économes',
    ];
    $roleOrder = ['censeur', 'enseignant', 'surveillant', 'comptable'];
@endphp

@foreach($roleOrder as $role)
@if(isset($grouped[$role]) && $grouped[$role]->count() > 0)
<div class="section-title">{{ $roleLabels[$role] ?? $role }} ({{ $grouped[$role]->count() }})</div>
<table>
    <thead>
        <tr>
            <th style="width:32px;">N°</th>
            <th>Nom</th>
            <th>Email</th>
            @if($role === 'enseignant')<th>Matières & Classes</th>@endif
            <th>Statut</th>
        </tr>
    </thead>
    <tbody>
        @foreach($grouped[$role]->sortBy('name') as $i => $member)
        <tr>
            <td class="num" style="color:#bbb;font-weight:900;">{{ $i + 1 }}</td>
            <td>
                <div class="name">{{ $member->name }}</div>
            </td>
            <td class="email">{{ $member->email }}</td>
            @if($role === 'enseignant')
            <td>
                <div class="assignments">
                    @foreach($member->teacherAssignments->unique('subject_id') as $assignment)
                        @if($assignment->subject)
                            <span>{{ $assignment->subject->nom }}</span>
                        @endif
                    @endforeach
                </div>
            </td>
            @endif
            <td>
                <span class="role-badge role-{{ $role }}">
                    {{ $roleLabels[$role] ?? $role }}
                </span>
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
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

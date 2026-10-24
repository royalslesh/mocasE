<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Feuille d'Appel — {{ $classe->nom }} — {{ $date->format('d/m/Y') }}</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 6mm 8mm;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'DejaVu Sans', 'Helvetica Neue', Arial, sans-serif;
            font-size: 8pt;
            color: #0f172a;
            background: #fff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        /* ── BARRE D'ACTION NO-PRINT ───────────────────────────────────── */
        .no-print {
            position: fixed;
            top: 12px;
            right: 12px;
            z-index: 9999;
            display: flex;
            gap: 8px;
            background: rgba(15, 23, 42, 0.95);
            padding: 8px 12px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            backdrop-filter: blur(8px);
        }
        .no-print button {
            padding: 8px 14px;
            border: none;
            border-radius: 8px;
            font-size: 10px;
            font-weight: 900;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.2s;
        }
        .btn-print { background: #10b981; color: white; }
        .btn-print:hover { background: #059669; }
        .btn-close { background: #334155; color: white; }
        .btn-close:hover { background: #475569; }
        @media print {
            .no-print { display: none !important; }
        }

        /* ── TABLE PRINCIPALE ────────────────────────────────────────── */
        .sheet-container {
            width: 100%;
        }

        .meta-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #0f172a;
            color: #fff;
            padding: 4px 8px;
            border-radius: 4px;
            margin: 4px 0 6px 0;
            font-weight: 800;
            font-size: 8pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .meta-bar .badge {
            background: #10b981;
            color: #fff;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 7.5pt;
        }

        table.attendance-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 7pt;
        }
        table.attendance-table th,
        table.attendance-table td {
            border: 1px solid #94a3b8;
            padding: 2.5px 3px;
            vertical-align: middle;
        }
        table.attendance-table th {
            background: #f1f5f9;
            color: #0f172a;
            font-weight: 900;
            text-align: center;
        }
        .th-slot {
            font-size: 6.5pt;
            line-height: 1.15;
            min-width: 65px;
            background: #e2e8f0 !important;
        }
        .slot-time {
            font-weight: 900;
            color: #0f172a;
        }
        .slot-subject {
            font-weight: 900;
            color: #047857;
            text-transform: uppercase;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 90px;
        }
        .slot-teacher {
            font-size: 5.5pt;
            color: #64748b;
            font-weight: 600;
        }

        .col-num { width: 22px; text-align: center; font-weight: 800; }
        .col-name { font-weight: 800; font-size: 7pt; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px; }
        .col-mat { width: 85px; text-align: center; font-family: monospace; font-size: 6.5pt; font-weight: 700; color: #475569; }
        .col-total { width: 45px; text-align: center; font-weight: 900; background: #f8fafc; }

        .cell-check {
            text-align: center;
            font-size: 6pt;
            color: #cbd5e1;
            height: 17px;
        }
        .cell-box {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 1px dashed #94a3b8;
            border-radius: 2px;
            margin: 0 1px;
        }

        tr:nth-child(even) td { background-color: #fafafa; }

        /* ── LIGNES DE RÉCAPITULATIF ───────────────────────────────────── */
        tr.recap-row td {
            font-weight: 900;
            background: #f1f5f9 !important;
            font-size: 6.5pt;
            height: 16px;
        }
        tr.recap-row-sign td {
            font-weight: 900;
            background: #fff !important;
            height: 22px;
        }

        /* ── FOOTER & SIGNATURES ───────────────────────────────────────── */
        .footer-grid {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-top: 6px;
            padding-top: 4px;
            border-top: 1px solid #cbd5e1;
        }
        .legend {
            font-size: 6.5pt;
            color: #475569;
            font-weight: 700;
            line-height: 1.3;
        }
        .legend span {
            font-weight: 900;
            color: #0f172a;
            margin-right: 6px;
        }
        .signature-zone {
            display: flex;
            gap: 25px;
        }
        .sig-box {
            width: 130px;
            text-align: center;
            font-size: 7pt;
            font-weight: 800;
        }
        .sig-line {
            height: 28px;
            border-bottom: 1px dotted #64748b;
            margin-bottom: 2px;
        }
    </style>
</head>
<body>

<!-- Boutons d'action écran -->
<div class="no-print">
    <button class="btn-print" onclick="window.print()">🖨️ Imprimer la Feuille</button>
    <button class="btn-close" onclick="window.close()">Fermer</button>
</div>

<div class="sheet-container">
    @php
        $docSubtitle = "CONTRÔLE JOURNALIER DES PRÉSENCES PAR CRÉNEAU HORAIRE";
    @endphp

    @include('partials.official-header', [
        'school'           => $school,
        'documentTitle'    => "REGISTRE D'APPEL & FICHE DE PRÉSENCE JOURNALIÈRE",
        'documentSubtitle' => $docSubtitle,
        'themeColor'       => '#0f172a',
    ])

    <!-- Barre méta de la classe & journée -->
    <div class="meta-bar">
        <div>
            <span>CLASSE : </span>
            <strong style="color: #38bdf8; font-size: 9pt;">{{ strtoupper($classe->nom) }}</strong>
            @if($classe->section)
                <span> ({{ strtoupper($classe->section) }})</span>
            @endif
        </div>
        <div>
            <span>JOUR &amp; DATE : </span>
            <strong style="color: #fde047;">{{ strtoupper($jour) }} {{ $date->format('d/m/Y') }}</strong>
        </div>
        <div>
            <span>EFFECTIF : </span>
            <span class="badge">{{ $classe->eleves->count() }} ÉLÈVES</span>
        </div>
    </div>

    <!-- Tableau d'appel -->
    <table class="attendance-table">
        <thead>
            <tr>
                <th class="col-num" rowspan="2">N°</th>
                <th rowspan="2" style="text-align:left; padding-left: 6px;">NOM &amp; PRÉNOM DE L'ÉLÈVE</th>
                <th class="col-mat" rowspan="2">MATRICULE</th>
                @foreach($slots as $slot)
                    <th class="th-slot">
                        <div class="slot-time">{{ $slot->heure_debut }} - {{ $slot->heure_fin }}</div>
                        <div class="slot-subject">{{ $slot->matiere->nom ?? 'COURS' }}</div>
                        @if(!empty($slot->teacher))
                            <div class="slot-teacher">{{ $slot->teacher->name }}</div>
                        @endif
                    </th>
                @endforeach
                <th class="col-total" rowspan="2">TOTAL<br>ABS.</th>
            </tr>
            <tr>
                @foreach($slots as $slot)
                    <th style="font-size: 5.5pt; color: #475569; padding: 1px 0; background: #cbd5e1;">P / A / R</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($classe->eleves as $eleve)
            <tr>
                <td class="col-num">{{ $loop->iteration }}</td>
                <td class="col-name">{{ strtoupper($eleve->nom) }} {{ $eleve->prenom }}</td>
                <td class="col-mat">{{ $eleve->MATRICULE ?? '—' }}</td>
                @foreach($slots as $slot)
                    <td class="cell-check">
                        &nbsp;
                    </td>
                @endforeach
                <td class="col-total">&nbsp;</td>
            </tr>
            @endforeach

            <!-- Ligne Récapitulatif : Présents -->
            <tr class="recap-row">
                <td colspan="3" style="text-align:right; padding-right:8px; text-transform:uppercase;">TOTAL ÉLÈVES PRÉSENTS :</td>
                @foreach($slots as $slot)
                    <td style="text-align:center;">&nbsp;</td>
                @endforeach
                <td>&nbsp;</td>
            </tr>

            <!-- Ligne Récapitulatif : Absents -->
            <tr class="recap-row">
                <td colspan="3" style="text-align:right; padding-right:8px; text-transform:uppercase; color:#b91c1c;">TOTAL ÉLÈVES ABSENTS :</td>
                @foreach($slots as $slot)
                    <td style="text-align:center;">&nbsp;</td>
                @endforeach
                <td>&nbsp;</td>
            </tr>

            <!-- Ligne Visa de l'enseignant -->
            <tr class="recap-row-sign">
                <td colspan="3" style="text-align:right; padding-right:8px; text-transform:uppercase;">ÉMARGEMENT DU PROFESSEUR :</td>
                @foreach($slots as $slot)
                    <td style="text-align:center; font-size:5pt; color:#94a3b8;">Visa</td>
                @endforeach
                <td>&nbsp;</td>
            </tr>
        </tbody>
    </table>

    <!-- Légende et Signatures officielles -->
    <div class="footer-grid">
        <div class="legend">
            <strong>LÉGENDE DE NOTATION :</strong><br>
            <span>[ P ] = Présent</span>
            <span>[ A ] = Absent non justifié</span>
            <span>[ R ] = En retard</span>
            <span>[ J ] = Absence justifiée (Maladie/Motif officiel)</span>
        </div>

        <div class="signature-zone">
            <div class="sig-box">
                <p>Le Surveillant Général</p>
                <div class="sig-line"></div>
                <span style="font-size:5.5pt;color:#64748b;">Visa &amp; Heure de contrôle</span>
            </div>
            <div class="sig-box">
                <p>Le Censeur</p>
                <div class="sig-line"></div>
                <span style="font-size:5.5pt;color:#64748b;">Visa académique</span>
            </div>
            <div class="sig-box">
                <p>Le Proviseur</p>
                <div class="sig-line"></div>
                <span style="font-size:5.5pt;color:#64748b;">Direction de l'établissement</span>
            </div>
        </div>
    </div>
</div>

</body>
</html>

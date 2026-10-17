<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>Tableau d'Honneur - {{ $school['name'] ?? 'Établissement' }}</title>
<style>
    @page {
        size: A4 landscape;
        margin: 7mm;
    }
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: 'DejaVu Sans', 'Helvetica Neue', Arial, sans-serif;
    }
    body {
        background-color: #ffffff;
        color: #1e293b;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    .page-certificate {
        width: 100%;
        height: 100%;
        min-height: 190mm;
        padding: 5mm;
        position: relative;
        background: #fffdfa;
        page-break-after: always;
        overflow: hidden;
    }
    .page-certificate:last-child {
        page-break-after: avoid;
    }

    /* Cadre Ornemental Royal */
    .outer-border {
        border: 4px solid #b45309;
        padding: 3mm;
        height: 100%;
        position: relative;
        box-shadow: inset 0 0 10px rgba(180, 83, 9, 0.15);
    }
    .inner-border {
        border: 1.5px solid #d97706;
        padding: 4mm 6mm;
        height: 100%;
        position: relative;
        background: #ffffff;
    }

    /* Coins Décoratifs */
    .corner {
        position: absolute;
        width: 18mm;
        height: 18mm;
        border-color: #b45309;
        pointer-events: none;
    }
    .corner-tl { top: 2mm; left: 2mm; border-top: 4px solid #b45309; border-left: 4px solid #b45309; }
    .corner-tr { top: 2mm; right: 2mm; border-top: 4px solid #b45309; border-right: 4px solid #b45309; }
    .corner-bl { bottom: 2mm; left: 2mm; border-bottom: 4px solid #b45309; border-left: 4px solid #b45309; }
    .corner-br { bottom: 2mm; right: 2mm; border-bottom: 4px solid #b45309; border-right: 4px solid #b45309; }

    /* En-tête Officiel */
    .header-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 2mm;
    }
    .header-col {
        vertical-align: top;
        text-align: center;
        width: 33%;
    }
    .official-text-fr {
        font-size: 7pt;
        font-weight: bold;
        line-height: 1.3;
        text-transform: uppercase;
        color: #334155;
    }
    .official-motto {
        font-size: 6.5pt;
        font-style: italic;
        color: #64748b;
        margin-bottom: 1mm;
    }
    .school-logo-img {
        max-height: 18mm;
        max-width: 25mm;
        object-fit: contain;
    }
    .school-badge-ph {
        width: 16mm;
        height: 16mm;
        margin: 0 auto;
        border-radius: 50%;
        background: #fef3c7;
        border: 2px solid #b45309;
        color: #b45309;
        font-weight: 900;
        font-size: 7pt;
        line-height: 15mm;
        text-align: center;
    }

    /* Établissement */
    .school-title {
        font-size: 13pt;
        font-weight: 900;
        color: #0f172a;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        text-align: center;
        margin-top: 1mm;
    }
    .academic-year-sub {
        font-size: 8pt;
        font-weight: 700;
        color: #b45309;
        text-align: center;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-bottom: 3mm;
    }

    /* Titre Principal Tableau d'Honneur */
    .title-banner {
        text-align: center;
        margin: 2mm auto 4mm auto;
        padding: 3mm 10mm;
        border-top: 2px solid #b45309;
        border-bottom: 2px solid #b45309;
        background: linear-gradient(90deg, transparent, #fffbeb, transparent);
    }
    .title-main {
        font-size: 20pt;
        font-weight: 900;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: #92400e;
        text-shadow: 1px 1px 0px #fde68a;
    }
    .title-distinction {
        font-size: 9.5pt;
        font-weight: 800;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: #047857;
        margin-top: 1mm;
    }

    /* Corps du diplôme */
    .award-intro {
        text-align: center;
        font-size: 9pt;
        font-style: italic;
        color: #475569;
        margin-bottom: 2mm;
    }

    /* Récipiendaire Layout */
    .recipient-table {
        width: 100%;
        border-collapse: collapse;
        margin: 2mm 0;
    }
    .recipient-photo-cell {
        width: 32mm;
        vertical-align: middle;
        text-align: center;
    }
    .recipient-photo-frame {
        width: 26mm;
        height: 32mm;
        border: 2px solid #b45309;
        border-radius: 4px;
        overflow: hidden;
        margin: 0 auto;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        background: #f8fafc;
    }
    .recipient-photo-frame img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .photo-placeholder-box {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #cbd5e1;
        font-size: 7.5pt;
        font-weight: bold;
        text-transform: uppercase;
        padding-top: 12mm;
    }

    .recipient-info-cell {
        vertical-align: middle;
        text-align: center;
        padding: 0 5mm;
    }
    .recipient-name {
        font-size: 17pt;
        font-weight: 900;
        color: #0f172a;
        letter-spacing: 1px;
        text-transform: uppercase;
        border-bottom: 1.5px dashed #cbd5e1;
        display: inline-block;
        padding-bottom: 1.5mm;
        margin-bottom: 1.5mm;
    }
    .recipient-meta {
        font-size: 9pt;
        color: #334155;
        font-weight: 700;
    }
    .recipient-meta span {
        color: #b45309;
        font-weight: 900;
    }

    /* Cadre Performance */
    .scores-row {
        width: 100%;
        margin: 3mm auto;
        text-align: center;
    }
    .score-badge {
        display: inline-block;
        padding: 2mm 6mm;
        border-radius: 6px;
        background: #fef3c7;
        border: 1.5px solid #d97706;
        margin: 0 3mm;
    }
    .score-badge-label {
        font-size: 7.5pt;
        font-weight: 800;
        text-transform: uppercase;
        color: #78350f;
    }
    .score-badge-val {
        font-size: 13pt;
        font-weight: 900;
        color: #92400e;
    }

    /* Bas de page / Signatures */
    .footer-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 4mm;
    }
    .footer-col {
        width: 33%;
        vertical-align: top;
        text-align: center;
    }
    .sig-role {
        font-size: 8.5pt;
        font-weight: 800;
        text-transform: uppercase;
        color: #1e293b;
        margin-bottom: 16mm;
    }
    .sig-name {
        font-size: 8pt;
        font-weight: 700;
        color: #475569;
        border-top: 1px solid #cbd5e1;
        display: inline-block;
        padding-top: 1mm;
        min-width: 35mm;
    }

    .seal-circle {
        width: 22mm;
        height: 22mm;
        border-radius: 50%;
        border: 2px dashed #b45309;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #b45309;
        font-size: 6.5pt;
        font-weight: 900;
        text-transform: uppercase;
        text-align: center;
        line-height: 1.2;
        padding-top: 6mm;
    }
    .date-statement {
        font-size: 7.5pt;
        font-weight: 600;
        color: #64748b;
        margin-bottom: 2mm;
    }
</style>
</head>
<body>

@php
    $items = isset($honorees) ? $honorees : [$single];
@endphp

@foreach($items as $item)
    @php
        $st = $item['student'];
        $moy = floatval($item['moyenne'] ?? 0);
        $cl = $item['classe'];
        $termLabel = $item['term_label'] ?? 'Séquence';

        if ($moy >= 18.00) {
            $titleText = "TABLEAU D'EXCELLENCE";
            $distinctionText = "Prix d'Excellence & Félicitations Spéciales";
        } elseif ($moy >= 16.00) {
            $titleText = "TABLEAU D'HONNEUR";
            $distinctionText = "Avec Félicitations du Conseil de Classe";
        } else {
            $titleText = "TABLEAU D'HONNEUR";
            $distinctionText = "Avec Encouragements du Conseil de Classe";
        }
    @endphp

    <div class="page-certificate">
        <div class="outer-border">
            <div class="inner-border">
                
                <!-- Coins dorés -->
                <div class="corner corner-tl"></div>
                <div class="corner corner-tr"></div>
                <div class="corner corner-bl"></div>
                <div class="corner corner-br"></div>

                <!-- En-tête officiel -->
                <table class="header-table">
                    <tr>
                        <td class="header-col" style="text-align: left;">
                            <div class="official-text-fr">RÉPUBLIQUE DU CAMEROUN</div>
                            <div class="official-motto">Paix – Travail – Patrie</div>
                            <div class="official-text-fr" style="font-size: 6pt; color: #64748b;">
                                MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES<br>
                                DÉLÉGATION RÉGIONALE
                            </div>
                        </td>
                        <td class="header-col">
                            @if(!empty($school['logo_path']) && file_exists(public_path('storage/' . $school['logo_path'])))
                                <img src="{{ public_path('storage/' . $school['logo_path']) }}" class="school-logo-img" alt="Logo">
                            @else
                                <div class="school-badge-ph">MocasE</div>
                            @endif
                        </td>
                        <td class="header-col" style="text-align: right;">
                            <div class="official-text-fr">REPUBLIC OF CAMEROON</div>
                            <div class="official-motto">Peace – Work – Fatherland</div>
                            <div class="official-text-fr" style="font-size: 6pt; color: #64748b;">
                                MINISTRY OF SECONDARY EDUCATION<br>
                                REGIONAL DELEGATION
                            </div>
                        </td>
                    </tr>
                </table>

                <!-- Nom de l'établissement -->
                <div class="school-title">{{ $school['name'] ?? 'Établissement Scolaire' }}</div>
                <div class="academic-year-sub">Année Scolaire {{ $school['academic_year'] ?? '2025-2026' }}</div>

                <!-- Titre Tableau d'Honneur -->
                <div class="title-banner">
                    <div class="title-main">{{ $titleText }}</div>
                    <div class="title-distinction">★ {{ $distinctionText }} ★</div>
                </div>

                <div class="award-intro">
                    Le Conseil des Enseignants et la Direction de l'Établissement décernent ce titre d'excellence à :
                </div>

                <!-- Informations Élève et Photo -->
                <table class="recipient-table">
                    <tr>
                        <td class="recipient-photo-cell">
                            <div class="recipient-photo-frame">
                                @if(!empty($st->photo_path) && file_exists(public_path('storage/' . $st->photo_path)))
                                    <img src="{{ public_path('storage/' . $st->photo_path) }}" alt="Photo">
                                @else
                                    <div class="photo-placeholder-box">Photo</div>
                                @endif
                            </div>
                        </td>
                        <td class="recipient-info-cell">
                            <div class="recipient-name">{{ $st->nom }} {{ $st->prenom }}</div>
                            <div class="recipient-meta">
                                Matricule : <span>{{ $st->MATRICULE }}</span> &nbsp;|&nbsp; 
                                Classe : <span>{{ $cl->nom ?? $st->classe }}</span>
                                @if(!empty($st->date_naissance))
                                    &nbsp;|&nbsp; Né(e) le : {{ \Carbon\Carbon::parse($st->date_naissance)->format('d/m/Y') }}
                                @endif
                            </div>
                            <div style="font-size: 8.5pt; color: #475569; margin-top: 1.5mm; font-style: italic;">
                                En reconnaissance de son investissement exemplaire, sa discipline et ses performances académiques au titre de la <strong>{{ $termLabel }}</strong>.
                            </div>
                        </td>
                    </tr>
                </table>

                <!-- Badges Moyenne et Rang -->
                <div class="scores-row">
                    <div class="score-badge">
                        <div class="score-badge-label">Moyenne Obtenue</div>
                        <div class="score-badge-val">{{ number_format($moy, 2, ',', ' ') }} / 20</div>
                    </div>
                    @if(!empty($item['rang']))
                        <div class="score-badge">
                            <div class="score-badge-label">Rang au Classement</div>
                            <div class="score-badge-val">{{ $item['rang'] }}{{ $item['rang'] == 1 ? 'er' : 'ème' }} @if(!empty($item['total_eleves'])) <span style="font-size: 9pt; color: #78350f;">/ {{ $item['total_eleves'] }}</span> @endif</div>
                        </div>
                    @endif
                    <div class="score-badge">
                        <div class="score-badge-label">Mention du Conseil</div>
                        <div class="score-badge-val" style="font-size: 10.5pt; color: #047857; text-transform: uppercase;">
                            {{ $moy >= 16 ? 'Félicitations' : 'Encouragements' }}
                        </div>
                    </div>
                </div>

                <!-- Signatures & Sceau -->
                <table class="footer-table">
                    <tr>
                        <td class="footer-col" style="text-align: left; padding-left: 5mm;">
                            <div class="sig-role">Le Professeur Principal</div>
                            <div class="sig-name">{{ $cl->professeurPrincipal?->name ?? 'Le Titulaire' }}</div>
                        </td>
                        <td class="footer-col">
                            <div class="date-statement">Fait à {{ $school['city'] ?? 'Yaoundé' }}, le {{ date('d/m/Y') }}</div>
                            <div class="seal-circle">Sceau de<br>l'École</div>
                        </td>
                        <td class="footer-col" style="text-align: right; padding-right: 5mm;">
                            <div class="sig-role">Le Chef d'Établissement</div>
                            <div class="sig-name">Le Proviseur / Directeur</div>
                        </td>
                    </tr>
                </table>

            </div>
        </div>
    </div>
@endforeach

</body>
</html>

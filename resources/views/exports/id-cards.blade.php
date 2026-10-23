<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cartes d'Identité Scolaires — {{ $school->name }}</title>
    @php
        $rawLogo = $school->logo_path ?? null;
        $logoBase64 = null;
        if ($rawLogo) {
            $cleanPath = preg_replace('#^storage/#', '', $rawLogo);
            $candidates = [
                storage_path('app/public/' . $cleanPath),
                public_path('storage/' . $cleanPath),
                public_path($cleanPath),
            ];
            foreach ($candidates as $filePath) {
                if (file_exists($filePath) && is_file($filePath)) {
                    $ext = pathinfo($filePath, PATHINFO_EXTENSION);
                    $mime = ($ext === 'svg') ? 'image/svg+xml' : 'image/' . $ext;
                    $logoBase64 = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($filePath));
                    break;
                }
            }
            if (!$logoBase64) {
                $logoBase64 = asset('storage/' . $cleanPath);
            }
        }
        $academicYear = $school->academic_year ?? '2025/2026';
    @endphp
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'DejaVu Sans', 'Helvetica Neue', Arial, sans-serif;
            background: #f1f5f9;
            color: #0f172a;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        /* ── BARRE D'ACTION ÉCRAN ────────────────────────────────────────── */
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
        .btn-print {
            background: #10b981;
            color: white;
            border: none;
            padding: 9px 20px;
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
        .btn-print:hover { background: #059669; }
        .btn-close {
            background: rgba(255,255,255,0.1);
            color: white;
            border: none;
            padding: 9px 18px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 11px;
            cursor: pointer;
        }
        .btn-close:hover { background: rgba(255,255,255,0.2); }

        /* ── PLANCHE D'IMPRESSION A4 ─────────────────────────────────────── */
        .sheet-container {
            width: 210mm;
            min-height: 297mm;
            margin: 80px auto 40px;
            background: white;
            padding: 10mm 8mm;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-content: flex-start;
            gap: 5mm 0;
        }

        /* ── CARTE D'IDENTITÉ SCOLAIRE (FORMAT BADGE CR80 : 86mm x 54mm) ─── */
        .id-card {
            width: 95mm;
            height: 61mm;
            border: 1px dashed #cbd5e1;
            border-radius: 6px;
            padding: 2.5mm 3.5mm;
            background: #ffffff;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            page-break-inside: avoid;
            margin-bottom: 2mm;
        }

        /* Liseré tricolore camerounais en haut */
        .cm-flag-stripe {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            display: flex;
        }
        .cm-flag-green  { flex: 1; background: #16a34a; }
        .cm-flag-red    { flex: 1; background: #dc2626; }
        .cm-flag-yellow { flex: 1; background: #eab308; }

        /* Filigrane d'armoiries en fond de carte */
        .card-watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -45%);
            width: 45mm;
            height: 45mm;
            opacity: 0.04;
            pointer-events: none;
            z-index: 1;
        }

        /* En-tête de la carte */
        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 0.8px solid #e2e8f0;
            padding-bottom: 1.5mm;
            position: relative;
            z-index: 2;
        }
        .card-header-logo {
            width: 11mm;
            height: 11mm;
            object-fit: contain;
            shrink: 0;
        }
        .card-header-seal {
            width: 10mm;
            height: 10mm;
            shrink: 0;
        }
        .card-header-text {
            text-align: center;
            flex: 1;
            padding: 0 2mm;
            line-height: 1.1;
        }
        .rep-text {
            font-size: 5pt;
            font-weight: 800;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .min-text {
            font-size: 4.8pt;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
        }
        .school-title {
            font-size: 6.8pt;
            font-weight: 900;
            color: #0f172a;
            text-transform: uppercase;
            margin-top: 0.5mm;
            letter-spacing: 0.2px;
        }

        /* Bandeau Nom de la carte */
        .card-ribbon {
            background: #0f172a;
            color: white;
            text-align: center;
            font-size: 5.5pt;
            font-weight: 900;
            letter-spacing: 1px;
            text-transform: uppercase;
            padding: 1mm 2mm;
            border-radius: 2px;
            margin: 1.5mm 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            z-index: 2;
        }
        .ay-badge {
            background: #10b981;
            color: white;
            padding: 0.3mm 2mm;
            border-radius: 2px;
            font-size: 5pt;
            font-weight: 900;
        }

        /* Corps de la carte (Photo + Infos) */
        .card-body {
            display: flex;
            gap: 2.5mm;
            flex: 1;
            align-items: center;
            position: relative;
            z-index: 2;
        }
        .photo-frame {
            width: 18mm;
            height: 22mm;
            border: 1px solid #cbd5e1;
            border-radius: 3px;
            background: #f8fafc;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            shrink: 0;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
        }
        .photo-silhouette {
            width: 10mm;
            height: 10mm;
            color: #94a3b8;
        }
        .photo-caption {
            font-size: 4pt;
            font-weight: 800;
            color: #94a3b8;
            margin-top: 1mm;
            text-transform: uppercase;
        }
        .photo-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .student-details {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 0.6mm;
        }
        .student-name {
            font-size: 7.2pt;
            font-weight: 900;
            color: #0f172a;
            text-transform: uppercase;
            line-height: 1.15;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .detail-row {
            display: flex;
            align-items: baseline;
            font-size: 5.5pt;
            line-height: 1.2;
        }
        .detail-label {
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            width: 16mm;
            shrink: 0;
        }
        .detail-value {
            font-weight: 900;
            color: #1e293b;
            text-transform: uppercase;
        }
        .matricule-box {
            display: inline-block;
            background: #f1f5f9;
            border: 0.8px solid #cbd5e1;
            padding: 0.4mm 1.8mm;
            border-radius: 2px;
            font-family: monospace;
            font-weight: 900;
            font-size: 6.5pt;
            letter-spacing: 0.8px;
            color: #0f172a;
        }

        /* Pied de la carte */
        .card-footer {
            border-top: 0.8px solid #e2e8f0;
            padding-top: 1mm;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            position: relative;
            z-index: 2;
        }
        .barcode-area {
            width: 25mm;
            height: 6mm;
        }
        .barcode-bars {
            width: 100%;
            height: 100%;
        }
        .signature-area {
            text-align: center;
        }
        .signature-title {
            font-size: 4.8pt;
            font-weight: 800;
            color: #475569;
            text-transform: uppercase;
        }
        .signature-sub {
            font-size: 4pt;
            font-style: italic;
            color: #94a3b8;
            margin-top: 1.5mm;
        }

        /* ── IMPRESSION ─────────────────────────────────────────────────── */
        @media print {
            .no-print { display: none !important; }
            body { background: white; margin: 0; padding: 0; }
            .sheet-container {
                margin: 0;
                padding: 8mm 6mm;
                box-shadow: none;
                page-break-after: always;
            }
            .sheet-container:last-child {
                page-break-after: auto;
            }
            @page {
                size: A4 portrait;
                margin: 0;
            }
        }
    </style>
</head>
<body>

<!-- BARRE D'ACTION SUPÉRIEURE (NON IMPRIMÉE) -->
<div class="no-print no-print-bar">
    <div style="display:flex;align-items:center;gap:12px;">
        <span style="font-size:13px;font-weight:900;letter-spacing:1px;text-transform:uppercase;">
            Cartes d'Identité Scolaires (Badges)
        </span>
        <span style="background:rgba(255,255,255,0.15);padding:3px 10px;border-radius:20px;font-size:11px;font-weight:800;">
            {{ $students->count() }} élève(s)
        </span>
        @if($school->name)
            <span style="font-size:11px;opacity:0.7;">— {{ $school->name }}</span>
        @endif
    </div>
    <div style="display:flex;gap:10px;">
        <button onclick="window.print()" class="btn-print">
            <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Imprimer les Badges (A4)
        </button>
        <button onclick="window.close()" class="btn-close">
            Fermer
        </button>
    </div>
</div>

@php
    // Découper les élèves en paquets de 8 badges par page A4 (2 colonnes x 4 rangées)
    $chunks = $students->chunk(8);
@endphp

@forelse($chunks as $chunk)
<div class="sheet-container">
    @foreach($chunk as $student)
    <div class="id-card">
        <!-- Liseré drapeau -->
        <div class="cm-flag-stripe">
            <div class="cm-flag-green"></div>
            <div class="cm-flag-red"></div>
            <div class="cm-flag-yellow"></div>
        </div>

        <!-- Filigrane discret -->
        <svg class="card-watermark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#000" stroke-width="2"/>
            <path d="M 32 30 L 50 24 L 68 30 L 68 55 C 68 68 50 78 50 78 C 50 78 32 68 32 55 Z" fill="#000"/>
        </svg>

        <!-- En-tête officiel du badge -->
        <div class="card-header">
            @if($logoBase64)
                <img src="{{ $logoBase64 }}" class="card-header-logo" alt="Logo">
            @else
                <svg class="card-header-seal" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="46" fill="#15803d" stroke="#166534" stroke-width="2"/>
                    <circle cx="50" cy="50" r="40" fill="#b91c1c"/>
                    <polygon points="50,30 54,42 67,42 56,50 60,62 50,54 40,62 44,50 33,42 46,42" fill="#eab308"/>
                </svg>
            @endif

            <div class="card-header-text">
                <div class="rep-text">RÉPUBLIQUE DU CAMEROUN</div>
                <div class="min-text">MINESEC — ENSEIGNEMENT SECONDAIRE</div>
                <div class="school-title">{{ $school->name }}</div>
            </div>

            <svg class="card-header-seal" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
                <polygon points="50,22 56,38 72,38 59,48 64,64 50,54 36,64 41,48 28,38 44,38" fill="#eab308"/>
            </svg>
        </div>

        <!-- Bandeau titre badge -->
        <div class="card-ribbon">
            <span>CARTE D'IDENTITÉ SCOLAIRE</span>
            <span class="ay-badge">{{ $academicYear }}</span>
        </div>

        <!-- Corps du badge -->
        <div class="card-body">
            <!-- Cadre Photo d'identité -->
            <div class="photo-frame">
                @php
                    $studentPhotoBase64 = null;
                    if (!empty($student->photo_path)) {
                        if (str_starts_with($student->photo_path, 'http')) {
                            $studentPhotoBase64 = $student->photo_path;
                        } else {
                            $cleanStudentPath = preg_replace('#^storage/#', '', $student->photo_path);
                            $photoCandidates = [
                                storage_path('app/public/' . $cleanStudentPath),
                                public_path('storage/' . $cleanStudentPath),
                                public_path($cleanStudentPath),
                            ];
                            foreach ($photoCandidates as $pPath) {
                                if (file_exists($pPath) && is_file($pPath)) {
                                    $ext = strtolower(pathinfo($pPath, PATHINFO_EXTENSION));
                                    $mime = in_array($ext, ['jpg', 'jpeg']) ? 'image/jpeg' : (($ext === 'png') ? 'image/png' : 'image/' . $ext);
                                    $studentPhotoBase64 = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($pPath));
                                    break;
                                }
                            }
                            if (!$studentPhotoBase64) {
                                $studentPhotoBase64 = asset('storage/' . $cleanStudentPath);
                            }
                        }
                    }
                @endphp
                @if($studentPhotoBase64)
                    <img src="{{ $studentPhotoBase64 }}" class="photo-img" alt="Photo {{ $student->nom }}">
                @else
                    <svg class="photo-silhouette" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span class="photo-caption">PHOTO</span>
                @endif
            </div>

            <!-- Détails de l'élève -->
            <div class="student-details">
                <div class="student-name">{{ $student->nom }} {{ $student->prenom }}</div>

                <div class="detail-row" style="margin-top: 0.8mm;">
                    <span class="detail-label">Matricule</span>
                    <span class="matricule-box">{{ $student->MATRICULE ?? 'N/A' }}</span>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Classe</span>
                    <span class="detail-value" style="color:#059669;">
                        {{ is_object($student->classe) ? ($student->classe->nom ?? '—') : '—' }}
                        @if(is_object($student->classe) && !empty($student->classe->section))
                            ({{ strtoupper($student->classe->section) }})
                        @endif
                    </span>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Sexe / Statut</span>
                    <span class="detail-value">
                        {{ $student->sexe ?? '—' }} &nbsp;|&nbsp;
                        @if($student->redoublant) Redoublant @else Nouveau @endif
                    </span>
                </div>

                @if($student->telephone ?? $school->contacts)
                <div class="detail-row">
                    <span class="detail-label">Contact</span>
                    <span class="detail-value" style="font-size: 5pt; color: #64748b;">
                        {{ $student->telephone ?? $school->contacts }}
                    </span>
                </div>
                @endif
            </div>
        </div>

        <!-- Pied de carte avec Code-barres & Signature -->
        <div class="card-footer">
            <div class="barcode-area">
                <!-- Code barre vectoriel stylisé basé sur le matricule -->
                <svg class="barcode-bars" viewBox="0 0 100 20" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="0" width="2" height="20" fill="#0f172a"/>
                    <rect x="4" y="0" width="1" height="20" fill="#0f172a"/>
                    <rect x="7" y="0" width="3" height="20" fill="#0f172a"/>
                    <rect x="12" y="0" width="1" height="20" fill="#0f172a"/>
                    <rect x="15" y="0" width="4" height="20" fill="#0f172a"/>
                    <rect x="21" y="0" width="2" height="20" fill="#0f172a"/>
                    <rect x="25" y="0" width="1" height="20" fill="#0f172a"/>
                    <rect x="28" y="0" width="3" height="20" fill="#0f172a"/>
                    <rect x="33" y="0" width="2" height="20" fill="#0f172a"/>
                    <rect x="37" y="0" width="1" height="20" fill="#0f172a"/>
                    <rect x="40" y="0" width="3" height="20" fill="#0f172a"/>
                    <rect x="45" y="0" width="2" height="20" fill="#0f172a"/>
                    <rect x="49" y="0" width="1" height="20" fill="#0f172a"/>
                    <rect x="52" y="0" width="4" height="20" fill="#0f172a"/>
                    <rect x="58" y="0" width="1" height="20" fill="#0f172a"/>
                    <rect x="61" y="0" width="3" height="20" fill="#0f172a"/>
                    <rect x="66" y="0" width="2" height="20" fill="#0f172a"/>
                    <rect x="70" y="0" width="1" height="20" fill="#0f172a"/>
                    <rect x="73" y="0" width="4" height="20" fill="#0f172a"/>
                    <rect x="79" y="0" width="2" height="20" fill="#0f172a"/>
                    <rect x="83" y="0" width="1" height="20" fill="#0f172a"/>
                    <rect x="86" y="0" width="3" height="20" fill="#0f172a"/>
                    <rect x="91" y="0" width="2" height="20" fill="#0f172a"/>
                    <rect x="95" y="0" width="1" height="20" fill="#0f172a"/>
                    <rect x="98" y="0" width="2" height="20" fill="#0f172a"/>
                </svg>
            </div>

            <div class="signature-area">
                <div class="signature-title">Le Chef d'Établissement</div>
                <div class="signature-sub">Signature &amp; Cachet</div>
            </div>
        </div>
    </div>
    @endforeach
</div>
@empty
<div style="text-align:center;padding:100px 20px;font-family:sans-serif;">
    <h2 style="font-size:20px;color:#64748b;">Aucun élève trouvé pour générer les cartes d'identité.</h2>
</div>
@endforelse

</body>
</html>

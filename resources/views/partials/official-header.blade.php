@php
    // Extraction sécurisée des données de l'école (compatible Model Eloquent ou Array)
    $schoolName = is_array($school) ? ($school['name'] ?? 'ÉTABLISSEMENT SCOLAIRE') : ($school->name ?? 'ÉTABLISSEMENT SCOLAIRE');
    $schoolCity = is_array($school) ? ($school['city'] ?? '') : ($school->city ?? '');
    $schoolContacts = is_array($school) ? ($school['contacts'] ?? '') : ($school->contacts ?? '');
    $schoolYear = is_array($school) ? ($school['academic_year'] ?? '2025/2026') : ($school->academic_year ?? '2025/2026');
    $schoolCode = is_array($school) ? ($school['code'] ?? null) : ($school->code ?? null);
    $customRegion = is_array($school) ? ($school['region'] ?? null) : ($school->region ?? null);
    $customDept = is_array($school) ? ($school['departement'] ?? null) : ($school->departement ?? null);
    $rawLogo = is_array($school) ? ($school['logo_path'] ?? null) : ($school->logo_path ?? null);

    // Détermination de la Délégation Régionale et Départementale selon la ville
    $cityLower = mb_strtolower(trim($schoolCity));
    $regionFr = "DU CENTRE";
    $regionEn = "FOR THE CENTRE";
    $deptFr   = "DU MFOUNDI";
    $deptEn   = "FOR MFOUNDI";

    if (!empty($customRegion)) {
        $regUpper = mb_strtoupper(trim($customRegion));
        $regionFr = str_starts_with($regUpper, 'DU ') || str_starts_with($regUpper, 'DE ') || str_starts_with($regUpper, "D'") ? $regUpper : "DU " . $regUpper;
        $regionEn = $regUpper;
    } elseif (str_contains($cityLower, 'douala')) {
        $regionFr = "DU LITTORAL";
        $regionEn = "FOR THE LITTORAL";
        $deptFr   = "DU WOURI";
        $deptEn   = "FOR WOURI";
    } elseif (str_contains($cityLower, 'bafoussam')) {
        $regionFr = "DE L'OUEST";
        $regionEn = "FOR THE WEST";
        $deptFr   = "DE LA MIFI";
        $deptEn   = "FOR MIFI";
    } elseif (str_contains($cityLower, 'bamenda')) {
        $regionFr = "DU NORD-OUEST";
        $regionEn = "FOR THE NORTH-WEST";
        $deptFr   = "DE LA MEZAM";
        $deptEn   = "FOR MEZAM";
    } elseif (str_contains($cityLower, 'buea') || str_contains($cityLower, 'limbe')) {
        $regionFr = "DU SUD-OUEST";
        $regionEn = "FOR THE SOUTH-WEST";
        $deptFr   = "DU FAKO";
        $deptEn   = "FOR FAKO";
    } elseif (str_contains($cityLower, 'garoua')) {
        $regionFr = "DU NORD";
        $regionEn = "FOR THE NORTH";
        $deptFr   = "DE LA BÉNOUÉ";
        $deptEn   = "FOR BENOUE";
    } elseif (str_contains($cityLower, 'maroua')) {
        $regionFr = "DE L'EXTRÊME-NORD";
        $regionEn = "FOR THE FAR NORTH";
        $deptFr   = "DU DIAMARÉ";
        $deptEn   = "FOR DIAMARE";
    } elseif (str_contains($cityLower, 'ngaound')) {
        $regionFr = "DE L'ADAMAOUA";
        $regionEn = "FOR ADAMAWA";
        $deptFr   = "DE LA VINA";
        $deptEn   = "FOR VINA";
    } elseif (str_contains($cityLower, 'bertoua')) {
        $regionFr = "DE L'EST";
        $regionEn = "FOR THE EAST";
        $deptFr   = "DU LOM-ET-DJÉREM";
        $deptEn   = "FOR LOM-AND-DJEREM";
    } elseif (str_contains($cityLower, 'ebolowa')) {
        $regionFr = "DU SUD";
        $regionEn = "FOR THE SOUTH";
        $deptFr   = "DE LA MVILA";
        $deptEn   = "FOR MVILA";
    } elseif (str_contains($cityLower, 'kribi')) {
        $regionFr = "DU SUD";
        $regionEn = "FOR THE SOUTH";
        $deptFr   = "DE L'OCÉAN";
        $deptEn   = "FOR OCEAN";
    } elseif (!empty($schoolCity)) {
        $regionFr = "RÉGIONALE";
        $regionEn = "REGIONAL";
        $deptFr   = "DÉPARTEMENTALE (" . mb_strtoupper($schoolCity) . ")";
        $deptEn   = "DIVISIONAL (" . mb_strtoupper($schoolCity) . ")";
    }

    if (!empty($customDept)) {
        $deptUpper = mb_strtoupper(trim($customDept));
        $deptFr = str_starts_with($deptUpper, 'DU ') || str_starts_with($deptUpper, 'DE ') || str_starts_with($deptUpper, "D'") ? $deptUpper : "DU " . $deptUpper;
        $deptEn = $deptUpper;
    }

    // Résolution universelle du logo en Base64 (compatible DomPDF & Navigateur)
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

    $headerTheme = $themeColor ?? '#059669';
@endphp

<div class="minesec-header-wrapper">
    <table class="minesec-header-table">
        <tr>
            {{-- Colonne GAUCHE : Français --}}
            <td class="minesec-col minesec-col-left">
                <div class="m-republic">RÉPUBLIQUE DU CAMEROUN</div>
                <div class="m-motto">Paix – Travail – Patrie</div>
                <div class="m-divider">❖ ❖ ❖</div>
                <div class="m-ministry">MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES</div>
                <div class="m-delegation">DÉLÉGATION RÉGIONALE {{ $regionFr }}</div>
                <div class="m-delegation">DÉLÉGATION DÉPARTEMENTALE {{ $deptFr }}</div>
                <div class="m-school">{{ $schoolName }}</div>
                @if($schoolContacts || $schoolCity)
                    <div class="m-contacts">
                        @if($schoolCity){{ $schoolCity }} @endif
                        @if($schoolContacts && $schoolCity)— @endif
                        @if($schoolContacts)Tél : {{ $schoolContacts }}@endif
                    </div>
                @endif
            </td>

            {{-- Colonne CENTRALE : Armoiries / Logo & Année Académique --}}
            <td class="minesec-col minesec-col-center">
                <div class="m-logo-box">
                    @if($logoBase64)
                        <img src="{{ $logoBase64 }}" class="m-logo-img" alt="Logo de l'établissement">
                    @else
                        {{-- Armoiries / Sceau Républicain Vectoriel Officiel --}}
                        <div class="m-national-seal">
                            <svg viewBox="0 0 100 100" class="m-seal-svg" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="{{ $headerTheme }}" stroke-width="3"/>
                                <circle cx="50" cy="50" r="41" fill="none" stroke="{{ $headerTheme }}" stroke-width="1" stroke-dasharray="2,2"/>
                                <!-- Écu tricolore vert rouge jaune -->
                                <path d="M 32 30 L 50 24 L 68 30 L 68 55 C 68 68 50 78 50 78 C 50 78 32 68 32 55 Z" fill="#ffffff" stroke="{{ $headerTheme }}" stroke-width="1.5"/>
                                <path d="M 33 31 L 44 27 L 44 71 C 38 66 33 59 33 54 Z" fill="#15803d"/>
                                <path d="M 44 27 L 56 27 L 56 75 C 50 77 50 77 44 75 Z" fill="#b91c1c"/>
                                <path d="M 56 27 L 67 31 L 67 54 C 67 59 62 66 56 71 Z" fill="#eab308"/>
                                <!-- Étoile d'or au centre -->
                                <polygon points="50,42 52.5,49 60,49 54,53.5 56.5,60.5 50,56 43.5,60.5 46,53.5 40,49 47.5,49" fill="#fef08a" stroke="#ca8a04" stroke-width="0.5"/>
                                <!-- Balance de la justice / Épée stylisée -->
                                <line x1="50" y1="32" x2="50" y2="40" stroke="#ffffff" stroke-width="1.5"/>
                                <line x1="43" y1="36" x2="57" y2="36" stroke="#ffffff" stroke-width="1.5"/>
                            </svg>
                        </div>
                    @endif
                </div>
                <div class="m-academic-box" style="border-color: {{ $headerTheme }};">
                    <div class="m-academic-label">ANNÉE SCOLAIRE / ACADEMIC YEAR</div>
                    <div class="m-academic-val" style="color: {{ $headerTheme }};">{{ $schoolYear }}</div>
                </div>
                @if(!empty($schoolCode))
                <div class="m-academic-box" style="border-color: {{ $headerTheme }}; margin-top: 3px;">
                    <div class="m-academic-label">CODE ÉTABLISSEMENT / CODE</div>
                    <div class="m-academic-val" style="color: {{ $headerTheme }}; font-size: 7.5pt; letter-spacing: 1px;">{{ $schoolCode }}</div>
                </div>
                @endif
            </td>

            {{-- Colonne DROITE : Anglais --}}
            <td class="minesec-col minesec-col-right">
                <div class="m-republic">REPUBLIC OF CAMEROON</div>
                <div class="m-motto">Peace – Work – Fatherland</div>
                <div class="m-divider">❖ ❖ ❖</div>
                <div class="m-ministry">MINISTRY OF SECONDARY EDUCATION</div>
                <div class="m-delegation">REGIONAL DELEGATION {{ $regionEn }}</div>
                <div class="m-delegation">DIVISIONAL DELEGATION {{ $deptEn }}</div>
                <div class="m-school">{{ $schoolName }}</div>
                @if($schoolContacts || $schoolCity)
                    <div class="m-contacts">
                        @if($schoolCity){{ $schoolCity }} @endif
                        @if($schoolContacts && $schoolCity)— @endif
                        @if($schoolContacts)Tel : {{ $schoolContacts }}@endif
                    </div>
                @endif
            </td>
        </tr>
    </table>

    {{-- Bandeau Titre Officiel du Document --}}
    @if(isset($documentTitle))
        <div class="minesec-banner" style="background: {{ $headerTheme }};">
            <div class="minesec-title">{{ $documentTitle }}</div>
            @if(isset($documentSubtitle))
                <div class="minesec-subtitle">{{ $documentSubtitle }}</div>
            @endif
        </div>
    @endif
</div>

<style>
    .minesec-header-wrapper {
        width: 100%;
        margin-bottom: 12px;
        font-family: 'DejaVu Sans', 'Helvetica Neue', Arial, sans-serif;
    }
    .minesec-header-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }
    .minesec-col {
        vertical-align: top;
        text-align: center;
        padding: 0 4px;
    }
    .minesec-col-left {
        width: 38%;
    }
    .minesec-col-center {
        width: 24%;
        vertical-align: middle;
    }
    .minesec-col-right {
        width: 38%;
    }

    .m-republic {
        font-size: 8.5pt;
        font-weight: 900;
        letter-spacing: 0.5px;
        color: #111827;
        text-transform: uppercase;
        line-height: 1.2;
    }
    .m-motto {
        font-size: 7pt;
        font-style: italic;
        font-weight: 600;
        color: #4b5563;
        margin-top: 1px;
    }
    .m-divider {
        font-size: 5pt;
        letter-spacing: 2px;
        color: #9ca3af;
        margin: 2px 0;
    }
    .m-ministry {
        font-size: 7pt;
        font-weight: 800;
        color: #1f2937;
        text-transform: uppercase;
        line-height: 1.2;
    }
    .m-delegation {
        font-size: 6.5pt;
        font-weight: 700;
        color: #374151;
        text-transform: uppercase;
        line-height: 1.2;
        margin-top: 1px;
    }
    .m-school {
        font-size: 7.5pt;
        font-weight: 900;
        color: #111827;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        margin-top: 3px;
        border-top: 0.5px solid #d1d5db;
        padding-top: 2px;
    }
    .m-contacts {
        font-size: 6pt;
        font-weight: 500;
        color: #6b7280;
        margin-top: 1px;
    }

    .m-logo-box {
        text-align: center;
        margin-bottom: 4px;
    }
    .m-logo-img {
        max-height: 58px;
        max-width: 95px;
        object-fit: contain;
        display: inline-block;
    }
    .m-national-seal {
        display: inline-block;
        width: 52px;
        height: 52px;
    }
    .m-seal-svg {
        width: 100%;
        height: 100%;
    }

    .m-academic-box {
        display: inline-block;
        border: 1.5px solid #10b981;
        border-radius: 4px;
        padding: 2px 6px;
        background: #ffffff;
        margin-top: 2px;
    }
    .m-academic-label {
        font-size: 5.5pt;
        font-weight: 800;
        color: #4b5563;
        letter-spacing: 0.3px;
        text-transform: uppercase;
    }
    .m-academic-val {
        font-size: 8pt;
        font-weight: 900;
        letter-spacing: 1px;
    }

    .minesec-banner {
        width: 100%;
        margin-top: 8px;
        padding: 5px 10px;
        text-align: center;
        border-radius: 3px;
        color: #ffffff;
    }
    .minesec-title {
        font-size: 10pt;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        line-height: 1.2;
    }
    .minesec-subtitle {
        font-size: 7pt;
        font-weight: 600;
        letter-spacing: 0.5px;
        opacity: 0.95;
        margin-top: 2px;
        text-transform: uppercase;
    }
</style>

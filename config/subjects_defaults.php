<?php

/**
 * Matières par défaut et coefficients pour le système éducatif camerounais.
 * 
 * Structure : section → level_order → variante → [matières]
 * 
 * Le proviseur peut librement ajouter, modifier ou supprimer les matières
 * après la création de la classe. Ces valeurs sont uniquement les défauts.
 */

return [

    // ────────────────────────────────────────────────────────────────────────
    // 1. SUB-SYSTÈME FRANCOPHONE
    // ────────────────────────────────────────────────────────────────────────
    'francophone' => [

        // ─── SIXIÈME (Niveau 1) ───
        1 => [
            'default' => [
                ['nom' => 'Français', 'coef' => 5],
                ['nom' => 'Anglais', 'coef' => 3],
                ['nom' => 'Mathématiques', 'coef' => 5],
                ['nom' => 'Sciences de la Vie et de la Terre', 'coef' => 2],
                ['nom' => 'Physique-Chimie', 'coef' => 2],
                ['nom' => 'Histoire-Géographie', 'coef' => 2],
                ['nom' => 'Éducation Civique', 'coef' => 2],
                ['nom' => 'Éducation Physique et Sportive', 'coef' => 2],
                ['nom' => 'Informatique', 'coef' => 2],
                ['nom' => 'Travail Manuel', 'coef' => 1],
                ['nom' => 'Dessin / Arts Plastiques', 'coef' => 1],
                ['nom' => 'Musique', 'coef' => 1],
                ['nom' => 'Économie Sociale et Familiale', 'coef' => 1],
            ],
        ],

        // ─── CINQUIÈME (Niveau 2) ───
        2 => [
            'default' => [
                ['nom' => 'Français', 'coef' => 5],
                ['nom' => 'Anglais', 'coef' => 3],
                ['nom' => 'Mathématiques', 'coef' => 5],
                ['nom' => 'Sciences de la Vie et de la Terre', 'coef' => 2],
                ['nom' => 'Physique-Chimie', 'coef' => 2],
                ['nom' => 'Histoire-Géographie', 'coef' => 2],
                ['nom' => 'Éducation Civique', 'coef' => 2],
                ['nom' => 'Éducation Physique et Sportive', 'coef' => 2],
                ['nom' => 'Informatique', 'coef' => 2],
                ['nom' => 'Travail Manuel', 'coef' => 1],
                ['nom' => 'Dessin / Arts Plastiques', 'coef' => 1],
                ['nom' => 'Musique', 'coef' => 1],
                ['nom' => 'Économie Sociale et Familiale', 'coef' => 1],
            ],
        ],

        // ─── QUATRIÈME (Niveau 3) ───
        3 => [
            'default' => [
                ['nom' => 'Français', 'coef' => 5],
                ['nom' => 'Anglais', 'coef' => 3],
                ['nom' => 'Mathématiques', 'coef' => 5],
                ['nom' => 'Sciences de la Vie et de la Terre', 'coef' => 2],
                ['nom' => 'Physique-Chimie', 'coef' => 2],
                ['nom' => 'Histoire-Géographie', 'coef' => 2],
                ['nom' => 'Éducation Civique', 'coef' => 2],
                ['nom' => 'Éducation Physique et Sportive', 'coef' => 2],
                ['nom' => 'Informatique', 'coef' => 2],
                ['nom' => 'Travail Manuel', 'coef' => 1],
                ['nom' => 'LV2', 'coef' => 2], // Remplacé par Espagnol, Allemand, etc.
            ],
        ],

        // ─── TROISIÈME (Niveau 4) ───
        4 => [
            'default' => [
                ['nom' => 'Français', 'coef' => 5],
                ['nom' => 'Anglais', 'coef' => 3],
                ['nom' => 'Mathématiques', 'coef' => 5],
                ['nom' => 'Sciences de la Vie et de la Terre', 'coef' => 2],
                ['nom' => 'Physique-Chimie', 'coef' => 2],
                ['nom' => 'Histoire-Géographie', 'coef' => 2],
                ['nom' => 'Éducation Civique', 'coef' => 2],
                ['nom' => 'Éducation Physique et Sportive', 'coef' => 2],
                ['nom' => 'Informatique', 'coef' => 2],
                ['nom' => 'Travail Manuel', 'coef' => 1],
                ['nom' => 'LV2', 'coef' => 2],
            ],
        ],

        // ─── SECONDE (Niveau 5) ───
        5 => [
            'A4' => [
                ['nom' => 'Français', 'coef' => 5],
                ['nom' => 'Anglais', 'coef' => 4],
                ['nom' => 'LV2', 'coef' => 4],
                ['nom' => 'Mathématiques', 'coef' => 4],
                ['nom' => 'Philosophie', 'coef' => 3],
                ['nom' => 'Histoire-Géographie', 'coef' => 3],
                ['nom' => 'Éducation Civique', 'coef' => 1],
                ['nom' => 'Sciences de la Vie et de la Terre', 'coef' => 2],
                ['nom' => 'Physique-Chimie', 'coef' => 2],
                ['nom' => 'Éducation Physique et Sportive', 'coef' => 2],
                ['nom' => 'Informatique', 'coef' => 2],
            ],
            'C' => [
                ['nom' => 'Français', 'coef' => 4],
                ['nom' => 'Anglais', 'coef' => 3],
                ['nom' => 'Mathématiques', 'coef' => 6],
                ['nom' => 'Physique-Chimie', 'coef' => 5],
                ['nom' => 'Sciences de la Vie et de la Terre', 'coef' => 3],
                ['nom' => 'Histoire-Géographie', 'coef' => 2],
                ['nom' => 'Éducation Civique', 'coef' => 1],
                ['nom' => 'Éducation Physique et Sportive', 'coef' => 2],
                ['nom' => 'Informatique', 'coef' => 2],
                ['nom' => 'Philosophie', 'coef' => 2],
            ],
        ],

        // ─── PREMIÈRE (Niveau 6) ───
        6 => [
            'A4' => [
                ['nom' => 'Français', 'coef' => 5],
                ['nom' => 'Anglais', 'coef' => 4],
                ['nom' => 'LV2', 'coef' => 4],
                ['nom' => 'Mathématiques', 'coef' => 3],
                ['nom' => 'Philosophie', 'coef' => 5],
                ['nom' => 'Histoire-Géographie', 'coef' => 3],
                ['nom' => 'Éducation Civique', 'coef' => 1],
                ['nom' => 'Sciences de la Vie et de la Terre', 'coef' => 2],
                ['nom' => 'Physique-Chimie', 'coef' => 2],
                ['nom' => 'Éducation Physique et Sportive', 'coef' => 2],
                ['nom' => 'Informatique', 'coef' => 2],
            ],
            'C' => [
                ['nom' => 'Français', 'coef' => 3],
                ['nom' => 'Anglais', 'coef' => 3],
                ['nom' => 'Mathématiques', 'coef' => 7],
                ['nom' => 'Physique-Chimie', 'coef' => 6],
                ['nom' => 'Sciences de la Vie et de la Terre', 'coef' => 3],
                ['nom' => 'Histoire-Géographie', 'coef' => 2],
                ['nom' => 'Éducation Civique', 'coef' => 1],
                ['nom' => 'Éducation Physique et Sportive', 'coef' => 2],
                ['nom' => 'Informatique', 'coef' => 2],
                ['nom' => 'Philosophie', 'coef' => 2],
            ],
            'D' => [
                ['nom' => 'Français', 'coef' => 4],
                ['nom' => 'Anglais', 'coef' => 3],
                ['nom' => 'Mathématiques', 'coef' => 5],
                ['nom' => 'Physique-Chimie', 'coef' => 4],
                ['nom' => 'Sciences de la Vie et de la Terre', 'coef' => 5],
                ['nom' => 'Histoire-Géographie', 'coef' => 2],
                ['nom' => 'Éducation Civique', 'coef' => 1],
                ['nom' => 'Éducation Physique et Sportive', 'coef' => 2],
                ['nom' => 'Informatique', 'coef' => 2],
                ['nom' => 'Philosophie', 'coef' => 2],
            ],
        ],

        // ─── TERMINALE (Niveau 7) ───
        7 => [
            'A4' => [
                ['nom' => 'Français', 'coef' => 5],
                ['nom' => 'Anglais', 'coef' => 4],
                ['nom' => 'LV2', 'coef' => 4],
                ['nom' => 'Mathématiques', 'coef' => 3],
                ['nom' => 'Philosophie', 'coef' => 6],
                ['nom' => 'Histoire-Géographie', 'coef' => 3],
                ['nom' => 'Éducation Civique', 'coef' => 1],
                ['nom' => 'Sciences de la Vie et de la Terre', 'coef' => 2],
                ['nom' => 'Physique-Chimie', 'coef' => 2],
                ['nom' => 'Éducation Physique et Sportive', 'coef' => 2],
                ['nom' => 'Informatique', 'coef' => 2],
            ],
            'C' => [
                ['nom' => 'Français', 'coef' => 3],
                ['nom' => 'Anglais', 'coef' => 3],
                ['nom' => 'Mathématiques', 'coef' => 7],
                ['nom' => 'Physique-Chimie', 'coef' => 6],
                ['nom' => 'Sciences de la Vie et de la Terre', 'coef' => 3],
                ['nom' => 'Histoire-Géographie', 'coef' => 2],
                ['nom' => 'Éducation Civique', 'coef' => 1],
                ['nom' => 'Éducation Physique et Sportive', 'coef' => 2],
                ['nom' => 'Informatique', 'coef' => 2],
                ['nom' => 'Philosophie', 'coef' => 2],
            ],
            'D' => [
                ['nom' => 'Français', 'coef' => 4],
                ['nom' => 'Anglais', 'coef' => 3],
                ['nom' => 'Mathématiques', 'coef' => 5],
                ['nom' => 'Physique-Chimie', 'coef' => 4],
                ['nom' => 'Sciences de la Vie et de la Terre', 'coef' => 5],
                ['nom' => 'Histoire-Géographie', 'coef' => 2],
                ['nom' => 'Éducation Civique', 'coef' => 1],
                ['nom' => 'Éducation Physique et Sportive', 'coef' => 2],
                ['nom' => 'Informatique', 'coef' => 2],
                ['nom' => 'Philosophie', 'coef' => 2],
            ],
        ],
    ],

    // ────────────────────────────────────────────────────────────────────────
    // 2. ANGLOPHONE SUB-SYSTEM (GCE Board System)
    // ────────────────────────────────────────────────────────────────────────
    'anglophone' => [

        // ─── FORM 1 (Niveau 1) & FORM 2 (Niveau 2) ───
        1 => [
            'default' => [
                ['nom' => 'English Language', 'coef' => 5],
                ['nom' => 'French', 'coef' => 3],
                ['nom' => 'Mathematics', 'coef' => 5],
                ['nom' => 'General Science', 'coef' => 3],
                ['nom' => 'History', 'coef' => 2],
                ['nom' => 'Geography', 'coef' => 2],
                ['nom' => 'Citizenship Education', 'coef' => 2],
                ['nom' => 'Computer Studies', 'coef' => 2],
                ['nom' => 'Physical Education', 'coef' => 2],
                ['nom' => 'Home Economics', 'coef' => 1],
                ['nom' => 'Manual Arts', 'coef' => 1],
            ],
        ],
        2 => [
            'default' => [
                ['nom' => 'English Language', 'coef' => 5],
                ['nom' => 'French', 'coef' => 3],
                ['nom' => 'Mathematics', 'coef' => 5],
                ['nom' => 'General Science', 'coef' => 3],
                ['nom' => 'History', 'coef' => 2],
                ['nom' => 'Geography', 'coef' => 2],
                ['nom' => 'Citizenship Education', 'coef' => 2],
                ['nom' => 'Computer Studies', 'coef' => 2],
                ['nom' => 'Physical Education', 'coef' => 2],
                ['nom' => 'Home Economics', 'coef' => 1],
                ['nom' => 'Manual Arts', 'coef' => 1],
            ],
        ],

        // ─── FORM 3 (Niveau 3), FORM 4 (Niveau 4), FORM 5 (Niveau 5) — GCE O-Level ───
        3 => [
            'default' => [
                ['nom' => 'English Language', 'coef' => 5],
                ['nom' => 'Mathematics', 'coef' => 5],
                ['nom' => 'French', 'coef' => 3],
                ['nom' => 'Biology', 'coef' => 3],
                ['nom' => 'Chemistry', 'coef' => 3],
                ['nom' => 'Physics', 'coef' => 3],
                ['nom' => 'History', 'coef' => 3],
                ['nom' => 'Geography', 'coef' => 3],
                ['nom' => 'Economics', 'coef' => 3],
                ['nom' => 'Computer Science', 'coef' => 2],
                ['nom' => 'Citizenship Education', 'coef' => 2],
                ['nom' => 'Physical Education', 'coef' => 2],
            ],
        ],
        4 => [
            'default' => [
                ['nom' => 'English Language', 'coef' => 5],
                ['nom' => 'Mathematics', 'coef' => 5],
                ['nom' => 'French', 'coef' => 3],
                ['nom' => 'Biology', 'coef' => 3],
                ['nom' => 'Chemistry', 'coef' => 3],
                ['nom' => 'Physics', 'coef' => 3],
                ['nom' => 'History', 'coef' => 3],
                ['nom' => 'Geography', 'coef' => 3],
                ['nom' => 'Economics', 'coef' => 3],
                ['nom' => 'Computer Science', 'coef' => 2],
                ['nom' => 'Citizenship Education', 'coef' => 2],
                ['nom' => 'Physical Education', 'coef' => 2],
            ],
        ],
        5 => [
            'default' => [
                ['nom' => 'English Language', 'coef' => 5],
                ['nom' => 'Mathematics', 'coef' => 5],
                ['nom' => 'French', 'coef' => 3],
                ['nom' => 'Biology', 'coef' => 3],
                ['nom' => 'Chemistry', 'coef' => 3],
                ['nom' => 'Physics', 'coef' => 3],
                ['nom' => 'History', 'coef' => 3],
                ['nom' => 'Geography', 'coef' => 3],
                ['nom' => 'Economics', 'coef' => 3],
                ['nom' => 'Computer Science', 'coef' => 3],
                ['nom' => 'Citizenship Education', 'coef' => 2],
                ['nom' => 'Physical Education', 'coef' => 2],
            ],
        ],

        // ─── LOWER SIXTH (Niveau 6) & UPPER SIXTH (Niveau 7) — GCE A-Level ───
        6 => [
            'default' => [
                ['nom' => 'Pure Mathematics', 'coef' => 5],
                ['nom' => 'Further Mathematics', 'coef' => 5],
                ['nom' => 'Physics', 'coef' => 5],
                ['nom' => 'Chemistry', 'coef' => 5],
                ['nom' => 'Biology', 'coef' => 5],
                ['nom' => 'Literature in English', 'coef' => 5],
                ['nom' => 'History', 'coef' => 5],
                ['nom' => 'Economics', 'coef' => 5],
                ['nom' => 'Geography', 'coef' => 5],
                ['nom' => 'Computer Science', 'coef' => 4],
            ],
        ],
        7 => [
            'default' => [
                ['nom' => 'Pure Mathematics', 'coef' => 5],
                ['nom' => 'Further Mathematics', 'coef' => 5],
                ['nom' => 'Physics', 'coef' => 5],
                ['nom' => 'Chemistry', 'coef' => 5],
                ['nom' => 'Biology', 'coef' => 5],
                ['nom' => 'Literature in English', 'coef' => 5],
                ['nom' => 'History', 'coef' => 5],
                ['nom' => 'Economics', 'coef' => 5],
                ['nom' => 'Geography', 'coef' => 5],
                ['nom' => 'Computer Science', 'coef' => 4],
            ],
        ],
    ],

    // ────────────────────────────────────────────────────────────────────────
    // 3. SECTION BILINGUE (6ème à 3ème)
    // ────────────────────────────────────────────────────────────────────────
    'bilingue' => [
        1 => [
            'default' => [
                ['nom' => 'Français', 'coef' => 5],
                ['nom' => 'English Language', 'coef' => 5], // Anglais bilingue renforcé
                ['nom' => 'Mathématiques', 'coef' => 5],
                ['nom' => 'Sciences de la Vie et de la Terre', 'coef' => 2],
                ['nom' => 'Physique-Chimie', 'coef' => 2],
                ['nom' => 'Histoire-Géographie', 'coef' => 2],
                ['nom' => 'Éducation Civique', 'coef' => 2],
                ['nom' => 'Éducation Physique et Sportive', 'coef' => 2],
                ['nom' => 'Informatique', 'coef' => 2],
                ['nom' => 'Travail Manuel', 'coef' => 1],
                ['nom' => 'Dessin / Arts Plastiques', 'coef' => 1],
                ['nom' => 'Musique', 'coef' => 1],
                ['nom' => 'Économie Sociale et Familiale', 'coef' => 1],
            ],
        ],
        2 => [
            'default' => [
                ['nom' => 'Français', 'coef' => 5],
                ['nom' => 'English Language', 'coef' => 5],
                ['nom' => 'Mathématiques', 'coef' => 5],
                ['nom' => 'Sciences de la Vie et de la Terre', 'coef' => 2],
                ['nom' => 'Physique-Chimie', 'coef' => 2],
                ['nom' => 'Histoire-Géographie', 'coef' => 2],
                ['nom' => 'Éducation Civique', 'coef' => 2],
                ['nom' => 'Éducation Physique et Sportive', 'coef' => 2],
                ['nom' => 'Informatique', 'coef' => 2],
                ['nom' => 'Travail Manuel', 'coef' => 1],
                ['nom' => 'Dessin / Arts Plastiques', 'coef' => 1],
                ['nom' => 'Musique', 'coef' => 1],
                ['nom' => 'Économie Sociale et Familiale', 'coef' => 1],
            ],
        ],
        3 => [
            'default' => [
                ['nom' => 'Français', 'coef' => 5],
                ['nom' => 'English Language', 'coef' => 5],
                ['nom' => 'Mathématiques', 'coef' => 5],
                ['nom' => 'Sciences de la Vie et de la Terre', 'coef' => 2],
                ['nom' => 'Physique-Chimie', 'coef' => 2],
                ['nom' => 'Histoire-Géographie', 'coef' => 2],
                ['nom' => 'Éducation Civique', 'coef' => 2],
                ['nom' => 'Éducation Physique et Sportive', 'coef' => 2],
                ['nom' => 'Informatique', 'coef' => 2],
                ['nom' => 'Travail Manuel', 'coef' => 1],
                ['nom' => 'LV2', 'coef' => 2],
            ],
        ],
        4 => [
            'default' => [
                ['nom' => 'Français', 'coef' => 5],
                ['nom' => 'English Language', 'coef' => 5],
                ['nom' => 'Mathématiques', 'coef' => 5],
                ['nom' => 'Sciences de la Vie et de la Terre', 'coef' => 2],
                ['nom' => 'Physique-Chimie', 'coef' => 2],
                ['nom' => 'Histoire-Géographie', 'coef' => 2],
                ['nom' => 'Éducation Civique', 'coef' => 2],
                ['nom' => 'Éducation Physique et Sportive', 'coef' => 2],
                ['nom' => 'Informatique', 'coef' => 2],
                ['nom' => 'Travail Manuel', 'coef' => 1],
                ['nom' => 'LV2', 'coef' => 2],
            ],
        ],
    ],
];

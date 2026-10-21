<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;

/**
 * Service Cloudinary sans package externe.
 * Utilise l'API Upload REST de Cloudinary directement via cURL.
 */
class CloudinaryService
{
    protected string $cloudName;
    protected string $apiKey;
    protected string $apiSecret;

    public function __construct()
    {
        $this->cloudName = config('services.cloudinary.cloud_name', env('CLOUDINARY_CLOUD_NAME', ''));
        $this->apiKey    = config('services.cloudinary.api_key',    env('CLOUDINARY_API_KEY',    ''));
        $this->apiSecret = config('services.cloudinary.api_secret', env('CLOUDINARY_API_SECRET', ''));
    }

    /**
     * Upload un fichier vers Cloudinary et retourne l'URL sécurisée.
     * Retourne null si la configuration est manquante ou si l'upload échoue.
     */
    public function upload(UploadedFile $file, string $folder = 'mocase/students'): ?string
    {
        if (empty($this->cloudName) || empty($this->apiKey) || empty($this->apiSecret)) {
            return null; // Cloudinary non configuré → fallback au stockage local
        }

        $timestamp  = time();
        $paramsToSign = "folder={$folder}&timestamp={$timestamp}";
        $signature  = hash('sha256', $paramsToSign . $this->apiSecret);

        $url = "https://api.cloudinary.com/v1_1/{$this->cloudName}/image/upload";

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL            => $url,
            CURLOPT_POST           => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POSTFIELDS     => [
                'file'      => new \CURLFile($file->getRealPath(), $file->getMimeType(), $file->getClientOriginalName()),
                'api_key'   => $this->apiKey,
                'timestamp' => $timestamp,
                'folder'    => $folder,
                'signature' => $signature,
            ],
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200 || !$response) {
            \Log::error('Cloudinary upload failed', ['http_code' => $httpCode, 'response' => $response]);
            return null;
        }

        $data = json_decode($response, true);

        return $data['secure_url'] ?? null;
    }

    /**
     * Supprime une image de Cloudinary par son public_id.
     * Le public_id est extrait de l'URL sécurisée.
     */
    public function destroy(string $secureUrl): bool
    {
        if (empty($this->cloudName) || empty($this->apiKey) || empty($this->apiSecret)) {
            return false;
        }

        // Extraire le public_id depuis l'URL Cloudinary
        // Ex: https://res.cloudinary.com/{cloud}/image/upload/v123/mocase/students/abc.jpg
        $pattern = '/\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/';
        if (!preg_match($pattern, $secureUrl, $matches)) {
            return false;
        }
        $publicId = $matches[1];

        $timestamp  = time();
        $signature  = hash('sha256', "public_id={$publicId}&timestamp={$timestamp}" . $this->apiSecret);

        $url = "https://api.cloudinary.com/v1_1/{$this->cloudName}/image/destroy";

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL            => $url,
            CURLOPT_POST           => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POSTFIELDS     => http_build_query([
                'public_id' => $publicId,
                'api_key'   => $this->apiKey,
                'timestamp' => $timestamp,
                'signature' => $signature,
            ]),
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);
        return ($data['result'] ?? '') === 'ok';
    }

    /**
     * Vérifie si une URL est une URL Cloudinary.
     */
    public static function isCloudinaryUrl(string $url): bool
    {
        return str_contains($url, 'res.cloudinary.com');
    }
}

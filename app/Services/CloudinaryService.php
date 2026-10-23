<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;

/**
 * Service Cloudinary sans package externe.
 * Utilise l'API Upload REST de Cloudinary directement via cURL.
 */
class CloudinaryService
{
    protected ?string $cloudName = null;
    protected ?string $apiKey = null;
    protected ?string $apiSecret = null;

    public function __construct()
    {
        $this->cloudName = config('services.cloudinary.cloud_name') ?: env('CLOUDINARY_CLOUD_NAME') ?: null;
        $this->apiKey    = config('services.cloudinary.api_key')    ?: env('CLOUDINARY_API_KEY')    ?: null;
        $this->apiSecret = config('services.cloudinary.api_secret') ?: env('CLOUDINARY_API_SECRET') ?: null;
    }

    /**
     * Vérifie si les identifiants Cloudinary sont présents.
     */
    public function isConfigured(): bool
    {
        return !empty($this->cloudName) && !empty($this->apiKey) && !empty($this->apiSecret);
    }

    /**
     * Upload un fichier vers Cloudinary et retourne l'URL sécurisée.
     * Retourne null si la configuration est manquante ou si l'upload échoue.
     */
    public function upload(UploadedFile $file, string $folder = 'mocase/students'): ?string
    {
        if (!$this->isConfigured()) {
            \Log::info('CloudinaryService: credentials not set, fallback to local disk.');
            return null;
        }

        $timestamp    = time();
        $paramsToSign = "folder={$folder}&timestamp={$timestamp}";
        // Cloudinary standard upload uses SHA-1 signature by default
        $signature    = sha1($paramsToSign . $this->apiSecret);

        $url = "https://api.cloudinary.com/v1_1/{$this->cloudName}/image/upload";

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL            => $url,
            CURLOPT_POST           => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 20,
            CURLOPT_POSTFIELDS     => [
                'file'      => new \CURLFile($file->getRealPath(), $file->getMimeType(), $file->getClientOriginalName()),
                'api_key'   => $this->apiKey,
                'timestamp' => $timestamp,
                'folder'    => $folder,
                'signature' => $signature,
            ],
        ]);

        $response  = curl_exec($ch);
        $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($httpCode !== 200 || !$response) {
            \Log::error('Cloudinary upload failed', [
                'http_code' => $httpCode,
                'response'  => $response,
                'curl_err'  => $curlError,
            ]);
            return null;
        }

        $data = json_decode($response, true);

        return $data['secure_url'] ?? null;
    }

    /**
     * Supprime une image de Cloudinary par son public_id.
     */
    public function destroy(string $secureUrl): bool
    {
        if (!$this->isConfigured()) {
            return false;
        }

        $pattern = '/\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/';
        if (!preg_match($pattern, $secureUrl, $matches)) {
            return false;
        }
        $publicId  = $matches[1];
        $timestamp = time();
        $signature = sha1("public_id={$publicId}&timestamp={$timestamp}" . $this->apiSecret);

        $url = "https://api.cloudinary.com/v1_1/{$this->cloudName}/image/destroy";

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL            => $url,
            CURLOPT_POST           => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 10,
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
     * Vérifie si une chaîne est une URL Cloudinary.
     */
    public static function isCloudinaryUrl(?string $url): bool
    {
        if (empty($url)) return false;
        return str_contains($url, 'res.cloudinary.com') || str_contains($url, 'cloudinary.com');
    }
}

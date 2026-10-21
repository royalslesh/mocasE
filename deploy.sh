#!/bin/bash
# Script de deploiement MocasE sur Alwaysdata
set -e
echo "Deploiement MocasE..."
cd ~/www
if [ ! -f "artisan" ]; then
    git clone https://github.com/royalslesh/mocasE.git .
else
    git pull origin main
fi
php8.3 $(which composer) install --no-dev --optimize-autoloader --no-interaction
if [ ! -f ".env" ]; then cp .env.example .env; fi
sed -i 's/APP_NAME=Laravel/APP_NAME=MocasE/' .env
sed -i 's/APP_ENV=local/APP_ENV=production/' .env
sed -i 's/APP_DEBUG=true/APP_DEBUG=false/' .env
sed -i "s|APP_URL=http://localhost|APP_URL=https://mocase.alwaysdata.net|" .env
sed -i 's/DB_CONNECTION=sqlite/DB_CONNECTION=mysql/' .env
sed -i 's/# DB_HOST=127.0.0.1/DB_HOST=mysql-mocase.alwaysdata.net/' .env
sed -i 's/# DB_PORT=3306/DB_PORT=3306/' .env
sed -i 's/# DB_DATABASE=laravel/DB_DATABASE=mocase_db/' .env
sed -i 's/# DB_USERNAME=root/DB_USERNAME=mocase_user/' .env
sed -i "s/# DB_PASSWORD=/DB_PASSWORD=MocasE2024!/" .env
sed -i 's/SESSION_DRIVER=database/SESSION_DRIVER=file/' .env
sed -i 's/CACHE_STORE=database/CACHE_STORE=file/' .env
sed -i 's/QUEUE_CONNECTION=database/QUEUE_CONNECTION=sync/' .env
sed -i 's/CLOUDINARY_CLOUD_NAME=/CLOUDINARY_CLOUD_NAME=xao97oiv/' .env
php8.3 artisan key:generate --force
php8.3 artisan migrate --force
php8.3 artisan storage:link || true
php8.3 artisan config:cache
php8.3 artisan route:cache
php8.3 artisan view:cache
echo "Deploiement termine ! App en ligne sur https://mocase.alwaysdata.net"

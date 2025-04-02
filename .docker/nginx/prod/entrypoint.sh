#!/bin/sh

envsubst '${DOMAIN}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Parameters
DOMAIN="${DOMAIN}"
CERT_DIR="/etc/letsencrypt/live/${DOMAIN}"
TEMP_CERT_DIR="/etc/letsencrypt/live/temporary"
ACME_ROOT="/var/www/acme"

mkdir -p "${TEMP_CERT_DIR}" "${ACME_ROOT}/.well-known/acme-challenge"
chown -R nginx:nginx "${ACME_ROOT}"
chmod -R 755 "${ACME_ROOT}"

if [ ! -f "${TEMP_CERT_DIR}/privkey.pem" ]; then
  echo "Creating a temporary self-signed certificate"
  openssl req -x509 -nodes -newkey rsa:2048 \
    -days 1 \
    -keyout "${TEMP_CERT_DIR}/privkey.pem" \
    -out "${TEMP_CERT_DIR}/fullchain.pem" \
    -subj "/CN=localhost"
fi

if [ ! -f "${CERT_DIR}/fullchain.pem" ] || [ ! -f "${CERT_DIR}/privkey.pem" ]; then
  echo "No Let's Encrypt certificate found, starting Nginx with a temporary certificate"
  sed -i "s|ssl_certificate .*|ssl_certificate ${TEMP_CERT_DIR}/fullchain.pem;|" /etc/nginx/conf.d/default.conf
  sed -i "s|ssl_certificate_key .*|ssl_certificate_key ${TEMP_CERT_DIR}/privkey.pem;|" /etc/nginx/conf.d/default.conf

  nginx -g "daemon on;"
  sleep 5

  echo "Requesting a real certificate from Let's Encrypt"
  certbot certonly --webroot \
    -w "${ACME_ROOT}" \
    -d "${DOMAIN}" \
    --email "${EMAIL}" \
    --non-interactive \
    --agree-tos || echo "Certbot failed, check logs"

  if [ -f "${CERT_DIR}/fullchain.pem" ] && [ -f "${CERT_DIR}/privkey.pem" ]; then
    echo "New certificate obtained in ${CERT_DIR}"
    sed -i "s|ssl_certificate .*|ssl_certificate ${CERT_DIR}/fullchain.pem;|" /etc/nginx/conf.d/default.conf
    sed -i "s|ssl_certificate_key .*|ssl_certificate_key ${CERT_DIR}/privkey.pem;|" /etc/nginx/conf.d/default.conf
  else
    NEW_CERT=$(ls -d /etc/letsencrypt/live/${DOMAIN}-* 2>/dev/null | sort -V | tail -n 1)
    if [ -n "$NEW_CERT" ]; then
      echo "New certificate obtained: ${NEW_CERT}"
      sed -i "s|ssl_certificate .*|ssl_certificate ${NEW_CERT}/fullchain.pem;|" /etc/nginx/conf.d/default.conf
      sed -i "s|ssl_certificate_key .*|ssl_certificate_key ${NEW_CERT}/privkey.pem;|" /etc/nginx/conf.d/default.conf
    else
      echo "Failed to obtain a certificate, using temporary one"
    fi
  fi

  nginx -s quit
  sleep 2
fi

echo "Setting up certificate renewal"
echo "0 0 * * * certbot renew --quiet && nginx -s reload" > /etc/crontabs/root

crond -b &

echo "Starting Nginx with final configuration"
exec nginx -g "daemon off;"

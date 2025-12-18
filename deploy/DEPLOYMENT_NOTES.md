# Deployment Notes for Mukhatay Ormany Platform

## Accessing the Application via Domain

To access your application via `https://mukhatayormany.birqadam.kz`, you need to ensure that:

1. **Traefik is properly configured** on your server with:
   - A valid TLS certificate resolver named `mytlschallenge`
   - Entry points configured for `websecure` (typically port 443)
   - The domain `mukhatayormany.birqadam.kz` properly pointed to your server's IP address

2. **Network Configuration**:
   - The external network `n8n-compose_web` exists on your Docker host
   - If it doesn't exist, create it with:
     ```bash
     sudo docker network create n8n-compose_web
     ```

3. **DNS Configuration**:
   - Ensure your domain `mukhatayormany.birqadam.kz` has an A record pointing to your server's public IP address

4. **Firewall Configuration**:
   - Ports 80 (HTTP) and 443 (HTTPS) should be open on your server

## Troubleshooting Steps

If you're unable to access the application via the domain:

1. Check if the services are running:
   ```bash
   sudo docker compose -f deploy/docker-compose.yml ps
   ```

2. Check the logs for any errors:
   ```bash
   sudo docker compose -f deploy/docker-compose.yml logs
   ```

3. Verify Traefik is routing requests properly:
   ```bash
   sudo docker logs <traefik_container_name>
   ```

4. Test if you can access the application directly:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/health

## Alternative: Direct Access Without Domain

If you need immediate access without configuring the domain, you can:

1. Find your server's public IP address
2. Access the application directly via:
   - Frontend: http://YOUR_SERVER_IP:3000
   - Backend API: http://YOUR_SERVER_IP:5000

Note: This bypasses HTTPS and should only be used for testing.
# Blue-Green Deployment Checklist

## Pre-Deployment Setup

### ✅ GitHub Repository Setup
- [ ] Repository created with main and deploy branches
- [ ] GitHub Actions workflows added (.github/workflows/)
- [ ] GitHub Secrets configured:
  - [ ] `BLUE_SERVER_HOST`
  - [ ] `GREEN_SERVER_HOST`
  - [ ] `SERVER_USERNAME`
  - [ ] `SERVER_SSH_KEY`
  - [ ] `SERVER_SSH_PORT`

### ✅ Azure Server Setup
- [ ] Blue server created and configured
- [ ] Green server created and configured
- [ ] SSH access configured for both servers
- [ ] Node.js 18+ installed on both servers
- [ ] PM2 installed globally on both servers
- [ ] Git configured on both servers
- [ ] Application directory created: `/var/www/blue-green-app`

### ✅ MongoDB Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database connection string obtained
- [ ] Network access configured (IP whitelist)
- [ ] Database user credentials created

### ✅ Environment Configuration
- [ ] `.env` file created with MongoDB URI
- [ ] Environment variables configured for both servers
- [ ] PM2 ecosystem.config.js configured

## Deployment Testing

### ✅ Green Environment (Staging)
- [ ] Push code to `deploy` branch
- [ ] Verify GitHub Actions workflow triggers
- [ ] Check that tests pass
- [ ] Verify deployment to green server
- [ ] Confirm database seeding runs
- [ ] Test health check endpoint
- [ ] Manual testing of application features

### ✅ Blue Environment (Production)
- [ ] Push code to `main` branch
- [ ] Verify GitHub Actions workflow triggers
- [ ] Check that tests pass
- [ ] Verify deployment to blue server
- [ ] Test health check endpoint
- [ ] Confirm production functionality



---

## Quick Commands Reference

```bash
# Check PM2 status
pm2 list

# View application logs
pm2 logs blue-green-app

# Restart application
pm2 restart blue-green-app

# Health check
curl http://localhost:3000/health

# Check nginx status
sudo systemctl status nginx

# View nginx logs
sudo tail -f /var/log/nginx/access.log
```

## Emergency Contacts

- **GitHub Actions**: Check repository Actions tab
- **Server Issues**: SSH into server and check PM2 logs
- **Database Issues**: Check MongoDB Atlas dashboard
- **Network Issues**: Check nginx configuration and firewall

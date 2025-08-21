# Deployment Instructions

This document describes how to deploy the Hybrid Cloud Hosting Platform for WordPress.

## Prerequisites
- DigitalOcean account with API access
- Supabase account and project
- cPanel/WHM license and server access
- Terraform and Ansible installed locally
- SSH access to all web nodes

## Deployment Steps
1. Clone the repository to your local machine
2. Configure Terraform variables for DigitalOcean resources
3. Run Terraform to provision infrastructure
4. Configure Ansible inventory and variables
5. Run Ansible playbooks to set up cPanel servers and WordPress sites
6. Set up Supabase instance and configure connection pooling
7. Deploy monitoring stack (Prometheus, Grafana)
8. Validate deployment and run tests

## Notes
- Refer to README.md for project overview and folder structure
- Refer to MANUAL_ACTIONS.md for required manual steps

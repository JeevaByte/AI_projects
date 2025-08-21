# Sequence Diagram: WordPress Site Lifecycle

This diagram outlines the sequence of actions for provisioning and managing a WordPress site in the hybrid-cloud platform.

```
User        Terraform      DigitalOcean      Ansible      cPanel/WHM      Supabase
 |              |               |             |              |               |
 |--provision-->|               |             |              |               |
 |              |--create------>|             |              |               |
 |              |               |--Droplet--->|              |               |
 |              |               |             |--configure-->|               |
 |              |               |             |              |--setup site-->|--connect-->
 |              |               |             |              |               |--create DB-->
 |              |               |             |              |               |--return creds-->
 |              |               |             |              |<--store creds--|
 |              |               |             |<--install WP-|              |               |
 |              |               |             |              |               |
 |              |               |             |              |               |
```

- User triggers provisioning
- Terraform creates DigitalOcean resources
- Ansible configures cPanel/WHM and sets up WordPress
- Supabase creates database and returns credentials
- Credentials are stored and WordPress is installed

A PNG version of this diagram should be created for final documentation.

# Architecture Diagram

This diagram illustrates the high-level architecture for the Hybrid Cloud Hosting Platform for WordPress.

```
+-------------------+        +-------------------+        +-------------------+
| DigitalOcean      |        | cPanel/WHM Nodes  |        | Supabase (Postgres)|
| Droplets/VPC      |<------>| (Nginx/PHP-FPM)   |<------>| Central DB         |
| Firewall, Network |        | WordPress Sites   |        | Connection Pooling |
+-------------------+        +-------------------+        +-------------------+
        |                          |                          |
        |                          |                          |
        v                          v                          v
+-------------------+        +-------------------+        +-------------------+
| Monitoring Stack  |        | Ansible Automation|        | Backup/Recovery   |
| (Prometheus,      |        | (Config, Security)|        | Scripts           |
| Grafana)          |        |                   |        |                   |
+-------------------+        +-------------------+        +-------------------+
```

- DigitalOcean hosts the infrastructure (Droplets, VPC, Firewall)
- cPanel/WHM nodes run Nginx/PHP-FPM and host WordPress sites
- Supabase provides centralized PostgreSQL database
- Ansible automates server config and WordPress setup
- Monitoring stack tracks performance and reliability
- Backup/Recovery scripts ensure data safety

A PNG version of this diagram should be created for final documentation.

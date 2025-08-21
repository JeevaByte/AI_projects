# DigitalOcean Provider
provider "digitalocean" {
  token = var.do_token
}

# Droplet Resource Example
resource "digitalocean_droplet" "web" {
  count  = var.wp_site_count
  name   = "wp-web-${count.index}"
  image  = "ubuntu-22-04-x64"
  region = var.do_region
  size   = "s-2vcpu-4gb"
  ssh_keys = [var.ssh_key_id]
}

# VPC Example
resource "digitalocean_vpc" "main" {
  name   = "wp-vpc"
  region = var.do_region
}

# Firewall Example
resource "digitalocean_firewall" "wp_fw" {
  name = "wp-firewall"
  droplet_ids = digitalocean_droplet.web[*].id
  inbound_rule {
    protocol = "tcp"
    port_range = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }
}

# Variables
variable "do_token" {}
variable "do_region" { default = "nyc3" }
variable "wp_site_count" { default = 5 }
variable "ssh_key_id" {}

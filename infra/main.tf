terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ── SSH Key Pair ──────────────────────────────────────────────
resource "aws_lightsail_key_pair" "downbeach" {
  name = "DownBeach-key"
}

# ── Lightsail Instance ────────────────────────────────────────
# Platform  : Linux
# Blueprint : Ubuntu 22.04 LTS  (Apps + OS — plain Linux, Node.js installed by setup script)
# Bundle    : medium_3_0 — $12/mo · 4 GB RAM · 2 vCPU · 80 GB SSD  (General — Dual-core)
# Name      : DownBeach
resource "aws_lightsail_instance" "downbeach" {
  name              = "DownBeach"
  availability_zone = "${var.aws_region}a"
  blueprint_id      = "ubuntu_22_04"
  bundle_id         = "medium_3_0"
  key_pair_name     = aws_lightsail_key_pair.downbeach.name

  user_data = templatefile("${path.module}/../scripts/server-setup.sh", {
    clone_url   = var.github_token != "" ? replace(var.repo_url, "https://", "https://${var.github_token}@") : var.repo_url
    domain_name = var.domain_name
  })

  tags = {
    Project     = "downbeach"
    Environment = "production"
  }
}

# ── Static IP ─────────────────────────────────────────────────
resource "aws_lightsail_static_ip" "downbeach" {
  name = "DownBeach-ip"
}

resource "aws_lightsail_static_ip_attachment" "downbeach" {
  static_ip_name = aws_lightsail_static_ip.downbeach.name
  instance_name  = aws_lightsail_instance.downbeach.name
}

# ── Firewall ──────────────────────────────────────────────────
# Port 3000 is intentionally NOT exposed to the internet.
# Traffic flow:  Internet → Nginx (80 / 443) → Next.js (3000 internal only)
resource "aws_lightsail_instance_public_ports" "downbeach" {
  instance_name = aws_lightsail_instance.downbeach.name

  port_info {
    protocol  = "tcp"
    from_port = 22
    to_port   = 22
  }

  port_info {
    protocol  = "tcp"
    from_port = 80
    to_port   = 80
  }

  port_info {
    protocol  = "tcp"
    from_port = 443
    to_port   = 443
  }
}

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

resource "aws_lightsail_instance" "downbeach" {
  name              = "DownBeach"
  availability_zone = "${var.aws_region}a"
  blueprint_id      = "ubuntu_22_04"
  bundle_id         = "small_3_0"
  key_pair_name     = "downbeach"

  user_data = templatefile("${path.module}/../scripts/server-setup.sh", {
    clone_url   = var.github_token != "" ? replace(var.repo_url, "https://", "https://${var.github_token}@") : var.repo_url
    domain_name = var.domain_name
  })

  lifecycle {
    ignore_changes  = [user_data]
    prevent_destroy = true
  }

  tags = {
    Project     = "downbeach"
    Environment = "production"
  }
}

resource "aws_lightsail_static_ip" "downbeach" {
  name = "DownBeach-ip"
}

resource "aws_lightsail_static_ip_attachment" "downbeach" {
  static_ip_name = aws_lightsail_static_ip.downbeach.name
  instance_name  = aws_lightsail_instance.downbeach.name
}

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

variable "aws_region" {
  description = "AWS region for the Lightsail instance"
  type        = string
  default     = "us-east-1"
}

variable "repo_url" {
  description = "HTTPS URL of your GitHub repo (e.g. https://github.com/you/DownBeach)"
  type        = string
}

variable "github_token" {
  description = "GitHub personal access token — only needed for private repos. Leave empty for public."
  type        = string
  default     = ""
  sensitive   = true
}

variable "domain_name" {
  description = "Your domain name e.g. downbeachinn.com — used for Nginx server_name. Leave empty to use raw IP."
  type        = string
  default     = ""
}

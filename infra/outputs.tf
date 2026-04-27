output "instance_ip" {
  value       = aws_lightsail_static_ip.downbeach.ip_address
  description = "Static public IP — point your domain's A record here"
}

output "site_url" {
  value       = "http://${aws_lightsail_static_ip.downbeach.ip_address}"
  description = "Live site URL (HTTP until you add SSL)"
}

output "ssh_command" {
  value       = "ssh -i C:/Users/Varun/.ssh/downbeach.pem ubuntu@${aws_lightsail_static_ip.downbeach.ip_address}"
  description = "SSH into the server"
}

output "deploy_command" {
  value       = "./scripts/deploy.sh ${aws_lightsail_static_ip.downbeach.ip_address} C:/Users/Varun/.ssh/downbeach.pem"
  description = "Push an update to the live server"
}

output "setup_log" {
  value       = "ssh -i C:/Users/Varun/.ssh/downbeach.pem ubuntu@${aws_lightsail_static_ip.downbeach.ip_address} 'tail -f /var/log/downbeach-setup.log'"
  description = "Watch the first-boot setup log in real time"
}

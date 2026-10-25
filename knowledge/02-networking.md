---
title: "Personal K3s networking and architecture"
tags: [metallb, nginx, ingress, kubernetes, k3s, homelab]
url: "/lab/self-hosted-kubernetes-proxmox"
status: published
contentType: project
lastReviewed: "2026-10-25"
---
## MetalLB and ingress roles
In Vardhan's personal K3s lab, MetalLB supplies LoadBalancer service addresses on the local network. NGINX Ingress handles HTTP routing to Kubernetes Services and workload pods. Bundled Traefik and ServiceLB were disabled to study these responsibilities explicitly. This is personal lab work, not a cloud-provider load balancer, a public exposure guarantee, or a highly available production system.

## Homelab architecture overview
The documented personal platform is a Proxmox host with virtual machines for a K3s control-plane node and a worker node. NGINX Ingress and MetalLB handle service exposure. Prometheus and Grafana provide a monitoring layer, and Tailscale supports private connectivity experiments. The case-study diagram is conceptual and excludes private addresses. These are historical documented activities, not a live availability inventory.

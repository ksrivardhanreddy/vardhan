export function K3sDiagram() {
  return (
    <figure className="lab-diagram">
      <div className="lab-diagram-row">
        <strong>Proxmox host</strong>
        <span aria-hidden="true">→</span>
        <strong>Virtual machines</strong>
        <span aria-hidden="true">→</span>
        <strong>K3s control plane + worker</strong>
      </div>
      <div className="lab-diagram-row">
        <span>Personal workstation</span>
        <span aria-hidden="true">→</span>
        <span>Private LAN / VPN</span>
        <span aria-hidden="true">→</span>
        <span>Ingress address</span>
      </div>
      <div className="lab-diagram-row">
        <span>NGINX Ingress</span>
        <span aria-hidden="true">→</span>
        <span>Kubernetes Services</span>
        <span aria-hidden="true">→</span>
        <span>Workload pods</span>
      </div>
      <p>
        MetalLB provides local LoadBalancer service addresses. Ingress handles
        HTTP routing.
      </p>
      <div className="lab-diagram-row">
        <span>Kubernetes metrics</span>
        <span aria-hidden="true">→</span>
        <span>Prometheus</span>
        <span aria-hidden="true">→</span>
        <span>Grafana</span>
      </div>
      <figcaption>
        Simplified conceptual diagram — not a complete production topology.
        Monitoring is a separate conceptual layer; no HA, public exposure or
        exact network layout is implied.
      </figcaption>
    </figure>
  );
}

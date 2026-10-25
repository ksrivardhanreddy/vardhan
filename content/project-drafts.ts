/** Owner review only. Deliberately not imported by any page or production content. */
export const projectDrafts = [
  {
    title: "Self-Hosted Kubernetes Platform on Proxmox",
    status: "Unpublished draft",
    needs: [
      "Confirm hardware and implemented topology",
      "Sanitized configuration or public repository",
      "Actual service exposure, storage, maintenance and failure scenarios",
    ],
  },
  {
    title: "Kubernetes Observability with Prometheus and Grafana",
    status: "Unpublished draft",
    needs: [
      "Confirm whether this is part of the Proxmox project",
      "Sanitized dashboards and actual alert configuration",
      "Documented diagnostic example",
    ],
  },
  {
    title: "GitOps Application Delivery on Kubernetes",
    status: "Unpublished draft",
    needs: [
      "Confirm Argo CD or Flux is deployed in the personal lab",
      "Real repository and delivery flow",
      "Documented reconciliation or rollback behavior",
    ],
  },
  {
    title: "AI Model Serving and Inference Platform",
    status: "Planned learning project — unpublished",
    needs: [
      "Agree scope and runtime",
      "Verify available hardware before GPU claims",
      "Implement and measure before publishing benchmarks",
    ],
  },
];

export const profileData = {
  name: "Stefan Bakurdzhiev",
  handle: "sbakurdzhiev",
  terminalPrompt: "stefan@k8s-master:~#",
  title: "Senior DevOps & Platform Engineer",
  subtitle: "OpenShift & Kubernetes Specialist | Team Lead",
  motto: "Automate everything. Monitor ruthlessly. Fail fast, recover faster. ⚡",
  company: "DXC Bulgaria",
  teamLead: "Leading a squad of 8 engineers (2024 - Present)",
  experience: "10+ years IT | 5+ years DevOps & Cloud Native",
  location: "Sofia, Bulgaria 🇧🇬",
  availability: "Open to Remote Worldwide",
  email: "stefan.bakurdzhiev@gmail.com",
  linkedin: "https://www.linkedin.com/in/stefan-bakurdzhiev-055a3a113/",
  github: "https://github.com/sbakurdzhiev",
  portfolioUrl: "https://sbakurdzhiev.com",

  metrics: [
    { label: "PROD UPTIME", value: "99.99%", sub: "Enterprise SLA", status: "NOMINAL" },
    { label: "ENGINEERS LED", value: "8", sub: "DevOps Squad Lead", status: "ACTIVE" },
    { label: "IT EXPERIENCE", value: "10+ YRS", sub: "5+ yrs DevOps", status: "VERIFIED" },
    { label: "K8S / OCP CLUSTERS", value: "50+", sub: "Managed & Deployed", status: "HEALTHY" },
    { label: "GITOPS AUTOMATION", value: "100%", sub: "Declarative IaC", status: "SYNCED" },
    { label: "LATENCY PING", value: "14ms", sub: "Sofia DC Node", status: "OPTIMAL" },
  ],

  skillCategories: [
    {
      name: "Container Orchestration",
      tag: "CORE",
      skills: [
        { name: "OpenShift", level: 98, highlight: true },
        { name: "Kubernetes", level: 96, highlight: true },
        { name: "Docker & Podman", level: 92 },
        { name: "Helm", level: 90 },
        { name: "Postgres Operator (PGO)", level: 88 },
      ]
    },
    {
      name: "CI/CD & GitOps Automation",
      tag: "PIPELINES",
      skills: [
        { name: "ArgoCD", level: 95, highlight: true },
        { name: "GitHub Actions", level: 94, highlight: true },
        { name: "Jenkins (Declarative)", level: 92 },
        { name: "Ansible", level: 89 },
        { name: "Terraform", level: 86 },
        { name: "Apache Airflow / MLflow", level: 80 },
      ]
    },
    {
      name: "Observability & SRE",
      tag: "MONITORING",
      skills: [
        { name: "Prometheus", level: 95, highlight: true },
        { name: "Grafana", level: 95, highlight: true },
        { name: "Loki & EFK Stack", level: 90 },
        { name: "Fluentd / Logstash", level: 88 },
        { name: "Nagios & Checkmk", level: 85 },
      ]
    },
    {
      name: "Infrastructure, Cloud & Storage",
      tag: "INFRA",
      skills: [
        { name: "Microsoft Azure", level: 88 },
        { name: "Ceph Storage", level: 86 },
        { name: "Nexus Repository", level: 90 },
        { name: "Linux Hardening (RHEL/CentOS/Ubuntu)", level: 96, highlight: true },
      ]
    },
    {
      name: "Scripting, Databases & Security",
      tag: "DEV-SEC",
      skills: [
        { name: "Bash & Shell Scripting", level: 96, highlight: true },
        { name: "Python", level: 85 },
        { name: "YAML / declarative configs", level: 98 },
        { name: "PostgreSQL & HA Clustering", level: 88 },
        { name: "SonarQube & Security Audits", level: 86 },
      ]
    }
  ],

  projects: [
    {
      id: "openshift-handbook",
      title: "Enterprise OpenShift Operations Handbook",
      kind: "CustomResourceDefinition",
      api: "k8s.io/v1alpha1",
      repo: "https://github.com/sbakurdzhiev/openshift",
      description: "Battle-tested administration guide, disaster recovery routines, RBAC configurations, and multi-tenant isolation playbooks for Red Hat OpenShift clusters in regulated enterprise environments.",
      stack: ["OpenShift 4.x", "Kubernetes", "Bash", "RHEL CoreOS", "RBAC", "NetworkPolicies"],
      stats: { type: "Cluster Guide", impact: "Zero-Downtime Operations", security: "High" },
      highlight: true
    },
    {
      id: "gitops-argocd",
      title: "Declarative GitOps Delivery Fabric",
      kind: "ApplicationSet",
      api: "argoproj.io/v1alpha1",
      repo: "https://github.com/sbakurdzhiev",
      description: "Automated end-to-end continuous delivery architecture migrating enterprise services from legacy manual deployments to ArgoCD GitOps pipelines with progressive canary releases.",
      stack: ["ArgoCD", "Helm", "GitHub Actions", "Kustomize", "OpenShift"],
      stats: { type: "GitOps Architecture", impact: "Deploy cycle: 2h → 4min", security: "Automated RBAC" },
      highlight: true
    },
    {
      id: "pgo-ha-database",
      title: "Crunchy Data Postgres Operator Orchestration",
      kind: "PostgresCluster",
      api: "postgres-operator.crunchydata.com/v1beta1",
      repo: "https://github.com/sbakurdzhiev/postgres-operator-examples",
      description: "High-Availability cloud-native PostgreSQL deployments on Kubernetes. Implements automated patroni failover, pgBackRest S3 backups, connection pooling via PgBouncer, and Prometheus metrics scraping.",
      stack: ["Kubernetes", "PGO Operator", "PostgreSQL", "Patroni", "pgBackRest"],
      stats: { type: "HA Storage", impact: "RPO < 1min / Auto Failover", security: "mTLS" },
      highlight: true
    },
    {
      id: "observability-mesh",
      title: "Unified Cluster Observability Mesh",
      kind: "PrometheusRule",
      api: "monitoring.coreos.com/v1",
      repo: "https://github.com/sbakurdzhiev/nagios",
      description: "End-to-end monitoring fabric unifying Prometheus metric scrapers, Alertmanager routing, Grafana dashboards, and custom Nagios/Checkmk synthetic health sensors across distributed nodes.",
      stack: ["Prometheus", "Grafana", "Loki", "Nagios", "Checkmk", "Python"],
      stats: { type: "SRE Telemetry", impact: "MTTR reduced by 60%", security: "Audit Logged" },
      highlight: false
    }
  ],

  careerTimeline: [
    {
      period: "2024 - PRESENT",
      role: "DevOps Team Lead & Senior DevOps Engineer",
      company: "DXC Bulgaria",
      badge: "ACTIVE ROLE",
      details: "Leading a squad of 8 engineers delivering Kubernetes & OpenShift cloud infrastructure, GitOps automation, CI/CD modernization, and enterprise platform reliability."
    },
    {
      period: "2019 - 2024",
      role: "Senior DevOps & Cloud Platform Engineer",
      company: "DXC Bulgaria",
      badge: "PROMOTION",
      details: "Architected multi-cluster OpenShift platforms, automated CI/CD pipelines (Jenkins, GitHub Actions, Helm), unified monitoring (Prometheus, Grafana, Loki), and maintained 99.99% uptime."
    },
    {
      period: "2014 - 2019",
      role: "Systems Administrator & Infrastructure Engineer",
      company: "Enterprise IT Operations",
      badge: "SYSTEMS",
      details: "Managed Linux/UNIX environments, enterprise storage, virtualization, network security, Nagios/Checkmk telemetry, and configuration management automation."
    },
    {
      period: "2010 - 2014",
      role: "Freelance Technical Consultant & Systems Support",
      company: "Independent Practice",
      badge: "ORIGIN",
      details: "Delivered web solutions, server configurations, network installations, and foundational sysadmin automations while completing IT and cybersecurity degrees."
    }
  ],

  education: [
    {
      degree: "Cybersecurity Specialist",
      school: "University of Telecommunications and Posts, Sofia",
      year: "2019",
      icon: "ShieldAlert"
    },
    {
      degree: "Information Technology (BSc)",
      school: "University of Library Studies and IT, Sofia",
      year: "2010 – 2014",
      icon: "GraduationCap"
    },
    {
      degree: "Electronics Industry Specialist",
      school: "Sofia Vocational High School of Electronics 'John Atanasov'",
      year: "2010",
      icon: "Cpu"
    }
  ]
};

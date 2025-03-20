'use client';

import {
  Github,
  Linkedin,
  XCircle,
  FileText,
  Mail,
  Moon,
  Sun,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function Portfolio() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const certifications = [
    {
      name: 'AWS Solutions Architect Associate',
      issuer: 'Amazon Web Services',
      date: '2024',
      badge: '/images/AWS-SAA.png',
    },
    {
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation',
      date: '2024',
      badge: '/images/CKA.png',
    },
    {
      name: 'Red Hat Certified Engineer (RHCE)',
      // issuer: 'Red Hat',
      date: '2018',
      badge: '/images/rhce.png',
    },
  ];

  const experience = [
    {
      title: 'Senior DevOps Engineer',
      company: 'MKS Vision Pvt Ltd.',
      period: '2024 - Present',
      description:
        "Managing DevOps operations in the Fintech domain, leveraging AWS as the cloud platform. Experienced in Kubernetes for container orchestration, Jenkins for CI, and ArgoCD for CD. Automating infrastructure provisioning and configuration using Terraform and Ansible, ensuring scalability, security, and high availability. Focused on enhancing CI/CD pipelines, optimizing cloud infrastructure, and driving automation to improve deployment efficiency and system reliability.",
    },
    {
      title: 'DevOps Engineer',
      company: 'AVYA IT Pvt Ltd.',
      period: '2018 - 2024',
      description:
        "Created CI/CD processes to ensure seamless deployments. Worked on migrating applications from on-premises data centers to AWS. Designing and optimizing CI/CD pipelines using Jenkins, Git, and automation tools. Experienced in Kubernetes for container orchestration, ensuring high availability and scalability of applications. Leveraged Terraform and Ansible for infrastructure automation, developed scripts in Python and Shell, and implemented monitoring solutions using Prometheus and Grafana. Focused on improving workflows, troubleshooting build issues, and enhancing deployment efficiency.",
    },
    {
      title: 'Sr Process Associate',
      company: 'CDK Global.',
      period: '2017 - 2018',
      description:
        "In CDK, worked as Sr Process Associate for CDK's proprietary software DEALER MANAGEMENT SYSTEM which is used by dealers in USA, CANADA, EUROPE and it's one of the best company in this industry. Automated CI/CD process and created scripts to monitor the systems and trigger alerts without manual intervention. Helped reduce man hours by automation.",
    },
    {
      title: 'Linux L2 Production Support Engineer',
      company: 'Tech Mahindra.',
      period: '2013 - 2015',
      description: "Started my IT career with Techmahindra and built a strong foundation in my IT experience working as Production / Technical Support with international Client BRITISH TELECOM, had exposure on ITIL support industry. Automating routine jobs by developing scripts. Worked in different types of Line Of Business(LoB's) contains 3 applications. Collaborated with cross-functional teams to troubleshoot complex technical issues and implement effective solutions. Implemented and maintained security measures, ensuring the integrity and confidentiality of critical data and systems. Prepared runbooks and SOP's for the team.",
    },
  ];

  const projects = [
    {
      title: 'Kubernetes Multi-Cloud Infrastructure',
      description: 'Designed and implemented a highly available Kubernetes cluster across multiple cloud providers (AWS and GCP) using Terraform and Ansible.',
      technologies: ['Kubernetes', 'Terraform', 'Ansible', 'AWS', 'GCP', 'Helm'],
      highlights: [
        'Implemented auto-scaling policies for optimal resource utilization',
        'Set up multi-region disaster recovery procedures',
        'Integrated with CI/CD pipelines using ArgoCD',
        'Achieved 99.99% uptime for critical services'
      ]
    },
    {
      title: 'Automated Security Compliance Pipeline',
      description: 'Developed an automated security scanning and compliance checking pipeline for containerized applications.',
      technologies: ['Jenkins', 'Docker', 'Trivy', 'SonarQube', 'AWS', 'Python'],
      highlights: [
        'Integrated multiple security scanning tools',
        'Automated vulnerability reporting and remediation',
        'Implemented policy-as-code using OPA',
        'Reduced security review time by 70%'
      ]
    },
    {
      title: 'Infrastructure Monitoring Solution',
      description: 'Built a comprehensive monitoring and alerting solution for cloud and on-premise infrastructure.',
      technologies: ['Prometheus', 'Grafana', 'AlertManager', 'ELK Stack', 'Python'],
      highlights: [
        'Created custom dashboards for different stakeholders',
        'Implemented predictive alerting using ML',
        'Reduced MTTR by 60%',
        'Automated incident response procedures'
      ]
    },
    {
      title: 'GitOps Deployment Framework',
      description: 'Implemented a GitOps-based deployment framework for microservices architecture.',
      technologies: ['ArgoCD', 'Kubernetes', 'GitHub Actions', 'Helm', 'Terraform'],
      highlights: [
        'Achieved zero-touch deployments',
        'Implemented canary deployment strategy',
        'Reduced deployment time by 80%',
        'Automated rollback procedures'
      ]
    }
  ];

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:scale-110 transition-transform duration-200"
      >
        {theme === 'dark' ? (
          <Sun className="h-6 w-6 text-yellow-500" />
        ) : (
          <Moon className="h-6 w-6 text-gray-700" />
        )}
      </button>

      {/* Hero Section */}
      <div
        className="h-screen relative flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white p-8">
          <div className="mb-8">
            <img
              src="/images/my-photo.png"
              alt="Profile"
              className="rounded-full w-40 h-40 mx-auto mb-6 border-4 border-primary"
            />
            <h1 className="text-4xl font-bold mb-4">SRIVARDHAN REDDY KOLAN</h1>
            <p className="text-xl mb-6">
              Senior DevOps Engineer
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300 text-white hover:text-black"
              >
               <img src="/icons/github-logo.svg" alt="X Logo" className="h-6 w-6" /> 
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300 text-white hover:text-black"
              >
                <img src="/icons/in-logo.svg" alt="X Logo" className="h-6 w-6" /> 
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300 text-white hover:text-black"
              >
                <img src="/icons/x-logo.svg" alt="X Logo" className="h-6 w-6" /> 
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300 text-white hover:text-black"
              >
                <FileText className="h-6 w-6" />
              </a>
              <a
                href="mailto:contact@example.com"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300 text-white hover:text-black"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Experience</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {experience.map((exp, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>{exp.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
                <Badge>{exp.period}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{exp.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-6 bg-secondary/50 backdrop-blur">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Projects</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {projects.map((project, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card/50 backdrop-blur rounded-lg border border-border/50 overflow-hidden transition-all duration-200 hover:shadow-lg"
              >
                <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                  {project.title}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className="animate-in fade-in-50 duration-300"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <ul className="list-disc list-inside space-y-2">
                      {project.highlights.map((highlight, highlightIndex) => (
                        <li
                          key={highlightIndex}
                          className="text-sm text-muted-foreground animate-in slide-in-from-left duration-300"
                          style={{ animationDelay: `${highlightIndex * 100}ms` }}
                        >
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20 px-6 bg-secondary/50 backdrop-blur">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Certifications
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center gap-4">
                  <img
                    src={cert.badge}
                    alt={cert.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{cert.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuer}
                    </p>
                    <Badge>{cert.date}</Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
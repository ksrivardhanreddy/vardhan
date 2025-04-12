'use client';

import {
  Github,
  Linkedin,
  XCircle,
  FileText,
  Mail,
  Moon,
  Sun,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import Link from "next/link";
import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Portfolio() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false); // Close mobile menu after clicking
    }
  };

  const navigationItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Experience', id: 'experience' },
    { label: 'Projects', id: 'projects' },
    { label: 'Certifications', id: 'certifications' },
    { label: 'Contact', id: 'contact' }
  ];

  const certifications = [
    {
      name: 'AWS Solutions Architect Associate',
      issuer: 'Amazon Web Services',
      date: '2024',
      badge: '/images/AWS-SAA.png',
      link: 'https://www.credly.com/badges/dfb30d20-556c-4737-b9f7-f876e98e3989',
    },
    {
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation',
      date: '2025',
      badge: '/images/CKA.png',
      link: 'https://www.credly.com/badges/53f1f54f-e8bd-4433-8ace-11816a98ee42',
    },
    {
      name: 'Red Hat Certified Engineer (RHCE)',
      issuer: 'RedHat CertID: 180-109-324',
      date: '2018',
      badge: '/images/rhce.png',
      link: 'https://rhtapps.redhat.com/verify?certId=180-109-324',
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
      technologies: ['Kubernetes', 'Terraform', 'Ansible', 'AWS', 'GCP','Azure', 'Helm'],
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

  const aboutContent = {
    title: "About Me",
    description: "I am a passionate DevOps Engineer with over 10 years of experience in the industry. My journey in technology has been focused on building and optimizing infrastructure, automating processes, and implementing modern DevOps practices. I have a strong background in cloud technologies, particularly AWS, and extensive experience with containerization and orchestration using Kubernetes.",
    skills: [
      "AWS Cloud Infrastructure",
      "Kubernetes & Container Orchestration",
      "Infrastructure as Code (Terraform, CloudFormation)",
      "CI/CD Pipeline Development",
      "Automation & Scripting",
      "Security & Compliance",
      "Monitoring & Observability",
      "Problem Solving & Troubleshooting"
    ],
    interests: [
      "Cloud Native Technologies",
      "Infrastructure Automation",
      "DevSecOps",
      "Continuous Learning",
      "Technology Innovation"
    ]
  };

  if (!mounted) {
    return null;
  }

  const NavItems = ({ className = "", onClick }: { className?: string, onClick?: () => void }) => (
    <>
      {navigationItems.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            scrollToSection(item.id);
            onClick?.();
          }}
          className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group ${className}`}
        >
          {item.label}
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
        </button>
      ))}
    </>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col gap-6 mt-8">
                  <NavItems className="flex flex-col items-start gap-4" onClick={() => setIsOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center justify-center gap-8 flex-1">
            <NavItems />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-accent"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="h-screen relative flex items-center justify-center pt-16"
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
              className="rounded-full w-60 h-60 mx-auto mb-6 border-4 border-primary"
            />
            <h1 className="text-4xl font-bold mb-4">SRIVARDHAN REDDY KOLAN</h1>
            <p className="text-xl mb-6">Senior DevOps Engineer</p>
            <div className="flex justify-center gap-4 items-center">
              <a
                href="https://github.com/ksrivardhanreddy"
                target="_blank"
                rel="noopener noreferrer"
                title="My GitHub"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300 text-white hover:text-white"
              >
                <img src="/icons/github-logo.svg" alt="GitHub Logo" className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com/in/srivardhanreddykolan"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn Profile"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300 text-white hover:text-white"
              >
                <img src="/icons/in-logo.svg" alt="LinkedIn Logo" className="h-6 w-6" />
              </a>
              <a
                href="/SrivardhanReddy-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                title="View Resume"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300 text-white hover:text-white transform scale-125"
              >
                <img src="/icons/cv.png" alt="CV Logo" className="h-10 w-10"/>
              </a>
              <a
                href="https://x.com/srieevardhan"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow me on X.com"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300 text-white hover:text-white"
              >
                <img src="/icons/x-logo.svg" alt="X Logo" className="h-6 w-6" />
              </a>
              <a
                href="https://hashnode.vardhan.pro/"
                target="_blank"
                rel="noopener noreferrer"
                title="Hashnode Blog"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300 text-white hover:text-white"
              >
                <img src="/icons/hashnode-icon.png" alt="X Logo" className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">{aboutContent.title}</h2>
          <div className="bg-card/50 backdrop-blur rounded-lg p-8 space-y-8">
            <p className="text-lg leading-relaxed">{aboutContent.description}</p>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {aboutContent.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {aboutContent.interests.map((interest, index) => (
                  <Badge key={index}>{interest}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 max-w-6xl mx-auto">
  <h2 className="text-3xl font-bold mb-12 text-center">Experience</h2>
  <div className="grid gap-6 md:grid-cols-2">
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
      <section id="projects" className="py-20 px-6 bg-secondary/50 backdrop-blur">
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
<section id="certifications" className="py-20 px-6 bg-secondary/50 backdrop-blur">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold mb-12 text-center">
      Certifications
    </h2>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {certifications.map((cert, index) => (
        <Link href={cert.link} target="_blank" rel="noopener noreferrer" key={index}>
          <Card className="bg-card/50 backdrop-blur transition-all duration-300 hover:shadow-lg group relative">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="relative">
                <img
                  src={cert.badge}
                  alt={cert.name}
                  className="w-16 h-16 rounded-lg object-cover object-center flex-shrink-0"
                />
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-medium">Verify</span>
                </div>
              </div>
              <div>
                <CardTitle className="text-lg">{cert.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {cert.issuer}
                </p>
                <Badge>{cert.date}</Badge>
              </div>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  </div>
</section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-secondary/50 backdrop-blur">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
          <p className="text-lg mb-8">
            I'm always interested in hearing about new opportunities and collaborations.
          </p>
          <div className="flex justify-center gap-6">
          <Button 
  variant="outline" 
  className="group"
  onClick={(e) => {
    e.preventDefault();
    navigator.clipboard.writeText("sri@srivardhanreddy.com");
    
    // Create and display a toast notification
    const toast = document.createElement("div");
    toast.className = "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-md transition-opacity duration-300";
    toast.innerText = "Email copied to clipboard!";
    document.body.appendChild(toast);
    
    // Remove the toast after 2 seconds
    setTimeout(() => {
      toast.classList.add("opacity-0");
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
  }}
>
  <Mail className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> 
  Email Me
</Button>
            <Button asChild variant="outline" className="group">
              <a href="https://linkedin.com/in/srivardhanreddykolan" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Connect on LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </section>
      {/* Footer Section */}
      <footer className="py-4 text-center text-muted-foreground bg-secondary/50 backdrop-blur border-t border-border/50">
        &copy; 2025 Srivardhan Reddy Kolan. All rights reserved.
      </footer>

    </main>
  );
}
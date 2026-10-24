"""Build the two-page public resume. Requires reportlab, pypdf, and pymupdf for QA."""
from pathlib import Path
from shutil import copyfile
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether, HRFlowable

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'output/pdf/Srivardhan_Reddy_Kolan_Resume.pdf'
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
NAVY = colors.HexColor('#172d3c')
COPPER = colors.HexColor('#9f4829')
GRAY = colors.HexColor('#4a5660')
styles = {
 'name': ParagraphStyle('name', fontName='Helvetica-Bold', fontSize=22, leading=26, textColor=NAVY, spaceAfter=6),
 'role': ParagraphStyle('role', fontName='Helvetica-Bold', fontSize=11, leading=15, textColor=COPPER, spaceAfter=7),
 'contact': ParagraphStyle('contact', fontName='Helvetica', fontSize=9.5, leading=14, textColor=GRAY, spaceAfter=10),
 'section': ParagraphStyle('section', fontName='Helvetica-Bold', fontSize=11, leading=15, textColor=NAVY, spaceBefore=14, spaceAfter=7, keepWithNext=True),
 'body': ParagraphStyle('body', fontName='Helvetica', fontSize=10.3, leading=14.4, textColor=colors.HexColor('#25313a'), spaceAfter=6),
 'job': ParagraphStyle('job', fontName='Helvetica-Bold', fontSize=11.3, leading=15, textColor=NAVY, spaceBefore=4, spaceAfter=3, keepWithNext=True),
 'period': ParagraphStyle('period', fontName='Helvetica', fontSize=9.8, leading=14, textColor=COPPER, spaceAfter=7, keepWithNext=True),
 'bullet': ParagraphStyle('bullet', fontName='Helvetica', fontSize=10.3, leading=14.4, leftIndent=10, firstLineIndent=-9, textColor=colors.HexColor('#25313a'), spaceAfter=5),
 'skill': ParagraphStyle('skill', fontName='Helvetica', fontSize=10, leading=14, spaceAfter=4, textColor=colors.HexColor('#25313a')),
}
story=[]
def p(text, style='body'): story.append(Paragraph(text,styles[style]))
def section(title): p(title.upper(),'section')
def bullet(text): p('- '+escape(text),'bullet')
def job(company, role, dates):
 p(escape(company),'job'); p(escape(role)+' | '+escape(dates)+' | Hyderabad, India','period')

def footer(canvas,doc):
 canvas.saveState(); w,h=A4
 canvas.setStrokeColor(colors.HexColor('#dbe1e5')); canvas.line(42,38,w-42,38)
 canvas.setFont('Helvetica',8);canvas.setFillColor(GRAY)
 canvas.drawString(42,25,'Srivardhan Reddy Kolan | vardhan.pro')
 canvas.drawRightString(w-42,25,f'{doc.page} / 2');canvas.restoreState()

p('SRIVARDHAN REDDY KOLAN','name')
p('Senior DevOps Engineer | AWS | Kubernetes | Platform Engineering','role')
p('Hyderabad, Telangana | +91 9700009938 | <link href="mailto:sri@srivardhanreddy.com">sri@srivardhanreddy.com</link><br/><link href="https://www.vardhan.pro">www.vardhan.pro</link> | <link href="https://www.linkedin.com/in/srivardhanreddykolan">linkedin.com/in/srivardhanreddykolan</link>','contact')
story.append(HRFlowable(width='100%',thickness=1,color=COPPER,spaceAfter=2))
section('Professional Summary')
p('Senior DevOps Engineer with 10+ years in IT and 8+ years across cloud infrastructure, Kubernetes, CI/CD automation, Linux administration, and production operations. Hands-on experience with AWS/EKS, Terraform/Terragrunt, protected deployment workflows, observability, incident response, and root cause analysis. Focused on dependable platforms, repeatable infrastructure, and safer releases.')
section('Technical Skills')
for name,items in [
 ('Cloud','AWS: EC2, EKS, S3, RDS, ALB/ELB, Route 53, IAM, CloudWatch, Auto Scaling, Lambda, SES'),
 ('Containers','Kubernetes, Docker, Helm, NGINX Ingress; workload scaling and troubleshooting'),
 ('Infrastructure &amp; Automation','Terraform, Terragrunt, Ansible, CloudFormation, Bash, Python'),
 ('CI/CD &amp; GitOps','GitLab CI, Jenkins, Argo CD, GitHub Actions, Git; release and approval workflows'),
 ('Observability &amp; Operations','Prometheus, Grafana, CloudWatch, Linux, RCA, ITIL, Jira, Confluence'),
 ('Systems &amp; Networking','RHEL, CentOS, Ubuntu, TCP/IP, DNS, DHCP, load balancing, firewalls')]:
 p('<b>'+name+':</b> '+escape(items),'skill')
section('Professional Experience')
job('Nemetschek Group - Bluebeam','Technical Analyst - DevOps','2025 - Present')
for text in [
 'Support AWS platform infrastructure for Bluebeam products, including EKS/Kubernetes workloads, networking, IAM, monitoring, and production operations.',
 'Designed and validated GitLab Protected Environment approval controls, including parent trigger-job behavior before downstream Terraform pipelines execute.',
 'Built and maintained Terraform/Terragrunt workflows for AWS changes: VPC/subnet planning, environment configuration, reusable modules, and local plan/apply validation.',
 'Investigated Redis degradation, memory-driven pod evictions, HPA/request mismatches, and NodeNotReady events linked to EC2 hardware issues.',
 'Implemented and validated AWS SES in the Canada region: domain identity, DKIM, custom MAIL FROM, DNS verification, delivery tests, and dedicated IP warm-up tracking.',
 'Improved operational readiness through Prometheus, Grafana, and CloudWatch dashboards/alerts; documented RCA findings and deployment controls for engineering review.',
 'Evaluated OpenCost with VictoriaMetrics for Kubernetes cost visibility and comparison with existing SaaS cost tooling; collaborated on production readiness and change reviews.'
]: bullet(text)
story.append(PageBreak())
section('Professional Experience - Continued')
job('MKS Vision Pvt Ltd.','Senior DevOps Engineer','2024 - 2025')
for text in [
 'Led migration work for business applications moving from on-premises infrastructure to AWS, with a focus on scalability and operational efficiency.',
 'Designed and managed microservices CI/CD pipelines and implemented Kubernetes configurations for production workloads using AWS, Terraform, Jenkins, and Argo CD.',
 'Established monitoring standards with Prometheus and Grafana; conducted root cause analysis for production incidents and implemented follow-up fixes.'
]:bullet(text)
job('AVYA IT Pvt Ltd.','DevOps Engineer','2018 - 2024')
for text in [
 'Contributed to on-premises-to-AWS migrations, including infrastructure design, deployment planning, and operational handover.',
 'Developed Jenkins CI/CD pipelines for monolithic and microservice applications; managed Docker and Kubernetes across development, testing, and production.',
 'Automated Linux provisioning and deployments with Ansible, Bash, and Python. Implemented Prometheus/Grafana monitoring and supported incidents, changes, and releases.'
]:bullet(text)
job('CDK Global','Sr. Process Associate','2017 - 2018')
for text in [
 'Administered Red Hat Linux servers: builds, patching, user management, LVM, cron, service checks, and network troubleshooting.',
 'Provided 24/7 production support, incident response, and operational documentation for critical environments.'
]:bullet(text)
p('Tech Mahindra Ltd. | Pune, India','job')
p('Linux L2 Production Support Engineer | 2013 - 2015','period')
bullet('Provided L2 application support in an ITIL environment, handling incidents, changes, Linux deployments, basic shell scripting, and operational documentation.')
section('Certifications')
p('AWS Certified Solutions Architect - Associate<br/>Certified Kubernetes Administrator (CKA)<br/>Red Hat Certified Engineer (RHCE)','body')
section('Education')
p("Bachelor's in Computer Science and Mathematics | Osmania University, Hyderabad")
section('Personal Projects &amp; Continuous Learning')
p('Maintain a Proxmox home lab for Kubernetes, Docker, self-hosted automation, local LLM experiments, and monitoring. Explore GitOps, Helm troubleshooting, observability, and practical AI infrastructure workflows.')

doc=SimpleDocTemplate(str(OUTPUT),pagesize=A4,rightMargin=42,leftMargin=42,topMargin=35,bottomMargin=49,title='Srivardhan Reddy Kolan - Senior DevOps Engineer',author='Srivardhan Reddy Kolan')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
from pypdf import PdfReader
r=PdfReader(OUTPUT)
assert len(r.pages)==2, f'Resume must be 2 pages, got {len(r.pages)}'
for destination in ['public/SrivardhanReddy-Resume.pdf','public/resume.pdf']:
 copyfile(OUTPUT,ROOT/destination)
print(f'Created {OUTPUT}: {len(r.pages)} pages')

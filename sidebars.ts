import type {SidebarsConfig} from '@docusaurus/types';

const sidebars: SidebarsConfig = {
  // Exam Portal Sidebar (only this for now)
  examPortalSidebar: [
    {
      type: 'doc',
      id: 'exam-portal/overview',
      label: 'Overview',
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'exam-portal/getting-started',
        'exam-portal/installation',
        'exam-portal/quick-start',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'exam-portal/architecture',
        'exam-portal/database-schema',
        'exam-portal/features-and-workflows',
      ],
    },
    {
      type: 'category',
      label: 'API Documentation',
      items: [
        'exam-portal/api-reference',
        'exam-portal/authentication',
        'exam-portal/error-codes',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Topics',
      items: [
        'exam-portal/security-and-exam-integrity',
        'exam-portal/performance-optimization',
      ],
    },
    {
      type: 'category',
      label: 'Operations & Monitoring',
      items: [
        'exam-portal/monitoring-and-operations',
        'exam-portal/deployment-guide',
        'exam-portal/troubleshooting',
      ],
    },
    {
      type: 'doc',
      id: 'exam-portal/changelog',
      label: 'Changelog',
    },
  ],
};

export default sidebars;

import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './styles.module.css';

interface Product {
  id: string;
  name: string;
  icon: string;
  description: string;
  href: string;
  docsHref?: string;
  color: string;
}

const products: Product[] = [
  {
    id: 'exam-portal',
    name: 'Exam Portal',
    icon: '',
    description:
      'A production-grade multi-tenant online examination platform for educational institutions and corporate assessment providers.',
    href: 'https://test.nssoftwaresolutions.in',
    docsHref: '/exam-portal/overview',
    color: '#0066cc',
  },
  {
    id: 'internship-portal',
    name: 'Internship Portal',
    icon: '',
    description:
      'Comprehensive internship and training management platform designed to streamline student placements and professional development.',
    href: 'https://internships.nssoftwaresolutions.in',
    docsHref: '/internship-portal/overview',
    color: '#00a854',
  },
  {
    id: 'ns-software',
    name: 'NS Software Solutions',
    icon: '',
    description:
      'Company information, services, development standards, infrastructure documentation, and organizational guidelines.',
    href: 'https://www.nssoftwaresolutions.in',
    docsHref: '/ns-website/overview',
    color: '#722ed1',
  },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <div className={styles.productCard}>
      <h3 className={styles.productName}>{product.name}</h3>
      <p className={styles.productDescription}>{product.description}</p>
      <div className={styles.buttonGroup}>
        {product.docsHref && (
          <Link to={product.docsHref} className={styles.productButton}>
            View Docs
          </Link>
        )}
        <Link to={product.href} className={styles.secondaryButton}>
          Visit Website →
        </Link>
      </div>
    </div>
  );
}

function Home(): JSX.Element {
  return (
    <Layout
      title="NS Software Solutions Documentation"
      description="Centralized documentation portal for all NS Software Solutions products">
      <main>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>NS Software Solutions</h1>
            <p className={styles.heroSubtitle}>
              Comprehensive Documentation Portal
            </p>
            <p>
              Access complete documentation for all NS Software products,
              including installation guides, API references, and deployment
              instructions.
            </p>
            <div className={styles.quickLinks}>
              <Link to="/exam-portal/overview" className={styles.quickLinkBtn}>
                Exam Portal Docs
              </Link>
              <Link
                to="/internship-portal/overview"
                className={styles.quickLinkBtn}>
                Internship Portal Docs
              </Link>
              <Link
                to="/ns-website/overview"
                className={styles.quickLinkBtn}>
                NS Website Docs
              </Link>
              <Link
                to="https://www.nssoftwaresolutions.in"
                className={styles.quickLinkBtn}>
                Company Info
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className={styles.container}>
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>Our Products</h2>
            <p className={styles.sectionSubtitle}>
              Choose a product to view its complete documentation
            </p>

            {/* Product Grid */}
            <div className={styles.productGrid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>



          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;

import hero from '../assets/images/headshot_bw.png';
import avatar from '../assets/images/patrick-photo_bw.png';
import type { SiteConfig } from '../types';

const siteConfig: SiteConfig = {
    website: 'https://pomara123.github.io/patrick-omara-website',
    avatar: {
        src: avatar,
        alt: 'Patrick O\'Mara'
    },
    title: "Patrick O'Mara",
    subtitle: 'Biotech IT and Digital Leader',
    description: 'Personal website and portfolio of Patrick O\'Mara, showcasing projects, blog posts, and professional experience.',
    image: {
        src: hero,
        alt: 'Patrick O\'Mara at desk'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '.' // relative link
        },
        {
            text: 'Projects',
            href: 'projects'
        },
        // Uncomment if you add these sections later
        // { text: 'Blog', href: 'blog' },
        // { text: 'Tags', href: 'tags' }
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: 'about'
        },
        {
            text: 'Contact',
            href: 'contact'
        },
        {
            text: 'Terms',
            href: 'terms'
        }
        // { text: 'Download theme', href: 'https://github.com/JustGoodUI/dante-astro-theme' }
    ],
    socialLinks: [
        {
            text: 'LinkedIn',
            href: 'https://www.linkedin.com/in/patrick-o-mara/'
        }
    ],
    hero: {
        title: 'Hi There & Welcome to My Corner of the Web!',
        text: `I am Patrick O’Mara, a data and technology leader focused on building resilient systems, empowering scientists, and improving decision making. I work at the intersection of cloud engineering, data platforms, and biotech operations. I combine practical intuition with focused research to create clean and scalable solutions.

I have a strong appreciation for elegant architectures, thoughtful automation, and products that simplify complex work for real users. My approach is grounded in collaboration, clarity, and a product-focused mindset. I enjoy designing scientific data ecosystems, integrating laboratory and enterprise platforms, and helping teams move efficiently with modern cloud tools.`,
        image: {
            src: hero,
            alt: 'Patrick O\'Mara at desk'
        },
        actions: [
            {
                text: 'Get in Touch',
                href: 'contact'
            }
        ]
    },
    // Optional newsletter subscription
    // subscribe: {
    //   enabled: true,
    //   title: 'Subscribe to Newsletter',
    //   text: 'One update per week. All the latest posts directly in your inbox.',
    //   form: {
    //     action: '#'
    //   }
    // },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;

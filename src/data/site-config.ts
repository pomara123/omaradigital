import hero from '../assets/images/headshot_bw.png';
import avatar from '../assets/images/patrick-photo.jpg';
import type { SiteConfig } from '../types';
const base = import.meta.env.BASE_URL || '/';

const siteConfig: SiteConfig = {
    website: 'https://pomara123.github.io/patrick-omara-website/',
    avatar: {
        src: avatar,
        alt: "Patrick O'Mara"
    },
    title: "Patrick O'Mara",
    subtitle: 'Biotech IT and Digital Leader',
    description: 'Patrick OMara professional website',
    // image: {
    //     src: '/dante-preview.jpg',
    //     alt: 'Dante - Astro.js and Tailwind CSS theme'
    // },
    headerNavLinks: [
        {
            text: 'Home',
            href: `${base}`
        },
        {
            text: 'Projects',
            href: `${base}projects`
        },
        // {
        //     text: 'Blog',
        //     href: '/blog'
        // },
        // {
        //     text: 'Tags',
        //     href: '/tags'
        // }
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: `${base}about`
        },
        {
            text: 'Contact',
            href: `${base}contact`
        },
        {
            text: 'Terms',
            href: `${base}terms`
        },
        // {
        //     text: 'Download theme',
        //     href: 'https://github.com/JustGoodUI/dante-astro-theme'
        // }
    ],
    socialLinks: [
        {
            text: 'LinkedIn',
            href: 'https://www.linkedin.com/in/patrick-o-mara/'
        }
    ],
    hero: {
        title: 'People, Technology, Data, and Scientific Process Leader',
        text: "I am Patrick O’Mara, a data and technology leader who believes that the intersection of people, technology, science, and processes is central to a successful biotech or pharma organization. I take a practical, grounded approach to implementing thoughtful strategy through agility, collaboration, and scalable solutions.",
        image: {
            src: hero,
            alt: 'A person sitting at a desk in front of a computer'
        },
        actions: [
            {
                text: 'Get in Touch',
                href: `${base}contact`
            }
        ]
    },
    // subscribe: {
    //     enabled: true,
    //     title: 'Subscribe to Dante Newsletter',
    //     text: 'One update per week. All the latest posts directly in your inbox.',
    //     form: {
    //         action: '#'
    //     }
    // },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;

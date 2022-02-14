import Image from 'next/image';

interface FooterLink {
  icon: string;
  link: string;
  channel: string;
}

const links: FooterLink[] = [
  {
    icon: 'https://cdn1.iconfinder.com/data/icons/logotypes/32/github-256.png',
    link: 'https://github.com/blocktobody',
    channel: 'github',
  },
  {
    icon: 'https://cdn1.iconfinder.com/data/icons/social-media-circle-7/512/Circled_Linkedin_svg-256.png',
    link: 'https://www.linkedin.com/in/danbi-lee-7469061ab/',
    channel: 'linkedin',
  },
];

export default function Footer() {
  return (
    <div>
      {links.map(({ icon, link, channel }) => (
        <a key={channel} href={link} rel="noopener noreferrer">
          <Image src={icon} width={24} height={24} alt={channel} />
        </a>
      ))}
    </div>
  );
}

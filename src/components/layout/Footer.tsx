import styled from '@emotion/styled';
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

const MAIL = 'blocktobody@gmail.com';
const TEL = '+81-10-4503-5219';

export default function Footer() {
  return (
    <Container>
      <Links>
        {links.map(({ icon, link, channel }) => (
          <a key={channel} href={link} rel="noopener noreferrer">
            <Image src={icon} width={24} height={24} alt={channel} />
          </a>
        ))}
      </Links>
      <Infos>
        <Contacts>
          <a href={`mailto:${MAIL}`}>{MAIL}</a>
          <a href={`tel:${TEL}`}>{TEL}</a>
        </Contacts>
        <Copyright>Copyright © Danbi Lee</Copyright>
      </Infos>
    </Container>
  );
}

const Container = styled.footer`
  width: 100vw;
  padding: 0 calc(50vw - 500px);
  margin-bottom: 50px;
`;

const Links = styled.ul`
  margin-bottom: 16px;

  & > a:not(:last-of-type) {
    margin-right: 24px;
  }
`;

const Infos = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Contacts = styled.div`
  display: flex;
  align-items: center;

  & > a:not(:last-of-type) {
    position: relative;
    margin-right: 26px;

    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--gray-300);
      right: -16px;
      top: calc(50% - 1px);
      cursor: auto;
    }
  }
`;

const Copyright = styled.p`
  color: var(--gray-300);
  font-size: 14px;
`;

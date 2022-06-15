import styled from '@emotion/styled';
import Image from 'next/image';

import mediaQuery from '@styles/mediaQuery';

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
          <Link key={channel} href={link} rel="noopener noreferrer">
            <Image src={icon} width={24} height={24} alt={channel} />
          </Link>
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
  max-width: 100%;
  padding: 0 calc(50vw - 430px);
  margin-bottom: 50px;

  ${mediaQuery.mobile} {
    padding: 0 20px;
    margin-bottom: 30px;
  }
`;

const Links = styled.ul`
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  ${mediaQuery.mobile} {
    justify-content: center;
    margin-bottom: 20px;
  }

  & > a:not(:last-of-type) {
    margin-right: 24px;
  }
`;

const Link = styled.a`
  opacity: 0.85;
`;

const Infos = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${mediaQuery.mobile} {
    flex-direction: column;
  }
`;

const Contacts = styled.div`
  display: flex;
  align-items: center;

  ${mediaQuery.mobile} {
    font-size: 14px;
    font-weight: 300;
    margin-bottom: 10px;
  }

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
      background: ${({ theme }) => theme.colors.gray300};
      right: -16px;
      top: calc(50% - 1px);
      cursor: auto;
    }
  }
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.gray300};
  font-size: 14px;

  ${mediaQuery.mobile} {
    font-size: 12px;
    font-weight: 300;
  }
`;

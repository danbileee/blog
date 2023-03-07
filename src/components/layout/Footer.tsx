import styled from '@emotion/styled';

import mediaQuery from '@styles/mediaQuery';
import Image from 'next/image';

interface FooterLink {
  link: string;
  icon: string;
  channel: string;
}

const links: FooterLink[] = [
  {
    link: 'https://github.com/danbileee',
    icon: 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-social-github-64.png',
    channel: 'github',
  },
  {
    link: 'https://www.linkedin.com/in/danbileee/',
    icon: 'https://cdn4.iconfinder.com/data/icons/social-icons-16/512/LinkedIn_alt-64.png',
    channel: 'linkedin',
  },
  {
    link: 'mailto:hello@danbileee.com',
    icon: 'https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_send-64.png',
    channel: 'email',
  },
  // {
  //   link: 'https://danbilee.notion.site/96331d34be2544799460dbb059e8549b?v=f40d19eafec1454181df9e467eb9ad24',
  //   icon: 'https://cdn0.iconfinder.com/data/icons/google-material-design-3-0/48/ic_book_48px-64.png',
  //   channel: 'bookmarks',
  // },
  {
    link: 'https://danbileee.com/feed.xml',
    icon: 'https://cdn2.iconfinder.com/data/icons/font-awesome/1792/rss-64.png',
    channel: 'rss',
  },
];

export default function Footer() {
  return (
    <Container>
      <Links>
        {links.map(({ link, icon, channel }) => (
          <Link
            key={link}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              width={20}
              height={20}
              src={icon}
              alt={`${channel} 아이콘`}
            />
          </Link>
        ))}
      </Links>
      <Copyright>© Danbi Lee</Copyright>
    </Container>
  );
}

const Container = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 100%;
  padding: 0 calc(50vw - 430px) 50px;
  left: 0;
  bottom: 0;

  ${mediaQuery.mobile} {
    flex-direction: column;
    padding: 0 20px 30px;
  }
`;

const Links = styled.ul`
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  ${mediaQuery.mobile} {
    justify-content: center;
  }

  & > a:not(:last-of-type) {
    margin-right: 20px;
  }
`;

const Link = styled.a`
  display: inline-flex;
  font-size: 16px;
  font-weight: 500;
  background-color: transparent;
  padding: 8px;
  border-radius: 4px;
  opacity: 0.85;
  transition: background-color ease-in-out 150ms;

  ${mediaQuery.hover} {
    :hover {
      background-color: var(--skyblue);
    }
  }

  ${mediaQuery.mobile} {
    font-size: 15px;
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

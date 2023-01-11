import LinkIcon from '@components/icons/LinkIcon';
import { CareerFrontMatter } from '@constants/types';
import { useGlobalContext } from '@contexts/global';
import styled from '@emotion/styled';
import mediaQuery from '@styles/mediaQuery';
import { PropsWithChildren } from 'react';

function getMockupPath(id: string) {
  return `/career/${id}-mockup.jpg`;
}

function CareerLink({ href, children }: PropsWithChildren<{ href: string }>) {
  return (
    <Link href={href} target="_blank" rel="noreferrer noopener">
      <LinkIcon />
      <p style={{ marginLeft: '4px' }}>{children}</p>
    </Link>
  );
}

interface Props {
  id: string;
  frontMatter: CareerFrontMatter;
}

export default function Career({ id, frontMatter }: Props) {
  const { title, link, demo, description } = frontMatter;
  const { isMobile } = useGlobalContext();

  return (
    <Container>
      <Content>
        <Title>{title}</Title>
        <Links>
          <CareerLink href={link}>사이트 방문</CareerLink>
          {demo && <CareerLink href={demo.link}>{demo.title}</CareerLink>}
        </Links>
        {isMobile && (
          <MockupContainer>
            <Mockup src={getMockupPath(id)} />
          </MockupContainer>
        )}
        <Description>{description}</Description>
      </Content>
      {!isMobile && <Mockup src={getMockupPath(id)} />}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: calc(100vh - 490px);

  ${mediaQuery.mobile} {
    flex-direction: column;
    min-height: calc(100vh - 360px);
    height: fit-content;
  }
`;

const Content = styled.div`
  width: 400px;

  ${mediaQuery.mobile} {
    width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 30px;
  margin-bottom: 12px;

  ${mediaQuery.mobile} {
    font-size: 28px;
  }
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;

  ${mediaQuery.mobile} {
    margin-bottom: 24px;
  }
`;

const Link = styled.a`
  display: flex;
  align-items: center;
`;

const Description = styled.p`
  line-height: 1.6;
  margin-bottom: 20px;
`;

const MockupContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Mockup = styled.div<{ src: string }>`
  width: 400px;
  height: 100%;
  background-image: url(${({ src }) => src});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;

  ${mediaQuery.mobile} {
    width: 320px;
    height: 400px;
  }
`;

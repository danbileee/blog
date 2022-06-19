import { CareerFrontMatter } from '@constants/types';
import { useGlobalContext } from '@contexts/global';
import styled from '@emotion/styled';
import mediaQuery from '@styles/mediaQuery';
import Image from 'next/image';
import { Children, PropsWithChildren } from 'react';

function getMockupPath(id: string) {
  return `/career/${id}-mockup.jpg`;
}

function CareerLink({ href, children }: PropsWithChildren<{ href: string }>) {
  return (
    <Link href={href} target="_blank" rel="noreferrer noopener">
      <Image width={18} height={18} src="/icon-link.png" alt="link icon" />
      <p style={{ marginLeft: '4px' }}>{children}</p>
    </Link>
  );
}

interface Props {
  id: string;
  frontMatter: CareerFrontMatter;
}

export default function CareerItem({ id, frontMatter }: Props) {
  const { title, link, demo, description, tags } = frontMatter;
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
            <Mockup src={getMockupPath(id)} alt={title} />
          </MockupContainer>
        )}
        <Description>{description}</Description>
        <Tags>{Children.toArray(tags.map((tag) => <Tag>{tag}</Tag>))}</Tags>
      </Content>
      {!isMobile && <Mockup src={getMockupPath(id)} alt={title} />}
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

const Title = styled.h4`
  font-size: 28px;
  margin-bottom: 12px;

  ${mediaQuery.mobile} {
    font-size: 24px;
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

const Tags = styled.ul`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Tag = styled.li`
  font-size: 14px;
  padding: 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.gray100};
`;

const MockupContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Mockup = styled.img`
  object-fit: contain;
  object-position: center;
  width: 400px;
  height: 100%;

  ${mediaQuery.mobile} {
    width: 320px;
    height: auto;
  }
`;

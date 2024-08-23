import React, { useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import backgroundImage from "@img/background2.webp";
import { useInView } from 'react-intersection-observer';
import { useMediaQuery } from 'react-responsive';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: #1d1d1f;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  
  @media (min-width: 768px) {
    padding: 4rem 2rem;
  }
`;

const Header = styled.h1`
  font-size: 56px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const Section = styled(motion.section)`
  margin-bottom: 3rem;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    margin-bottom: 6rem;
    padding: 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1d1d1f;
  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 1rem;
  }
`;

const Paragraph = styled.p`
  font-size: 21px;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  color: #333;
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 1rem;
  }
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  font-size: 21px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  color: #333;
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 0.75rem;
  }

  &:before {
    content: '•';
    color: #0071e3;
    font-size: 24px;
    margin-right: 10px;
  }
`;

const Image = styled(motion.img)`
  width: 100%;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

// Scroll animation component
const ScrollAnimationItem = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

const slideAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const SlideContainer = styled.div`
  overflow: hidden;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 0;

  @media (min-width: 768px) {
    margin-bottom: 4rem;
    padding: 20px 0;
  }
`;

const SlideTrack = styled.div`
  display: flex;
  animation: ${slideAnimation} 15s linear infinite;

  @media (min-width: 768px) {
    animation-duration: 30s;
  }

  &:hover {
    animation-play-state: paused;
  }
`;

const SlideItem = styled.div`
  flex: 0 0 auto;
  width: 150px;
  margin-right: 10px;
  text-align: center;

  @media (min-width: 768px) {
    width: 200px;
    margin-right: 20px;
  }
`;

const SlideImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const SlideTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const WelcomeText = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  line-height: 1.4;
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const collaborationImage1 = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
const collaborationImage2 = "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

const About = () => {
  const containerRef = useRef(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const openSourceValues = [
    { title: "Collaboration", image: "https://via.placeholder.com/200x150?text=Collaboration" },
    { title: "Transparency", image: "https://via.placeholder.com/200x150?text=Transparency" },
    { title: "Innovation", image: "https://via.placeholder.com/200x150?text=Innovation" },
    { title: "Community", image: "https://via.placeholder.com/200x150?text=Community" },
    { title: "Accessibility", image: "https://via.placeholder.com/200x150?text=Accessibility" },
    { title: "Sustainability", image: "https://via.placeholder.com/200x150?text=Sustainability" },
  ];

  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundAttachment: 'scroll',
      backgroundSize: 'cover',
      minHeight: '100vh',
    }}>
      <Container ref={containerRef}>
        <WelcomeText>
          Empowering Innovation Through Open Collaboration.<br />
          Join Our Journey in Building Impactful Open Source Products.
        </WelcomeText>

        <SlideContainer>
          <SlideTrack>
            {[...openSourceValues, ...openSourceValues].map((value, index) => (
              <SlideItem key={index}>
                <SlideImage src={value.image} alt={value.title} />
                <SlideTitle>{value.title}</SlideTitle>
              </SlideItem>
            ))}
          </SlideTrack>
        </SlideContainer>

        <ScrollAnimationItem>
          <Section>
            <SectionTitle>Collaborative Product Development</SectionTitle>
            <Paragraph>
              We believe in the power of open source to create products that truly matter.
              Our community-driven approach focuses on developing solutions that address
              real-world challenges, fostering innovation through collaboration and shared knowledge.
            </Paragraph>
          </Section>
        </ScrollAnimationItem>

        <ScrollAnimationItem>
          <Section>
            <SectionTitle>Our Mission</SectionTitle>
            <Paragraph>
              We're committed to driving positive change through open source. Our mission is to:
            </Paragraph>
            <List>
              <ListItem>Create impactful products that solve real-world problems</ListItem>
              <ListItem>Foster a global community of contributors and innovators</ListItem>
              <ListItem>Promote transparency and knowledge sharing in product development</ListItem>
              <ListItem>Ensure accessibility and inclusivity in technology</ListItem>
            </List>
          </Section>
        </ScrollAnimationItem>

        <ScrollAnimationItem>
          <Section>
            <SectionTitle>What We Cover</SectionTitle>
            <Paragraph>
              Our content spans the entire spectrum of open source product development:
            </Paragraph>
            <List>
              <ListItem>Open Source Project Management and Governance</ListItem>
              <ListItem>Collaborative Design and Development Practices</ListItem>
              <ListItem>Community Building and Engagement Strategies</ListItem>
              <ListItem>Open Source Business Models and Sustainability</ListItem>
              <ListItem>Ethical Considerations in Open Source Development</ListItem>
              <ListItem>Impact Assessment of Open Source Projects</ListItem>
            </List>
          </Section>
        </ScrollAnimationItem>

        <ScrollAnimationItem>
          <Section>
            <SectionTitle>Join Our Open Source Community</SectionTitle>
            <Paragraph>
              We're more than just a blog – we're a thriving open source community. Here's how you can get involved:
            </Paragraph>
            <List>
              <ListItem>Contribute to our open source projects on GitHub</ListItem>
              <ListItem>Share your experiences and insights through guest posts</ListItem>
              <ListItem>Participate in community discussions and code reviews</ListItem>
              <ListItem>Attend or organize local open source meetups and hackathons</ListItem>
            </List>
          </Section>
        </ScrollAnimationItem>

        <ScrollAnimationItem>
          <Section>
            <SectionTitle>Stay Connected</SectionTitle>
            <Paragraph>
              Don't miss out on the latest in open source product development. Subscribe to our newsletter
              and follow us on social media to stay at the forefront of collaborative innovation.
            </Paragraph>
            <Paragraph>
              Your contributions can shape the future of technology. Let's innovate, share, and build together!
            </Paragraph>
          </Section>
        </ScrollAnimationItem>
      </Container>
    </div>
  );
};

export default About;
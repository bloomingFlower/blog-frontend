import React, { useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import backgroundImage from "@img/background2.webp";
import { useInView } from 'react-intersection-observer';

// Styled components for Apple-like design
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  color: #1d1d1f;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Header = styled.h1`
  font-size: 56px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Section = styled(motion.section)`
  margin-bottom: 6rem;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1d1d1f;
`;

const Paragraph = styled.p`
  font-size: 21px;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  color: #333;
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
    transform: translateX(-50%);
  }
`;

const SlideContainer = styled.div`
  overflow: hidden;
  margin-bottom: 4rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px 0;
`;

const SlideTrack = styled.div`
  display: flex;
  animation: ${slideAnimation} 30s linear infinite;
  &:hover {
    animation-play-state: paused;
  }
`;

const SlideItem = styled.div`
  flex: 0 0 auto;
  width: 200px;
  margin-right: 20px;
  text-align: center;
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
`;

const About = () => {
  const containerRef = useRef(null);

  const techFields = [
    { title: "Web Development", image: "https://via.placeholder.com/200x150?text=Web+Dev" },
    { title: "Mobile App Development", image: "https://via.placeholder.com/200x150?text=Mobile+Dev" },
    { title: "Cloud Computing and DevOps", image: "https://via.placeholder.com/200x150?text=Cloud+DevOps" },
    { title: "AI and Machine Learning", image: "https://via.placeholder.com/200x150?text=AI+ML" },
    { title: "Cybersecurity", image: "https://via.placeholder.com/200x150?text=Cybersecurity" },
    { title: "IoT, Blockchain, AR/VR", image: "https://via.placeholder.com/200x150?text=Emerging+Tech" },
  ];

  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      minHeight: '200vh',
    }}>
      <Container ref={containerRef}>
        <WelcomeText>
          Sharing knowledge, inspiring innovation.<br />
          Join us on this transformative tech journey.
        </WelcomeText>

        <SlideContainer>
          <SlideTrack>
            {[...techFields, ...techFields].map((field, index) => (
              <SlideItem key={index}>
                <SlideImage src={field.image} alt={field.title} />
                <SlideTitle>{field.title}</SlideTitle>
              </SlideItem>
            ))}
          </SlideTrack>
        </SlideContainer>

        <ScrollAnimationItem>
          <Section>
            <Image
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
              alt="Coding on laptop"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <SectionTitle>Empowering Developers, One Post at a Time</SectionTitle>
            <Paragraph>
              Our blog is a vibrant hub for technology enthusiasts, developers, and curious minds.
              We're passionate about sharing cutting-edge insights, practical coding tips, and thought-provoking
              discussions on the ever-evolving world of technology.
            </Paragraph>
          </Section>
        </ScrollAnimationItem>

        <ScrollAnimationItem>
          <Section>
            <SectionTitle>Our Mission</SectionTitle>
            <Paragraph>
              We believe in the power of knowledge sharing and collaborative growth. Our mission is to:
            </Paragraph>
            <List>
              <ListItem>Inspire innovation through in-depth technical articles</ListItem>
              <ListItem>Foster a community of lifelong learners</ListItem>
              <ListItem>Bridge the gap between complex concepts and practical application</ListItem>
              <ListItem>Showcase the latest trends and best practices in software development</ListItem>
            </List>
          </Section>
        </ScrollAnimationItem>

        <ScrollAnimationItem>
          <Section>
            <SectionTitle>What We Cover</SectionTitle>
            <Paragraph>
              Our content spans a wide range of topics, carefully curated to keep you at the forefront of the tech industry:
            </Paragraph>
            <List>
              <ListItem>Web Development (Frontend & Backend)</ListItem>
              <ListItem>Mobile App Development</ListItem>
              <ListItem>Cloud Computing and DevOps</ListItem>
              <ListItem>Artificial Intelligence and Machine Learning</ListItem>
              <ListItem>Cybersecurity</ListItem>
              <ListItem>Emerging Technologies (IoT, Blockchain, AR/VR)</ListItem>
            </List>
          </Section>
        </ScrollAnimationItem>

        <ScrollAnimationItem>
          <Section>
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
              alt="Team collaboration"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <SectionTitle>Join Our Community</SectionTitle>
            <Paragraph>
              We're more than just a blog – we're a thriving community of tech enthusiasts. Here's how you can get involved:
            </Paragraph>
            <List>
              <ListItem>Engage with our content through comments and discussions</ListItem>
              <ListItem>Share your own experiences and insights</ListItem>
              <ListItem>Connect with fellow readers and industry professionals</ListItem>
              <ListItem>Participate in our webinars, coding challenges, and events</ListItem>
            </List>
          </Section>
        </ScrollAnimationItem>

        <ScrollAnimationItem>
          <Section>
            <SectionTitle>Stay Connected</SectionTitle>
            <Paragraph>
              Don't miss out on our latest articles, tutorials, and tech news. Subscribe to our newsletter
              and follow us on social media to stay up-to-date with the pulse of the tech world.
            </Paragraph>
            <Paragraph>
              Your journey in technology is our passion. Let's innovate, learn, and grow together!
            </Paragraph>
          </Section>
        </ScrollAnimationItem>
      </Container>
    </div>
  );
};

export default About;
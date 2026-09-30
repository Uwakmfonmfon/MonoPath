import { StatCategory } from '@/types';

export interface MasteryResource {
  name: string;
  description: string;
  link: string;
  type: 'Certification' | 'Community' | 'Competition' | 'Mentor';
}

export const MASTERY_DATABASE: Record<StatCategory, MasteryResource[]> = {
  Health: [
    { name: 'NSCA Certification', description: 'The gold standard for strength and conditioning professionals.', link: '#', type: 'Certification' },
    { name: 'r/Fitness', description: 'One of the largest health and fitness communities on the world.', link: '#', type: 'Community' },
    { name: 'Hyrox World Games', description: 'The global fitness race for every body.', link: '#', type: 'Competition' },
  ],
  Creative: [
    { name: 'Behance', description: 'Showcase and discover the creative work of millions.', link: '#', type: 'Community' },
    { name: 'AIGA', description: 'The professional association for design.', link: '#', type: 'Certification' },
    { name: 'Adobe Awards', description: 'Recognition for the best in digital creativity.', link: '#', type: 'Competition' },
  ],
  Mind: [
    { name: 'Coursera Specializations', description: 'University-backed certifications for deep mental mastery.', link: '#', type: 'Certification' },
    { name: 'LessWrong', description: 'A community dedicated to the art of human rationality.', link: '#', type: 'Community' },
    { name: 'World Chess Federation', description: 'Competitive chess on a global scale.', link: '#', type: 'Competition' },
  ],
  Social: [
    { name: 'Toastmasters International', description: 'Master the art of public speaking and leadership.', link: ' #', type: 'Certification' },
    { name: 'Meetup', description: 'Find and join local social circles based on interests.', link: '#', type: 'Community' },
    { name: 'Debate World Championships', description: 'The pinnacle of competitive argumentation.', link: '#', type: 'Competition' },
  ],
  Career: [
    { name: 'PMP Certification', description: 'Project Management Professional global standard.', link: '#', type: 'Certification' },
    { name: 'LinkedIn Learning', description: 'Curated professional development paths.', link: '#', type: 'Community' },
    { name: 'Forbes 30 Under 30', description: 'Recognition for young professional excellence.', link: '#', type: 'Competition' },
  ],
};

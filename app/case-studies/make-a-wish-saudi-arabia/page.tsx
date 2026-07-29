import type { Metadata } from 'next';
import '../case-study.css';
import CaseHero from '../CaseHero';
import CaseGallery, { type GalleryImage } from '../CaseGallery';
import CaseVideoGallery, { type GalleryVideo } from '../CaseVideoGallery';
import CaseFeatureVideo from '../CaseFeatureVideo';
import CaseDonut from '../CaseDonut';
import {
  CaseIntro,
  CaseSplit,
  CaseChallenges,
  CaseProcess,
  CaseServiceGroups,
  CaseTestimonial,
} from '../CaseContent';

const galleryImages: GalleryImage[] = [
  { src: '/MAW/maw-photo-1.jpg', alt: 'Make-A-Wish Saudi Arabia campaign photo 1' },
  { src: '/MAW/maw-photo-2.jpg', alt: 'Make-A-Wish Saudi Arabia campaign photo 2' },
  { src: '/MAW/maw-photo-3.jpg', alt: 'Make-A-Wish Saudi Arabia campaign photo 3' },
  { src: '/MAW/maw-photo-4.jpg', alt: 'Make-A-Wish Saudi Arabia campaign photo 4' },
];

const galleryVideos: GalleryVideo[] = [
  { src: '/MAW/maw-reel-1.mp4', poster: '/MAW/maw-reel-1-poster.jpg', title: 'Make-A-Wish Reel' },
  { src: '/MAW/maw-reel-2.mp4', poster: '/MAW/maw-reel-2-poster.jpg', title: 'Make-A-Wish Reel 2' },
  { src: '/MAW/maw-welcome-amer-reel.mp4', poster: '/MAW/maw-welcome-amer-reel-poster.jpg', title: 'Welcome Amer' },
  { src: '/MAW/maw-little-saud.mp4', poster: '/MAW/maw-little-saud-poster.jpg', title: 'Little Saud' },
  { src: '/MAW/maw-tayf-al-hammad.mp4', poster: '/MAW/maw-tayf-al-hammad-poster.jpg', title: 'Tayf Al Hammad' },
  { src: '/MAW/maw-rashid-football-player.mp4', poster: '/MAW/maw-rashid-football-player-poster.jpg', title: 'Rashid — Football Player' },
  { src: '/MAW/maw-ghaliya-miniso-visit.mp4', poster: '/MAW/maw-ghaliya-miniso-visit-poster.jpg', title: 'Ghaliya — Miniso Visit' },
  { src: '/MAW/maw-gala-and-ghazal.mp4', poster: '/MAW/maw-gala-and-ghazal-poster.jpg', title: 'Gala and Ghazal' },
];

export const metadata: Metadata = {
  title: 'Make-A-Wish Saudi Arabia: Charity Awareness Case Study',
  description: 'Make-A-Wish Saudi Arabia is a non-profit organization dedicated to granting life-changing wishes for children with critical illnesses, bringing a global humanitarian mission into the local Saudi community.',
};

export default function MakeAWishSaudiArabiaCaseStudy() {
  return (
    <>
      <CaseHero
        image="/placeholder-case-study.webp"
        category="Non-Profit"
        client="Make-A-Wish Saudi Arabia"
        title="Charity Awareness Campaign"
        result="We developed content and creative assets that translate the impact of wish-granting into simple, emotional, and inspiring stories."
      />

      <CaseIntro
        title="About the Client"
        meta={[
          { label: 'Category', value: 'Charity / Non-Profit Organization' },
          { label: 'Location', value: 'KSA' },
        ]}
        paragraphs={[
          'Make-A-Wish Saudi Arabia is a non-profit organization dedicated to granting life-changing wishes for children with critical illnesses. As the Saudi affiliate of one of the world’s most recognized wish-granting organizations, it brings a global humanitarian mission into the local Saudi community with a focus on hope, emotional support, and meaningful impact.',
        ]}
        visual={<CaseFeatureVideo src="/MAW/maw-reel-1.mp4" poster="/MAW/maw-reel-1-poster.jpg" title="Make-A-Wish Reel" />}
      />

      <section className="cs-section">
        <div className="cs-container">
          <CaseSplit
            image="/MAW/maw-photo-1.jpg"
            collage={['/MAW/maw-photo-1.jpg', '/MAW/maw-photo-2.jpg', '/MAW/maw-photo-3.jpg', '/MAW/maw-photo-4.jpg']}
            imageAlt="Make-A-Wish Saudi Arabia campaign moments"
          >
            <CaseChallenges
              title="Main Challenges or Milestones"
              items={[
                'Introducing the wish-granting concept into Saudi society in a way that feels clear, trusted, culturally relevant, and emotionally resonant.',
                'Building awareness for charity work in a sensitive space where giving is often associated with Zakat, Sadaqah, and direct financial aid.',
                'Explaining the role of NGOs and NPOs in supporting children and families emotionally, not only financially—showing how a wish can bring hope, strength, and joy during difficult medical journeys.',
              ]}
            />
            <div style={{ marginTop: 40 }}>
              <CaseDonut
                title="Content Focus Split"
                segments={[
                  { label: 'Wish Stories', value: 64, color: 'var(--magenta)' },
                  { label: 'Community Awareness', value: 36, color: 'var(--gold)' },
                ]}
              />
            </div>
          </CaseSplit>
        </div>
      </section>

      <section className="cs-section cs-section-alt">
        <div className="cs-container">
          <CaseProcess
            steps={[
              {
                title: 'Audit & Strategy',
                description: 'We analyzed Make-A-Wish Saudi Arabia’s mission, audience sensitivities, charitable positioning, and digital presence to create a communication direction rooted in empathy, trust, and cultural awareness.',
              },
              {
                title: 'Creation & Execution',
                description: 'We developed content and creative assets that translate the impact of wish-granting into simple, emotional, and inspiring stories. Our approach focused on helping audiences understand that support can be more than financial—it can be a moment of hope, a smile, and a memory that stays with a child and their family.',
              },
              {
                title: 'Ongoing Management',
                description: 'We continuously refined the brand’s communication based on audience response, campaign priorities, and community engagement. The goal was to keep the message human, respectful, and clear while growing awareness around the organization’s mission in Saudi Arabia.',
              },
            ]}
          />
        </div>
      </section>

      <CaseServiceGroups
        eyebrow="What We Offer"
        title="Services We Provide"
        groups={[
          {
            heading: 'Branding & Creative',
            items: ['Visual Guidelines & Typography', 'Graphic Design & Art Direction', 'Video Production & Animation', 'UI/UX Design'],
          },
          {
            heading: 'Social Media',
            items: ['Social Media Strategy', 'Content Creation & Calendar Management', 'Community Management', 'Influencer Marketing'],
          },
          {
            heading: 'Web & Tech',
            items: ['Website Development', 'Landing Page Creation'],
          },
        ]}
      />

      <CaseVideoGallery title="Wish Stories on Video" videos={galleryVideos} />

      <CaseGallery title="Campaign Gallery" images={galleryImages} />

      <CaseTestimonial
        quote="It is an honor to help draw a smile on a child’s face. With Wide Wings’ creative approach, we were able to communicate the power of a wish with warmth, clarity, and heart."
        attribution="— Make-A-Wish Saudi Arabia"
      />
    </>
  );
}

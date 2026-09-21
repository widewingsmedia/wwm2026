// Default team roster, shown until a webadmin saves changes from
// /admin/team. Both the public /api/team route and the About Us page
// fall back to this list.
export interface TeamMember {
  id: string;
  name: string;
  title: string;
  img: string; // public path, external URL, or data: URI (uploaded photo)
}

export const DEFAULT_TEAM: TeamMember[] = [
  { id: 'asad-hayat',           name: 'Asad Hayat',               title: 'Chief Operating Officer',  img: '/AsadHayat.png' },
  { id: 'alaa',                 name: 'Alaa Mokhless Ali',        title: 'Account Manager',          img: '/Alaa.webp' },
  { id: 'nouran',                name: 'Nouran Mamdouh',           title: 'Account Manager',          img: '/nowran.webp' },
  { id: 'ebtehal',              name: 'Ebtehal Elnoras',          title: 'Account Manager',          img: '/Ebtehal.webp' },
  { id: 'rawan',                name: 'Rawan Akram',              title: 'Account Manager',          img: '/RawanAkram.webp' },
  { id: 'shaarawi',             name: 'Mohamed Shaarawi',         title: 'Full-Stack Web Developer', img: '/Shaarawi.webp' },
  { id: 'juba',                 name: 'Mohamed Ibrahim Juba',     title: 'Graphic Designer',         img: '/MohamedIbrahimJuba.webp' },
  { id: 'mahmoud',              name: 'Mahmoud Ismail',           title: 'Graphic Designer',         img: '/MahmoudIsmail.webp' },
  { id: 'prasanna',             name: 'Prasanna Veeramani',       title: 'Graphic Designer',         img: '/Prasanna.webp' },
  { id: 'nesma',                name: 'Nesma Ibrahim',            title: 'Graphic Designer',         img: '/Nesma.webp' },
  { id: 'asmaa',                name: 'Asmaa Mostafa',            title: 'Content Creator',          img: '/Asmaa.webp' },
  { id: 'doha',                 name: 'Doha Ghareeb',             title: 'Content Creator',          img: '/Doha.webp' },
  { id: 'eslam',                name: 'Eslam Deif',               title: 'Media Buyer',              img: '/Eslam.webp' },
  { id: 'kareem',               name: 'Kareem Ayman Abdu',        title: 'Media Buyer',              img: '/Kareemayman.webp' },
  { id: 'rana',                 name: 'Rana Amir Irshad',         title: 'Cash Flow In-charge',      img: '/Amir.webp' },
  { id: 'vivian',               name: 'Vivian D’Souza',      title: 'SEO Executive',            img: '/VivianDSouza.png' },
  { id: 'nishant',              name: 'Nishant Nambiar',          title: 'HR Manager',               img: '/NishantNambiar-team2.webp' },
  { id: 'aariff',               name: 'Mohamed Aariff',           title: 'HR Executive',             img: '/MohamedAariff-team2.webp' },
  { id: 'rachelle',             name: 'Rachelle Ingles',          title: 'Sales Manager',            img: '/RachelleIngles-team2.webp' },
  { id: 'sethu',                name: 'Sethu Raj',                title: 'Business Analyst',         img: '/SethuRaj-team2.webp' },
  { id: 'joyal',                name: 'Joyal Joseph',             title: 'Senior Accountant',        img: '/JoyalJoseph-team2.webp' },
  { id: 'marilyn',              name: 'Marilyn Bernadio Perreras', title: 'Purchasing Officer',      img: '/MarilynPerreras-team2.webp' },
  { id: 'pratap',               name: 'Pratap Pillai',            title: 'Senior IT Associate',      img: '/PratapPillai-team2.webp' },
  { id: 'wasim',                name: 'Mohammad Wasim Ahmad',     title: 'Website Developer',        img: '/WasimAhmad-team2.webp' },
  { id: 'hassan',               name: 'Hassan',                   title: 'Video Editor',             img: '/Hassan-team2.webp' },
  { id: 'yaseen',               name: 'Mohamed Yaseen',           title: 'Video Editor',             img: '/MohamedYaseen-team2.webp' },
  { id: 'nadishka',             name: 'Nadishka Ranasinghe',      title: 'Photographer',             img: '/NadishkaRanasinghe-team2.webp' },
];

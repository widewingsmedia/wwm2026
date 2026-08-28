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
];

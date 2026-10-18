export interface PersonFact {
  label: string;
  value: string;
}

export interface PersonProfile {
  slug: string;
  name: string;
  role: string;
  category: string;
  period: string;
  initials: string;
  image?: string;
  imageAlt?: string;
  introduction: string;
  biography: string[];
  facts: PersonFact[];
  tags: string[];
}

export const leadershipProfiles: PersonProfile[] = [
  {
    slug: "raymond-p-dougherty",
    name: "Rev. Raymond P. Dougherty",
    role: "First Principal",
    category: "Leadership",
    period: "Founding era · 1904",
    initials: "RD",
    introduction:
      "Rev. Raymond P. Dougherty served as the first principal of Albert Academy during its founding period in 1904.",
    biography: [
      "Rev. Raymond P. Dougherty is recorded as the first principal of Albert Academy, placing him at the centre of the school's earliest institutional years.",
      "His leadership belongs to the formative period of the Academy, when the school was establishing its academic and organisational foundations in Freetown.",
      "His place in the school's history connects the present-day Academy with the people who helped establish its early educational tradition.",
    ],
    facts: [
      {
        label: "Position",
        value: "First Principal",
      },
      {
        label: "Period",
        value: "1904",
      },
      {
        label: "Institution",
        value: "Albert Academy",
      },
    ],
    tags: ["Founder-era leadership", "Principal", "1904"],
  },
  {
    slug: "edwin-hursh",
    name: "Edwin Hursh",
    role: "First Vice Principal",
    category: "Leadership",
    period: "Founding era · 1904",
    initials: "EH",
    introduction:
      "Edwin Hursh served as the first vice principal associated with Albert Academy during its founding period.",
    biography: [
      "Edwin Hursh is documented as the first vice principal of Albert Academy.",
      "His role formed part of the Academy's original leadership structure as the institution began its work in 1904.",
      "The early administrative team established during this period became part of the institutional foundation on which subsequent generations of Albert Academy leadership built.",
    ],
    facts: [
      {
        label: "Position",
        value: "First Vice Principal",
      },
      {
        label: "Period",
        value: "1904",
      },
      {
        label: "Institution",
        value: "Albert Academy",
      },
    ],
    tags: ["Founder-era leadership", "Vice Principal", "1904"],
  },
  {
    slug: "albert-fofie-kawa",
    name: "Albert Fofie Kawa",
    role: "Former Principal & Vice Principal",
    category: "Leadership",
    period: "Former administration",
    initials: "AK",
    introduction:
      "Albert Fofie Kawa served Albert Academy in senior leadership roles, including Vice Principal and Principal.",
    biography: [
      "Albert Fofie Kawa was associated with Albert Academy leadership as both Vice Principal and Principal.",
      "His career represents a later chapter in the Academy's long history of institutional stewardship and school administration.",
      "He is remembered in school and alumni accounts as a significant figure in the leadership history of Albert Academy.",
    ],
    facts: [
      {
        label: "Roles",
        value: "Vice Principal & Principal",
      },
      {
        label: "Institution",
        value: "Albert Academy",
      },
      {
        label: "Leadership",
        value: "Former administration",
      },
    ],
    tags: ["Principal", "Vice Principal", "School leadership"],
  },
];

export const notableAlumni: PersonProfile[] = [
  {
    slug: "sir-milton-margai",
    name: "Sir Milton Margai",
    role: "First Prime Minister of Sierra Leone",
    category: "Notable Alumni",
    period: "Independence era",
    initials: "MM",
    introduction:
      "Sir Milton Margai was a physician and statesman who became Sierra Leone's first Prime Minister at independence.",
    biography: [
      "Sir Milton Margai is one of the prominent figures associated with Albert Academy's alumni history.",
      "A physician and statesman, he played a central role in Sierra Leone's transition to independence and became the country's first Prime Minister.",
      "His public career forms part of the wider history of Sierra Leone's emergence as an independent nation.",
    ],
    facts: [
      {
        label: "Field",
        value: "Medicine & public service",
      },
      {
        label: "National office",
        value: "First Prime Minister",
      },
      {
        label: "Period",
        value: "Independence era",
      },
    ],
    tags: ["Statesman", "Prime Minister", "Independence"],
  },
  {
    slug: "siaka-stevens",
    name: "Siaka Stevens",
    role: "Statesman & Former President",
    category: "Notable Alumni",
    period: "Post-independence era",
    initials: "SS",
    introduction:
      "Siaka Stevens was a Sierra Leonean statesman who served as Prime Minister before becoming the country's first executive President.",
    biography: [
      "Siaka Stevens is included among the prominent alumni associated with Albert Academy.",
      "He served in senior national political office during Sierra Leone's post-independence period.",
      "His career forms part of the country's political history after independence.",
    ],
    facts: [
      {
        label: "Field",
        value: "Public service",
      },
      {
        label: "National office",
        value: "President of Sierra Leone",
      },
      {
        label: "Period",
        value: "Post-independence era",
      },
    ],
    tags: ["Statesman", "President", "Public service"],
  },
  {
    slug: "john-karefa-smart",
    name: "John Karefa-Smart",
    role: "Physician & Politician",
    category: "Notable Alumni",
    period: "20th century",
    initials: "JK",
    introduction:
      "Dr. John Karefa-Smart was a Sierra Leonean physician and politician associated with the country's early post-independence public life.",
    biography: [
      "John Karefa-Smart is recognised among the notable alumni associated with Albert Academy.",
      "He trained and worked as a physician while also participating in Sierra Leonean public and political life.",
      "His career reflects the combination of professional education and public service represented by several figures in the Academy's alumni history.",
    ],
    facts: [
      {
        label: "Profession",
        value: "Physician",
      },
      {
        label: "Public life",
        value: "Politician & statesman",
      },
      {
        label: "Period",
        value: "20th century",
      },
    ],
    tags: ["Physician", "Politician", "Public service"],
  },
  {
    slug: "abdulai-conteh",
    name: "Abdulai Conteh",
    role: "Lawyer & Statesman",
    category: "Notable Alumni",
    period: "Contemporary Sierra Leonean history",
    initials: "AC",
    introduction:
      "Abdulai Conteh is a Sierra Leonean lawyer and statesman who held senior public offices.",
    biography: [
      "Abdulai Conteh is included among the notable alumni associated with Albert Academy.",
      "His professional career has included legal practice and senior public service.",
      "His association with the Academy forms part of the institution's broader alumni record of graduates who entered national public life.",
    ],
    facts: [
      {
        label: "Profession",
        value: "Lawyer",
      },
      {
        label: "Public service",
        value: "Senior government service",
      },
      {
        label: "Field",
        value: "Law & public administration",
      },
    ],
    tags: ["Lawyer", "Statesman", "Public service"],
  },
];

export function getLeadershipProfile(slug: string) {
  return leadershipProfiles.find((person) => person.slug === slug);
}

export function getAlumnus(slug: string) {
  return notableAlumni.find((person) => person.slug === slug);
}
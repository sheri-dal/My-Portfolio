export interface NavLink {
  readonly label: string;
  readonly fragment: string;
}

export const NAV_LINKS: ReadonlyArray<NavLink> = [
  { label: 'Home', fragment: 'home' },
  { label: 'About', fragment: 'about' },
  { label: 'Skills', fragment: 'skills' },
  { label: 'Projects', fragment: 'projects' },
  { label: 'Experience', fragment: 'experience' },
  // { label: 'Blog', fragment: 'blog' },
  { label: 'Contact', fragment: 'contact' },
];

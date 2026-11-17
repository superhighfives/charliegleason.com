/**
 * The site's link styles, shared by `Link.astro` and the React islands.
 */

export const LINK_BASE_CLASSES = `
  font-display bg-gradient-to-r bg-[length:100%_0.1em] bg-bottom bg-no-repeat box-decoration-clone px-1 grayscale
  outline outline-2 outline-offset-2 outline-transparent
  motion-safe:transition-[color,background-color,text-shadow,filter,outline-color] motion-safe:duration-[50ms] motion-safe:ease-out

  bg-neutral-100 from-yellow-500 to-yellow-600 [text-shadow:0_0.125em_0_theme('colors.neutral.100')]
  dark:bg-neutral-900 dark:from-yellow-600 dark:to-yellow-500 dark:[text-shadow:0_0.125em_0_theme('colors.neutral.900')]
`;

export const LINK_STATE_CLASSES = `
  motion-safe:hover:duration-100 motion-safe:focus-visible:duration-100

  hover:grayscale-0 hover:bg-[length:100%_2px] hover:text-yellow-900 hover:bg-yellow-300 hover:[text-shadow:0_0.125em_0_theme('colors.yellow.300')] 
  focus-visible:grayscale-0 focus-visible:bg-[length:100%_2px] focus-visible:text-yellow-900 focus-visible:bg-yellow-300 focus-visible:[text-shadow:0_0.125em_0_theme('colors.yellow.300')] 
  
  dark:hover:text-yellow-400 dark:hover:bg-yellow-900 dark:hover:[text-shadow:0_0.125em_0_theme('colors.yellow.900')]
  dark:focus-visible:text-yellow-400 dark:focus-visible:bg-yellow-900 dark:focus-visible:[text-shadow:0_0.125em_0_theme('colors.yellow.900')]
  
  hover:outline-yellow-300 dark:hover:outline-yellow-800
  hover:focus:outline-yellow-500 dark:hover:focus:outline-yellow-500
  active:outline-yellow-500 dark:active:outline-yellow-500 active:grayscale-0 motion-safe:active:duration-0
  focus-visible:outline-yellow-500 dark:focus-visible:outline-yellow-500
`;

// Mirrors LINK_STATE_CLASSES, keyed off the parent `group` instead of this element.
export const LINK_GROUP_STATE_CLASSES = `
  motion-safe:group-hover:duration-100 motion-safe:group-focus-visible:duration-100

  group-hover:grayscale-0 group-hover:bg-[length:100%_2px] group-hover:text-yellow-900 group-hover:bg-yellow-300 group-hover:[text-shadow:0_0.125em_0_theme('colors.yellow.300')] 
  group-focus-visible:grayscale-0 group-focus-visible:bg-[length:100%_2px] group-focus-visible:text-yellow-900 group-focus-visible:bg-yellow-300 group-focus-visible:[text-shadow:0_0.125em_0_theme('colors.yellow.300')] 
  
  dark:group-hover:text-yellow-400 dark:group-hover:bg-yellow-900 dark:group-hover:[text-shadow:0_0.125em_0_theme('colors.yellow.900')]
  dark:group-focus-visible:text-yellow-400 dark:group-focus-visible:bg-yellow-900 dark:group-focus-visible:[text-shadow:0_0.125em_0_theme('colors.yellow.900')]
  
  group-hover:outline-yellow-300 dark:group-hover:outline-yellow-800
  [.group:hover:focus_&]:outline-yellow-500 dark:[.group:hover:focus_&]:outline-yellow-500
  group-active:outline-yellow-500 dark:group-active:outline-yellow-500 group-active:grayscale-0 motion-safe:group-active:duration-0
  group-focus-visible:outline-yellow-500 dark:group-focus-visible:outline-yellow-500
`;

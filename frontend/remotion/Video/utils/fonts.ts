import {
  loadFont as loadInter,
  fontFamily as interFont
} from "@remotion/google-fonts/Inter";
import {
  loadFont as loadRoboto,
  fontFamily as robotoFont
} from "@remotion/google-fonts/Roboto";
import {
  loadFont as loadMontserrat,
  fontFamily as montserratFont
} from "@remotion/google-fonts/Montserrat";
import {
  loadFont as loadOpenSans,
  fontFamily as openSansFont
} from "@remotion/google-fonts/OpenSans";
import {
  loadFont as loadPoppins,
  fontFamily as poppinsFont
} from "@remotion/google-fonts/Poppins";

// Load all fonts
loadInter();
loadRoboto();
loadMontserrat();
loadOpenSans();
loadPoppins();

export const fonts = {
  'Inter': 'var(--font-inter)',
  'Roboto': 'var(--font-roboto)',
  'Montserrat': 'var(--font-montserrat)',
  'Open Sans': 'var(--font-open-sans)',
  'Poppins': 'var(--font-poppins)',
} as const;

export type FontFamily = keyof typeof fonts;

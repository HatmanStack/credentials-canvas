/**
 * URL mappings for interactive elements
 */

import type { MeshNameToURLMapping } from 'types';

/**
 * Phone URL configuration interface
 */
export interface PhoneURLConfiguration {
  signName: string[];
  url: string;
}

/**
 * URL mapping for interactive mesh elements
 */
export const MESH_NAME_TO_URL_MAPPING: MeshNameToURLMapping = {
  text_name: 'https://www.gemenielabs.com/contact/',
  Sign_About: 'https://www.gemenielabs.com/contact/',
  Sign_Articles: 'https://medium.com/@HatmanStack',
  Sign_Github: 'https://github.com/HatmanStack',
  Sign_HuggingFace: 'https://huggingface.co/Hatman',
  Sign_Privacy: 'https://www.gemenielabs.com/app-privacy-policy/',
  Sign_Old: 'https://www.gemenielabs.com/projects',
  logo_writersalmanac: 'https://d6d8ny9p8jhyg.cloudfront.net/',
  logo_nba: 'https://hatmanstack-streamlit-nba-app-dz3nxx.streamlit.app',
  logo_hf: 'https://hatman-instantstyle-flux-sdxl.hf.space/',
  logo_google_forms:
    'https://docs.google.com/forms/d/e/1FAIpQLSce94QihTjunjBvYzFdalz0mYGhVS6Ngy17uRrXkqLI_Da7nA/viewform',
  logo_float: 'https://float-app.fun/',
  logo_pixel_prompt: 'https://production.d2iujulgl0aoba.amplifyapp.com/',
  logo_nova_canvas: 'https://t7bmxtdc6ojbkd3zgknxe32xdm0oqxkw.lambda-url.us-west-2.on.aws/',
  logo_savor_swipe: 'https://savorswipe.fun/',
  Sign_Portfolio: 'https://www.cg-portfolio.com',
};

/**
 * Interactive phone URL configurations
 */
export const INTERACTIVE_PHONE_URL_CONFIGURATIONS: PhoneURLConfiguration[] = [
  {
    signName: ['Phone_Stocks_5', 'Phone_Stocks_Text'],
    url: 'https://www.gemenielabs.com/#stocks',
  },
  {
    signName: ['Phone_Vocabulary_5', 'Phone_Vocabulary_Text'],
    url: 'https://www.gemenielabs.com/#vocabulary',
  },
  {
    signName: ['Phone_Movies_5', 'Phone_Movies_Text'],
    url: 'https://www.gemenielabs.com/#movies',
  },
  {
    signName: ['Phone_Trachtenberg_5', 'Phone_Trachtenberg_Text'],
    url: 'https://www.gemenielabs.com/#trachtenberg',
  },
  {
    signName: ['Phone_Italian_5', 'Phone_Italian_Text'],
    url: 'https://www.gemenielabs.com/#italian',
  },
  {
    signName: ['Phone_Looper_5', 'Phone_Looper_Text'],
    url: 'https://www.gemenielabs.com/#looper',
  },
  { signName: ['Cube009_2'], url: '' },
  {
    signName: ['Music_Control_Box', 'Light_Control_Box'],
    url: 'https://www.google.com',
  },
];

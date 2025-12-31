import type { MeshNameToURLMapping } from '@/types';

export interface PhoneURLConfiguration {
  signName: string[];
  url: string;
}

export const MESH_NAME_TO_URL_MAPPING: MeshNameToURLMapping = {
  text_name: 'https://portfolio.hatstack.fun',
  Sign_About: 'https://gemenielabs.hatstack.fun',
  Sign_Articles: 'https://medium.com/@HatmanStack',
  Sign_Github: 'https://github.com/HatmanStack',
  Sign_HuggingFace: 'https://huggingface.co/Hatman',
  Sign_Privacy: 'https://privacy.hatstack.fun',
  Sign_Old: 'https://gemenielabs.hatstack.fun',
  logo_writersalmanac: 'https://writer.hatstack.fun',
  logo_nba: 'https://hatmanstack-streamlit-nba-app-dz3nxx.streamlit.app',
  logo_hf: 'https://hatman-instantstyle-flux-sdxl.hf.space/',
  logo_google_forms:
    'https://docs.google.com/forms/d/e/1FAIpQLSce94QihTjunjBvYzFdalz0mYGhVS6Ngy17uRrXkqLI_Da7nA/viewform',
  logo_float: 'https://float.hatstack.fun',
  logo_pixel_prompt: 'https://pixel-prompt.hatstack.fun',
  logo_nova_canvas: 'https://t7bmxtdc6ojbkd3zgknxe32xdm0oqxkw.lambda-url.us-west-2.on.aws/',
  logo_savor_swipe: 'https://savorswipe.hatstack.fun/',
  Sign_Portfolio: 'https://portfolio.hatstack.fun',
};

export const INTERACTIVE_PHONE_URL_CONFIGURATIONS: PhoneURLConfiguration[] = [
  {
    signName: ['Phone_Stocks_5', 'Phone_Stocks_Text'],
    url: 'https://stocks.hatstack.fun',
  },
  {
    signName: ['Phone_Vocabulary_5', 'Phone_Vocabulary_Text'],
    url: 'https://vocabulary.hatstack.fun',
  },
  {
    signName: ['Phone_Movies_5', 'Phone_Movies_Text'],
    url: 'https://movies.hatstack.fun',
  },
  {
    signName: ['Phone_Trachtenberg_5', 'Phone_Trachtenberg_Text'],
    url: 'https://trachtenberg.hatstack.fun',
  },
  {
    signName: ['Phone_Italian_5', 'Phone_Italian_Text'],
    url: 'https://www.gemenielabs.com/#italian',
  },
  {
    signName: ['Phone_Looper_5', 'Phone_Looper_Text'],
    url: 'https://looper.hatstack.fun',
  },
  { signName: ['Cube009_2'], url: '' },
  {
    signName: ['Music_Control_Box', 'Light_Control_Box'],
    url: 'https://www.google.com',
  },
];

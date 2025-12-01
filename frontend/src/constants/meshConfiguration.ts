import VocabularyVideo from '@/assets/Vocabulary.mp4';
import MoviesVideo from '@/assets/Movies.mp4';
import LooperVideo from '@/assets/Looper.mp4';
import TrachtenbergVideo from '@/assets/Trachtenberg.mp4';
import ItalianVideo from '@/assets/Italian.mp4';
import StocksVideo from '@/assets/Stocks.mp4';

export interface PhoneVideoConfiguration {
  name: string;
  video: string;
  textNode: string;
}

export const INTERACTIVE_LIGHT_MESH_NAMES: string[] = [
  'small_middle_left',
  'small_middle_right',
  'lamppost',
  'lamp_back',
  'lamp_front',
  'small_right',
  'small_left',
  'Button_Light_1',
  'Button_Light_2',
  'Button_Light_3',
  'Button_Light_4',
  'Button_Light_5',
  'Button_Light_6',
  'Button_Light_7',
  'Button_Music_Back',
  'Button_Music_Forward',
  'Button_Music_Pause',
];

export const PHONE_VIDEO_CONFIGURATIONS: PhoneVideoConfiguration[] = [
  { name: 'Phone_Vocabulary_5', video: VocabularyVideo, textNode: 'Phone_Vocabulary_Text' },
  { name: 'Phone_Movies_5', video: MoviesVideo, textNode: 'Phone_Movies_Text' },
  { name: 'Phone_Looper_5', video: LooperVideo, textNode: 'Phone_Looper_Text' },
  { name: 'Phone_Trachtenberg_5', video: TrachtenbergVideo, textNode: 'Phone_Trachtenberg_Text' },
  { name: 'Phone_Italian_5', video: ItalianVideo, textNode: 'Phone_Italian_Text' },
  { name: 'Phone_Stocks_5', video: StocksVideo, textNode: 'Phone_Stocks_Text' },
];

export const VIDEO_TEXTURE_MESH_NAMES: string[] = PHONE_VIDEO_CONFIGURATIONS.map(config => config.name);

export const VIDEO_TEXTURE_FILE_PATHS: string[] = PHONE_VIDEO_CONFIGURATIONS.map(config => config.video);

export const CLOSE_UP_CLICK_THRESHOLD_COUNT: number = 2;

export const GLTF_MODEL_FILE_PATH: string = '/compressed_model.glb';

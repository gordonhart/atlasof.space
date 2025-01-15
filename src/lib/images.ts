import { map } from 'ramda';
import * as Bodies from './bodies.ts';

const CDN_URL = 'https://atlasofspace.b-cdn.net';
const IMAGE_FILENAMES = {
  arrokothAnimationSrc: 'arrokoth-rotation.gif',
  arrokothSrc: 'arrokoth-thumb.jpg',
  callistoSrc: 'callisto-thumb.jpg',
  europaSrc: 'europa-thumb.jpg',
  farfaroutSrc: 'farfarout-thumb.gif',
  firmamentTextureSrc: 'firmament.jpg',
  ganymedeSrc: 'ganymede-thumb.jpg',
  ioSrc: 'io-thumb.jpg',
  jupiterTextureSrc: 'jupiter-texture.jpg',
  jupiterSrc: 'jupiter-thumb.jpg',
  makemakeSrc: 'makemake-thumb.jpg',
  mimasSrc: 'mimas-thumb.jpg',
  neptuneTextureSrc: 'neptune-texture.jpg',
  neptuneSrc: 'neptune-thumb.jpg',
  plutoSrc: 'pluto-thumb.jpg',
  saturnRingsTextureSrc: 'saturn-rings-texture.png',
  saturnTextureSrc: 'saturn-texture.jpg',
  saturnSrc: 'saturn-thumb.jpg',
  uranusTextureSrc: 'uranus-texture.jpg',
  uranusSrc: 'uranus-thumb.jpg',
};
const IMAGE_URLS = map(filename => `${CDN_URL}/${filename}`, IMAGE_FILENAMES);

export const Thumbnails: Record<string, string> = {
  [Bodies.SOL.name]: IMAGE_URLS.solSrc,
  [Bodies.MERCURY.name]: IMAGE_URLS.mercurySrc,
  [Bodies.VENUS.name]: IMAGE_URLS.venusSrc,
  [Bodies.EARTH.name]: IMAGE_URLS.earthSrc,
  [Bodies.LUNA.name]: IMAGE_URLS.lunaSrc,
  [Bodies.MARS.name]: IMAGE_URLS.marsSrc,
  [Bodies.PHOBOS.name]: IMAGE_URLS.phobosSrc,
  [Bodies.DEIMOS.name]: IMAGE_URLS.deimosSrc,
  [Bodies.JUPITER.name]: IMAGE_URLS.jupiterSrc,
  [Bodies.IO.name]: IMAGE_URLS.ioSrc,
  [Bodies.EUROPA.name]: IMAGE_URLS.europaSrc,
  [Bodies.GANYMEDE.name]: IMAGE_URLS.ganymedeSrc,
  [Bodies.CALLISTO.name]: IMAGE_URLS.callistoSrc,
  [Bodies.SATURN.name]: IMAGE_URLS.saturnSrc,
  [Bodies.MIMAS.name]: IMAGE_URLS.mimasSrc,
  [Bodies.URANUS.name]: IMAGE_URLS.uranusSrc,
  [Bodies.NEPTUNE.name]: IMAGE_URLS.neptuneSrc,
  [Bodies.PLUTO.name]: IMAGE_URLS.plutoSrc,
  [Bodies.CERES.name]: IMAGE_URLS.ceresSrc,
  [Bodies.PALLAS.name]: IMAGE_URLS.pallasSrc,
  [Bodies.VESTA.name]: IMAGE_URLS.vestaSrc,
  [Bodies.HYGIEA.name]: IMAGE_URLS.hygieaSrc,
  [Bodies.JUNO.name]: IMAGE_URLS.junoSrc,
  [Bodies.CG67P.name]: IMAGE_URLS.cg57pSrc,
  [Bodies.RYUGU.name]: IMAGE_URLS.ryuguSrc,
  [Bodies.BENNU.name]: IMAGE_URLS.bennuSrc,
  [Bodies.LUTETIA.name]: IMAGE_URLS.lutetiaSrc,
  [Bodies.NEREUS.name]: IMAGE_URLS.nereusSrc,
  [Bodies.MAKEMAKE.name]: IMAGE_URLS.makemakeSrc,
  [Bodies.EROS.name]: IMAGE_URLS.erosSrc,
  [Bodies.MATHILDE.name]: IMAGE_URLS.mathildeSrc,
  [Bodies.ARROKOTH.name]: IMAGE_URLS.arrokothSrc,
  [Bodies.FARFAROUT.name]: IMAGE_URLS.farfaroutSrc,
} as const;

export const GalleryImages: Record<string, Array<string>> = {
  [Bodies.ARROKOTH.name]: [IMAGE_URLS.arrokothAnimationSrc],
} as const;

export const Textures: Record<string, string> = {
  FIRMAMENT: IMAGE_URLS.firmamentTextureSrc,
  [Bodies.SOL.name]: IMAGE_URLS.solTextureSrc,
  [Bodies.MERCURY.name]: IMAGE_URLS.mercuryTextureSrc,
  [Bodies.VENUS.name]: IMAGE_URLS.venusTextureSrc,
  [Bodies.EARTH.name]: IMAGE_URLS.earthTextureSrc,
  [Bodies.LUNA.name]: IMAGE_URLS.lunaTextureSrc,
  [Bodies.MARS.name]: IMAGE_URLS.marsTextureSrc,
  [Bodies.JUPITER.name]: IMAGE_URLS.jupiterTextureSrc,
  [Bodies.SATURN.name]: IMAGE_URLS.saturnTextureSrc,
  [Bodies.URANUS.name]: IMAGE_URLS.uranusTextureSrc,
  [Bodies.NEPTUNE.name]: IMAGE_URLS.neptuneTextureSrc,
  [Bodies.CERES.name]: IMAGE_URLS.ceresTextureSrc,
  [Bodies.SATURN.rings![0].name]: IMAGE_URLS.saturnRingsTextureSrc,
};

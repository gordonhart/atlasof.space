import solSrc from '../../assets/sol-thumb.jpg';
import mercurySrc from '../../assets/mercury-thumb.jpg';
import venusSrc from '../../assets/venus-thumb.jpg';
import earthSrc from '../../assets/earth-thumb.jpg';
import lunaSrc from '../../assets/luna-thumb.jpg';
import marsSrc from '../../assets/mars-thumb.jpg';
import phobosSrc from '../../assets/phobos-thumb.jpg';
import deimosSrc from '../../assets/deimos-thumb.jpg';
import jupiterSrc from '../../assets/jupiter-thumb.jpg';
import ioSrc from '../../assets/io-thumb.jpg';
import europaSrc from '../../assets/europa-thumb.jpg';
import ganymedeSrc from '../../assets/ganymede-thumb.jpg';
import callistoSrc from '../../assets/callisto-thumb.jpg';
import saturnSrc from '../../assets/saturn-thumb.jpg';
import mimasSrc from '../../assets/mimas-thumb.jpg';
import uranusSrc from '../../assets/uranus-thumb.jpg';
import neptuneSrc from '../../assets/neptune-thumb.jpg';
import plutoSrc from '../../assets/pluto-thumb.jpg';
import ceresSrc from '../../assets/ceres-thumb.jpg';
import pallasSrc from '../../assets/pallas-thumb.jpg';
import vestaSrc from '../../assets/vesta-thumb.jpg';
import hygieaSrc from '../../assets/hygiea-thumb.jpg';
import junoSrc from '../../assets/juno-thumb.jpg';
import cg57pSrc from '../../assets/cg67p-thumb.jpg';
import ryuguSrc from '../../assets/ryugu-thumb.jpg';
import bennuSrc from '../../assets/bennu-thumb.png';
import lutetiaSrc from '../../assets/lutetia-thumb.jpg';
import nereusSrc from '../../assets/nereus-thumb.gif';
import makemakeSrc from '../../assets/makemake-thumb.jpg';
import erosSrc from '../../assets/eros-thumb.jpg';
import mathildeSrc from '../../assets/mathilde-thumb.jpg';
import arrokothSrc from '../../assets/arrokoth-thumb.jpg';
import cg67pAnimationSrc from '../../assets/cg67p-animation.gif';
import cg67pThumb2Src from '../../assets/cg67p-thumb2.jpg';
import cg67pThumb3Src from '../../assets/cg67p-thumb3.jpg';
import bennuLandingSrc from '../../assets/bennu-landing.jpg';
import bennuRotationSrc from '../../assets/bennu-rotation.gif';
import bennuSurfaceSrc from '../../assets/bennu-surface.jpg';
import venusVeneraSrc from '../../assets/venus-venera.jpg';
import venusVenera2Src from '../../assets/venus-venera2.jpg';
import venusMagellanSrc from '../../assets/venus-magellan.jpg';
import arrokothAnimationSrc from '../../assets/arrokoth-rotation.gif';
import firmamentTextureSrc from '../../assets/firmament.jpg';
import solTextureSrc from '../../assets/sol-texture.jpg';
import mercuryTextureSrc from '../../assets/mercury-texture.jpg';
import venusTextureSrc from '../../assets/venus-texture.jpg';
import earthTextureSrc from '../../assets/earth-texture.jpg';
import lunaTextureSrc from '../../assets/luna-texture.jpg';
import marsTextureSrc from '../../assets/mars-texture.jpg';
import jupiterTextureSrc from '../../assets/jupiter-texture.jpg';
import saturnTextureSrc from '../../assets/saturn-texture.jpg';
import uranusTextureSrc from '../../assets/uranus-texture.jpg';
import neptuneTextureSrc from '../../assets/neptune-texture.jpg';
import ceresTextureSrc from '../../assets/ceres-texture.jpg';
import bennuShapeSrc from '../../assets/bennu.ply';
import ceresShapeSrc from '../../assets/ceres.ply';
import cg67pShapeSrc from '../../assets/cg67p.ply';
import * as Bodies from './bodies.ts';

export const Thumbnails: Record<string, string> = {
  [Bodies.SOL.name]: solSrc as string,
  [Bodies.MERCURY.name]: mercurySrc as string,
  [Bodies.VENUS.name]: venusSrc as string,
  [Bodies.EARTH.name]: earthSrc as string,
  [Bodies.LUNA.name]: lunaSrc as string,
  [Bodies.MARS.name]: marsSrc as string,
  [Bodies.PHOBOS.name]: phobosSrc as string,
  [Bodies.DEIMOS.name]: deimosSrc as string,
  [Bodies.JUPITER.name]: jupiterSrc as string,
  [Bodies.IO.name]: ioSrc as string,
  [Bodies.EUROPA.name]: europaSrc as string,
  [Bodies.GANYMEDE.name]: ganymedeSrc as string,
  [Bodies.CALLISTO.name]: callistoSrc as string,
  [Bodies.SATURN.name]: saturnSrc as string,
  [Bodies.MIMAS.name]: mimasSrc as string,
  [Bodies.URANUS.name]: uranusSrc as string,
  [Bodies.NEPTUNE.name]: neptuneSrc as string,
  [Bodies.PLUTO.name]: plutoSrc as string,
  [Bodies.CERES.name]: ceresSrc as string,
  [Bodies.PALLAS.name]: pallasSrc as string,
  [Bodies.VESTA.name]: vestaSrc as string,
  [Bodies.HYGIEA.name]: hygieaSrc as string,
  [Bodies.JUNO.name]: junoSrc as string,
  [Bodies.CG67P.name]: cg57pSrc as string,
  [Bodies.RYUGU.name]: ryuguSrc as string,
  [Bodies.BENNU.name]: bennuSrc as string,
  [Bodies.LUTETIA.name]: lutetiaSrc as string,
  [Bodies.NEREUS.name]: nereusSrc as string,
  [Bodies.MAKEMAKE.name]: makemakeSrc as string,
  [Bodies.EROS.name]: erosSrc as string,
  [Bodies.MATHILDE.name]: mathildeSrc as string,
  [Bodies.ARROKOTH.name]: arrokothSrc as string,
} as const;

export const GalleryImages: Record<string, Array<string>> = {
  [Bodies.CG67P.name]: [cg67pAnimationSrc, cg67pThumb2Src, cg67pThumb3Src] as Array<string>,
  [Bodies.VENUS.name]: [venusVeneraSrc, venusVenera2Src, venusMagellanSrc] as Array<string>,
  [Bodies.ARROKOTH.name]: [arrokothAnimationSrc] as Array<string>,
  [Bodies.BENNU.name]: [bennuLandingSrc, bennuRotationSrc, bennuSurfaceSrc] as Array<string>,
} as const;

export const Textures: Record<string, string> = {
  FIRMAMENT: firmamentTextureSrc as string,
  [Bodies.SOL.name]: solTextureSrc as string,
  [Bodies.MERCURY.name]: mercuryTextureSrc as string,
  [Bodies.VENUS.name]: venusTextureSrc as string,
  [Bodies.EARTH.name]: earthTextureSrc as string,
  [Bodies.LUNA.name]: lunaTextureSrc as string,
  [Bodies.MARS.name]: marsTextureSrc as string,
  [Bodies.JUPITER.name]: jupiterTextureSrc as string,
  [Bodies.SATURN.name]: saturnTextureSrc as string,
  [Bodies.URANUS.name]: uranusTextureSrc as string,
  [Bodies.NEPTUNE.name]: neptuneTextureSrc as string,
  [Bodies.CERES.name]: ceresTextureSrc as string,
};

export const Shapes: Record<string, string> = {
  [Bodies.BENNU.name]: bennuShapeSrc as string,
  [Bodies.CERES.name]: ceresShapeSrc as string,
  [Bodies.CG67P.name]: cg67pShapeSrc as string,
};

import sunSrc from '../../assets/sun-thumb.jpg';
import mercurySrc from '../../assets/mercury-thumb.jpg';
import venusSrc from '../../assets/venus-thumb.jpg';
import earthSrc from '../../assets/earth-thumb.jpg';
import lunaSrc from '../../assets/luna-thumb.jpg';
import marsSrc from '../../assets/mars-thumb.jpg';
import jupiterSrc from '../../assets/jupiter-thumb.jpg';
import saturnSrc from '../../assets/saturn-thumb.jpg';
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
import lutetiaSrc from '../../assets/lutetia-thumb.jpg';
import makemakeSrc from '../../assets/makemake-thumb.jpg';
import erosSrc from '../../assets/eros-thumb.jpg';
import mathildeSrc from '../../assets/mathilde-thumb.jpg';
import arrokothSrc from '../../assets/arrokoth-thumb.jpg';
import cg67pAnimationSrc from '../../assets/cg67p-animation.gif';
import cg67pThumb2Src from '../../assets/cg67p-thumb2.jpg';
import cg67pThumb3Src from '../../assets/cg67p-thumb3.jpg';
import venusVeneraSrc from '../../assets/venus-venera.jpg';
import venusVenera2Src from '../../assets/venus-venera2.jpg';
import venusMagellanSrc from '../../assets/venus-magellan.jpg';
import * as Objects from './constants.ts';

export const Thumbnails: Record<string, string> = {
  [Objects.SOL.name]: sunSrc as string,
  [Objects.MERCURY.name]: mercurySrc as string,
  [Objects.VENUS.name]: venusSrc as string,
  [Objects.EARTH.name]: earthSrc as string,
  [Objects.LUNA.name]: lunaSrc as string,
  [Objects.MARS.name]: marsSrc as string,
  [Objects.JUPITER.name]: jupiterSrc as string,
  [Objects.SATURN.name]: saturnSrc as string,
  [Objects.URANUS.name]: uranusSrc as string,
  [Objects.NEPTUNE.name]: neptuneSrc as string,
  [Objects.PLUTO.name]: plutoSrc as string,
  [Objects.CERES.name]: ceresSrc as string,
  [Objects.PALLAS.name]: pallasSrc as string,
  [Objects.VESTA.name]: vestaSrc as string,
  [Objects.HYGIEA.name]: hygieaSrc as string,
  [Objects.JUNO.name]: junoSrc as string,
  [Objects.CG67P.name]: cg57pSrc as string,
  [Objects.RYUGU.name]: ryuguSrc as string,
  [Objects.LUTETIA.name]: lutetiaSrc as string,
  [Objects.MAKEMAKE.name]: makemakeSrc as string,
  [Objects.EROS.name]: erosSrc as string,
  [Objects.MATHILDE.name]: mathildeSrc as string,
  [Objects.ARROKOTH.name]: arrokothSrc as string,
} as const;

export const GalleryImages: Record<string, Array<string>> = {
  [Objects.CG67P.name]: [cg67pAnimationSrc, cg67pThumb2Src, cg67pThumb3Src] as Array<string>,
  [Objects.VENUS.name]: [venusVeneraSrc, venusVenera2Src, venusMagellanSrc] as Array<string>,
} as const;

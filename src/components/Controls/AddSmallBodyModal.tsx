import {
  ActionIcon,
  Box,
  Checkbox,
  Divider,
  Group,
  Modal,
  Paper,
  RenderTreeNodePayload,
  Text,
  Title,
  Tree,
  TreeNodeData,
  useTree,
} from '@mantine/core';
import { IconChevronDown, IconX } from '@tabler/icons-react';
import { UseQueryResult } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useSmallBodies } from '../../hooks/queries/useSmallBodies.ts';
import { ASTEROIDS } from '../../lib/bodies.ts';
import { asCelestialBodyId, CelestialBody, CelestialBodyType } from '../../lib/types.ts';
import { nameToId, notNullish } from '../../lib/utils.ts';

// TODO: load from data; full list is ~1.5M, should at least include a few thousand
// prettier-ignore
const bodies = [
  '1 Ceres', '2 Pallas', '3 Juno', '4 Vesta', '5 Astraea', '6 Hebe', '7 Iris', '8 Flora', '9 Metis', '10 Hygiea',
  '11 Parthenope', '12 Victoria', '13 Egeria', '14 Irene', '15 Eunomia', '16 Psyche', '17 Thetis', '18 Melpomene',
  '19 Fortuna', '20 Massalia', '21 Lutetia', '22 Kalliope', '23 Thalia', '24 Themis', '25 Phocaea', '26 Proserpina',
  '27 Euterpe', '28 Bellona', '29 Amphitrite', '30 Urania', '31 Euphrosyne', '32 Pomona', '33 Polyhymnia', '34 Circe',
  '35 Leukothea', '36 Atalante', '37 Fides', '38 Leda', '39 Laetitia', '40 Harmonia', '41 Daphne', '42 Isis',
  '43 Ariadne', '44 Nysa', '45 Eugenia', '46 Hestia', '47 Aglaja', '48 Doris', '49 Pales', '50 Virginia', '51 Nemausa',
  '52 Europa', '53 Kalypso', '54 Alexandra', '55 Pandora', '56 Melete', '57 Mnemosyne', '58 Concordia', '59 Elpis',
  '60 Echo', '61 Danae', '62 Erato', '63 Ausonia', '64 Angelina', '65 Cybele', '66 Maja', '67 Asia',
  '68 Leto', '69 Hesperia', '70 Panopaea', '71 Niobe', '72 Feronia', '73 Klytia', '74 Galatea', '75 Eurydike',
  '76 Freia', '77 Frigga', '78 Diana', '79 Eurynome', '80 Sappho', '81 Terpsichore', '82 Alkmene', '83 Beatrix',
  '84 Klio', '85 Io', '86 Semele', '87 Sylvia', '88 Thisbe', '89 Julia', '90 Antiope', '91 Aegina',
  '92 Undina', '93 Minerva', '94 Aurora', '95 Arethusa', '96 Aegle', '97 Klotho', '98 Ianthe', '99 Dike',
  '100 Hekate', '101 Helena', '102 Miriam', '103 Hera', '104 Klymene', '105 Artemis', '106 Dione', '107 Camilla',
  '108 Hecuba', '109 Felicitas', '110 Lydia', '111 Ate', '112 Iphigenia', '113 Amalthea', '114 Kassandra', '115 Thyra',
  '116 Sirona', '117 Lomia', '118 Peitho', '119 Althaea', '120 Lachesis', '121 Hermione', '122 Gerda', '123 Brunhild',
  '124 Alkeste', '125 Liberatrix', '126 Velleda', '127 Johanna', '128 Nemesis', '129 Antigone', '130 Elektra',
  '131 Vala', '132 Aethra', '133 Cyrene', '134 Sophrosyne', '135 Hertha', '136 Austria', '137 Meliboea', '138 Tolosa',
  '139 Juewa', '140 Siwa', '141 Lumen', '142 Polana', '143 Adria', '144 Vibilia', '145 Adeona', '146 Lucina',
  '147 Protogeneia', '148 Gallia', '149 Medusa', '150 Nuwa', '151 Abundantia', '152 Atala', '153 Hilda', '154 Bertha',
  '155 Scylla', '156 Xanthippe', '157 Dejanira', '158 Koronis', '159 Aemilia', '160 Una', '161 Athor', '162 Laurentia',
  '163 Erigone', '164 Eva', '165 Loreley', '166 Rhodope', '167 Urda', '168 Sibylla', '169 Zelia', '170 Maria',
  '171 Ophelia', '172 Baucis', '173 Ino', '174 Phaedra', '175 Andromache', '176 Iduna', '177 Irma', '178 Belisana',
  '179 Klytaemnestra', '180 Garumna', '181 Eucharis', '182 Elsa', '183 Istria', '184 Dejopeja', '185 Eunike',
  '186 Celuta', '187 Lamberta', '188 Menippe', '189 Phthia', '190 Ismene', '191 Kolga', '192 Nausikaa', '193 Ambrosia',
  '194 Prokne', '195 Eurykleia', '196 Philomela', '197 Arete', '198 Ampella', '199 Byblis', '200 Dynamene',
  '201 Penelope', '202 Chryseis', '203 Pompeja', '204 Kallisto', '205 Martha', '206 Hersilia', '207 Hedda',
  '208 Lacrimosa', '209 Dido', '210 Isabella', '211 Isolda', '212 Medea', '213 Lilaea', '214 Aschera', '215 Oenone',
  '216 Kleopatra', '217 Eudora', '218 Bianca', '219 Thusnelda', '220 Stephania', '221 Eos', '222 Lucia', '223 Rosa',
  '224 Oceana', '225 Henrietta', '226 Weringia', '227 Philosophia', '228 Agathe', '229 Adelinda', '230 Athamantis',
  '231 Vindobona', '232 Russia', '233 Asterope', '234 Barbara', '235 Carolina', '236 Honoria', '237 Coelestina',
  '238 Hypatia', '239 Adrastea', '240 Vanadis', '241 Germania', '242 Kriemhild', '243 Ida', '244 Sita', '245 Vera',
  '246 Asporina', '247 Eukrate', '248 Lameia', '249 Ilse', '250 Bettina', '251 Sophia', '252 Clementina',
  '253 Mathilde', '254 Augusta', '255 Oppavia', '256 Walpurga', '257 Silesia', '258 Tyche', '259 Aletheia',
  '260 Huberta', '261 Prymno', '262 Valda', '263 Dresda', '264 Libussa', '265 Anna', '266 Aline', '267 Tirza',
  '268 Adorea', '269 Justitia', '270 Anahita', '271 Penthesilea', '272 Antonia', '273 Atropos', '274 Philagoria',
  '275 Sapientia', '276 Adelheid', '277 Elvira', '278 Paulina', '279 Thule', '280 Philia', '281 Lucretia',
  '282 Clorinde', '283 Emma', '284 Amalia', '285 Regina', '286 Iclea', '287 Nephthys', '288 Glauke', '289 Nenetta',
  '290 Bruna', '291 Alice', '292 Ludovica', '293 Brasilia', '294 Felicia', '295 Theresia', '296 Phaetusa',
  '297 Caecilia', '298 Baptistina', '299 Thora', '300 Geraldina', '301 Bavaria', '302 Clarissa', '303 Josephina',
  '304 Olga', '305 Gordonia', '306 Unitas', '307 Nike', '308 Polyxo', '309 Fraternitas', '310 Margarita', '311 Claudia',
  '312 Pierretta', '313 Chaldaea', '314 Rosalia', '315 Constantia', '316 Goberta', '317 Roxane', '318 Magdalena',
  '319 Leona', '320 Katharina', '321 Florentina', '322 Phaeo', '323 Brucia', '324 Bamberga', '325 Heidelberga',
  '326 Tamara', '327 Columbia', '328 Gudrun', '329 Svea', '330 Adalberta', '331 Etheridgea', '332 Siri', '333 Badenia',
  '334 Chicago', '335 Roberta', '336 Lacadiera', '337 Devosa', '338 Budrosa', '339 Dorothea', '340 Eduarda',
  '341 California', '342 Endymion', '343 Ostara', '344 Desiderata', '345 Tercidina', '346 Hermentaria', '347 Pariana',
  '348 May', '349 Dembowska', '350 Ornamenta', '351 Yrsa', '352 Gisela', '353 Ruperto-Carola', '354 Eleonora',
  '355 Gabriella', '356 Liguria', '357 Ninina', '358 Apollonia', '359 Georgia', '360 Carlova', '361 Bononia',
  '362 Havnia', '363 Padua', '364 Isara', '365 Corduba', '366 Vincentina', '367 Amicitia', '368 Haidea', '369 Aeria',
  '370 Modestia', '371 Bohemia', '372 Palma', '373 Melusina', '374 Burgundia', '375 Ursula', '376 Geometria',
  '377 Campania', '378 Holmia', '379 Huenna', '380 Fiducia', '381 Myrrha', '382 Dodona', '383 Janina', '384 Burdigala',
  '385 Ilmatar', '386 Siegena', '387 Aquitania', '388 Charybdis', '389 Industria', '390 Alma', '391 Ingeborg',
  '392 Wilhelmina', '393 Lampetia', '394 Arduina', '395 Delia', '396 Aeolia', '397 Vienna', '398 Admete',
  '399 Persephone', '400 Ducrosa', '401 Ottilia', '402 Chloe', '403 Cyane', '404 Arsinoe', '405 Thia', '406 Erna',
  '407 Arachne', '408 Fama', '409 Aspasia', '410 Chloris', '411 Xanthe', '412 Elisabetha', '413 Edburga', '414 Liriope',
  '415 Palatia', '416 Vaticana', '417 Suevia', '418 Alemannia', '419 Aurelia', '420 Bertholda', '421 Zahringia',
  '422 Berolina', '423 Diotima', '424 Gratia', '425 Cornelia', '426 Hippo', '427 Galene', '428 Monachia', '429 Lotis',
  '430 Hybris', '431 Nephele', '432 Pythia', '433 Eros', '434 Hungaria', '435 Ella', '436 Patricia', '437 Rhodia',
  '438 Zeuxo', '439 Ohio', '440 Theodora', '441 Bathilde', '442 Eichsfeldia', '443 Photographica', '444 Gyptis',
  '445 Edna', '446 Aeternitas', '447 Valentine', '448 Natalie', '449 Hamburga', '450 Brigitta', '451 Patientia',
  '452 Hamiltonia', '453 Tea', '454 Mathesis', '455 Bruchsalia', '456 Abnoba', '457 Alleghenia', '458 Hercynia',
  '459 Signe', '460 Scania', '461 Saskia', '462 Eriphyla', '463 Lola', '464 Megaira', '465 Alekto', '466 Tisiphone',
  '467 Laura', '468 Lina', '469 Argentina', '470 Kilia', '471 Papagena', '472 Roma', '473 Nolli', '474 Prudentia',
  '475 Ocllo', '476 Hedwig', '477 Italia', '478 Tergeste', '479 Caprera', '480 Hansa', '481 Emita', '482 Petrina',
  '483 Seppina', '484 Pittsburghia', '485 Genua', '486 Cremona', '487 Venetia', '488 Kreusa', '489 Comacina',
  '490 Veritas', '491 Carina', '492 Gismonda', '493 Griseldis', '494 Virtus', '495 Eulalia', '496 Gryphia', '497 Iva',
  '498 Tokio', '499 Venusia', '500 Selinur',
];

const presetAsteroidIdByName = Object.fromEntries(ASTEROIDS.map(({ name, id }) => [name, id]));
const treeData = bodies.reduce<Array<TreeNodeData>>((acc, name, i) => {
  const label = `${i + 1} - ${i + 10}`;
  const id = presetAsteroidIdByName[name] ?? asCelestialBodyId(nameToId(name));
  const nodeData = { label: name, value: `${label}/${name}`, nodeProps: { id } };
  if (i % 10 === 0) {
    acc.push({ label, value: label, children: [nodeData] });
  } else {
    acc[acc.length - 1]?.children?.push(nodeData);
  }
  return acc;
}, []);

type Props = {
  isOpen: boolean;
  onClose: () => void;
  bodies: Array<CelestialBody>;
  addBody: (body: CelestialBody) => void;
  removeBody: (id: string) => void;
};
export function AddSmallBodyModal({ bodies, isOpen, onClose, addBody, removeBody }: Props) {
  const initialCheckedState = useMemo(() => {
    const names = bodies.filter(({ type }) => isSmallBody(type)).map(({ name }) => name);
    const treeDataFlat = treeData.flatMap(({ children }) => children ?? []);
    return treeDataFlat.filter(({ value }) => names.some(name => value.includes(name))).map(({ value }) => value);
  }, [JSON.stringify(bodies)]);

  const tree = useTree({ initialCheckedState });

  // filter out bodies that are already in the state to avoid re-fetching hardcoded bodies from SBDB (e.g. Ceres)
  const existingBodyNames = new Set(bodies.map(({ name }) => name));
  const selectedBodies = tree.checkedState
    .map(getBodyNameFromNodeValue)
    .filter(value => value != null && !existingBodyNames.has(value))
    .filter(notNullish);
  const smallBodyQueries: Array<UseQueryResult<CelestialBody | null>> = useSmallBodies(selectedBodies);
  const smallBodies: Array<CelestialBody> = smallBodyQueries.map(({ data }) => data).filter(notNullish);

  useEffect(() => {
    smallBodies.forEach(body => {
      addBody(body);
    });
  }, [JSON.stringify(smallBodies)]);

  function renderTreeNode({ node, expanded, hasChildren, elementProps, tree }: RenderTreeNodePayload) {
    const checked = tree.isNodeChecked(node.value);
    const indeterminate = tree.isNodeIndeterminate(node.value);

    function toggle() {
      if (!checked) {
        tree.checkNode(node.value);
      } else {
        const id = node.nodeProps?.id;
        if (id != null) removeBody(id);
        node.children?.forEach(child => {
          const childId = child.nodeProps?.id;
          if (childId != null) removeBody(childId);
        });
        tree.uncheckNode(node.value);
      }
    }

    function expand() {
      tree.toggleExpanded(node.value);
    }

    return (
      <Group gap="xs" py={2} {...elementProps}>
        <Checkbox.Indicator checked={checked} indeterminate={indeterminate} size="xs" onClick={toggle} />

        <Group gap={4} onClick={hasChildren ? expand : toggle}>
          {hasChildren && (
            <IconChevronDown size={14} style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          )}

          <Text size="xs">{node.label}</Text>
        </Group>
      </Group>
    );
  }

  // TODO: add search/filter box
  // TODO: not convinced that a tree is the right approach here. Ideally this is an ~infinite scrolling omnibox,
  //  dynamically loading the next N names from a function (where they are hardcoded)
  return (
    <Modal
      size="md"
      centered
      opened={isOpen}
      onClose={onClose}
      withCloseButton={false}
      styles={{ body: { padding: 0 } }}
    >
      <Paper bg="black" withBorder style={{ overflow: 'hidden' }}>
        <Group p="md" gap="xs" justify="space-between" wrap="nowrap">
          <Title order={5}>Add Asteroids from JPL Small-Body Database</Title>
          <ActionIcon onClick={onClose}>
            <IconX color="var(--mantine-color-gray-light-color)" size={20} />
          </ActionIcon>
        </Group>
        <Divider />
        <Box p="md" mah="calc(100dvh - 180px)" style={{ overflow: 'auto' }}>
          <Tree tree={tree} data={treeData} levelOffset={23} expandOnClick={false} renderNode={renderTreeNode} />
        </Box>
      </Paper>
    </Modal>
  );
}

const SMALL_BODY_TYPES = new Set([
  CelestialBodyType.ASTEROID,
  CelestialBodyType.COMET,
  CelestialBodyType.DWARF_PLANET,
  CelestialBodyType.TRANS_NEPTUNIAN_OBJECT,
]);
function isSmallBody(type: CelestialBodyType) {
  return SMALL_BODY_TYPES.has(type);
}

function getBodyNameFromNodeValue(value: string): string | undefined {
  return value.split('/')[1];
}

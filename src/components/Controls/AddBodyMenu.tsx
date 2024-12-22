import { useEffect } from 'react';
import { useSmallBodies } from '../../hooks/useSmallBodies.ts';
import { getInitialState } from '../../lib/physics.ts';
import {
  ActionIcon,
  Checkbox,
  Group,
  Popover,
  RenderTreeNodePayload,
  Text,
  Tree,
  TreeNodeData,
  useTree,
} from '@mantine/core';
import { IconChevronDown, IconSpherePlus } from '@tabler/icons-react';
import { AppStateControlProps, iconSize } from './constants.ts';
import { CelestialBody } from '../../lib/types.ts';
import { findCelestialBody } from '../../lib/utils.ts';

const bodies = [
  '1 Ceres',
  '2 Pallas',
  '3 Juno',
  '4 Vesta',
  '5 Astraea',
  '6 Hebe',
  '7 Iris',
  '8 Flora',
  '9 Metis',
  '10 Hygiea',
];
const treeData: TreeNodeData[] = [
  {
    label: '1-10',
    value: '1-10',
    children: bodies.map(name => ({ label: name, value: `1-10/${name}` })),
  },
];

export function AddBodyMenu({ systemState }: Pick<AppStateControlProps, 'systemState'>) {
  const tree = useTree();
  const selectedBodies = tree.checkedState.map(key => key.split('/')[1]);
  const smallBodyQueries = useSmallBodies(selectedBodies);
  const smallBodies: Array<CelestialBody> = smallBodyQueries.map(({ data }) => data).filter(v => v != null);

  useEffect(() => {
    smallBodies.forEach(body => {
      console.log(body);
      if (findCelestialBody(systemState, body.shortName ?? body.name) == null) {
        console.log('pushing', body.shortName ?? body.name);
        systemState.satellites.push(getInitialState(systemState, body));
      }
    });
  }, [JSON.stringify(smallBodies)]);

  /*
  const [search, setSearch] = useState('');

  const options = ['233 Mak', '111 Bennu'];
  const shouldFilterOptions = options.every(item => item !== search);
  const filteredOptions = shouldFilterOptions
    ? options.filter(item => item.toLowerCase().includes(search.toLowerCase().trim()))
    : options;
   */

  return (
    <Popover position="bottom-start" offset={0}>
      <Popover.Target>
        <ActionIcon>
          <IconSpherePlus size={iconSize} />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown p={8}>
        <Tree tree={tree} data={treeData} levelOffset={23} expandOnClick={false} renderNode={renderTreeNode} />
      </Popover.Dropdown>
    </Popover>
  );
}

function renderTreeNode({ node, expanded, hasChildren, elementProps, tree }: RenderTreeNodePayload) {
  const checked = tree.isNodeChecked(node.value);
  const indeterminate = tree.isNodeIndeterminate(node.value);

  function toggle() {
    if (!checked) {
      tree.checkNode(node.value);
    } else {
      tree.uncheckNode(node.value);
    }
  }

  function expand() {
    tree.toggleExpanded(node.value);
  }

  return (
    <Group gap="xs" py={2} {...elementProps}>
      <Checkbox.Indicator checked={checked} indeterminate={indeterminate} size={14} onClick={toggle} />

      <Group gap={4} onClick={hasChildren ? expand : toggle}>
        <Text size="xs">{node.label}</Text>

        {hasChildren && (
          <IconChevronDown size={14} style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        )}
      </Group>
    </Group>
  );
}

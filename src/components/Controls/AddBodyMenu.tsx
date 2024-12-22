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
import { iconSize } from './constants.ts';
import { CelestialBody, CelestialBodyState } from '../../lib/types.ts';
import { findCelestialBody, notNullish } from '../../lib/utils.ts';
import { UseQueryResult } from '@tanstack/react-query';

// TODO: load from data; full list is ~1.5M, should at least include a few thousand
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

type Props = {
  systemState: CelestialBodyState;
};
export function AddBodyMenu({ systemState }: Props) {
  const tree = useTree();
  const selectedBodies = tree.checkedState.map(key => key.split('/')[1]);
  const smallBodyQueries: Array<UseQueryResult<CelestialBody | null>> = useSmallBodies(selectedBodies);
  const smallBodies: Array<CelestialBody> = smallBodyQueries.map(({ data }) => data).filter(notNullish);

  useEffect(() => {
    smallBodies.forEach(body => {
      if (findCelestialBody(systemState, body.name) == null) {
        // TODO: directly adding to systemState is buggy and bad practice
        // TODO: initial state needs to take anomaly into account
        systemState.satellites.push(getInitialState(systemState, body));
      }
    });
  }, [JSON.stringify(smallBodies)]);

  // TODO: add search/filter box
  return (
    <Popover position="left-start" offset={0}>
      <Popover.Target>
        <ActionIcon>
          <IconSpherePlus size={iconSize} />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown p={8} miw={200}>
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
      <Checkbox.Indicator checked={checked} indeterminate={indeterminate} size="xs" onClick={toggle} />

      <Group gap={4} onClick={hasChildren ? expand : toggle}>
        <Text size="xs">{node.label}</Text>

        {hasChildren && (
          <IconChevronDown size={14} style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        )}
      </Group>
    </Group>
  );
}

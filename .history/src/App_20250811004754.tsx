import axios from 'axios';
import { useState } from 'react';
import { Button } from '@mantine/core';

import { createStore } from 'effector';

export const $counter = createStore(2);

$counter.watch((state) => {
  console.log('Counter changed:', state);
});

export const App = () => {
  const [count, setCount] = useState(0);

  console.log(count);

  const handleClick = () => {
    setCount((n) => n + 1);
  };

  return (
    <>
      <Button size="md" onClick={handleClick}>
        Click
      </Button>
    </>
  );
};

<Grid>
  {connectorData.map((source, index) => (
    <Grid.Col span={6} key={index}>
      <Card
        className={styles.sourceOption}
        withBorder
        onClick={() => handleSourceSelect(source.name)}
        style={{ cursor: 'pointer' }}
      >
        <Group>
          <img
            src={source.icon}
            alt={source.name}
            className={styles.iconImage}
          />
          <div>
            <Text fw={500} size="sm">
              {source.name}
            </Text>
            <Text size="xs" c="dimmed">
              Database system
            </Text>
          </div>
        </Group>
        <Group mt="xs" gap="xs">
          <Badge variant="outline" size="xs">
            Batch sync
          </Badge>
          <Badge variant="outline" size="xs">
            Media set sync
          </Badge>
          <Badge variant="outline" size="xs">
            Virtual tables
          </Badge>
        </Group>
      </Card>
    </Grid.Col>
  ))}
</Grid>;

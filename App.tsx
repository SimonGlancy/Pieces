import React from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AnimatedContainer } from './src';
import { useSelected, SelectTypeEnum } from './src/hooks';

const styles = StyleSheet.create({
  container: {
    paddingTop: 64,
    flex: 1,
    backgroundColor: '#fff',
  },
  item: { padding: 32, borderWidth: 2, borderColor: 'black' },
});

const data = [
  { id: 'apple', name: 'One' },
  { id: 'orange', name: 'Two' },
  { id: '3eeeeee', name: 'Three' },
  { id: '4777', name: 'Four' },
];

const data2 = ['One', 'Two', 'Three', 'Four'];

type Item = {
  id: string;
  name: string;
};

type SelectButtonProps = {
  item: Item;
  onPress: () => void;
  isSelected: boolean;
};

function SelectButton(props: SelectButtonProps) {
  const { item, onPress, isSelected } = props;
  return (
    <Pressable style={[styles.item]} onPress={onPress}>
      <AnimatedContainer active>
        <Text style={{ color: isSelected ? 'coral' : 'black' }}>
          {item.name}
        </Text>
      </AnimatedContainer>
    </Pressable>
  );
}

export default function App() {
  const { getIsSelected, toggle } = useSelected({
    data,
    selectType: SelectTypeEnum.BY_ID,
    getItemId: (item) => item.id,
  });

  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        return (
          <SelectButton
            key={item.id}
            onPress={() => toggle(item, index)}
            item={item}
            isSelected={getIsSelected(item, index)}
          />
        );
      })}
    </View>
  );
}

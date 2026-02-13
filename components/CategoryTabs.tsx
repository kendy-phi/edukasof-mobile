import { ScrollView, Pressable, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type Props = {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
};

export default function CategoryTabs({
  categories,
  selected,
  onSelect,
}: Props) {
  const { theme } = useTheme();

  return (
    <View style={{ marginBottom: 20 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {categories.map((cat) => {
          const isActive = cat === selected;

          return (
            <Pressable
              key={cat}
              onPress={() => onSelect(cat)}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 8,
                borderRadius: 999,
                marginRight: 10,
                backgroundColor: isActive
                  ? theme.primary
                  : theme.card,
                borderWidth: 1,
                borderColor: isActive
                  ? theme.primary
                  : theme.border,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: isActive
                    ? 'white'
                    : theme.text,
                }}
              >
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

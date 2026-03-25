import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

type Props = {
  question: any;
  selected: string | null;
  selectedOptions: string[];
  setSelected: (val: string | null) => void;
  setSelectedOptions: (val: string[]) => void;
  theme: any;
};

export default function QuestionCard({
  question,
  selected,
  selectedOptions,
  setSelected,
  setSelectedOptions,
  theme,
}: Props) {
  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '700',
          marginBottom: 20,
          color: theme.text,
        }}
      >
        {question.questionText}
      </Text>

      {/* MULTI_SELECT */}
      {question.type === 'MULTI_SELECT' && (
        <>
          <Text style={{ color: theme.text, marginBottom: 10 }}>
            (Vous pouvez sélectionner plusieurs réponses)
          </Text>

          {question.options?.map((option: string) => {
            const isSelected = selectedOptions.includes(option);

            return (
              <Pressable
                key={option}
                onPress={() => toggleOption(option)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 14,
                  borderRadius: 12,
                  marginBottom: 10,
                  backgroundColor: isSelected ? theme.primary : theme.card,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderWidth: 2,
                    borderColor: isSelected ? 'white' : theme.text,
                    marginRight: 10,
                    backgroundColor: isSelected ? 'white' : 'transparent',
                  }}
                />

                <Text
                  style={{
                    color: isSelected ? 'white' : theme.text,
                    flex: 1,
                  }}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </>
      )}

      {/* MCQ */}
      {question.type === 'MCQ' &&
        question.options?.map((option: string) => {
          const isSelected = selected === option;

          return (
            <Pressable
              key={option}
              onPress={() => setSelected(option)}
              style={{
                padding: 14,
                borderRadius: 12,
                marginBottom: 10,
                backgroundColor: isSelected ? theme.primary : theme.card,
              }}
            >
              <Text style={{ color: isSelected ? 'white' : theme.text }}>
                {option}
              </Text>
            </Pressable>
          );
        })}

      {/* TRUE/FALSE */}
      {question.type === 'TRUE_FALSE' &&
        ['True', 'False'].map((option) => (
          <Pressable
            key={option}
            onPress={() => setSelected(option)}
            style={{
              padding: 14,
              borderRadius: 12,
              marginBottom: 10,
              backgroundColor:
                selected === option ? theme.primary : theme.card,
            }}
          >
            <Text style={{ color: selected === option ? 'white' : theme.text }}>
              {option === 'True' ? 'VRAI' : 'FAUX'}
            </Text>
          </Pressable>
        ))}

      {/* SHORT ANSWER */}
      {question.type === 'SHORT_ANSWER' && (
        <TextInput
          value={selected ?? ''}
          onChangeText={setSelected}
          placeholder="Votre réponse..."
          placeholderTextColor={theme.text}
          style={{
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 12,
            padding: 14,
            color: theme.text,
          }}
        />
      )}
    </View>
  );
}
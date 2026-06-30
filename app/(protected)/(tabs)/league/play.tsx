import React, {
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';

import {
  useLeague,
} from '@/context/LeagueContext';

export default function PlayScreen() {
  const {
    currentQuestion,
  } = useLeague();

  console.log(`Current Question: `,currentQuestion);

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [shortAnswer, setShortAnswer] = useState('');

  const questionType =
    currentQuestion?.type ?? null;

  const questionOptions =
    currentQuestion?.options ?? [];

  const isMultiSelect =
    questionType === 'MULTI_SELECT';

  const isShortAnswer =
    questionType === 'SHORT_ANSWER';

  const canSubmit = useMemo(() => {
    if (!currentQuestion) {
      return false;
    }

    if (isShortAnswer) {
      return shortAnswer.trim().length > 0;
    }

    return selectedAnswers.length > 0;
  }, [
    currentQuestion,
    isShortAnswer,
    selectedAnswers,
    shortAnswer,
  ]);

  const toggleOption = (option: string) => {
    if (isMultiSelect) {
      setSelectedAnswers(prev =>
        prev.includes(option)
          ? prev.filter(item => item !== option)
          : [...prev, option],
      );
      return;
    }

    setSelectedAnswers([option]);
  };

  const handleSubmit = () => {
    if (!currentQuestion) {
      return;
    }

    let payload: string[] = [];

    if (isShortAnswer) {
      payload = [shortAnswer.trim()];
    } else {
      payload = selectedAnswers;
    }

    console.log(
      '[LEAGUE PLAY] submit answer =>',
      payload,
    );

    // on branchera submitAnswer ici juste après
    // submitAnswer({
    //   leagueId: currentLeague?._id,
    //   userId: user.id,
    //   questionId: currentQuestion._id,
    //   answer: payload,
    // });

    setSelectedAnswers([]);
    setShortAnswer('');
  };

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🎯</Text>
            <Text style={styles.emptyTitle}>
              En attente d’une question
            </Text>
            <Text style={styles.emptyText}>
              L’administrateur n’a pas encore lancé la prochaine question.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>
              LEAGUE QUIZ
            </Text>
            <Text style={styles.headerTitle}>
              Quiz en cours
            </Text>
          </View>

          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>
              En direct
            </Text>
          </View>
        </View>

        {/* Timer / status */}
        <View style={styles.metaRow}>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>
              Temps
            </Text>
            <Text style={styles.metaValue}>
              {currentQuestion?.timer ?? 30}s
            </Text>
          </View>

          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>
              Type
            </Text>
            <Text style={styles.metaValue}>
              {currentQuestion?.type ?? '-'}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Question card */}
          <View style={styles.questionCard}>
            <View style={styles.questionBadge}>
              <Text style={styles.questionBadgeText}>
                Question en cours
              </Text>
            </View>

            <Text style={styles.questionText}>
              {currentQuestion.questionText}
            </Text>

            {!!currentQuestion?.points && (
              <Text style={styles.pointsText}>
                {currentQuestion.points} point
                {currentQuestion.points > 1 ? 's' : ''}
              </Text>
            )}
          </View>

          {/* Answer block */}
          <View style={styles.answersSection}>
            <Text style={styles.answersTitle}>
              Votre réponse
            </Text>

            {!isShortAnswer ? (
              <View style={styles.optionsList}>
                {questionOptions.map((option, index) => {
                  const isSelected =
                    selectedAnswers.includes(option);

                  return (
                    <TouchableOpacity
                      key={`${option}-${index}`}
                      style={[
                        styles.optionCard,
                        isSelected && styles.optionCardSelected,
                      ]}
                      activeOpacity={0.9}
                      onPress={() => toggleOption(option)}
                    >
                      <View
                        style={[
                          styles.optionIndex,
                          isSelected && styles.optionIndexSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionIndexText,
                            isSelected &&
                              styles.optionIndexTextSelected,
                          ]}
                        >
                          {String.fromCharCode(65 + index)}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={styles.shortAnswerWrapper}>
                <TextInput
                  placeholder="Écrivez votre réponse..."
                  placeholderTextColor="#94A3B8"
                  value={shortAnswer}
                  onChangeText={setShortAnswer}
                  style={styles.shortAnswerInput}
                  multiline
                />
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer action */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              !canSubmit && styles.submitButtonDisabled,
            ]}
            activeOpacity={0.9}
            disabled={!canSubmit}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              Envoyer la réponse
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#0F172A',
    },

    container: {
      flex: 1,
      paddingHorizontal: 18,
      paddingTop: 12,
      paddingBottom: 18,
      backgroundColor: '#0F172A',
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 18,
    },

    headerEyebrow: {
      fontSize: 12,
      fontWeight: '700',
      color: '#38BDF8',
      letterSpacing: 1,
      marginBottom: 4,
    },

    headerTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: '#F8FAFC',
    },

    liveBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(239, 68, 68, 0.18)',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.35)',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
    },

    liveDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: '#EF4444',
      marginRight: 8,
    },

    liveText: {
      color: '#FCA5A5',
      fontSize: 13,
      fontWeight: '700',
    },

    metaRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 18,
    },

    metaCard: {
      flex: 1,
      backgroundColor: '#111C34',
      borderRadius: 18,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: 'rgba(148, 163, 184, 0.15)',
    },

    metaLabel: {
      color: '#94A3B8',
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 6,
    },

    metaValue: {
      color: '#F8FAFC',
      fontSize: 18,
      fontWeight: '800',
    },

    scrollContent: {
      paddingBottom: 24,
    },

    questionCard: {
      backgroundColor: '#172554',
      borderRadius: 24,
      padding: 20,
      marginBottom: 22,
      borderWidth: 1,
      borderColor: 'rgba(96, 165, 250, 0.25)',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      elevation: 5,
    },

    questionBadge: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(56, 189, 248, 0.16)',
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginBottom: 14,
    },

    questionBadgeText: {
      color: '#7DD3FC',
      fontSize: 12,
      fontWeight: '700',
    },

    questionText: {
      color: '#F8FAFC',
      fontSize: 24,
      lineHeight: 34,
      fontWeight: '800',
      marginBottom: 14,
    },

    pointsText: {
      color: '#BFDBFE',
      fontSize: 14,
      fontWeight: '600',
    },

    answersSection: {
      marginBottom: 16,
    },

    answersTitle: {
      color: '#F8FAFC',
      fontSize: 20,
      fontWeight: '800',
      marginBottom: 14,
    },

    optionsList: {
      gap: 12,
    },

    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#111C34',
      borderWidth: 1,
      borderColor: 'rgba(148, 163, 184, 0.15)',
      borderRadius: 18,
      padding: 16,
    },

    optionCardSelected: {
      backgroundColor: '#1D4ED8',
      borderColor: '#60A5FA',
    },

    optionIndex: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(148, 163, 184, 0.15)',
      marginRight: 14,
    },

    optionIndexSelected: {
      backgroundColor: '#DBEAFE',
    },

    optionIndexText: {
      color: '#CBD5E1',
      fontSize: 15,
      fontWeight: '800',
    },

    optionIndexTextSelected: {
      color: '#1D4ED8',
    },

    optionText: {
      flex: 1,
      color: '#F8FAFC',
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
    },

    optionTextSelected: {
      color: '#FFFFFF',
    },

    shortAnswerWrapper: {
      backgroundColor: '#111C34',
      borderWidth: 1,
      borderColor: 'rgba(148, 163, 184, 0.15)',
      borderRadius: 18,
      padding: 14,
    },

    shortAnswerInput: {
      minHeight: 120,
      color: '#F8FAFC',
      fontSize: 16,
      textAlignVertical: 'top',
    },

    footer: {
      paddingTop: 8,
    },

    submitButton: {
      backgroundColor: '#2563EB',
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      shadowColor: '#2563EB',
      shadowOpacity: 0.35,
      shadowRadius: 10,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      elevation: 6,
    },

    submitButtonDisabled: {
      opacity: 0.45,
    },

    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '800',
    },

    emptyContainer: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: '#0F172A',
    },

    emptyCard: {
      backgroundColor: '#111C34',
      borderRadius: 24,
      padding: 24,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(148, 163, 184, 0.15)',
    },

    emptyEmoji: {
      fontSize: 36,
      marginBottom: 14,
    },

    emptyTitle: {
      color: '#F8FAFC',
      fontSize: 22,
      fontWeight: '800',
      marginBottom: 10,
      textAlign: 'center',
    },

    emptyText: {
      color: '#94A3B8',
      fontSize: 15,
      lineHeight: 24,
      textAlign: 'center',
    },
  });
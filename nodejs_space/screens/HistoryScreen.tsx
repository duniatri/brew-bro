import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  ListRenderItem,
} from 'react-native';
import { Text, Surface, IconButton, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import { BrewSession } from '../types';
import { useBrewHistory } from '../contexts/BrewHistoryContext';
import { RoastBadge } from '../components/RoastBadge';
import { formatTime, formatDate } from '../utils/imageUtils';

export const HistoryScreen: React.FC = () => {
  const { history, isLoading, refreshHistory, deleteSession } = useBrewHistory();

  useFocusEffect(
    useCallback(() => {
      refreshHistory?.();
    }, [refreshHistory])
  );

  const handleDelete = (session: BrewSession) => {
    const sessionName = session?.beanName ?? 'this brew';
    Alert.alert(
      'Delete Brew',
      `Are you sure you want to delete "${sessionName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSession?.(session?.id ?? '');
            } catch (e) {
              Alert.alert('Error', 'Failed to delete. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderItem: ListRenderItem<BrewSession> = ({ item }) => {
    const session = item ?? {};
    return (
      <Surface style={styles.card} elevation={2}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="cafe" size={20} color={colors.primary} />
            <Text style={styles.beanName} numberOfLines={1}>
              {session?.beanName ?? 'Unknown Bean'}
            </Text>
          </View>
          <IconButton
            icon="delete-outline"
            iconColor={colors.error}
            size={20}
            onPress={() => handleDelete(item)}
            accessibilityLabel={`Delete ${session?.beanName ?? 'this brew'}`}
          />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <RoastBadge roastLevel={session?.roastLevel ?? 'Unknown'} size="small" />
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="thermometer-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>
                {session?.temperature?.celsius ?? 'N/A'}°C / {session?.temperature?.fahrenheit ?? 'N/A'}°F
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="timer-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>
                {formatTime(session?.brewTime ?? 0)}
              </Text>
            </View>
          </View>

          {session?.equipment && (
            <View style={styles.extraInfoRow}>
              <Ionicons name="construct-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.extraInfoText}>{session.equipment}</Text>
            </View>
          )}

          {session?.tasteNotes && (
            <View style={styles.tasteNotesRow}>
              <Ionicons name="chatbubble-ellipses-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.tasteNotesText} numberOfLines={3}>{session.tasteNotes}</Text>
            </View>
          )}

          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.disabled} />
            <Text style={styles.dateText}>
              {formatDate(session?.createdAt ?? '')}
            </Text>
          </View>
        </View>
      </Surface>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cafe-outline" size={80} color={colors.disabled} />
      <Text style={styles.emptyTitle}>No Brews Yet</Text>
      <Text style={styles.emptyText}>
        Your brew history will appear here after you complete and save a brewing session.
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={history ?? []}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id ?? Math.random().toString()}
        contentContainerStyle={[
          styles.listContent,
          (history?.length ?? 0) === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshHistory}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
        accessibilityLabel="Brew history list"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textSecondary,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  emptyListContent: {
    flex: 1,
  },
  card: {
    borderRadius: 16,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    paddingTop: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  beanName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  cardContent: {
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  extraInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  extraInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tasteNotesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    marginBottom: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
  },
  tasteNotesText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
    flex: 1,
    lineHeight: 18,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateText: {
    fontSize: 12,
    color: colors.disabled,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

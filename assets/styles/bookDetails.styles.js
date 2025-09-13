import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 20,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  username: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  bookImage: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginBottom: 20,
    backgroundColor: COLORS.border,
  },

  details: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 10,
    letterSpacing: 0.5,
  },

  info: {
    fontSize: 20,
    color: COLORS.textDark,
    marginBottom: 6,
    lineHeight: 22,
  },

  caption: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginVertical: 14,
    lineHeight: 24,
  },

  date: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'left',
  },
});




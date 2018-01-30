export const topicPrimaryStyle = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    color: '#555',
  },
  tab: {
    display: 'inline-block',
    marginRight: 10,
    padding: '0 6px',
    textAlign: 'center',
    fontSize: '12px',
    color: '#fff',
    backgroundColor: theme.palette.primary[500],
    borderRadius: 3,
  },
  top: {
    backgroundColor: theme.palette.accent[500],
  },
});

export const topicSecondaryStyle = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 3,
  },
  count: {
    marginRight: 20,
    textAlign: 'center',
  },
  userName: {
    marginRight: 20,
    color: '#9e9e9e',
  },
  reply: {
    color: theme.palette.accent[300],
  },
});

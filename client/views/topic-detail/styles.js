export const topicDetailStyle = theme => ({
  header: {
    padding: 20,
    borderBottom: '1px solid #dfdfdf',
    '& h3': {
      margin: 0,
    },
  },
  body: {
    padding: 20,
    '& img': {
      maxWidth: '100%',
    },
    '& ul, & ol': {
      paddingLeft: 30,
      '& li': {
        marginBottom: 7,
      },
    },
    '& a': {
      wordBreak: 'break-word',
    },
  },
  replyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 20px',
    color: '#fff',
    backgroundColor: theme.palette.primary[500],
  },
  replyBody: {
    padding: 20,
  },
  replies: {
    margin: '0 24px',
    marginBottom: 24,
  },
  notLoginButton: {
    padding: '20px 0',
    textAlign: 'center',
  },
  '@media screen and (max-width: 480px)': {
    replies: {
      margin: '0 10px',
      marginBottom: 24,
    },
  },
  replyEditor: {
    position: 'relative',
    padding: 24,
    borderBottom: '1px solid #dfdfdf',
    '& .CodeMirror': {
      height: 150,
      minHeight: 'auto',
      '& .CodeMirror-scroll': {
        minHeight: 'auto',
      },
    },
  },
  replyButton: {
    position: 'absolute',
    right: 40,
    bottom: 65,
    zIndex: 101,
    opacity: 0.1,
    transition: 'opacity .3s',
    '&:hover': {
      opacity: 1,
    },
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: 40,
  },
});

export const replyStyle = {
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    padding: 20,
    paddingBottom: 0,
    borderBottom: '1px solid #dfdfdf',
    boxSizing: 'border-box',
    '& a, & code': {
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
    },
  },
  left: {
    flex: '0 0 40px',
    marginRight: 20,
  },
  right: {
    flex: 1,
    width: 'calc(100% - 100px)',
    '& img': {
      display: 'block',
      maxWidth: '100%',
    },
  },
};

import { createMuiTheme } from '@material-ui/core/styles';

import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
  palette: {
    primary: {
        main: '#24c392',
        light:'#24c392',
    },
    secondary: green,
  },
});

export default theme; 
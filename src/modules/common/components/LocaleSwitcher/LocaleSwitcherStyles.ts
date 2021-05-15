import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export const useLocaleSwitcher = makeStyles<Theme>(theme => ({
  root: {
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 50,
    minWidth: 180,
    maxWidth: 200,
    height: 50,
  },
}));

import React from 'react';
import {
  Avatar as AvatarComponent,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Button } from 'modules/uiKit/Button';
import { t } from 'modules/i18n/utils/intl';
import { PencilIcon } from 'modules/common/components/Icons/PencilIcon';
import { useUploadAvatarFieldStyles } from '../../useUploadAvatarFieldStyles';

export interface IInitialBlock {
  avatar: string;
  value: any;
  input: JSX.Element;
  inputRef: any;
  handleReset: any;
}

export const InnerBlock = ({
  avatar,
  value,
  input,
  inputRef,
  handleReset,
}: IInitialBlock) => {
  const classes = useUploadAvatarFieldStyles();

  return (
    <div className={classes.innerBlock}>
      <div className={classes.avatarWrap}>
        <AvatarComponent src={avatar} className={classes.avatar} />

        <IconButton className={classes.editButton}>
          {input}
          <PencilIcon />
        </IconButton>
      </div>
      <div className={classes.content}>
        <div className={classes.text}>
          <Typography variant="body1" className={classes.innerBlockText}>
            {t('brand.create.avatar-accepts')}
          </Typography>
          <Typography variant="body1" className={classes.innerBlockText}>
            {t('brand.create.avatar-recommended-size')}
          </Typography>
        </div>
        <div className={classes.buttons}>
          <Button
            variant="outlined"
            rounded
            onClick={() => inputRef.current.click()}
            className={classes.button}
          >
            {t('upload-file-field.choose-file')}
          </Button>
          {value && (
            <Button
              variant="outlined"
              rounded
              onClick={handleReset}
              className={classes.button}
            >
              {t('upload-file-field.reset')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

import { Grid, Box } from '@mui/material';
import React from 'react';
import { myPalette } from '../../../theme';
import { isJSON } from '../../../utils/helper';

// Assuming Tag interface is defined somewhere
interface Tag {
  title: string;
  category: string;
  color: string;
}

interface TaskProps {
  tags?: string[];
}

const TaskTagsComponent: React.FC<TaskProps> = ({ tags }) => {
  const MAX_DISPLAY_TAGS = 10;

  return (
    <Grid container sx={{ display: 'flex', flexDirection: 'row', gap: 1, pr: '12px' }}>
      {tags?.slice(0, MAX_DISPLAY_TAGS).map((value, index) => {
        if (!isJSON(value)) {
          return (
            <Box key={index} sx={{ '&:hover': { textDecoration: 'underline' } }}>
              {value}
            </Box>
          );
        }

        const tag = JSON.parse(value) as Tag;
        return (
          <Grid
            item
            key={index}
            sx={{
              justifyContent: 'left',
              px: '6px',
              borderRadius: '3px',
              background: tag.color,
              width: 'fit-content',
              fontSize: '12px',
              border: `1px solid transparent`,
              transition: '.125s border ease-in-out',
              alignItems: 'center',
              '&:hover': {
                cursor: 'pointer',
                border: `1px solid ${myPalette[50]}`,
              },
            }}
          >
            {tag.title}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default TaskTagsComponent

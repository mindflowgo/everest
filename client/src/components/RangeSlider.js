import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});



export default function RangeSlider(props) {

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        {props.label}
      </Typography>
      <Slider
        value={props.sliderValue}
        onChange={props.onChangeFunction}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        min={0}
        max={20}
      />
    </div>
  );
}

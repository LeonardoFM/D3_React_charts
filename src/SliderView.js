import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
    root: {
      width: 300,
      padding: '20px'
    },
});

function valuetext(value) {
    return `${value}`;
}

const SliderView = (props) => {
    
    const classes = useStyles();
    const [value, setValue] = React.useState([0,1]);
    const [slider_max, setSliderMax] = React.useState(0);

    const handleChange = (event, newValue) => { setValue(newValue) }

    return (
        <div className={classes.root}>
            <Typography id="range-slider" gutterBottom>
                Time range
            </Typography>
            <Slider
                value={value}
                onChange={handleChange}
                max={1000}
                min={0}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                getAriaValueText={valuetext}
            />
        </div>
    );
}

export default SliderView;
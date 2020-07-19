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
    const time_window = props.time_window.split(",")
    
    console.log(time_window[0],time_window[1])

    // const time = timeParse("%d/%m/%Y");
    // a,v = time(time_window[0]), time(time_window[1])
    const [value, setValue] = React.useState([0,100]);
    const [slider_max, setSliderMax] = React.useState(100);

    const handleChange = (event, newValue) => {
        console.log(newValue)
        setValue(handleChange)
    }

    return (
        <div className={classes.root}>
            <Typography id="range-slider" gutterBottom>
                Time range
            </Typography>
            <Slider
                value={value}
                onChange={handleChange}
                max={slider_max}
                min={0}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                getAriaValueText={valuetext}
            />
        </div>
    );
}

export default SliderView;
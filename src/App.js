import React, { useState, useEffect } from 'react';
// import D3_transient from './D3_transient'
import D3_transient_stock from './D3_transient_stock'
// import SliderView from './SliderView';
import SMenu from './Menu';
import './App.css';
import SMenu2 from './Menu2';
// import D3_grid from './D3_grid';

function App() {

    const [y,setY] = useState("market_cap");
    const [selected, setSelected] = useState("bitcoin");
    const [time_window,setTimeWindow] = useState("12/05/2013,31/10/2017");
    // const [data, setData] = React.useState();

    // const handleDataLength = () =>{
    //     data[selected].length
    // }
    const handleSelected = (value) => { setSelected(value)}

    useEffect(()=>{
        console.log(y)
        },[y])


    const handleY = (value) => {setY(value)}
    // const handleTimeWindow = (event) => {setTimeWindow(event.target.value)}

    return (
    <div>
        {/* <D3_grid/> */}
        <SMenu handleSelected={handleSelected}/>
        <SMenu2 handleY={handleY}/>
        {/* <SliderView  time_window={time_window} handleTimeWindow={handleTimeWindow}/>         */}
        <D3_transient_stock selected={selected} value={y} time_window={time_window}/>
        {/* <D3_transient/> */}
    </div>   
    );
}

export default App;

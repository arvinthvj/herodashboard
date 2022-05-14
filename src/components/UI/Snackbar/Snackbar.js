import React, { useEffect } from 'react'
import './Snackbar.css'

const Snackbar = props => {

    useEffect(() => {
        var x = document.getElementById("snackbar")

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }, [])

    return (
        <div id="snackbar">{props.snackbarMsg}</div>
    )
}

export default Snackbar
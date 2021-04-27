import React from 'react'
import "./CalculatorUI.css"

export default function CalculatorUI({ getUserKey, formSubmit, display, allClear }) {
    const formatDisplay = (numStr) => {
        if (numStr === "ERROR" || numStr.includes("e")) return numStr
        const separated = numStr.split(".")
        let grouping = separated.length > 1 ? "." : ""
        for (let i = separated[0].length - 1, j = 1; i >= 0; i--, j++) {
            grouping = (!(j % 3) && !!i ? "," : "") + separated[0].charAt(i) + grouping
        }
        separated[0] = grouping
        return separated.join("")
    }
    const setupButtons = () => {
        const btnValues = "ci%/*-+=.1234567890"
        const btnIDs = ["clr", "inv", "prc", "div", "mul", "sub", "add", "equ", "dec", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "n0"]
        const btnText = [`${allClear ? "AC" : "C"}`, "+/-", "%", "/", "x", "-", "+", "=", ".", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
        return btnIDs.map((id, i) => <button onClick={getUserKey} value={btnValues.charAt(i)} className="calc-btn" id={`calc-${id}`} key={i}>{btnText[i]}</button>)
    }
    return (
        <div>
            <form className="calc" onSubmit={formSubmit}>
                <div id="calc-scr">{formatDisplay(display)}</div>
                {setupButtons()}
            </form>
        </div>
    )
}

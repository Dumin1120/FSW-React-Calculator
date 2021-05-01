import React from 'react'
import "./CalculatorUI.css"

export default function CalculatorUI({ getUserKey, formSubmit, userKey, display, history, recentNum, storedNum, currentOpr, storedOpr, allClear, stage }) {
    const formatDisplay = (numStr) => {
        if (numStr === "ERROR" || numStr.includes("e") || numStr.includes("Infinity")) return numStr
        const separated = numStr.split(".")
        const ignoreIndex = separated[0].charAt(0) === "-" ? 1 : 0
        if (separated[0].length <= ignoreIndex + 3) {
            return numStr
        }
        let grouping = separated.length > 1 ? "." : ""
        for (let i = separated[0].length - 1, j = 1; i >= 0; i--, j++) {
            grouping = (j % 3 === 0 && i > ignoreIndex ? "," : "") + separated[0].charAt(i) + grouping
        }
        separated[0] = grouping
        return separated.join("")
    }
    const showHistory = () => {
        if (userKey === "=") return history
        const convertToMathOperator = (operator) => {
            switch (operator) {
                case "/": return "÷"
                case "*": return "×"
                case "-": return "−"
                default : return "+"
            }
        }
        const currMathOpr = convertToMathOperator(currentOpr)
        const storMathOpr = convertToMathOperator(storedOpr)
        const operationArr = []
        switch (stage) {
            case 4:
                operationArr.push(recentNum, currMathOpr, display)
                break
            case 1:
            case 2:
            case 5:
            case 6:
                operationArr.push(display)
                break
            case 3:
            case 7:
                operationArr.push(display, currMathOpr)
                break
            case 8:
                operationArr.push(recentNum, storMathOpr, display, currMathOpr)
                break
            case 10:
                operationArr.push(storedNum, storMathOpr, display, currMathOpr)
                break
            case 9:
            case 11:
                operationArr.push(storedNum, storMathOpr, recentNum, currMathOpr, display)
                break
            default:
                break
        }
        return operationArr.join(" ")
    }
    return (
        <div className="calculator">
            <form className="calc-interface" onSubmit={formSubmit}>
                <div id="calc-scr">
                    <div className="calc-scr-display">
                        {showHistory()}
                    </div>
                    <div className="calc-scr-display">
                        {formatDisplay(display)}
                    </div>
                </div>
                <button onClick={getUserKey} value="c" id="calc-clr" className="calc-btn mem-btn" tabIndex="-1">{`${allClear ? "AC" : "CE"}`}</button>
                <button onClick={getUserKey} value="d" id="calc-del" className="calc-btn mem-btn" tabIndex="-1">⌫</button>
                <button onClick={getUserKey} value="=" id="calc-equ" className="calc-btn equ-btn" tabIndex="-1">=</button>
                <button onClick={getUserKey} value="i" id="calc-inv" className="calc-btn inv-btn" tabIndex="-1">+/-</button>
                <button onClick={getUserKey} value="." id="calc-dec" className="calc-btn dec-btn" tabIndex="-1">.</button>
                <button onClick={getUserKey} value="%" id="calc-prc" className="calc-btn prc-btn" tabIndex="-1">﹪</button>
                <button onClick={getUserKey} value="/" id="calc-div" className="calc-btn opr-btn" tabIndex="-1">÷</button>
                <button onClick={getUserKey} value="*" id="calc-mul" className="calc-btn opr-btn" tabIndex="-1">×</button>
                <button onClick={getUserKey} value="-" id="calc-sub" className="calc-btn opr-btn" tabIndex="-1">−</button>
                <button onClick={getUserKey} value="+" id="calc-add" className="calc-btn opr-btn" tabIndex="-1">+</button>
                <button onClick={getUserKey} value="1" id="calc-n1"  className="calc-btn num-btn" tabIndex="-1">1</button>
                <button onClick={getUserKey} value="2" id="calc-n2"  className="calc-btn num-btn" tabIndex="-1">2</button>
                <button onClick={getUserKey} value="3" id="calc-n3"  className="calc-btn num-btn" tabIndex="-1">3</button>
                <button onClick={getUserKey} value="4" id="calc-n4"  className="calc-btn num-btn" tabIndex="-1">4</button>
                <button onClick={getUserKey} value="5" id="calc-n5"  className="calc-btn num-btn" tabIndex="-1">5</button>
                <button onClick={getUserKey} value="6" id="calc-n6"  className="calc-btn num-btn" tabIndex="-1">6</button>
                <button onClick={getUserKey} value="7" id="calc-n7"  className="calc-btn num-btn" tabIndex="-1">7</button>
                <button onClick={getUserKey} value="8" id="calc-n8"  className="calc-btn num-btn" tabIndex="-1">8</button>
                <button onClick={getUserKey} value="9" id="calc-n9"  className="calc-btn num-btn" tabIndex="-1">9</button>
                <button onClick={getUserKey} value="0" id="calc-n0"  className="calc-btn num-btn" tabIndex="-1">0</button>
            </form>
        </div>
    )
}

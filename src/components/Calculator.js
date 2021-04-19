/*
    STAGE CODES:
    1 fresh start/reset  [press number]
    2 first digit of first number has registered, currentNum is set  [press operator]
    3 an operator has registered, waiting for new number input  [press number]
    4 first digit of second number has registered, storedNum is set, currentNum new value is set  [=]
    5 equal sign (=) has registed, a result is shown on screen  [press number]
    6 equal sign (=) has registed, first digit of new number has shown on screen  [press operator]
    7 a new operator has registered, number on screen has registered as new number currentNum, waiting for new number input
*/

import React, { Component } from 'react'
import CalculatorUI from "./CalculatorUI"

export default class Calculator extends Component {
    constructor() {
        super()
        this.state = {
            userKey: null,
            currentNum: "",
            storedNum: null,
            currentOpr: null,
            storedOpr: null,
            display: "0",
            stage: 1
        }
    }
    pressKeyAllClear = () => {
        this.setState({
            userKey: null,
            currentNum: "",
            storedNum: null,
            currentOpr: null,
            storedOpr: null,
            display: "0",
            stage: 1
        })
    }
    pressKeyNumber = () => {
        //STAGE CODES:
        //1 fresh start/reset  [press number]
        //2 first digit of first number has registered, currentNum is set (or "half-set")  [press operator]
        //3 an operator has registered, waiting for new number input  [press number]
        //4 first digit of second number has registered, storedNum is set, currentNum new value is set  [=]
        //5 equal sign (=) has registed, a result is shown on screen  [press number]
        //6 equal sign (=) has registed, first digit of new number has shown on screen  [press operator]
        //7 a new operator has registered, number on screen has registered as new number currentNum, waiting for new number input
        const setNum = (numString, newKey) => numString === "0" ? newKey : numString + newKey
        let { userKey, currentNum, display, stage } = this.state
        switch (stage) {
            case 1:
            case 2:
                currentNum = setNum(currentNum, userKey)
                this.setState({ currentNum, display: currentNum, stage: 2 })
                return
            case 3:
                this.setState({ currentNum: userKey, storedNum: currentNum, display: userKey, stage: 4 })
                return
            case 4:
                currentNum = setNum(currentNum, userKey)
                this.setState({ currentNum, display: currentNum })
                return
            case 5:
                this.setState({ display: userKey, stage: 6 })
                return
            case 6:
                display = setNum(display, userKey)
                this.setState({ display })
                return
            case 7:
                this.setState({ currentNum: userKey, storedNum: display, display: userKey, stage: 4 })
                return
            default:
                return
        }
    }
    pressKeyOperator = () => {
        const proceedCalculation = (oldOpr, newOpr) => {
            const operators = "*/"
            const oldOprPrec = operators.includes(oldOpr) ? 2 : 1
            const newOprPrec = operators.includes(newOpr) ? 2 : 1
            if (oldOprPrec >= newOprPrec) {
                return true
            }
            return false
        }
        const { userKey, currentOpr, display, stage } = this.state
        switch (stage) {
            case 1:
                this.setState({ currentNum: display, currentOpr: userKey, stage: 3 })
                return
            case 2:
            case 3:
                this.setState({ currentOpr: userKey, stage: 3 })
                return
            case 4:
                if(proceedCalculation(currentOpr, userKey)){
                    this.pressKeyEqual()
                    return
                }
                this.setState({ storedOpr: currentOpr, currentOpr: userKey, stage: 8 })
                return
            case 5:
                this.setState({ currentNum: display, currentOpr: userKey, stage: 3 })
                return
            case 6:
            case 7:
                this.setState({ currentOpr: userKey, stage: 7 })
                return
            default:
                return
        }
    }
    pressKeyEqual = () => {
        const getOperationResult = (firstNum, secondNum, operator) => {
            if(firstNum === "ERROR" || secondNum === "ERROR"){
                return "ERROR"
            }
            switch (operator) {
                case "+": return Number(firstNum) + Number(secondNum)
                case "-": return Number(firstNum) - Number(secondNum)
                case "*": return Number(firstNum) * Number(secondNum)
                case "/": return secondNum === "0" ? "ERROR" : Number(firstNum) / Number(secondNum)
                default : return
            }
        }
        const { userKey, currentNum, storedNum, currentOpr, display, stage } = this.state
        let result = null
        switch (stage) {
            case 1:
                return
            case 2:
                this.setState({ currentNum: "", display: currentNum, stage: 1 })
                return
            case 3:
            case 4:
                if(userKey !== "="){
                    result = getOperationResult(storedNum, currentNum, currentOpr)
                    this.setState({ currentNum: result, currentOpr: userKey, display: result, stage: 3 })
                    return
                }
                // eslint-disable-next-line
            case 5:
            case 6:
            case 7:
                const currentOprOperation = () => {
                    if (display === "ERROR") {
                        return "ERROR"
                    }
                    const firstNum = stage === 3 ? currentNum : stage === 4 ? storedNum : display
                    return getOperationResult(firstNum, currentNum, currentOpr)
                }
                const setStateFromResult = (result) => {
                    this.setState({
                        currentNum: stage === 7 ? display : currentNum,
                        display: result,
                        stage: 5
                    })
                }
                setStateFromResult(currentOprOperation())
                return
            default:
                return
        }
    }
    pressKeyInverse = () => {
        console.log("working on inverse")
    }
    pressKeyDecimal = () => {
        console.log("working on decimal")
    }
    pressKeyPercent = () => {
        console.log("working on percent")
    }
    getUserKey = (e) => {
        this.setState({ userKey: e.target.value })
    }
    formSubmit = (e) => {
        e.preventDefault()
        this.sendUserKey()
    }
    sendUserKey = () => {
        const { userKey } = this.state
        const others = "ci=.%"
        if (others.includes(userKey)) {
            switch (userKey) {
                case "c": return this.pressKeyAllClear()
                case "=": return this.pressKeyEqual()
                case "i": return this.pressKeyInverse()
                case ".": return this.pressKeyDecimal()
                case "%": return this.pressKeyPercent()
                default: return
            }
        }
        const operators = "+-*/"
        operators.includes(userKey) ? this.pressKeyOperator() : this.pressKeyNumber()
    }
    render() {
        return (
            <CalculatorUI
                getUserKey={this.getUserKey}
                formSubmit={this.formSubmit}
                display={this.state.display}
                stage={this.state.stage}
            />
        )
    }
}

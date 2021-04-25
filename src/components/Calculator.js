/*
    STAGE CODES:
     1  fresh start/reset  [press number]
     2  first digit of first number has registered to display  [press operator]
     3  an operator has registered, waiting for new number input  [press number]
     4  first digit of second number has registered, recentNum is set  [equal]
     5  equal sign (=) is used, a result is shown on screen  [press number]
     6  equal sign (=) is used, first digit of new number has shown on screen  [press operator]
     7  new operator has registered, recentNum is set, waiting for new number input
     8  second operator(higher precedence) has registered from stage 4 without "=", first number storedNum is on hold, waiting for new number input
     9  first digit of third number (display) has registered and shown on screen, storedNum is still on hold
    10  new second operator(higher precedence) has registered from stage 9 without "=", storedNum is still on hold, result is stored and waiting for new number input
    11  first digit of new third number (display) has registered and shown on screen
*/

import React, { Component } from 'react'
import CalculatorUI from "./CalculatorUI"

export default class Calculator extends Component {
    constructor() {
        super()
        this.state = {
            userKey: null,
            display: "0",
            recentNum: null,
            storedNum: null,
            currentOpr: null,
            storedOpr: null,
            resetDisplay: false,
            allClear: true,
            stage: 1
        }
    }
    pressKeyAllClear = () => {
        this.setState({
            userKey: null,
            display: "0",
            recentNum: null,
            storedNum: null,
            currentOpr: null,
            storedOpr: null,
            resetDisplay: false,
            allClear: true,
            stage: 1
        })
    }
    pressKeyNumber = () => {
        const setNum = (numString, newKey) => numString === "0" ? newKey : numString + newKey
        const { userKey, display, recentNum, resetDisplay, stage } = this.state
        const result = setNum(display, userKey)
        switch (stage) {
            case 1:
                if (resetDisplay) {
                    this.setState({ display: userKey, resetDisplay: false, stage: 2 })
                    return
                }
            // eslint-disable-next-line
            case 2:
                this.setState({ display: result, allClear: false, stage: 2 })
                return
            case 5:
                this.setState({ display: userKey, stage: 6 })
                return
            case 3:
            case 7:
                this.setState({ display: userKey, recentNum: display, stage: 4 })
                return
            case 8:
                this.setState({ display: userKey, recentNum: display, storedNum: recentNum, stage: 9 })
                return
            case 10:
                this.setState({ display: userKey, recentNum: display, stage: 11 })
                return
            case 4:
            case 6:
            case 9:
            case 11:
                this.setState({ display: result })
                return
            default:
                return
        }
    }
    pressKeyOperator = () => {
        const proceedCalculation = (oprOne, oprTwo) => {
            const operators = "*/"
            const oprOnePrec = operators.includes(oprOne) ? 2 : 1
            const oprTwoPrec = operators.includes(oprTwo) ? 2 : 1
            return oprOnePrec >= oprTwoPrec
        }
        const { userKey, currentOpr, storedOpr, stage } = this.state
        switch (stage) {
            case 1:
                this.setState({ currentOpr: userKey, resetDisplay: false, allClear: false, stage: 3 })
                return
            case 4:
                if (proceedCalculation(currentOpr, userKey)) {
                    this.pressKeyEqual()
                    return
                }
                this.setState({ currentOpr: userKey, storedOpr: currentOpr, stage: 8 })
                return
            case 2:
            case 3:
            case 5:
                this.setState({ currentOpr: userKey, stage: 3 })
                return
            case 6:
            case 7:
                this.setState({ currentOpr: userKey, stage: 7 })
                return
            case 8:
            case 10:
                if (proceedCalculation(storedOpr, userKey)) {
                    this.pressKeyEqual()
                    return
                }
                this.setState({ currentOpr: userKey })
                return
            case 9:
            case 11:
                this.pressKeyEqual()
                return
            default:
                return
        }
    }
    pressKeyEqual = () => {
        const operationResult = (firstNum, secondNum, operator) => {
            if (firstNum === "ERROR" || secondNum === "ERROR") {
                return "ERROR"
            }
            switch (operator) {
                case "+": return Number(firstNum) + Number(secondNum)
                case "-": return Number(firstNum) - Number(secondNum)
                case "*": return Number(firstNum) * Number(secondNum)
                case "/": return Number(secondNum) === 0 ? "ERROR" : Number(firstNum) / Number(secondNum)
                default : return
            }
        }
        const { userKey, display, recentNum, storedNum, currentOpr, storedOpr, stage } = this.state
        let result = null
        switch (stage) {
            case 1:
                return
            case 2:
                this.setState({ resetDisplay: true, allClear: false, stage: 1 })
                return
            case 5:
            case 6:
                result = operationResult(display, recentNum, currentOpr)
                this.setState({ display: result, stage: 5 })
                return
            case 3:
            case 7:
                result = stage === 3 ? operationResult(display, display, currentOpr)
                                     : operationResult(display, recentNum, currentOpr)
                this.setState({ display: result, recentNum: display, stage: 5 })
                return
            case 4:
            case 8:
            case 10:
                result = stage === 4 ? operationResult(recentNum, display, currentOpr)
                       : stage === 8 ? operationResult(recentNum, display, storedOpr)
                                     : operationResult(storedNum, display, storedOpr)
                if (userKey !== "=") {
                    if (stage === 4) {
                        this.setState({ display: result, recentNum: result, currentOpr: userKey, stage: 3 })
                        return
                    }
                    this.setState({ display: result, recentNum: display, currentOpr: userKey, stage: 3 })
                    return
                }
                this.setState({ display: result, recentNum: display, stage: 5 })
                return
            case 9:
            case 11:
                result = operationResult(recentNum, display, currentOpr)
                if (("*/").includes(userKey)) {
                    this.setState({ display: result, recentNum: result, currentOpr: userKey, stage: 10 })
                    return
                }
                result = operationResult(storedNum, result, storedOpr)
                if (("+-").includes(userKey)) {
                    this.setState({ display: result, recentNum: result, currentOpr: userKey, stage: 3 })
                    return
                }
                this.setState({ display: result, recentNum: display, stage: 5 })
                return
            default:
                return
        }
    }
    pressKeyInverse = () => {
        const inverseNum = (numString) => {
            if (numString === "ERROR" || Number(numString) === 0) {
                return numString
            }
            return -numString
        }
        const { display, resetDisplay, stage } = this.state
        const result = inverseNum(display)
        switch (stage) {
            case 1:
                if (resetDisplay) {
                    this.setState({ display: result, resetDisplay: false, stage: 2 })
                    return
                }
                return
            default:
                this.setState({ display: result })
                return
        }
    }
    pressKeyDecimal = () => {
        const addDecimalPoint = (numString) => {
            if (numString === "ERROR" || numString.toString().includes(".")) {
                return numString
            }
            return numString.toString() + "."
        }
        const { display, recentNum, stage } = this.state
        const addZeroStages = [ 1, 5, 3, 7, 8, 10 ]
        const result = addDecimalPoint( addZeroStages.includes(stage) ? "0" : display )
        switch (stage) {
            case 1:
                this.setState({ display: result, resetDisplay: false, allClear: false, stage: 2 })
                return
            case 2:
                this.setState({ display: result, stage: 2 })
                return
            case 5:
                this.setState({ display: result, stage: 6 })
                return
            case 3:
            case 7:
                this.setState({ display: result, recentNum: display, stage: 4 })
                return
            case 8:
                this.setState({ display: result, recentNum: display, storedNum: recentNum, stage: 9 })
                return
            case 10:
                this.setState({ display: result, recentNum: display, stage: 11 })
                return
            case 4:
            case 6:
            case 9:
            case 11:
                this.setState({ display: result })
                return
            default:
                return
        }
    }
    pressKeyPercent = () => {
        const applyPercentage = (numString) => {
            if (numString === "ERROR") {
                return numString
            }
            return Number(numString) / 100
        }
        const { display, recentNum, resetDisplay, stage } = this.state
        const result = applyPercentage(display)
        switch (stage) {
            case 1:
                if (resetDisplay) {
                    this.setState({ display: result, resetDisplay: false, stage: 2 })
                    return
                }
                return
            case 5:
            case 6:
                this.setState({ display: result, stage: 6 })
                return
            case 3:
            case 7:
                this.setState({ display: result, recentNum: display, stage: 4 })
                return
            case 8:
                this.setState({ display: result, recentNum: display, storedNum: recentNum, stage: 9 })
                return
            case 10:
                this.setState({ display: result, recentNum: display, stage: 11 })
                return
            case 2:
            case 4:
            case 9:
            case 11:
                this.setState({ display: result })
                return
            default:
                return
        }
    }
    getUserKey = (e) => {
        const { userKey } = this.state
        this.setState({ userKey: e.target.value, previousKey: userKey })
    }
    formSubmit = (e) => {
        e.preventDefault()
        this.sendUserKey()
    }
    sendUserKey = () => {
        const { userKey } = this.state
        console.log(userKey)    // don't forget to remove --------------==============
        const others = "ci=.%"
        if (others.includes(userKey)) {
            switch (userKey) {
                case "c": return this.pressKeyAllClear()
                case "=": return this.pressKeyEqual()
                case "i": return this.pressKeyInverse()
                case ".": return this.pressKeyDecimal()
                case "%": return this.pressKeyPercent()
                default : return
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
                allClear={this.state.allClear}
            />
        )
    }
}

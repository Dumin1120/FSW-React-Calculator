/*
    STAGE CODES:
     1  fresh start/reset
        []
     2  first digit of first number has registered to display
        [ 1 ]
     3  an operator has registered, waiting for new number input
        [ 1 + ]
     4  first digit of second number has registered, recentNum is set
        [ 1 + 2 ]
     5  equal sign (=) is used, a result is shown on screen
        [ 1 + 2 = ]
     6  equal sign (=) is used, first digit of new number has shown on screen
        [ 1 + 2 = 4 ]
     7  new operator has registered, waiting for new number input
        [ 1 + 2 = 4 + ]
     8  second operator(higher precedence) has registered from stage 4 without "=",
        waiting for new number input
        [ 1 + 2 * ]
     9  first digit of third number (display) has registered and shown on screen,
        first number storedNum is on hold
        [ 1 + 2 * 4 ]
    10  new second operator(higher precedence) has registered from stage 9 without "=",
        storedNum is still on hold, result is stored and shown, waiting for new number input
        [ 1 + 2 * 4 / ] => [ 1 + 8 / ]
    11  first digit of new third number (display) has registered and shown on screen
        [ 1 + 2 * 4 / 5 ] => [ 1 + 8 / 5 ]
*/

import React, { Component } from 'react'
import CalculatorUI from "./CalculatorUI"

const cleanTrailingZeros = (numStr) => {
    if (numStr === "ERROR" || numStr.includes("e") || !numStr.includes(".")) return numStr
    const numArr = numStr.split("")
    while (("0.").includes(numArr[numArr.length - 1])) {
        if (numArr.pop() === ".") break
    }
    return numArr.join("")
}
const getDecimalDigitLength = (numStr) => {
    if (numStr.includes("e+")) return 0
    if (numStr.includes("e-")) {
        const expLength = Math.abs(numStr.split("e")[1])
        if (!numStr.includes(".")) return expLength
        const decLength = numStr.split(".")[1].split("e")[0].length
        return decLength + expLength
    }
    if (numStr.includes(".")) return numStr.split(".")[1].length
    return 0
}
const calculateResult = (numOne, numTwo, operator) => {
    if (numOne === "ERROR" || numTwo === "ERROR") return "ERROR"
    if (isNaN(numOne) || isNaN(numTwo)) return "NaN"
    const lengthOne = getDecimalDigitLength(numOne)
    const lengthTwo = getDecimalDigitLength(numTwo)
    const maxLength = Math.max(lengthOne, lengthTwo)
    switch (operator) {
        case "+": return Number((Number(numOne) + Number(numTwo)).toFixed(maxLength)).toString()
        case "-": return Number((Number(numOne) - Number(numTwo)).toFixed(maxLength)).toString()
        case "*": return Number((Number(numOne) * Number(numTwo)).toFixed(lengthOne + lengthTwo)).toString()
        case "/":
            if (!Number(numTwo)) return "ERROR"
            const result = (Number(numOne) / Number(numTwo)).toString()
            let numStr = result.includes("e") ? result.split("e")[0] : result
            const decimalLength = numStr.includes(".") ? numStr.split(".")[1].length : 0
            if (decimalLength < 10 ) return result
            const lastSecondDigit = numStr.charAt(numStr.length - 2)
            const lastThirdDigit = numStr.charAt(numStr.length - 3)
            const lastTwoDigitsRemoved = numStr.slice(0, numStr.length - 2)
            const addingExtra = (0).toFixed(decimalLength - 3) + 1
            const extraOpr = numStr[0] === "-" ? "-" : "+"
            numStr = lastSecondDigit === "0" && lastThirdDigit === "0" ? Number(lastTwoDigitsRemoved).toString()
                   : lastSecondDigit === "9" && lastThirdDigit === "9" ? calculateResult(lastTwoDigitsRemoved, addingExtra, extraOpr)
                                                                       : numStr
            return numStr + (result.includes("e") ? result.slice(result.search("e")) : "")
        default : return
    }
}

export default class Calculator extends Component {
    constructor() {
        super()
        this.state = {
            userKey: null,
            display: "0",
            history: "",
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
            history: "",
            recentNum: null,
            storedNum: null,
            currentOpr: null,
            storedOpr: null,
            resetDisplay: false,
            allClear: true,
            stage: 1
        })
    }
    pressKeyDelete = () => {
        const errorCheck = (numStr) => numStr === "ERROR" || numStr.includes("e") || numStr.includes("Infinity") || isNaN(numStr)
        const deleteLastDigit = (numStr) => {
            if (errorCheck(numStr)) return numStr
            if (numStr.length === 1 || (numStr.length === 2 && numStr.charAt(0) === "-") || numStr === "-0.") return "0"
            return numStr.slice(0, numStr.length - 1)
        }
        const { display, resetDisplay, stage } = this.state
        const result = deleteLastDigit(display)
        switch (stage) {
            case 1:
                if (!resetDisplay) return
                this.setState({ display: result, resetDisplay: false, stage: 2 })
                return
            case 5:
                const stageNum = errorCheck(result) ? 5 : 6
                this.setState({ display: result, stage: stageNum })
                return
            case 3:
            case 7:
            case 8:
            case 10:
                return
            case 2:
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
    pressKeyNumber = () => {
        const setNum = (numStr, newKey) => numStr === "0" ? newKey : numStr + newKey
        const { userKey, display, recentNum, resetDisplay, stage } = this.state
        const result = setNum(display, userKey)
        switch (stage) {
            case 1:
                if (resetDisplay) return this.setState({ display: userKey, resetDisplay: false, stage: 2 })
                // eslint-disable-next-line
            case 2:
                this.setState({ display: result, allClear: false, stage: 2 })
                return
            case 5:
                this.setState({ display: userKey, stage: 6 })
                return
            case 8:
                this.setState({ display: userKey, recentNum: display, storedNum: recentNum, stage: 9 })
                return
            case 3:
            case 7:
            case 10:
                const stageNum = stage === 10 ? 11 : 4
                this.setState({ display: userKey, recentNum: display, stage: stageNum })
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
        const { userKey, display, currentOpr, storedOpr, stage } = this.state
        const result = cleanTrailingZeros(display)
        switch (stage) {
            case 1:
                this.setState({ display: result, currentOpr: userKey, resetDisplay: false, allClear: false, stage: 3 })
                return
            case 4:
                if (proceedCalculation(currentOpr, userKey)) return this.pressKeyEqual()
                this.setState({ display: result, currentOpr: userKey, storedOpr: currentOpr, stage: 8 })
                return
            case 2:
            case 3:
            case 5:
            case 6:
            case 7:
                const stageNum = ([6, 7]).includes(stage) ? 7 : 3
                this.setState({ display: result, currentOpr: userKey, stage: stageNum })
                return
            case 8:
            case 10:
                if (proceedCalculation(storedOpr, userKey)) return this.pressKeyEqual()
                this.setState({ display: result, currentOpr: userKey })
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
        const { userKey, display, recentNum, storedNum, currentOpr, storedOpr, stage } = this.state
        let result = null
        switch (stage) {
            case 1:
                return
            case 2:
                result = cleanTrailingZeros(display)
                this.setState({ display: result, resetDisplay: true, allClear: false, stage: 1 })
                return
            case 5:
            case 6:
                result = calculateResult(display, recentNum, currentOpr)
                this.setState({ display: result, stage: 5 })
                return
            case 3:
            case 7:
                result = stage === 3 ? calculateResult(display, display, currentOpr)
                                     : calculateResult(display, recentNum, currentOpr)
                this.setState({ display: result, recentNum: display, stage: 5 })
                return
            case 4:
            case 8:
            case 10:
                result = stage === 4 ? calculateResult(recentNum, display, currentOpr)
                       : stage === 8 ? calculateResult(recentNum, display, storedOpr)
                                     : calculateResult(storedNum, display, storedOpr)
                if (userKey === "=") {
                    this.setState({ display: result, recentNum: display, stage: 5 })
                    return
                }
                const recentVal = stage === 4 ? result : display
                this.setState({ display: result, recentNum: recentVal, currentOpr: userKey, stage: 3 })
                return
            case 9:
            case 11:
                result = calculateResult(recentNum, display, currentOpr)
                if (("*/").includes(userKey)) {
                    this.setState({ display: result, recentNum: result, currentOpr: userKey, stage: 10 })
                    return
                }
                result = calculateResult(storedNum, result, storedOpr)
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
        const inverseNum = (numStr) => {
            if (numStr === "ERROR" || !Number(numStr)) return numStr
            return (-numStr).toString()
        }
        const { display, resetDisplay, stage } = this.state
        const result = inverseNum(display)
        switch (stage) {
            case 1:
                if (!resetDisplay) return
                this.setState({ display: result, resetDisplay: false, stage: 2 })
                return
            default:
                this.setState({ display: result })
                return
        }
    }
    pressKeyDecimal = () => {
        const addDecimalPoint = (numStr) => {
            if (numStr.includes(".")) return numStr
            return numStr + "."
        }
        const { display, recentNum, stage } = this.state
        const fillZeroStages = [ 1, 5, 3, 7, 8, 10 ]
        const result = addDecimalPoint(fillZeroStages.includes(stage) ? "0" : display)
        switch (stage) {
            case 1:
                this.setState({ display: result, resetDisplay: false, allClear: false, stage: 2 })
                return
            case 5:
                this.setState({ display: result, stage: 6 })
                return
            case 8:
                this.setState({ display: result, recentNum: display, storedNum: recentNum, stage: 9 })
                return
            case 3:
            case 7:
            case 10:
                const stageNum = stage === 10 ? 11 : 4
                this.setState({ display: result, recentNum: display, stage: stageNum })
                return
            case 2:
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
        const errorCheck = (numStr) => numStr === "ERROR" || numStr.includes("Infinity") || isNaN(numStr)
        const applyPercentage = (numStr) => errorCheck(numStr) ? numStr : calculateResult(numStr, "0.01", "*")
        const { display, recentNum, resetDisplay, stage } = this.state
        const result = applyPercentage(display)
        switch (stage) {
            case 1:
                if (!resetDisplay) return
                this.setState({ display: result, resetDisplay: false, stage: 2 })
                return
            case 5:
                const stageNum = errorCheck(result) ? 5 : 6
                this.setState({ display: result, stage: stageNum })
                return
            case 8:
                this.setState({ display: result, recentNum: display, storedNum: recentNum, stage: 9 })
                return
            case 3:
            case 7:
            case 10:
                const stageNumber = stage === 10 ? 11 : 4
                this.setState({ display: result, recentNum: display, stage: stageNumber })
                return
            case 2:
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
    getUserKey = (e) => {
        this.setState({ userKey: e.target.value })
    }
    formSubmit = (e) => {
        e.preventDefault()
        this.sendUserKey()
    }
    sendUserKey = () => {
        const { userKey } = this.state
        if (userKey === "=") this.equalSignHistory()
        const others = "cdi=.%"
        if (!others.includes(userKey)) return ("+-*/").includes(userKey) ? this.pressKeyOperator() : this.pressKeyNumber()
        switch (userKey) {
            case "c": return this.pressKeyAllClear()
            case "d": return this.pressKeyDelete()
            case "=": return this.pressKeyEqual()
            case "i": return this.pressKeyInverse()
            case ".": return this.pressKeyDecimal()
            case "%": return this.pressKeyPercent()
            default : return
        }
    }
    equalSignHistory = () => {
        const convertToMathOperator = (operator) => {
            switch (operator) {
                case "/": return "÷"
                case "*": return "×"
                case "-": return "−"
                default : return "+"
            }
        }
        const { display, recentNum, storedNum, currentOpr, storedOpr, stage } = this.state
        const result = cleanTrailingZeros(display)
        const currMathOpr = convertToMathOperator(currentOpr)
        const storMathOpr = convertToMathOperator(storedOpr)
        const operationArr = []
        switch (stage) {
            case 1:
            case 2:
                operationArr.push(result)
                break
            case 3:
                operationArr.push(result, currMathOpr, result)
                break
            case 4:
                operationArr.push(recentNum, currMathOpr, result)
                break
            case 5:
            case 6:
            case 7:
                operationArr.push(result, currMathOpr, recentNum)
                break
            case 8:
                operationArr.push(recentNum, storMathOpr, result, currMathOpr)
                break
            case 10:
                operationArr.push(storedNum, storMathOpr, result, currMathOpr)
                break
            case 9:
            case 11:
                operationArr.push(storedNum, storMathOpr, recentNum, currMathOpr, result)
                break
            default:
                break
        }
        this.setState({ history: operationArr.join(" ") + " =" })
    }
    render() {
        return (
            <CalculatorUI
                getUserKey={this.getUserKey}
                formSubmit={this.formSubmit}
                {...this.state}
            />
        )
    }
}
